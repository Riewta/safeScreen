"use client";

import { useState } from "react";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { ChevronRight } from "lucide-react";

export default function PrivacyPage() {
  const isLoggedIn = useRequireAuth();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [affiliateShare, setAffiliateShare] = useState(false);
  const [permissions, setPermissions] = useState({
    location: false,
  });

  const togglePermission = (key: keyof typeof permissions) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!isLoggedIn) return null;

  return (
    <div className="pb-32 px-1 pt-3">
      
      {/* 2. App Permissions */}
      <div className="mb-8">
        <h2 className="text-[15px] font-medium text-[var(--km-text)] px-1 mb-3">การอนุญาตเข้าถึงฟีเจอร์</h2>
        <div className="bg-white rounded-[24px] border border-[var(--km-border)] overflow-hidden divide-y divide-[var(--km-border)]">
          <PermissionRow
            label="อนุญาตให้เข้าถึงตำแหน่งของคุณ"
            checked={permissions.location}
            onChange={() => togglePermission("location")}
          />
        </div>
      </div>

      {/* 3. Data Rights & Account */}
      <div className="mb-8">
        <h2 className="text-[15px] font-medium text-[var(--km-text)] px-1 mb-3">สิทธิ์การจัดการข้อมูล</h2>
        <div className="bg-white rounded-[24px] border border-[var(--km-border)] overflow-hidden divide-y divide-[var(--km-border)]">
          <button
            onClick={() => setDeleteOpen(true)}
            className="flex items-center gap-4 w-full px-5 py-4 text-left active:opacity-60 transition-opacity"
          >
            <div className="flex-1">
              <p className="text-sm font-normal text-[var(--km-error)]">ลบบัญชีและข้อมูลทั้งหมด</p>
              <p className="text-[13px] text-[var(--km-text-muted)] mt-0.5">ไม่สามารถย้อนกลับได้ ข้อมูลทั้งหมดจะถูกลบถาวร</p>
            </div>
            <ChevronRight size={14} strokeWidth={2} className="text-[var(--km-error)]" />
          </button>
        </div>
      </div>

      {/* Delete confirm modal */}
      {deleteOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center px-5">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteOpen(false)} />
          <div className="relative w-full max-w-[360px] bg-white rounded-[32px] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            <p className="text-lg font-semibold text-[var(--km-text)] mb-3 text-center">ลบบัญชีนี้ใช่หรือไม่?</p>
            <p className="text-[14px] text-[var(--km-text-secondary)] leading-relaxed mb-8 text-center px-1">
              การดำเนินการนี้ไม่สามารถย้อนกลับได้ ข้อมูลทั้งหมด รวมถึงประวัติคำสั่งซื้อและคะแนนสะสมจะถูกลบถาวร
            </p>
            <div className="flex flex-col gap-3">
              <button
                className="h-12 rounded-full text-sm font-medium text-white active:scale-[0.98] transition-all"
                style={{ background: "var(--km-error)" }}
              >
                ยืนยันลบบัญชี
              </button>
              <button
                onClick={() => setDeleteOpen(false)}
                className="h-12 rounded-full text-sm font-medium border border-[var(--km-border)] text-[var(--km-text-secondary)] active:scale-[0.98] transition-all"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PermissionRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="px-5 py-4 flex items-center justify-between gap-4">
      <p className="text-sm font-normal text-[var(--km-text)]">{label}</p>
      <Switch checked={checked} onChange={onChange} />
    </div>
  );
}

function Switch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 outline-none flex-shrink-0 ${
        checked ? "bg-[var(--km-text)]" : "bg-[#E8E8ED]"
      }`}
    >
      <div
        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 shadow-sm ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}
