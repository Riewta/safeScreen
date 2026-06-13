"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocaleStore, COUNTRIES } from "@/stores/locale.store";
import { REGIONS, LANGUAGES, CURRENCIES } from "@/components/layout/RegionSelectorModal";
import { Check } from "lucide-react";
import { useUIStore } from "@/stores/ui.store";
import { useLang } from "@/contexts/lang";

function PreferencesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { country, setCountry } = useLocaleStore();
  const setHeaderTitleOverride = useUIStore((s) => s.setHeaderTitleOverride);
  const { header: tHeader, common } = useLang();

  const type = (searchParams.get("type") || "region") as "region" | "lang" | "currency";
  const [selectedValue, setSelectedValue] = useState("");

  // Update dynamic Header Title on mount & param changes
  useEffect(() => {
    let headerTitle = tHeader.regionLanguage;
    if (type === "region") headerTitle = tHeader.selectRegion;
    else if (type === "lang") headerTitle = tHeader.selectLanguage;
    else if (type === "currency") headerTitle = tHeader.selectCurrency;

    setHeaderTitleOverride(headerTitle);

    return () => {
      setHeaderTitleOverride(null);
    };
  }, [type, setHeaderTitleOverride, tHeader]);

  // Load initial value based on active states
  useEffect(() => {
    if (type === "region") {
      const savedRegion = (typeof window !== "undefined" && localStorage.getItem("karmart_selected_region")) || country.code || "TH";
      setSelectedValue(savedRegion);
    } else if (type === "lang") {
      setSelectedValue(country.code || "TH");
    } else if (type === "currency") {
      setSelectedValue(country.currency || "THB");
    }
  }, [type, country]);

  // Setup options mapping based on preference type
  const items = React.useMemo(() => {
    if (type === "region") {
      return REGIONS.map((r) => ({ code: r.code, label: r.name }));
    } else if (type === "lang") {
      return LANGUAGES.map((l) => ({ code: l.code, label: l.label }));
    } else if (type === "currency") {
      return CURRENCIES.map((c) => ({ code: c.code, label: c.label }));
    }
    return [];
  }, [type]);

  // Save selected preference and redirect back
  const handleSave = () => {
    if (!selectedValue) return;

    if (type === "region") {
      if (typeof window !== "undefined") {
        localStorage.setItem("karmart_selected_region", selectedValue);
        sessionStorage.setItem("karmart_region_prompted", "true");
      }

      // Cascade defaults for Region Selection
      const found = REGIONS.find((r) => r.code === selectedValue);
      const defaultLang = found?.defaultLang || "TH";
      const defaultCurrency = found?.defaultCurrency || "THB";

      if (typeof window !== "undefined") {
        localStorage.setItem("karmart_selected_currency", defaultCurrency);
      }

      const matchedStoreCountry = COUNTRIES.find((c) => c.code === defaultLang) || COUNTRIES[0];
      setCountry({
        ...matchedStoreCountry,
        currency: defaultCurrency,
      });

    } else if (type === "lang") {
      const matchedStoreCountry = COUNTRIES.find((c) => c.code === selectedValue) || COUNTRIES[0];
      setCountry({
        ...matchedStoreCountry,
        currency: country.currency || "THB",
      });

    } else if (type === "currency") {
      if (typeof window !== "undefined") {
        localStorage.setItem("karmart_selected_currency", selectedValue);
      }

      const matchedStoreCountry = COUNTRIES.find((c) => c.code === country.code) || COUNTRIES[0];
      setCountry({
        ...matchedStoreCountry,
        currency: selectedValue,
      });
    }

    // Go back in history to preserve exact scroll position on the /account page.
    // Fallback to push('/account') if the user entered this page directly.
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/account");
    }
  };

  return (
    <div className="w-full min-h-screen bg-white select-none relative pb-32">
      <div className="w-full max-w-md mx-auto px-0 pt-0 flex flex-col bg-white animate-fade-in">
        {/* Direct List Selections (Completely flat, borderless, shadowless, white list) */}
        <div className="flex flex-col w-full relative z-20 bg-white">
          {items.map((item) => {
            const isSelected = selectedValue === item.code;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => setSelectedValue(item.code)}
                className={`w-full px-4 py-4 flex items-center justify-between rounded-none transition-colors duration-100 cursor-pointer outline-none border-0 text-[13px] font-prompt font-normal ${
                  isSelected 
                    ? "bg-transparent text-[var(--km-text)]" 
                    : "bg-transparent text-[var(--km-text-secondary)] hover:text-[var(--km-text)]"
                }`}
              >
                <span className="truncate">{item.label}</span>
                {isSelected && (
                  <Check size={16} className="text-[#10B981] flex-shrink-0 ml-2" strokeWidth={2.5} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fixed CTA bottom bar - Flat pure white background, zero border, zero shadow */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] bg-white z-40">
        <button
          type="button"
          onClick={handleSave}
          className="w-full h-12 rounded-full text-white text-[13px] font-medium tracking-wide transition-all hover:bg-black/90 active:scale-[0.98] duration-150 cursor-pointer outline-none border-0 font-prompt"
          style={{ background: "var(--km-brand)" }}
        >
          {common.confirmSelection}
        </button>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}

export default function PreferencesPage() {
  return (
    <Suspense fallback={<div className="text-center py-10 text-sm text-[var(--km-text-muted)] font-prompt">กำลังโหลด...</div>}>
      <PreferencesContent />
    </Suspense>
  );
}
