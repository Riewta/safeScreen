"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Plus, Check, Banknote } from "lucide-react";
import { useCheckoutStore } from "@/stores/checkout.store";
import { useUIStore } from "@/stores/ui.store";
import { BankChip, THAI_BANKS, CardBrandLogo, PromptPayLogo } from "@/components/payment/PaymentShared";

const PAYMENT_OPTS = [
  { id: "promptpay", label: "พร้อมเพย์", sub: "สแกน QR ผ่าน Mobile Banking" },
  { id: "cod",       label: "เก็บเงินปลายทาง", sub: "ชำระเงินสดเมื่อรับสินค้า" },
] as const;

export default function SelectPaymentPage() {
  const router = useRouter();
  const setTitleOverride = useUIStore((s) => s.setHeaderTitleOverride);
  const setBackOverride  = useUIStore((s) => s.setHeaderBackOverride);

  const { savedBanks, savedCards, paymentMethod, setPaymentMethod } = useCheckoutStore();

  useEffect(() => {
    setTitleOverride("เลือกช่องทางการชำระเงิน");
    setBackOverride(() => router.back());
    return () => {
      setTitleOverride(null);
      setBackOverride(null);
    };
  }, [router]);

  const handleSelect = (id: string) => {
    setPaymentMethod(id);
    router.back();
  };

  return (
    <div className="min-h-screen bg-[var(--km-surface)] md:pt-16 pb-24">
      <div className="max-w-2xl mx-auto bg-white md:rounded-2xl md:shadow-sm overflow-hidden border-y md:border border-[var(--km-border)]">
        <div className="flex flex-col divide-y divide-[var(--km-border)]">
          {/* Saved Banks */}
          {savedBanks.map((b) => {
            const active = paymentMethod === b.id;
            return (
              <button
                key={b.id}
                onClick={() => handleSelect(b.id)}
                className="flex items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-[var(--km-surface)]"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-transparent">
                  <BankChip bankId={b.bankId} size="sm" />
                </div>
                <div className="flex-1 min-w-0 flex items-center justify-between gap-3 pr-2">
                  <span className="text-[15px] font-normal text-[var(--km-text)] truncate">
                    {THAI_BANKS.find((tb) => tb.id === b.bankId)?.name || "บัญชีธนาคาร"}
                  </span>
                  <span className="text-[14px] font-normal text-[var(--km-text)] flex-shrink-0">
                    *{b.accountNo.slice(-4)}
                  </span>
                </div>
                {active && <Check size={18} strokeWidth={2.5} className="text-[var(--km-text)] flex-shrink-0" />}
              </button>
            );
          })}
          {savedBanks.length < 3 && (
            <button
              onClick={() => router.push("/checkout/payment/add-bank")}
              className="flex items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-[var(--km-surface)]"
            >
              <div className="w-8 h-8 rounded-lg bg-[var(--km-surface)] flex items-center justify-center flex-shrink-0">
                <Plus size={16} className="text-[var(--km-text-secondary)]" />
              </div>
              <p className="flex-1 min-w-0 text-[15px] font-normal text-[var(--km-text)]">เพิ่มบัญชีธนาคาร</p>
              <ChevronRight size={18} className="text-[var(--km-text-muted)]" />
            </button>
          )}

          {/* Saved Cards */}
          {savedCards.map((c) => {
            const active = paymentMethod === c.id;
            return (
              <button
                key={c.id}
                onClick={() => handleSelect(c.id)}
                className="flex items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-[var(--km-surface)]"
              >
                <div className="w-10 h-7 flex items-center justify-center flex-shrink-0">
                  <CardBrandLogo brand={c.brand} className="w-10 h-7 rounded object-contain" />
                </div>
                <div className="flex-1 min-w-0 flex items-center justify-between gap-3 pr-2">
                  <span className="text-[15px] font-normal text-[var(--km-text)] truncate">
                    บัตรเครดิต {c.brand ? c.brand.toUpperCase() : ""}
                  </span>
                  <span className="text-[14px] font-normal text-[var(--km-text)] flex-shrink-0">
                    *{c.last4}
                  </span>
                </div>
                {active && <Check size={18} strokeWidth={2.5} className="text-[var(--km-text)] flex-shrink-0" />}
              </button>
            );
          })}
          {savedCards.length < 3 && (
            <button
              onClick={() => router.push("/checkout/payment/add-card")}
              className="flex items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-[var(--km-surface)]"
            >
              <div className="w-8 h-8 rounded-lg bg-[var(--km-surface)] flex items-center justify-center flex-shrink-0">
                <Plus size={16} className="text-[var(--km-text-secondary)]" />
              </div>
              <p className="flex-1 min-w-0 text-[15px] font-normal text-[var(--km-text)]">เพิ่มบัตรเครดิต / เดบิต</p>
              <ChevronRight size={18} className="text-[var(--km-text-muted)]" />
            </button>
          )}

          {/* Promptpay & COD */}
          {PAYMENT_OPTS.map(({ id, label }) => {
            const active = paymentMethod === id;
            return (
              <button
                key={id}
                onClick={() => handleSelect(id)}
                className="flex items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-[var(--km-surface)]"
              >
                <div className="w-10 h-7 flex items-center justify-center flex-shrink-0">
                  {id === "promptpay"
                    ? <PromptPayLogo className="w-10 h-7 rounded" />
                    : <Banknote size={20} className="text-[var(--km-text-secondary)]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[15px] font-normal text-[var(--km-text)] truncate">{label}</span>
                </div>
                {active && <Check size={18} strokeWidth={2.5} className="text-[var(--km-text)] flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
