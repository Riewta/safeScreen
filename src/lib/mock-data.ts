import type { ProductCardProps } from "@/components/product/ProductCard";

/* ─────────────────────────────────────────
   PRODUCTS
   ───────────────────────────────────────── */

export const PRODUCTS: ProductCardProps[] = [
  // ── MacBook Air ─────────────────────────────────────────────────────────
  {
    id: "1",
    name: 'NanoSnap Privacy Screen — MacBook Air 13.3" (M1/Retina)',
    brand: "SafeScreen",
    price: 1290,
    originalPrice: 1590,
    image: "/products/privacy-macbook/privacy-macbook-air-13-3.jpg",
    category: "macbook",
    rating: 4.9,
    reviewCount: 1842,
  },
  {
    id: "2",
    name: 'NanoSnap Privacy Screen — MacBook Air 13.6" (M2/M3/M4)',
    brand: "SafeScreen",
    price: 1390,
    originalPrice: 1690,
    image: "/products/privacy-macbook/privacy-macbook-air-13-6.jpg",
    category: "macbook",
    rating: 4.9,
    reviewCount: 2103,
    badge: "hot",
  },
  {
    id: "3",
    name: 'NanoSnap Privacy Screen — MacBook Air 15" (M2/M3/M4/M5)',
    brand: "SafeScreen",
    price: 1490,
    originalPrice: 1790,
    image: "/products/privacy-macbook/privacy-macbook-air-15.jpg",
    category: "macbook",
    rating: 4.8,
    reviewCount: 876,
  },

  // ── MacBook Pro ──────────────────────────────────────────────────────────
  {
    id: "4",
    name: 'NanoSnap Privacy Screen — MacBook Pro 13.3" (2019–2022)',
    brand: "SafeScreen",
    price: 1290,
    originalPrice: 1590,
    image: "/products/privacy-macbook/privacy-macbook-pro-13-3.jpg",
    category: "macbook",
    rating: 4.8,
    reviewCount: 654,
  },
  {
    id: "5",
    name: 'NanoSnap Privacy Screen — MacBook Pro 14" (M2/M3/M4/M5)',
    brand: "SafeScreen",
    price: 1490,
    originalPrice: 1890,
    image: "/products/privacy-macbook/privacy-macbook-pro-14.jpg",
    category: "macbook",
    rating: 4.9,
    reviewCount: 987,
    badge: "hot",
  },
  {
    id: "6",
    name: 'NanoSnap Privacy Screen — MacBook Pro 16" (M2/M3/M4/M5)',
    brand: "SafeScreen",
    price: 1590,
    originalPrice: 1990,
    image: "/products/privacy-macbook/privacy-macbook-pro-16.jpg",
    category: "macbook",
    rating: 4.8,
    reviewCount: 521,
  },

  // ── Universal Laptop — 13–14" ────────────────────────────────────────────
  {
    id: "7",
    name: 'NanoSnap Privacy Screen — Universal 13.3" (16:9)',
    brand: "SafeScreen",
    price: 990,
    originalPrice: 1290,
    image: "/products/privacy-universal/privacy-universal-13-3.jpg",
    category: "universal",
    rating: 4.7,
    reviewCount: 3201,
  },
  {
    id: "8",
    name: 'NanoSnap Privacy Screen — Universal 14" (16:9)',
    brand: "SafeScreen",
    price: 1090,
    originalPrice: 1390,
    image: "/products/privacy-universal/privacy-universal-14.jpg",
    category: "universal",
    rating: 4.7,
    reviewCount: 1543,
    badge: "hot",
  },
  {
    id: "9",
    name: 'NanoSnap Privacy Screen — Universal 14.5" (16:10)',
    brand: "SafeScreen",
    price: 1090,
    originalPrice: 1390,
    image: "/products/privacy-universal/privacy-universal-14-5.jpg",
    category: "universal",
    rating: 4.7,
    reviewCount: 432,
  },

  // ── Universal Laptop — 15–17" ────────────────────────────────────────────
  {
    id: "10",
    name: 'NanoSnap Privacy Screen — Universal 15.3" (16:10)',
    brand: "SafeScreen",
    price: 1190,
    originalPrice: 1490,
    image: "/products/privacy-universal/privacy-universal-15-6.jpg",
    category: "universal",
    rating: 4.7,
    reviewCount: 789,
  },
  {
    id: "11",
    name: 'NanoSnap Privacy Screen — Universal 15.6" (16:9)',
    brand: "SafeScreen",
    price: 1090,
    originalPrice: 1390,
    image: "/products/privacy-universal/privacy-universal-15-6.jpg",
    category: "universal",
    rating: 4.7,
    reviewCount: 2109,
    badge: "hot",
  },
  {
    id: "12",
    name: 'NanoSnap Privacy Screen — Universal 16" (16:10)',
    brand: "SafeScreen",
    price: 1190,
    originalPrice: 1490,
    image: "/products/privacy-universal/privacy-universal-16.jpg",
    category: "universal",
    rating: 4.8,
    reviewCount: 598,
  },
  {
    id: "13",
    name: 'NanoSnap Privacy Screen — Universal 16.1" (16:9)',
    brand: "SafeScreen",
    price: 1190,
    originalPrice: 1490,
    image: "/products/privacy-universal/privacy-universal-16.jpg",
    category: "universal",
    rating: 4.7,
    reviewCount: 340,
  },
  {
    id: "14",
    name: 'NanoSnap Privacy Screen — Universal 17.3" (16:9)',
    brand: "SafeScreen",
    price: 1290,
    originalPrice: 1590,
    image: "/products/privacy-universal/privacy-universal-17-3.jpg",
    category: "universal",
    rating: 4.6,
    reviewCount: 218,
  },

  // ── iPad — Magnetic Paper Like ───────────────────────────────────────────
  {
    id: "ipad-pl-air45",
    name: "Magnetic Paper Like — iPad Air (Gen 4/5, 10.9\")",
    brand: "SafeScreen",
    price: 1190,
    originalPrice: 1490,
    image: "/products/ipad/paperlike-ipad-air-45.jpg",
    category: "ipad",
    rating: 4.9,
    reviewCount: 521,
  },
  {
    id: "ipad-pl-air-m2m3",
    name: "Magnetic Paper Like — iPad Air 11\" (M2/M3)",
    brand: "SafeScreen",
    price: 1290,
    originalPrice: 1590,
    image: "/products/ipad/paperlike-ipad-air-m2m3.jpg",
    category: "ipad",
    rating: 4.9,
    reviewCount: 743,
    badge: "hot",
  },
  {
    id: "ipad-pl-pro11",
    name: "Magnetic Paper Like — iPad Pro 11\" (All Gen)",
    brand: "SafeScreen",
    price: 1290,
    originalPrice: 1590,
    image: "/products/ipad/paperlike-ipad-pro-11.jpg",
    category: "ipad",
    rating: 4.9,
    reviewCount: 412,
  },
  {
    id: "ipad-pl-pro129",
    name: "Magnetic Paper Like — iPad Pro 12.9\" (All Gen)",
    brand: "SafeScreen",
    price: 1490,
    originalPrice: 1790,
    image: "/products/ipad/paperlike-ipad-pro-12-9.jpg",
    category: "ipad",
    rating: 4.9,
    reviewCount: 389,
  },
  {
    id: "ipad-pl-pro-m4m5",
    name: "Magnetic Paper Like — iPad Pro 13\" (M4/M5)",
    brand: "SafeScreen",
    price: 1590,
    originalPrice: 1890,
    image: "/products/ipad/paperlike-ipad-pro-m4m5.jpg",
    category: "ipad",
    rating: 4.9,
    reviewCount: 512,
  },

  // ── iPad — Magnetic Privacy Film ─────────────────────────────────────────
  {
    id: "ipad-pv-air45",
    name: "Magnetic Privacy Film — iPad Air (Gen 4/5, 10.9\")",
    brand: "SafeScreen",
    price: 990,
    originalPrice: 1290,
    image: "/products/ipad/privacy-ipad-air-45.jpg",
    category: "ipad",
    rating: 4.8,
    reviewCount: 876,
    badge: "hot",
  },
  {
    id: "ipad-pv-air-m2m3",
    name: "Magnetic Privacy Screen — iPad Air 11\" (M2/M3)",
    brand: "SafeScreen",
    price: 1090,
    originalPrice: 1390,
    image: "/products/ipad/privacy-ipad-air-m2m3.jpg",
    category: "ipad",
    rating: 4.8,
    reviewCount: 1102,
    badge: "hot",
  },
  {
    id: "ipad-pv-pro11",
    name: "Magnetic Privacy Film — iPad Pro 11\" (All Gen)",
    brand: "SafeScreen",
    price: 1090,
    originalPrice: 1390,
    image: "/products/ipad/privacy-ipad-pro-11.jpg",
    category: "ipad",
    rating: 4.8,
    reviewCount: 891,
  },
  {
    id: "ipad-pv-pro129",
    name: "Magnetic Privacy Film — iPad Pro 12.9\" (All Gen)",
    brand: "SafeScreen",
    price: 1290,
    originalPrice: 1590,
    image: "/products/ipad/privacy-ipad-pro-12-9.jpg",
    category: "ipad",
    rating: 4.8,
    reviewCount: 567,
  },
  {
    id: "ipad-pv-pro-m4m5",
    name: "Magnetic Privacy Screen — iPad Pro 13\" (M4/M5)",
    brand: "SafeScreen",
    price: 1390,
    originalPrice: 1690,
    image: "/products/ipad/privacy-ipad-pro-m4m5.jpg",
    category: "ipad",
    rating: 4.8,
    reviewCount: 634,
  },

  // ── Monitor — Privacy Screen ──────────────────────────────────────────────
  {
    id: "mon-18",
    name: "Privacy Screen for Monitor 18.5\" (16:9)",
    brand: "SafeScreen",
    price: 890,
    originalPrice: 1190,
    image: "/products/monitor/privacy-monitor-small.jpg",
    category: "monitor",
    rating: 4.7,
    reviewCount: 312,
  },
  {
    id: "mon-22",
    name: "Privacy Screen for Monitor 22\" (16:10)",
    brand: "SafeScreen",
    price: 990,
    originalPrice: 1290,
    image: "/products/monitor/privacy-monitor-large.jpg",
    category: "monitor",
    rating: 4.7,
    reviewCount: 489,
    badge: "hot",
  },
  {
    id: "mon-24",
    name: "Magnetic Privacy Screen — iMac 24\"",
    brand: "SafeScreen",
    price: 1490,
    originalPrice: 1890,
    image: "/products/monitor/privacy-imac.jpg",
    category: "monitor",
    rating: 4.9,
    reviewCount: 278,
    badge: "hot",
  },
  {
    id: "mon-28",
    name: "Privacy Screen for Monitor 28\" (16:9)",
    brand: "SafeScreen",
    price: 1290,
    originalPrice: 1590,
    image: "/products/monitor/privacy-monitor-xl.jpg",
    category: "monitor",
    rating: 4.7,
    reviewCount: 196,
  },

  // ── MacBook — Anti-Blue Light ────────────────────────────────────────────
  {
    id: "ab-mac-13-3",
    name: 'Anti-Blue Light Screen — MacBook Air 13.3" (M1/Retina)',
    brand: "SafeScreen",
    price: 1190,
    originalPrice: 1490,
    image: "/products/anti-blue-macbook/anti-blue-macbook-air-13-3.jpg",
    category: "macbook",
    rating: 4.8,
    reviewCount: 743,
  },
  {
    id: "ab-mac-13-6",
    name: 'Anti-Blue Light Screen — MacBook Air 13.6" (M2/M3/M4)',
    brand: "SafeScreen",
    price: 1290,
    originalPrice: 1590,
    image: "/products/anti-blue-macbook/anti-blue-macbook-air-13-6.jpg",
    category: "macbook",
    rating: 4.8,
    reviewCount: 1021,
    badge: "hot",
  },
  {
    id: "ab-mac-air-15",
    name: 'Anti-Blue Light Screen — MacBook Air 15" (M2/M3/M4/M5)',
    brand: "SafeScreen",
    price: 1390,
    originalPrice: 1690,
    image: "/products/anti-blue-macbook/anti-blue-macbook-air-15.jpg",
    category: "macbook",
    rating: 4.8,
    reviewCount: 612,
  },
  {
    id: "ab-mac-pro-13-3",
    name: 'Anti-Blue Light Screen — MacBook Pro 13.3" (2019–2022)',
    brand: "SafeScreen",
    price: 1190,
    originalPrice: 1490,
    image: "/products/anti-blue-macbook/anti-blue-macbook-pro-13-3.jpg",
    category: "macbook",
    rating: 4.7,
    reviewCount: 445,
  },
  {
    id: "ab-mac-pro-14",
    name: 'Anti-Blue Light Screen — MacBook Pro 14" (M2/M3/M4/M5)',
    brand: "SafeScreen",
    price: 1390,
    originalPrice: 1690,
    image: "/products/anti-blue-macbook/anti-blue-macbook-pro-14.jpg",
    category: "macbook",
    rating: 4.8,
    reviewCount: 876,
    badge: "hot",
  },
  {
    id: "ab-mac-pro-16",
    name: 'Anti-Blue Light Screen — MacBook Pro 16" (M2/M3/M4/M5)',
    brand: "SafeScreen",
    price: 1490,
    originalPrice: 1790,
    image: "/products/anti-blue-macbook/anti-blue-macbook-pro-16.jpg",
    category: "macbook",
    rating: 4.8,
    reviewCount: 531,
  },

  // ── Universal — Anti-Blue Light ───────────────────────────────────────────
  {
    id: "ab-uni-13-3",
    name: 'Anti-Blue Light Screen — Universal 13.3" (16:9)',
    brand: "SafeScreen",
    price: 890,
    originalPrice: 1190,
    image: "/products/anti-blue-universal/anti-blue-universal-13-3.jpg",
    category: "universal",
    rating: 4.7,
    reviewCount: 632,
  },
  {
    id: "ab-uni-14",
    name: 'Anti-Blue Light Screen — Universal 14" (16:9)',
    brand: "SafeScreen",
    price: 990,
    originalPrice: 1290,
    image: "/products/anti-blue-universal/anti-blue-universal-14.jpg",
    category: "universal",
    rating: 4.7,
    reviewCount: 891,
    badge: "hot",
  },
  {
    id: "ab-uni-15-6",
    name: 'Anti-Blue Light Screen — Universal 15.6" (16:9)',
    brand: "SafeScreen",
    price: 990,
    originalPrice: 1290,
    image: "/products/anti-blue-universal/anti-blue-universal-15-6.jpg",
    category: "universal",
    rating: 4.7,
    reviewCount: 754,
  },

  /* ── Flash Deal Exclusives ── */
  {
    id: "f1",
    name: 'NanoSnap Privacy Screen — MacBook Air 13.6" (M2/M3/M4)',
    brand: "SafeScreen",
    price: 990,
    originalPrice: 1390,
    image: "/products/privacy-macbook/privacy-macbook-air-13-6.jpg",
    category: "macbook",
    rating: 4.9,
    reviewCount: 2103,
    badge: "hot",
  },
  {
    id: "f2",
    name: 'NanoSnap Privacy Screen — MacBook Pro 14" (M4/M5)',
    brand: "SafeScreen",
    price: 1190,
    originalPrice: 1890,
    image: "/products/privacy-macbook/privacy-macbook-pro-14.jpg",
    category: "macbook",
    rating: 4.9,
    reviewCount: 987,
    badge: "hot",
  },
  {
    id: "f3",
    name: 'NanoSnap Privacy Screen — Universal 15.6" (16:9)',
    brand: "SafeScreen",
    price: 790,
    originalPrice: 1090,
    image: "/products/privacy-universal/privacy-universal-15-6.jpg",
    category: "universal",
    rating: 4.7,
    reviewCount: 2109,
    badge: "hot",
  },
  {
    id: "f4",
    name: 'NanoSnap Privacy Screen — MacBook Pro 16" (M4/M5)',
    brand: "SafeScreen",
    price: 1190,
    originalPrice: 1990,
    image: "/products/privacy-macbook/privacy-macbook-pro-16.jpg",
    category: "macbook",
    rating: 4.8,
    reviewCount: 521,
    badge: "hot",
  },
  {
    id: "f5",
    name: 'NanoSnap Privacy Screen — Universal 14" (16:9)',
    brand: "SafeScreen",
    price: 790,
    originalPrice: 1090,
    image: "/products/privacy-universal/privacy-universal-14.jpg",
    category: "universal",
    rating: 4.7,
    reviewCount: 1543,
    badge: "hot",
  },
  {
    id: "f6",
    name: 'NanoSnap Privacy Screen — MacBook Air 15" (M3/M4)',
    brand: "SafeScreen",
    price: 1090,
    originalPrice: 1490,
    image: "/products/privacy-macbook/privacy-macbook-air-15.jpg",
    category: "macbook",
    rating: 4.8,
    reviewCount: 876,
    badge: "hot",
  },
];

/* ─── Selectors ─── */
export const getVisibleProducts = () => PRODUCTS.filter(p => p.price > 0);

export const getProductsByIds    = (ids: string[]) => getVisibleProducts().filter((p) => ids.includes(p.id));
// Top Hit — MacBook + Universal best sellers
export const getTopHitTH         = () => getVisibleProducts().filter((p) => ["2","5","1","3","7","8","11","6"].includes(p.id)).map((p, i) => ({ ...p, rank: i + 1 }));
export const getTopHitGlobal     = () => getVisibleProducts().filter((p) => ["2","5","8","11","ipad-pv-air11","mon-24","1","6"].includes(p.id)).map((p, i) => ({ ...p, rank: i + 1 }));
// New Arrivals — iPad + Monitor + bigger Universal
export const getNewArrivals      = () => getVisibleProducts().filter((p) => ["ipad-pl-air13","ipad-pl-pro13","mon-24","mon-28","9","12"].includes(p.id));
export const getCampaignProducts = () => getVisibleProducts().filter((p) => ["1","2","3","4","5","6"].includes(p.id));
export const getRecommended      = () => getVisibleProducts();

/* ─────────────────────────────────────────
   FLASH DEAL PRODUCTS
   ───────────────────────────────────────── */

export interface FlashDealProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  image: string;
  sold: number;
  total: number;
  endsAt: string; // ISO date string
  rating?: number;
  reviewCount?: number;
  badge?: "hot";
}

export const FLASH_DEAL_PRODUCTS: FlashDealProduct[] = [
  { id: "f1", name: 'NanoSnap Privacy Screen — MacBook Air 13.6" (M2/M3/M4)', brand: "SafeScreen", price: 990,  originalPrice: 1390, image: "/products/privacy-macbook/privacy-macbook-air-13-6.jpg",   sold: 340, total: 500, endsAt: "2026-06-30T23:59:00+07:00", rating: 4.9, reviewCount: 2103, badge: "hot" },
  { id: "f2", name: 'NanoSnap Privacy Screen — MacBook Pro 14" (M4/M5)',       brand: "SafeScreen", price: 1190, originalPrice: 1890, image: "/products/privacy-macbook/privacy-macbook-pro-14.jpg",        sold: 210, total: 400, endsAt: "2026-06-30T23:59:00+07:00", rating: 4.9, reviewCount: 987,  badge: "hot" },
  { id: "f3", name: 'NanoSnap Privacy Screen — Universal 15.6" (16:9)',        brand: "SafeScreen", price: 790,  originalPrice: 1090, image: "/products/privacy-universal/privacy-universal-15-6.jpg",      sold: 280, total: 500, endsAt: "2026-06-30T23:59:00+07:00", rating: 4.7, reviewCount: 2109, badge: "hot" },
  { id: "f4", name: 'NanoSnap Privacy Screen — MacBook Pro 16" (M4/M5)',       brand: "SafeScreen", price: 1190, originalPrice: 1990, image: "/products/privacy-macbook/privacy-macbook-pro-16.jpg",        sold: 128, total: 300, endsAt: "2026-06-30T23:59:00+07:00", rating: 4.8, reviewCount: 521,  badge: "hot" },
  { id: "f5", name: 'NanoSnap Privacy Screen — Universal 14" (16:9)',          brand: "SafeScreen", price: 790,  originalPrice: 1090, image: "/products/privacy-universal/privacy-universal-14.jpg",        sold: 176, total: 350, endsAt: "2026-06-30T23:59:00+07:00", rating: 4.7, reviewCount: 1543, badge: "hot" },
  { id: "f6", name: 'NanoSnap Privacy Screen — MacBook Air 15" (M3/M4)',       brand: "SafeScreen", price: 1090, originalPrice: 1490, image: "/products/privacy-macbook/privacy-macbook-air-15.jpg",        sold: 290, total: 450, endsAt: "2026-06-30T23:59:00+07:00", rating: 4.8, reviewCount: 876,  badge: "hot" },
];

/* ─────────────────────────────────────────
   BRANDS
   ───────────────────────────────────────── */

export interface BrandItem {
  name: string;
  logo?: string;
  href: string;
}

export const BRANDS: BrandItem[] = [
  { name: "ทั้งหมด",    logo: "",  href: "/products"                    },
  { name: "MacBook",   logo: "",  href: "/products?category=macbook"   },
  { name: "Universal", logo: "",  href: "/products?category=universal" },
  { name: "iPad",      logo: "",  href: "/products?category=ipad"      },
  { name: "Monitor",   logo: "",  href: "/products?category=monitor"   },
];

/* ─────────────────────────────────────────
   PROMOTIONS
   ───────────────────────────────────────── */

export interface PromoProduct {
  id: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  originalPrice?: number;
  badge?: "hot";
}

export interface PromoItem {
  image: string;
  video?: string;
  title: string;
  description: string;
  badge?: string;
  endDate?: string;
  products: PromoProduct[];
  href: string;
}

export const FEATURED_PROMO: PromoItem = {
  image: "/products/privacy-macbook/privacy-macbook-air-13-6.jpg",
  title: "NanoSnap Bundle — ซื้อ 2 ชิ้นลด 15%",
  description: "ฟิล์มกึ่งถาวร NanoSnap ติดครั้งเดียวอยู่นาน ไม่ต้องถอดเข้าถอดออกบ่อย เหมาะสำหรับการทำงานในออฟฟิศและ Work From Home ที่ต้องการความเป็นส่วนตัวตลอดเวลา",
  badge: "ลด 15%",
  endDate: "30 มิ.ย. 2026",
  href: "/campaign/macbook-bundle",
  products: [
    { id: "1",  name: 'NanoSnap Privacy Screen — MacBook Air 13.3"', brand: "SafeScreen", image: "/products/privacy-macbook/privacy-macbook-air-13-3.jpg", price: 1290, originalPrice: 1590             },
    { id: "2",  name: 'NanoSnap Privacy Screen — MacBook Air 13.6"', brand: "SafeScreen", image: "/products/privacy-macbook/privacy-macbook-air-13-6.jpg", price: 1390, originalPrice: 1690, badge: "hot" },
    { id: "5",  name: 'NanoSnap Privacy Screen — MacBook Pro 14"',   brand: "SafeScreen", image: "/products/privacy-macbook/privacy-macbook-pro-14.jpg",   price: 1490, originalPrice: 1890             },
    { id: "6",  name: 'NanoSnap Privacy Screen — MacBook Pro 16"',   brand: "SafeScreen", image: "/products/privacy-macbook/privacy-macbook-pro-16.jpg",   price: 1590, originalPrice: 1990             },
    { id: "7",  name: 'NanoSnap Privacy Screen — Universal 13.3"',   brand: "SafeScreen", image: "/products/privacy-universal/privacy-universal-13-3.jpg", price: 990,  originalPrice: 1290             },
    { id: "11", name: 'NanoSnap Privacy Screen — Universal 15.6"',   brand: "SafeScreen", image: "/products/privacy-universal/privacy-universal-15-6.jpg", price: 1090, originalPrice: 1390             },
  ],
};

/* ─────────────────────────────────────────
   CATEGORIES
   ───────────────────────────────────────── */

export interface CategoryItem {
  label: string;
  icon: string;   // lucide icon name — resolved in component
  href: string;
}

export const CATEGORIES: CategoryItem[] = [
  { label: "ทั้งหมด",         icon: "Gem",         href: "/products"                        },
  { label: "MacBook",        icon: "ShieldCheck", href: "/products?category=macbook"        },
  { label: "Universal",      icon: "Eye",         href: "/products?category=universal"      },
  { label: "iPad",           icon: "Sparkles",    href: "/products?category=ipad"           },
  { label: "Monitor",        icon: "Sun",         href: "/products?category=monitor"        },
];

/* ─────────────────────────────────────────
   CAMPAIGNS
   ───────────────────────────────────────── */

export const CAMPAIGNS = [
  {
    slug: "flash-sale",
    title: "Flash Sale — ฟิล์มลด 40% จำกัดเวลา",
    image: "/banner_promotions/flashsale_banner.png",
  },
  {
    slug: "macbook-bundle",
    title: "MacBook Bundle — ซื้อคู่ประหยัดกว่า",
    image: "/banner_promotions/1free1.png",
  },
  {
    slug: "corporate",
    title: "สั่งซื้อองค์กร — ขอ Quotation ได้เลย",
    image: "/banner_promotions/buy500freeitem.png",
  },
  {
    slug: "express",
    title: "Express ส่งด่วนภายใน 2 ชม.",
    image: "/banner_promotions/image copy.png",
  },
  {
    slug: "new-arrivals",
    title: "New Arrivals — ฟิล์ม Nano รุ่นใหม่",
    image: "/banner_promotions/image copy 2.png",
  },
];

/* ─────────────────────────────────────────
   REVIEWS
   ───────────────────────────────────────── */

export interface ReviewItem {
  id: string;
  user: string;
  rating: number;
  date: string;
  avatar?: string;
  comment: string;
  images?: string[];
}

export const MOCK_REVIEWS: ReviewItem[] = [
  {
    id: "r1", user: "K. Wanida", rating: 5, date: "15 เม.ย. 2025",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    comment: "ฟิล์มติดง่ายมากค่ะ แม่เหล็กแน่นดี ไม่เลื่อน ป้องกันการมองเห็นจากด้านข้างได้ดีมาก",
    images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80"],
  },
  {
    id: "r2", user: "P. Nattawan", rating: 5, date: "3 เม.ย. 2025",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    comment: "ซื้อมาใช้ที่ออฟฟิศ เพื่อนร่วมงานมองไม่เห็นหน้าจอเลยครับ คุ้มค่ามาก",
    images: [
      "https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=400&q=80",
      "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=400&q=80",
    ],
  },
  {
    id: "r3", user: "S. Pimchanok", rating: 5, date: "28 มี.ค. 2025",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
    comment: "คุณภาพดีมาก สีหน้าจอยังคมชัดเหมือนเดิม ป้องกันได้ดีเยี่ยมค่ะ",
    images: [],
  },
  {
    id: "r4", user: "T. Jirasak", rating: 5, date: "20 มี.ค. 2025",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80",
    comment: "ติดตั้งเองได้เลยโดยไม่ต้องใช้เครื่องมือ ถอดออกก็ง่ายมาก ไม่ทิ้งคราบ",
    images: ["https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400&q=80"],
  },
  {
    id: "r5", user: "M. Manas", rating: 4, date: "15 มี.ค. 2025",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80",
    comment: "ฟิล์มดีครับ แม่เหล็กจับแน่น แค่อยากให้มีรุ่น 16:10 เพิ่มขึ้นอีก",
    images: [],
  },
  {
    id: "r6", user: "A. Amara", rating: 5, date: "10 มี.ค. 2025",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",
    comment: "ประชุม Zoom ทุกวันโดยไม่ต้องกังวลว่าคนข้างๆ จะมองเห็นข้อมูล ดีมากค่ะ",
    images: ["https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80"],
  },
  {
    id: "r7", user: "W. Worawit", rating: 3, date: "5 มี.ค. 2025",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
    comment: "ป้องกันการมองจากด้านข้างได้ แต่รู้สึกว่าหน้าจอมืดลงนิดหน่อยเมื่อเทียบก่อนติดครับ",
    images: [],
  },
  {
    id: "r8", user: "P. Ploypailin", rating: 5, date: "1 มี.ค. 2025",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80",
    comment: "ใช้ได้ทั้ง MacBook Air และ Pro ถอดใส่สะดวกมาก แม่เหล็กแน่นแต่ไม่แข็งเกินไปค่ะ",
    images: ["https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=400&q=80"],
  },
  {
    id: "r9", user: "N. Nutcha", rating: 4, date: "25 ก.พ. 2025",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e16fd3c?w=100&q=80",
    comment: "ฟิล์ม Anti-Blue Light ช่วยลดอาการตาล้าได้จริงค่ะ ทำงานนานขึ้นโดยไม่ปวดตา",
    images: [],
  },
  {
    id: "r10", user: "C. Chaiwat", rating: 5, date: "20 ก.พ. 2025",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80",
    comment: "ซื้อให้แฟนที่ทำงาน Freelance ชอบมากครับ บอกว่าความเป็นส่วนตัวดีขึ้นเยอะเลย",
    images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80"],
  },
  {
    id: "r11", user: "L. Lalita", rating: 4, date: "15 ก.พ. 2025",
    avatar: "https://images.unsplash.com/photo-1488423191186-d3f63b53a3c1?w=100&q=80",
    comment: "ฟิล์ม Nano เคลือบผิวสัมผัสดีมาก ไม่มีรอยนิ้วมือค่ะ คุณภาพดีกว่าที่คิด",
    images: [],
  },
  {
    id: "r12", user: "K. Kittipong", rating: 5, date: "10 ก.พ. 2025",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
    comment: "แพ็คมาดีมาก กล่องแข็งแรง ฟิล์มไม่มีรอยข่วน ส่งเร็วภายใน 2 วันครับ",
    images: ["https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80"],
  },
];
