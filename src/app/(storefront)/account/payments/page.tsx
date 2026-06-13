"use client";

import { useState, useEffect } from "react";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { Plus, Trash2, ChevronRight, ChevronLeft } from "lucide-react";
import { useUIStore } from "@/stores/ui.store";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

import {
  BankPicker,
  AddBankForm,
  AddCardForm,
  BankChip,
  CardBrandLogo,
  type SavedBank,
  type SavedCard,
} from "@/components/payment/PaymentShared";

const MOCK_CARDS: SavedCard[] = [
  { id: "c1", brand: "visa",       last4: "4242", expiry: "12/27", name: "THANID O." },
  { id: "c2", brand: "mastercard", last4: "5353", expiry: "08/26", name: "THANID O." },
];
const MOCK_BANKS: SavedBank[] = [
  { id: "b1", bankId: "kbank", accountNo: "xxx-x-xx123-x", name: "ธนิด อ." },
];

type Mode = "list" | "bank-picker" | "add-bank" | "add-card" | "card-detail" | "bank-detail";

function Toggle({ on, disabled, onChange }: { on: boolean; disabled?: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      disabled={disabled}
      className="relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200"
      style={{ background: on ? "var(--km-text)" : "var(--km-border)", opacity: disabled ? 0.4 : 1 }}
    >
      <span
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200"
        style={{ transform: on ? "translateX(20px)" : "translateX(0)" }}
      />
    </button>
  );
}

/* ════════════════════════════════════════
   Page
════════════════════════════════════════ */
export default function PaymentsPage() {
  const isLoggedIn = useRequireAuth();
  const [cards,     setCards]     = useState(MOCK_CARDS);
  const [banks,     setBanks]     = useState(MOCK_BANKS);
  const [defaultId, setDefaultId] = useState<string>("c1");
  const [mode,      setMode]      = useState<Mode>("list");
  const [selectedId,  setSelectedId]  = useState<string | null>(null);
  const [pendingBankId, setPendingBankId] = useState<string>("");
  const [pendingDefault, setPendingDefault] = useState(false);
  const [confirmDelete,  setConfirmDelete]  = useState<{ type: "card" | "bank"; id: string } | null>(null);
  const [confirmDefault, setConfirmDefault] = useState<string | null>(null);

  const setTitleOverride = useUIStore((s) => s.setHeaderTitleOverride);
  const setBackOverride  = useUIStore((s) => s.setHeaderBackOverride);

  useEffect(() => () => { setBackOverride(null); setTitleOverride(null); }, []);

  if (!isLoggedIn) return null;

  const DesktopHeader = ({ title, onBack }: { title: string; onBack: () => void }) => (
    <div className="hidden md:flex items-center gap-3 mb-6">
      <button
        onClick={onBack}
        className="p-1.5 rounded-full hover:bg-[var(--km-surface)] transition-colors text-[var(--km-text-secondary)] hover:text-[var(--km-text)]"
      >
        <ChevronLeft size={20} strokeWidth={1.75} />
      </button>
      <h2 className="text-[15px] font-medium text-[var(--km-text)]">{title}</h2>
    </div>
  );

  const switchMode = (m: Mode, id?: string) => {
    setMode(m);
    if (id !== undefined) setSelectedId(id);
    const titles: Record<Mode, string | null> = {
      "list":         null,
      "bank-picker":  "เลือกธนาคาร",
      "add-bank":     "เพิ่มบัญชีธนาคาร",
      "add-card":     "เพิ่มบัตรใหม่",
      "card-detail":  "รายละเอียดบัตร",
      "bank-detail":  "รายละเอียดบัญชี",
    };
    setTitleOverride(titles[m]);
    if (m === "list") {
      setBackOverride(null);
      setSelectedId(null);
    } else if (m === "bank-picker") {
      setBackOverride(() => switchMode("add-bank"));
    } else if (m === "add-bank" || m === "add-card") {
      setBackOverride(() => switchMode("list"));
    } else {
      setBackOverride(() => switchMode("list"));
    }
  };

  const removeCard = (id: string) => {
    const remaining = cards.filter((c) => c.id !== id);
    setCards(remaining);
    if (defaultId === id) setDefaultId(remaining[0]?.id ?? banks[0]?.id ?? "");
  };
  const removeBank = (id: string) => {
    const remaining = banks.filter((b) => b.id !== id);
    setBanks(remaining);
    if (defaultId === id) setDefaultId(remaining[0]?.id ?? cards[0]?.id ?? "");
  };

  /* ── Bank picker ── */
  if (mode === "bank-picker") {
    return (
      <div className="min-h-screen">
        <DesktopHeader title="เลือกธนาคาร" onBack={() => switchMode("add-bank")} />
        <BankPicker
          selected={pendingBankId}
          onSelect={(id) => { setPendingBankId(id); switchMode("add-bank"); }}
        />
      </div>
    );
  }

  /* ── Add bank ── */
  if (mode === "add-bank") {
    return (
      <div className="min-h-screen">
        <DesktopHeader title="เพิ่มบัญชีธนาคาร" onBack={() => switchMode("list")} />
        <AddBankForm
          bankId={pendingBankId}
          isDefault={pendingDefault}
          onToggleDefault={() => setPendingDefault((p) => !p)}
          onPickBank={() => switchMode("bank-picker")}
          onSave={(data) => {
            const newBank: SavedBank = { id: `b${Date.now()}`, ...data };
            setBanks((p) => [...p, newBank]);
            if (pendingDefault || banks.length === 0) setDefaultId(newBank.id);
            setPendingBankId("");
            setPendingDefault(false);
            switchMode("list");
          }}
        />
      </div>
    );
  }

  /* ── Add card ── */
  if (mode === "add-card") {
    return (
      <div className="min-h-screen">
        <DesktopHeader title="เพิ่มบัตรใหม่" onBack={() => switchMode("list")} />
        <AddCardForm
          isDefault={pendingDefault}
          onToggleDefault={() => setPendingDefault((p) => !p)}
          onSave={(data) => {
            const newCard: SavedCard = { id: `c${Date.now()}`, ...data };
            setCards((p) => [...p, newCard]);
            if (pendingDefault || cards.length === 0) setDefaultId(newCard.id);
            setPendingDefault(false);
            switchMode("list");
          }}
        />
      </div>
    );
  }

  /* ── Card detail ── */
  if (mode === "card-detail") {
    const card = cards.find((c) => c.id === selectedId);
    if (!card) return null;
    const isDefault    = defaultId === card.id;
    const canToggleOff = cards.length > 1 || banks.length > 0;

    return (
      <div className="bg-[var(--km-surface)] min-h-screen pb-24 -mx-4 mt-0 md:mx-0 md:mt-0">
        <DesktopHeader title="รายละเอียดบัตร" onBack={() => switchMode("list")} />
        <div className="bg-white mx-4 mt-5 md:mt-0 rounded-xl border border-[var(--km-border)] px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-7 rounded border border-[var(--km-border)] overflow-hidden flex items-center justify-center flex-shrink-0 bg-white">
            <CardBrandLogo brand={card.brand} className="w-10 h-7" />
          </div>
          <div className="flex-1 flex items-center justify-between">
            <span className="text-[13px] text-[var(--km-text)]">{card.name}</span>
            <span className="text-[13px] text-[var(--km-text-secondary)] tabular-nums">•••• {card.last4}</span>
          </div>
        </div>

        <p className="text-[13px] font-medium text-[var(--km-text-secondary)] px-4 pt-5 pb-2">การตั้งค่า</p>
        <div className="bg-white mx-4 rounded-lg border border-[var(--km-border)] overflow-hidden divide-y divide-[var(--km-border)]">
          <div className="flex items-center justify-between px-4 py-4">
            <div>
              <p className="text-sm font-normal text-[var(--km-text)]">ตั้งเป็นค่าเริ่มต้น</p>
              {isDefault && !canToggleOff && (
                <p className="text-xs text-[var(--km-text-muted)] mt-0.5">ต้องมีวิธีชำระเงินค่าเริ่มต้นอย่างน้อย 1 รายการ</p>
              )}
            </div>
            <Toggle
              on={isDefault}
              disabled={isDefault && !canToggleOff}
              onChange={() => { if (!isDefault) setConfirmDefault(card.id); }}
            />
          </div>
          <button
            onClick={() => setConfirmDelete({ type: "card", id: card.id })}
            className="w-full flex items-center justify-between px-4 py-4 active:bg-red-50 transition-colors"
          >
            <span className="text-sm font-normal" style={{ color: "var(--km-error)" }}>ลบบัตรนี้</span>
            <Trash2 size={15} strokeWidth={1.5} style={{ color: "var(--km-error)" }} />
          </button>
        </div>

        <ConfirmDialog
          open={!!confirmDefault}
          title="เปลี่ยนค่าเริ่มต้น?"
          description="วิธีชำระเงินนี้จะถูกเลือกโดยอัตโนมัติเมื่อชำระสินค้า"
          confirmLabel="ยืนยัน"
          onConfirm={() => { if (confirmDefault) setDefaultId(confirmDefault); setConfirmDefault(null); }}
          onCancel={() => setConfirmDefault(null)}
        />
        <ConfirmDialog
          open={!!confirmDelete}
          title="ลบบัตรนี้?"
          description="ไม่สามารถกู้คืนได้หลังจากลบแล้ว"
          confirmLabel="ลบ"
          danger
          onConfirm={() => { if (confirmDelete) { removeCard(confirmDelete.id); setConfirmDelete(null); switchMode("list"); } }}
          onCancel={() => setConfirmDelete(null)}
        />
      </div>
    );
  }

  /* ── Bank detail ── */
  if (mode === "bank-detail") {
    const bank = banks.find((b) => b.id === selectedId);
    if (!bank) return null;
    const isDefault    = defaultId === bank.id;
    const canToggleOff = banks.length > 1 || cards.length > 0;

    return (
      <div className="bg-[var(--km-surface)] min-h-screen pb-24 -mx-4 mt-0 md:mx-0 md:mt-0">
        <DesktopHeader title="รายละเอียดบัญชี" onBack={() => switchMode("list")} />
        <div className="bg-white mx-4 mt-5 md:mt-0 rounded-xl border border-[var(--km-border)] px-4 py-4 flex items-center gap-3">
          <BankChip bankId={bank.bankId} />
          <div className="flex-1 flex items-center justify-between">
            <span className="text-[13px] text-[var(--km-text)]">{bank.name}</span>
            <span className="text-[13px] text-[var(--km-text-secondary)] tabular-nums">•••• {bank.accountNo.slice(-4)}</span>
          </div>
        </div>

        <p className="text-[13px] font-medium text-[var(--km-text-secondary)] px-4 pt-5 pb-2">การตั้งค่า</p>
        <div className="bg-white mx-4 rounded-lg border border-[var(--km-border)] overflow-hidden divide-y divide-[var(--km-border)]">
          <div className="flex items-center justify-between px-4 py-4">
            <div>
              <p className="text-sm font-normal text-[var(--km-text)]">ตั้งเป็นค่าเริ่มต้น</p>
              {isDefault && !canToggleOff && (
                <p className="text-xs text-[var(--km-text-muted)] mt-0.5">ต้องมีวิธีชำระเงินค่าเริ่มต้นอย่างน้อย 1 รายการ</p>
              )}
            </div>
            <Toggle
              on={isDefault}
              disabled={isDefault && !canToggleOff}
              onChange={() => { if (!isDefault) setConfirmDefault(bank.id); }}
            />
          </div>
          <button
            onClick={() => setConfirmDelete({ type: "bank", id: bank.id })}
            className="w-full flex items-center justify-between px-4 py-4 active:bg-red-50 transition-colors"
          >
            <span className="text-sm font-normal" style={{ color: "var(--km-error)" }}>ลบบัญชีนี้</span>
            <Trash2 size={15} strokeWidth={1.5} style={{ color: "var(--km-error)" }} />
          </button>
        </div>

        <ConfirmDialog
          open={!!confirmDefault}
          title="เปลี่ยนค่าเริ่มต้น?"
          description="วิธีชำระเงินนี้จะถูกเลือกโดยอัตโนมัติเมื่อชำระสินค้า"
          confirmLabel="ยืนยัน"
          onConfirm={() => { if (confirmDefault) setDefaultId(confirmDefault); setConfirmDefault(null); }}
          onCancel={() => setConfirmDefault(null)}
        />
        <ConfirmDialog
          open={!!confirmDelete}
          title="ลบบัญชีนี้?"
          description="ไม่สามารถกู้คืนได้หลังจากลบแล้ว"
          confirmLabel="ลบ"
          danger
          onConfirm={() => { if (confirmDelete) { removeBank(confirmDelete.id); setConfirmDelete(null); switchMode("list"); } }}
          onCancel={() => setConfirmDelete(null)}
        />
      </div>
    );
  }

  /* ── List ── */
  return (
    <div className="bg-[var(--km-surface)] min-h-screen pb-24 -mx-4 mt-0 md:mx-0 md:mt-0">

      {/* Bank accounts */}
      <p className="text-[13px] font-medium text-[var(--km-text-secondary)] px-4 pb-2">บัญชีธนาคาร</p>
      <div className="bg-white mx-4 rounded-lg border border-[var(--km-border)] overflow-hidden divide-y divide-[var(--km-border)]">
        {banks.map((b) => (
          <button
            key={b.id}
            onClick={() => switchMode("bank-detail", b.id)}
            className="w-full px-4 py-4 flex items-center gap-3 active:bg-[var(--km-surface)] transition-colors"
          >
            <BankChip bankId={b.bankId} />
            <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[13px] font-normal text-[var(--km-text)] truncate">{b.name}</span>
                {defaultId === b.id && <span className="text-xs font-medium text-[var(--km-success)] flex-shrink-0">ค่าเริ่มต้น</span>}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[13px] text-[var(--km-text-secondary)] tabular-nums">•••• {b.accountNo.slice(-4)}</span>
                <ChevronRight size={14} strokeWidth={1.5} className="text-[var(--km-text-muted)]" />
              </div>
            </div>
          </button>
        ))}
        <button
          onClick={() => { setPendingBankId(""); setPendingDefault(banks.length === 0 && cards.length === 0); switchMode("bank-picker"); }}
          className="w-full flex items-center gap-3 px-4 py-4 text-[var(--km-text-secondary)] active:bg-[var(--km-surface)] transition-colors"
        >
          <div className="w-8 h-8 rounded-full border border-dashed border-[var(--km-border)] flex items-center justify-center"><Plus size={14} /></div>
          <span className="text-[13px] font-medium">เพิ่มบัญชีธนาคาร</span>
        </button>
      </div>

      {/* Cards */}
      <p className="text-[13px] font-medium text-[var(--km-text-secondary)] px-4 pt-5 pb-2">บัตรเครดิต / เดบิต</p>
      <div className="bg-white mx-4 rounded-lg border border-[var(--km-border)] overflow-hidden divide-y divide-[var(--km-border)]">
        {cards.map((c) => (
          <button
            key={c.id}
            onClick={() => switchMode("card-detail", c.id)}
            className="w-full px-4 py-4 flex items-center gap-3 active:bg-[var(--km-surface)] transition-colors"
          >
            <div className="w-10 h-7 rounded border border-[var(--km-border)] overflow-hidden flex items-center justify-center flex-shrink-0 bg-white">
              <CardBrandLogo brand={c.brand} className="w-10 h-7" />
            </div>
            <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[13px] font-normal text-[var(--km-text)] truncate">{c.name}</span>
                {defaultId === c.id && <span className="text-xs font-medium text-[var(--km-success)] flex-shrink-0">ค่าเริ่มต้น</span>}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[13px] text-[var(--km-text-secondary)] tabular-nums">•••• {c.last4}</span>
                <ChevronRight size={14} strokeWidth={1.5} className="text-[var(--km-text-muted)]" />
              </div>
            </div>
          </button>
        ))}
        <button
          onClick={() => { setPendingDefault(banks.length === 0 && cards.length === 0); switchMode("add-card"); }}
          className="w-full flex items-center gap-3 px-4 py-4 text-[var(--km-text-secondary)] active:bg-[var(--km-surface)] transition-colors"
        >
          <div className="w-8 h-8 rounded-full border border-dashed border-[var(--km-border)] flex items-center justify-center"><Plus size={14} /></div>
          <span className="text-[13px] font-medium">เพิ่มบัตรใหม่</span>
        </button>
      </div>
    </div>
  );
}
