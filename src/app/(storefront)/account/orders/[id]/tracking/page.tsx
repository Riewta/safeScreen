"use client";

import { useParams, useRouter } from "next/navigation";
import { useOrdersStore, STATUS_LABEL } from "@/stores/orders.store";
import { CheckCircle, Circle, Truck, Package, MapPin, ClipboardCheck, Clock } from "lucide-react";

type TrackStep = {
  key: string;
  label: string;
  sublabel: string;
  icon: React.ElementType;
};

const STEPS: TrackStep[] = [
  { key: "ordered",     label: "รับคำสั่งซื้อแล้ว",     sublabel: "ระบบได้รับคำสั่งซื้อของคุณ",              icon: ClipboardCheck },
  { key: "processing",  label: "กำลังเตรียมสินค้า",      sublabel: "ทีมงานกำลังแพ็คสินค้าของคุณ",            icon: Package },
  { key: "shipped",     label: "สินค้าออกจากคลัง",       sublabel: "ส่งให้ขนส่งเรียบร้อยแล้ว",               icon: Truck },
  { key: "out",         label: "อยู่ระหว่างการจัดส่ง",   sublabel: "พัสดุอยู่ใกล้คุณแล้ว",                   icon: MapPin },
  { key: "delivered",   label: "จัดส่งสำเร็จ",           sublabel: "คุณได้รับสินค้าเรียบร้อยแล้ว",           icon: CheckCircle },
];

function getActiveStep(status: string): number {
  switch (status) {
    case "pending_payment": return 0;
    case "processing":      return 1;
    case "shipped":         return 3;
    case "delivered":       return 4;
    case "cancelled":       return -1;
    default:                return 0;
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("th-TH", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function TrackingPage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();
  const getOrder = useOrdersStore((s) => s.getOrder);
  const order    = getOrder(id);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-[var(--km-text-muted)]">
        <Package size={48} strokeWidth={1.25} className="opacity-30 mb-3" />
        <p className="text-[15px]">ไม่พบคำสั่งซื้อ</p>
      </div>
    );
  }

  const activeStep = getActiveStep(order.status);
  const isCancelled = order.status === "cancelled";

  // Mock timestamps derived from createdAt
  const base = new Date(order.createdAt).getTime();
  const mockTimes = [
    new Date(base).toISOString(),
    new Date(base + 30 * 60 * 1000).toISOString(),
    new Date(base + 4 * 60 * 60 * 1000).toISOString(),
    new Date(base + 20 * 60 * 60 * 1000).toISOString(),
    order.estimatedDelivery ?? new Date(base + 48 * 60 * 60 * 1000).toISOString(),
  ];

  return (
    <div className="pb-32">
      {/* Courier Card */}
      <div className="bg-white border border-[var(--km-border)] rounded-2xl p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--km-surface)] flex items-center justify-center flex-shrink-0">
            <Truck size={18} className="text-[var(--km-text-secondary)]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-medium text-[var(--km-text)]">
              {order.shippingProvider ?? "SafeScreen Express"}
            </p>
            {order.trackingNumber ? (
              <p className="text-[13px] text-[var(--km-text-muted)] mt-0.5">
                เลขพัสดุ: <span className="font-medium text-[var(--km-text)]">{order.trackingNumber}</span>
              </p>
            ) : (
              <p className="text-[13px] text-[var(--km-text-muted)] mt-0.5">ยังไม่มีเลขพัสดุ</p>
            )}
          </div>
          {order.trackingNumber && (
            <button
              onClick={() => {
                navigator.clipboard?.writeText(order.trackingNumber ?? "");
              }}
              className="text-[12px] font-medium text-[var(--km-text-secondary)] border border-[var(--km-border)] rounded-full px-3 py-1.5 active:bg-[var(--km-surface)] transition-colors flex-shrink-0"
            >
              คัดลอก
            </button>
          )}
        </div>

        {order.estimatedDelivery && order.status !== "delivered" && order.status !== "cancelled" && (
          <div className="mt-3 pt-3 border-t border-[var(--km-border)] flex items-center gap-2">
            <Clock size={14} className="text-[var(--km-success)] flex-shrink-0" />
            <p className="text-[13px] text-[var(--km-success)] font-medium">
              คาดว่าจะได้รับภายใน{" "}
              {new Date(order.estimatedDelivery).toLocaleDateString("th-TH", {
                day: "numeric", month: "long",
              })}
            </p>
          </div>
        )}
      </div>

      {/* Cancelled State */}
      {isCancelled ? (
        <div className="bg-white border border-[var(--km-border)] rounded-2xl p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
            <Circle size={24} className="text-[var(--km-error)]" strokeWidth={1.5} />
          </div>
          <p className="text-[15px] font-medium text-[var(--km-text)]">คำสั่งซื้อถูกยกเลิก</p>
          <p className="text-[13px] text-[var(--km-text-muted)] mt-1">คำสั่งซื้อนี้ถูกยกเลิกแล้ว</p>
        </div>
      ) : (
        /* Timeline */
        <div className="bg-white border border-[var(--km-border)] rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--km-border)]">
            <p className="text-[14px] font-medium text-[var(--km-text)]">สถานะการจัดส่ง</p>
          </div>
          <div className="px-5 py-4">
            {STEPS.map((step, idx) => {
              const done    = idx <= activeStep;
              const current = idx === activeStep;
              const Icon    = step.icon;
              const isLast  = idx === STEPS.length - 1;

              return (
                <div key={step.key} className="flex gap-4">
                  {/* Line + dot column */}
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                      done
                        ? current
                          ? "bg-[var(--km-text)] text-white"
                          : "bg-[var(--km-text)] text-white"
                        : "bg-[var(--km-surface)] text-[var(--km-text-muted)] border border-[var(--km-border)]"
                    }`}>
                      <Icon size={15} strokeWidth={done ? 2 : 1.5} />
                    </div>
                    {!isLast && (
                      <div className={`w-0.5 flex-1 min-h-[28px] my-1 transition-colors ${done && idx < activeStep ? "bg-[var(--km-text)]" : "bg-[var(--km-border)]"}`} />
                    )}
                  </div>

                  {/* Content column */}
                  <div className={`flex-1 pb-${isLast ? "0" : "5"} pt-1`}>
                    <p className={`text-[14px] font-medium leading-tight ${done ? "text-[var(--km-text)]" : "text-[var(--km-text-muted)]"}`}>
                      {step.label}
                      {current && (
                        <span className="ml-2 inline-flex items-center gap-1 text-[11px] font-medium text-[var(--km-brand)] bg-[var(--km-surface)] border border-[var(--km-border)] rounded-full px-2 py-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--km-text)] animate-pulse" />
                          ปัจจุบัน
                        </span>
                      )}
                    </p>
                    <p className={`text-[12px] mt-0.5 ${done ? "text-[var(--km-text-secondary)]" : "text-[var(--km-text-muted)]"}`}>
                      {step.sublabel}
                    </p>
                    {done && (
                      <p className="text-[11px] text-[var(--km-text-muted)] mt-1">
                        {formatDate(mockTimes[idx])}
                      </p>
                    )}
                    {!isLast && <div className="h-2" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Order ID footer */}
      <p className="text-center text-[12px] text-[var(--km-text-muted)] mt-6">
        คำสั่งซื้อ #{order.id}
      </p>
    </div>
  );
}
