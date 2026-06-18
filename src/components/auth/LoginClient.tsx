"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, User } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { useUIStore } from "@/stores/ui.store";
import { OtpBoxInput } from "@/components/ui/OtpBoxInput";

// ── Types ─────────────────────────────────────────────────────────────────────

type AuthStep = "login" | "register" | "otp" | "set-password" | "create-profile";

// ── Constants ─────────────────────────────────────────────────────────────────

const MOCK_OTP = "1234";
const BRAND_YELLOW = "#F5A600";

// ── Subcomponents ─────────────────────────────────────────────────────────────

function CardLogo() {
  return (
    <div className="mb-7">
      {/* Try image logo first, fallback to text */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.svg"
        alt="SAFESCREEN"
        className="h-8 object-contain"
        onError={(e) => {
          const el = e.currentTarget;
          el.style.display = "none";
          const next = el.nextElementSibling as HTMLElement | null;
          if (next) next.style.display = "block";
        }}
      />
      <span
        className="hidden font-black tracking-widest text-[20px]"
        style={{ color: BRAND_YELLOW, display: "none" }}
      >
        SAFESCREEN
      </span>
    </div>
  );
}

function IconInput({
  icon,
  type = "text",
  value,
  onChange,
  placeholder,
  autoFocus = false,
  hasError = false,
  rightSlot,
}: {
  icon: React.ReactNode;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  autoFocus?: boolean;
  hasError?: boolean;
  rightSlot?: React.ReactNode;
}) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--km-text-muted)] pointer-events-none">
        {icon}
      </span>
      <input
        type={type}
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full h-12 pl-10 rounded-xl border text-[14px] outline-none transition-colors ${
          rightSlot ? "pr-12" : "pr-4"
        } ${
          hasError
            ? "border-[var(--km-error)]"
            : "border-[var(--km-border)] focus:border-[var(--km-border-strong)]"
        }`}
      />
      {rightSlot && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">{rightSlot}</div>
      )}
    </div>
  );
}

function ActionButton({
  onClick,
  disabled,
  loading,
  children,
  variant = "primary",
}: {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  variant?: "primary" | "outline";
}) {
  if (variant === "outline") {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className="flex-1 h-12 rounded-xl border border-[var(--km-border)] text-[14px] font-medium text-[var(--km-text)] transition-all active:scale-[0.98] disabled:opacity-40"
      >
        {children}
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="flex-1 h-12 rounded-xl text-[14px] font-medium transition-all active:scale-[0.98] disabled:opacity-40 flex items-center justify-center"
      style={{ background: "#E5E5E5", color: "#1A1A1A" }}
    >
      {loading ? <Loader2 className="animate-spin" size={18} /> : children}
    </button>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────

const PersonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 1 0-16 0" />
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const PencilIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

// ── Main Component ─────────────────────────────────────────────────────────────

export function LoginClient() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get("redirect") ?? "/account";

  const login = useAuthStore((s) => s.login);
  const setHeaderLocked = useUIStore((s) => s.setHeaderLocked);

  // ── State ──────────────────────────────────────────────────────────────────

  const [step, setStep]                         = useState<AuthStep>("login");
  const [input, setInput]                       = useState("");
  const [password, setPassword]                 = useState("");
  const [confirmPassword, setConfirmPassword]   = useState("");
  const [showPw, setShowPw]                     = useState(false);
  const [showConfirmPw, setShowConfirmPw]       = useState(false);
  const [name, setName]                         = useState("");
  const [agreed, setAgreed]                     = useState(false);
  const [otp, setOtp]                           = useState(["", "", "", "", "", ""]);
  const [error, setError]                       = useState("");
  const [loading, setLoading]                   = useState(false);
  const [countdown, setCountdown]               = useState(0);

  useEffect(() => {
    setHeaderLocked(true);
    return () => setHeaderLocked(false);
  }, [setHeaderLocked]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleLogin = async () => {
    if (!input || !password) { setError("กรุณากรอกอีเมล/เบอร์โทรและรหัสผ่าน"); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    // Mock: any password except "wrong" works
    if (password === "wrong") {
      setError("อีเมล/รหัสผ่านไม่ถูกต้อง");
      setLoading(false);
      return;
    }
    login(input);
    router.replace(redirectTo);
  };

  const handleSendOtp = async () => {
    if (!input || !agreed) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setStep("otp");
    setCountdown(30);
    setOtp(["", "", "", "", "", ""]);
    setError("");
  };

  const handleOtpConfirm = async () => {
    const code = otp.join("");
    if (code.length < 4) { setError("กรุณากรอกรหัส OTP ให้ครบ"); return; }
    if (code !== MOCK_OTP) { setError("รหัส OTP ไม่ถูกต้อง"); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setPassword("");
    setConfirmPassword("");
    setStep("set-password");
    setError("");
  };

  const handleSetPassword = () => {
    if (password.length < 8) { setError("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"); return; }
    if (password !== confirmPassword) { setError("รหัสผ่านไม่ตรงกัน"); return; }
    setStep("create-profile");
    setError("");
  };

  const handleCreateProfile = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    login(input);
    router.replace(redirectTo);
  };

  // ── Password requirement checks ────────────────────────────────────────────

  const pwChecks = {
    length:  password.length >= 8,
    number:  /\d/.test(password),
    letter:  /[a-zA-Z]/.test(password),
    special: /[^a-zA-Z0-9]/.test(password),
  };

  // ── Page wrapper ──────────────────────────────────────────────────────────

  return (
    <div
      className="fixed inset-0 z-[var(--z-modal)] flex"
      style={{ background: BRAND_YELLOW }}
    >
      {/* Left yellow panel — desktop only */}
      <div className="hidden md:flex flex-1" />

      {/* Right white panel */}
      <div className="w-full md:w-1/2 bg-white flex flex-col overflow-y-auto px-10">
        <div className="flex flex-col justify-center flex-1 max-w-[380px] mx-auto w-full py-10">

          <CardLogo />

        {/* ── STEP: LOGIN ───────────────────────────────────────────────────── */}
        {step === "login" && (
          <>
            <h1 className="text-[20px] font-bold text-[var(--km-text)] mb-1">เข้าสู่ระบบ</h1>
            <p className="text-[13px] text-[var(--km-text-muted)] mb-7 leading-relaxed">
              ใช้บัญชีอีเมลหรือเบอร์โทรศัพท์ในการเข้าสู่ระบบ
            </p>

            <div className="space-y-3">
              <IconInput
                icon={<PersonIcon />}
                value={input}
                onChange={(v) => { setInput(v); setError(""); }}
                placeholder="อีเมล"
                autoFocus
              />
              <IconInput
                icon={<LockIcon />}
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(v) => { setPassword(v); setError(""); }}
                placeholder="รหัสผ่าน"
                hasError={!!error}
                rightSlot={
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="text-[var(--km-text-muted)] hover:text-[var(--km-text)] transition-colors"
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />
              {error && <p className="text-[12px] text-[var(--km-error)] pl-1">{error}</p>}
            </div>

            <button
              onClick={handleLogin}
              disabled={!input || !password || loading}
              className="mt-6 w-full h-12 rounded-xl text-[14px] font-medium transition-all active:scale-[0.98] disabled:opacity-40 flex items-center justify-center"
              style={{ background: "#E5E5E5", color: "#1A1A1A" }}
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "เข้าสู่ระบบ"}
            </button>

            <p className="mt-6 text-center text-[13px] text-[var(--km-text-muted)]">
              ยังไม่มีบัญชี?{" "}
              <button
                onClick={() => { setStep("register"); setError(""); setPassword(""); }}
                className="font-semibold text-[var(--km-text)] underline underline-offset-2"
              >
                ลงทะเบียนผู้ใช้ใหม่
              </button>
            </p>
          </>
        )}

        {/* ── STEP: REGISTER ───────────────────────────────────────────────── */}
        {step === "register" && (
          <>
            <h1 className="text-[20px] font-bold text-[var(--km-text)] mb-1">ลงทะเบียนผู้ใช้ใหม่</h1>
            <p className="text-[13px] text-[var(--km-text-muted)] mb-7 leading-relaxed">
              ใช้บัญชีอีเมลหรือเบอร์โทรศัพท์ในการลงทะเบียน
            </p>

            <div className="space-y-4">
              <IconInput
                icon={<PersonIcon />}
                value={input}
                onChange={(v) => { setInput(v); setError(""); }}
                placeholder="อีเมล / เบอร์โทรศัพท์"
                autoFocus
              />

              {/* Terms checkbox */}
              <label className="flex items-start gap-3 cursor-pointer">
                <button
                  type="button"
                  onClick={() => setAgreed(!agreed)}
                  className={`mt-0.5 w-5 h-5 flex-shrink-0 rounded border-2 flex items-center justify-center transition-colors ${
                    agreed
                      ? "bg-[var(--km-text)] border-[var(--km-text)]"
                      : "border-[var(--km-border-strong)]"
                  }`}
                >
                  {agreed && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
                <span className="text-[12px] text-[var(--km-text-secondary)] leading-relaxed">
                  ข้าพเจ้ายืนยัน อายุมากกว่า 18 ปีขึ้นไป รับทราบข้อตกลง{" "}
                  <a href="/privacy-policy" target="_blank" className="text-[var(--km-text)] underline font-medium">นโยบายความเป็นส่วนตัว</a>{" "}
                  และ{" "}
                  <a href="/terms" target="_blank" className="text-[var(--km-text)] underline font-medium">ข้อกำหนดการใช้งาน</a>
                </span>
              </label>
            </div>

            <button
              onClick={handleSendOtp}
              disabled={!input || !agreed || loading}
              className="mt-6 w-full h-12 rounded-xl text-[14px] font-medium transition-all active:scale-[0.98] disabled:opacity-40 flex items-center justify-center"
              style={{ background: "#E5E5E5", color: "#1A1A1A" }}
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "ส่งรหัสยืนยัน"}
            </button>

            <p className="mt-6 text-center text-[13px] text-[var(--km-text-muted)]">
              มีบัญชีอยู่แล้ว?{" "}
              <button
                onClick={() => { setStep("login"); setError(""); }}
                className="font-semibold text-[var(--km-text)] underline underline-offset-2"
              >
                เข้าสู่ระบบ
              </button>
            </p>
          </>
        )}

        {/* ── STEP: OTP ─────────────────────────────────────────────────────── */}
        {step === "otp" && (
          <>
            <h1 className="text-[20px] font-bold text-[var(--km-text)] mb-2">เราได้ส่งรหัส OTP ไปที่</h1>
            <p className="text-[15px] font-semibold text-[var(--km-text)] mb-1">{input}</p>
            <p className="text-[13px] text-[var(--km-text-muted)] mb-8 leading-relaxed">
              กรุณากรอกรหัสยืนยัน 6 หลัก ที่ส่งไปยัง
            </p>

            <OtpBoxInput
              digits={6}
              value={otp}
              onChange={(v) => { setOtp(v); setError(""); }}
              loading={loading}
              error={error}
              countdown={countdown}
              onResend={() => setCountdown(30)}
            />

            {/* Mock OTP hint */}
            <p className="text-[12px] text-[var(--km-text-muted)] mt-4 text-center">
              รหัสยืนยัน{" "}
              <span className="font-mono font-semibold text-[var(--km-text)] tracking-widest">
                {MOCK_OTP}
              </span>
            </p>

            <div className="mt-6 flex gap-3">
              <ActionButton
                variant="outline"
                onClick={() => { setStep("register"); setOtp(["", "", "", "", "", ""]); setError(""); }}
              >
                ย้อนกลับ
              </ActionButton>
              <ActionButton
                onClick={handleOtpConfirm}
                disabled={otp.join("").length < 4}
                loading={loading}
              >
                ดำเนินการต่อ
              </ActionButton>
            </div>
          </>
        )}

        {/* ── STEP: SET PASSWORD ────────────────────────────────────────────── */}
        {step === "set-password" && (
          <>
            <h1 className="text-[20px] font-bold text-[var(--km-text)] mb-1">ตั้งรหัสผ่าน</h1>
            <p className="text-[13px] text-[var(--km-text-muted)] mb-7">{input}</p>

            <div className="space-y-3">
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  autoFocus
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="รหัสผ่าน"
                  className="w-full h-12 pl-4 pr-11 rounded-xl border border-[var(--km-border)] text-[14px] outline-none focus:border-[var(--km-border-strong)] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--km-text-muted)] hover:text-[var(--km-text)] transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showConfirmPw ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                  placeholder="ยืนยันรหัสผ่าน"
                  className="w-full h-12 pl-4 pr-11 rounded-xl border border-[var(--km-border)] text-[14px] outline-none focus:border-[var(--km-border-strong)] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPw(!showConfirmPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--km-text-muted)] hover:text-[var(--km-text)] transition-colors"
                >
                  {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {error && <p className="text-[12px] text-[var(--km-error)] pl-1">{error}</p>}
            </div>

            {/* Requirements */}
            <div className="mt-5 space-y-2">
              {[
                { ok: pwChecks.length,  label: "อย่างน้อย 8 ตัวอักษร" },
                { ok: pwChecks.number,  label: "ตัวเลขอย่างน้อย 1 ตัว" },
                { ok: pwChecks.letter,  label: "ตัวอักษร 1 ตัว" },
                { ok: pwChecks.special, label: "ตัวพิเศษอย่างน้อย 1 ตัว" },
              ].map((req, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                      req.ok ? "bg-[var(--km-success)]" : "bg-[var(--km-border)]"
                    }`}
                  >
                    {req.ok && (
                      <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                        <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    )}
                  </div>
                  <span
                    className={`text-[12px] transition-colors ${
                      req.ok ? "text-[var(--km-success)]" : "text-[var(--km-text-muted)]"
                    }`}
                  >
                    {req.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <ActionButton
                variant="outline"
                onClick={() => {
                  setStep("otp");
                  setOtp(["", "", "", "", "", ""]);
                  setError("");
                  setPassword("");
                  setConfirmPassword("");
                }}
              >
                ย้อนกลับ
              </ActionButton>
              <ActionButton
                onClick={handleSetPassword}
                disabled={!password || !confirmPassword}
              >
                ดำเนินการต่อ
              </ActionButton>
            </div>
          </>
        )}

        {/* ── STEP: CREATE PROFILE ──────────────────────────────────────────── */}
        {step === "create-profile" && (
          <>
            <h1 className="text-[20px] font-bold text-[var(--km-text)] mb-1">สร้างโปรไฟล์ของคุณ</h1>
            <p className="text-[13px] text-[var(--km-text-muted)] mb-7">{input}</p>

            {/* Avatar */}
            <div className="flex justify-center mb-7">
              <div className="relative">
                <div className="w-[72px] h-[72px] rounded-full bg-[var(--km-surface)] border border-[var(--km-border)] flex items-center justify-center overflow-hidden">
                  <User size={28} className="text-[var(--km-text-muted)]" />
                </div>
                <button
                  type="button"
                  className="absolute bottom-0 right-0 w-6 h-6 rounded-full flex items-center justify-center shadow-md"
                  style={{ background: "#1A1A1A" }}
                >
                  <PencilIcon />
                </button>
              </div>
            </div>

            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ชื่อนามสกุล"
              className="w-full h-12 px-4 rounded-xl border border-[var(--km-border)] text-[14px] outline-none focus:border-[var(--km-border-strong)] transition-colors"
            />

            <div className="mt-6 flex gap-3">
              <ActionButton
                variant="outline"
                onClick={() => setStep("set-password")}
              >
                ย้อนกลับ
              </ActionButton>
              <ActionButton
                onClick={handleCreateProfile}
                loading={loading}
              >
                เริ่มต้นใช้งาน
              </ActionButton>
            </div>
          </>
        )}

        </div>
      </div>
    </div>
  );
}
