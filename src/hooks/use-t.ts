"use client";

import { useLocaleStore } from "@/stores/locale.store";
import translations, { type LangCode } from "@/lib/i18n";

export function useT() {
  // Use explicit selector so Zustand v5 triggers re-render when country.code changes
  const countryCode = useLocaleStore((s) => s.country.code);
  const lang: LangCode = countryCode === "EN" ? "EN" : "TH";
  return translations[lang];
}
