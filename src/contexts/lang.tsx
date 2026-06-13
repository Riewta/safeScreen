"use client";

import { createContext, useContext } from "react";
import translations, { type Translations, type LangCode } from "@/lib/i18n";

const LangContext = createContext<Translations>(translations.TH);

export function LangProvider({
  children,
  initialLang = "TH",
}: {
  children: React.ReactNode;
  initialLang?: LangCode;
}) {
  return (
    <LangContext.Provider value={translations[initialLang]}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
