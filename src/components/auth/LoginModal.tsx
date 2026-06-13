"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Heart, Lock } from "lucide-react";

interface LoginModalProps {
  onClose: () => void;
  reason?: "wishlist" | "points" | "orders" | "general";
  redirectTo?: string;
}

const REASONS = {
  wishlist: { icon: Heart,  title: "บันทึกรายการโปรด",    desc: "เข้าสู่ระบบเพื่อบันทึกสินค้าที่ถูกใจไว้ดูภายหลัง" },
  points:   { icon: Lock,   title: "ดูคะแนนสะสม",         desc: "เข้าสู่ระบบเพื่อดูและใช้คะแนน SafeScreen Points" },
  orders:   { icon: Lock,   title: "ดูประวัติคำสั่งซื้อ",  desc: "เข้าสู่ระบบเพื่อติดตามคำสั่งซื้อและประวัติการซื้อ" },
  general:  { icon: Lock,   title: "เข้าสู่ระบบ",          desc: "เข้าสู่ระบบเพื่อใช้งานฟีเจอร์นี้" },
};

export function LoginModal({ onClose, reason = "general", redirectTo }: LoginModalProps) {
  const router   = useRouter();
  const [visible, setVisible] = useState(false);
  const info = REASONS[reason];
  const Icon = info.icon;

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleClose = () => { setVisible(false); setTimeout(onClose, 280); };

  const handleLogin = () => {
    handleClose();
    const dest = redirectTo ? `/login?redirect=${encodeURIComponent(redirectTo)}` : "/login";
    setTimeout(() => router.push(dest), 280);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[900] bg-black/40 transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
        onClick={handleClose}
      />
      <div
        className="fixed inset-x-0 bottom-0 z-[910] bg-white rounded-t-2xl overflow-hidden transition-transform duration-[280ms] ease-out"
        style={{ transform: visible ? "translateY(0)" : "translateY(100%)" }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-9 h-1 rounded-full bg-[var(--km-border-strong)]" />
        </div>

        <div className="px-6 pb-2 flex justify-end">
          <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--km-surface)] text-[var(--km-text-muted)] transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 pb-8 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-[var(--km-surface)] flex items-center justify-center mb-4">
            <Icon size={24} strokeWidth={1.5} className="text-[var(--km-text-secondary)]" />
          </div>
          <p className="text-lg font-medium text-[var(--km-text)] mb-1">{info.title}</p>
          <p className="text-sm text-[var(--km-text-muted)] leading-relaxed mb-8 max-w-xs">{info.desc}</p>

          <button
            onClick={handleLogin}
            className="w-full py-3.5 rounded-full bg-[var(--km-text)] text-white text-sm font-medium mb-3"
          >
            เข้าสู่ระบบ / สมัครสมาชิก
          </button>
          <button
            onClick={handleClose}
            className="w-full py-3.5 rounded-full border border-[var(--km-border)] text-sm font-medium text-[var(--km-text-secondary)]"
          >
            ไว้ทีหลัง
          </button>
        </div>
      </div>
    </>
  );
}
