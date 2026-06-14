"use client";

import Link from "next/link";
import { useLang } from "@/contexts/lang";

const HOME_CATEGORIES = [
  { label: "ทั้งหมด",         href: "/products" },
  { label: "Privacy Screen",  href: "/products?filmType=privacy" },
  { label: "Paper Like",      href: "/products?filmType=paperlike" },
  { label: "Anti-Blue Light", href: "/products?filmType=antiblue" },
  { label: "Matte",           href: "/products?filmType=matte" },
];

export function CategoryIcons() {
  const { home: t } = useLang();

  return (
    <section className="py-3 bg-white border-b border-[var(--km-border)]">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Mobile scroll */}
        <div className="md:hidden w-full overflow-x-auto no-scrollbar">
          <div className="flex flex-nowrap gap-2 w-max px-0 py-1">
            {HOME_CATEGORIES.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="shrink-0 px-4 py-2 rounded-full bg-[var(--km-surface)] text-[13px] text-[var(--km-text-secondary)] whitespace-nowrap transition-colors active:bg-[#E8E8ED]"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden md:flex flex-wrap justify-center gap-2 py-1">
          {HOME_CATEGORIES.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="px-5 py-2 rounded-full bg-[var(--km-surface)] text-[13px] text-[var(--km-text-secondary)] whitespace-nowrap transition-colors hover:bg-[#E8E8ED] hover:text-[var(--km-text)]"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
