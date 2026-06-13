"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Check, ChevronRight } from "lucide-react";
import { useOrdersStore } from "@/stores/orders.store";
import { useUIStore } from "@/stores/ui.store";
import { useEffect } from "react";

export default function ReviewIndexPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const getOrder  = useOrdersStore((s) => s.getOrder);
  const getReview = useOrdersStore((s) => s.getReview);
  const setHeaderTitle = useUIStore((s) => s.setHeaderTitleOverride);
  const order = getOrder(id);

  useEffect(() => {
    setHeaderTitle("ให้คะแนนสินค้า");
    return () => setHeaderTitle(null);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-sm text-[var(--km-text-muted)]">
        ไม่พบคำสั่งซื้อ
      </div>
    );
  }

  const reviewableItems = order.items.filter((i) => !i.isFree);

  return (
    <div className="bg-[var(--km-surface)] min-h-screen pb-24">
      <p className="text-[13px] font-medium text-[var(--km-text-secondary)] px-4 pt-5 pb-2">
        สินค้าที่รอการให้คะแนน
      </p>
      <div className="bg-white mx-4 rounded-xl border border-[var(--km-border)] overflow-hidden divide-y divide-[var(--km-border)]">
        {reviewableItems.map((item) => {
          const reviewed = !!getReview(order.id, item.productId);
          return (
            <button
              key={item.productId}
              onClick={() => !reviewed && router.push(`/account/orders/${id}/review/${item.productId}`)}
              className="w-full flex items-center gap-3 px-4 py-4 text-left active:bg-[var(--km-surface)] transition-colors"
              disabled={reviewed}
            >
              <div className="relative w-14 h-14 rounded-md overflow-hidden bg-[var(--km-surface)] flex-shrink-0">
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium uppercase text-[var(--km-text)] tracking-wider">{item.brand}</p>
                <p className="text-[13px] text-[var(--km-text-secondary)] leading-snug line-clamp-2 mt-0.5">{item.name}</p>
                <p className="text-xs text-[var(--km-text-muted)] mt-0.5">{item.variant}</p>
              </div>
              <div className="flex-shrink-0 ml-2">
                {reviewed ? (
                  <div className="flex items-center gap-1 text-[var(--km-success)]">
                    <Check size={14} strokeWidth={2.5} />
                    <span className="text-xs font-medium">ให้คะแนนแล้ว</span>
                  </div>
                ) : (
                  <ChevronRight size={16} strokeWidth={1.75} className="text-[var(--km-text-muted)]" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
