export type PromoType = "free-gift" | "bogo";

export interface PromoGiftOption {
  id: string;
  name: string;
  brand: string;
  image: string;
  originalPrice?: number;
}

export interface PromoProduct {
  id: string;
  brand: string;
  name: string;
  image: string;
  variants: { label: string; price: number; originalPrice?: number }[];
  maxPerCustomer?: number;
}

export interface PromoCampaign {
  id: string;
  type: PromoType;
  title: string;
  subtitle: string;
  threshold?: number;
  bogoQty?: number;
  bogoFreeQty?: number;
  eligibleProductIds: string[];
  products: PromoProduct[];
  giftOptions?: PromoGiftOption[];
}

export const PROMO_CAMPAIGNS: PromoCampaign[] = [
  {
    id: "free-gift",
    type: "free-gift",
    title: "ซื้อครบ 500 บาท รับของแถมฟรี",
    subtitle: "ซื้อสินค้าที่ร่วมรายการครบ ฿500 รับ Cleaning Kit ฟรี 1 ชุด",
    threshold: 500,
    eligibleProductIds: ["1", "2", "3", "4", "5", "6"],
    products: [
      {
        id: "promo-1",
        brand: "SafeScreen",
        name: "NanoSnap MacBook Air 13.6\" (M2/M3/M4)",
        image: "/products/nano-macbook/nano-macbook-air-13-6.jpg",
        variants: [{ label: "MacBook Air 13.6\"", price: 890, originalPrice: 990 }],
      },
      {
        id: "promo-2",
        brand: "SafeScreen",
        name: "Privacy MacBook Pro 14\" (M2/M3/M4)",
        image: "/products/privacy-macbook/privacy-macbook-pro-14.jpg",
        variants: [{ label: "MacBook Pro 14\"", price: 1190, originalPrice: 1390 }],
      },
      {
        id: "promo-3",
        brand: "SafeScreen",
        name: "Privacy Universal 15.6\"",
        image: "/products/privacy-universal/privacy-universal-15-6.jpg",
        variants: [{ label: "Universal 15.6\"", price: 790, originalPrice: 890 }],
      },
      {
        id: "promo-4",
        brand: "SafeScreen",
        name: "Paperlike iPad Pro 11\"",
        image: "/products/ipad/paperlike-ipad-pro-11.jpg",
        variants: [{ label: "iPad Pro 11\"", price: 990, originalPrice: 1190 }],
      },
    ],
    giftOptions: [
      {
        id: "pg-1",
        name: "Microfiber Cleaning Cloth + Spray",
        brand: "SafeScreen",
        image: "/products/nano-macbook/nano-macbook-air-13-3.jpg",
        originalPrice: 199,
      },
      {
        id: "pg-2",
        name: "Screen Cleaning Kit (Wet + Dry)",
        brand: "SafeScreen",
        image: "/products/nano-universal/nano-universal-13-3.jpg",
        originalPrice: 149,
      },
    ],
  },
  {
    id: "bogo",
    type: "bogo",
    title: "ซื้อ 1 แถม 1",
    subtitle: "ซื้อฟิล์มขนาดเดียวกัน 1 ชิ้น รับอีก 1 ชิ้นฟรี",
    bogoQty: 1,
    bogoFreeQty: 1,
    eligibleProductIds: ["7", "8", "9", "10"],
    products: [
      {
        id: "bogo-1",
        brand: "SafeScreen",
        name: "NanoSnap Universal 13.3\"",
        image: "/products/nano-universal/nano-universal-13-3.jpg",
        maxPerCustomer: 2,
        variants: [
          { label: "13.3\"", price: 790, originalPrice: 890 },
          { label: "14\"",   price: 790, originalPrice: 890 },
        ],
      },
      {
        id: "bogo-2",
        brand: "SafeScreen",
        name: "NanoSnap Universal 15.6\"",
        image: "/products/nano-universal/nano-universal-15-6.jpg",
        variants: [{ label: "15.6\"", price: 890, originalPrice: 990 }],
      },
      {
        id: "bogo-3",
        brand: "SafeScreen",
        name: "Privacy Universal 14\"",
        image: "/products/privacy-universal/privacy-universal-14.jpg",
        variants: [{ label: "14\"", price: 890, originalPrice: 990 }],
      },
    ],
  },
];

export function getCampaignsForProduct(productId: string): PromoCampaign[] {
  return PROMO_CAMPAIGNS.filter(c => c.eligibleProductIds.includes(productId));
}
