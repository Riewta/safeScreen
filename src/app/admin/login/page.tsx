"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAdminAuthStore } from "@/stores/adminAuth.store";

const BRAND_YELLOW = "#F5A600";

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

function IconInput({
  icon, type = "text", value, onChange, placeholder, autoFocus = false, hasError = false, rightSlot,
}: {
  icon: React.ReactNode; type?: string; value: string; onChange: (v: string) => void;
  placeholder: string; autoFocus?: boolean; hasError?: boolean; rightSlot?: React.ReactNode;
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

export default function AdminLoginPage() {
  const router = useRouter();
  const login  = useAdminAuthStore((s) => s.login);

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { setError("กรุณากรอกอีเมลและรหัสผ่าน"); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      router.replace("/admin/products");
    } else {
      setError(result.error ?? "เกิดข้อผิดพลาด");
    }
  };

  return (
    <div className="fixed inset-0 z-[500] flex" style={{ background: BRAND_YELLOW }}>
      {/* Left yellow panel — desktop only */}
      <div className="hidden md:flex flex-col flex-1 items-center justify-center gap-3 px-10">
        <span className="text-white/80 text-[13px] font-medium tracking-widest uppercase">Admin Portal</span>
        <p className="text-white/60 text-[12px]">SafeScreen Tech — Internal Use Only</p>
      </div>

      {/* Right white panel */}
      <div className="w-full md:w-1/2 bg-white flex flex-col overflow-y-auto px-10">
        <div className="flex flex-col justify-center flex-1 max-w-[380px] mx-auto w-full py-10">

          {/* Logo */}
          <div className="mb-7">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logo.svg"
              alt="SAFESCREEN"
              className="h-8 object-contain"
              onError={(e) => {
                const el = e.currentTarget;
                el.style.display = "none";
                const next = el.nextElementSibling as HTMLElement | null;
                if (next) next.style.display = "block";
              }}
            />
            <span className="hidden font-black tracking-widest text-[20px]" style={{ color: BRAND_YELLOW }}>
              SAFESCREEN
            </span>
          </div>

          <h1 className="text-[20px] font-bold text-[var(--km-text)] mb-1">Admin Login</h1>
          <p className="text-[13px] text-[var(--km-text-muted)] mb-7 leading-relaxed">
            สำหรับผู้ดูแลระบบเท่านั้น
          </p>

          <div className="space-y-3">
            <IconInput
              icon={<PersonIcon />}
              value={email}
              onChange={(v) => { setEmail(v); setError(""); }}
              placeholder="admin@safescreentech.com"
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
            disabled={!email || !password || loading}
            className="mt-6 w-full h-12 rounded-xl text-[14px] font-medium transition-all active:scale-[0.98] disabled:opacity-40 flex items-center justify-center"
            style={{ background: "#E5E5E5", color: "#1A1A1A" }}
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : "เข้าสู่ระบบ"}
          </button>

          <p className="mt-8 text-center text-[13px] text-[var(--km-text-muted)]">
            <a href="/" className="hover:text-[var(--km-text)] transition-colors">← กลับไปหน้าร้านค้า</a>
          </p>

        </div>
      </div>
    </div>
  );
}
