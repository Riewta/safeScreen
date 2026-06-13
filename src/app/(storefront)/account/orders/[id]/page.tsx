"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ChevronLeft, X, MapPin, Truck, Package } from "lucide-react";
import { useOrdersStore, STATUS_LABEL, STATUS_COLOR } from "@/stores/orders.store";
import { useCheckoutStore } from "@/stores/checkout.store";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

const PAYMENT_WINDOW_MS = 24 * 60 * 60 * 1000;

function useCountdown(createdAt: string) {
  const deadline = createdAt ? new Date(createdAt).getTime() + PAYMENT_WINDOW_MS : 0;
  const [remaining, setRemaining] = useState(() => deadline - Date.now());
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

// ── Page ──────────────────────────────────────────────────────────────────────
export default function OrderDetailPage() {
  const { id }      = useParams<{ id: string }>();
  const router        = useRouter();
  const getOrder      = useOrdersStore((s) => s.getOrder);
  const getReview     = useOrdersStore((s) => s.getReview);
  const updateAddress = useOrdersStore((s) => s.updateAddress);
  const updateStatus  = useOrdersStore((s) => s.updateStatus);
  const addresses     = useCheckoutStore((s) => s.addresses);
  const order         = getOrder(id);
  const [showAddrSheet, setShowAddrSheet] = useState(false);
  const [selectedAddrId, setSelectedAddrId] = useState<string | null>(null);
  const [showReturnExpired, setShowReturnExpired] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [confirmReceive, setConfirmReceive] = useState(false);

  useEffect(() => {
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (nav?.type === "back_forward") return;
    const hash = window.location.hash;
    if (!hash) return;
    const el = document.querySelector(hash);
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
    }
  }, []);

  // Auto-cancel if payment window expires
  useEffect(() => {
    if (!order) return;
    if (order.status === "pending_payment") {
      const deadline = new Date(order.createdAt).getTime() + PAYMENT_WINDOW_MS;
      if (Date.now() >= deadline) {
        updateStatus(order.id, "cancelled");
      }
    }
  }, [order?.id, order?.status, order?.createdAt, updateStatus]);

  const countdown = useCountdown(order?.createdAt ?? "");

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-[var(--km-text-muted)]">
        <Package size={48} strokeWidth={1.25} className="opacity-30 mb-3" />
        <p className="text-[15px]">ไม่พบคำสั่งซื้อ</p>
      </div>
    );
  }

  const statusColor = STATUS_COLOR[order.status];

  return (
    <div className="pb-32">
      <div className="hidden md:flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="p-1.5 rounded-full hover:bg-[var(--km-surface)] transition-colors text-[var(--km-text-secondary)] hover:text-[var(--km-text)]"
        >
          <ChevronLeft size={20} strokeWidth={1.75} />
        </button>
        <h2 className="text-[15px] font-medium text-[var(--km-text)] flex-1">รายละเอียดคำสั่งซื้อ</h2>
        {/* Desktop CTA */}
        {(order.status === "pending_payment" || order.status === "processing") && (
          <button
            onClick={() => setConfirmCancel(true)}
            className="px-4 py-2 rounded-full border border-[var(--km-border-strong)] text-[13px] font-medium text-[var(--km-text-secondary)] hover:bg-[var(--km-surface)] transition-colors"
          >
            ยกเลิกคำสั่งซื้อ
          </button>
        )}
        {order.status === "shipped" && (
          <button
            onClick={() => setConfirmReceive(true)}
            className="px-4 py-2 rounded-full bg-[var(--km-text)] text-[13px] font-medium text-white hover:opacity-90 transition-opacity"
          >
            ได้รับสินค้าแล้ว
          </button>
        )}
        {order.status === "delivered" && (() => {
          const hasUnreviewed = order.items.some(i => !i.isFree);
          return (
            <div className="flex gap-2">
              {hasUnreviewed && (
                <button
                  onClick={() => router.push("/account/reviews")}
                  className="px-4 py-2 rounded-full border border-[var(--km-border)] text-[13px] font-medium text-[var(--km-text)] hover:bg-[var(--km-surface)] transition-colors"
                >
                  ให้คะแนน
                </button>
              )}
              <button className="px-4 py-2 rounded-full bg-[var(--km-text)] text-[13px] font-medium text-white hover:opacity-90 transition-opacity">
                ซื้ออีกครั้ง
              </button>
            </div>
          );
        })()}
      </div>
      <div className="flex flex-col gap-0">
        {/* Shipping Info */}
        <div className="mt-1">
            <p className="text-[14px] font-medium text-[var(--km-text-secondary)] mb-2 px-1">ข้อมูลการจัดส่ง</p>
        <div className="bg-white rounded-lg border border-[var(--km-border)] overflow-hidden">
        <div className="px-4 py-4 flex flex-col gap-4">
          {/* Status row */}
          <div className="flex items-center justify-between">
            <p className="text-[14px] text-[var(--km-text-secondary)]">สถานะ</p>
            <div className="flex items-center gap-2">
              {order.status !== "pending_payment" && (() => {
                const pendingReturn = order.items.find(i => i.returnStatus === "return_pending" || i.returnStatus === "return_requested");
                const completedReturn = order.items.find(i => i.returnStatus === "return_completed");
                
                if (pendingReturn) {
                  return <p className="text-[14px] font-normal text-[var(--km-warning)]">รอตรวจสอบ</p>;
                }
                if (completedReturn) {
                  return <p className="text-[14px] font-normal text-[var(--km-success)]">คืนเงินแล้ว</p>;
                }

                return (
                  <p className="text-[14px] font-normal" style={{ color: statusColor }}>
                    {STATUS_LABEL[order.status]}
                  </p>
                );
              })()}
              {order.status === "pending_payment" && (
                countdown
                  ? <p className="text-[14px] font-normal tabular-nums" style={{ color: statusColor }}>{countdown}</p>
                  : <p className="text-[13px] font-medium text-[var(--km-error)]">หมดเวลา</p>
              )}
            </div>
          </div>
          <div className="h-px bg-[var(--km-border)]" />
          {/* Shipping Method */}
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--km-surface)] flex items-center justify-center flex-shrink-0">
              <Truck size={16} className="text-[var(--km-text-secondary)]" />
            </div>
            <div className="flex-1">
              <div className="mt-1">
                <p className="text-[15px] text-[var(--km-text)]">
                  {order.shippingProvider ?? "จัดส่งโดย SafeScreen"}
                  {order.trackingNumber && <span className="text-[14px] text-[var(--km-text-muted)]"> ({order.trackingNumber})</span>}
                </p>
              </div>
              {order.status === "delivered" ? (
                <p className="text-[13px] text-[var(--km-success)] font-medium mt-1">จัดส่งสำเร็จแล้ว</p>
              ) : order.estimatedDelivery ? (
                <p className="text-[13px] text-[var(--km-success)] font-medium mt-1">
                  คาดว่าจะได้รับภายใน {new Date(order.estimatedDelivery).toLocaleDateString("th-TH", { day: "2-digit", month: "2-digit", year: "2-digit" })}
                </p>
              ) : null}
              {(order.status === "shipped" || order.status === "processing" || order.status === "delivered") && (
                <button
                  onClick={() => router.push(`/account/orders/${order.id}/tracking`)}
                  className="mt-2 text-[13px] font-medium text-[var(--km-text)] underline underline-offset-2"
                >
                  ติดตามพัสดุ →
                </button>
              )}
            </div>
          </div>

          <div className="h-px bg-[var(--km-border)] border-dashed border-t" />

          {/* Recipient & Address */}
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-full bg-[var(--km-surface)] flex items-center justify-center flex-shrink-0">
              <MapPin size={16} className="text-[var(--km-text-secondary)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] text-[var(--km-text)] mt-1">
                {order.recipientName}
                <span className="text-[14px] text-[var(--km-text-muted)]"> (+66) {order.phone.replace(/^0/, "")}</span>
              </p>
              <p className="text-[13px] text-[var(--km-text-secondary)] leading-relaxed mt-1 truncate">{order.address}</p>
            </div>
            {(order.status === "processing" || order.status === "pending_payment") && (
              <button
                onClick={() => { setSelectedAddrId(null); setShowAddrSheet(true); }}
                className="text-[14px] text-[var(--km-text-secondary)] flex-shrink-0 ml-2"
              >
                เปลี่ยน
              </button>
            )}
          </div>
        </div>
        </div>
      </div>

      {/* Items */}
      <div className="mt-4">
        <p className="text-[14px] font-medium text-[var(--km-text-secondary)] mb-2 px-1">สินค้า</p>
        <div className="bg-white rounded-lg border border-[var(--km-border)] overflow-hidden divide-y divide-[var(--km-border)]">
          {order.items.map((item, i) => {
            return (
              <div key={i} id={`item-${item.productId}`} className="px-4 py-4 scroll-mt-16">
                <div className="flex gap-3">
                  <div className="relative w-16 h-16 rounded-md overflow-hidden bg-[var(--km-surface)] flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/brands/${item.brand.toLowerCase().replace(/\s+/g, "-")}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-0.5 mt-0.5 group"
                      >
                        <span className="text-[15px] font-medium text-[var(--km-text)] group-hover:underline">{item.brand}</span>
                        <ChevronRight size={13} strokeWidth={2} className="text-[var(--km-text-muted)]" />
                      </Link>
                        {item.returnStatus && (
                          <span className="text-xs font-medium" style={{
                            color: item.returnStatus === "return_completed" ? "var(--km-success)" :
                                   item.returnStatus === "return_pending" ? "var(--km-warning)" :
                                   "var(--km-warning)"
                          }}>
                            {item.returnStatus === "return_completed" ? "คืนเงินสำเร็จ" :
                             item.returnStatus === "return_pending" ? "รอตรวจสอบ" :
                             "ขอคืนสินค้า"}
                          </span>
                        )}
                    </div>
                    <p className="text-[13px] font-normal text-[var(--km-text-secondary)] line-clamp-2 mt-0.5">{item.name}</p>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      {item.isFree ? (
                        <span className="text-[11px] text-white bg-[var(--km-text)] rounded-full px-2 py-0.5">ของแถม</span>
                      ) : item.variant ? (
                        <span className="text-[11px] text-[var(--km-text-muted)] border border-[var(--km-border)] rounded-full px-2 py-0.5">{item.variant}</span>
                      ) : null}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[13px] text-[var(--km-text-muted)]">x{item.quantity}</span>
                      <span className="text-[15px] text-[var(--km-text)]">
                        ฿{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Reviewed badge removed as it was cluttering the UI */}
              </div>
            );
          })}
        </div>
      </div>

      {/* Price summary + Payment info */}
      <div className="mt-4">
        <p className="text-[14px] font-medium text-[var(--km-text-secondary)] mb-2 px-1">สรุปคำสั่งซื้อ</p>
        <div className="bg-white rounded-lg border border-[var(--km-border)] px-4 py-4 flex flex-col gap-2">

          {/* Order meta */}
          <div className="flex justify-between text-[14px]">
            <span className="text-[var(--km-text-secondary)]">หมายเลขคำสั่งซื้อ</span>
            <span className="text-[var(--km-text)]">{order.id}</span>
          </div>
          <div className="flex justify-between text-[14px]">
            <span className="text-[var(--km-text-secondary)]">วันที่สั่งซื้อ</span>
            <span className="text-[var(--km-text)]">
              {new Date(order.createdAt).toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" })}
            </span>
          </div>
          {order.paymentMethod && (
            <div className="flex justify-between text-[14px]">
              <span className="text-[var(--km-text-secondary)]">ชำระผ่าน</span>
              <span className="text-[var(--km-text)]">{order.paymentMethod}</span>
            </div>
          )}
          {order.paidAt && (
            <div className="flex justify-between text-[14px]">
              <span className="text-[var(--km-text-secondary)]">วันที่ชำระเงิน</span>
              <span className="text-[var(--km-text)]">
                {new Date(order.paidAt).toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" })}
              </span>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-[var(--km-border)] my-1" />

          {/* Price rows */}
          <div className="flex justify-between text-[14px]">
            <span className="text-[var(--km-text-secondary)]">ยอดสินค้า</span>
            <span className="text-[var(--km-text)]">฿{order.subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-[14px]">
            <span className="text-[var(--km-text-secondary)]">ค่าจัดส่ง</span>
            <span className="text-[var(--km-text)]">฿{order.shippingFee.toLocaleString()}</span>
          </div>
          {order.discount > 0 && (
            order.discountBreakdown ? (
              order.discountBreakdown.map((d) => (
                <div key={d.label} className="flex justify-between text-[14px]">
                  <span className="text-[var(--km-text-secondary)]">{d.label}</span>
                  <span className="text-[var(--km-text)]">-฿{d.amount.toLocaleString()}</span>
                </div>
              ))
            ) : (
              <div className="flex justify-between text-[14px]">
                <span className="text-[var(--km-text-secondary)]">ส่วนลด</span>
                <span className="text-[var(--km-text)]">-฿{order.discount.toLocaleString()}</span>
              </div>
            )
          )}
          <div className="flex justify-between text-[15px] font-medium pt-1 border-t border-[var(--km-border)]">
            <span className="text-[var(--km-text)]">ยอดรวม</span>
            <span className="text-[var(--km-text)]">฿{order.total.toLocaleString()}</span>
          </div>

        </div>
      </div>

      {/* ── Return button (in body, below summary) ── */}
      {order.status === "delivered" && (() => {
        const deliveredAt = new Date(order.createdAt).getTime();
        const canReturn   = Date.now() - deliveredAt < 7 * 24 * 60 * 60 * 1000;
        return (
          <div className="mt-3 mb-2">
            <button
              onClick={() => canReturn ? router.push(`/account/orders/${order.id}/return`) : setShowReturnExpired(true)}
              className="w-full py-2 text-[15px] text-[var(--km-text-muted)] active:opacity-60 transition-opacity"
            >
              คืนสินค้า / คืนเงิน
            </button>
          </div>
        );
      })()}

      {/* ── Fixed bottom actions ── */}
      {(() => {
        const hasUnreviewed = order.status === "delivered" &&
          order.items.some((item) => !getReview(order.id, item.productId));

        if (order.status === "shipped") {
          return (
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--km-border)] z-[810]">
              <div className="px-4" style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))", paddingTop: "12px" }}>
                <button
                  onClick={() => setConfirmReceive(true)}
                  className="w-full py-3.5 rounded-full bg-[var(--km-text)] text-[15px] font-medium text-white active:opacity-70 transition-opacity"
                >
                  ได้รับสินค้าแล้ว
                </button>
              </div>
            </div>
          );
        }

        if (order.status === "pending_payment" || order.status === "processing") {
          return (
            <>
              <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--km-border)] z-[810]">
                <div className="max-w-7xl mx-auto px-4 md:px-6" style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))", paddingTop: "12px" }}>
                  <button
                    onClick={() => setConfirmCancel(true)}
                    className="w-full py-3.5 rounded-full border border-[var(--km-border-strong)] text-[15px] font-medium text-[var(--km-text-secondary)] bg-white active:opacity-70 transition-opacity"
                  >
                    ยกเลิกคำสั่งซื้อ
                  </button>
                </div>
              </div>
              <ConfirmDialog
                open={confirmCancel}
                title="ยืนยันยกเลิกคำสั่งซื้อ?"
                description="คำสั่งซื้อนี้จะถูกยกเลิกและไม่สามารถกู้คืนได้"
                confirmLabel="ยกเลิกคำสั่งซื้อ"
                cancelLabel="ย้อนกลับ"
                onConfirm={() => { updateStatus(order.id, "cancelled"); setConfirmCancel(false); router.back(); }}
                onCancel={() => setConfirmCancel(false)}
              />
            </>
          );
        }

        if (order.status === "delivered") {
          return (
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--km-border)] z-[810]">
              <div className="max-w-7xl mx-auto px-4 md:px-6" style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))", paddingTop: "12px" }}>
                <div className="flex gap-2">
                  {hasUnreviewed && (
                    <button
                      onClick={() => router.push("/account/reviews")}
                      className="flex-1 py-3.5 rounded-full border border-[var(--km-border)] text-[15px] font-medium text-[var(--km-text)] active:opacity-70 transition-opacity"
                    >
                      ให้คะแนน
                    </button>
                  )}
                  <button
                    className={`py-3.5 rounded-full bg-[var(--km-text)] text-[15px] font-medium text-white active:opacity-70 transition-opacity ${hasUnreviewed ? "flex-1" : "w-full"}`}
                  >
                    ซื้ออีกครั้ง
                  </button>
                </div>
              </div>
            </div>
          );
        }

        return null;
      })()}

      <ConfirmDialog
        open={confirmReceive}
        title="ยืนยันว่าได้รับสินค้าแล้ว?"
        description="เมื่อยืนยันแล้วจะไม่สามารถเปลี่ยนสถานะกลับได้"
        confirmLabel="ยืนยัน ได้รับสินค้าแล้ว"
        cancelLabel="ย้อนกลับ"
        onConfirm={() => { updateStatus(order.id, "delivered"); setConfirmReceive(false); }}
        onCancel={() => setConfirmReceive(false)}
      />

      {/* Address picker bottom sheet */}
      {/* Return expired modal */}
      {showReturnExpired && (
        <div className="fixed inset-0 z-[900] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowReturnExpired(false)} />
          <div className="relative w-full max-w-xs bg-white rounded-2xl overflow-hidden">
            <div className="px-6 pt-6 pb-5 text-center">
              <p className="text-base font-medium text-[var(--km-text)]">หมดระยะเวลาคืนสินค้า</p>
              <p className="text-[15px] text-[var(--km-text-muted)] mt-1.5">สามารถขอคืนสินค้าได้ภายใน 7 วัน หลังได้รับสินค้าเท่านั้น</p>
            </div>
            <div className="border-t border-[var(--km-border)]">
              <button
                onClick={() => setShowReturnExpired(false)}
                className="w-full py-3.5 text-[15px] font-medium text-[var(--km-text)] active:bg-[var(--km-surface)] transition-colors"
              >
                รับทราบ
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddrSheet && (
        <div className="fixed inset-0 z-[500] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAddrSheet(false)} />
          <div className="relative bg-white rounded-t-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="px-5 pt-5 pb-3 flex items-center justify-between border-b border-[var(--km-border)]">
              <p className="text-base font-medium text-[var(--km-text)]">เลือกที่อยู่จัดส่ง</p>
              <button onClick={() => setShowAddrSheet(false)}>
                <X size={20} className="text-[var(--km-text-muted)]" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-4 py-3 flex flex-col gap-2">
              {addresses.map((addr) => {
                const isSelected = selectedAddrId ? selectedAddrId === addr.id : (
                  `${addr.firstName} ${addr.lastName}` === order.recipientName
                );
                return (
                  <button
                    key={addr.id}
                    onClick={() => setSelectedAddrId(addr.id)}
                    className={`w-full text-left px-4 py-3.5 rounded-xl border transition-colors ${
                      isSelected ? "border-[var(--km-text)] bg-[var(--km-surface)]" : "border-[var(--km-border)] bg-white"
                    }`}
                  >
                    <p className="text-[15px] font-medium text-[var(--km-text)]">{addr.firstName} {addr.lastName}
                      <span className="text-[14px] font-normal text-[var(--km-text-muted)]"> (+66) {addr.phone.replace(/^0/, "")}</span>
                    </p>
                    <p className="text-[13px] text-[var(--km-text-secondary)] mt-0.5 truncate">{addr.address} {addr.district} {addr.province} {addr.postalCode}</p>
                    {addr.label && <p className="text-xs text-[var(--km-text-muted)] mt-0.5">{addr.label}</p>}
                  </button>
                );
              })}
              <button
                onClick={() => { setShowAddrSheet(false); router.push("/account/addresses"); }}
                className="w-full py-3.5 rounded-full border border-dashed border-[var(--km-border)] text-[15px] text-[var(--km-text-secondary)] flex items-center justify-center gap-2"
              >
                <span className="text-lg leading-none">+</span> เพิ่มที่อยู่ใหม่
              </button>
            </div>

            <div className="px-4 py-4 border-t border-[var(--km-border)]" style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}>
              <button
                onClick={() => {
                  const addr = addresses.find((a) => selectedAddrId ? a.id === selectedAddrId : `${a.firstName} ${a.lastName}` === order.recipientName) ?? addresses[0];
                  if (!addr) return;
                  updateAddress(order.id, {
                    recipientName: `${addr.firstName} ${addr.lastName}`,
                    phone: addr.phone,
                    address: `${addr.address} ${addr.district} ${addr.province} ${addr.postalCode}`,
                  });
                  setShowAddrSheet(false);
                }}
                className="w-full py-3.5 rounded-full bg-[var(--km-text)] text-white text-[15px] font-medium"
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
