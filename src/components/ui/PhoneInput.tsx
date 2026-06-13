"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocaleStore } from "@/stores/locale.store";

export interface DialCodeConfig {
  code: string;
  dialCode: string;
  names: {
    TH: string;
    EN: string;
    CN: string;
  };
  flag: string;
  placeholder: string;
}

export const DIAL_CODES: DialCodeConfig[] = [
  { code: "TH", dialCode: "+66", names: { TH: "ประเทศไทย", EN: "Thailand", CN: "泰国" }, flag: "🇹🇭", placeholder: "081 234 5678" },
  { code: "SG", dialCode: "+65", names: { TH: "สิงคโปร์", EN: "Singapore", CN: "新加坡" }, flag: "🇸🇬", placeholder: "8123 4567" },
  { code: "MY", dialCode: "+60", names: { TH: "มาเลเซีย", EN: "Malaysia", CN: "马来西亚" }, flag: "🇲🇾", placeholder: "12-345 6789" },
  { code: "VN", dialCode: "+84", names: { TH: "เวียดนาม", EN: "Vietnam", CN: "越南" }, flag: "🇻🇳", placeholder: "91 234 5678" },
  { code: "ID", dialCode: "+62", names: { TH: "อินโดนีเซีย", EN: "Indonesia", CN: "印度尼西亚" }, flag: "🇮🇩", placeholder: "812-3456-7890" },
  { code: "PH", dialCode: "+63", names: { TH: "ฟิลิปปินส์", EN: "Philippines", CN: "菲律宾" }, flag: "🇵🇭", placeholder: "912 345 6789" },
  { code: "CN", dialCode: "+86", names: { TH: "จีน", EN: "China", CN: "中国" }, flag: "🇨🇳", placeholder: "138 1234 5678" },
  { code: "US", dialCode: "+1", names: { TH: "สหรัฐอเมริกา", EN: "United States", CN: "美国" }, flag: "🇺🇸", placeholder: "202-555-0143" },
  { code: "GB", dialCode: "+44", names: { TH: "สหราชอาณาจักร", EN: "United Kingdom", CN: "英国" }, flag: "🇬🇧", placeholder: "7700 900077" },
  { code: "JP", dialCode: "+81", names: { TH: "ญี่ปุ่น", EN: "Japan", CN: "日本" }, flag: "🇯🇵", placeholder: "90-1234-5678" },
  { code: "KR", dialCode: "+82", names: { TH: "เกาหลีใต้", EN: "South Korea", CN: "韩国" }, flag: "🇰🇷", placeholder: "10-1234-5678" },
];

export function parsePhoneNumber(val: string): { dialCode: string; nationalNumber: string; countryCode: string } {
  const clean = (val || "").replace(/\s/g, "");
  
  if (clean.startsWith("+")) {
    const sortedCodes = [...DIAL_CODES].sort((a, b) => b.dialCode.length - a.dialCode.length);
    for (const config of sortedCodes) {
      if (clean.startsWith(config.dialCode)) {
        return {
          dialCode: config.dialCode,
          nationalNumber: clean.slice(config.dialCode.length),
          countryCode: config.code,
        };
      }
    }
  }

  // Compatibility: If it's a 10-digit number starting with 0, default to Thailand (+66)
  if (/^0\d{9}$/.test(clean)) {
    return {
      dialCode: "+66",
      nationalNumber: clean.replace(/^0/, ""),
      countryCode: "TH",
    };
  }

  // Fallback to TH
  return {
    dialCode: "+66",
    nationalNumber: clean,
    countryCode: "TH",
  };
}

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean | string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  autoFocus?: boolean;
  required?: boolean;
}

export function PhoneInput({
  value,
  onChange,
  error,
  placeholder,
  disabled = false,
  className,
  autoFocus = false,
  required = false,
}: PhoneInputProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Localization settings
  const { country } = useLocaleStore();
  const lang = (country?.code === "CN" ? "CN" : country?.code === "EN" ? "EN" : "TH") as "TH" | "EN" | "CN";

  // Parse current value
  const parsed = useMemo(() => parsePhoneNumber(value), [value]);
  const activeCountry = useMemo(() => {
    return DIAL_CODES.find((c) => c.code === parsed.countryCode) || DIAL_CODES[0];
  }, [parsed.countryCode]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (dropdownOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchQuery("");
    }
  }, [dropdownOpen]);

  // Filter countries by search query based on active language
  const filteredCountries = useMemo(() => {
    return DIAL_CODES.filter((c) => {
      const countryName = c.names[lang] || c.names.EN;
      return (
        countryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.dialCode.includes(searchQuery) ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [searchQuery, lang]);

  // Visual display helper inside input field
  const getDisplayValue = () => {
    if (parsed.countryCode === "TH") {
      if (!parsed.nationalNumber) return "";
      // Show leading 0 for Thailand numbers (e.g. 081 234 5678)
      const full = `0${parsed.nationalNumber}`.slice(0, 10);
      if (full.length <= 3) return full;
      if (full.length <= 6) return `${full.slice(0, 3)} ${full.slice(3)}`;
      return `${full.slice(0, 3)} ${full.slice(3, 6)} ${full.slice(6)}`;
    }
    
    // For other countries, show national number with spacing
    const nums = parsed.nationalNumber.replace(/\D/g, "");
    if (nums.length <= 4) return nums;
    if (nums.length <= 8) return `${nums.slice(0, 4)} ${nums.slice(4)}`;
    return `${nums.slice(0, 4)} ${nums.slice(4, 8)} ${nums.slice(8)}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");

    if (activeCountry.code === "TH") {
      // Strip leading 0 if typed
      const cleanTH = raw.startsWith("0") ? raw.slice(1) : raw;
      onChange(`${activeCountry.dialCode}${cleanTH.slice(0, 9)}`);
    } else {
      onChange(`${activeCountry.dialCode}${raw.slice(0, 12)}`);
    }
  };

  const selectCountry = (config: DialCodeConfig) => {
    // Preserve the national number when changing country
    onChange(`${config.dialCode}${parsed.nationalNumber}`);
    setDropdownOpen(false);
  };

  // Translated constants
  const searchPlaceholder = {
    TH: "ค้นหาประเทศหรือรหัส...",
    EN: "Search country or code...",
    CN: "搜索国家或代码...",
  }[lang];

  const notFoundText = {
    TH: "ไม่พบรหัสประเทศ",
    EN: "Country code not found",
    CN: "未找到国家代码",
  }[lang];

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div
        className={cn(
          "flex items-center w-full h-12 rounded-2xl border bg-white overflow-hidden",
          error ? "border-[var(--km-error)]" : "border-[var(--km-border)]",
          disabled && "opacity-50 pointer-events-none bg-[var(--km-surface)]"
        )}
      >
        {/* Dropdown Button */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setDropdownOpen((o) => !o)}
          className="flex items-center gap-1.5 h-full px-4 border-r border-[var(--km-border)] hover:bg-[var(--km-surface)] active:bg-gray-50 transition-colors cursor-pointer select-none"
        >
          <span className="text-[13px] font-normal text-[var(--km-text)]">{activeCountry.dialCode}</span>
          <ChevronDown size={14} className={cn("text-[var(--km-text-muted)] transition-transform duration-200", dropdownOpen && "rotate-180")} />
        </button>

        {/* Text Input */}
        <input
          autoFocus={autoFocus}
          disabled={disabled}
          required={required}
          type="tel"
          inputMode="numeric"
          value={getDisplayValue()}
          onChange={handleInputChange}
          placeholder={placeholder || activeCountry.placeholder}
          className="flex-1 h-full px-4 text-[13px] font-normal text-[var(--km-text)] outline-none border-none bg-transparent"
        />
      </div>

      {/* Popover Dropdown list */}
      {dropdownOpen && (
        <div className="absolute left-0 top-[calc(100%+8px)] w-[290px] max-h-72 overflow-y-auto bg-white border border-[var(--km-border)] rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.06)] z-[100] py-2 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Search box inside dropdown */}
          <div className="px-3 pb-2 pt-1 border-b border-[var(--km-border)] mb-1 flex items-center gap-1.5">
            <Search size={14} className="text-[var(--km-text-muted)]" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 px-1 text-sm outline-none border-none bg-transparent"
            />
          </div>

          {/* List items */}
          <div className="max-h-52 overflow-y-auto">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => selectCountry(c)}
                  className={cn(
                    "flex items-center justify-between w-full px-4 py-2.5 text-left text-[13px] text-[var(--km-text)] hover:bg-[var(--km-surface)] transition-colors",
                    c.code === activeCountry.code && "bg-[var(--km-surface)]"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="truncate max-w-[180px]">{c.names[lang] || c.names.EN}</span>
                  </div>
                  <span className="text-[13px] text-[var(--km-text-muted)] font-normal">{c.dialCode}</span>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-xs text-center text-[var(--km-text-muted)]">{notFoundText}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
