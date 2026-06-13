"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useUIStore } from "@/stores/ui.store";

const ANNOUNCEMENTS = [
  "ฟิล์มกันมองแม่เหล็ก ถอดติดได้ทันที ไม่ทิ้งคราบ",
  "สั่งองค์กร 10+ ชิ้น รับราคาพิเศษ — ติดต่อทีมงาน",
];

export function BottomAnnouncement() {
  const setBottomAnnouncementVisible = useUIStore((s) => s.setBottomAnnouncementVisible);
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    const closed = sessionStorage.getItem("announcement-closed");
    if (!closed) {
      setShowAnnouncement(true);
      setBottomAnnouncementVisible(true);
    }
    return () => {
      setBottomAnnouncementVisible(false);
    };
  }, [setBottomAnnouncementVisible]);

  useEffect(() => {
    if (!showAnnouncement) return;
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setActiveIndex((prev) => prev + 1);
    }, 4000);
    return () => clearInterval(timer);
  }, [showAnnouncement]);

  useEffect(() => {
    if (activeIndex === ANNOUNCEMENTS.length) {
      const resetTimer = setTimeout(() => {
        setIsTransitioning(false);
        setActiveIndex(0);
      }, 500);
      return () => clearTimeout(resetTimer);
    }
  }, [activeIndex]);

  if (!showAnnouncement) return null;

  return (
    <div className="relative w-full bg-[var(--km-surface-dark)]/95 text-[var(--km-text-inverse)] text-xs text-center py-2 px-8 tracking-wide backdrop-blur-md border-b border-[var(--km-border)]/10 overflow-hidden h-9 flex items-center justify-center">
      <div className="h-5 overflow-hidden relative w-full flex justify-center items-center">
        <div 
          className={`flex flex-col absolute inset-x-0 ${isTransitioning ? "transition-transform duration-500 ease-in-out" : "transition-none"}`}
          style={{ transform: `translateY(-${activeIndex * 20}px)` }}
        >
          {[...ANNOUNCEMENTS, ANNOUNCEMENTS[0]].map((text, i) => (
            <div key={i} className="h-5 flex items-center justify-center text-center font-normal">
              {text}
            </div>
          ))}
        </div>
      </div>
      <button 
        onClick={() => {
          setShowAnnouncement(false);
          setBottomAnnouncementVisible(false);
          sessionStorage.setItem("announcement-closed", "true");
        }}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-[var(--km-text-inverse)]/70 hover:text-[var(--km-text-inverse)] transition-colors animate-none pointer-events-auto"
        aria-label="ปิดการแจ้งเตือน"
      >
        <X size={12} strokeWidth={2.5} />
      </button>
    </div>
  );
}
