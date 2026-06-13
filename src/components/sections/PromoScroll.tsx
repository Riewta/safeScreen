"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FEATURED_PROMO } from "@/lib/mock-data";
import { ProductCard } from "@/components/product/ProductCard";
import { useLang } from "@/contexts/lang";

export function PromoScroll() {
  const { pages: t } = useLang();
  const promo = FEATURED_PROMO;
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
    <section className="pt-4 pb-4 md:pt-4 md:pb-6 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col gap-4 md:gap-8">
        
        {/* ── Section Header ── */}
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-medium text-[var(--km-text)]">{t.promoTitle}</h2>
        </div>

        {/* ── Banner & Info Area ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
          {/* Banner Image */}
          <Link href={promo.href} className="relative block rounded-2xl overflow-hidden aspect-[4/3] group bg-[var(--km-surface)]">
            {promo.video ? (
              <video 
                src={promo.video}
                autoPlay 
                loop 
                muted 
                playsInline 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
            ) : (
              <Image 
                src={promo.image} 
                alt={promo.title} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-1000"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
          </Link>

          {/* Info & CTA (Desktop moves button here) */}
          <div className="flex flex-col gap-4 md:gap-8">
            <div className="flex flex-col gap-2 md:gap-4">
              <h3 className="text-lg md:text-3xl font-medium text-[var(--km-text)] leading-tight">
                {promo.title}
              </h3>
              <p className="text-[13px] md:text-base text-[var(--km-text-secondary)] leading-relaxed">
                {promo.description}
              </p>
            </div>
            
            <div className="hidden md:block">
              <Link
                href={promo.href}
                className="inline-flex items-center justify-center px-10 py-4 border border-[var(--km-text)] text-[var(--km-text)] rounded-full text-sm font-medium hover:bg-[var(--km-text)] hover:text-white transition-all duration-300"
              >
                {t.promoViewMore}
              </Link>
            </div>
          </div>
        </div>

        {/* ── Products — horizontal scroll ── */}
        <div className="relative group/scroll">
          {/* Navigation Arrows (Sides) */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-7xl px-4 md:px-6 pointer-events-none z-20">
            <button 
              onClick={() => scroll("left")}
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-auto w-12 h-12 bg-white rounded-full shadow-xl border border-[var(--km-border)] items-center justify-center text-[var(--km-text)] hover:bg-[var(--km-text)] hover:text-white transition-all opacity-0 group-hover/scroll:opacity-100 group-hover/scroll:translate-x-0"
              aria-label="Previous products"
            >
              <ChevronLeft size={24} />
            </button>
            
            <button 
              onClick={() => scroll("right")}
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 translate-x-1/2 pointer-events-auto w-12 h-12 bg-white rounded-full shadow-xl border border-[var(--km-border)] items-center justify-center text-[var(--km-text)] hover:bg-[var(--km-text)] hover:text-white transition-all opacity-0 group-hover/scroll:opacity-100 group-hover/scroll:translate-x-0"
              aria-label="Next products"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div 
            ref={scrollRef}
            className="overflow-x-auto scrollbar-none scroll-smooth -mx-4 md:-mx-6"
          >
            <div className="flex gap-4 md:gap-5 w-max pb-4 px-4 md:px-6">
              {promo.products.map((p) => (
                <div key={p.id} className="w-[160px] md:w-[220px] flex-shrink-0">
                  <ProductCard
                    id={p.id}
                    name={p.name}
                    brand={p.brand}
                    image={p.image}
                    price={p.price}
                    originalPrice={p.originalPrice}
                    badge={p.badge}
                    href={`/products/${p.id}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Mobile CTA button (Bottom) ── */}
        <div className="md:hidden flex justify-center mt-0">
          <Link
            href={promo.href}
            className="w-full text-center py-3.5 border border-[var(--km-border)] rounded-full text-sm font-medium text-[var(--km-text-secondary)]"
          >
            {t.promoViewMore}
          </Link>
        </div>

      </div>
    </section>
  );
}
