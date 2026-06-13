"use client";

import React from "react";
import { useAuthStore } from "@/stores/auth.store";

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LogoutConfirmModal({ isOpen, onClose }: LogoutConfirmModalProps) {
  const logout = useAuthStore((s) => s.logout);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center px-6">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity" 
        onClick={onClose} 
      />
      <div className="relative w-full max-w-xs bg-white rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 fade-in duration-200">
        <div className="px-6 pt-6 pb-5 text-center">
          <p className="text-base font-semibold text-[var(--km-text)]">ออกจากระบบ</p>
          <p className="text-sm text-[var(--km-text-secondary)] mt-1.5">คุณต้องการออกจากระบบใช่ไหม?</p>
        </div>
        <div className="flex divide-x divide-[var(--km-border)] border-t border-[var(--km-border)]">
          <button
            onClick={onClose}
            className="flex-1 py-4 text-sm text-[var(--km-text-secondary)] hover:bg-[var(--km-surface)] transition-colors"
          >
            ยกเลิก
          </button>
          <button
            onClick={() => { 
              onClose(); 
              logout(); 
            }}
            className="flex-1 py-4 text-sm text-[var(--km-error)] font-bold hover:bg-[var(--km-error)]/5 transition-colors"
          >
            ออกจากระบบ
          </button>
        </div>
      </div>
    </div>
  );
}
