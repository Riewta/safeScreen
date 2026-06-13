"use client";

import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Plus, Trash2, Building2, User, Pencil, ChevronDown, FileText } from "lucide-react";
import { useUIStore } from "@/stores/ui.store";
import { useTaxInvoiceStore, TaxInvoiceData } from "@/stores/taxInvoice.store";
import { FormField, inputCls } from "@/components/ui/FormField";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { getProvinces, getAmphoes, getDistricts, getZipcode } from "@/lib/thai-address";
import { cn } from "@/lib/utils";

function SelectTrigger({ placeholder, value, error, disabled, onClick }: {
  placeholder?: string; value?: string; error?: string; disabled?: boolean; onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "w-full h-12 px-4 pr-10 text-[13px] font-normal border rounded-2xl outline-none transition-all bg-white flex items-center justify-between text-left shadow-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer relative",
        !value ? "text-[var(--km-text-muted)]" : "text-[var(--km-text)]",
        error ? "border-[var(--km-error)]" : "border-[var(--km-border)]"
      )}
    >
      <span className="truncate">{value || placeholder}</span>
      <ChevronDown size={15} className="text-[var(--km-text-muted)] flex-shrink-0 absolute right-4 top-1/2 -translate-y-1/2" />
    </button>
  );
}

type TaxType = "individual" | "corporate";

const EMPTY_FORM = {
  type:          "individual" as TaxType,
  firstName:     "",
  lastName:      "",
  companyName:   "",
  isHeadOffice:  true,
  email:         "",
  phone:         "",
  taxId:         "",
  address:       "",
  postalCode:    "",
  isDefault:     false,
};

type FormData = typeof EMPTY_FORM;

export function TaxInvoiceClient({ accountMode = false }: { accountMode?: boolean }) {
  const router = useRouter();
  const { profiles, selectedId, addProfile, updateProfile, selectProfile, deleteProfile } = useTaxInvoiceStore();

  const setHeaderLocked        = useUIStore((s) => s.setHeaderLocked);
  const setHeaderTitleOverride = useUIStore((s) => s.setHeaderTitleOverride);
  const setHeaderBackOverride  = useUIStore((s) => s.setHeaderBackOverride);

  type View = "list" | "add" | "edit";
  const searchParams = useSearchParams();
  const [view, setView]           = useState<View>(searchParams.get("add") === "true" ? "add" : "list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  // Form State
  const [form, setForm]     = useState<FormData>(EMPTY_FORM);
  const [initialForm, setInitialForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData | "subDistrict" | "district", string>>>({});

  // Local Address state
  const [streetAddress, setStreetAddress] = useState("");
  const [province, setProvince] = useState("กรุงเทพมหานคร");
  const [subDistrict, setSubDistrict] = useState("");
  const [district, setDistrict] = useState("");

  const [initialStreet, setInitialStreet] = useState("");
  const [initialProvince, setInitialProvince] = useState("กรุงเทพมหานคร");
  const [initialSubDistrict, setInitialSubDistrict] = useState("");
  const [initialDistrict, setInitialDistrict] = useState("");

  // Bottom sheet selector state
  const [activeSelector, setActiveSelector] = useState<{
    type: "province" | "subDistrict" | "district" | "postalCode" | null;
    title: string;
    searchTerm: string;
  }>({ type: null, title: "", searchTerm: "" });

  const provinces = useMemo(() => getProvinces(), []);
  const amphoes = useMemo(() => getAmphoes(province), [province]);
  const districts = useMemo(() => getDistricts(province, subDistrict), [province, subDistrict]);

  const filteredOptions = useMemo(() => {
    const search = activeSelector.searchTerm.trim().toLowerCase();
    let rawList: string[] = [];
    if (activeSelector.type === "province") rawList = provinces;
    else if (activeSelector.type === "subDistrict") rawList = amphoes;
    else if (activeSelector.type === "district") rawList = districts;
    else if (activeSelector.type === "postalCode") {
      const zip = getZipcode(province, subDistrict, district);
      if (zip) rawList = [zip];
    }
    return rawList.filter((item) => item.toLowerCase().includes(search));
  }, [activeSelector, provinces, amphoes, districts, province, subDistrict, district]);

  const openSelector = (type: "province" | "subDistrict" | "district" | "postalCode") => {
    const titles = { province: "เลือกจังหวัด", subDistrict: "เลือกเขต / อำเภอ", district: "เลือกแขวง / ตำบล", postalCode: "เลือกรหัสไปรษณีย์" };
    setActiveSelector({ type, title: titles[type], searchTerm: "" });
  };

  const closeSelector = () => setActiveSelector({ type: null, title: "", searchTerm: "" });

  const selectProvince = (val: string) => {
    setProvince(val);
    setSubDistrict("");
    setDistrict("");
    setForm((f) => ({ ...f, postalCode: "" }));
    closeSelector();
    setTimeout(() => openSelector("subDistrict"), 300);
  };

  const selectAmphoe = (val: string) => {
    setSubDistrict(val);
    setDistrict("");
    setForm((f) => ({ ...f, postalCode: "" }));
    closeSelector();
    setTimeout(() => openSelector("district"), 300);
  };

  const selectDistrict = (val: string) => {
    setDistrict(val);
    const zip = getZipcode(province, subDistrict, val);
    if (zip) setForm((f) => ({ ...f, postalCode: zip }));
    closeSelector();
    if (!zip) setTimeout(() => openSelector("postalCode"), 300);
  };

  const selectPostalCode = (val: string) => {
    setForm((f) => ({ ...f, postalCode: val }));
    closeSelector();
  };

  // Synchronize view state when profiles are hydrated/loaded from Zustand persist store
  useEffect(() => {
    if (profiles.length > 0 && view === "add" && editingId === null && isDirty === false && searchParams.get("add") !== "true") {
      setView("list");
    }
  }, [profiles, view, editingId]);

  const isAddressDirty =
    streetAddress !== initialStreet ||
    province !== initialProvince ||
    subDistrict !== initialSubDistrict ||
    district !== initialDistrict;

  const isFormDirty = JSON.stringify(form) !== JSON.stringify(initialForm);
  const isDirty = isFormDirty || isAddressDirty;

  useEffect(() => {
    setHeaderLocked(true);
    return () => setHeaderLocked(false);
  }, [setHeaderLocked]);

  useEffect(() => {
    const handleBack = () => {
      if (isDirty) {
        setConfirmDiscard(true);
      } else {
        goBackToList();
      }
    };

    if (view === "add") {
      setHeaderTitleOverride("เพิ่มข้อมูลใบกำกับภาษี");
      setHeaderBackOverride(handleBack);
    } else if (view === "edit") {
      setHeaderTitleOverride("แก้ไขข้อมูลใบกำกับภาษี");
      setHeaderBackOverride(handleBack);
    } else {
      setHeaderTitleOverride(null);
      setHeaderBackOverride(null);
    }
    return () => {
      setHeaderTitleOverride(null);
      setHeaderBackOverride(null);
    };
  }, [view, isDirty, setHeaderTitleOverride, setHeaderBackOverride]);

  const set = (k: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

   const validate = () => {
    const e: typeof errors = {};
    if (form.type === "individual") {
      if (!form.firstName.trim()) e.firstName = "กรุณากรอกชื่อ";
      if (!form.lastName.trim())  e.lastName  = "กรุณากรอกนามสกุล";
    } else {
      if (!form.companyName.trim()) e.companyName = "กรุณากรอกชื่อบริษัท";
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "กรุณากรอกอีเมลที่ถูกต้อง";
    if (!/^\d{13}$/.test(form.taxId.replace(/[-\s]/g, "")))
      e.taxId = "หมายเลขผู้เสียภาษี 13 หลัก";
    if (!streetAddress.trim())
      e.address = "กรุณากรอกที่อยู่";
    if (!subDistrict.trim())
      e.subDistrict = "กรุณาเลือกเขต/อำเภอ";
    if (!district.trim())
      e.district = "กรุณาเลือกแขวง/ตำบล";
    if (!/^\d{5}$/.test(form.postalCode))
      e.postalCode = "รหัสไปรษณีย์ 5 หลัก";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setInitialForm(EMPTY_FORM);
    setStreetAddress("");
    setProvince("กรุงเทพมหานคร");
    setSubDistrict("");
    setDistrict("");
    setInitialStreet("");
    setInitialProvince("กรุงเทพมหานคร");
    setInitialSubDistrict("");
    setInitialDistrict("");
    setErrors({});
    setEditingId(null);
    setView("add");
  };

  const openEdit = (p: TaxInvoiceData) => {
    const data = {
      type:         p.type,
      firstName:    p.firstName,
      lastName:     p.lastName,
      companyName:  p.companyName,
      isHeadOffice: p.isHeadOffice,
      email:        p.email,
      phone:        p.phone,
      taxId:        p.taxId,
      address:      p.address,
      postalCode:   p.postalCode,
      isDefault:    p.isDefault,
    };
    
    // Parse concatenated address
    const parts = p.address.split(", ");
    let street = p.address;
    let prov = "กรุงเทพมหานคร";
    let subDist = "";
    let dist = "";
    
    if (parts.length >= 4) {
      street = parts[0];
      dist = parts[1];
      subDist = parts[2];
      prov = parts[3];
    }
    
    setForm(data);
    setInitialForm(data);
    setStreetAddress(street);
    setProvince(prov);
    setSubDistrict(subDist);
    setDistrict(dist);
    setInitialStreet(street);
    setInitialProvince(prov);
    setInitialSubDistrict(subDist);
    setInitialDistrict(dist);
    setErrors({});
    setEditingId(p.id);
    setView("edit");
  };

  const handleSave = () => {
    if (!validate()) return;
    const concatenatedAddress = `${streetAddress}, ${district}, ${subDistrict}, ${province}`;
    const finalForm = {
      ...form,
      address: concatenatedAddress,
    };
    if (view === "edit" && editingId) {
      updateProfile(editingId, finalForm);
    } else {
      addProfile(finalForm);
    }
    setView("list");
    setForm(EMPTY_FORM);
    setStreetAddress("");
    setProvince("กรุงเทพมหานคร");
    setSubDistrict("");
    setDistrict("");
    setEditingId(null);
  };

  const goBackToList = () => {
    setView("list");
    setForm(EMPTY_FORM);
    setStreetAddress("");
    setProvince("กรุงเทพมหานคร");
    setSubDistrict("");
    setDistrict("");
    setEditingId(null);
    setErrors({});
  };

  const handleConfirmSelection = () => {
    if (!selectedId) return;
    router.back();
  };

  // ── LIST VIEW ──
  if (view === "list") {
    return (
      <>
        <div className="min-h-screen pb-28 -mx-4 md:mx-0">

          {profiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <FileText size={48} strokeWidth={1} className="text-[var(--km-text-muted)]" />
              <div>
                <p className="text-[15px] font-medium text-[var(--km-text)]">ยังไม่มีข้อมูลใบกำกับภาษี</p>
                <p className="text-[13px] text-[var(--km-text-muted)] mt-1">เพิ่มข้อมูลสำหรับขอใบกำกับภาษีเต็มรูปแบบ</p>
              </div>
              <button onClick={openAdd}
                className="mt-2 px-6 py-2.5 rounded-full border border-[var(--km-border)] text-[13px] text-[var(--km-text-secondary)] hover:border-[var(--km-border-strong)] hover:text-[var(--km-text)] transition-all">
                + เพิ่มข้อมูลใหม่
              </button>
            </div>
          ) : (
            <>
              <div className="bg-white mx-4 md:mx-0 rounded-lg border border-[var(--km-border)] overflow-hidden divide-y divide-[var(--km-border)]">
                {profiles.map((p) => {
                  const isSelected = selectedId === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => selectProfile(p.id)}
                      className="w-full text-left px-4 py-4 flex items-start gap-3 hover:bg-[var(--km-surface)] transition-colors cursor-pointer"
                    >
                      <div className="flex-shrink-0 mt-0.5 text-[var(--km-text-muted)]">
                        {p.type === "individual" ? <User size={15} /> : <Building2 size={15} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className="text-[14px] font-medium text-[var(--km-text)]">
                            {p.type === "individual" ? `${p.firstName} ${p.lastName}` : p.companyName}
                          </span>
                          <span className="text-[13px] font-normal border border-[var(--km-border)] text-[var(--km-text-secondary)] px-2 py-0.5 rounded-full">
                            {p.type === "individual" ? "บุคคลธรรมดา" : "นิติบุคคล"}
                          </span>
                          {p.isDefault && (
                            <span className="text-[13px] font-medium text-[var(--km-success)]">ค่าเริ่มต้น</span>
                          )}
                        </div>
                        <p className="text-[13px] text-[var(--km-text-secondary)] leading-relaxed">
                          เลขผู้เสียภาษี: {p.taxId}
                        </p>
                        <p className="text-[13px] text-[var(--km-text-secondary)] leading-relaxed">
                          {p.address} {p.postalCode}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
                        <button onClick={(e) => { e.stopPropagation(); openEdit(p); }} className="p-1.5 text-[var(--km-text-muted)] hover:text-[var(--km-text)] transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); deleteProfile(p.id); }} className="p-1.5 text-[var(--km-text-muted)] hover:text-red-500 transition-colors">
                          <Trash2 size={14} />
                        </button>
                        {!accountMode && (
                          <div className="w-[18px] flex items-center justify-center ml-0.5">
                            {isSelected && <Check size={15} strokeWidth={2.5} style={{ color: "var(--km-success)" }} />}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                <button
                  onClick={openAdd}
                  className="w-full px-4 py-4 flex items-center gap-3 text-[var(--km-text-secondary)] hover:bg-[var(--km-surface)] transition-colors"
                >
                  <Plus size={16} />
                  <span className="text-[14px] font-normal">เพิ่มข้อมูลขอใบกำกับภาษีใหม่</span>
                </button>
              </div>
            </>
          )}
        </div>

        {!accountMode && typeof document !== "undefined" && createPortal(
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--km-border)] z-[810] px-4 pt-3"
            style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
            <div className="max-w-2xl mx-auto">
              <button
                disabled={!selectedId}
                onClick={handleConfirmSelection}
                className="w-full py-3.5 rounded-full text-white text-sm font-medium transition-all disabled:opacity-40"
                style={{ background: "var(--km-text)" }}
              >
                ยืนยันเลือกข้อมูลนี้
              </button>
            </div>
          </div>,
          document.body
        )}
      </>
    );
  }

  // ── FORM VIEW (add / edit) ──
  return (
    <>
    <div className="min-h-screen pb-[100px] md:pb-0">
      {/* Desktop page header */}
      <div className="hidden md:flex items-center gap-3 mb-6">
        <button
          onClick={() => accountMode ? setView("list") : router.back()}
          className="p-1.5 rounded-full hover:bg-[var(--km-surface)] transition-colors text-[var(--km-text-secondary)] hover:text-[var(--km-text)]"
        >
          <ChevronDown size={20} strokeWidth={1.75} className="rotate-90" />
        </button>
        <h2 className="text-[15px] font-medium text-[var(--km-text)]">
          {view === "edit" ? "แก้ไขใบกำกับภาษี" : "เพิ่มข้อมูลใบกำกับภาษีใหม่"}
        </h2>
      </div>
      <div className="flex flex-col gap-0">
        <div className="flex flex-col gap-3">
          {/* Pill Tabs */}
          <div className="flex gap-2">
            {(["individual", "corporate"] as TaxType[]).map((t) => (
              <button
                key={t}
                onClick={() => setForm((f) => ({ ...f, type: t }))}
                className={`px-5 py-2 rounded-full text-[13px] font-medium transition-all flex-shrink-0 ${
                  form.type === t
                    ? "bg-[var(--km-text)] text-white"
                    : "bg-white text-[var(--km-text-secondary)] border border-[#e8e8ed]"
                }`}
              >
                {t === "individual" ? "บุคคลธรรมดา" : "นิติบุคคล"}
              </button>
            ))}
          </div>

          {form.type === "individual" ? (
            <div className="grid grid-cols-2 gap-3">
              <FormField label="ชื่อ *" error={errors.firstName}>
                <input value={form.firstName} onChange={set("firstName")} placeholder="ระบุชื่อจริง" className={inputCls(errors.firstName)} />
              </FormField>
              <FormField label="นามสกุล *" error={errors.lastName}>
                <input value={form.lastName} onChange={set("lastName")} placeholder="ระบุนามสกุล" className={inputCls(errors.lastName)} />
              </FormField>
            </div>
          ) : (
            <>
              <FormField label="ชื่อบริษัท *" error={errors.companyName}>
                <input value={form.companyName} onChange={set("companyName")} placeholder="ระบุชื่อบริษัท / องค์กร" className={inputCls(errors.companyName)} />
              </FormField>
            </>
          )}

          <FormField label="อีเมล *" error={errors.email}>
            <input value={form.email} onChange={set("email")} placeholder="ระบุอีเมล (สำหรับจัดส่ง e-Tax)" inputMode="email" className={inputCls(errors.email)} />
          </FormField>

          <FormField label={`หมายเลขโทรศัพท์${form.type === "individual" ? " *" : ""}`}>
            <PhoneInput value={form.phone} onChange={val => setForm(f => ({ ...f, phone: val }))} />
          </FormField>

          <FormField
            label={form.type === "individual" ? "หมายเลขประจำตัวผู้เสียภาษี *" : "รหัสประจำตัวผู้เสียภาษีนิติบุคคล *"}
            error={errors.taxId}
          >
            <input value={form.taxId} onChange={set("taxId")} placeholder="ระบุเลขประจำตัวผู้เสียภาษี 13 หลัก" maxLength={13} inputMode="numeric" className={inputCls(errors.taxId)} />
          </FormField>

          <FormField label="จังหวัด *">
            <SelectTrigger value={province} placeholder="เลือกจังหวัด" onClick={() => openSelector("province")} />
          </FormField>

          <FormField label="เขต / อำเภอ *" error={errors.subDistrict}>
            <SelectTrigger value={subDistrict} placeholder="เลือกเขต / อำเภอ" error={errors.subDistrict} disabled={!province} onClick={() => openSelector("subDistrict")} />
          </FormField>

          <FormField label="แขวง / ตำบล *" error={errors.district}>
            <SelectTrigger value={district} placeholder="เลือกแขวง / ตำบล" error={errors.district} disabled={!subDistrict} onClick={() => openSelector("district")} />
          </FormField>

          <FormField label="รหัสไปรษณีย์ *" error={errors.postalCode}>
            <SelectTrigger value={form.postalCode} placeholder="เลือกรหัสไปรษณีย์" error={errors.postalCode} disabled={!district} onClick={() => openSelector("postalCode")} />
          </FormField>

          <FormField label="ที่อยู่ (บ้านเลขที่ ถนน ซอย) *" error={errors.address}>
            <input
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              placeholder="ระบุบ้านเลขที่, หมู่, ซอย, ถนน"
              className={inputCls(errors.address)}
            />
          </FormField>

          {/* Bottom Sheet Selector */}
          <BottomSheet
            isOpen={activeSelector.type !== null}
            onClose={closeSelector}
            title={activeSelector.title}
            maxHeight="80vh"
          >
            <div className="flex flex-col h-full">
              <div className="px-4 pb-3">
                <input
                  value={activeSelector.searchTerm}
                  onChange={(e) => setActiveSelector((s) => ({ ...s, searchTerm: e.target.value }))}
                  placeholder="ค้นหา..."
                  className="w-full h-10 px-4 border border-[var(--km-border)] rounded-xl text-sm outline-none bg-[var(--km-surface)]"
                />
              </div>
              <div className="flex-1 overflow-y-auto max-h-[50vh]">
                <div className="flex flex-col px-3 gap-0.5 pb-8">
                  {filteredOptions.map((opt) => {
                    const isSelected =
                      (activeSelector.type === "province" && province === opt) ||
                      (activeSelector.type === "subDistrict" && subDistrict === opt) ||
                      (activeSelector.type === "district" && district === opt) ||
                      (activeSelector.type === "postalCode" && form.postalCode === opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          if (activeSelector.type === "province") selectProvince(opt);
                          else if (activeSelector.type === "subDistrict") selectAmphoe(opt);
                          else if (activeSelector.type === "district") selectDistrict(opt);
                          else if (activeSelector.type === "postalCode") selectPostalCode(opt);
                        }}
                        className="w-full px-3 py-3.5 flex items-center justify-between text-left rounded-xl hover:bg-[var(--km-surface)] transition-all"
                      >
                        <span className={cn("text-[13px]", isSelected ? "text-[var(--km-text)] font-medium" : "text-[var(--km-text-secondary)]")}>{opt}</span>
                        {isSelected && <Check size={16} strokeWidth={2.5} className="text-[var(--km-success)] flex-shrink-0" />}
                      </button>
                    );
                  })}
                  {filteredOptions.length === 0 && (
                    <p className="text-center text-[13px] text-[var(--km-text-muted)] py-12">ไม่พบข้อมูล</p>
                  )}
                </div>
              </div>
            </div>
          </BottomSheet>

          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, isDefault: !f.isDefault }))}
            className="flex items-center justify-between w-full py-1"
          >
            <span className="text-sm text-[var(--km-text)]">ตั้งเป็นข้อมูลตั้งต้นสำหรับออกใบกำกับภาษี</span>
            <div
              className="relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
              style={{ background: form.isDefault ? "var(--km-text)" : "var(--km-border-strong)" }}
            >
              <div
                className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200"
                style={{ left: form.isDefault ? "calc(100% - 22px)" : "2px" }}
              />
            </div>
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDiscard}
        title="ยกเลิกการแก้ไข?"
        description="ข้อมูลที่กรอกไว้จะหายไปทั้งหมด"
        confirmLabel="ยกเลิกการแก้ไข"
        cancelLabel="กลับไปแก้ไข"
        onConfirm={() => { setConfirmDiscard(false); goBackToList(); }}
        onCancel={() => setConfirmDiscard(false)}
      />
    </div>

    {accountMode ? (
      <>
        {/* Desktop inline button */}
        <div className="mt-6 mb-8 hidden md:block">
          <button
            onClick={handleSave}
            className="w-full py-2.5 rounded-full text-white text-[14px] font-medium hover:opacity-90 active:scale-[0.98] transition-all"
            style={{ background: "var(--km-text)" }}
          >
            บันทึกข้อมูล
          </button>
        </div>
        {/* Mobile fixed bottom bar */}
        {typeof document !== "undefined" && createPortal(
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--km-border)] z-[810] px-4 pt-3"
              style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
            <button
              onClick={handleSave}
              className="w-full py-3.5 rounded-full text-white text-sm font-medium active:scale-[0.98] transition-all"
              style={{ background: "var(--km-text)" }}
            >
              บันทึกข้อมูล
            </button>
          </div>,
          document.body
        )}
      </>
    ) : (
      <>
        {/* Desktop inline button */}
        <div className="mt-6 mb-8 hidden md:block">
          <button
            onClick={handleSave}
            className="w-full py-2.5 rounded-full text-white text-[14px] font-medium hover:opacity-90 active:scale-[0.98] transition-all"
            style={{ background: "var(--km-text)" }}
          >
            บันทึกข้อมูล
          </button>
        </div>
        {/* Mobile fixed bottom bar */}
        {typeof document !== "undefined" && createPortal(
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--km-border)] z-[810] px-4 pt-3"
              style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
            <button
              onClick={handleSave}
              className="w-full py-3.5 rounded-full text-white text-sm font-medium active:scale-[0.98] transition-all"
              style={{ background: "var(--km-text)" }}
            >
              บันทึกข้อมูล
            </button>
          </div>,
          document.body
        )}
      </>
    )}
    </>
  );
}
