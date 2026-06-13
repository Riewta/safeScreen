"use client";

import { useRef, useEffect } from "react";
import { SpinnerGap } from "@phosphor-icons/react";

interface OtpBoxInputProps {
  digits?: number;
  value: string[];
  onChange: (value: string[]) => void;
  onSubmit?: () => void;
  loading?: boolean;
  error?: string;
  countdown?: number;
  onResend?: () => void;
  submitLabel?: string;
  autoFocus?: boolean;
}

export function OtpBoxInput({
  digits = 6,
  value,
  onChange,
  onSubmit,
  loading,
  error,
  countdown = 0,
  onResend,
  submitLabel = "ยืนยันรหัส OTP",
  autoFocus = true,
}: OtpBoxInputProps) {
  const refsContainer = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (autoFocus) setTimeout(() => refsContainer.current[0]?.focus(), 100);
  }, [autoFocus]);

  const handleChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...value];
    next[i] = val;
    onChange(next);
    if (val && i < digits - 1) refsContainer.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !value[i] && i > 0) refsContainer.current[i - 1]?.focus();
  };

  const isFilled = value.every(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex gap-2.5 justify-between">
        {value.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { refsContainer.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-full aspect-square text-center text-[18px] font-normal rounded-[12px] border border-[var(--km-border)] outline-none transition-all focus:border-[var(--km-text)]"
          />
        ))}
      </div>

      {error && <p className="text-sm text-[var(--km-error)] text-center font-medium">{error}</p>}

      {onResend && (
        <div className="text-center">
          <button
            disabled={countdown > 0}
            onClick={onResend}
            className="text-[13px] text-[var(--km-text)] font-medium underline disabled:text-[var(--km-text-muted)] disabled:no-underline"
          >
            {countdown > 0 ? `ขอรหัสใหม่ใน (${countdown}s)` : "ขอรหัสใหม่อีกครั้ง"}
          </button>
        </div>
      )}

      {onSubmit && (
        <button
          onClick={onSubmit}
          disabled={!isFilled || loading}
          className="w-full h-12 rounded-full bg-[var(--km-text)] text-white text-[14px] font-medium flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {loading ? <SpinnerGap className="animate-spin" size={20} /> : submitLabel}
        </button>
      )}
    </div>
  );
}