"use client";

import { useState, useEffect } from "react";
import { useLocaleStore, COUNTRIES } from "@/stores/locale.store";
import { useLang } from "@/contexts/lang";
import { useUIStore } from "@/stores/ui.store";
import { ChevronDown, Check, X } from "lucide-react";

// Define the region list
export interface RegionOption {
  code: string;
  name: string;
  defaultLang: string; // "TH" | "EN" | "CN"
  defaultCurrency: string;
}

export const REGIONS: RegionOption[] = [
  { code: "TH", name: "ประเทศไทย (Thailand)", defaultLang: "TH", defaultCurrency: "THB" },
  { code: "US", name: "สหรัฐอเมริกา (United States)", defaultLang: "EN", defaultCurrency: "USD" },
  { code: "CN", name: "จีน (China)", defaultLang: "EN", defaultCurrency: "CNY" },
  { code: "SG", name: "สิงคโปร์ (Singapore)", defaultLang: "EN", defaultCurrency: "SGD" },
  { code: "MY", name: "มาเลเซีย (Malaysia)", defaultLang: "EN", defaultCurrency: "MYR" },
  { code: "VN", name: "เวียดนาม (Vietnam)", defaultLang: "EN", defaultCurrency: "VND" },
  { code: "JP", name: "ญี่ปุ่น (Japan)", defaultLang: "EN", defaultCurrency: "JPY" },
];

export const LANGUAGES = [
  { code: "TH", label: "ภาษาไทย (Thai)" },
  { code: "EN", label: "English (อังกฤษ)" },
];

export const CURRENCIES = [
  { code: "THB", label: "THB - บาทไทย (฿)" },
  { code: "USD", label: "USD - ดอลลาร์สหรัฐ ($)" },
  { code: "CNY", label: "CNY - หยวนจีน (¥)" },
  { code: "SGD", label: "SGD - ดอลลาร์สิงคโปร์ (S$)" },
  { code: "MYR", label: "MYR - ริงกิตมาเลเซีย (RM)" },
  { code: "VND", label: "VND - ดองเวียดนาม (₫)" },
  { code: "JPY", label: "JPY - เยนญี่ปุ่น (¥)" },
];

export function RegionSelectorModal() {
  const { regionModalOpen, closeRegionModal, regionModalFocusedDropdown } = useUIStore();
  const { country, setCountry } = useLocaleStore();
  const { region: t } = useLang();

  const [selectedRegion, setSelectedRegion] = useState("TH");
  const [selectedLang, setSelectedLang] = useState("TH");
  const [selectedCurrency, setSelectedCurrency] = useState("THB");

  const [openDropdown, setOpenDropdown] = useState<"region" | "lang" | "currency" | null>(null);

  // Sync selection states when modal is opened programmatically
  useEffect(() => {
    if (regionModalOpen) {
      if (typeof window !== "undefined") {
        const savedRegion = localStorage.getItem("safescreen_selected_region") || country.code || "TH";
        setSelectedRegion(savedRegion);
      }
      setSelectedLang(country.code || "TH");
      setSelectedCurrency(country.currency || "THB");
      setOpenDropdown(regionModalFocusedDropdown);
    }
  }, [regionModalOpen, regionModalFocusedDropdown, country]);

  useEffect(() => {
    // Show only once per browser session
    if (typeof window !== "undefined") {
      const prompted = sessionStorage.getItem("safescreen_region_prompted");
      if (prompted !== "true") {
        // Set defaults from active store or detect region from browser locale
        const detectedLang = navigator.language.includes("th") ? "TH" : "EN";
        
        setSelectedRegion(country.code || "TH");
        setSelectedLang(country.code || detectedLang);
        setSelectedCurrency(country.currency || "THB");
        
        // Show after a subtle 800ms load delay to let page mount
        const timer = setTimeout(() => {
          useUIStore.getState().openRegionModal();
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [country]);

  // Handle auto-cascading when a region is selected
  const handleRegionChange = (regionCode: string) => {
    setSelectedRegion(regionCode);

    const found = REGIONS.find((r) => r.code === regionCode);
    if (found) {
      setSelectedLang(found.defaultLang);
      setSelectedCurrency(found.defaultCurrency);
    }
  };

  const handleConfirm = () => {
    // 1. Persist selection to sessionStorage so they are not prompted again in this session
    sessionStorage.setItem("safescreen_region_prompted", "true");
    
    // 2. Also cache actual selections in localStorage for persistence
    localStorage.setItem("safescreen_selected_region", selectedRegion);
    localStorage.setItem("safescreen_selected_currency", selectedCurrency);
    
    // 3. Map language to update the locale store translation language (TH / EN / CN)
    const matchedStoreCountry = COUNTRIES.find((c) => c.code === selectedLang) || COUNTRIES[0];
    
    // Apply selected currency to the store country object so the app formats correctly
    setCountry({ ...matchedStoreCountry, currency: selectedCurrency });

    // Persist language choice in cookie so server renders correct language on reload
    document.cookie = `safescreen-lang=${selectedLang}; path=/; max-age=31536000`;

    closeRegionModal();
    window.location.reload();
  };

  // Scroll Lock when modal is open
  useEffect(() => {
    if (regionModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [regionModalOpen]);

  if (!regionModalOpen) return null;

  const currentRegionName = REGIONS.find((r) => r.code === selectedRegion)?.name || "";
  const currentLangLabel = LANGUAGES.find((l) => l.code === selectedLang)?.label || "";
  const currentCurrencyLabel = CURRENCIES.find((c) => c.code === selectedCurrency)?.label || "";

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onTouchMove={(e) => e.preventDefault()}
    >
      {/* Clean Backdrop Overlay */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-out animate-fade-in"
        style={{ animation: "fadeIn 0.3s ease-out forwards" }}
      />

      {/* Transparent Click-Outside Overlay to Close Dropdowns */}
      {openDropdown && (
        <div 
          className="fixed inset-0 z-40 bg-transparent cursor-default" 
          onClick={() => setOpenDropdown(null)} 
        />
      )}

      {/* Clean Minimalist Modal Card (overflow-visible to avoid clipping dropdown absolute menus) */}
      <div 
        className="relative w-full max-w-sm bg-white rounded-2xl p-5 md:p-6 shadow-xl flex flex-col gap-4 overflow-visible border border-[var(--km-border)] select-none animate-scale-up z-50"
        style={{
          animation: "scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards"
        }}
      >
        {/* Close Button (only visible if prompted before) */}
        {typeof window !== "undefined" && sessionStorage.getItem("safescreen_region_prompted") === "true" && (
          <button
            type="button"
            onClick={closeRegionModal}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[var(--km-surface)] text-[var(--km-text-secondary)] hover:text-[var(--km-text)] transition-colors cursor-pointer outline-none border-0"
          >
            <X size={16} />
          </button>
        )}
        {/* Heading */}
        <div className="text-center pt-1">
          <h2 className="text-base font-semibold text-[var(--km-text)] mb-1 font-prompt">
            {t.title}
          </h2>
          <p className="text-[13px] text-[var(--km-text-secondary)] leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-3.5">
          {/* 1. Country / Region Custom Dropdown */}
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-[var(--km-text-secondary)] font-prompt">
              {t.fieldRegion}
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === "region" ? null : "region")}
                className="w-full h-12 px-4 flex items-center justify-between rounded-2xl border border-[var(--km-border)] transition-all text-[13px] font-normal text-[var(--km-text)] bg-white cursor-pointer outline-none"
              >
                <span className="truncate">{currentRegionName}</span>
                <ChevronDown 
                  size={15} 
                  className={`text-[var(--km-text-muted)] transition-transform duration-200 flex-shrink-0 ml-2 ${
                    openDropdown === "region" ? "rotate-180 text-[var(--km-text)]" : ""
                  }`} 
                />
              </button>

              {openDropdown === "region" && (
                <div className="absolute top-[52px] left-0 right-0 z-50 bg-white border border-[var(--km-border)] rounded-2xl shadow-lg max-h-56 overflow-y-auto p-1.5 flex flex-col gap-0.5 select-none animate-slide-down">
                  {REGIONS.map((r) => {
                    const isSelected = selectedRegion === r.code;
                    return (
                      <button
                        key={r.code}
                        type="button"
                        onClick={() => {
                          handleRegionChange(r.code);
                          setOpenDropdown(null);
                        }}
                        className={`w-full px-3.5 py-2.5 text-left text-[13px] rounded-xl transition-colors duration-100 flex items-center justify-between font-normal cursor-pointer ${
                          isSelected 
                            ? "bg-[var(--km-surface)] text-[var(--km-text)]" 
                            : "text-[var(--km-text-secondary)] hover:bg-[var(--km-surface)] hover:text-[var(--km-text)]"
                        }`}
                      >
                        <span className="truncate">{r.name}</span>
                        {isSelected && <Check size={14} className="text-[var(--km-text)] flex-shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* 2. Display Language Custom Dropdown */}
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-[var(--km-text-secondary)] font-prompt">
              {t.fieldLanguage}
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === "lang" ? null : "lang")}
                className="w-full h-12 px-4 flex items-center justify-between rounded-2xl border border-[var(--km-border)] transition-all text-[13px] font-normal text-[var(--km-text)] bg-white cursor-pointer outline-none"
              >
                <span className="truncate">{currentLangLabel}</span>
                <ChevronDown 
                  size={15} 
                  className={`text-[var(--km-text-muted)] transition-transform duration-200 flex-shrink-0 ml-2 ${
                    openDropdown === "lang" ? "rotate-180 text-[var(--km-text)]" : ""
                  }`} 
                />
              </button>

              {openDropdown === "lang" && (
                <div className="absolute top-[52px] left-0 right-0 z-50 bg-white border border-[var(--km-border)] rounded-2xl shadow-lg max-h-56 overflow-y-auto p-1.5 flex flex-col gap-0.5 select-none animate-slide-down">
                  {LANGUAGES.map((l) => {
                    const isSelected = selectedLang === l.code;
                    return (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => {
                          setSelectedLang(l.code);
                          setOpenDropdown(null);
                        }}
                        className={`w-full px-3.5 py-2.5 text-left text-[13px] rounded-xl transition-colors duration-100 flex items-center justify-between font-normal cursor-pointer ${
                          isSelected 
                            ? "bg-[var(--km-surface)] text-[var(--km-text)]" 
                            : "text-[var(--km-text-secondary)] hover:bg-[var(--km-surface)] hover:text-[var(--km-text)]"
                        }`}
                      >
                        <span className="truncate">{l.label}</span>
                        {isSelected && <Check size={14} className="text-[var(--km-text)] flex-shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* 3. Currency Custom Dropdown */}
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-[var(--km-text-secondary)] font-prompt">
              {t.fieldCurrency}
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === "currency" ? null : "currency")}
                className="w-full h-12 px-4 flex items-center justify-between rounded-2xl border border-[var(--km-border)] transition-all text-[13px] font-normal text-[var(--km-text)] bg-white cursor-pointer outline-none"
              >
                <span className="truncate">{currentCurrencyLabel}</span>
                <ChevronDown 
                  size={15} 
                  className={`text-[var(--km-text-muted)] transition-transform duration-200 flex-shrink-0 ml-2 ${
                    openDropdown === "currency" ? "rotate-180 text-[var(--km-text)]" : ""
                  }`} 
                />
              </button>

              {openDropdown === "currency" && (
                <div className="absolute top-[52px] left-0 right-0 z-50 bg-white border border-[var(--km-border)] rounded-2xl shadow-lg max-h-56 overflow-y-auto p-1.5 flex flex-col gap-0.5 select-none animate-slide-down">
                  {CURRENCIES.map((c) => {
                    const isSelected = selectedCurrency === c.code;
                    return (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => {
                          setSelectedCurrency(c.code);
                          setOpenDropdown(null);
                        }}
                        className={`w-full px-3.5 py-2.5 text-left text-[13px] rounded-xl transition-colors duration-100 flex items-center justify-between font-normal cursor-pointer ${
                          isSelected 
                            ? "bg-[var(--km-surface)] text-[var(--km-text)]" 
                            : "text-[var(--km-text-secondary)] hover:bg-[var(--km-surface)] hover:text-[var(--km-text)]"
                        }`}
                      >
                        <span className="truncate">{c.label}</span>
                        {isSelected && <Check size={14} className="text-[var(--km-text)] flex-shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleConfirm}
          className="w-full h-12 rounded-full text-white text-[13px] font-medium tracking-wide transition-all hover:bg-black/90 active:scale-[0.98] duration-150 mt-2 cursor-pointer outline-none"
          style={{ background: "var(--km-brand)" }}
        >
          {t.confirm}
        </button>
      </div>

      {/* Inline styles for keyframe animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
