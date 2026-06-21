"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { useLang } from "@/contexts/lang";

const STORAGE_KEY = "safescreen-cookie-consent";
type ConsentState = "accepted" | "declined" | null;

export function CookieBanner() {
  const [consent, setConsent] = useState<ConsentState>(null);
  const [visible, setVisible] = useState(false);
  const { cookie: t } = useLang();

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as ConsentState;
    if (!saved) {
      setTimeout(() => setVisible(true), 800);
    } else {
      setConsent(saved);
    }
  }, []);

  const handleAccept = () => { localStorage.setItem(STORAGE_KEY, "accepted"); setConsent("accepted"); setVisible(false); };
  const handleDecline = () => { localStorage.setItem(STORAGE_KEY, "declined"); setConsent("declined"); setVisible(false); };

  if (!visible || consent !== null) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[850] transition-transform duration-300 ease-out pointer-events-none" style={{ transform: visible ? "translateY(0)" : "translateY(100%)" }}>
      <div className="bg-white border-t border-[var(--km-border)] shadow-[0_-8px_24px_rgba(0,0,0,0.08)] px-4 md:px-6 pt-4 pb-[calc(env(safe-area-inset-bottom)+16px)] pointer-events-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-9 h-9 rounded-full bg-[var(--km-surface)] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Cookie size={18} strokeWidth={1.75} className="text-[var(--km-text-secondary)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--km-text)]">{t.title}</p>
                <p className="text-xs text-[var(--km-text-secondary)] mt-1 leading-relaxed">
                  {t.desc}{" "}
                  <Link href="/privacy" className="underline underline-offset-2 text-[var(--km-text)]">{t.privacyLink}</Link>
                </p>
              </div>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button onClick={handleDecline} className="flex-1 md:flex-none md:min-w-[100px] px-6 py-2.5 rounded-full border border-[var(--km-border)] text-xs font-medium text-[var(--km-text-secondary)] transition-colors hover:bg-[var(--km-surface)]">
                {t.decline}
              </button>
              <button onClick={handleAccept} className="flex-1 md:flex-none md:min-w-[120px] px-8 py-2.5 rounded-full bg-[var(--km-text)] text-white text-xs font-medium transition-opacity hover:opacity-90 whitespace-nowrap">
                {t.accept}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
