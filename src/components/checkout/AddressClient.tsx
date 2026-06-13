"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import { MapPin, Plus, Check, Pencil, ChevronDown } from "lucide-react";
import { useCheckoutStore, type SavedAddress } from "@/stores/checkout.store";
import { useUIStore } from "@/stores/ui.store";
import { useAuthStore } from "@/stores/auth.store";
import { FormField, inputCls } from "@/components/ui/FormField";
import { PhoneInput, DIAL_CODES } from "@/components/ui/PhoneInput";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { getAmphoes, getDistricts, getZipcode, lookupByZipcode, getCountryProvinces } from "@/lib/thai-address";
import { useLocaleStore } from "@/stores/locale.store";
import { cn } from "@/lib/utils";
import { BottomSheet } from "@/components/ui/BottomSheet";

const LABELS = ["บ้าน", "ที่ทำงาน", "อื่นๆ"];

function SelectTrigger({
  placeholder,
  value,
  error,
  disabled,
  onClick,
}: {
  placeholder?: string;
  value?: string;
  error?: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "w-full h-12 px-4 pr-10 text-[13px] font-normal border rounded-2xl outline-none transition-all bg-white flex items-center justify-between text-left shadow-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer relative",
        !value ? "text-[var(--km-text-muted)]" : "text-[var(--km-text)]",
        error
          ? "border-[var(--km-error)]"
          : "border-[var(--km-border)]"
      )}
    >
      <span className="truncate">{value || placeholder}</span>
      <ChevronDown
        size={15}
        className="text-[var(--km-text-muted)] flex-shrink-0 absolute right-4 top-1/2 -translate-y-1/2"
      />
    </button>
  );
}

export const EMPTY_FORM = {
  label: "บ้าน", firstName: "", lastName: "", phone: "",
  address: "", country: "TH", province: "กรุงเทพมหานคร", subDistrict: "", district: "", postalCode: "",
};

/* ─── Address Form ─── */
export function AddressForm({
  initial,
  initialIsDefault,
  onSave,
  onSaveReady,
  onDirtyChange,
  disableDefaultToggle,
  children,
}: {
  initial?: Partial<typeof EMPTY_FORM>;
  initialIsDefault?: boolean;
  onSave: (data: Omit<SavedAddress, "id">) => void;
  onSaveReady?: (fn: () => void) => void;
  onDirtyChange?: (isDirty: boolean) => void;
  disableDefaultToggle?: boolean;
  children?: React.ReactNode;
}) {
  const [form, setForm] = useState(() => {
    const combined = { ...EMPTY_FORM, ...initial };
    if (!combined.country) combined.country = "TH";
    return combined;
  });
  const [isDefault, setIsDefault] = useState(initialIsDefault ?? false);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof EMPTY_FORM, string>>>({});
  const { country: currentLocale } = useLocaleStore();
  const locale = currentLocale.code;

  // Selector Drawer State
  const [activeSelector, setActiveSelector] = useState<{
    type: "country" | "province" | "subDistrict" | "district" | "postalCode" | null;
    title: string;
    searchTerm: string;
  }>({
    type: null,
    title: "",
    searchTerm: "",
  });

  // Keep track of the initial prop to sync it when it updates (e.g. from hydration)
  const lastInitialRef = useRef(initial);
  useEffect(() => {
    const prevStr = JSON.stringify(lastInitialRef.current);
    const nextStr = JSON.stringify(initial);
    if (prevStr === nextStr) return;
    lastInitialRef.current = initial;
    setForm(() => {
      const combined = { ...EMPTY_FORM, ...initial };
      if (!combined.country) combined.country = "TH";
      return combined;
    });
  }, [initial]);

  const lastInitialIsDefaultRef = useRef(initialIsDefault);
  useEffect(() => {
    if (isDefault === (lastInitialIsDefaultRef.current ?? false)) {
      setIsDefault(initialIsDefault ?? false);
    }
    lastInitialIsDefaultRef.current = initialIsDefault;
  }, [initialIsDefault, isDefault]);

  // Find all matches based on the 5-digit postal code
  const matches = useMemo(() => {
    if (form.country === "TH" && /^\d{5}$/.test(form.postalCode)) {
      return lookupByZipcode(form.postalCode);
    }
    return [];
  }, [form.country, form.postalCode]);

  const [intlProvinces, setIntlProvinces] = useState<string[]>([]);
  const [intlAmphoes, setIntlAmphoes] = useState<string[]>([]);
  const [loadingIntlProvinces, setLoadingIntlProvinces] = useState(false);
  const [loadingIntlAmphoes, setLoadingIntlAmphoes] = useState(false);

  const getCountryEnglishName = (code: string): string => {
    const found = DIAL_CODES.find(c => c.code === code);
    return found ? found.names.EN : "";
  };

  useEffect(() => {
    if (form.country === "TH") {
      setIntlProvinces([]);
      setIntlAmphoes([]);
      return;
    }

    const countryName = getCountryEnglishName(form.country);
    if (!countryName) {
      setIntlProvinces([]);
      setIntlAmphoes([]);
      return;
    }

    let active = true;
    setLoadingIntlProvinces(true);
    fetch(`https://countriesnow.space/api/v0.1/countries/states/q?country=${encodeURIComponent(countryName)}`)
      .then(res => res.json())
      .then(data => {
        if (!active) return;
        if (data && !data.error && data.data && data.data.states) {
          const list = data.data.states.map((s: any) => s.name).sort();
          setIntlProvinces(list);
        } else {
          setIntlProvinces([]);
        }
      })
      .catch(() => {
        if (active) setIntlProvinces([]);
      })
      .finally(() => {
        if (active) setLoadingIntlProvinces(false);
      });

    return () => {
      active = false;
    };
  }, [form.country]);

  useEffect(() => {
    if (form.country === "TH" || !form.province) {
      setIntlAmphoes([]);
      return;
    }

    const countryName = getCountryEnglishName(form.country);
    if (!countryName) {
      setIntlAmphoes([]);
      return;
    }

    let active = true;
    setLoadingIntlAmphoes(true);
    fetch(`https://countriesnow.space/api/v0.1/countries/state/cities/q?country=${encodeURIComponent(countryName)}&state=${encodeURIComponent(form.province)}`)
      .then(res => res.json())
      .then(data => {
        if (!active) return;
        if (data && !data.error && Array.isArray(data.data)) {
          const list = data.data.sort();
          setIntlAmphoes(list);
        } else {
          setIntlAmphoes([]);
        }
      })
      .catch(() => {
        if (active) setIntlAmphoes([]);
      })
      .finally(() => {
        if (active) setLoadingIntlAmphoes(false);
      });

    return () => {
      active = false;
    };
  }, [form.country, form.province]);

  const provinces = useMemo(() => {
    if (form.country === "TH") {
      if (matches.length > 0) {
        return Array.from(new Set(matches.map((m) => m.province))).sort();
      }
      return getCountryProvinces("TH", locale as "TH" | "EN" | "CN");
    }
    if (intlProvinces.length > 0) {
      return intlProvinces;
    }
    return getCountryProvinces(form.country, locale as "TH" | "EN" | "CN");
  }, [matches, form.country, locale, intlProvinces]);

  const amphoes = useMemo(() => {
    if (form.country === "TH") {
      if (matches.length > 0) {
        return Array.from(
          new Set(
            matches
              .filter((m) => m.province === form.province)
              .map((m) => m.amphoe)
          )
        ).sort();
      }
      return getAmphoes(form.province);
    }
    return intlAmphoes;
  }, [matches, form.province, form.country, intlAmphoes]);

  const districts = useMemo(() => {
    if (form.country !== "TH") return [];
    if (matches.length > 0) {
      return Array.from(
        new Set(
          matches
            .filter(
              (m) =>
                m.province === form.province && m.amphoe === form.subDistrict
            )
            .map((m) => m.district)
        )
      ).sort();
    }
    return getDistricts(form.province, form.subDistrict);
  }, [matches, form.province, form.subDistrict, form.country]);

  // Filtered Options inside the Drawer
  const filteredOptions = useMemo(() => {
    if (!activeSelector.type) return [];
    const search = activeSelector.searchTerm.trim().toLowerCase();

    if (activeSelector.type === "country") {
      const mapped = DIAL_CODES.map((c) => {
        const label = locale === "TH" ? c.names.TH : locale === "CN" ? c.names.CN : c.names.EN;
        return { label, value: c.code, flag: c.flag };
      }).filter((opt) => opt.label.toLowerCase().includes(search));

      return mapped.sort((a, b) => {
        if (a.value === "TH") return -1;
        if (b.value === "TH") return 1;
        return a.label.localeCompare(b.label, locale === "TH" ? "th" : "en");
      });
    }

    let rawList: string[] = [];
    if (activeSelector.type === "province") {
      rawList = provinces;
    } else if (activeSelector.type === "subDistrict") {
      rawList = amphoes;
    } else if (activeSelector.type === "district") {
      rawList = districts;
    } else if (activeSelector.type === "postalCode") {
      if (form.country === "TH") {
        const zip = getZipcode(form.province, form.subDistrict, form.district);
        if (zip) {
          rawList = [zip];
        }
      }
    }

    return rawList
      .map((item) => ({ label: item, value: item }))
      .filter((opt) => opt.label.toLowerCase().includes(search));
  }, [activeSelector.type, activeSelector.searchTerm, provinces, amphoes, districts, locale, form.country, form.province, form.subDistrict, form.district]);

  const set = (k: keyof typeof EMPTY_FORM) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  // Autocomplete address dropdowns when a valid postal code is entered
  useEffect(() => {
    if (matches.length > 0) {
      const validProvinces = Array.from(new Set(matches.map((m) => m.province)));
      let nextProvince = form.province;
      if (!validProvinces.includes(form.province)) {
        nextProvince = validProvinces[0];
      }

      const validAmphoes = Array.from(
        new Set(matches.filter((m) => m.province === nextProvince).map((m) => m.amphoe))
      );
      let nextAmphoe = form.subDistrict;
      if (!validAmphoes.includes(form.subDistrict)) {
        nextAmphoe = validAmphoes[0] || "";
      }

      const validDistricts = Array.from(
        new Set(
          matches
            .filter((m) => m.province === nextProvince && m.amphoe === nextAmphoe)
            .map((m) => m.district)
        )
      );
      let nextDistrict = form.district;
      if (!validDistricts.includes(form.district)) {
        nextDistrict = validDistricts[0] || "";
      }

      setForm((f) => {
        if (
          f.province !== nextProvince ||
          f.subDistrict !== nextAmphoe ||
          f.district !== nextDistrict
        ) {
          return {
            ...f,
            province: nextProvince,
            subDistrict: nextAmphoe,
            district: nextDistrict,
          };
        }
        return f;
      });
    }
  }, [matches]);

  const openSelector = (type: "country" | "province" | "subDistrict" | "district" | "postalCode") => {
    let title = "";
    if (type === "country") {
      title = locale === "TH" ? "เลือกประเทศ" : locale === "CN" ? "选择国家" : "Select Country";
    } else if (type === "province") {
      title = locale === "TH" ? "เลือกจังหวัด" : locale === "CN" ? "选择省份" : "Select Province";
    } else if (type === "subDistrict") {
      title = locale === "TH" ? "เลือกเขต / อำเภอ" : locale === "CN" ? "选择区 / 县" : "Select District / City";
    } else if (type === "district") {
      title = locale === "TH" ? "เลือกแขวง / ตำบล" : locale === "CN" ? "选择乡镇 / 街道" : "Select Sub-district";
    } else if (type === "postalCode") {
      title = locale === "TH" ? "เลือกรหัสไปรษณีย์" : locale === "CN" ? "选择邮政编码" : "Select Postal Code";
    }

    setActiveSelector({
      type,
      title,
      searchTerm: "",
    });
  };

  const selectCountry = (nextCountry: string) => {
    setForm((f) => ({
      ...f,
      country: nextCountry,
      province: nextCountry === "TH" ? "กรุงเทพมหานคร" : "",
      subDistrict: "",
      district: "",
      postalCode: "",
    }));
    setIntlProvinces([]);
    setIntlAmphoes([]);
    setTimeout(() => {
      openSelector("province");
    }, 300);
  };

  const selectProvince = (nextProv: string) => {
    setForm((f) => {
      if (f.country === "TH" && matches.length > 0) {
        const matchingAmphoes = Array.from(
          new Set(matches.filter((m) => m.province === nextProv).map((m) => m.amphoe))
        );
        const nextAmphoe = matchingAmphoes[0] || "";
        const matchingDistricts = Array.from(
          new Set(
            matches
              .filter((m) => m.province === nextProv && m.amphoe === nextAmphoe)
              .map((m) => m.district)
          )
        );
        const nextDistrict = matchingDistricts[0] || "";
        return {
          ...f,
          province: nextProv,
          subDistrict: nextAmphoe,
          district: nextDistrict,
        };
      }
      return {
        ...f,
        province: nextProv,
        subDistrict: "",
        district: "",
        postalCode: "",
      };
    });
    setIntlAmphoes([]);
    setTimeout(() => {
      openSelector("subDistrict");
    }, 300);
  };

  const selectAmphoe = (nextAmphoe: string) => {
    setForm((f) => {
      if (f.country === "TH" && matches.length > 0) {
        const matchingDistricts = Array.from(
          new Set(
            matches
              .filter((m) => m.province === f.province && m.amphoe === nextAmphoe)
              .map((m) => m.district)
          )
        );
        const nextDistrict = matchingDistricts[0] || "";
        return {
          ...f,
          subDistrict: nextAmphoe,
          district: nextDistrict,
        };
      }
      return {
        ...f,
        subDistrict: nextAmphoe,
        district: "",
        postalCode: "",
      };
    });
    if (form.country === "TH") {
      setTimeout(() => {
        openSelector("district");
      }, 300);
    }
  };

  const selectDistrict = (nextDistrict: string) => {
    setForm((f) => {
      const zip = getZipcode(f.province, f.subDistrict, nextDistrict);
      return {
        ...f,
        district: nextDistrict,
        postalCode: zip || f.postalCode,
      };
    });
    if (form.country === "TH") {
      setTimeout(() => {
        openSelector("postalCode");
      }, 300);
    }
  };

  const selectPostalCode = (nextPostalCode: string) => {
    setForm((f) => ({
      ...f,
      postalCode: nextPostalCode,
    }));
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!form.firstName.trim())   e.firstName   = "กรุณากรอกชื่อ";
    if (!form.lastName.trim())    e.lastName    = "กรุณากรอกนามสกุล";
    const cleanPhone = form.phone.replace(/\s/g, "");
    if (!/^\+?[1-9]\d{6,14}$/.test(cleanPhone) && !/^0\d{9}$/.test(cleanPhone)) {
      e.phone = "เบอร์โทรไม่ถูกต้อง";
    }
    if (!form.address.trim())     e.address     = "กรุณากรอกที่อยู่";
    
    if (form.country === "TH") {
      if (!form.subDistrict.trim()) e.subDistrict = "กรุณาเลือกเขต/อำเภอ";
      if (!form.district.trim())    e.district    = "กรุณาเลือกแขวง/ตำบล";
      if (!/^\d{5}$/.test(form.postalCode)) e.postalCode = "รหัสไปรษณีย์ 5 หลัก";
    } else {
      if (!form.province.trim())    e.province    = "กรุณากรอกจังหวัด/รัฐ";
      if (!form.subDistrict.trim()) e.subDistrict = "กรุณากรอกเขต/อำเภอ/เมือง";
      if (!form.district.trim())    e.district    = "กรุณากรอกแขวง/ตำบล";
      if (!form.postalCode.trim())  e.postalCode  = "กรุณากรอกรหัสไปรษณีย์";
    }
    
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({ ...form, isDefault });
  };

  useEffect(() => {
    onSaveReady?.(handleSave);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, isDefault]);

  useEffect(() => {
    const formStr = JSON.stringify(form);
    const initialStr = JSON.stringify({ ...EMPTY_FORM, ...initial });
    const isDefaultDiff = isDefault !== (initialIsDefault ?? false);
    const isDirty = formStr !== initialStr || isDefaultDiff;

    onDirtyChange?.(isDirty);
  }, [form, isDefault, initial, initialIsDefault, onDirtyChange]);

  return (
    <div className="flex flex-col gap-4 md:px-0 md:py-0 px-4 py-5 pb-28 md:pb-0">
      {/* Label tabs */}
      <div>
        <p className="text-[13px] font-medium text-[var(--km-text-secondary)] mb-2.5">ประเภทที่อยู่</p>
        <div className="flex gap-2.5">
          {LABELS.map((l) => (
            <button
              key={l}
              onClick={() => setForm((f) => ({ ...f, label: l }))}
              className={`px-5 py-2 rounded-full text-[13px] font-medium transition-all flex-shrink-0 ${
                form.label === l
                  ? "bg-[var(--km-text)] text-white"
                  : "bg-white text-[var(--km-text-secondary)] border border-[#e8e8ed]"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="ชื่อ *" error={errors.firstName}>
          <input value={form.firstName} onChange={set("firstName")} placeholder="ระบุชื่อจริง" className={inputCls(errors.firstName)} />
        </FormField>
        <FormField label="นามสกุล *" error={errors.lastName}>
          <input value={form.lastName} onChange={set("lastName")} placeholder="ระบุนามสกุล" className={inputCls(errors.lastName)} />
        </FormField>
      </div>

      <FormField label="เบอร์โทรศัพท์ *" error={errors.phone}>
        <PhoneInput value={form.phone} onChange={val => setForm(f => ({ ...f, phone: val }))} error={!!errors.phone} />
      </FormField>

      {/* ประเทศ (Country) */}
      <FormField label={locale === "TH" ? "ประเทศ *" : locale === "CN" ? "国家 *" : "Country *"}>
        <SelectTrigger
          value={(() => {
            const found = DIAL_CODES.find(c => c.code === (form.country || "TH"));
            if (!found) return "";
            const name = locale === "TH" ? found.names.TH : locale === "CN" ? found.names.CN : found.names.EN;
            return name;
          })()}
          placeholder={locale === "TH" ? "เลือกประเทศ" : locale === "CN" ? "选择国家" : "Select Country"}
          onClick={() => openSelector("country")}
        />
      </FormField>

      {/* Province */}
      <FormField label={locale === "TH" ? "จังหวัด *" : locale === "CN" ? "省份 *" : "Province *"} error={errors.province}>
        {provinces.length > 0 ? (
          <SelectTrigger
            value={form.province}
            placeholder={
              loadingIntlProvinces
                ? (locale === "TH" ? "กำลังโหลด..." : locale === "CN" ? "加载中..." : "Loading...")
                : (locale === "TH" ? "เลือกจังหวัด" : locale === "CN" ? "选择省份" : "Select Province")
            }
            error={errors.province}
            onClick={() => openSelector("province")}
          />
        ) : (
          <input
            value={form.province}
            onChange={set("province")}
            placeholder={locale === "TH" ? "กรอกจังหวัด/รัฐ" : locale === "CN" ? "输入省份/州" : "Enter Province/State"}
            className={inputCls(errors.province)}
          />
        )}
      </FormField>

      {/* Amphoe (เขต/อำเภอ) cascades from province */}
      <FormField label={locale === "TH" ? "เขต / อำเภอ *" : locale === "CN" ? "区 / 县 *" : "District / City *"} error={errors.subDistrict}>
        {amphoes.length > 0 ? (
          <SelectTrigger
            value={form.subDistrict}
            placeholder={
              loadingIntlAmphoes
                ? (locale === "TH" ? "กำลังโหลด..." : locale === "CN" ? "加载中..." : "Loading...")
                : (locale === "TH" ? "เลือกเขต / อำเภอ" : locale === "CN" ? "选择区 / 县" : "Select District / City")
            }
            error={errors.subDistrict}
            disabled={!form.province}
            onClick={() => openSelector("subDistrict")}
          />
        ) : (
          <input
            value={form.subDistrict}
            onChange={set("subDistrict")}
            placeholder={locale === "TH" ? "กรอกเขต/อำเภอ" : locale === "CN" ? "输入区/县" : "Enter District / City"}
            className={inputCls(errors.subDistrict)}
          />
        )}
      </FormField>

      {/* District (แขวง/ตำบล) cascades from amphoe */}
      <FormField label={locale === "TH" ? "แขวง / ตำบล *" : locale === "CN" ? "乡镇 / 街道 *" : "Sub-district *"} error={errors.district}>
        {districts.length > 0 ? (
          <SelectTrigger
            value={form.district}
            placeholder={locale === "TH" ? "เลือกแขวง / ตำบล" : locale === "CN" ? "选择乡镇 / 街道" : "Select Sub-district"}
            error={errors.district}
            disabled={!form.subDistrict}
            onClick={() => openSelector("district")}
          />
        ) : (
          <input
            value={form.district}
            onChange={set("district")}
            placeholder={locale === "TH" ? "กรอกแขวง/ตำบล" : locale === "CN" ? "输入乡镇/街道" : "Enter Sub-district"}
            className={inputCls(errors.district)}
          />
        )}
      </FormField>

      {/* รหัสไปรษณีย์ (Postal code) */}
      <FormField label={locale === "TH" ? "รหัสไปรษณีย์ *" : locale === "CN" ? "邮政编码 *" : "Postal Code *"} error={errors.postalCode}>
        {form.country === "TH" ? (
          <SelectTrigger
            value={form.postalCode}
            placeholder={locale === "TH" ? "เลือกรหัสไปรษณีย์" : locale === "CN" ? "选择邮政编码" : "Select Postal Code"}
            error={errors.postalCode}
            disabled={!form.district}
            onClick={() => openSelector("postalCode")}
          />
        ) : (
          <input
            value={form.postalCode}
            onChange={set("postalCode")}
            placeholder={locale === "TH" ? "กรอกรหัสไปรษณีย์" : locale === "CN" ? "输入邮政编码" : "Enter Postal Code"}
            className={inputCls(errors.postalCode)}
          />
        )}
      </FormField>

      <FormField label="ที่อยู่ (บ้านเลขที่ ถนน ซอย) *" error={errors.address}>
        <input value={form.address} onChange={set("address")} placeholder="ระบุบ้านเลขที่, หมู่, ซอย, ถนน" className={inputCls(errors.address)} />
      </FormField>

      {/* Default address toggle */}
      <button
        type="button"
        disabled={disableDefaultToggle}
        onClick={() => setIsDefault((v) => !v)}
        className="flex items-center justify-between w-full py-1 disabled:opacity-50"
      >
        <span className="text-[15px] text-[var(--km-text)]">ตั้งเป็นที่อยู่เริ่มต้น</span>
        <div
          className="relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
          style={{ background: isDefault ? "var(--km-text)" : "var(--km-border-strong)" }}
        >
          <div
            className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200"
            style={{ left: isDefault ? "calc(100% - 22px)" : "2px" }}
          />
        </div>
      </button>
      
      {children}

      {/* Slide-Up Bottom Sheet Address Selector */}
      <BottomSheet
        isOpen={activeSelector.type !== null}
        onClose={() => setActiveSelector({ type: null, title: "", searchTerm: "" })}
        title={activeSelector.title}
        maxHeight="80vh"
      >
        <div className="flex flex-col h-full">
          {/* Options List */}
          <div className="flex-1 overflow-y-auto max-h-[50vh] custom-scrollbar">
            <div className="flex flex-col px-3 gap-0.5 pb-8">
              {((activeSelector.type === "province" && loadingIntlProvinces) ||
                (activeSelector.type === "subDistrict" && loadingIntlAmphoes)) ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-[var(--km-text)] animate-spin" />
                  <p className="text-[13px] text-[var(--km-text-secondary)]">
                    {locale === "TH" ? "กำลังโหลดข้อมูล..." : locale === "CN" ? "正在加载数据..." : "Loading data..."}
                  </p>
                </div>
              ) : filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => {
                  const isSelected = (() => {
                    if (activeSelector.type === "country") return form.country === opt.value;
                    if (activeSelector.type === "province") return form.province === opt.value;
                    if (activeSelector.type === "subDistrict") return form.subDistrict === opt.value;
                    if (activeSelector.type === "district") return form.district === opt.value;
                    if (activeSelector.type === "postalCode") return form.postalCode === opt.value;
                    return false;
                  })();

                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        if (activeSelector.type === "country") {
                          selectCountry(opt.value);
                        } else if (activeSelector.type === "province") {
                          selectProvince(opt.value);
                        } else if (activeSelector.type === "subDistrict") {
                          selectAmphoe(opt.value);
                        } else if (activeSelector.type === "district") {
                          selectDistrict(opt.value);
                        } else if (activeSelector.type === "postalCode") {
                          selectPostalCode(opt.value);
                        }
                        setActiveSelector({ type: null, title: "", searchTerm: "" });
                      }}
                      className="w-full px-3 py-3.5 flex items-center justify-between text-left rounded-xl transition-all cursor-pointer hover:bg-[var(--km-surface)] active:scale-[0.99] duration-100"
                    >
                      <span className="flex items-center">
                        <span className={cn(
                          "text-[13px] font-normal transition-colors",
                          isSelected ? "text-[var(--km-text)]" : "text-[var(--km-text-secondary)]"
                        )}>
                          {opt.label}
                        </span>
                      </span>
                      {isSelected && (
                        <Check size={16} strokeWidth={2.5} className="text-[var(--km-success)] flex-shrink-0" />
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="py-12 text-center flex flex-col items-center justify-center gap-2">
                  <p className="text-[15px] font-medium text-[var(--km-text-secondary)]">ไม่พบข้อมูล</p>
                  <p className="text-[13px] text-[var(--km-text-muted)]">ลองพิมพ์ค้นหาด้วยคำอื่น</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}

/* ─── Main ─── */
export function AddressClient({ defaultPhone }: { defaultPhone?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addresses, selectedAddressId, selectAddress, addAddress, updateAddress, setDefaultAddress, guestContact } = useCheckoutStore();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const setHeaderTitleOverride = useUIStore((s) => s.setHeaderTitleOverride);
  const setHeaderBackOverride  = useUIStore((s) => s.setHeaderBackOverride);
  const setHeaderLocked        = useUIStore((s) => s.setHeaderLocked);

  const [showForm, setShowForm]           = useState(() => searchParams.get("add") === "true");
  const [editingId, setEditingId]         = useState<string | null>(null);
  const [tempSelected, setTempSelected]   = useState(selectedAddressId);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [saveCallback, setSaveCallback]   = useState<(() => void) | null>(null);
  const [isDirty, setIsDirty]             = useState(false);

  useEffect(() => {
    setHeaderLocked(true);
    return () => setHeaderLocked(false);
  }, [setHeaderLocked]);

  useEffect(() => {
    if (showForm) {
      setHeaderTitleOverride(editingId ? "แก้ไขที่อยู่" : "เพิ่มที่อยู่ใหม่");
      setHeaderBackOverride(() => { 
        if (isDirty) {
          setConfirmDiscard(true);
        } else {
          setShowForm(false);
          setEditingId(null);
        }
      });
    } else {
      setHeaderTitleOverride(null);
      setHeaderBackOverride(null);
    }
    return () => {
      setHeaderTitleOverride(null);
      setHeaderBackOverride(null);
    };
  }, [showForm, editingId, setHeaderTitleOverride, setHeaderBackOverride]);

  const handleConfirm = () => {
    if (tempSelected) {
      selectAddress(tempSelected);
      router.back();
    }
  };

  const handleAdd = (data: Omit<SavedAddress, "id">) => {
    if (editingId) {
      updateAddress(editingId, data);
      if (data.isDefault) setDefaultAddress(editingId);
      setShowForm(false);
      setEditingId(null);
    } else {
      const newId = addAddress(data);
      if (data.isDefault) setDefaultAddress(newId);
      setTempSelected(newId);
      setShowForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Desktop page header */}
      <div className="hidden md:flex items-center gap-3 pt-8 pb-4">
        <button
          onClick={() => router.back()}
          className="p-1.5 rounded-full hover:bg-[var(--km-surface)] transition-colors text-[var(--km-text-secondary)] hover:text-[var(--km-text)]"
        >
          <ChevronDown size={20} strokeWidth={1.75} className="rotate-90" />
        </button>
        <h1 className="text-[15px] font-medium text-[var(--km-text)]">
          {showForm ? (editingId ? "แก้ไขที่อยู่" : "เพิ่มที่อยู่ใหม่") : "ที่อยู่จัดส่ง"}
        </h1>
      </div>

      <div className="w-full">

        {/* Empty state */}
        {!showForm && addresses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <MapPin size={48} strokeWidth={1} className="text-[var(--km-text-muted)]" />
            <div>
              <p className="text-[15px] font-medium text-[var(--km-text)]">ยังไม่มีที่อยู่จัดส่ง</p>
              <p className="text-[13px] text-[var(--km-text-muted)] mt-1">เพิ่มที่อยู่สำหรับการจัดส่งสินค้า</p>
            </div>
            <button onClick={() => { setEditingId(null); setShowForm(true); }}
              className="mt-2 px-6 py-2.5 rounded-full border border-[var(--km-border)] text-[13px] text-[var(--km-text-secondary)] hover:border-[var(--km-border-strong)] hover:text-[var(--km-text)] transition-all">
              + เพิ่มที่อยู่ใหม่
            </button>
          </div>
        )}

        {/* Address list — flat rows with dividers */}
        {!showForm && addresses.map((addr) => {
          const selected = addr.id === tempSelected;
          return (
            <div key={addr.id}>
              <button
                onClick={() => setTempSelected(addr.id)}
                className="w-full text-left px-4 py-4 flex items-start gap-3 hover:bg-[var(--km-surface)] transition-colors"
              >
                <MapPin size={15} className="flex-shrink-0 mt-0.5 text-[var(--km-text-muted)]" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="text-[15px] font-medium text-[var(--km-text)]">
                      {addr.firstName} {addr.lastName}
                    </span>
                    <span className="text-[13px] text-[var(--km-text-muted)]">{addr.phone}</span>
                    {addr.label && (
                      <span className="text-[13px] font-medium border border-[var(--km-border)] text-[var(--km-text-secondary)] px-2 py-0.5 rounded-full">
                        {addr.label}
                      </span>
                    )}
                    {addr.isDefault && isLoggedIn && (
                      <span className="text-[13px] font-medium text-[var(--km-success)]">
                        ค่าเริ่มต้น
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] text-[var(--km-text-secondary)] leading-relaxed">
                    {addr.address}, {addr.district}, {addr.province} {addr.postalCode}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(addr.id);
                      setShowForm(true);
                    }}
                    className="p-1.5 text-[var(--km-text-muted)] hover:text-[var(--km-text)] transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <div className="w-[18px] flex items-center justify-center ml-0.5">
                    {selected && <Check size={15} strokeWidth={2.5} style={{ color: "var(--km-success)" }} />}
                  </div>
                </div>
              </button>
              <div className="h-px bg-[var(--km-border)]" />
            </div>
          );
        })}

        {/* Add new address button */}
        {!showForm && (
          <button
            onClick={() => { setEditingId(null); setShowForm(true); }}
            className="w-full px-4 py-4 flex items-center gap-3 text-[var(--km-text-secondary)] hover:bg-[var(--km-surface)] transition-colors"
          >
            <Plus size={16} />
            <span className="text-[15px] font-medium">เพิ่มที่อยู่ใหม่</span>
          </button>
        )}

        {/* Address form */}
        {showForm && (
          <AddressForm
            initial={
              editingId
                ? addresses.find((a) => a.id === editingId) ?? { phone: defaultPhone || (!isLoggedIn ? guestContact.phone : "") }
                : { phone: defaultPhone || (!isLoggedIn ? guestContact.phone : "") }
            }
            initialIsDefault={editingId ? (addresses.find((a) => a.id === editingId)?.isDefault ?? false) : addresses.length === 0}
            onSave={handleAdd}
            onSaveReady={(fn) => setSaveCallback(() => fn)}
            onDirtyChange={setIsDirty}
          >
            {/* Desktop inline CTA */}
            <div className="hidden md:block pt-4">
              <button
                onClick={() => saveCallback?.()}
                className="w-full py-3.5 rounded-full text-white text-[15px] font-medium"
                style={{ background: "var(--km-text)" }}
              >
                {editingId ? "บันทึกการแก้ไข" : "บันทึกที่อยู่"}
              </button>
            </div>
          </AddressForm>
        )}
      </div>

      {/* Fixed bottom button — portal to escape transform context */}
      {typeof document !== "undefined" && createPortal(
        <div
          className="fixed bottom-0 left-0 right-0 z-[810] md:hidden"
        >
          <div className="w-full max-w-2xl mx-auto bg-white border-t border-[var(--km-border)] px-4 pt-3"
            style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
          <div className="w-full">
            {showForm ? (
              <button
                onClick={() => saveCallback?.()}
                className="w-full py-3.5 rounded-full text-white text-[15px] font-medium"
                style={{ background: "var(--km-text)" }}
              >
                {editingId ? "บันทึกการแก้ไข" : "บันทึกที่อยู่"}
              </button>
            ) : (
              <button
                onClick={handleConfirm}
                disabled={!tempSelected}
                className="w-full py-3.5 rounded-full text-white text-[15px] font-medium transition-all disabled:opacity-40"
                style={{ background: "var(--km-text)" }}
              >
                ยืนยันที่อยู่นี้
              </button>
            )}
          </div>
          </div>
        </div>,
        document.body
      )}

      {/* Discard confirm */}
      <ConfirmDialog
        open={confirmDiscard}
        title={editingId ? "ยกเลิกการแก้ไข?" : "ยกเลิกการเพิ่มที่อยู่?"}
        description={editingId ? "ข้อมูลที่แก้ไขจะไม่ถูกบันทึก" : "ข้อมูลที่กรอกไว้จะหายไปทั้งหมด"}
        confirmLabel={editingId ? "ยกเลิกการแก้ไข" : "ยกเลิกการเพิ่ม"}
        cancelLabel="กลับไปแก้ไข"
        onConfirm={() => { setConfirmDiscard(false); setShowForm(false); setEditingId(null); }}
        onCancel={() => setConfirmDiscard(false)}
      />
    </div>
  );
}
