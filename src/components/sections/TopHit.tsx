"use client";

import { ProductCard } from "@/components/product/ProductCard";
import { getTopHitTH } from "@/lib/mock-data";
import { useLang } from "@/contexts/lang";

export function TopHit() {
  const { home: t } = useLang();
  const products = getTopHitTH().slice(0, 4);

  return (
    <section className="pt-4 pb-4 md:pt-4 md:pb-6 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="mb-4">
          <h2 className="text-[18px] font-medium text-[var(--km-text)]">{t.topHit}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {products.map((p) => (
            <ProductCard key={p.id} {...p} rank={undefined} badge="hot" />
          ))}
        </div>
      </div>
    </section>
  );
}
