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
      {/* Mobile: 2-col grid */}
      <div className="grid grid-cols-2 md:hidden divide-y divide-white/10">
        {stats.map((s, i) => (
          <div
            key={s.value}
            className={`flex items-center gap-2.5 px-5 py-4 ${
              i % 2 === 0 ? "border-r border-white/10" : ""
            } ${i >= stats.length - (stats.length % 2 === 0 ? 2 : 1) ? "" : ""}`}
          >
            <span className="text-sm font-bold text-[#f5c842] leading-none whitespace-nowrap">
              {s.value}
            </span>
            <span className="text-[11px] text-white/60 leading-tight">
              {s.label}
            </span>
          </div>
        ))}
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
