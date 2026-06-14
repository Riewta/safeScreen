"use client";

import { useLang } from "@/contexts/lang";

const STATS_TH = [
  { value: "20,000+", label: "Orders Nationwide" },
  { value: "4.9★",   label: "Customer Rating" },
  { value: "2hrs",   label: "Express Bangkok" },
  { value: "7 วัน",  label: "คืนสินค้า ยินดีคืนเงิน" },
  { value: "100%",   label: "ของแท้จากผู้นำเข้า" },
];

const STATS_EN = [
  { value: "20,000+", label: "Orders Nationwide" },
  { value: "4.9★",   label: "Customer Rating" },
  { value: "2hrs",   label: "Express Bangkok" },
  { value: "7 Days", label: "Easy Returns" },
  { value: "100%",   label: "Authentic Products" },
];

export function TrustBar() {
  const { _lang } = useLang();
  const stats = _lang === "EN" ? STATS_EN : STATS_TH;

  return (
    <div className="bg-[#111]">
      {/* Mobile: scrolling marquee */}
      <div className="md:hidden overflow-hidden py-3">
        <div className="animate-marquee flex w-max">
          {[...stats, ...stats].map((s, i) => (
            <div key={i} className="flex items-center gap-2 px-6 shrink-0">
              <span className="text-sm font-bold text-[#f5c842] leading-none whitespace-nowrap">{s.value}</span>
              <span className="text-xs text-white/60 whitespace-nowrap">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: single row */}
      <div className="hidden md:flex items-center justify-center divide-x divide-white/10">
        {stats.map((s) => (
          <div key={s.value} className="flex items-center gap-3 px-8 py-5">
            <span className="text-2xl font-bold text-[#f5c842] leading-none whitespace-nowrap">
              {s.value}
            </span>
            <span className="text-[15px] text-white/60 leading-tight whitespace-nowrap">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
