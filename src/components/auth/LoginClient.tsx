"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, Mail, Phone, ChevronDown } from "lucide-react";
import { CalendarBlank } from "@phosphor-icons/react";
import { useAuthStore } from "@/stores/auth.store";
import { useUIStore } from "@/stores/ui.store";
import { useLang } from "@/contexts/lang";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { OtpBoxInput } from "@/components/ui/OtpBoxInput";
import { DatePickerSheet } from "@/components/ui/DatePickerSheet";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Check } from "lucide-react";

type LoginStep = "input" | "otp" | "register" | "register-otp";
type AuthMethod = "phone" | "email";

interface LoginState {
  step: LoginStep;
  authMethod: AuthMethod;
  input: string;
  otp: string[];
  loading: boolean;
  error: string;
  countdown: number;
}

const MOCK_OTP = "123456";

function isEmail(val: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val); }
function isPhone(val: string) {
  const clean = val.replace(/\s/g, "");
  return /^\+?[1-9]\d{6,14}$/.test(clean) || /^0\d{9}$/.test(clean);
}

export function LoginClient() {
  const { login: lt } = useLang();
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get("redirect") ?? "/account";

  const login = useAuthStore((s) => s.login);
  const setHeaderLocked = useUIStore((s) => s.setHeaderLocked);

  const [state, setState] = useState<LoginState>({
    step: "input",
    authMethod: "phone",
    input: "",
    otp: ["", "", "", "", "", ""],
    loading: false,
    error: "",
    countdown: 0
  });

  const [regData, setRegData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    email: "",
    phone: "",
    isSecondaryVerified: false
  });

  const [secCountdown, setSecCountdown] = useState(0);
  const [isDobPickerOpen, setIsDobPickerOpen] = useState(false);
  const [isGenderOpen, setIsGenderOpen] = useState(false);

  useEffect(() => {
    setHeaderLocked(true);
    return () => setHeaderLocked(false);
  }, [setHeaderLocked]);

  useEffect(() => {
    if (state.countdown <= 0) return;
    const t = setInterval(() => setState(s => ({ ...s, countdown: s.countdown - 1 })), 1000);
    return () => clearInterval(t);
  }, [state.countdown]);

  useEffect(() => {
    if (secCountdown <= 0) return;
    const t = setInterval(() => setSecCountdown(c => c - 1), 1000);
    return () => clearInterval(t);
  }, [secCountdown]);

  const handleSendOtp = async () => {
    const rawValue = state.input.replace(/\s/g, "");
    const isValid = state.authMethod === "phone" ? isPhone(rawValue) : isEmail(state.input);
    
    if (!isValid) {
      setState(s => ({ 
        ...s, 
        error: state.authMethod === "phone" ? lt.errorPhone : lt.errorEmail
      }));
      return;
    }

    setState(s => ({ ...s, loading: true, error: "" }));
    await new Promise(r => setTimeout(r, 1000));
    setState(s => ({ ...s, step: "otp", loading: false, countdown: 60 }));
  };

  const handleOtpChange = (next: string[]) => {
    setState(s => ({ ...s, otp: next, error: "" }));
  };

  const handleOtpSubmit = async () => {
    const otpValue = state.otp.join("");
    if (otpValue !== MOCK_OTP) {
      setState(s => ({ ...s, error: lt.errorOtp }));
      return;
    }

    setState(s => ({ ...s, loading: true }));
    await new Promise(r => setTimeout(r, 800));

    if (state.step === "otp") {
      if (state.authMethod === "phone") {
        login(state.input.replace(/\s/g, ""));
        router.replace(redirectTo);
      } else {
        setRegData(d => ({ ...d, email: state.input }));
        setState(s => ({ ...s, step: "register", loading: false, otp: ["", "", "", "", "", ""] }));
      }
    } else if (state.step === "register-otp") {
      setRegData(d => ({ ...d, isSecondaryVerified: true }));
      setState(s => ({ ...s, step: "register", loading: false, otp: ["", "", "", "", "", ""] }));
    }
  };

  const handleRequestSecOtp = async () => {
    const val = state.authMethod === "email" ? regData.phone : regData.email;
    if (!val) return;
    setState(s => ({ ...s, loading: true, error: "" }));
    await new Promise(r => setTimeout(r, 1000));
    setSecCountdown(60);
    setState(s => ({ ...s, step: "register-otp", loading: false, countdown: 60, otp: ["", "", "", "", "", ""] }));
  };

  const handleRegister = async () => {
    if (!regData.firstName || !regData.lastName || !regData.gender) return;
    setState(s => ({ ...s, loading: true }));
    await new Promise(r => setTimeout(r, 1200));
    login(state.input);
    router.replace(redirectTo);
  };

  return (
    <div className="fixed inset-0 bg-white z-[var(--z-modal)] flex flex-col overflow-hidden font-sans">
      {/* Header */}
      <div className="flex items-center justify-center h-14 border-b border-[var(--km-border)] flex-shrink-0 z-10 bg-white">
        <button
          onClick={() => {
            if (state.step === "otp") setState(s => ({ ...s, step: "input", otp: ["", "", "", "", "", ""] }));
            else if (state.step === "register") setState(s => ({ ...s, step: "input" }));
            else if (state.step === "register-otp") setState(s => ({ ...s, step: "register" }));
            else router.back();
          }}
          className="absolute left-4 p-1 text-[var(--km-text)]"
        >
          <ArrowLeft size={20} />
        </button>
        <img src="/logo.png" alt="SafeScreen" className="h-6 w-auto object-contain" />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-md mx-auto w-full px-6 pt-10 pb-32">
          {state.step === "input" && (
            <>
              <h1 className="text-[20px] font-semibold text-[var(--km-text)] mb-2">{lt.title}</h1>
              <p className="text-[14px] text-[var(--km-text-secondary)] mb-10 font-normal">{lt.subtitle}</p>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-[var(--km-text-secondary)] pl-1">
                    {state.authMethod === "phone" ? lt.phoneLabel : lt.emailLabel}
                  </label>
                  {state.authMethod === "phone" ? (
                    <PhoneInput
                      autoFocus
                      value={state.input}
                      onChange={val => setState(s => ({ ...s, input: val, error: "" }))}
                      error={!!state.error}
                    />
                  ) : (
                    <input
                      autoFocus
                      type="email"
                      inputMode="email"
                      value={state.input}
                      onChange={e => setState(s => ({ ...s, input: e.target.value, error: "" }))}
                      placeholder={lt.emailPlaceholder}
                      className="w-full h-12 px-5 rounded-2xl border border-[var(--km-border)] text-[13px] outline-none"
                    />
                  )}
                  {state.error && <p className="text-xs text-[var(--km-error)] pl-2">{state.error}</p>}
                </div>
                
                <button
                  onClick={handleSendOtp}
                  disabled={!state.input || state.loading}
                  className="w-full h-12 rounded-full bg-[var(--km-text)] text-white text-[14px] font-medium flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {state.loading ? <Loader2 className="animate-spin" size={20} /> : lt.getOtp}
                </button>
              </div>

              <div className="mt-16 mb-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-[var(--km-border)]" />
                <span className="text-[13px] text-[var(--km-text-muted)] font-normal">{lt.orWith}</span>
                <div className="h-px flex-1 bg-[var(--km-border)]" />
              </div>

              <div className="space-y-3">
                <button
                  onClick={async () => {
                    setState(s => ({ ...s, loading: true }));
                    await new Promise(r => setTimeout(r, 1000));
                    login("google-user@gmail.com");
                    router.replace(redirectTo);
                  }}
                  disabled={state.loading}
                  className="flex items-center justify-center gap-3 w-full h-14 border border-[var(--km-border)] rounded-full hover:bg-[var(--km-surface)] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {state.loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="20" height="20" alt="Google" />
                      <span className="text-[15px] font-medium text-[var(--km-text)]">{lt.continueGoogle}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={async () => {
                    setState(s => ({ ...s, loading: true }));
                    await new Promise(r => setTimeout(r, 1000));
                    login("line-user@line.me");
                    router.replace(redirectTo);
                  }}
                  disabled={state.loading}
                  className="flex items-center justify-center gap-3 w-full h-14 rounded-full active:scale-[0.98] transition-all disabled:opacity-50"
                  style={{ background: "#06C755" }}
                >
                  {state.loading ? (
                    <Loader2 className="animate-spin text-white" size={20} />
                  ) : (
                    <>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.105.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                      </svg>
                      <span className="text-[15px] font-medium text-white">{lt.continueLine}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setState(s => ({ ...s, authMethod: s.authMethod === "phone" ? "email" : "phone", input: "", error: "" }))}
                  className="flex items-center justify-center gap-3 w-full h-14 border border-[var(--km-border)] rounded-full transition-all"
                >
                  {state.authMethod === "phone" ? <Mail size={19} className="text-[var(--km-text-secondary)]" /> : <Phone size={19} className="text-[var(--km-text-secondary)]" />}
                  <span className="text-[15px] font-medium text-[var(--km-text)]">
                    {state.authMethod === "phone" ? lt.switchToEmail : lt.switchToPhone}
                  </span>
                </button>
              </div>

              <div className="mt-8 text-center">
                <button 
                  onClick={() => router.replace(redirectTo)}
                  className="text-[13px] text-[var(--km-text-secondary)] font-normal hover:text-[var(--km-text)] transition-colors"
                >
                  {lt.continueAsGuest}
                </button>
              </div>
            </>
          )}

          {(state.step === "otp" || state.step === "register-otp") && (
            <div className="space-y-8">
              <div>
                <h1 className="text-[20px] font-semibold text-[var(--km-text)] mb-2">{lt.otpTitle}</h1>
                <p className="text-[14px] text-[var(--km-text-secondary)] mb-10 font-normal">
                  {lt.otpSent} <span className="text-[var(--km-text)] font-medium">
                    {state.step === "otp" ? state.input : (state.authMethod === "email" ? regData.phone : regData.email)}
                  </span>
                  <span className="text-[13px] text-[var(--km-text-muted)] ml-1.5">({MOCK_OTP})</span>
                </p>
              </div>

              <OtpBoxInput
                digits={6}
                value={state.otp}
                onChange={handleOtpChange}
                onSubmit={handleOtpSubmit}
                loading={state.loading}
                error={state.error}
                countdown={state.countdown}
                onResend={() => {}}
              />
            </div>
          )}

          {state.step === "register" && (
            <div className="space-y-8">
              <div>
                <h1 className="text-[20px] font-semibold text-[var(--km-text)] mb-2">{lt.registerTitle}</h1>
                <p className="text-[14px] text-[var(--km-text-secondary)] mb-10 font-normal">{lt.registerSubtitle}</p>
              </div>

              <div className="space-y-5">
                {/* Avatar Upload */}
                <div className="flex flex-col items-center pb-4">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-[var(--km-surface)] border-2 border-dashed border-[var(--km-border)] flex items-center justify-center overflow-hidden transition-all cursor-pointer">
                      <div className="flex flex-col items-center text-[var(--km-text-muted)]">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                        <span className="text-[10px] mt-1 font-medium">{lt.addPhoto}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-[var(--km-text-secondary)] pl-1">{lt.firstName}</label>
                    <input
                      type="text"
                      value={regData.firstName}
                      onChange={e => setRegData(d => ({ ...d, firstName: e.target.value }))}
                      placeholder={lt.firstNamePlaceholder}
                      className="w-full h-12 px-4 rounded-2xl border border-[var(--km-border)] text-[13px] outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-[var(--km-text-secondary)] pl-1">{lt.lastName}</label>
                    <input
                      type="text"
                      value={regData.lastName}
                      onChange={e => setRegData(d => ({ ...d, lastName: e.target.value }))}
                      placeholder={lt.lastNamePlaceholder}
                      className="w-full h-12 px-4 rounded-2xl border border-[var(--km-border)] text-[13px] outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-[var(--km-text-secondary)] pl-1">{lt.dob}</label>
                  <button
                    type="button"
                    onClick={() => setIsDobPickerOpen(true)}
                    className="w-full h-12 px-4 pr-12 rounded-2xl border border-[var(--km-border)] text-[13px] text-left outline-none flex items-center relative"
                  >
                    <span className={regData.dob ? "text-[var(--km-text)]" : "text-[var(--km-text-muted)]"}>
                      {regData.dob ? (() => {
                        const [y, m, d] = regData.dob.split("-").map(Number);
                        const MONTHS = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
                        return `${d} ${MONTHS[m-1]} ${y}`;
                      })() : "วว/ดด/ปปปป"}
                    </span>
                    <CalendarBlank size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--km-text-muted)]" />
                  </button>
                  <DatePickerSheet
                    isOpen={isDobPickerOpen}
                    onClose={() => setIsDobPickerOpen(false)}
                    value={regData.dob || "2008-01-01"}
                    onChange={(v) => setRegData(d => ({ ...d, dob: v }))}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-[var(--km-text-secondary)] pl-1">{lt.gender}</label>
                  <button
                    type="button"
                    onClick={() => setIsGenderOpen(true)}
                    className="w-full h-12 px-4 pr-10 rounded-2xl border border-[var(--km-border)] text-[13px] text-left flex items-center relative"
                  >
                    <span className={regData.gender ? "text-[var(--km-text)]" : "text-[var(--km-text-muted)]"}>
                      {regData.gender === "male" ? lt.genderMale : regData.gender === "female" ? lt.genderFemale : regData.gender === "other" ? lt.genderOther : lt.genderPlaceholder}
                    </span>
                    <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--km-text-muted)]" />
                  </button>
                  <BottomSheet
                    isOpen={isGenderOpen}
                    onClose={() => setIsGenderOpen(false)}
                    title={lt.genderSheetTitle}
                    footer={
                      <button
                        onClick={() => setIsGenderOpen(false)}
                        className="w-full h-12 rounded-full bg-[var(--km-text)] text-white text-[15px] font-medium"
                      >
                        {lt.confirm}
                      </button>
                    }
                  >
                    <div className="flex flex-col divide-y divide-[var(--km-border)]">
                      {[{ id: "male", label: lt.genderMale }, { id: "female", label: lt.genderFemale }, { id: "other", label: lt.genderOther }].map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setRegData(d => ({ ...d, gender: opt.id }))}
                          className="w-full flex items-center justify-between px-6 py-4 active:bg-[var(--km-surface)] transition-colors text-left"
                        >
                          <span className="text-[16px] text-[var(--km-text)]">{opt.label}</span>
                          {regData.gender === opt.id && <Check size={20} strokeWidth={3} className="text-[var(--km-text)]" />}
                        </button>
                      ))}
                    </div>
                  </BottomSheet>
                </div>

                <div className="pt-2 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-[var(--km-text-secondary)] pl-1">{lt.emailLabel}</label>
                    <div className="relative">
                      <input
                        type="email"
                        value={state.authMethod === "email" ? state.input : regData.email}
                        disabled={state.authMethod === "email"}
                        onChange={e => setRegData(d => ({ ...d, email: e.target.value }))}
                        placeholder={lt.emailPlaceholder}
                        className="w-full h-12 px-4 rounded-2xl border border-[var(--km-border)] text-[13px] disabled:bg-white disabled:text-[var(--km-text-muted)] outline-none"
                      />
                      {state.authMethod === "email" && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-medium text-green-600">{lt.verified}</span>}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-[var(--km-text-secondary)] pl-1">{lt.phoneLabel}</label>
                    <div className="relative flex gap-2 items-center">
                      {(state.authMethod === "phone" || regData.isSecondaryVerified) ? (
                        <div className="relative flex-1">
                          <input
                            type="tel"
                            value={state.authMethod === "phone" ? state.input : regData.phone}
                            disabled
                            className="w-full h-12 px-4 rounded-2xl border border-[var(--km-border)] bg-white text-[13px] text-[var(--km-text-muted)] outline-none"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-medium text-green-600">{lt.verified}</span>
                        </div>
                      ) : (
                        <div className="relative flex-1">
                          <PhoneInput
                            value={regData.phone}
                            onChange={val => setRegData(d => ({ ...d, phone: val }))}
                          />
                          <button
                            onClick={handleRequestSecOtp}
                            disabled={!regData.phone || secCountdown > 0}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-medium text-[var(--km-text)] disabled:text-[var(--km-text-muted)] transition-colors whitespace-nowrap"
                          >
                            {secCountdown > 0 ? `${lt.waitOtp} (${secCountdown}s)` : lt.getOtpShort}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Footer for CTA Buttons */}
      {state.step === "register" && (
        <div className="sticky bottom-0 bg-white border-t border-[var(--km-border)] p-6 pt-4 pb-[calc(16px+env(safe-area-inset-bottom))] z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
          <div className="max-w-md mx-auto w-full">
            <button
              onClick={handleRegister}
              disabled={!regData.firstName || !regData.lastName || !regData.gender}
              className="w-full h-12 rounded-full bg-[var(--km-text)] text-white text-[14px] font-medium active:scale-[0.98] transition-all disabled:opacity-30"
            >
              {state.loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : lt.registerCta}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
