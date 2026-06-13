"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X, ArrowRight, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { useUIStore } from "@/stores/ui.store";
import Image from "next/image";
import Link from "next/link";
import { PRODUCTS, BRANDS } from "@/lib/mock-data";
import { usePathname, useRouter } from "next/navigation";

const POPULAR_SEARCHES = [
  "MacBook Air M3",
  "ฟิล์มกันมองแม่เหล็ก",
  "Universal 15.6 นิ้ว",
  "iPad Pro M4",
  "Monitor Privacy",
  "NanoSnap",
];


export function SearchOverlay() {
  const isOpen       = useUIStore((s) => s.searchOpen);
  const close        = useUIStore((s) => s.closeSearch);
  const headerHeight = useUIStore((s) => s.headerHeight);
  const pathname     = usePathname();
  const router      = useRouter();
  const inputRef       = useRef<HTMLInputElement>(null);
  const recentScrollRef        = useRef<HTMLDivElement>(null); // mobile (unused, no buttons)
  const recentScrollRefDesktop = useRef<HTMLDivElement>(null); // desktop (with buttons)
  const [recentCanLeft, setRecentCanLeft]   = useState(false);
  const [recentCanRight, setRecentCanRight] = useState(true);

  const updateRecentScroll = () => {
    const el = recentScrollRefDesktop.current;
    if (!el) return;
    setRecentCanLeft(el.scrollLeft > 0);
    setRecentCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };
  const scrollRecent = (dir: "left" | "right") => {
    recentScrollRefDesktop.current?.scrollBy({ left: dir === "left" ? -240 : 240, behavior: "smooth" });
  };
  const [query, setQuery]   = useState("");
  const [visible, setVisible] = useState(false);
  const [history, setHistory] = useState<string[]>([
    "MacBook Pro 14",
    "ฟิล์ม iPad Air",
    "Universal 13.3",
    "Privacy Monitor 24",
  ]);

  const clearHistory = () => setHistory([]);
  const removeHistoryItem = (item: string) => setHistory(history.filter(h => h !== item));

  const RECENT_PRODUCTS = useMemo(() => {
    return PRODUCTS.slice(0, 5);
  }, []);

  // Detect if current page is a brand page to provide scoped search
  const currentBrand = useMemo(() => {
    if (!pathname.startsWith("/brands/")) return null;
    return BRANDS.find(b => b.href === pathname)?.name;
  }, [pathname]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => { close(); setQuery(""); }, 300);
  };

  const handleSubmit = (q: string) => {
    if (!q.trim()) return;
    const trimmed = q.trim();
    setHistory((prev) => {
      const filtered = prev.filter((item) => item !== trimmed);
      return [trimmed, ...filtered].slice(0, 5);
    });
    handleClose();
    router.push(`/products?q=${encodeURIComponent(trimmed)}`);
  };

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      setTimeout(() => inputRef.current?.focus(), 150);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const allMatchedProducts = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const filtered = PRODUCTS.filter(
      (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
    );
    return [...filtered].sort((a, b) => {
      // 1. Prioritize startsWith (prefix match)
      const aBrandStarts = a.brand.toLowerCase().startsWith(q);
      const aNameStarts = a.name.toLowerCase().startsWith(q);
      const bBrandStarts = b.brand.toLowerCase().startsWith(q);
      const bNameStarts = b.name.toLowerCase().startsWith(q);

      const aStarts = aBrandStarts || aNameStarts;
      const bStarts = bBrandStarts || bNameStarts;

      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      // 2. Prioritize earlier match index (smaller index means closer to start)
      const getEarliestIndex = (p: typeof a) => {
        const bIdx = p.brand.toLowerCase().indexOf(q);
        const nIdx = p.name.toLowerCase().indexOf(q);
        if (bIdx === -1) return nIdx;
        if (nIdx === -1) return bIdx;
        return Math.min(bIdx, nIdx);
      };

      const aMinIdx = getEarliestIndex(a);
      const bMinIdx = getEarliestIndex(b);
      if (aMinIdx !== bMinIdx) return aMinIdx - bMinIdx;

      // 3. Fallback to alphabetical sorting
      const brandCompare = a.brand.localeCompare(b.brand, "th");
      if (brandCompare !== 0) return brandCompare;
      return a.name.localeCompare(b.name, "th");
    });
  }, [query]);

  const matchedProducts = useMemo(() => allMatchedProducts.slice(0, 5), [allMatchedProducts]);
  const hasMoreProducts = allMatchedProducts.length > 5;

  const matchedBrands = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const filtered = BRANDS.filter((b) => b.name.toLowerCase().includes(q));
    return [...filtered].sort((a, b) => {
      // 1. Prioritize startsWith (prefix match)
      const aStarts = a.name.toLowerCase().startsWith(q);
      const bStarts = b.name.toLowerCase().startsWith(q);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      // 2. Prioritize earlier match index
      const aIdx = a.name.toLowerCase().indexOf(q);
      const bIdx = b.name.toLowerCase().indexOf(q);
      if (aIdx !== bIdx) return aIdx - bIdx;

      // 3. Fallback to alphabetical
      return a.name.localeCompare(b.name, "th");
    }).slice(0, 4);
  }, [query]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (isOpen) setMounted(true);
    else setTimeout(() => setMounted(false), 300);
  }, [isOpen]);

  if (!mounted && !isOpen) return null;

  // Shared scrollable body content
  const renderBody = (opts?: { desktopScroll?: boolean }) => (
    <div className="flex-1 overflow-y-auto">
      {!query && (
        <div className="flex flex-col gap-6 p-4">
          {/* 1. ประวัติการค้นหา */}
          {history.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[13px] font-normal uppercase tracking-wider text-[var(--km-text)]">
                  ประวัติการค้นหา
                </h3>
                <button
                  onClick={clearHistory}
                  className="text-[12px] text-[var(--km-text-muted)] active:text-red-500 transition-colors font-medium"
                >
                  ล้างทั้งหมด
                </button>
              </div>
              <div className="flex flex-col">
                {history.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2.5 border-b border-[var(--km-border)] last:border-none"
                  >
                    <button
                      onClick={() => { setQuery(item); handleSubmit(item); }}
                      className="flex items-center gap-2.5 text-[13px] text-[var(--km-text-secondary)] text-left flex-1 py-0.5"
                    >
                      <Clock size={15} className="text-[var(--km-text-muted)] flex-shrink-0" />
                      <span className="truncate">{item}</span>
                    </button>
                    <button
                      onClick={() => removeHistoryItem(item)}
                      className="p-1 text-[var(--km-text-muted)] active:text-[var(--km-text)] transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. คำค้นหายอดฮิต */}
          <div>
            <h3 className="text-[13px] font-normal uppercase tracking-wider text-[var(--km-text)] mb-3">
              คำค้นหายอดฮิต
            </h3>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => { setQuery(item); handleSubmit(item); }}
                  className="px-3.5 py-2 bg-white border border-[var(--km-border)] hover:bg-[var(--km-surface)] text-[13px] text-[var(--km-text-secondary)] rounded-full transition-all active:scale-95 leading-none"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* 3. สินค้าที่เคยกดดู */}
          <div>
            <h3 className="text-[13px] font-normal uppercase tracking-wider text-[var(--km-text)] mb-3">
              สินค้าที่เคยกดดู
            </h3>
            <div className="relative group/recent -mx-4">
              {opts?.desktopScroll && recentCanLeft && (
                <button onClick={() => scrollRecent("left")}
                  className="flex absolute left-4 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-xl border border-[var(--km-border)] items-center justify-center text-[var(--km-text)] hover:bg-[var(--km-text)] hover:text-white transition-all opacity-0 group-hover/recent:opacity-100 group-hover/recent:translate-x-0">
                  <ChevronLeft size={16} strokeWidth={2} />
                </button>
              )}
              {opts?.desktopScroll && recentCanRight && (
                <button onClick={() => scrollRecent("right")}
                  className="flex absolute right-4 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-xl border border-[var(--km-border)] items-center justify-center text-[var(--km-text)] hover:bg-[var(--km-text)] hover:text-white transition-all opacity-0 group-hover/recent:opacity-100 group-hover/recent:translate-x-0">
                  <ChevronRight size={16} strokeWidth={2} />
                </button>
              )}
              <div
                ref={opts?.desktopScroll ? recentScrollRefDesktop : recentScrollRef}
                onScroll={opts?.desktopScroll ? updateRecentScroll : undefined}
                className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-4"
              >
              {RECENT_PRODUCTS.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  onClick={handleClose}
                  className="flex-shrink-0 w-[115px] bg-white rounded-2xl overflow-hidden border border-[var(--km-border)] flex flex-col p-2.5 active:scale-[0.97] transition-all"
                >
                  <div className="aspect-square relative w-full bg-[var(--km-surface)] rounded-xl overflow-hidden mb-2">
                    <Image src={p.image} alt={p.name} fill className="object-cover" sizes="100px" />
                  </div>
                  <span className="text-[9px] font-bold text-[var(--km-text-muted)] uppercase truncate tracking-wider leading-none">
                    {p.brand}
                  </span>
                  <p className="text-[12px] text-[var(--km-text-secondary)] line-clamp-1 leading-snug mt-1 min-h-[16px]">
                    {p.name}
                  </p>
                  <div className="flex items-baseline gap-1 mt-1.5">
                    <span className="text-[13px] font-medium text-[var(--km-text)]">
                      ฿{p.price.toLocaleString()}
                    </span>
                    {p.originalPrice && (
                      <span className="text-[10px] text-[var(--km-text-muted)] line-through">
                        ฿{p.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
              </div>
            </div>
          </div>

          <div className="h-4" />
        </div>
      )}

      {query && (
        <div className="flex flex-col">
          <div className="flex flex-col">
            {currentBrand && (
              <button
                onClick={() => {
                  const targetBrandData = BRANDS.find(b => b.name === currentBrand);
                  handleClose();
                  if (targetBrandData) {
                    router.push(`${targetBrandData.href}?q=${encodeURIComponent(query.trim())}`);
                  } else {
                    router.push(`/products?q=${encodeURIComponent(query.trim())}&brand=${encodeURIComponent(currentBrand)}`);
                  }
                }}
                className="flex items-center gap-3 px-4 py-3.5 active:bg-[var(--km-surface)] transition-colors text-left"
              >
                <Search size={16} className="text-[var(--km-text-muted)] flex-shrink-0" />
                <div className="flex-1 min-w-0 text-[14px]">
                  <span className="text-[var(--km-text-secondary)]">ค้นหา </span>
                  <span className="text-[var(--km-text)] font-medium">&ldquo;{query}&rdquo;</span>
                  <span className="text-[var(--km-text-secondary)]"> ใน </span>
                  <span className="text-[var(--km-text)] font-medium">{currentBrand}</span>
                </div>
              </button>
            )}
            <button
              onClick={() => handleSubmit(query)}
              className="flex items-center gap-3 px-4 py-3.5 active:bg-[var(--km-surface)] transition-colors text-left"
            >
              <Search size={16} className="text-[var(--km-text-muted)] flex-shrink-0" />
              <div className="flex-1 min-w-0 text-[14px]">
                <span className="text-[var(--km-text-secondary)]">ค้นหา </span>
                <span className="text-[var(--km-text)] font-medium">&ldquo;{query}&rdquo;</span>
                <span className="text-[var(--km-text-secondary)]"> ใน </span>
                <span className="text-[var(--km-text)] font-medium">แบรนด์ทั้งหมด</span>
              </div>
            </button>
          </div>

          <div>
            {matchedBrands.length > 0 && (
              <div className="px-4 pt-4 pb-2">
                <p className="text-[13px] font-normal text-[var(--km-text-secondary)] mb-3 uppercase tracking-wider">แบรนด์</p>
                <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
                  {matchedBrands.map((brand) => (
                    <Link key={brand.href} href={brand.href} onClick={handleClose} className="flex flex-col items-center gap-1.5 w-16 flex-shrink-0">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-[var(--km-surface)] border border-[var(--km-border)]">
                        <BrandLogo logo={brand.logo} name={brand.name} />
                      </div>
                      <span className="text-xs text-[var(--km-text-muted)] text-center leading-tight">{brand.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col mt-2">
              {matchedProducts.length > 0 && (
                <p className="px-4 text-[13px] font-normal text-[var(--km-text-secondary)] mb-1 uppercase tracking-wider">สินค้า</p>
              )}
              {matchedProducts.length === 0 && matchedBrands.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-center px-4">
                  <Search size={40} strokeWidth={1} className="text-[var(--km-text-muted)]" />
                  <p className="text-sm text-[var(--km-text-muted)]">ไม่พบสินค้าที่ตรงกัน</p>
                </div>
              )}
              {matchedProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  onClick={handleClose}
                  className="flex gap-3 px-4 py-3.5 active:bg-[var(--km-surface)] transition-colors"
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[var(--km-surface)] flex-shrink-0 border border-[var(--km-border)]">
                    <Image src={p.image} alt={p.name} fill className="object-cover" sizes="48px" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
                    <span className="text-[13px] font-medium text-[var(--km-text)]">{p.brand}</span>
                    <p className="text-[13px] font-normal text-[var(--km-text-secondary)] line-clamp-1">{p.name}</p>
                    <span className="text-[13px] font-medium text-[var(--km-text)]">฿{p.price.toLocaleString()}</span>
                  </div>
                  <ArrowRight size={14} className="text-[var(--km-border-strong)] self-center flex-shrink-0" />
                </Link>
              ))}
              {hasMoreProducts && (
                <button
                  onClick={() => handleSubmit(query)}
                  className="mx-4 mt-2 mb-10 py-3 rounded-xl border border-[var(--km-border)] text-[13px] font-medium text-[var(--km-text)] bg-white active:bg-[var(--km-surface)] transition-all flex items-center justify-center gap-2"
                >
                  ค้นหาสินค้าเพิ่มเติมทั้งหมด
                  <ArrowRight size={14} className="text-[var(--km-text-muted)]" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Backdrop — desktop only */}
      <div
        className="hidden md:block fixed inset-0 bg-black/30 transition-opacity duration-300 z-[870]"
        style={{ opacity: visible ? 1 : 0, pointerEvents: (isOpen || visible) ? "auto" : "none" }}
        onClick={handleClose}
      />

      {/* Desktop: right-side drawer */}
      <div
        className="hidden md:flex fixed top-0 right-0 bottom-0 z-[880] w-[420px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out overflow-hidden"
        style={{ transform: visible ? "translateX(0)" : "translateX(100%)" }}
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--km-border)] flex-shrink-0">
          <Search size={16} strokeWidth={1.75} className="text-[var(--km-text-muted)] flex-shrink-0" />
          <form className="flex-1" onSubmit={(e) => { e.preventDefault(); handleSubmit(query); }}>
            <input
              ref={inputRef}
              type="text"
              placeholder="ค้นหาแบรนด์ หรือสินค้า..."
              className="w-full bg-transparent outline-none text-[15px] text-[var(--km-text)] placeholder:text-[var(--km-text-muted)]"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
          {query
            ? <button type="button" onClick={() => setQuery("")} className="p-1 flex-shrink-0"><X size={16} className="text-[var(--km-text-muted)]" /></button>
            : <button onClick={handleClose} className="p-1.5 rounded-full hover:bg-[var(--km-surface)] transition-colors flex-shrink-0"><X size={18} strokeWidth={1.75} className="text-[var(--km-text)]" /></button>
          }
        </div>
        {renderBody({ desktopScroll: true })}
      </div>

      {/* Mobile: full-screen overlay */}
      <div
        className="md:hidden fixed z-[1000] flex flex-col overflow-clip"
        style={{ top: `${headerHeight}px`, left: 0, right: 0, bottom: 0, pointerEvents: (isOpen || visible) ? "auto" : "none" }}
      >
        <div
          className="relative flex flex-col bg-white flex-1 overflow-hidden transition-transform duration-300 ease-out"
          style={{ transform: visible ? "translateY(0)" : "translateY(-100%)" }}
        >
          <div className="px-4 py-3 flex items-center gap-3 bg-white">
            <form
              className="flex-1 flex items-center bg-[var(--km-surface)] h-11 rounded-full px-4 gap-2"
              onSubmit={(e) => { e.preventDefault(); handleSubmit(query); }}
            >
              <Search size={16} strokeWidth={1.75} className="text-[var(--km-text-muted)] flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="ค้นหาแบรนด์ หรือสินค้า..."
                className="flex-1 bg-transparent outline-none text-sm text-[var(--km-text)] placeholder:text-[var(--km-text-muted)]"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} className="p-0.5 flex-shrink-0">
                  <X size={16} className="text-[var(--km-text-muted)]" />
                </button>
              )}
            </form>
            <button onClick={handleClose} className="text-sm text-[var(--km-text-secondary)] flex-shrink-0">
              ยกเลิก
            </button>
          </div>
          {renderBody()}
        </div>
      </div>
    </>
  );
}

function BrandLogo({ logo, name }: { logo?: string; name: string }) {
  const [error, setError] = useState(false);
  if (!logo || error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-lg font-bold text-[var(--km-text-muted)]/30">{name[0]}</span>
      </div>
    );
  }
  return (
    <Image
      src={logo!}
      alt={name}
      width={200}
      height={200}
      className="w-full h-full object-cover"
      unoptimized
      onError={() => setError(true)}
    />
  );
}
