"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { Zap } from "lucide-react";
import { PRODUCTS, FLASH_DEAL_PRODUCTS } from "@/lib/mock-data";
import { ProductCard } from "@/components/product/ProductCard";
import { useParams } from "next/navigation";
import { useUIStore } from "@/stores/ui.store";

// Load admin-managed campaigns from localStorage and merge with defaults
function loadAdminCampaigns(): Record<string, { title: string; description: string; hero: string }> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem("safescreen-campaigns");
    if (!raw) return {};
    const list = JSON.parse(raw) as Array<{
      slug: string; title: string; description: string; hero: string; status: string;
    }>;
    return Object.fromEntries(
      list
        .filter((c) => c.status === "active")
        .map((c) => [c.slug, { title: c.title, description: c.description, hero: c.hero }])
    );
  } catch {
    return {};
  }
}

const DEFAULT_CAMPAIGNS: Record<string, { title: string; description: string; hero: string }> = {
  "flash-sale": {
    title: "Flash Sale",
    description: "ดีลสุดคุ้มที่อัปเดตทุกวัน สินค้าความงามคัดสรรกว่า 200 รายการ ลดสูงสุด 70% มีจำนวนจำกัด — หมดแล้วหมดเลย",
    hero: "/banner_promotions/flashsale_banner.png",
  },
  "buy-1-get-1": {
    title: "ซื้อ 1 แถม 1 (Buy 1 Get 1 Free)",
    description: "โปรโมชั่นแรงที่สุดแห่งปี! สินค้าความงาม 1 แถม 1 เลือกของแถมชิ้นเดียวกันหรือชิ้นพิเศษได้ทันทีเมื่อสั่งซื้อ ของแถมจะคำนวณและหยอดลงตะกร้าโดยอัตโนมัติ",
    hero: "/banner_promotions/1free1.png",
  },
  "free-gift": {
    title: "ช้อปครบ 500 บาท รับของแถมฟรี (Free Gift on ฿500 Spending)",
    description: "คุ้มค่ายิ่งขึ้นกับโปรโมชั่นช้อปครบ 500 บาท รับของแถมสุดพรีเมียม! ซื้อสินค้าในร้านสะสมครบ 500 บาท รับของแถมพิเศษเพิ่มฟรีทันทีในขั้นตอนการชำระเงิน",
    hero: "/banner_promotions/buy500freeitem.png",
  },
  "mid-year-sale": {
    title: "SafeScreen Mid Year Sale ลดสูงสุด 40%",
    description: "โปรโมชั่นฉลองกลางปีสุดคุ้ม! ฟิล์มกันมองแม่เหล็ก MacBook, iPad และ Universal ลดสูงสุดถึง 40% ช้อปจุใจตั้งแต่วันนี้ถึงสิ้นเดือนเท่านั้น",
    hero: "/banner_promotions/ChatGPT Image 20 พ.ค. 2569 15_36_47.png",
  },
  "new-arrivals": {
    title: "New Arrivals ประจำเดือนพฤษภาคม 2026 — สินค้าใหม่มาแรงที่คุณไม่ควรพลาด",
    description: "รวมผลิตภัณฑ์ความงามที่เพิ่งวางจำหน่ายใหม่จากแบรนด์ชั้นนำทั่วโลก อัปเดตทุกต้นเดือน เพื่อให้คุณได้สัมผัสสิ่งใหม่ก่อนใคร",
    hero: "/banner_promotions/image copy.png",
  },
  "ipad-bundle": {
    title: "iPad Bundle Deal — ซื้อ Paper Like + Privacy ราคาพิเศษ",
    description: "รวม 2 ฟิล์มในชุดเดียว Paper Like สำหรับการวาด + Privacy สำหรับปกป้องความเป็นส่วนตัว เหมาะสำหรับ iPad ทุกรุ่น ถอดติดได้ง่าย ไม่ทิ้งคราบ",
    hero: "/banner_promotions/image copy 2.png",
  },
  "brand-day-safescreen": {
    title: "SafeScreen Brand Day ลดพิเศษสูงสุด 40% เฉพาะวันนี้เท่านั้น",
    description: "ฟิล์มกันมองแม่เหล็ก NanoSnap ทุกรุ่น ลดพิเศษ 40% ทั้ง MacBook, iPad และ Universal ถอดติดได้ทันที ไม่ทิ้งคราบ รับประกัน 1 ปี",
    hero: "/banner_promotions/image copy 3.png",
  },
  "work-from-home": {
    title: "Work From Home Bundle — ปกป้องความเป็นส่วนตัวในทุกที่",
    description: "ชุดฟิล์ม Privacy สำหรับคนทำงาน MacBook + Universal Screen ครบครัน ทำงานได้ทุกที่โดยไม่ต้องกังวลคนมองหน้าจอ",
    hero: "/banner_promotions/image copy 4.png",
  },
};
// Alias — used as base; merged with admin overrides at runtime inside the component

const DEAL_END = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
const DEAL_NEXT_START = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

function formatMaskedPrice(price: number) {
  if (price < 100) return `${Math.floor(price / 10)}X`;
  if (price < 1000) return `${Math.floor(price / 100)}X0`;
  return `${Math.floor(price / 1000)},X00`;
}

function UpcomingDealCard({ product: p }: { product: any }) {
  const maskedPrice = formatMaskedPrice(p.price);
  return (
    <div className="relative group flex flex-col gap-3 p-3 bg-white rounded-[24px] border border-[var(--km-border)] hover:border-[var(--km-border-strong)] transition-all w-full">
      <div className="relative aspect-square bg-white rounded-[16px] overflow-hidden">
        <Image src={p.image} alt={p.name} fill sizes="(max-width: 768px) 180px, 220px" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
      </div>
      <div className="flex flex-col gap-1 px-1">
        <p className="text-[13px] font-medium uppercase text-[var(--km-text)] truncate tracking-wider">{p.brand}</p>
        <p className="text-[13px] md:text-[14px] font-normal text-[var(--km-text-secondary)] leading-snug line-clamp-2 min-h-[2.5rem]">{p.name}</p>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-[14px] md:text-[15px] font-medium text-[var(--km-text)]">฿{maskedPrice}</span>
          <span className="text-[13px] text-[var(--km-text-muted)] line-through">฿{p.originalPrice?.toLocaleString() ?? (p.price + 100).toLocaleString()}</span>
          <span className="text-[13px] font-normal text-[var(--km-text-muted)]">-??%</span>
        </div>
      </div>
    </div>
  );
}

function useCountdown(target: Date) {
  const [mounted, setMounted] = useState(false);
  const calc = () => {
    const diff = Math.max(0, target.getTime() - Date.now());
    return {
      days:    Math.floor(diff / 86400000),
      hours:   Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };

  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setMounted(true);
    setTime(calc());
    const t = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { ...time, mounted };
}

import { DealCard, CountChip, Colon } from "@/components/sections/FlashDeal";

export default function CampaignPage() {
  const { slug } = useParams<{ slug: string }>();
  const [activeTab, setActiveTab] = useState<"current" | "next">("current");
  const currentCD = useCountdown(DEAL_END);
  const nextCD = useCountdown(DEAL_NEXT_START);
  const { days, hours, minutes, seconds, mounted } = activeTab === "current" ? currentCD : nextCD;
  const { setHeaderTitleOverride: setHeaderTitle } = useUIStore();

  // Merge DEFAULT_CAMPAIGNS with admin-managed overrides from localStorage
  const CAMPAIGNS = useMemo(
    () => ({ ...DEFAULT_CAMPAIGNS, ...loadAdminCampaigns() }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mounted] // re-evaluate after hydration
  );

  const campaign = CAMPAIGNS[slug] ?? CAMPAIGNS["flash-sale"];
  const isFlashSale = slug === "flash-sale";

  useEffect(() => {
    setHeaderTitle("รายละเอียดโปรโมชั่น");
    return () => {
      setHeaderTitle(null);
    };
  }, [setHeaderTitle]);

  if (!mounted) {
    return (
      <div className="bg-white min-h-screen pb-24">
        <div className="max-w-4xl mx-auto px-4 md:px-6 pt-4">
          <div className="w-full aspect-[21/9] bg-[var(--km-surface)] animate-pulse rounded-[24px]" />
        </div>
      </div>
    );
  }

  const upcomingProducts = PRODUCTS.filter(p => !FLASH_DEAL_PRODUCTS.find(f => f.id === p.id)).slice(0, 6);
  let products = PRODUCTS.slice(0, 15);
  if (slug === "buy-1-get-1" || slug === "free-gift" || slug === "mid-year-sale") {
    products = PRODUCTS.filter(p => p.badge === "hot").slice(0, 15);
  }

  return (
    <div className="bg-white min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-4">
        <div className="relative w-full overflow-hidden rounded-[16px] aspect-[21/9]">
          <Image src={campaign.hero} alt={campaign.title} fill className="object-cover" sizes="(max-width: 1280px) 100vw, 1280px" priority />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="pt-4 pb-4">
          {isFlashSale ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                {(["current", "next"] as const).map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className="px-4 py-1.5 rounded-full text-[13px] font-normal whitespace-nowrap transition-all duration-200"
                    style={activeTab === tab ? { background: "var(--km-text)", color: "#fff", border: "1px solid var(--km-text)" } : { background: "#fff", color: "#78787D", border: "1px solid #e8e8ed" }}
                  >
                    {tab === "current" ? "รอบปัจจุบัน" : "รอบถัดไป"}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-4">
                <div className="flex items-center gap-2 min-w-0">
                  <Zap size={22} className="shrink-0 text-[var(--km-text)] fill-[var(--km-text)]" />
                  <h1 className="text-xl md:text-2xl font-medium text-[var(--km-text)]">Flash Sale</h1>
                </div>
                <div className="flex items-center gap-0.5 shrink-0">
                  <span className="text-[13px] font-normal text-[var(--km-text-secondary)] mr-0.5">{activeTab === "current" ? "จบใน" : "เริ่มใน"}</span>
                  <CountChip label={String(days).padStart(2, "0")} />
                  <Colon />
                  <CountChip label={String(hours).padStart(2, "0")} />
                  <Colon />
                  <CountChip label={String(minutes).padStart(2, "0")} />
                  <Colon />
                  <CountChip label={String(seconds).padStart(2, "0")} />
                </div>
              </div>
              <p className="text-[14px] md:text-[15px] text-[var(--km-text-secondary)] leading-relaxed max-w-3xl">
                {activeTab === "current" ? CAMPAIGNS["flash-sale"].description : "เตรียมตัวให้พร้อม! ดีลรอบถัดไปกำลังจะมาพร้อมสินค้าใหม่และส่วนลดสุดพิเศษ ราคาจะเผยเมื่อรอบเริ่ม"}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <h1 className="text-lg md:text-xl font-medium text-[var(--km-text)]">{campaign.title}</h1>
              {campaign.description && (
                <p className="text-[14px] md:text-[15px] text-[var(--km-text-secondary)] leading-relaxed max-w-3xl">{campaign.description}</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-6">
        {isFlashSale ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {activeTab === "current"
              ? FLASH_DEAL_PRODUCTS.map((p) => <DealCard key={p.id} product={p} />)
              : upcomingProducts.map((p) => <UpcomingDealCard key={p.id} product={p} />)
            }
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {products.map((p) => <ProductCard key={p.id} {...p} />)}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-10 mb-2 flex justify-center">
        <Link href="/campaign" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[var(--km-border)] text-[14px] text-[var(--km-text-secondary)] hover:border-[var(--km-border-strong)] hover:text-[var(--km-text)] transition-all">
          ← ดูโปรโมชั่นทั้งหมด
        </Link>
      </div>
    </div>
  );
}
