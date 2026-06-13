"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import Image from "next/image";
import { ChevronRight, ChevronDown, Package } from "lucide-react";
import { useOrdersStore, STATUS_LABEL, type OrderStatus, type Order, type OrderItem, type ReturnStatus } from "@/stores/orders.store";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { useCartStore } from "@/stores/cart.store";
import { PillTabs } from "@/components/ui/PillTabs";
import { EmptyState } from "@/components/ui/EmptyState";

const PAYMENT_WINDOW_MS = 24 * 60 * 60 * 1000;

function useCountdown(createdAt: string) {
  const deadline = new Date(createdAt).getTime() + PAYMENT_WINDOW_MS;
  const [remaining, setRemaining] = useState(deadline - Date.now());
  useEffect(() => {
    const timer = setInterval(() => setRemaining(deadline - Date.now()), 1000);
    return () => clearInterval(timer);
  }, [deadline]);
  if (remaining <= 0) return null;
  const h = Math.floor(remaining / 3600000);
  const m = Math.floor((remaining % 3600000) / 60000);
  const s = Math.floor((remaining % 60000) / 1000);
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const TABS: { label: string; value: OrderStatus | "all" | "returning" }[] = [
  { label: "ทั้งหมด",             value: "all"             },
  { label: "ที่ต้องชำระ",         value: "pending_payment" },
  { label: "ที่ต้องจัดส่ง",       value: "processing"      },
  { label: "กำลังจัดส่ง",        value: "shipped"         },
  { label: "สำเร็จ",              value: "delivered"       },
  { label: "คืนเงิน/คืนสินค้า",  value: "returning"       },
  { label: "ยกเลิกแล้ว",         value: "cancelled"       },
];

const RETURN_STATUS_LABEL: Record<ReturnStatus, string> = {
  return_requested: "รอตรวจสอบ",
  return_pending:   "รอตรวจสอบ",
  return_completed: "คืนเงินแล้ว",
};

function ItemRow({ item }: { item: OrderItem }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="relative w-12 h-12 rounded-md overflow-hidden bg-[var(--km-surface)] flex-shrink-0">
        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-medium text-[var(--km-text)] mb-0.5">{item.brand}</p>
        <p className="text-sm text-[var(--km-text-secondary)] line-clamp-1 leading-snug">{item.name}</p>
        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
          {item.isFree ? (
            <span className="text-[11px] text-white bg-[var(--km-text)] rounded-full px-2 py-0.5">ของแถม</span>
          ) : item.variant ? (
            <span className="text-[11px] text-[var(--km-text-muted)] border border-[var(--km-border)] rounded-full px-2 py-0.5">{item.variant}</span>
          ) : null}
          {!item.isFree && <span className="text-xs text-[var(--km-text-muted)]">x{item.quantity}</span>}
        </div>
        {item.returnStatus && (
          <p className="text-xs font-medium mt-1" style={{ color: item.returnStatus === "return_completed" ? "var(--km-success)" : "var(--km-warning)" }}>
            {RETURN_STATUS_LABEL[item.returnStatus] || "ขอคืนสินค้า"}
          </p>
        )}
      </div>
      <div className="text-right flex-shrink-0 ml-2">
        {item.isFree
          ? <span className="text-sm font-medium text-[var(--km-success)]">ฟรี</span>
          : <span className="text-sm font-normal text-[var(--km-text-secondary)]">฿{(item.price * item.quantity).toLocaleString()}</span>
        }
      </div>
    </div>
  );
}

function OrderCard({ order, returningOnly }: { order: Order; returningOnly?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const items = returningOnly ? order.items.filter(i => i.returnStatus) : order.items;
  const totalQty = items.reduce((n, i) => n + i.quantity, 0);
  const hasMore = items.length > 1;
  const restItems = items.slice(1);
  
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const updateStatus = useOrdersStore((s) => s.updateStatus);
  const countdown = useCountdown(order.createdAt);

  useEffect(() => {
    if (order.status === "pending_payment" && !countdown) {
      updateStatus(order.id, "cancelled");
    }
  }, [order.id, order.status, countdown, updateStatus]);

  const handleBuyAgain = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearCart();
    items.filter((i) => !i.isFree).forEach((i) => {
      addItem({ productId: i.productId, name: i.name, brand: i.brand, image: i.image, price: i.price, variant: i.variant ?? "", quantity: i.quantity });
    });
    router.push("/cart");
  };

  return (
    <div onClick={() => router.push(`/account/orders/${order.id}`)} className="bg-white rounded-2xl border border-[var(--km-border)] overflow-hidden active:bg-[var(--km-surface)]/60 transition-colors cursor-pointer">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-1">
        <p className="text-[13px] font-medium text-[var(--km-text)]">#{order.id}</p>
        <div className="flex items-center gap-1.5">
          {(() => {
            // Priority: Return Status > Order Status
            const pendingReturn = order.items.find(i => i.returnStatus === "return_pending" || i.returnStatus === "return_requested");
            const completedReturn = order.items.find(i => i.returnStatus === "return_completed");
            
            if (pendingReturn) {
              return <span className="text-[13px] font-normal text-[var(--km-warning)]">รอตรวจสอบ</span>;
            }
            if (completedReturn) {
              return <span className="text-[13px] font-normal text-[var(--km-success)]">คืนเงินแล้ว</span>;
            }

            if (order.status !== "pending_payment") {
              return (
                <span className="text-[13px] font-normal" style={{ color: order.status === "cancelled" ? "var(--km-error)" : "var(--km-warning)" }}>
                  {STATUS_LABEL[order.status]}
                </span>
              );
            } else {
              return (
                <>
                  {countdown ? (
                    <span className="text-[13px] font-normal tabular-nums text-[var(--km-warning)]">
                      {countdown}
                    </span>
                  ) : (
                    <span className="text-[12px] font-medium text-[var(--km-error)]">
                      หมดเวลา
                    </span>
                  )}
                </>
              );
            }
          })()}
        </div>
      </div>

      {/* First item */}
      <ItemRow item={items[0]} />

      {/* Expandable rest */}
      {hasMore && (
        <>
          <div
            className="overflow-hidden transition-all duration-300 ease-in-out divide-y divide-[var(--km-border)]"
            style={{ maxHeight: expanded ? `${restItems.length * 120}px` : "0px" }}
          >
            {restItems.map((item, i) => <ItemRow key={i} item={item} />)}
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs text-[var(--km-text-muted)] hover:bg-[var(--km-surface)] transition-colors"
          >
            <ChevronDown
              size={14}
              strokeWidth={2}
              className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
            />
            {expanded ? "ซ่อน" : `ดูสินค้าทั้งหมด ${items.length} รายการ`}
          </button>
        </>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between px-4 pt-1 pb-4">
        <span className="text-xs text-[var(--km-text-muted)]">{totalQty} ชิ้น</span>
        <div className="flex items-center gap-2">
          {order.status === "shipped" && (
            <button
              onClick={(e) => { e.stopPropagation(); updateStatus(order.id, "delivered"); }}
              className="text-xs font-medium text-white bg-[var(--km-text)] px-3 py-1.5 rounded-full active:opacity-80 transition-opacity"
            >
              รับสินค้าแล้ว
            </button>
          )}
          {order.status === "delivered" && (
            <>
              <button 
                onClick={handleBuyAgain} 
                className="text-[13px] font-medium text-[var(--km-text-secondary)] border border-[var(--km-border)] px-3 py-1.5 rounded-full active:bg-[var(--km-surface)] transition-colors"
              >
                ซื้ออีกครั้ง
              </button>
            </>
          )}
          <div className="flex items-center gap-0.5">
            <span className="text-sm font-normal text-[var(--km-text)]">฿{order.total.toLocaleString()}</span>
            <ChevronRight size={14} strokeWidth={1.75} className="text-[var(--km-text-muted)]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function OrdersContent() {
  const searchParams = useSearchParams();
  const isLoggedIn   = useRequireAuth();
  const activeStatus = (searchParams.get("status") ?? "all") as OrderStatus | "all" | "returning";
  const allOrders    = useOrdersStore((s) => s.orders);
  
  const orders = activeStatus === "all"
    ? allOrders
    : activeStatus === "returning"
      ? allOrders.filter((o) => o.items.some((i) => i.returnStatus))
      : activeStatus === "delivered"
        ? allOrders.filter((o) => o.status === "delivered" && !o.items.some((i) => i.returnStatus))
        : allOrders.filter((o) => o.status === activeStatus);

  if (!isLoggedIn) return null;

  return (
    <div className="flex flex-col gap-0">
      <div className="md:pt-0 pt-3">
        <PillTabs
          scrollable
          replace
          active={activeStatus}
          tabs={TABS.map((t) => ({
            key: t.value,
            label: t.label,
            href: t.value === "all" ? "/account/orders" : `/account/orders?status=${t.value}`,
          }))}
        />
      </div>

      <div className="pt-4 flex flex-col gap-4 pb-20">
        {orders.length === 0 ? (
          <EmptyState icon={Package} title="ไม่มีคำสั่งซื้อในสถานะนี้" />
        ) : (
          orders.map((order) => <OrderCard key={order.id} order={order} returningOnly={activeStatus === "returning"} />)
        )}
      </div>

    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense>
      <OrdersContent />
    </Suspense>
  );
}
