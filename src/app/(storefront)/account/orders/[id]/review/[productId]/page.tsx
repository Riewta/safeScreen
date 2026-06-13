"use client";

import { useState, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Star, X, ImageIcon, EyeOff } from "lucide-react";
import { useOrdersStore } from "@/stores/orders.store";

const MAX_MEDIA = 6;

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  const labels = ["", "แย่มาก", "พอใช้", "ปานกลาง", "ดี", "ดีมาก"];
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange(n)}
            className="p-1"
          >
            <Star
              size={36}
              strokeWidth={1.25}
              fill={(hover || value) >= n ? "var(--km-magenta)" : "none"}
              style={{ color: (hover || value) >= n ? "var(--km-magenta)" : "var(--km-border-strong)" }}
            />
          </button>
        ))}
      </div>
      <span className="text-sm text-[var(--km-text-muted)] h-5">
        {labels[hover || value]}
      </span>
    </div>
  );
}

type MediaFile = { id: string; url: string; type: "image" };

import { Suspense } from "react";

function ReviewContent() {
  const { id, productId } = useParams<{ id: string; productId: string }>();
  const router       = useRouter();
  const searchParams = useSearchParams();
  const fromMine     = searchParams.get("from") === "mine";
  const getOrder   = useOrdersStore((s) => s.getOrder);
  const addReview  = useOrdersStore((s) => s.addReview);
  const getReview  = useOrdersStore((s) => s.getReview);
  const order      = getOrder(id);
  const item       = order?.items.find((i) => i.productId === productId);
  const existing   = order ? getReview(id, productId) : undefined;

  const [rating, setRating]     = useState(existing?.rating ?? 0);
  const [comment, setComment]   = useState(existing?.comment ?? "");
  const [media, setMedia]       = useState<MediaFile[]>([]);
  const [anonymous, setAnonymous] = useState(existing?.anonymous ?? false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!order || !item) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-sm text-[var(--km-text-muted)]">
        ไม่พบสินค้า
      </div>
    );
  }

  const canAdd = media.length < MAX_MEDIA;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const remaining = MAX_MEDIA - media.length;
    files.slice(0, remaining).forEach((file) => {
      const url = URL.createObjectURL(file);
      setMedia((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, url, type: "image" }]);
    });
    e.target.value = "";
  };

  const removeMedia = (id: string) => {
    setMedia((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSubmit = () => {
    if (rating === 0) return;
    addReview({ 
      orderId: order.id, 
      productId: item.productId, 
      rating, 
      comment: comment.trim(), 
      anonymous,
      images: media.map(m => m.url)
    });
    if (fromMine) {
      router.replace("/account/reviews?tab=mine");
    } else {
      router.back();
    }
  };

  return (
    <div className="pb-32">
      <div className="flex flex-col gap-4">

        {/* Product card */}
        <div className="bg-white rounded-xl border border-[var(--km-border)] px-4 py-4 flex gap-3 items-center">
          <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-[var(--km-surface)] flex-shrink-0">
            <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--km-text)]">{item.brand}</p>
            <p className="text-xs text-[var(--km-text-secondary)] mt-0.5 line-clamp-2">{item.name}</p>
            <p className="text-xs text-[var(--km-text-muted)] mt-0.5">{item.variant}</p>
          </div>
        </div>

        {/* Star rating */}
        <div className="py-2">
          <StarRating value={rating} onChange={setRating} />
        </div>

        {/* Comment */}
        <div>
          <p className="text-[13px] font-medium text-[var(--km-text-secondary)] mb-2">รีวิวสินค้า</p>
          <div className="bg-white rounded-xl border border-[var(--km-border)] overflow-hidden">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="แชร์ประสบการณ์การใช้สินค้านี้ให้คนอื่นรู้..."
              rows={5}
              className="w-full text-sm text-[var(--km-text)] px-4 py-4 resize-none focus:outline-none placeholder:text-[var(--km-text-muted)]"
            />
          </div>
        </div>

        {/* Media upload */}
        <div>
          <p className="text-[13px] font-medium text-[var(--km-text-secondary)] mb-2">
            รูปภาพ ({media.length}/{MAX_MEDIA})
          </p>
          <div className="flex flex-wrap gap-2">
            {media.map((m) => (
              <div key={m.id} className="relative w-20 h-20 rounded-lg overflow-hidden bg-[var(--km-surface)] border border-[var(--km-border)] shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.url} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => removeMedia(m.id)}
                  className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/60 flex items-center justify-center"
                >
                  <X size={9} strokeWidth={2.5} className="text-white" />
                </button>
              </div>
            ))}
            {canAdd && (
              <button
                onClick={() => fileRef.current?.click()}
                className="w-20 h-20 rounded-lg border border-dashed border-[var(--km-border-strong)] bg-white flex flex-col items-center justify-center gap-0.5 active:bg-[var(--km-surface)] transition-colors shrink-0"
              >
                <ImageIcon size={16} strokeWidth={1.5} className="text-[var(--km-text-muted)]" />
                <span className="text-[10px] text-[var(--km-text-muted)]">เพิ่มรูป</span>
              </button>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
        </div>

        {/* Anonymous toggle */}
        <button
          onClick={() => setAnonymous((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3.5 bg-white rounded-xl border border-[var(--km-border)] active:bg-[var(--km-surface)] transition-colors"
        >
          <div className="flex items-center gap-3">
            <EyeOff size={16} strokeWidth={1.5} className="text-[var(--km-text-muted)]" />
            <div className="text-left">
              <p className="text-[13px] text-[var(--km-text)]">ไม่ระบุตัวตน</p>
              <p className="text-xs text-[var(--km-text-muted)] mt-0.5">แสดงชื่อเป็น "ผู้ใช้ที่ไม่ระบุตัวตน"</p>
            </div>
          </div>
          <div className="w-10 h-6 rounded-full transition-colors flex-shrink-0 relative" style={{ background: anonymous ? "var(--km-text)" : "var(--km-border)" }}>
            <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all" style={{ left: anonymous ? "calc(100% - 22px)" : "2px" }} />
          </div>
        </button>

        <button
          onClick={handleSubmit}
          disabled={rating === 0}
          className="w-full h-12 rounded-xl text-sm flex items-center justify-center transition-all"
          style={{
            background: rating > 0 ? "var(--km-text)" : "var(--km-border)",
            color: rating > 0 ? "white" : "var(--km-text-muted)",
          }}
        >
          ส่งรีวิว
        </button>

      </div>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={null}>
      <ReviewContent />
    </Suspense>
  );
}
