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
    <div className="bg-[#111] overflow-x-auto scrollbar-none">
      <div className="flex items-center min-w-max md:min-w-0 md:justify-center divide-x divide-white/10 px-4 md:px-0">
        {stats.map((s) => (
          <div key={s.value} className="flex items-center gap-3 px-8 py-5 shrink-0">
            <span className="text-xl md:text-2xl font-bold text-[#f5c842] leading-none whitespace-nowrap">
              {s.value}
            </span>
            <span className="text-sm md:text-[15px] text-white/60 leading-tight whitespace-nowrap">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
