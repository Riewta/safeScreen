"use client";

import { useState, useRef, useEffect } from "react";
import { X, Check, ChevronDown, Globe } from "lucide-react";
import { useLocaleStore, COUNTRIES, CURRENCIES, REGIONS } from "@/stores/locale.store";
import { useLang } from "@/contexts/lang";

function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);
  return { open, setOpen, ref };
}

export function CountrySelectorButton() {
  const { country, currency, setCountry, setCurrency } = useLocaleStore();
  const [modalOpen, setModalOpen] = useState(false);
  const lang = useDropdown();
  const curr = useDropdown();
  const { selector } = useLang();

  return (
    <>
      {/* ── Desktop: language only ── */}
      <div className="hidden md:flex items-center h-full">
        <div ref={lang.ref} className="relative h-full">
          <button
            onClick={() => lang.setOpen(!lang.open)}
            className={`flex items-center gap-1 h-full px-2.5 transition-colors text-[13px] font-normal ${lang.open ? "text-[var(--km-text)]" : "text-[var(--km-text-secondary)] hover:text-[var(--km-text)]"}`}
          >
            {country.name}
            <ChevronDown size={12} strokeWidth={2.5} className={`text-[var(--km-text-muted)] transition-transform duration-200 ${lang.open ? "rotate-180" : ""}`} />
          </button>
          <div className={`absolute top-full right-0 pt-2 z-[250] transition-all duration-200 ${lang.open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-1 pointer-events-none"}`}>
            <div className="bg-white border border-[var(--km-border)] shadow-2xl rounded-2xl py-2 w-[200px]">
              <p className="px-4 pt-1 pb-2 text-[11px] font-medium text-[var(--km-text-muted)] uppercase tracking-wider">{selector.language}</p>
              {COUNTRIES.map((c) => {
                const isActive = c.code === country.code;
                return (
                  <button key={c.code} onClick={() => {
                    setCountry(c);
                    document.cookie = `safescreen-lang=${c.code}; path=/; max-age=31536000`;
                    lang.setOpen(false);
                    window.location.reload();
                  }}
                    className={`flex items-center gap-3 w-full px-4 py-2.5 text-left transition-colors ${isActive ? "bg-[var(--km-surface)]" : "hover:bg-[var(--km-surface)]"}`}
                  >
                    <span className={`text-[13px] flex-1 ${isActive ? "font-medium text-[var(--km-text)]" : "font-normal text-[var(--km-text-secondary)]"}`}>{c.name}</span>
                    {isActive && <Check size={13} strokeWidth={3} className="text-[var(--km-success)]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Modal ── */}
      <div className="md:hidden">
        <button onClick={() => setModalOpen(true)} className="p-2 text-[var(--km-text-secondary)] flex items-center gap-1">
          <span className="text-xs font-normal">{country.name}</span>
          <ChevronDown size={10} strokeWidth={2.5} className="text-[var(--km-text-muted)]" />
        </button>
        {modalOpen && <CountrySelectorModal onClose={() => setModalOpen(false)} />}
      </div>
    </>
  );
}

function CountrySelectorModal({ onClose }: { onClose: () => void }) {
  const { country, currency, setCountry, setCurrency } = useLocaleStore();
  const [tab, setTab] = useState<"lang" | "currency">("lang");
  const { selector } = useLang();

  return (
    <div className="fixed inset-0 z-[1000] flex items-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full bg-white rounded-t-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--km-border)]">
          <div className="flex gap-4">
            <button onClick={() => setTab("lang")} className={`text-sm pb-0.5 border-b-2 transition-colors ${tab === "lang" ? "font-medium text-[var(--km-text)] border-[var(--km-text)]" : "font-normal text-[var(--km-text-muted)] border-transparent"}`}>{selector.language}</button>
            <button onClick={() => setTab("currency")} className={`text-sm pb-0.5 border-b-2 transition-colors ${tab === "currency" ? "font-medium text-[var(--km-text)] border-[var(--km-text)]" : "font-normal text-[var(--km-text-muted)] border-transparent"}`}>{selector.currency}</button>
          </div>
          <button onClick={onClose} className="p-1 text-[var(--km-text-muted)]"><X size={18} strokeWidth={1.75} /></button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto divide-y divide-[var(--km-border)]">
          {tab === "lang" ? COUNTRIES.map((c) => {
            const isActive = c.code === country.code;
            return (
              <button key={c.code} onClick={() => {
                setCountry(c);
                document.cookie = `safescreen-lang=${c.code}; path=/; max-age=31536000`;
                onClose();
                window.location.reload();
              }} className="flex items-center gap-4 w-full px-5 py-4 text-left active:bg-[var(--km-surface)]">
                <span className={`text-[15px] flex-1 ${isActive ? "font-medium text-[var(--km-text)]" : "font-normal text-[var(--km-text-secondary)]"}`}>{c.name}</span>
                {isActive && <Check size={16} strokeWidth={2.5} className="text-[var(--km-success)]" />}
              </button>
            );
          }) : CURRENCIES.map((c) => {
            const isActive = c.code === currency.code;
            return (
              <button key={c.code} onClick={() => { setCurrency(c); onClose(); }} className="flex items-center gap-4 w-full px-5 py-4 text-left active:bg-[var(--km-surface)]">
                <span className="text-[13px] font-normal text-[var(--km-text-muted)] w-10">{c.code}</span>
                <span className={`text-[15px] flex-1 ${isActive ? "font-medium text-[var(--km-text)]" : "font-normal text-[var(--km-text-secondary)]"}`}>{c.name}</span>
                {isActive && <Check size={16} strokeWidth={2.5} className="text-[var(--km-success)]" />}
              </button>
            );
          })}
        </div>
        <div className="h-[env(safe-area-inset-bottom)] pb-6" />
      </div>
    </div>
  );
}

export function RegionSelectorButton() {
  const { region, setRegion } = useLocaleStore();
  const { open, setOpen, ref } = useDropdown();

  return (
    <div ref={ref} className="hidden md:block relative h-full">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 h-full px-2 transition-colors ${open ? "text-[var(--km-text)]" : "text-[var(--km-text-secondary)] hover:text-[var(--km-text)]"}`}
      >
        <Globe size={16} strokeWidth={1.75} />
        <ChevronDown size={12} strokeWidth={2.5} className={`text-[var(--km-text-muted)] transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`absolute top-full right-0 pt-2 z-[250] transition-all duration-200 ${open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-1 pointer-events-none"}`}>
        <div className="bg-white border border-[var(--km-border)] shadow-2xl rounded-2xl py-2 w-[200px] max-h-[360px] overflow-y-auto">
          <p className="px-4 pt-1 pb-2 text-[11px] font-medium text-[var(--km-text-muted)] uppercase tracking-wider">ประเทศที่อยู่</p>
          {REGIONS.map((r) => {
            const isActive = r.code === region.code;
            return (
              <button key={r.code} onClick={() => { setRegion(r); setOpen(false); }}
                className={`flex items-center gap-3 w-full px-4 py-2.5 text-left transition-colors ${isActive ? "bg-[var(--km-surface)]" : "hover:bg-[var(--km-surface)]"}`}
              >
                <span className={`text-[13px] flex-1 ${isActive ? "font-medium text-[var(--km-text)]" : "font-normal text-[var(--km-text-secondary)]"}`}>{r.nameTH}</span>
                {isActive && <Check size={13} strokeWidth={3} className="text-[var(--km-success)] flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
