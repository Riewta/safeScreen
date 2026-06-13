"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, Check } from "lucide-react";
import { ProductCard, type ProductCardProps } from "@/components/product/ProductCard";
import { BottomSheet } from "@/components/ui/BottomSheet";

/* ─── Tabs ─── */
const COLLECTION_TABS = [
  { id: "top-thai",    label: "ยอดฮิตในไทย"       },
  { id: "top-global",  label: "ยอดฮิตทั่วโลก"      },
  { id: "new",         label: "สินค้ามาใหม่"        },
  { id: "sale",        label: "ลดราคา"              },
  { id: "recommend",   label: "สินค้าแนะนำ"         },
  { id: "campaign",    label: "แคมเปญช่วงนี้"       },
];

const SORT_OPTIONS = [
  { value: "popular",    label: "ยอดนิยม"      },
  { value: "price-asc",  label: "ราคาต่ำ → สูง" },
  { value: "price-desc", label: "ราคาสูง → ต่ำ" },
  { value: "newest",     label: "ใหม่ล่าสุด"    },
  { value: "rating",     label: "คะแนนสูงสุด"   },
];

const PRICE_MAX = 10000;

interface FilterState {
  brands: string[];
  priceMin: number;
  priceMax: number;
  rating: number | null;
}

const EMPTY_FILTERS: FilterState = { brands: [], priceMin: 0, priceMax: PRICE_MAX, rating: null };

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

interface Props {
  products: ProductCardProps[];
  initialTab: string;
}

export function CollectionClient({ products, initialTab }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab]   = useState(initialTab);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);
  const [sort, setSort]             = useState("popular");
  const [filters, setFilters]       = useState<FilterState>(EMPTY_FILTERS);
  const [sheetOpen, setSheetOpen]   = useState(false);
  const [sortOpen, setSortOpen]     = useState(false);

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    router.replace(`/collection?tab=${id}`, { scroll: false });
  };

  const visible = useMemo(() => {
    const topThaiIds = ["1","2","3","4","4b","4c","4d","4e","cd-1","bb-1"];
    const topGlobalIds = ["5","6","7","8","8b","8c","8d","8e","jj-1","rr-5"];

    let list = products.filter((p) => {
      if (activeTab === "top-thai")   return topThaiIds.includes(p.id);
      if (activeTab === "top-global") return topGlobalIds.includes(p.id);
      if (activeTab === "new")       return true;
      if (activeTab === "sale")      return p.originalPrice != null;
      if (activeTab === "recommend") return true;
      if (activeTab === "campaign")  return p.badge === "hot";
      return true;
    });
    list = list.filter((p) => {
      if (filters.brands.length && !filters.brands.includes(p.brand)) return false;
      if (!matchesPrice(p.price, filters.priceMin, filters.priceMax)) return false;
      if (filters.rating && (p.rating ?? 0) < filters.rating) return false;
      return true;
    });
    return sortProducts(list, sort);
  }, [products, activeTab, filters, sort]);

  const showRank = activeTab === "top-thai" || activeTab === "top-global";

  return (
    <div className="min-h-screen bg-white">
      {/* ── Tabs (Aligned with Container) ── */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="overflow-hidden -mx-4 md:-mx-6">
            <div className="flex overflow-x-auto no-scrollbar gap-2 px-4 md:px-6 py-3">
              {COLLECTION_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`whitespace-nowrap px-5 py-2 rounded-full text-[13px] font-medium transition-all flex-shrink-0 ${
                    activeTab === tab.id
                      ? "bg-[var(--km-text)] text-white"
                      : "bg-white text-[var(--km-text-secondary)] border border-[#e8e8ed]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-2 pb-10">
        <div className="min-w-0">

            {visible.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
                {visible.map((p) => (
                  <ProductCard key={p.id} {...p} rank={undefined} badge={showRank ? "hot" : p.badge} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <SlidersHorizontal size={32} className="text-[var(--km-text-muted)] mb-6" />
                <h2 className="text-xl font-medium mb-2">ไม่พบสินค้า</h2>
                <p className="text-sm text-[var(--km-text-muted)] mb-8">ลองปรับตัวกรองหรือเลือก tab อื่น</p>

              </div>
            )}
          </div>
        </div>

      {/* ── Sort Sheet ── */}
      <BottomSheet isOpen={sortOpen} onClose={() => setSortOpen(false)} title="เรียงลำดับสินค้า">
        <div className="flex flex-col gap-0">
          {SORT_OPTIONS.map((opt) => (
            <button key={opt.value} onClick={() => { setSort(opt.value); setSortOpen(false); }}
              className={`flex items-center justify-between w-full px-6 py-4 transition-colors ${sort === opt.value ? "bg-[var(--km-surface)] text-[var(--km-text)] font-medium" : "text-[var(--km-text-secondary)] font-normal"}`}>
              <span className="text-[13px]">{opt.label}</span>
              {sort === opt.value && <Check size={14} strokeWidth={2.5} />}
            </button>
          ))}
        </div>
      </BottomSheet>

      <BottomSheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)} title="ตัวกรองสินค้า"
        footer={<button onClick={() => setSheetOpen(false)} className="w-full py-3.5 rounded-full bg-[var(--km-text)] text-white text-sm font-medium">ดูสินค้า {visible.length} รายการ</button>}
      >
        <div className="px-6">
          {/* ช่วงราคา */}
          <FilterSection title="ช่วงราคา">
            <PriceRangeSlider
              min={filters.priceMin}
              max={filters.priceMax}
              onChange={(min, max) => setFilters((f) => ({ ...f, priceMin: min, priceMax: max }))}
            />
          </FilterSection>

        </div>
      </BottomSheet>
    </div>
  );
}

function PriceRangeSlider({ min, max, onChange }: { min: number; max: number; onChange: (min: number, max: number) => void }) {
  const step = 100;
  const minPct = (min / PRICE_MAX) * 100;
  const maxPct = (max / PRICE_MAX) * 100;

  return (
    <div className="pt-1 pb-2">
      <div className="flex justify-between mb-3">
        <span className="text-[13px] font-medium text-[var(--km-text)]">฿{min.toLocaleString()}</span>
        <span className="text-[13px] font-medium text-[var(--km-text)]">
          {max >= PRICE_MAX ? `฿${PRICE_MAX.toLocaleString()}+` : `฿${max.toLocaleString()}`}
        </span>
      </div>
      <div className="relative h-1.5 mx-1">
        <div className="absolute inset-0 rounded-full bg-[var(--km-border)]" />
        <div
          className="absolute h-full rounded-full bg-[var(--km-text)]"
          style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
        />
        <input
          type="range" min={0} max={PRICE_MAX} step={step} value={min}
          onChange={(e) => { const v = Math.min(Number(e.target.value), max - step); onChange(v, max); }}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
          style={{ zIndex: min > PRICE_MAX - step ? 5 : 3 }}
        />
        <input
          type="range" min={0} max={PRICE_MAX} step={step} value={max}
          onChange={(e) => { const v = Math.max(Number(e.target.value), min + step); onChange(min, v); }}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
          style={{ zIndex: 4 }}
        />
        <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border-2 border-[var(--km-text)] shadow-md pointer-events-none" style={{ left: `calc(${minPct}% - 10px)` }} />
        <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border-2 border-[var(--km-text)] shadow-md pointer-events-none" style={{ left: `calc(${maxPct}% - 10px)` }} />
      </div>
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-2">
      <h3 className="text-[14px] font-medium text-[var(--km-text)] mb-2">{title}</h3>
      {children}
    </div>
  );
}

