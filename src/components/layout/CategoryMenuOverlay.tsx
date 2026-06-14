"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  X,
  CaretRight,
  User,
  Sun,
  Sparkle,
  ShieldCheck,
  Star,
  Check,
  type Icon,
} from "@phosphor-icons/react";

import { useLocaleStore, COUNTRIES } from "@/stores/locale.store";
import { useAuthStore } from "@/stores/auth.store";
import { useProfile } from "@/stores/user.store";
import { useLang } from "@/contexts/lang";

interface CategoryMenuOverlayProps {
  onClose: () => void;
}

function LanguageSelector({ onMenuClose }: { onMenuClose: () => void }) {
  const { country, setCountry } = useLocaleStore();
  const { header: th } = useLang();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-3 w-full py-2.5 text-sm text-[var(--km-text-secondary)] active:text-[var(--km-text)] transition-colors"
      >
        <img src={country.flag} alt={country.name} className="w-5 h-3.5 object-cover rounded-[1px] shadow-sm" />
        <span className="flex-1 text-left">{country.name}</span>
        <CaretRight size={14} className="text-[var(--km-text-muted)]" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[900] flex items-end md:items-center md:justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative w-full bg-white rounded-t-2xl md:rounded-2xl md:w-[320px] overflow-hidden animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--km-border)]">
              <p className="text-sm font-medium text-[var(--km-text)]">{th.selectLanguage}</p>
              <button onClick={() => setOpen(false)} className="p-1 text-[var(--km-text-muted)]">
                <X size={18} />
              </button>
            </div>
            <div className="py-2 overflow-y-auto">
              {COUNTRIES.map((l) => {
                const isActive = l.code === country.code;
                return (
                  <button
                    key={l.code}
                    onClick={() => { setCountry(l); setOpen(false); onMenuClose(); }}
                    className="flex items-center gap-4 w-full px-5 py-3.5 text-left hover:bg-[var(--km-surface)] transition-colors"
                  >
                    <img src={l.flag} alt={l.name} className="w-6 h-4 object-cover rounded-[2px] shadow-sm" />
                    <span className="flex-1 text-sm font-medium text-[var(--km-text)]">{l.name}</span>
                    {isActive && <Check size={16} weight="bold" style={{ color: "var(--km-success)" }} />}
                  </button>
                );
              })}
            </div>
            <div className="h-[env(safe-area-inset-bottom)]" />
          </div>
        </div>
      )}
    </>
  );
}


// ── Right panel categories ────────────────────────────────────────────────────
interface CategoryItem {
  label: string;
  icon: Icon;
  href: string;
}

const CATEGORIES: CategoryItem[] = [
  { label: "MacBook",   icon: ShieldCheck, href: "/products?category=macbook"   },
  { label: "Universal", icon: Sparkle,     href: "/products?category=universal" },
  { label: "iPad",      icon: Star,        href: "/products?category=ipad"      },
  { label: "Monitor",   icon: Sun,         href: "/products?category=monitor"   },
];


// ── Component ─────────────────────────────────────────────────────────────────
export function CategoryMenuOverlay({ onClose }: CategoryMenuOverlayProps) {
  // 2-phase animation: mount → slide-in, then close trigger → slide-out → unmount
  const [visible, setVisible] = useState(false);

  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const profile = useProfile();
  const { nav: tn } = useLang();

  const MAIN_NAV = [
    { label: tn.home,        href: "/"          },
    { label: tn.allProducts, href: "/products"  },
    { label: tn.express,     href: "/express"   },
    { label: tn.store,       href: "/store"     },
    { label: tn.corporate,   href: "/corporate" },
  ];

  // Slide in on mount
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleClose = () => {
    setVisible(false);
    // รอ transition slide-out เสร็จก่อน unmount
    setTimeout(onClose, 300);
  };

  // ป้องกัน body scroll ขณะ menu เปิด
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <>
      {/* Backdrop — fades in/out */}
      <div
        className="fixed inset-0 z-[850] bg-black/50 transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0, pointerEvents: visible ? "auto" : "none" }}
        onClick={handleClose}
      />

      {/* Slide panel */}
      <div
        className="fixed inset-0 z-[860] w-full flex transition-transform duration-300 ease-in-out bg-white"
        style={{ transform: visible ? "translateX(0)" : "translateX(-100%)" }}
      >
        {/* ── Left panel (main nav) ── */}
        <div className="flex flex-col w-[72%] h-full">
          {/* Top bar */}
          <div className="flex-shrink-0">
            {isLoggedIn ? (
              <div className="relative px-5 pt-4 pb-4 flex items-center">
                <Link href="/account" onClick={handleClose} className="flex items-center gap-3 bg-white border border-[var(--km-border)] rounded-2xl px-4 py-3 flex-1 min-w-0">
                  <div className="w-11 h-11 rounded-full bg-white border border-[var(--km-border)] flex items-center justify-center overflow-hidden flex-shrink-0">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[15px] font-bold text-[var(--km-text-secondary)]">
                        {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-[var(--km-text)] truncate">{profile.name || "สมาชิก"}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-[13px] text-[var(--km-text-muted)]">{profile.points.toLocaleString()} {tn.pointsLabel}</span>
                    </div>
                  </div>
                  <CaretRight size={14} className="text-[var(--km-text-muted)] flex-shrink-0" />
                </Link>
                <button onClick={handleClose} className="ml-3 p-1 text-[var(--km-text-muted)] flex-shrink-0">
                  <X size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between px-5 h-14">
                <Link href="/login" onClick={handleClose} className="flex items-center gap-2 text-sm font-medium text-[var(--km-text)]">
                  <User size={16} className="text-[var(--km-text-muted)]" />
                  <span>{tn.loginRegister}</span>
                  <CaretRight size={14} className="text-[var(--km-text-muted)]" />
                </Link>
                <button onClick={handleClose} className="p-1.5 text-[var(--km-text-muted)]">
                  <X size={20} />
                </button>
              </div>
            )}
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto">
            {/* Main nav */}
            <nav className="px-5 pt-2 pb-3 flex flex-col gap-1">
              {MAIN_NAV.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={handleClose}
                  className="py-3 text-[15px] font-normal text-[var(--km-text)] active:text-[var(--km-text-secondary)] transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Language */}
            <div className="px-5 pb-8">
              <LanguageSelector onMenuClose={handleClose} />
            </div>
          </div>
        </div>

        {/* ── Right panel (categories) ── */}
        <div className="w-[28%] h-full flex flex-col overflow-y-auto bg-[var(--km-surface)]">
          <div className="flex flex-col gap-0 py-3 px-2 pb-6">
            {CATEGORIES.map(({ label, icon: Icon, href }) => (
              <Link
                key={href}
                href={href}
                onClick={handleClose}
                className="flex flex-col items-center gap-1.5 py-3 text-center active:opacity-60 transition-opacity"
              >
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 bg-[var(--km-surface)]">
                  <Icon size={26} className="text-[var(--km-text-secondary)]" />
                </div>
                <span className="text-xs font-normal leading-tight text-[var(--km-text-muted)]">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
