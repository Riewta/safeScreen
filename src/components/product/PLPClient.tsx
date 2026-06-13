"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { SlidersHorizontal, X, ChevronDown, Check } from "lucide-react";

import { ProductCard, type ProductCardProps } from "@/components/product/ProductCard";
import { CATEGORIES as MOCK_CATEGORIES } from "@/lib/mock-data";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { useLang } from "@/contexts/lang";

/* ─── Types ─── */
const PRICE_MAX = 10000;

interface FilterState {
  categories: string[];
  brands: string[];
  priceMin: number;
  priceMax: number;
  rating: number | null;
  badge: string | null;
  q: string | null;
}


const BADGE_OPTIONS = [
  { value: "new",       label: "สินค้าใหม่" },
  { value: "sale",      label: "ลดราคา"    },
  { value: "hot",       label: "ยอดฮิต"    },
  { value: "best",      label: "ขายดี"     },
  { value: "recommend", label: "แนะนำ"     },
  { value: "limited",   label: "Limited"  },
];

const EMPTY_FILTERS: FilterState = {
  categories: [],
  brands: [],
  priceMin: 0,
  priceMax: PRICE_MAX,
  rating: null,
  badge: null,
  q: null,
};


/* ─── Props ─── */
interface Props {
  products: ProductCardProps[];
  initialParams: { category?: string; brand?: string; sort?: string; q?: string };
}

/* ─── Helpers ─── */
function matchesPrice(price: number, min: number, max: number): boolean {
  return price >= min && price <= max;
}

function sortProducts(list: ProductCardProps[], sort: string): ProductCardProps[] {
  const copy = [...list];
  if (sort === "price-asc")  return copy.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") return copy.sort((a, b) => b.price - a.price);
  if (sort === "rating")     return copy.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  return copy;
}

/* ─── Main Component ─── */
export function PLPClient({ products, initialParams }: Props) {
  const { pages: t } = useLang();
  const SORT_OPTIONS = useMemo(() => [
    { value: "price-asc",  label: t.plpSortPriceAsc  },
    { value: "price-desc", label: t.plpSortPriceDesc },
  ], [t]);
  const allBrands = useMemo(() => [...new Set(products.map((p) => p.brand))].sort(), [products]);
  const categories = useMemo(() =>
    MOCK_CATEGORIES
      .filter(c => c.href.includes("category="))
      .map(c => ({ label: c.label, value: c.href.split("category=")[1] })),
  []);

  const [filters, setFilters] = useState<FilterState>({
    ...EMPTY_FILTERS,
    categories: initialParams.category ? [initialParams.category] : [],
    brands:     initialParams.brand    ? [initialParams.brand]    : [],
    q:          initialParams.q        || null,
  });
  const [sort, setSort]           = useState(initialParams.sort ?? "price-asc");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sortOpen, setSortOpen]   = useState(false);

  const clearAll = useCallback(() => setFilters(EMPTY_FILTERS), []);

  const toggleFilter = (key: keyof FilterState, value: string) => {
    setFilters((f) => {
      const current = f[key] as string[];
      if (current.includes(value)) {
        return { ...f, [key]: current.filter((x) => x !== value) };
      }
      return { ...f, [key]: [...current, value] };
    });
  };

  const [displayCount, setDisplayCount] = useState(20);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = React.useRef<HTMLDivElement>(null);

  const visible = useMemo(() => {
    const queryTerm = filters.q?.toLowerCase() ?? "";
    return sortProducts(products.filter((p) => {
      if (queryTerm && !p.name.toLowerCase().includes(queryTerm) && !p.brand.toLowerCase().includes(queryTerm)) return false;
      if (filters.categories.length && (!p.category || !filters.categories.includes(p.category))) return false;
      if (filters.brands.length && !filters.brands.includes(p.brand)) return false;
      if (!matchesPrice(p.price, filters.priceMin, filters.priceMax)) return false;
      if (filters.rating && (p.rating ?? 0) < filters.rating) return false;
      if (filters.badge && p.badge !== filters.badge) return false;
      return true;
    }), sort);
  }, [products, filters, sort]);

  const displayedProducts = useMemo(() => visible.slice(0, displayCount), [visible, displayCount]);
  const hasMore = displayCount < visible.length;

  // Reset pagination when filters change
  useEffect(() => {
    setDisplayCount(20);
  }, [filters, sort]);

  // Infinite Scroll Logic
  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          setIsLoadingMore(true);
          // Small delay for smooth animation
          setTimeout(() => {
            setDisplayCount((prev) => prev + 20);
            setIsLoadingMore(false);
          }, 600);
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [hasMore, isLoadingMore]);

  const activeCount = useMemo(() =>
    filters.categories.length + filters.brands.length + (filters.priceMin > 0 || filters.priceMax < PRICE_MAX ? 1 : 0) + (filters.rating ? 1 : 0) + (filters.badge ? 1 : 0) + (filters.q ? 1 : 0),
  [filters]);

  const sortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label ?? t.plpSortPriceAsc;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-1 pb-10 md:py-10">
        <div className="flex flex-col md:flex-row gap-10">
          <aside className="hidden w-64 flex-shrink-0">
            <div className="sticky top-32">
              <FilterPanel filters={filters} setFilters={setFilters} brands={allBrands} categories={categories} onClear={clearAll} toggleFilter={toggleFilter} />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between py-3 mb-2 border-b border-[var(--km-border)]">
              {/* Category pills */}
              <div className="overflow-x-auto no-scrollbar flex-1 mr-3">
                <div className="flex flex-nowrap gap-2">
                  {MOCK_CATEGORIES.map((cat) => {
                    const catValue = cat.href.includes("=") ? cat.href.split("category=")[1] : null;
                    const isActive = catValue ? filters.categories.includes(catValue) : filters.categories.length === 0;
                    return (
                      <button
                        key={cat.href}
                        onClick={() => setFilters((f) => ({
                          ...f,
                          categories: catValue
                            ? (f.categories.includes(catValue) ? [] : [catValue])
                            : [],
                        }))}
                        className={`shrink-0 px-4 py-1.5 rounded-full text-[13px] whitespace-nowrap transition-colors ${
                          isActive
                            ? "bg-[var(--km-text)] text-white"
                            : "bg-[var(--km-surface)] text-[var(--km-text-secondary)] hover:bg-[#E8E8ED] hover:text-[var(--km-text)]"
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="relative">
                  <button onClick={() => setSortOpen((v) => !v)} className="flex items-center gap-1 text-[13px] font-normal text-[var(--km-text)]">
                    {sortLabel} <ChevronDown size={14} className="text-[var(--km-text-secondary)]" />
                  </button>
                  {sortOpen && (
                    <>
                      <div className="fixed inset-0 z-[99]" onClick={() => setSortOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 z-[100] bg-white border border-[var(--km-border)] rounded-[12px] shadow-md overflow-hidden min-w-[160px]">
                        {SORT_OPTIONS.map((opt) => (
                          <button key={opt.value} onClick={() => { setSort(opt.value); setSortOpen(false); }}
                            className={`w-full text-left px-4 py-3 text-[13px] transition-colors hover:bg-[var(--km-surface)] ${sort === opt.value ? "font-medium text-[var(--km-text)]" : "font-normal text-[var(--km-text-secondary)]"}`}>
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Active Filter Chips (Visible on all devices) */}
            {activeCount > 0 && (
              <div className="flex items-center gap-2 flex-wrap mb-4 animate-in fade-in slide-in-from-top-1 duration-300">
                {filters.q && <FilterChip label={`"${filters.q}"`} onRemove={() => setFilters((f) => ({ ...f, q: null }))} />}
                {filters.categories.map((c) => <FilterChip key={c} label={categories.find(x => x.value === c)?.label ?? c} onRemove={() => toggleFilter("categories", c)} />)}
                {filters.brands.map((b) => <FilterChip key={b} label={b} onRemove={() => toggleFilter("brands", b)} />)}
                {(filters.priceMin > 0 || filters.priceMax < PRICE_MAX) && (
                  <FilterChip
                    label={`฿${filters.priceMin.toLocaleString()} – ฿${filters.priceMax === PRICE_MAX ? `${PRICE_MAX.toLocaleString()}+` : filters.priceMax.toLocaleString()}`}
                    onRemove={() => setFilters((f) => ({ ...f, priceMin: 0, priceMax: PRICE_MAX }))}
                  />
                )}
                {filters.badge && <FilterChip label={BADGE_OPTIONS.find((b) => b.value === filters.badge)?.label ?? ""} onRemove={() => setFilters((f) => ({ ...f, badge: null }))} />}
                {filters.rating && <FilterChip label={`★ ${filters.rating} ดาวขึ้นไป`} onRemove={() => setFilters((f) => ({ ...f, rating: null }))} />}
              </div>
            )}

            {visible.length > 0 ? (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  {displayedProducts.map((p) => (
                    <ProductCard key={p.id} {...p} rank={undefined} />
                  ))}
                </div>

                {/* Loading State / Trigger */}
                {hasMore && (
                  <div ref={loadMoreRef} className="flex flex-col items-center justify-center py-12 gap-3">
                    <div className="w-8 h-8 border-[3px] border-[var(--km-border)] border-t-[var(--km-text)] rounded-full animate-spin" />
                    <p className="text-xs text-[var(--km-text-secondary)] animate-pulse">กำลังโหลดสินค้าเพิ่มเติม...</p>
                  </div>
                )}
              </>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>


      <BottomSheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)} title="ตัวกรองสินค้า" 
        footer={<button onClick={() => setSheetOpen(false)} className="w-full py-3.5 rounded-full bg-[var(--km-text)] text-white text-sm font-medium">{t.plpViewItems} {visible.length} {t.plpItems}</button>}
      >
        <div className="px-6">
          <FilterPanel filters={filters} setFilters={setFilters} brands={allBrands} categories={categories} onClear={clearAll} toggleFilter={toggleFilter} />
        </div>
      </BottomSheet>
    </div>
  );
}

/* ─── Sub-Components ─── */
interface FilterPanelProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  brands: string[];
  categories: { label: string; value: string }[];
  onClear: () => void;
  toggleFilter: (key: keyof FilterState, value: string) => void;
}

function PriceRangeSlider({ min, max, onChange }: { min: number; max: number; onChange: (min: number, max: number) => void }) {
  const step = 100;
  const trackRef = React.useRef<HTMLDivElement>(null);
  const dragging = React.useRef<"min" | "max" | null>(null);

  const minPct = (min / PRICE_MAX) * 100;
  const maxPct = (max / PRICE_MAX) * 100;

  const pctToValue = (pct: number) => Math.round((pct / 100) * PRICE_MAX / step) * step;

  const getPosPct = (clientX: number) => {
    const rect = trackRef.current!.getBoundingClientRect();
    return Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
  };

  const onTrackStart = (clientX: number) => {
    const pct = getPosPct(clientX);
    dragging.current = Math.abs(pct - minPct) <= Math.abs(pct - maxPct) ? "min" : "max";
    onMove(clientX);
  };

  const onMove = (clientX: number) => {
    if (!dragging.current) return;
    const pct = getPosPct(clientX);
    const v = pctToValue(pct);
    if (dragging.current === "min") onChange(Math.min(v, max - step), max);
    else onChange(min, Math.max(v, min + step));
  };

  React.useEffect(() => {
    const move = (e: MouseEvent | TouchEvent) => {
      const x = "touches" in e ? e.touches[0].clientX : e.clientX;
      onMove(x);
    };
    const up = () => { dragging.current = null; };
    window.addEventListener("mousemove", move);
    window.addEventListener("touchmove", move, { passive: true });
    window.addEventListener("mouseup", up);
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchend", up);
    };
  });

  return (
    <div className="pt-1 pb-2">
      <div className="flex justify-between mb-3">
        <span className="text-[13px] font-medium text-[var(--km-text)]">฿{min.toLocaleString()}</span>
        <span className="text-[13px] font-medium text-[var(--km-text)]">
          {max >= PRICE_MAX ? `฿${PRICE_MAX.toLocaleString()}+` : `฿${max.toLocaleString()}`}
        </span>
      </div>
      <div
        ref={trackRef}
        className="relative h-1 mx-1 cursor-pointer"
        onMouseDown={(e) => onTrackStart(e.clientX)}
        onTouchStart={(e) => onTrackStart(e.touches[0].clientX)}
      >
        <div className="absolute inset-0 rounded-full bg-[var(--km-border-strong)]" />
        <div
          className="absolute h-full rounded-full bg-[var(--km-text-secondary)]"
          style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
        />
        <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border border-[var(--km-border-strong)] shadow-sm" style={{ left: `calc(${minPct}% - 8px)` }} />
        <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border border-[var(--km-border-strong)] shadow-sm" style={{ left: `calc(${maxPct}% - 8px)` }} />
      </div>
    </div>
  );
}

function FilterPanel({ filters, setFilters, brands, toggleFilter }: FilterPanelProps) {
  return (
    <div className="flex flex-col gap-0">
      <FilterSection title="ช่วงราคา">
        <PriceRangeSlider
          min={filters.priceMin}
          max={filters.priceMax}
          onChange={(min, max) => setFilters((f) => ({ ...f, priceMin: min, priceMax: max }))}
        />
      </FilterSection>
      <FilterSection title="แบรนด์">
        <div className="grid grid-cols-2 gap-y-2.5 gap-x-6">
          {brands.map((b) => (
            <label key={b} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleFilter("brands", b)}>
              <div className={`w-[18px] h-[18px] rounded-[4px] border-[1.5px] flex items-center justify-center transition-all ${filters.brands.includes(b) ? "bg-[var(--km-text)] border-[var(--km-text)]" : "border-[var(--km-border-strong)]"}`}>
                {filters.brands.includes(b) && <Check size={12} className="text-white" strokeWidth={3} />}
              </div>
              <span className={`text-[13px] ${filters.brands.includes(b) ? "font-normal text-[var(--km-text)]" : "text-[var(--km-text-secondary)] font-normal"}`}>{b}</span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-2">
      <h3 className="text-[14px] font-medium text-[var(--km-text)] mb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="flex items-center gap-2 pl-3 pr-1.5 py-1.5 rounded-full bg-white border border-[var(--km-border)] text-[13px] font-normal">
      <span className="text-[var(--km-text)]">{label}</span>
      <button onClick={onRemove} className="w-5 h-5 flex items-center justify-center rounded-full bg-[var(--km-surface)] text-[var(--km-text-secondary)] transition-colors active:scale-90">
        <X size={10} strokeWidth={3} />
      </button>
    </span>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <SlidersHorizontal size={32} className="text-[var(--km-text-muted)] mb-6" />
      <h2 className="text-xl font-normal mb-2">ไม่พบสินค้าที่ตรงกัน</h2>
      <p className="text-sm text-[var(--km-text-muted)] mb-8">ลองปรับตัวกรองเพื่อดูสินค้าอื่นๆ</p>

    </div>
  );
}
