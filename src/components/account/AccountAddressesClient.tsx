"use client";

import { useState, useEffect } from "react";
import { MapPin, Plus, Trash2, ChevronRight, ChevronLeft } from "lucide-react";
import { useCheckoutStore, type SavedAddress } from "@/stores/checkout.store";
import { useUIStore } from "@/stores/ui.store";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { AddressForm } from "@/components/checkout/AddressClient";

type Mode =
  | { type: "list" }
  | { type: "add" }
  | { type: "detail"; address: SavedAddress };

export function AccountAddressesClient() {
  const isLoggedIn = useRequireAuth();
  const { addresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } =
    useCheckoutStore();

  const setHeaderTitleOverride = useUIStore((s) => s.setHeaderTitleOverride);
  const setBackOverride = useUIStore((s) => s.setHeaderBackOverride);
  
  const [mode, setMode] = useState<Mode>({ type: "list" });
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [saveCallback, setSaveCallback] = useState<(() => void) | null>(null);

  useEffect(() => () => { setHeaderTitleOverride(null); setBackOverride(null); }, [setHeaderTitleOverride, setBackOverride]);

  if (!isLoggedIn) return null;

  const switchMode = (m: Mode) => {
    setMode(m);
    if (m.type === "add")    { setHeaderTitleOverride("เพิ่มที่อยู่");   setBackOverride(() => switchMode({ type: "list" })); }
    if (m.type === "detail") { setHeaderTitleOverride("แก้ไขที่อยู่"); setBackOverride(() => switchMode({ type: "list" })); }
    if (m.type === "list")   { setHeaderTitleOverride(null); setBackOverride(null); }
  };

  if (mode.type === "add") {
    return (
      <div className="min-h-screen -mx-4 md:-mx-6 lg:mx-0">
        <div className="hidden md:flex items-center gap-3 mb-6">
          <button onClick={() => switchMode({ type: "list" })} className="p-1.5 rounded-full hover:bg-[var(--km-surface)] transition-colors text-[var(--km-text-secondary)] hover:text-[var(--km-text)]">
            <ChevronLeft size={20} strokeWidth={1.75} />
          </button>
          <h2 className="text-[15px] font-medium text-[var(--km-text)]">เพิ่มที่อยู่ใหม่</h2>
        </div>
        <AddressForm
          onSave={(data) => {
            const newId = addAddress(data);
            if (data.isDefault) setDefaultAddress(newId);
            switchMode({ type: "list" });
            window.scrollTo(0, 0);
          }}
          onSaveReady={(fn) => setSaveCallback(() => fn)}
        />
        {/* Save button */}
        <div
          className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--km-border)] px-4 z-[810]"
          style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))", paddingTop: "12px" }}
        >
          <button
            onClick={() => saveCallback?.()}
            className="w-full py-3.5 rounded-full bg-[var(--km-text)] text-white text-[15px] font-medium active:scale-[0.98] transition-all"
          >
            บันทึกที่อยู่
          </button>
        </div>
        <div className="mt-6 mb-8">
          <button
            onClick={() => saveCallback?.()}
            className="hidden md:block w-full py-2.5 rounded-full bg-[var(--km-text)] text-white text-[14px] font-medium hover:opacity-90 active:scale-[0.98] transition-all"
          >
            บันทึกที่อยู่
          </button>
        </div>
      </div>
    );
  }

  if (mode.type === "detail") {
    const addr = mode.address;
    const liveAddr = addresses.find((a) => a.id === addr.id) ?? addr;
    const isDefault = liveAddr.isDefault;
    const canToggleOff = addresses.length > 1;

    return (
      <div className="min-h-screen -mx-4 md:-mx-6 lg:mx-0">
        <div className="hidden md:flex items-center gap-3 mb-6">
          <button onClick={() => switchMode({ type: "list" })} className="p-1.5 rounded-full hover:bg-[var(--km-surface)] transition-colors text-[var(--km-text-secondary)] hover:text-[var(--km-text)]">
            <ChevronLeft size={20} strokeWidth={1.75} />
          </button>
          <h2 className="text-[15px] font-medium text-[var(--km-text)]">แก้ไขที่อยู่</h2>
        </div>
        <AddressForm
          initial={addr}
          initialIsDefault={isDefault}
          onSave={(data) => {
            updateAddress(addr.id, data);
            if (data.isDefault) setDefaultAddress(addr.id);
            switchMode({ type: "list" });
            window.scrollTo(0, 0);
          }}
          onSaveReady={(fn) => setSaveCallback(() => fn)}
          disableDefaultToggle={isDefault && !canToggleOff}
        >
          <button
            type="button"
            onClick={() => setConfirmDelete(addr.id)}
            className="flex items-center gap-3 w-full py-1 mt-1"
          >
            <Trash2 size={15} strokeWidth={1.5} className="text-[var(--km-error)]" />
            <span className="text-[15px] text-[var(--km-error)]">ลบที่อยู่นี้</span>
          </button>
        </AddressForm>

        {/* Save button */}
        <div
          className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--km-border)] px-4 z-[810]"
          style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))", paddingTop: "12px" }}
        >
          <button
            onClick={() => saveCallback?.()}
            className="w-full py-3.5 rounded-full bg-[var(--km-text)] text-white text-[15px] font-medium active:scale-[0.98] transition-all"
          >
            บันทึกที่อยู่
          </button>
        </div>
        <div className="mt-6 mb-8">
          <button
            onClick={() => saveCallback?.()}
            className="hidden md:block w-full py-2.5 rounded-full bg-[var(--km-text)] text-white text-[14px] font-medium hover:opacity-90 active:scale-[0.98] transition-all"
          >
            บันทึกที่อยู่
          </button>
        </div>

        <ConfirmDialog
          open={confirmDelete === addr.id}
          title="ลบที่อยู่"
          description="ต้องการลบที่อยู่นี้ใช่ไหม? ไม่สามารถยกเลิกได้"
          confirmLabel="ลบ"
          danger
          onConfirm={() => {
            if (confirmDelete) deleteAddress(confirmDelete);
            setConfirmDelete(null);
            switchMode({ type: "list" });
            window.scrollTo(0, 0);
          }}
          onCancel={() => setConfirmDelete(null)}
        />
      </div>
    );
  }

  /* ── List ── */
  return (
    <div className="min-h-screen pb-28 -mx-4 md:mx-0">

      {addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <MapPin size={48} strokeWidth={1} className="text-[var(--km-text-muted)]" />
          <div>
            <p className="text-[15px] font-medium text-[var(--km-text)]">ยังไม่มีที่อยู่จัดส่ง</p>
            <p className="text-[13px] text-[var(--km-text-muted)] mt-1">เพิ่มที่อยู่สำหรับการจัดส่งสินค้า</p>
          </div>
          <button onClick={() => switchMode({ type: "add" })}
            className="mt-2 px-6 py-2.5 rounded-full border border-[var(--km-border)] text-[13px] text-[var(--km-text-secondary)] hover:border-[var(--km-border-strong)] hover:text-[var(--km-text)] transition-all">
            + เพิ่มที่อยู่ใหม่
          </button>
        </div>
      ) : (
        <>
          <div className="bg-white mx-4 md:mx-0 rounded-lg border border-[var(--km-border)] overflow-hidden divide-y divide-[var(--km-border)]">
            {addresses.map((addr) => (
              <button
                key={addr.id}
                onClick={() => switchMode({ type: "detail", address: addr })}
                className="w-full px-4 py-4 flex items-center gap-3 active:bg-[var(--km-surface)] hover:bg-[var(--km-surface)] transition-colors text-left"
              >
                <MapPin size={15} strokeWidth={1.5} className="flex-shrink-0 text-[var(--km-text-muted)]" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="text-[14px] font-medium text-[var(--km-text)]">{addr.firstName} {addr.lastName}</span>
                    {addr.label && (
                      <span className="text-[13px] font-normal border border-[var(--km-border)] text-[var(--km-text-secondary)] px-2 py-0.5 rounded-full">
                        {addr.label}
                      </span>
                    )}
                    {addr.isDefault && (
                      <span className="text-[13px] font-medium text-[var(--km-success)]">ค่าเริ่มต้น</span>
                    )}
                  </div>
                  <p className="text-[13px] text-[var(--km-text-secondary)] leading-relaxed">
                    {addr.address} {addr.subDistrict || ""} {addr.district} {addr.province} {addr.postalCode}
                  </p>
                </div>
                <ChevronRight size={14} strokeWidth={1.5} className="text-[var(--km-text-muted)] flex-shrink-0" />
              </button>
            ))}
            <button
              onClick={() => switchMode({ type: "add" })}
              className="w-full flex items-center gap-3 px-4 py-4 text-[var(--km-text-secondary)] hover:bg-[var(--km-surface)] transition-colors"
            >
              <Plus size={16} />
              <span className="text-[14px] font-normal">เพิ่มที่อยู่ใหม่</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
