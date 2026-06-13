"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { BottomSheet } from "./BottomSheet";

const ITEM_H = 44;

const THAI_MONTHS = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม",
  "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน",
  "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
];

function daysInMonth(month: number, year: number) {
  return new Date(year, month, 0).getDate();
}

interface WheelColProps {
  items: { value: number; label: string }[];
  selected: number;
  onChange: (v: number) => void;
}

function WheelCol({ items, selected, onChange }: WheelColProps) {
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [activeIdx, setActiveIdx] = useState(() => Math.max(0, items.findIndex((i) => i.value === selected)));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const idx = Math.max(0, items.findIndex((i) => i.value === selected));
    el.scrollTop = idx * ITEM_H;
    setActiveIdx(idx);
  }, []); // mount only

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const idx = items.findIndex((i) => i.value === selected);
    const target = idx < 0 ? items.length - 1 : idx;
    el.scrollTo({ top: target * ITEM_H, behavior: "smooth" });
    setActiveIdx(target);
  }, [items]);

  const handleScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const current = Math.round(el.scrollTop / ITEM_H);
    setActiveIdx(Math.max(0, Math.min(current, items.length - 1)));
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const idx = Math.round(el.scrollTop / ITEM_H);
      const clamped = Math.max(0, Math.min(idx, items.length - 1));
      el.scrollTo({ top: clamped * ITEM_H, behavior: "smooth" });
      setActiveIdx(clamped);
      onChange(items[clamped]?.value ?? items[0].value);
    }, 80);
  }, [items, onChange]);

  const getFontStyle = (i: number) => {
    const dist = Math.abs(i - activeIdx);
    if (dist === 0) return { fontSize: "17px", fontWeight: 500, opacity: 1 };
    if (dist === 1) return { fontSize: "14px", fontWeight: 400, opacity: 0.45 };
    return { fontSize: "13px", fontWeight: 400, opacity: 0.2 };
  };

  return (
    <div className="relative flex-1 overflow-hidden">
      {/* fades */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[88px] bg-gradient-to-b from-white to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[88px] bg-gradient-to-t from-white to-transparent" />
      {/* highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-[88px] z-10 h-[44px] border-t border-b border-[var(--km-border)]" />

      <div
        ref={ref}
        onScroll={handleScroll}
        className="h-[220px] overflow-y-auto scrollbar-hide"
        style={{ scrollSnapType: "y mandatory", paddingTop: 88, paddingBottom: 88 }}
      >
        {items.map((item, i) => (
          <div
            key={item.value}
            style={{ scrollSnapAlign: "center", height: ITEM_H, ...getFontStyle(i), transition: "font-size 0.15s, opacity 0.15s" }}
            className="flex items-center justify-center text-[var(--km-text)] select-none"
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}

interface DatePickerSheetProps {
  isOpen: boolean;
  onClose: () => void;
  value: string; // YYYY-MM-DD (CE)
  onChange: (v: string) => void;
}

export function DatePickerSheet({ isOpen, onClose, value, onChange }: DatePickerSheetProps) {
  const parse = (v: string) => {
    const parts = v?.split("-").map(Number);
    return { y: parts?.[0] || 1995, m: parts?.[1] || 1, d: parts?.[2] || 1 };
  };

  const initial = parse(value);
  const [year, setYear] = useState(initial.y);
  const [month, setMonth] = useState(initial.m);
  const [day, setDay] = useState(initial.d);

  useEffect(() => {
    if (isOpen) {
      const p = parse(value);
      setYear(p.y); setMonth(p.m); setDay(p.d);
    }
  }, [isOpen]);

  // clamp day when month/year changes
  useEffect(() => {
    const max = daysInMonth(month, year);
    if (day > max) setDay(max);
  }, [month, year]);

  const maxDay = daysInMonth(month, year);
  const days = Array.from({ length: maxDay }, (_, i) => ({ value: i + 1, label: String(i + 1) }));
  const months = THAI_MONTHS.map((label, i) => ({ value: i + 1, label }));
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1939 }, (_, i) => {
    const ce = currentYear - i;
    return { value: ce, label: String(ce) };
  });

  const handleConfirm = () => {
    const safeDay = Math.min(day, maxDay);
    onChange(`${year}-${String(month).padStart(2, "0")}-${String(safeDay).padStart(2, "0")}`);
    onClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="วันเกิด"
      footer={
        <button
          onClick={handleConfirm}
          className="w-full h-12 rounded-full bg-[var(--km-text)] text-white text-[15px] font-medium"
        >
          ยืนยัน
        </button>
      }
    >
      <div className="px-2 py-2">
        {/* column labels */}
        <div className="flex text-[11px] text-[var(--km-text-muted)] text-center mb-1">
          <div className="flex-1">วัน</div>
          <div className="flex-1">เดือน</div>
          <div className="flex-1">ปี (ค.ศ.)</div>
        </div>
        <div className="flex gap-1">
          <WheelCol items={days} selected={day} onChange={setDay} />
          <WheelCol items={months} selected={month} onChange={setMonth} />
          <WheelCol items={years} selected={year} onChange={setYear} />
        </div>
      </div>
    </BottomSheet>
  );
}
