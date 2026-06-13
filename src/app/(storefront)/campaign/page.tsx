import Image from "next/image";
import Link from "next/link";

import { CAMPAIGNS } from "@/lib/mock-data";

export default function CampaignIndexPage() {
  const flashSale = CAMPAIGNS.find((c) => c.slug === "flash-sale");
  const others    = CAMPAIGNS.filter((c) => c.slug !== "flash-sale");

  return (
    <div className="bg-white min-h-screen pb-24">
      <div className="max-w-4xl mx-auto px-4 md:px-6 pt-4">
        <div className="flex flex-col gap-8">
          {/* ── Flash Sale Highlight ── */}
          {flashSale && (
            <Link href={`/campaign/${flashSale.slug}`} className="block group active:opacity-80 transition-opacity">
              <div className="relative w-full rounded-[24px] overflow-hidden bg-[var(--km-surface)] shadow-sm aspect-[21/9]">
                <Image src={flashSale.image} alt={flashSale.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 896px) 100vw, 896px" />
              </div>
            </Link>
          )}

          {/* ── All Promotions Section ── */}
          <div>
            <h2 className="text-[16px] font-semibold text-[var(--km-text)] mb-5 px-1">โปรโมชั่นทั้งหมด</h2>
            <div className="flex flex-col gap-6">
              {others.map((c) => (
                <Link key={c.slug} href={`/campaign/${c.slug}`} className="block group active:opacity-80 transition-opacity">
                  <div className="relative w-full rounded-[24px] overflow-hidden bg-[var(--km-surface)] shadow-sm aspect-[21/9]">
                    <Image src={c.image} alt={c.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 896px) 100vw, 896px" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
