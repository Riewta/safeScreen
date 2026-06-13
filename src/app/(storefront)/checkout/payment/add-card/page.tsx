"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useCheckoutStore } from "@/stores/checkout.store";

import { AddCardForm, BRAND_LABEL } from "@/components/payment/PaymentShared";
import { useUIStore } from "@/stores/ui.store";

export default function AddCardPage() {
  const router = useRouter();
  const addSavedCard = useCheckoutStore((s) => s.addSavedCard);
  const setPaymentMethod = useCheckoutStore((s) => s.setPaymentMethod);
  const setTitleOverride = useUIStore((s) => s.setHeaderTitleOverride);
  const setBackOverride  = useUIStore((s) => s.setHeaderBackOverride);



  useEffect(() => {
    setTitleOverride("เพิ่มบัตรใหม่");
    setBackOverride(() => router.back());
    return () => {
      setTitleOverride(null);
      setBackOverride(null);
    };
  }, []);

  const handleSave = (card: any) => {
    addSavedCard({ last4: card.last4, brand: BRAND_LABEL[card.brand || "visa"] || "Visa" });
    setPaymentMethod("card");
    router.replace("/checkout");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-lg mx-auto pb-24">
        <div className="hidden md:flex items-center gap-3 px-4 pt-8 pb-4">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--km-surface)] transition-colors text-[var(--km-text)]"
          >
            <ChevronLeft size={22} />
          </button>
          <h1 className="text-xl font-medium text-[var(--km-text)]">เพิ่มบัตรใหม่</h1>
        </div>
        <AddCardForm
          onSave={handleSave}
          isDefault={true}
          onToggleDefault={() => {}}
          disableDefaultToggle={true}
        />
      </div>
    </div>
  );
}
