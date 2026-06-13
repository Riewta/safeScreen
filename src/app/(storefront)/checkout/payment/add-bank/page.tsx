"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useCheckoutStore } from "@/stores/checkout.store";
import { AddBankForm, BankPicker } from "@/components/payment/PaymentShared";
import { useUIStore } from "@/stores/ui.store";

export default function AddBankPage() {
  const router = useRouter();
  const addSavedBank = useCheckoutStore((s) => s.addSavedBank);
  const setPaymentMethod = useCheckoutStore((s) => s.setPaymentMethod);
  const setTitleOverride = useUIStore((s) => s.setHeaderTitleOverride);
  const setBackOverride  = useUIStore((s) => s.setHeaderBackOverride);

  const [bankId, setBankId] = useState("");
  const [showPicker, setShowPicker] = useState(true);

  useEffect(() => {
    setTitleOverride(showPicker ? "เลือกธนาคาร" : "เพิ่มบัญชีธนาคาร");
    setBackOverride(() => {
      if (showPicker) router.back();
      else setShowPicker(true);
    });
    return () => {
      setTitleOverride(null);
      setBackOverride(null);
    };
  }, [showPicker, router]);

  const handleSave = (bank: any) => {
    addSavedBank({ bankId: bank.bankId, accountNo: bank.accountNo, name: bank.name });
    setPaymentMethod("bank");
    router.replace("/checkout");
  };

  const desktopHeader = (title: string, onBack: () => void) => (
    <div className="hidden md:flex items-center gap-3 pt-8 pb-4">
      <button
        onClick={onBack}
        className="p-1.5 rounded-full hover:bg-[var(--km-surface)] transition-colors text-[var(--km-text-secondary)] hover:text-[var(--km-text)]"
      >
        <ChevronLeft size={20} strokeWidth={1.75} />
      </button>
      <h1 className="text-[15px] font-medium text-[var(--km-text)]">{title}</h1>
    </div>
  );

  if (showPicker) {
    return (
      <div className="min-h-screen bg-white">
        <div className="w-full max-w-lg mx-auto pb-24">
          {desktopHeader("เลือกธนาคาร", () => router.back())}
          <BankPicker selected={bankId} onSelect={(id) => { setBankId(id); setShowPicker(false); }} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-lg mx-auto pb-24">
        {desktopHeader("เพิ่มบัญชีธนาคาร", () => setShowPicker(true))}
        <AddBankForm
          bankId={bankId}
          onPickBank={() => setShowPicker(true)}
          onSave={handleSave}
          isDefault={true}
          onToggleDefault={() => {}}
          disableDefaultToggle={true}
        />
      </div>
    </div>
  );
}
