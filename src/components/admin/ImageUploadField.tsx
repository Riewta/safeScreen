"use client";

import { useRef } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

interface ImageUploadFieldProps {
  value: string;
  onChange: (v: string) => void;
  label?: string;
}

export function ImageUploadField({ value, onChange, label }: ImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
    // Reset input so the same file can be selected again
    e.target.value = "";
  }

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="block text-xs font-semibold text-[var(--km-text-secondary)] uppercase tracking-wider">
          {label}
        </label>
      )}

      {/* Preview */}
      <div className="relative w-[120px] h-[120px] rounded-xl bg-[var(--km-surface)] border border-[var(--km-border)] overflow-hidden flex-shrink-0 flex items-center justify-center">
        {value ? (
          <Image
            src={value}
            alt={label ?? "preview"}
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <ImageIcon size={32} className="text-[var(--km-text-muted)]" />
        )}
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-1.5 rounded-lg border border-[var(--km-border)] text-xs font-medium text-[var(--km-text-secondary)] hover:bg-[var(--km-surface)] transition-colors"
        >
          อัปโหลดรูป
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="px-3 py-1.5 rounded-lg border border-[var(--km-border)] text-xs font-medium text-[var(--km-text-muted)] hover:bg-[var(--km-surface)] transition-colors"
          >
            ล้าง
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Manual path input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="/products/image.png"
        className="w-full px-3 py-2 border border-[var(--km-border)] rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[var(--km-border-strong)] text-[var(--km-text-secondary)]"
      />
    </div>
  );
}
