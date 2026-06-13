"use client";

import { useState, useEffect } from "react";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { useRouter, useSearchParams } from "next/navigation";
import { Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Star, ChevronRight } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PillTabs } from "@/components/ui/PillTabs";
import { useUIStore } from "@/stores/ui.store";
import { useOrdersStore } from "@/stores/orders.store";
import { useProfile } from "@/stores/user.store";
import { ToastStack, type ToastData } from "@/components/ui/Toast";

type AddToastFn = (data: Omit<ToastData, "id">) => void;

/* ─── Static stars (display only) ─── */
function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          strokeWidth={1.25}
          fill={rating >= n ? "var(--km-magenta)" : "none"}
          style={{ color: rating >= n ? "var(--km-magenta)" : "var(--km-border-strong)" }}
        />
      ))}
    </div>
  );
}

/* ─── Tappable quick-rate stars ─── */
function QuickStars({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          className="p-0.5 active:scale-110 transition-transform"
        >
          <Star
            size={22}
            strokeWidth={1.25}
            fill={(hover || value) >= n ? "var(--km-magenta)" : "none"}
            style={{ color: (hover || value) >= n ? "var(--km-magenta)" : "var(--km-border-strong)" }}
          />
        </button>
      ))}
    </div>
  );
}

/* ─── Pending tab ─── */
function PendingTab({ addToast }: { addToast: AddToastFn }) {
  const router    = useRouter();
  const orders    = useOrdersStore((s) => s.orders);
  const reviews   = useOrdersStore((s) => s.reviews);
  const addReview = useOrdersStore((s) => s.addReview);

  const [localRating, setLocalRating] = useState<Record<string, number>>({});
  const [confirmChange, setConfirmChange] = useState<{ key: string; orderId: string; productId: string; rating: number } | null>(null);

  type Entry = {
    brand:        string;
    orderId:      string;
    item:         (typeof orders)[0]["items"][0];
    hasComment:   boolean;
    reviewRating?: number;
  };

  const all: Entry[] = [];
  for (const order of orders) {
    if (order.status !== "delivered") continue;
    for (const item of order.items) {
      if (item.isFree) continue;
      const rev = reviews.find((r) => r.orderId === order.id && r.productId === item.productId);
      all.push({ brand: item.brand, orderId: order.id, item, hasComment: !!(rev?.comment), reviewRating: rev?.rating });
    }
  }

  const grouped = new Map<string, Entry[]>();
  for (const entry of all) {
    if (entry.hasComment) continue;
    if (!grouped.has(entry.brand)) grouped.set(entry.brand, []);
    grouped.get(entry.brand)!.push(entry);
  }

  if (grouped.size === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-center px-8">
        <Star size={40} strokeWidth={1} className="text-[var(--km-border-strong)]" />
        <p className="text-sm font-medium text-[var(--km-text)]">ไม่มีสินค้าที่รอรีวิว</p>
        <p className="text-xs text-[var(--km-text-muted)]">เมื่อคำสั่งซื้อถูกส่งสำเร็จ สินค้าจะปรากฏที่นี่</p>
      </div>
    );
  }

  const applyRate = (key: string, orderId: string, productId: string, rating: number) => {
    setLocalRating((prev) => ({ ...prev, [key]: rating }));
    addReview({ orderId, productId, rating, comment: "" });
    addToast({ message: "ให้คะแนนสำเร็จ" });
  };

  const handleQuickRate = (key: string, orderId: string, productId: string, current: number, next: number) => {
    if (current > 0 && next !== current) {
      setConfirmChange({ key, orderId, productId, rating: next });
    } else {
      applyRate(key, orderId, productId, next);
    }
  };

  return (
    <>
      <div className="pb-8">
        {Array.from(grouped.entries()).map(([brand, entries]) => (
          <div key={brand} className="mt-3 bg-white border border-[var(--km-border)] rounded-xl overflow-hidden">
            {/* Brand header */}
            <Link
              href={`/brands/${brand.toLowerCase().replace(/\s+/g, "-")}`}
              className="flex items-center gap-2 px-4 py-3 border-b border-[var(--km-border)] active:bg-[var(--km-surface)] transition-colors"
            >
              <p className="text-[13px] font-medium text-[var(--km-text)]">{brand}</p>
              <ChevronRight size={14} className="text-[var(--km-text-muted)]" />
            </Link>

            {/* Items */}
            {entries.map(({ orderId, item, hasComment, reviewRating }) => {
              const key = `${orderId}-${item.productId}`;
              const savedRating = reviewRating ?? localRating[key] ?? 0;

              return (
                <div key={key} className="border-b border-[var(--km-border)] last:border-b-0 px-4 py-3 flex gap-3">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-[var(--km-surface)] flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col gap-2">
                    <p className="text-[13px] text-[var(--km-text-secondary)] line-clamp-2 leading-snug">{item.name}</p>

                    {hasComment ? (
                      /* Full review written */
                      <div className="flex items-center gap-2">
                        <Stars rating={savedRating} size={14} />
                        <span className="text-xs text-[var(--km-text-muted)]">ให้คะแนนแล้ว</span>
                      </div>
                    ) : (
                      /* Quick-rate (editable) + review button */
                      <div className="flex items-center justify-between gap-2">
                        <QuickStars
                          value={savedRating}
                          onChange={(r) => handleQuickRate(key, orderId, item.productId, savedRating, r)}
                        />
                        <button
                          onClick={() => router.push(`/account/orders/${orderId}/review/${item.productId}`)}
                          className="px-3 py-1.5 rounded-full text-white text-xs font-medium flex-shrink-0"
                          style={{ background: "var(--km-text)" }}
                        >
                          รีวิว
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={!!confirmChange}
        title="แก้ไขคะแนน?"
        description="ต้องการแก้ไขคะแนนที่ให้ไว้ใช่ไหม?"
        confirmLabel="แก้ไข"
        cancelLabel="ยกเลิก"
        onConfirm={() => {
          if (confirmChange) applyRate(confirmChange.key, confirmChange.orderId, confirmChange.productId, confirmChange.rating);
          setConfirmChange(null);
        }}
        onCancel={() => setConfirmChange(null)}
      />
    </>
  );
}

/* ─── My Reviews tab ─── */
function MyReviewsTab() {
  const router  = useRouter();
  const orders  = useOrdersStore((s) => s.orders);
  const reviews = useOrdersStore((s) => s.reviews);
  const profile = useProfile();

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-center px-8">
        <Star size={40} strokeWidth={1} className="text-[var(--km-border-strong)]" />
        <p className="text-sm font-medium text-[var(--km-text)]">ยังไม่มีรีวิว</p>
        <p className="text-xs text-[var(--km-text-muted)]">กดดาวที่สินค้าเพื่อให้คะแนนได้เลย</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 py-4 pb-8">
      {reviews.map((review) => {
        const order = orders.find((o) => o.id === review.orderId);
        const item  = order?.items.find((i) => i.productId === review.productId);

        return (
          <div key={review.id} className="bg-white border border-[var(--km-border)] rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-[var(--km-surface)] border border-[var(--km-border)] flex-shrink-0">
                  {profile.avatar ? (
                    <Image src={profile.avatar} alt={profile.name} width={40} height={40} className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--km-text-muted)] text-sm font-bold bg-[var(--km-surface)]">
                      {review.anonymous ? "?" : (profile.name ? profile.name[0].toUpperCase() : "U")}
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-[var(--km-text)]">
                      {review.anonymous ? "ผู้ใช้ที่ไม่ระบุตัวตน" : (profile.name || "ฉัน")}
                    </p>
                    <button
                      onClick={() => router.push(`/account/orders/${review.orderId}/review/${review.productId}?from=mine`)}
                      className="p-1 text-[var(--km-text-muted)] hover:text-[var(--km-text)] transition-colors"
                    >
                      <Pencil size={12} strokeWidth={1.5} />
                    </button>
                  </div>
                  <p className="text-xs text-[var(--km-text-muted)]">
                    {new Date(review.createdAt).toLocaleDateString("th-TH", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).replace(/\//g, "-")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <Star size={12} strokeWidth={1.5} style={{ fill: "var(--km-magenta)", color: "var(--km-magenta)" }} />
                <span className="text-xs font-medium text-[var(--km-text)]">{review.rating.toFixed(1)}</span>
              </div>
            </div>

            <p className="text-sm text-[var(--km-text-secondary)] leading-relaxed">{review.comment}</p>

            {review.images && review.images.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {review.images.map((img, i) => (
                  <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-[var(--km-border)] flex-shrink-0">
                    <Image src={img} alt="review" fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}

            {item && (
              <Link
                href={`/products/${item.productId}`}
                className="flex items-center gap-3 p-2.5 bg-[var(--km-surface)] rounded-lg active:bg-[var(--km-border)] transition-colors"
              >
                <div className="relative w-16 h-16 rounded-md overflow-hidden bg-white border border-[var(--km-border)] flex-shrink-0">
                  <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[var(--km-text)]">{item.brand}</p>
                  <p className="text-xs text-[var(--km-text-secondary)] line-clamp-2 mt-0.5">{item.name}</p>
                  {item.variant && (
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-white border border-[#e8e8ed] text-xs text-[var(--km-text-muted)]">
                      {item.variant}
                    </span>
                  )}
                </div>
                <ChevronRight size={14} className="text-[var(--km-text-muted)] flex-shrink-0" />
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}

import { Suspense } from "react";

/* ... (previous components) ... */

function ReviewsContent() {
  const isLoggedIn = useRequireAuth();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<"pending" | "mine">(
    searchParams.get("tab") === "mine" ? "mine" : "pending"
  );
  const setHeaderLocked = useUIStore((s) => s.setHeaderLocked);
  
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const addToast = (data: Omit<ToastData, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...data, id }]);
  };
  const dismissToast = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  useEffect(() => {
    setHeaderLocked(true);
    return () => setHeaderLocked(false);
  }, [setHeaderLocked]);

  if (!isLoggedIn) return null;

  const TABS = [
    { key: "pending", label: "ยังไม่ได้ให้คะแนน" },
    { key: "mine",    label: "รีวิวแล้ว" },
  ];

  return (
    <div className="flex flex-col gap-0">
      <div className="py-3">
        <PillTabs tabs={TABS} active={tab} onChange={(k) => setTab(k as typeof tab)} />
      </div>

      {tab === "pending" ? <PendingTab addToast={addToast} /> : <MyReviewsTab />}

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <Suspense fallback={null}>
      <ReviewsContent />
    </Suspense>
  );
}
