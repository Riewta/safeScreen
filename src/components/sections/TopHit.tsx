"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { ProductCard } from "@/components/product/ProductCard";
import { PRODUCTS } from "@/lib/mock-data";
import type { ProductCardProps } from "@/components/product/ProductCard";
import { useLang } from "@/contexts/lang";

/* ── Device sort order ──────────────────────────────────────── */
const CATEGORY_ORDER: Record<string, number> = {
  macbook: 0,
  universal: 1,
  ipad: 2,
  monitor: 3,
};

function sortByDevice(products: ProductCardProps[]) {
  return [...products].sort(
    (a, b) =>
      (CATEGORY_ORDER[a.category ?? ""] ?? 9) -
      (CATEGORY_ORDER[b.category ?? ""] ?? 9)
  );
}

/* ── Device tabs ────────────────────────────────────────────── */
const DEVICE_TABS = [
  { key: "all",      labelTH: "ทั้งหมด",   labelEN: "All"      },
  { key: "macbook",  labelTH: "MacBook",    labelEN: "MacBook"  },
  { key: "universal",labelTH: "Universal",  labelEN: "Universal"},
  { key: "ipad",     labelTH: "iPad",       labelEN: "iPad"     },
  { key: "monitor",  labelTH: "Monitor",    labelEN: "Monitor"  },
] as const;

type DeviceKey = typeof DEVICE_TABS[number]["key"];

/* ── Film type section definitions ─────────────────────────── */
const SECTION_DEFS = [
  {
    key: "privacy",
    href: "/products?filmType=privacy",
    match: (p: ProductCardProps) => /privacy/i.test(p.name),
  },
  {
    key: "antiblue",
    href: "/products?filmType=antiblue",
    match: (p: ProductCardProps) => /anti.?blue/i.test(p.name),
  },
  {
    key: "paperlike",
    href: "/products?filmType=paperlike",
    match: (p: ProductCardProps) => /paper like/i.test(p.name),
  },
] as const;

/* ── Scrollable row with arrow buttons ─────────────────────── */
function ProductRow({ products }: { products: ProductCardProps[] }) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const el = rowRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 340 : -340, behavior: "smooth" });
  };

  if (products.length === 0) return null;

  return (
    <div className="relative group">
      <button
        onClick={() => scroll("left")}
        aria-label="เลื่อนซ้าย"
        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10
          w-9 h-9 rounded-full bg-white border border-[var(--km-border)] shadow-sm
          items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ArrowLeft size={16} weight="bold" className="text-[var(--km-text)]" />
      </button>

      <div
        ref={rowRef}
        className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0"
      >
        {products.map((p) => (
          <div key={p.id} className="shrink-0 w-[160px] md:w-[calc(25%-9px)]">
            <ProductCard {...p} rank={undefined} badge={p.badge} />
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll("right")}
        aria-label="เลื่อนขวา"
        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10
          w-9 h-9 rounded-full bg-white border border-[var(--km-border)] shadow-sm
          items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ArrowRight size={16} weight="bold" className="text-[var(--km-text)]" />
      </button>
    </div>
  );
}

/* ── Label highlight helper ─────────────────────────────────── */
function SectionTitle({ label }: { label: string }) {
  if (label.startsWith("ฟิล์ม")) {
    return (
      <h2 className="text-[18px] font-medium text-[var(--km-text)]">
        <span style={{ color: "#F5A600" }}>ฟิล์ม</span>{label.slice(5)}
      </h2>
    );
  }
  const [first, ...rest] = label.split(" ");
  return (
    <h2 className="text-[18px] font-medium text-[var(--km-text)]">
      <span style={{ color: "#F5A600" }}>{first}</span>
      {rest.length ? " " + rest.join(" ") : ""}
    </h2>
  );
}

/* ── Main component ─────────────────────────────────────────── */
export function TopHit() {
  const { home, _lang } = useLang();
  const [activeDevice, setActiveDevice] = useState<DeviceKey>("all");

  const allProducts = PRODUCTS.filter((p) => p.price > 0);

  const LABELS: Record<string, string> = {
    privacy:   home.filmPrivacy,
    antiblue:  home.filmAntiBlue,
    paperlike: home.filmPaperLike,
  };

  // filter by device tab, then sort within each film section
  const filtered = (products: ProductCardProps[]) => {
    const byDevice = activeDevice === "all"
      ? products
      : products.filter((p) => p.category === activeDevice);
    return sortByDevice(byDevice).slice(0, 5);
  };

  const sections = SECTION_DEFS.map((s) => ({
    ...s,
    label: LABELS[s.key],
    products: filtered(allProducts.filter(s.match)),
  })).filter((s) => s.products.length > 0);

  return (
    <section className="pt-5 pb-2 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Device filter tabs — top of the whole section */}
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          {DEVICE_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveDevice(tab.key)}
              className="shrink-0 px-4 py-1.5 rounded-full text-[13px] font-normal whitespace-nowrap transition-all duration-200"
              style={
                activeDevice === tab.key
                  ? { background: "var(--km-text)", color: "#fff", border: "1px solid var(--km-text)" }
                  : { background: "#fff", color: "#78787D", border: "1px solid #e8e8ed" }
              }
            >
              {_lang === "EN" ? tab.labelEN : tab.labelTH}
            </button>
          ))}
        </div>

        {/* Film type sections */}
        <div className="flex flex-col gap-8">
          {sections.map((s) => (
            <div key={s.key}>
              <div className="flex items-baseline justify-between mb-4">
                <SectionTitle label={s.label} />
                <Link
                  href={activeDevice === "all" ? s.href : `${s.href}&category=${activeDevice}`}
                  className="text-[13px] text-[var(--km-text-secondary)] hover:text-[var(--km-text)] transition-colors whitespace-nowrap"
                >
                  {home.viewAllProducts}
                </Link>
              </div>
              <ProductRow products={s.products} />
            </div>
          ))}

          {sections.length === 0 && (
            <p className="text-[14px] text-[var(--km-text-muted)] py-10 text-center">
              {_lang === "EN" ? "No products found" : "ไม่พบสินค้าในหมวดนี้"}
            </p>
          )}
        </div>

      </div>
    </section>
  );
}
