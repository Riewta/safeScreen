"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface PillTab {
  key: string;
  label: string;
  href?: string;
}

interface PillTabsProps {
  tabs: PillTab[];
  active: string;
  onChange?: (key: string) => void;
  scrollable?: boolean;
  activeColor?: string;
  replace?: boolean;
}

const inactiveStyle = { background: "#FFFFFF", color: "#78787D", border: "1px solid #e8e8ed" };
const BASE_CLS = "px-4 py-1.5 rounded-full text-[13px] font-normal whitespace-nowrap transition-all duration-200 flex-shrink-0";

export function PillTabs({ tabs, active, onChange, scrollable, activeColor, replace: useReplace }: PillTabsProps) {
  const router = useRouter();
  return (
    <div className={`flex items-center gap-2${scrollable ? " overflow-x-auto scrollbar-hide -mx-4 px-4" : ""}`}>
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        const activeStyle = {
          background: activeColor || "var(--km-text)",
          color: "#fff",
          border: `1px solid ${activeColor || "var(--km-text)"}`
        };
        const style = isActive ? activeStyle : inactiveStyle;

        if (tab.href) {
          if (useReplace) {
            return (
              <button key={tab.key} onClick={() => router.replace(tab.href!)} className={BASE_CLS} style={style}>
                {tab.label}
              </button>
            );
          }
          return (
            <Link key={tab.key} href={tab.href} className={BASE_CLS} style={style}>
              {tab.label}
            </Link>
          );
        }

        return (
          <button key={tab.key} onClick={() => onChange?.(tab.key)} className={BASE_CLS} style={style}>
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
