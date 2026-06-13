"use client";

import { useState, useEffect } from "react";
import { Check, Camera, ChevronRight, Loader2 } from "lucide-react";
import { useUserStore, useProfile } from "../../../../stores/user.store";
import { useRequireAuth } from "../../../../hooks/use-require-auth";
import { useUIStore } from "../../../../stores/ui.store";
import { BottomSheet } from "../../../../components/ui/BottomSheet";
import { FormField, inputCls } from "../../../../components/ui/FormField";
import { PhoneInput } from "../../../../components/ui/PhoneInput";
import { OtpBoxInput } from "../../../../components/ui/OtpBoxInput";
import { DatePickerSheet } from "../../../../components/ui/DatePickerSheet";

type View = "main" | "email_input" | "email_otp" | "phone_input" | "phone_otp";

const GENDER_OPTIONS = [
  { id: "male",   label: "ชาย" },
  { id: "female", label: "หญิง" },
  { id: "other",  label: "ไม่ระบุ" }
];

const GENDER_LABEL: Record<string, string> = {
  male:   "ชาย",
  female: "หญิง",
  other:  "ไม่ระบุ"
};

const THAI_MONTHS = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", 
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
];

export default function ProfilePage() {
  const isLoggedIn  = useRequireAuth();
  const profile     = useProfile();
  const update      = useUserStore((s) => s.updateProfile);
  const { setHeaderTitleOverride, setHeaderBackOverride } = useUIStore();

  const [view, setView] = useState<View>("main");
  const [isNameSheetOpen, setIsNameSheetOpen] = useState(false);
  const [isGenderSheetOpen, setIsGenderSheetOpen] = useState(false);
  const [isBirthdaySheetOpen, setIsBirthdaySheetOpen] = useState(false);
  const [tempGender, setTempGender] = useState("");
  const [isContactSheetOpen, setIsContactSheetOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State (Local sync with store)
  const [firstNameInput, setFirstNameInput] = useState(() => profile.name.split(" ")[0] || "");
  const [lastNameInput, setLastNameInput] = useState(() => profile.name.split(" ").slice(1).join(" ") || "");

  // Temp states for updates
  const [tempValue, setTempValue] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  // Header Logic
  useEffect(() => {
    if (!isLoggedIn) return;
    setHeaderTitleOverride("ข้อมูลส่วนตัว");
    setHeaderBackOverride(null);
    return () => {
      setHeaderTitleOverride(null);
      setHeaderBackOverride(null);
    };
  }, [setHeaderTitleOverride, setHeaderBackOverride, isLoggedIn]);

  if (!isLoggedIn) return null;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "วว/ดด/ปปปป";
    try {
      const [y, m, d] = dateStr.split("-");
      return `${parseInt(d)} ${THAI_MONTHS[parseInt(m)-1]} ${parseInt(y)}`;
    } catch {
      return dateStr;
    }
  };

  const handleUpdateStart = (type: "email" | "phone") => {
    setTempValue("");
    setOtp(["", "", "", "", "", ""]);
    setError("");
    setCountdown(0);
    setView(type === "email" ? "email_input" : "phone_input");
    setIsContactSheetOpen(true);
  };

  const handleRequestOTP = () => {
    if (!tempValue) return;
    setError("");
    if (view === "phone_input") {
      const cleanPhone = tempValue.replace(/\s/g, "");
      if (!/^\+?[1-9]\d{6,14}$/.test(cleanPhone) && !/^0\d{9}$/.test(cleanPhone)) {
        setError("เบอร์โทรศัพท์ไม่ถูกต้อง");
        return;
      }
    } else if (view === "email_input") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tempValue)) {
        setError("อีเมลไม่ถูกต้อง");
        return;
      }
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtp(["", "", "", "", "", ""]);
      setCountdown(60);
      setView(view === "email_input" ? "email_otp" : "phone_otp");
    }, 1000);
  };

  const handleVerifyOTP = () => {
    if (!otp.every(Boolean)) return;
    setLoading(true);
    setTimeout(() => {
      const field = view === "email_otp" ? "email" : "phone";
      update({ [field]: tempValue });
      setLoading(false);
      setView("main");
      setIsContactSheetOpen(false);
    }, 1200);
  };

  const handleSaveName = () => {
    if (!firstNameInput.trim()) return;
    setLoading(true);
    setTimeout(() => {
      update({ name: [firstNameInput, lastNameInput].filter(Boolean).join(" ") });
      setLoading(false);
      setIsNameSheetOpen(false);
    }, 600);
  };

  const handleConfirmGender = () => {
    update({ gender: tempGender as any });
    setIsGenderSheetOpen(false);
  };

  // ── Main Profile View ──
  return (
    <div className="pb-24">
      {/* Avatar Section */}
      <div className="flex flex-col items-center pb-8">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-[var(--km-surface)] border border-[var(--km-border)] flex items-center justify-center overflow-hidden">
            {profile.avatar ? (
              <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl font-medium text-[var(--km-text-secondary)]">
                {profile.name.slice(0, 1)}
              </span>
            )}
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[var(--km-text)] border-2 border-white flex items-center justify-center shadow-lg">
            <Camera size={15} color="white" />
          </button>
        </div>
        <p className="mt-3 text-[13px] text-[var(--km-text-muted)]">แตะเพื่อเปลี่ยนรูปโปรไฟล์</p>
      </div>

      {/* Form Fields */}
      <div className="bg-white rounded-[24px] border border-[var(--km-border)] overflow-hidden divide-y divide-[var(--km-border)]">
        {/* Name (Now Clickable) */}
        <button onClick={() => {
          setFirstNameInput(profile.name.split(" ")[0] || "");
          setLastNameInput(profile.name.split(" ").slice(1).join(" ") || "");
          setIsNameSheetOpen(true);
        }} className="w-full text-left px-5 py-3.5 active:bg-[var(--km-surface)] transition-colors flex items-center justify-between group">
          <div>
            <label className="block text-[12px] text-[var(--km-text-muted)] mb-0.5 cursor-pointer">ชื่อ-นามสกุล</label>
            <p className="text-[15px] text-[var(--km-text)] font-normal">{profile.name}</p>
          </div>
          <ChevronRight size={16} className="text-[var(--km-text-muted)]" />
        </button>

        {/* Gender (Now Clickable with BottomSheet) */}
        <button onClick={() => { setTempGender(profile.gender || "female"); setIsGenderSheetOpen(true); }} className="w-full text-left px-5 py-3.5 active:bg-[var(--km-surface)] transition-colors flex items-center justify-between group">
          <div>
            <label className="block text-[12px] text-[var(--km-text-muted)] mb-0.5 cursor-pointer">เพศ</label>
            <p className="text-[15px] text-[var(--km-text)] font-normal">{GENDER_LABEL[profile.gender || "female"]}</p>
          </div>
          <ChevronRight size={16} className="text-[var(--km-text-muted)]" />
        </button>

        {/* Birthday */}
        <button
          onClick={() => setIsBirthdaySheetOpen(true)}
          className="w-full text-left px-5 py-3.5 active:bg-[var(--km-surface)] transition-colors flex items-center justify-between group"
        >
          <div>
            <label className="block text-[12px] text-[var(--km-text-muted)] mb-0.5 cursor-pointer">วันเกิด</label>
            <p className="text-[15px] text-[var(--km-text)] font-normal">{formatDate(profile.birthday || "1995-05-14")}</p>
          </div>
          <ChevronRight size={16} className="text-[var(--km-text-muted)]" />
        </button>

        {/* Email (Clickable) */}
        <button onClick={() => handleUpdateStart("email")} className="w-full text-left px-5 py-3.5 active:bg-[var(--km-surface)] transition-colors flex items-center justify-between group">
          <div>
            <label className="block text-[12px] text-[var(--km-text-muted)] mb-0.5 cursor-pointer">อีเมล</label>
            <p className="text-[15px] text-[var(--km-text)] font-normal">{profile.email}</p>
          </div>
          <ChevronRight size={16} className="text-[var(--km-text-muted)]" />
        </button>

        {/* Phone (Clickable) */}
        <button onClick={() => handleUpdateStart("phone")} className="w-full text-left px-5 py-3.5 active:bg-[var(--km-surface)] transition-colors flex items-center justify-between group">
          <div>
            <label className="block text-[12px] text-[var(--km-text-muted)] mb-0.5 cursor-pointer">เบอร์โทรศัพท์</label>
            <p className="text-[15px] text-[var(--km-text)] font-normal">{profile.phone}</p>
          </div>
          <ChevronRight size={16} className="text-[var(--km-text-muted)]" />
        </button>
      </div>

      {/* Name BottomSheet */}
      <BottomSheet
        isOpen={isNameSheetOpen}
        onClose={() => setIsNameSheetOpen(false)}
        title="แก้ไขชื่อ-นามสกุล"
        footer={
          <button
            onClick={handleSaveName}
            disabled={!firstNameInput.trim() || loading}
            className="w-full h-12 rounded-full bg-[var(--km-text)] text-white text-[15px] font-medium disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            บันทึก
          </button>
        }
      >
        <div className="px-6 py-4 flex flex-col gap-4">
          <FormField label="ชื่อ">
            <input
              autoFocus
              value={firstNameInput}
              onChange={(e) => setFirstNameInput(e.target.value)}
              placeholder="ระบุชื่อ"
              className={inputCls()}
            />
          </FormField>
          <FormField label="นามสกุล">
            <input
              value={lastNameInput}
              onChange={(e) => setLastNameInput(e.target.value)}
              placeholder="ระบุนามสกุล"
              className={inputCls()}
            />
          </FormField>
        </div>
      </BottomSheet>

      {/* Email/Phone + OTP BottomSheet */}
      <BottomSheet
        isOpen={isContactSheetOpen}
        onClose={() => { setIsContactSheetOpen(false); setView("main"); setError(""); }}
        title={view.startsWith("email") ? "เปลี่ยนอีเมล" : "เปลี่ยนเบอร์โทรศัพท์"}
        footer={
          (view === "email_input" || view === "phone_input") ? (
            <button
              onClick={handleRequestOTP}
              disabled={!tempValue || loading}
              className="w-full h-12 rounded-full bg-[var(--km-text)] text-white text-[15px] font-medium disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              ส่งรหัส OTP
            </button>
          ) : undefined
        }
      >
        {(view === "email_input" || view === "phone_input") && (
          <div className="px-6 py-4">
            <FormField label={view === "email_input" ? "อีเมลใหม่" : "เบอร์โทรศัพท์ใหม่"} error={error}>
              {view === "email_input" ? (
                <input
                  autoFocus
                  type="email"
                  value={tempValue}
                  onChange={(e) => { setTempValue(e.target.value); setError(""); }}
                  placeholder="ระบุอีเมลใหม่"
                  className={inputCls(error)}
                />
              ) : (
                <PhoneInput
                  value={tempValue}
                  onChange={(val) => { setTempValue(val); setError(""); }}
                  error={!!error}
                />
              )}
            </FormField>
          </div>
        )}
        {(view === "email_otp" || view === "phone_otp") && (
          <div className="px-6 pt-4 pb-6">
            <p className="text-[14px] text-[var(--km-text-secondary)] mb-8">
              ระบบได้ส่งรหัสไปยัง{" "}
              <span className="text-[var(--km-text)] font-medium">{tempValue}</span>{" "}
              <span className="text-[var(--km-text-muted)] text-[13px]">(123456)</span>
            </p>
            <OtpBoxInput
              digits={6}
              value={otp}
              onChange={setOtp}
              onSubmit={handleVerifyOTP}
              loading={loading}
              error={error}
              countdown={countdown}
              onResend={() => {
                setOtp(["", "", "", "", "", ""]);
                setCountdown(60);
              }}
              submitLabel="ยืนยันรหัส"
            />
          </div>
        )}
      </BottomSheet>

      {/* Birthday Picker */}
      <DatePickerSheet
        isOpen={isBirthdaySheetOpen}
        onClose={() => setIsBirthdaySheetOpen(false)}
        value={profile.birthday || "1995-05-14"}
        onChange={(v) => update({ birthday: v })}
      />

      {/* Gender BottomSheet */}
      <BottomSheet
        isOpen={isGenderSheetOpen}
        onClose={() => setIsGenderSheetOpen(false)}
        title="เลือกเพศ"
        footer={
          <button
            onClick={handleConfirmGender}
            className="w-full h-12 rounded-full bg-[var(--km-text)] text-white text-[15px] font-medium"
          >
            ยืนยัน
          </button>
        }
      >
        <div className="flex flex-col divide-y divide-[var(--km-border)]">
          {GENDER_OPTIONS.map((opt) => {
            const isSelected = tempGender === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setTempGender(opt.id)}
                className="w-full flex items-center justify-between px-6 py-4 active:bg-[var(--km-surface)] transition-colors text-left"
              >
                <span className="text-[16px] text-[var(--km-text)] font-normal">
                  {opt.label}
                </span>
                {isSelected && (
                  <Check size={20} strokeWidth={3} className="text-[var(--km-text)]" />
                )}
              </button>
            );
          })}
        </div>
      </BottomSheet>
    </div>
  );
}
