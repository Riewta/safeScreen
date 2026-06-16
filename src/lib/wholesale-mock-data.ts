export interface PriceTier {
  minQty: number;
  maxQty: number | null; // null = unlimited
  pricePerUnit: number;
}

export interface WholesaleProduct {
  id: string;
  name: string;
  brand: string;
  sku: string;
  image: string;
  category: string;
  packSize: number; // units per pack
  tiers: PriceTier[];
}

export const WHOLESALE_PRODUCTS: WholesaleProduct[] = [
  {
    id: "w-ms-1",
    name: "Mistine Super Fit Cushion SPF50+",
    brand: "Mistine",
    sku: "MS-CU-001",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80",
    category: "makeup",
    packSize: 6,
    tiers: [
      { minQty: 1,  maxQty: 5,  pricePerUnit: 290 },
      { minQty: 6,  maxQty: 11, pricePerUnit: 260 },
      { minQty: 12, maxQty: null, pricePerUnit: 235 },
    ],
  },
  {
    id: "w-ms-2",
    name: "White Aura Booster Serum",
    brand: "Mistine",
    sku: "MS-SR-002",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80",
    category: "serum",
    packSize: 6,
    tiers: [
      { minQty: 1,  maxQty: 5,  pricePerUnit: 220 },
      { minQty: 6,  maxQty: 11, pricePerUnit: 195 },
      { minQty: 12, maxQty: null, pricePerUnit: 175 },
    ],
  },
  {
    id: "w-rr-1",
    name: "Repair Moisture Balm SPF 25",
    brand: "Reunrom",
    sku: "RR-MB-001",
    image: "https://images.unsplash.com/photo-1594465919760-441fe5908ab0?w=600&q=80",
    category: "skincare",
    packSize: 6,
    tiers: [
      { minQty: 1,  maxQty: 5,  pricePerUnit: 650 },
      { minQty: 6,  maxQty: 11, pricePerUnit: 590 },
      { minQty: 12, maxQty: null, pricePerUnit: 540 },
    ],
  },
  {
    id: "w-rr-2",
    name: "Summer Glow Illuminating Serum",
    brand: "Reunrom",
    sku: "RR-SR-002",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80",
    category: "serum",
    packSize: 6,
    tiers: [
      { minQty: 1,  maxQty: 5,  pricePerUnit: 850 },
      { minQty: 6,  maxQty: 11, pricePerUnit: 780 },
      { minQty: 12, maxQty: null, pricePerUnit: 720 },
    ],
  },
  {
    id: "w-bb-1",
    name: "Vitamin C Brightening Essence",
    brand: "Baby Bright",
    sku: "BB-ES-001",
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&q=80",
    category: "serum",
    packSize: 12,
    tiers: [
      { minQty: 1,  maxQty: 5,  pricePerUnit: 360 },
      { minQty: 6,  maxQty: 11, pricePerUnit: 320 },
      { minQty: 12, maxQty: null, pricePerUnit: 290 },
    ],
  },
  {
    id: "w-jv-1",
    name: "Collagen Firming Eye Cream",
    brand: "Jejuvita",
    sku: "JV-EC-001",
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80",
    category: "eyecare",
    packSize: 6,
    tiers: [
      { minQty: 1,  maxQty: 5,  pricePerUnit: 650 },
      { minQty: 6,  maxQty: 11, pricePerUnit: 590 },
      { minQty: 12, maxQty: null, pricePerUnit: 540 },
    ],
  },
  {
    id: "w-sw-1",
    name: "Snail White Gold Cream SPF20",
    brand: "Snail White",
    sku: "SW-CR-001",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80",
    category: "skincare",
    packSize: 6,
    tiers: [
      { minQty: 1,  maxQty: 5,  pricePerUnit: 880 },
      { minQty: 6,  maxQty: 11, pricePerUnit: 800 },
      { minQty: 12, maxQty: null, pricePerUnit: 730 },
    ],
  },
];

export const WHOLESALE_BRANDS = [...new Set(WHOLESALE_PRODUCTS.map((p) => p.brand))].sort();
export const WHOLESALE_CATEGORIES = [...new Set(WHOLESALE_PRODUCTS.map((p) => p.category))].sort();

export function getTierPrice(tiers: PriceTier[], qty: number): number {
  const tier = [...tiers].reverse().find((t) => qty >= t.minQty);
  return tier ? tier.pricePerUnit : tiers[0].pricePerUnit;
}
