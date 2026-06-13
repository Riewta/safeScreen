"use client";

import { useEffect } from "react";
import { Bell, X, ChevronRight, ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useUIStore } from "@/stores/ui.store";
import { useNotificationsStore } from "@/stores/notifications.store";
import { useRouter } from "next/navigation";
import { useLang } from "@/contexts/lang";

export function NotifDrawer() {
  const { pages: t } = useLang();
  const open  = useUIStore((s) => s.notifDrawerOpen);
  const close = useUIStore((s) => s.closeNotifDrawer);
  const { notifications, markRead, deleteNotification } = useNotificationsStore();
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, close]);

  return (
    <>
      <div
        onClick={close}
        className={`fixed inset-0 z-[870] bg-black/30 transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />
      <div
        className={`flex fixed top-0 right-0 bottom-0 z-[880] w-full md:w-[390px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out overflow-hidden ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-[var(--km-border)]">
          <button onClick={close} className="p-1.5 rounded-full hover:bg-[var(--km-surface)] transition-colors md:hidden">
            <ChevronLeft size={20} strokeWidth={1.75} />
          </button>
          <span className="flex-1 text-[15px] font-medium text-[var(--km-text)] md:flex-none">{t.notifTitle}</span>
          <button onClick={close} className="hidden md:flex p-1.5 rounded-full hover:bg-[var(--km-surface)] transition-colors ml-auto">
            <X size={18} strokeWidth={1.75} />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[var(--km-border)]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-6">
              <div className="w-14 h-14 rounded-full bg-[var(--km-surface)] flex items-center justify-center border border-[var(--km-border)]">
                <Bell size={24} strokeWidth={1} className="text-[var(--km-text-muted)]" />
              </div>
              <p className="text-sm text-[var(--km-text-muted)]">ไม่มีการแจ้งเตือน</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => { markRead(n.id); close(); if (n.href) router.push(n.href); }}
                className="group flex gap-3 px-4 py-4 cursor-pointer hover:bg-[var(--km-surface)] transition-colors relative"
              >
                <div className="shrink-0">
                  {n.image ? (
                    <div className="w-11 h-11 rounded-lg overflow-hidden bg-[var(--km-surface)] border border-[var(--km-border)] relative">
                      <Image src={n.image} alt="" fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-11 h-11 rounded-full flex items-center justify-center bg-[var(--km-surface)] border border-[var(--km-border)]">
                      <Bell size={18} strokeWidth={1.5} className="text-[var(--km-text-muted)]" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 pr-8">
                  <div className="flex items-start gap-2">
                    <p className="text-[13px] font-medium text-[var(--km-text)] leading-tight flex-1">{n.title}</p>
                    {!n.read && <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1 bg-[var(--km-brand)]" />}
                  </div>
                  <p className="text-[12px] text-[var(--km-text-secondary)] mt-1 leading-relaxed line-clamp-2">{n.body}</p>
                  <p className="text-[11px] text-[var(--km-text-muted)] mt-1.5 uppercase tracking-wider">
                    {new Date(n.time).toLocaleDateString("th-TH", { day: "numeric", month: "short" })}
                  </p>
                </div>
                <div className="absolute right-3 top-4 flex flex-col items-center gap-3">
                  <button onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                    className="p-1 rounded-full text-[var(--km-text-muted)] hover:text-[var(--km-error)] hover:bg-[var(--km-surface)] transition-colors">
                    <X size={14} strokeWidth={1.5} />
                  </button>
                  <ChevronRight size={13} className="text-[var(--km-text-muted)] opacity-30" />
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </>
  );
}
