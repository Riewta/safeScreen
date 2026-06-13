"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { FLASH_DEAL_PRODUCTS, type FlashDealProduct as DealProduct } from "@/lib/mock-data";

const DEAL_PRODUCTS = FLASH_DEAL_PRODUCTS;

// Mock Flash Sale session start/end times:
// If you want to test "upcoming" state, set DEAL_START in the future.
// By default, it starts 2 hours ago (active state) so it displays "จบใน".
const DEAL_START = new Date(Date.now() - 2 * 60 * 60 * 1000); 
const DEAL_END   = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); 

function useFlashSaleCountdown(startsAt: Date, endsAt: Date) {
  const [state, setState] = useState({
    status: "active", // "upcoming" | "active" | "ended"
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calc = () => {
      const now = Date.now();
      let diff = 0;
      let status: "upcoming" | "active" | "ended" = "ended";

      if (now < startsAt.getTime()) {
        status = "upcoming";
        diff = startsAt.getTime() - now;
      } else if (now < endsAt.getTime()) {
        status = "active";
        diff = endsAt.getTime() - now;
      } else {
        status = "ended";
        diff = 0;
      }

      return {
        status,
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      };
    };

    setState(calc()); // First calc on client
    const t = setInterval(() => setState(calc()), 1000);
    return () => clearInterval(t);
  }, [startsAt, endsAt]);

  return state;
}

export function RollingDigit({ value }: { value: string }) {
  return (
    <div className="relative h-7 w-[1ch] overflow-hidden flex flex-col items-center">
      <div 
        className="transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex flex-col"
        style={{ transform: `translateY(-${parseInt(value) * 10}%)` }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <div key={n} className="h-7 flex items-center justify-center">
            {n}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CountChip({ label }: { label: string }) {
  const digits = label.split("");
  return (
    <div className="bg-white border border-[#e8e8ed] text-[var(--km-text)] text-[13px] font-medium h-6 px-1 flex items-center justify-center rounded-[4px] tracking-tight overflow-hidden tabular-nums">
      {digits.map((d, i) => (
        <RollingDigit key={i} value={d} />
      ))}
    </div>
  );
}

export function Colon() {
  return <span className="text-[var(--km-text)] font-medium text-[12px] opacity-30">:</span>;
}

export function FlashDeal() {
  const { status, days, hours, minutes, seconds } = useFlashSaleCountdown(DEAL_START, DEAL_END);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      const scrollTo = direction === "left" 
        ? scrollRef.current.scrollLeft - scrollAmount 
        : scrollRef.current.scrollLeft + scrollAmount;
      
      scrollRef.current.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="pt-4 pb-4 bg-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap size={16} style={{ color: "#FFAC00", fill: "#FFAC00" }} />
            <span className="text-[var(--km-text)] font-medium text-[18px] tracking-tight">Flash Sale</span>
          </div>

          {/* Countdown & Navigation */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              <span className="text-[13px] font-normal text-[var(--km-text-secondary)]">
                {status === "upcoming" ? "เริ่มใน" : status === "ended" ? "สิ้นสุดแล้ว" : "จบใน"}
              </span>
              <CountChip label={String(days).padStart(2, "0")} />
              <Colon />
              <CountChip label={String(hours).padStart(2, "0")} />
              <Colon />
              <CountChip label={String(minutes).padStart(2, "0")} />
              <Colon />
              <CountChip label={String(seconds).padStart(2, "0")} />
            </div>
          </div>
        </div>

      </div>

      {/* Product horizontal scroll — full viewport width, no clip */}
      <div className="relative group/flash">
        <div className="absolute inset-y-0 left-0 w-full pointer-events-none z-20">
          <div className="relative h-full max-w-7xl mx-auto">
          <button
            onClick={() => scroll("left")}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-auto w-12 h-12 bg-white rounded-full shadow-xl border border-[var(--km-border)] items-center justify-center text-[var(--km-text)] hover:bg-[var(--km-text)] hover:text-white transition-all opacity-0 group-hover/flash:opacity-100 group-hover/flash:translate-x-0"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 pointer-events-auto w-12 h-12 bg-white rounded-full shadow-xl border border-[var(--km-border)] items-center justify-center text-[var(--km-text)] hover:bg-[var(--km-text)] hover:text-white transition-all opacity-0 group-hover/flash:opacity-100 group-hover/flash:translate-x-0"
          >
            <ChevronRight size={24} />
          </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="overflow-x-auto scrollbar-none scroll-smooth"
        >
          <div className="flex gap-4 md:gap-5 w-max pb-4 px-4 md:px-[max(24px,calc((100vw-1280px)/2+24px))]">
            {DEAL_PRODUCTS.map((p) => (
              <div key={p.id} className="w-[160px] md:w-[220px] flex-shrink-0">
                <DealCard product={p} />
              </div>
            ))}
            <div className="w-[160px] md:w-[220px] flex-shrink-0 py-[1px]">
              <Link
                href="/campaign/flash-sale"
                className="group flex flex-col items-center justify-center gap-3 p-3 bg-white rounded-[24px] transition-all h-full"
              >
                <div className="flex items-center justify-center text-[var(--km-text)] transition-all group-hover:scale-110">
                  <ChevronRight size={40} strokeWidth={1} />
                </div>
                <span className="text-[14px] font-normal text-[var(--km-text)] text-center">ดู Flash Sale<br/>ทั้งหมด</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function DealCard({ product: p }: { product: DealProduct }) {
  const discount = Math.round((1 - p.price / p.originalPrice) * 100);
  return (
    <Link
      href={`/products/${p.id}`}
      className="relative group flex flex-col gap-3 p-3 bg-white rounded-[24px] border border-[var(--km-border)] hover:border-[var(--km-border-strong)] transition-all w-full"
    >
      {/* Badge - Absolute to the whole card to avoid clipping */}
      <div className="absolute top-3 left-3 z-20">
        {p.badge === "hot" && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-normal bg-white border border-[#171717] text-[#171717]">
            ยอดฮิต
          </span>
        )}
      </div>

      {/* Image Container */}
      <div className="relative aspect-square bg-white rounded-[16px] overflow-hidden flex items-center justify-center" style={{ WebkitMaskImage: "-webkit-radial-gradient(white, black)" }}>
        <Image
          src={p.image}
          alt={p.name}
          fill
          sizes="(max-width: 768px) 180px, 220px"
          className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 px-0.5 mt-1">
        {/* Brand */}
        <p className="text-[13px] font-semibold uppercase text-[var(--km-text)] truncate tracking-wider">
          {p.brand}
        </p>

        {/* Name */}
        <p className="text-[13px] md:text-[14px] font-normal text-[var(--km-text-secondary)] leading-snug line-clamp-2 min-h-[2.5rem]">
          {p.name}
        </p>

        {/* Price */}
        <div className="flex flex-col gap-0.5 mt-0.5">
          <div className="flex items-center gap-1.5 text-[12px] text-[var(--km-text-muted)] min-h-[18px]">
            <span className="line-through">฿{p.originalPrice.toLocaleString()}</span>
            {discount && discount > 0 && <span>-{discount}%</span>}
          </div>
          <span className="text-[16px] font-medium text-[var(--km-text)]">
            ฿{p.price.toLocaleString()}
          </span>
        </div>



        {/* Progress bar */}
        <div className="mt-1.5">
          {(() => {
            const remaining = p.total - p.sold;
            const remainPct = Math.round((remaining / p.total) * 100);

            return (
              <>
                <div className="h-1.5 rounded-full bg-[var(--km-border)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${remainPct}%`, 
                      background: remaining === 0 ? "#E8E8ED" : "#171717" 
                    }}
                  />
                </div>
                <p className="text-[13px] font-normal text-[var(--km-text-secondary)] mt-1.5">
                  {remaining === 0 ? "ขายหมดแล้ว" : `เหลืออีก ${remaining}`}
                </p>
              </>
            );
          })()}
        </div>
      </div>
    </Link>
  );
}
