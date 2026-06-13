"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

export function FormField({ label, error, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-medium text-[var(--km-text-secondary)]">{label}</label>
      {children}
      {error && <p className="text-[13px] text-[var(--km-error)]">{error}</p>}
    </div>
  );
}

export function inputCls(error?: string) {
  return cn(
    "w-full h-12 px-4 text-[13px] font-normal border rounded-2xl outline-none transition-all bg-white appearance-none shadow-none",
    error
      ? "border-[var(--km-error)]"
      : "border-[var(--km-border)] focus:ring-0"
  );
}

export function selectCls(error?: string, isPlaceholder?: boolean) {
  return cn(
    "w-full h-12 px-4 pr-10 text-[13px] font-normal border rounded-2xl outline-none transition-all bg-white appearance-none shadow-none",
    isPlaceholder ? "text-[var(--km-text-muted)]" : "text-[var(--km-text)]",
    error
      ? "border-[var(--km-error)]"
      : "border-[var(--km-border)] focus:ring-0"
  );
}

interface SelectWrapProps {
  error?: string;
  isPlaceholder?: boolean;
  disabled?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}

export function SelectWrap({ error, isPlaceholder, disabled, value, onChange, children }: SelectWrapProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={cn(selectCls(error, isPlaceholder), "disabled:opacity-50")}
      >
        {children}
      </select>
      <ChevronDown
        size={15}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--km-text-muted)]"
      />
    </div>
  );
}
