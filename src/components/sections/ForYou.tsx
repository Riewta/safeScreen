"use client";

import { useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { getNewArrivals, getCampaignProducts, getRecommended } from "@/lib/mock-data";
import { PillTabs } from "@/components/ui/PillTabs";
import { ViewMoreButton } from "@/components/ui/ViewMoreButton";
import { useLang } from "@/contexts/lang";

export function ForYou() {
  const { home: t } = useLang();

  const TABS = [
    { id: "new",      label: t.tabNew,  getData: getNewArrivals,      href: "/products?tab=new"       },
    { id: "campaign", label: t.tabSale, getData: getCampaignProducts, href: "/products?tab=sale"       },
    { id: "picks",    label: t.tabPicks,getData: getRecommended,      href: "/products?tab=recommend"  },
  ] as const;

  type TabId = typeof TABS[number]["id"];
  const [active, setActive] = useState<TabId>("new");
  const current  = TABS.find((tab) => tab.id === active)!;
  const products = current.getData().slice(0, 10);

  return (
    <section className="pt-4 pb-4 md:pt-6 md:pb-6 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="mb-4">
          <h2 className="text-[18px] font-medium text-[var(--km-text)]">{t.forYou}</h2>
        </div>
        <div className="mb-4">
          <PillTabs
            tabs={TABS.map((tab) => ({ key: tab.id, label: tab.label }))}
            active={active}
            onChange={(key) => setActive(key as TabId)}
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5">
          {products.map((p) => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
        <ViewMoreButton href={current.href} label={t.viewForYou} />
      </div>
    </section>
  );
}
