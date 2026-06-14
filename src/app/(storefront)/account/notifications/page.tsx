"use client";

import { useRequireAuth } from "@/hooks/use-require-auth";
import Image from "next/image";
import { Bell, ChevronRight, X, Settings } from "lucide-react";
import { useNotificationsStore } from "@/stores/notifications.store";
import { useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useLang } from "@/contexts/lang";

// ── Notification Preferences Store (inline) ──────────────────────────────────
interface NotifPrefs {
  order: boolean;
  promo: boolean;
  system: boolean;
  toggle: (key: "order" | "promo" | "system") => void;
}

const useNotifPrefs = create<NotifPrefs>()(
  persist(
    (set) => ({
      order:  true,
      promo:  true,
      system: true,
      toggle: (key) => set((s) => ({ [key]: !s[key] })),
    }),
    { name: "karmart-notif-prefs" }
  )
);

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
      style={{ background: on ? "var(--km-text)" : "var(--km-border-strong)" }}
    >
      <span
        className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
        style={{ transform: on ? "translateX(20px)" : "translateX(0)" }}
      />
    </button>
  );
}

function NotifSettingsSheet({ onClose }: { onClose: () => void }) {
  const { order, promo, system, toggle } = useNotifPrefs();
  const { account: ta, common: tc } = useLang();

  const rows = [
    { key: "order" as const,  label: ta.notifOrder,  sub: ta.notifOrderSub,  value: order  },
    { key: "promo" as const,  label: ta.notifPromo,  sub: ta.notifPromoSub,  value: promo  },
    { key: "system" as const, label: ta.notifSystem, sub: ta.notifSystemSub, value: system },
  ];

  return (
    <div className="fixed inset-0 z-[500] flex items-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30" />
      <div
        className="relative w-full bg-white rounded-t-3xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards" }}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-[var(--km-border)]">
          <p className="text-[16px] font-semibold text-[var(--km-text)]">{ta.notifSettings}</p>
          <button onClick={onClose} className="p-1 rounded-full text-[var(--km-text-muted)]">
            <X size={20} />
          </button>
        </div>

        <div className="divide-y divide-[var(--km-border)]">
          {rows.map((r) => (
            <div key={r.key} className="flex items-center justify-between px-5 py-4 gap-4">
              <div className="min-w-0">
                <p className="text-[14px] font-medium text-[var(--km-text)]">{r.label}</p>
                <p className="text-[12px] text-[var(--km-text-muted)] mt-0.5">{r.sub}</p>
              </div>
              <Toggle on={r.value} onToggle={() => toggle(r.key)} />
            </div>
          ))}
        </div>

        <div className="px-5 pt-4 pb-[max(20px,env(safe-area-inset-bottom))]">
          <button
            onClick={onClose}
            className="w-full h-12 rounded-full bg-[var(--km-text)] text-white text-[14px] font-medium"
          >
            {tc.save}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default function NotificationsPage() {
  const isLoggedIn = useRequireAuth();
  const { notifications, markRead, deleteNotification } = useNotificationsStore();
  const [showSettings, setShowSettings] = useState(false);
  const { account: ta, pages: tp } = useLang();

  if (!isLoggedIn) return null;

  return (
    <div className="bg-white md:bg-[var(--km-surface)] min-h-screen pb-24 -mx-4 md:mx-0 mt-0 pt-0">
      {/* Settings trigger */}
      <div className="flex justify-end px-4 pt-3 pb-1">
        <button
          onClick={() => setShowSettings(true)}
          className="flex items-center gap-1.5 text-[13px] text-[var(--km-text-secondary)] py-1.5 px-3 rounded-full border border-[var(--km-border)] active:bg-[var(--km-surface)] transition-colors"
        >
          <Settings size={14} />
          {ta.settingsLabel}
        </button>
      </div>
      {showSettings && <NotifSettingsSheet onClose={() => setShowSettings(false)} />}
      <div className="divide-y divide-[var(--km-border)]">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 px-6">
            <Bell size={40} strokeWidth={1} className="text-[var(--km-text-muted)]" />
            <div className="text-center">
              <p className="text-base font-medium text-[var(--km-text)]">{tp.notifEmpty}</p>
              <p className="text-sm text-[var(--km-text-muted)] mt-1">{tp.notifEmptyDesc}</p>
            </div>
          </div>
        ) : (
          notifications.map((n) => {
            return (
              <div
                key={n.id}
                onClick={() => { markRead(n.id); if (n.href) window.location.href = n.href; }}
                className="group flex gap-4 px-4 py-5 bg-white cursor-pointer active:bg-[var(--km-surface)] transition-all relative"
              >
                {/* Left: Image or Icon */}
                <div className="shrink-0">
                  {n.image ? (
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-[var(--km-surface)] border border-[var(--km-border)] relative">
                      <Image src={n.image} alt="" fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[var(--km-surface)] text-[var(--km-text-muted)] border border-[var(--km-border)]">
                      <Bell size={20} strokeWidth={1.5} />
                    </div>
                  )}
                </div>

                {/* Center: Content */}
                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[14px] font-medium text-[var(--km-text)] leading-tight">{n.title}</p>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5 bg-[var(--km-brand)]" />
                    )}
                  </div>
                  <p className="text-xs text-[var(--km-text-secondary)] mt-1.5 leading-relaxed line-clamp-2 pr-2">{n.body}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <p className="text-xs text-[var(--km-text-muted)] uppercase tracking-wider">
                      {new Date(n.time).toLocaleDateString("th-TH", { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>

                {/* Right Actions: Delete & Chevron */}
                <div className="absolute right-3 top-5 flex flex-col items-center gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(n.id);
                    }}
                    className="p-1 rounded-full text-[var(--km-text-muted)] hover:bg-[var(--km-surface)] hover:text-[var(--km-error)] transition-colors opacity-100"
                    aria-label="Delete notification"
                  >
                    <X size={16} strokeWidth={1.5} />
                  </button>
                  <ChevronRight size={14} className="text-[var(--km-text-muted)] opacity-30 mt-auto" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
