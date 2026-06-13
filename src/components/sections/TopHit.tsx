"use client";

import { useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { getTopHitTH, getTopHitGlobal } from "@/lib/mock-data";
import { PillTabs } from "@/components/ui/PillTabs";
import { ViewMoreButton } from "@/components/ui/ViewMoreButton";
import { useLang } from "@/contexts/lang";

export function TopHit() {
  const { home: t } = useLang();
  const [active, setActive] = useState<"th" | "global">("th");

  const TABS = [
    { key: "th",     label: "MacBook",   getData: getTopHitTH     },
    { key: "global", label: "Universal", getData: getTopHitGlobal },
  ] as const;

  const products = TABS.find((tab) => tab.key === active)!.getData();

  return (
    <section className="pt-4 pb-4 md:pt-4 md:pb-6 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="mb-4">
          <h2 className="text-[18px] font-medium text-[var(--km-text)]">{t.topHit}</h2>
        </div>
        <div className="mb-3">
          <PillTabs
            tabs={TABS.map((tab) => ({ key: tab.key, label: tab.label }))}
            active={active}
            onChange={(key) => setActive(key as "th" | "global")}
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5 mt-2">
          {products.map((p) => (
            <ProductCard key={p.id} {...p} rank={undefined} badge="hot" />
          ))}
        </div>
        <ViewMoreButton href={active === "th" ? "/products?tab=macbook" : "/products?tab=universal"} label={t.viewTopHit} />
      </div>
    </section>
  );
}
