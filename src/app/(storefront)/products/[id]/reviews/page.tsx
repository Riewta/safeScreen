"use client";

import { use, useMemo, useState } from "react";
import Image from "next/image";
import { Star, ChevronLeft } from "lucide-react";
import { PRODUCTS, MOCK_REVIEWS } from "@/lib/mock-data";
import { notFound, useRouter } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default function ProductReviewsPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const product = PRODUCTS.find((p) => p.id === id);
  const [selectedRating, setSelectedRating] = useState<number | "all">("all");

  if (!product) notFound();

  // Use the full mock reviews list
  const allReviews = useMemo(() => {
    return MOCK_REVIEWS;
  }, []);

  // Filter reviews based on selection
  const filteredReviews = useMemo(() => {
    if (selectedRating === "all") return allReviews;
    return allReviews.filter(r => r.rating === selectedRating);
  }, [allReviews, selectedRating]);

  // Simulate a large number of reviews for the summary
  const SIMULATED_MULTIPLIER = 125;
  const totalCount = allReviews.length * SIMULATED_MULTIPLIER;
  const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

  const formatCount = (n: number) => {
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    return n.toString();
  };

  return (
    <div className="max-w-7xl mx-auto py-8 pb-24 min-h-screen px-4 md:px-6 -mx-4 md:mx-auto -mt-6 md:mt-0">
      {/* Desktop page header */}
      <div className="hidden md:flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--km-surface)] transition-colors text-[var(--km-text)]"
        >
          <ChevronLeft size={22} />
        </button>
        <h1 className="text-base font-medium text-[var(--km-text)]">รีวิวสินค้า</h1>
      </div>

      {/* Rating Breakdown - matches PDP design */}
      <div className="flex items-center gap-5 mb-8 mt-3">
        {/* Left: Large Rating Score */}
        <div className="text-5xl font-medium tracking-tight text-[var(--km-text)]">
          {avgRating.toFixed(1)}
        </div>
        {/* Divider line */}
        <div className="w-[1px] h-10 bg-[var(--km-border)]" />
        {/* Right: Stars and Review Count Stack */}
        <div className="flex flex-col justify-center gap-1">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={24}
                strokeWidth={0}
                style={{
                  fill: i < Math.floor(avgRating)
                    ? "var(--km-magenta)"
                    : "var(--km-border-strong)"
                }}
              />
            ))}
          </div>
          <p className="text-[13px] font-normal text-[var(--km-text-secondary)]">
            รีวิวทั้งหมด {totalCount.toLocaleString()} รีวิว
          </p>
        </div>
      </div>


      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
        <button
          onClick={() => setSelectedRating("all")}
          className={`px-5 py-2 rounded-full text-[13px] font-medium transition-all whitespace-nowrap border ${
            selectedRating === "all"
              ? "bg-[var(--km-surface)] border-[var(--km-text)] text-[var(--km-text)]"
              : "bg-white border-[var(--km-border)] text-[var(--km-text-secondary)] hover:border-[var(--km-border-strong)]"
          }`}
        >
          ทั้งหมด ({formatCount(totalCount)})
        </button>
        {[5, 4, 3, 2, 1].map((s) => {
          const count = allReviews.filter(r => r.rating === s).length * SIMULATED_MULTIPLIER;
          const isActive = selectedRating === s;
          return (
            <button
              key={s}
              onClick={() => setSelectedRating(s)}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-[13px] font-medium transition-all whitespace-nowrap border ${
                isActive
                  ? "bg-[var(--km-surface)] border-[var(--km-text)] text-[var(--km-text)]"
                  : "bg-white border-[var(--km-border)] text-[var(--km-text-secondary)] hover:border-[var(--km-border-strong)]"
              }`}
            >
              <div className="flex items-center gap-1">
                <span>{s}</span>
                <Star 
                  size={12} 
                  strokeWidth={0} 
                  fill="var(--km-magenta)" 
                />
              </div>
              <span className={`text-[11px] font-normal opacity-60`}>({formatCount(count)})</span>
            </button>
          );
        })}
      </div>

      {/* Full Review List */}
      <div className="flex flex-col">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((r) => (
            <div key={r.id} className="py-6 border-b border-[var(--km-border)] last:border-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-[var(--km-surface)] border border-[var(--km-border)] flex-shrink-0">
                    {r.avatar ? (
                      <Image src={r.avatar} alt={r.user} width={40} height={40} className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[var(--km-text-muted)] text-sm font-bold bg-[var(--km-surface)]">
                        {r.user.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-[var(--km-text)]">{r.user}</p>
                    </div>
                    <p className="text-[13px] text-[var(--km-text-muted)]">{r.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Star size={12} strokeWidth={1.5} strokeLinejoin="round" stroke="var(--km-magenta)" style={{ fill: "var(--km-magenta)" }} />
                  <span className="text-[13px] font-medium text-[var(--km-text)]">{r.rating.toFixed(1)}</span>
                </div>
              </div>
              <p className="text-sm text-[var(--km-text-secondary)] leading-relaxed">{r.comment}</p>
              {r.images && r.images.length > 0 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
                  {r.images.map((img, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-[var(--km-border)] flex-shrink-0 cursor-pointer active:scale-95 transition-transform">
                      <Image src={img} alt="review" fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="py-20 text-center">
            <p className="text-sm text-[var(--km-text-muted)]">ยังไม่มีรีวิวระดับ {selectedRating} ดาวสำหรับสินค้านี้</p>
          </div>
        )}
      </div>
    </div>
  );
}
