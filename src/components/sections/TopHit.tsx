"use client";

import { useState } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { PRODUCTS } from "@/lib/mock-data";

const FILM_TABS = [
  { key: "all",      label: "ทั้งหมด" },
  { key: "privacy",  label: "Privacy Screen" },
  { key: "paperlike",label: "Paper Like" },
  { key: "antiblue", label: "Anti-Blue Light" },
  { key: "matte",    label: "Matte" },
];

function getFilmProducts(filmType: string) {
  const all = PRODUCTS.filter((p) => p.price > 0);
  if (filmType === "privacy")
    return all.filter((p) => p.name.toLowerCase().includes("privacy")).slice(0, 5);
  if (filmType === "paperlike")
    return all.filter((p) => p.name.toLowerCase().includes("paper like")).slice(0, 5);
  if (filmType === "antiblue")
    return all.filter((p) => p.name.toLowerCase().includes("anti-blue") || p.name.toLowerCase().includes("anti blue")).slice(0, 5);
  if (filmType === "matte")
    return all.filter((p) => p.name.toLowerCase().includes("matte")).slice(0, 5);
  return all.slice(0, 5);
}

export function TopHit() {
  const [activeTab, setActiveTab] = useState("all");
  const products = getFilmProducts(activeTab);
  const viewAllHref = activeTab === "all" ? "/products" : `/products?filmType=${activeTab}`;

  return (
    <section className="pt-5 pb-6 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Header row */}
        <div className="mb-4">
          <h2 className="text-[18px] font-medium text-[var(--km-text)]">เนื้อฟิล์ม</h2>
        </div>

        {/* Film type tabs */}
        <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          {FILM_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="shrink-0 px-4 py-1.5 rounded-full text-[13px] font-normal whitespace-nowrap transition-all duration-200"
              style={
                activeTab === tab.key
                  ? { background: "var(--km-text)", color: "#fff", border: "1px solid var(--km-text)" }
                  : { background: "#fff", color: "#78787D", border: "1px solid #e8e8ed" }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Products grid — 5 columns on desktop */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-5">
            {products.map((p) => (
              <ProductCard key={p.id} {...p} rank={undefined} badge={p.badge} />
            ))}
          </div>
        ) : (
          <p className="text-[14px] text-[var(--km-text-muted)] py-8 text-center">
            ยังไม่มีสินค้าประเภทนี้
          </p>
        )}

        <div className="mt-6 flex justify-center">
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[var(--km-border)] text-[14px] text-[var(--km-text-secondary)] hover:border-[var(--km-border-strong)] hover:text-[var(--km-text)] transition-all"
          >
            ดูทั้งหมด
          </Link>
        </div>

      </div>
    </section>
  );
}
