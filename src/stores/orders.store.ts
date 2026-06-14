import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useNotificationsStore } from "./notifications.store";

// ── Types ─────────────────────────────────────────────────────────────────────

export type OrderStatus =
  | "pending_payment"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type ReturnStatus = "return_requested" | "return_pending" | "return_completed";

export interface OrderItem {
  productId: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  originalPrice?: number; // original list price — show as strikethrough when price < originalPrice
  isFree?: boolean;
  variant: string;
  quantity: number;
  reviewId?: string;
  returnStatus?: ReturnStatus;
}

export interface Order {
  id: string;
  createdAt: string; // ISO
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  discountBreakdown?: { label: string; amount: number }[];
  total: number;
  paymentMethod?: string;
  paidAt?: string;
  trackingNumber?: string;
  shippingProvider?: string;
  estimatedDelivery?: string;
  recipientName: string;
  phone: string;
  address: string;
}

export interface Review {
  id: string;
  orderId: string;
  productId: string;
  rating: number;        // 1–5
  comment: string;
  user?: string;         // Added for UI compatibility
  avatar?: string;       // Added for UI compatibility
  images?: string[];
  anonymous?: boolean;
  createdAt: string;
}

// ── Mock seed data ────────────────────────────────────────────────────────────

const SEED_ORDERS: Order[] = [
  // ── 1. Pending Payment (3 min ago, countdown ~12 min left) ────────────────
  {
    id: "ORD-20240514-485",
    createdAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    status: "pending_payment",
    items: [
      {
        productId: "2",
        name: 'NanoSnap Privacy Screen — MacBook Air 13.6" (M2/M3/M4)',
        brand: "SafeScreen",
        image: "/products/nano-macbook/nano-macbook-air-13-6.jpg",
        price: 1390,
        originalPrice: 1690,
        variant: 'MacBook Air 13.6"',
        quantity: 2,
      },
      {
        productId: "11",
        name: 'NanoSnap Privacy Screen — Universal 15.6" (16:9)',
        brand: "SafeScreen",
        image: "/products/nano-universal/nano-universal-15-6.jpg",
        price: 1090,
        originalPrice: 1390,
        variant: 'Universal 15.6"',
        quantity: 1,
      },
    ],
    subtotal: 3870,
    shippingFee: 0,
    discount: 0,
    total: 3870,
    recipientName: "ธนิดา โอวาท",
    phone: "089-123-4567",
    address: "88/12 ถ.พระราม 9 ซ.9 ห้วยขวาง กรุงเทพฯ 10310",
  },
  // ── 2. Pending Payment (16 min ago) ───────────────────────────────────────
  {
    id: "ORD-20240514-486",
    createdAt: new Date(Date.now() - 16 * 60 * 1000).toISOString(),
    status: "pending_payment",
    items: [
      {
        productId: "5",
        name: 'NanoSnap Privacy Screen — MacBook Pro 14" (M2/M3/M4/M5)',
        brand: "SafeScreen",
        image: "/products/nano-macbook/nano-macbook-pro-14.jpg",
        price: 1490,
        originalPrice: 1890,
        variant: 'MacBook Pro 14"',
        quantity: 1,
      },
      {
        productId: "ipad-pv-air-m2m3",
        name: 'Magnetic Privacy Screen — iPad Air 11" (M2/M3)',
        brand: "SafeScreen",
        image: "/products/ipad/privacy-ipad-air-m2m3.jpg",
        price: 1090,
        originalPrice: 1390,
        variant: 'iPad Air 11" (M2/M3)',
        quantity: 1,
      },
      {
        productId: "8",
        name: 'NanoSnap Privacy Screen — Universal 14" (16:9)',
        brand: "SafeScreen",
        image: "/products/nano-universal/nano-universal-14.jpg",
        price: 1090,
        originalPrice: 1390,
        variant: 'Universal 14"',
        quantity: 1,
      },
    ],
    subtotal: 3670,
    shippingFee: 40,
    discount: 0,
    total: 3710,
    recipientName: "ธนิดา โอวาท",
    phone: "089-123-4567",
    address: "88/12 ถ.พระราม 9 ซ.9 ห้วยขวาง กรุงเทพฯ 10310",
  },
  // ── 3. Delivered (1 day ago) ───────────────────────────────────────────────
  {
    id: "ORD-20240514-487",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: "delivered",
    items: [
      {
        productId: "1",
        name: 'NanoSnap Privacy Screen — MacBook Air 13.3" (M1/Retina)',
        brand: "SafeScreen",
        image: "/products/nano-macbook/nano-macbook-air-13-3.jpg",
        price: 1290,
        originalPrice: 1590,
        variant: 'MacBook Air 13.3"',
        quantity: 1,
      },
      {
        productId: "2",
        name: 'NanoSnap Privacy Screen — MacBook Air 13.6" (M2/M3/M4)',
        brand: "SafeScreen",
        image: "/products/nano-macbook/nano-macbook-air-13-6.jpg",
        price: 1390,
        originalPrice: 1690,
        variant: 'MacBook Air 13.6"',
        quantity: 1,
      },
      {
        productId: "5",
        name: 'NanoSnap Privacy Screen — MacBook Pro 14" (M2/M3/M4/M5)',
        brand: "SafeScreen",
        image: "/products/nano-macbook/nano-macbook-pro-14.jpg",
        price: 1490,
        originalPrice: 1890,
        variant: 'MacBook Pro 14"',
        quantity: 1,
      },
      {
        productId: "ipad-pl-air-m2m3",
        name: 'Magnetic Paper Like — iPad Air 11" (M2/M3) · ของแถม',
        brand: "SafeScreen",
        image: "/products/ipad/paperlike-ipad-air-m2m3.jpg",
        price: 0,
        originalPrice: 1290,
        isFree: true,
        variant: 'iPad Air 11" · ของแถม',
        quantity: 1,
      },
    ],
    subtotal: 4170,
    shippingFee: 0,
    discount: 417,
    total: 3753,
    paymentMethod: "QR PromptPay",
    paidAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
    trackingNumber: "TH0987654321",
    shippingProvider: "Kerry Express",
    recipientName: "ธนิดา โอวาท",
    phone: "089-123-4567",
    address: "88/12 ถ.พระราม 9 ซ.9 ห้วยขวาง กรุงเทพฯ 10310",
  },
  // ── 4. Delivered (5 days ago) ──────────────────────────────────────────────
  {
    id: "ORD-20240514-488",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: "delivered",
    items: [
      {
        productId: "7",
        name: 'NanoSnap Privacy Screen — Universal 13.3" (16:9)',
        brand: "SafeScreen",
        image: "/products/nano-universal/nano-universal-13-3.jpg",
        price: 990,
        originalPrice: 1290,
        variant: 'Universal 13.3"',
        quantity: 5,
      },
      {
        productId: "8",
        name: 'NanoSnap Privacy Screen — Universal 14" (16:9)',
        brand: "SafeScreen",
        image: "/products/nano-universal/nano-universal-14.jpg",
        price: 1090,
        originalPrice: 1390,
        variant: 'Universal 14"',
        quantity: 2,
      },
    ],
    subtotal: 7130,
    shippingFee: 35,
    discount: 713,
    total: 6452,
    paymentMethod: "เก็บเงินปลายทาง",
    paidAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    trackingNumber: "FLS-888999000",
    shippingProvider: "Flash Express",
    recipientName: "ธนิดา โอวาท",
    phone: "089-123-4567",
    address: "88/12 ถ.พระราม 9 ซ.9 ห้วยขวาง กรุงเทพฯ 10310",
  },
  // ── 5. Delivered (2 days ago), with return items ────────────────────────────
  {
    id: "ORD-20240415-001",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "delivered",
    items: [
      {
        productId: "6",
        name: 'NanoSnap Privacy Screen — MacBook Pro 16" (M2/M3/M4/M5)',
        brand: "SafeScreen",
        image: "/products/nano-macbook/nano-macbook-pro-16.jpg",
        price: 1590,
        originalPrice: 1990,
        variant: 'MacBook Pro 16"',
        quantity: 1,
        returnStatus: "return_pending",
      },
      {
        productId: "3",
        name: 'NanoSnap Privacy Screen — MacBook Air 15" (M2/M3/M4/M5)',
        brand: "SafeScreen",
        image: "/products/nano-macbook/nano-macbook-air-15.jpg",
        price: 1490,
        originalPrice: 1790,
        variant: 'MacBook Air 15"',
        quantity: 1,
        returnStatus: "return_pending",
      },
      {
        productId: "10",
        name: 'NanoSnap Privacy Screen — Universal 15.3" (16:10)',
        brand: "SafeScreen",
        image: "/products/nano-universal/nano-universal-15-3.jpg",
        price: 1190,
        originalPrice: 1490,
        variant: 'Universal 15.3"',
        quantity: 1,
      },
      {
        productId: "12",
        name: 'NanoSnap Privacy Screen — Universal 16" (16:10)',
        brand: "SafeScreen",
        image: "/products/nano-universal/nano-universal-16.jpg",
        price: 1190,
        originalPrice: 1490,
        variant: 'Universal 16"',
        quantity: 1,
      },
      {
        productId: "ipad-pl-pro11",
        name: 'Magnetic Paper Like — iPad Pro 11" (All Gen)',
        brand: "SafeScreen",
        image: "/products/ipad/paperlike-ipad-pro-11.jpg",
        price: 1290,
        originalPrice: 1590,
        variant: 'iPad Pro 11"',
        quantity: 1,
      },
      {
        productId: "ipad-pv-pro11",
        name: 'Magnetic Privacy Film — iPad Pro 11" (All Gen) · ของแถม',
        brand: "SafeScreen",
        image: "/products/ipad/privacy-ipad-pro-11.jpg",
        price: 0,
        originalPrice: 1090,
        isFree: true,
        variant: 'iPad Pro 11" · ของแถม',
        quantity: 1,
      },
    ],
    subtotal: 6750,
    shippingFee: 0,
    discount: 803,
    discountBreakdown: [
      { label: "คูปอง SAFE10", amount: 675 },
      { label: "ส่วนลดค่าจัดส่ง", amount: 128 },
    ],
    total: 5947,
    paymentMethod: "บัตรเครดิต Visa •••• 4242",
    paidAt: "2024-04-15T10:35:00Z",
    trackingNumber: "TH123456789",
    shippingProvider: "Kerry Express",
    estimatedDelivery: "2024-04-18",
    recipientName: "ธนิดา โอวาท",
    phone: "089-123-4567",
    address: "88/12 ถ.พระราม 9 ซ.9 ห้วยขวาง กรุงเทพฯ 10310",
  },
  // ── 6. Shipped ─────────────────────────────────────────────────────────────
  {
    id: "ORD-20240420-002",
    createdAt: "2024-04-20T14:15:00Z",
    status: "shipped",
    items: [
      {
        productId: "5",
        name: 'NanoSnap Privacy Screen — MacBook Pro 14" (M2/M3/M4/M5)',
        brand: "SafeScreen",
        image: "/products/nano-macbook/nano-macbook-pro-14.jpg",
        price: 1490,
        originalPrice: 1890,
        variant: 'MacBook Pro 14"',
        quantity: 1,
      },
      {
        productId: "6",
        name: 'NanoSnap Privacy Screen — MacBook Pro 16" (M2/M3/M4/M5)',
        brand: "SafeScreen",
        image: "/products/nano-macbook/nano-macbook-pro-16.jpg",
        price: 1590,
        originalPrice: 1990,
        variant: 'MacBook Pro 16"',
        quantity: 1,
      },
      {
        productId: "ipad-pl-air-m2m3",
        name: 'Magnetic Paper Like — iPad Air 11" (M2/M3)',
        brand: "SafeScreen",
        image: "/products/ipad/paperlike-ipad-air-m2m3.jpg",
        price: 1290,
        originalPrice: 1590,
        variant: 'iPad Air 11" (M2/M3)',
        quantity: 1,
      },
      {
        productId: "ipad-pv-air-m2m3",
        name: 'Magnetic Privacy Screen — iPad Air 11" (M2/M3)',
        brand: "SafeScreen",
        image: "/products/ipad/privacy-ipad-air-m2m3.jpg",
        price: 1090,
        originalPrice: 1390,
        variant: 'iPad Air 11" Privacy',
        quantity: 1,
      },
      {
        productId: "ipad-pl-pro11",
        name: 'Magnetic Paper Like — iPad Pro 11" (All Gen) · ของแถม',
        brand: "SafeScreen",
        image: "/products/ipad/paperlike-ipad-pro-11.jpg",
        price: 0,
        originalPrice: 1290,
        isFree: true,
        variant: 'iPad Pro 11" · ของแถม',
        quantity: 1,
      },
    ],
    subtotal: 5460,
    shippingFee: 0,
    discount: 0,
    total: 5460,
    paymentMethod: "QR Promptpay",
    paidAt: "2024-04-20T14:18:00Z",
    trackingNumber: "FE987654321",
    shippingProvider: "Flash Express",
    estimatedDelivery: "2024-04-22",
    recipientName: "ธนิดา โอวาท",
    phone: "089-123-4567",
    address: "88/12 ถ.พระราม 9 ซ.9 ห้วยขวาง กรุงเทพฯ 10310",
  },
  // ── 7. Shipped ─────────────────────────────────────────────────────────────
  {
    id: "ORD-20240421-007",
    createdAt: "2024-04-21T08:00:00Z",
    status: "shipped",
    items: [
      {
        productId: "2",
        name: 'NanoSnap Privacy Screen — MacBook Air 13.6" (M2/M3/M4)',
        brand: "SafeScreen",
        image: "/products/nano-macbook/nano-macbook-air-13-6.jpg",
        price: 1390,
        originalPrice: 1690,
        variant: 'MacBook Air 13.6"',
        quantity: 2,
      },
      {
        productId: "11",
        name: 'NanoSnap Privacy Screen — Universal 15.6" (16:9)',
        brand: "SafeScreen",
        image: "/products/nano-universal/nano-universal-15-6.jpg",
        price: 1090,
        originalPrice: 1390,
        variant: 'Universal 15.6"',
        quantity: 2,
      },
    ],
    subtotal: 4960,
    shippingFee: 0,
    discount: 0,
    total: 4960,
    paymentMethod: "เก็บเงินปลายทาง",
    paidAt: "2024-04-23T11:00:00Z",
    trackingNumber: "KE112233445",
    shippingProvider: "Kerry Express",
    estimatedDelivery: "2024-04-23",
    recipientName: "ธนิดา โอวาท",
    phone: "089-123-4567",
    address: "88/12 ถ.พระราม 9 ซ.9 ห้วยขวาง กรุงเทพฯ 10310",
  },
  // ── 8. Shipped ─────────────────────────────────────────────────────────────
  {
    id: "ORD-20240422-008",
    createdAt: "2024-04-22T15:30:00Z",
    status: "shipped",
    items: [
      {
        productId: "ipad-pl-pro11",
        name: 'Magnetic Paper Like — iPad Pro 11" (All Gen)',
        brand: "SafeScreen",
        image: "/products/ipad/paperlike-ipad-pro-11.jpg",
        price: 1290,
        originalPrice: 1590,
        variant: 'iPad Pro 11"',
        quantity: 1,
      },
      {
        productId: "ipad-pv-pro11",
        name: 'Magnetic Privacy Film — iPad Pro 11" (All Gen)',
        brand: "SafeScreen",
        image: "/products/ipad/privacy-ipad-pro-11.jpg",
        price: 1090,
        originalPrice: 1390,
        variant: 'iPad Pro 11"',
        quantity: 1,
      },
      {
        productId: "7",
        name: 'NanoSnap Privacy Screen — Universal 13.3" (16:9)',
        brand: "SafeScreen",
        image: "/products/nano-universal/nano-universal-13-3.jpg",
        price: 990,
        originalPrice: 1290,
        variant: 'Universal 13.3"',
        quantity: 2,
      },
      {
        productId: "8",
        name: 'NanoSnap Privacy Screen — Universal 14" (16:9)',
        brand: "SafeScreen",
        image: "/products/nano-universal/nano-universal-14.jpg",
        price: 1090,
        originalPrice: 1390,
        variant: 'Universal 14"',
        quantity: 1,
      },
    ],
    subtotal: 5460,
    shippingFee: 0,
    discount: 200,
    total: 5260,
    paymentMethod: "บัตรเครดิต Mastercard •••• 5353",
    paidAt: "2024-04-22T15:33:00Z",
    trackingNumber: "BT556677889",
    shippingProvider: "Best Express",
    estimatedDelivery: "2024-04-25",
    recipientName: "ธนิดา โอวาท",
    phone: "089-123-4567",
    address: "88/12 ถ.พระราม 9 ซ.9 ห้วยขวาง กรุงเทพฯ 10310",
  },
  // ── 9. Processing ──────────────────────────────────────────────────────────
  {
    id: "ORD-20240425-003",
    createdAt: "2024-04-25T09:00:00Z",
    status: "processing",
    items: [
      {
        productId: "5",
        name: 'NanoSnap Privacy Screen — MacBook Pro 14" (M2/M3/M4/M5)',
        brand: "SafeScreen",
        image: "/products/nano-macbook/nano-macbook-pro-14.jpg",
        price: 1490,
        originalPrice: 1890,
        variant: 'MacBook Pro 14"',
        quantity: 1,
      },
      {
        productId: "6",
        name: 'NanoSnap Privacy Screen — MacBook Pro 16" (M2/M3/M4/M5)',
        brand: "SafeScreen",
        image: "/products/nano-macbook/nano-macbook-pro-16.jpg",
        price: 1590,
        originalPrice: 1990,
        variant: 'MacBook Pro 16"',
        quantity: 1,
      },
      {
        productId: "ipad-pv-air45",
        name: 'Magnetic Privacy Film — iPad Air (Gen 4/5, 10.9")',
        brand: "SafeScreen",
        image: "/products/ipad/privacy-ipad-air-45.jpg",
        price: 990,
        originalPrice: 1290,
        variant: 'iPad Air Gen 4/5 10.9"',
        quantity: 1,
      },
      {
        productId: "11",
        name: 'NanoSnap Privacy Screen — Universal 15.6" (16:9)',
        brand: "SafeScreen",
        image: "/products/nano-universal/nano-universal-15-6.jpg",
        price: 1090,
        originalPrice: 1390,
        variant: 'Universal 15.6"',
        quantity: 1,
      },
      {
        productId: "ipad-pv-pro11",
        name: 'Magnetic Privacy Film — iPad Pro 11" (All Gen) · ของแถม',
        brand: "SafeScreen",
        image: "/products/ipad/privacy-ipad-pro-11.jpg",
        price: 0,
        originalPrice: 1090,
        isFree: true,
        variant: 'iPad Pro 11" · ของแถม',
        quantity: 1,
      },
    ],
    subtotal: 5160,
    shippingFee: 0,
    discount: 0,
    total: 5160,
    shippingProvider: "SPX Express",
    recipientName: "ธนิดา โอวาท",
    phone: "089-123-4567",
    address: "88/12 ถ.พระราม 9 ซ.9 ห้วยขวาง กรุงเทพฯ 10310",
  },
  // ── 10. Pending Payment (countdown! 3 min ago) ────────────────────────────
  {
    id: "ORD-20240426-004",
    createdAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    status: "pending_payment",
    items: [
      {
        productId: "2",
        name: 'NanoSnap Privacy Screen — MacBook Air 13.6" (M2/M3/M4)',
        brand: "SafeScreen",
        image: "/products/nano-macbook/nano-macbook-air-13-6.jpg",
        price: 1390,
        originalPrice: 1690,
        variant: 'MacBook Air 13.6"',
        quantity: 1,
      },
      {
        productId: "3",
        name: 'NanoSnap Privacy Screen — MacBook Air 15" (M2/M3/M4/M5)',
        brand: "SafeScreen",
        image: "/products/nano-macbook/nano-macbook-air-15.jpg",
        price: 1490,
        originalPrice: 1790,
        variant: 'MacBook Air 15"',
        quantity: 1,
      },
    ],
    subtotal: 2880,
    shippingFee: 0,
    discount: 0,
    total: 2880,
    recipientName: "ธนิดา โอวาท",
    phone: "089-123-4567",
    address: "88/12 ถ.พระราม 9 ซ.9 ห้วยขวาง กรุงเทพฯ 10310",
  },
  // ── 11. Delivered (4 days ago) ─────────────────────────────────────────────
  {
    id: "ORD-20240310-005",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    status: "delivered",
    items: [
      {
        productId: "2",
        name: 'NanoSnap Privacy Screen — MacBook Air 13.6" (M2/M3/M4)',
        brand: "SafeScreen",
        image: "/products/nano-macbook/nano-macbook-air-13-6.jpg",
        price: 1390,
        originalPrice: 1690,
        variant: 'MacBook Air 13.6"',
        quantity: 1,
      },
      {
        productId: "11",
        name: 'NanoSnap Privacy Screen — Universal 15.6" (16:9)',
        brand: "SafeScreen",
        image: "/products/nano-universal/nano-universal-15-6.jpg",
        price: 1090,
        originalPrice: 1390,
        variant: 'Universal 15.6"',
        quantity: 1,
      },
      {
        productId: "ipad-pv-air-m2m3",
        name: 'Magnetic Privacy Screen — iPad Air 11" (M2/M3) · ของแถม',
        brand: "SafeScreen",
        image: "/products/ipad/privacy-ipad-air-m2m3.jpg",
        price: 0,
        originalPrice: 1090,
        isFree: true,
        variant: 'iPad Air 11" · ของแถม',
        quantity: 1,
      },
    ],
    subtotal: 2480,
    shippingFee: 0,
    discount: 248,
    total: 2232,
    paymentMethod: "บัตรเครดิต Visa •••• 4242",
    paidAt: "2024-03-10T11:25:00Z",
    trackingNumber: "KR112233445",
    shippingProvider: "Kerry Express",
    estimatedDelivery: "2024-03-12",
    recipientName: "ธนิดา โอวาท",
    phone: "089-123-4567",
    address: "88/12 ถ.พระราม 9 ซ.9 ห้วยขวาง กรุงเทพฯ 10310",
  },
  // ── 12. Cancelled (5 days ago) ─────────────────────────────────────────────
  {
    id: "ORD-20240501-009",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: "cancelled",
    items: [
      {
        productId: "ipad-pl-pro129",
        name: 'Magnetic Paper Like — iPad Pro 12.9" (All Gen)',
        brand: "SafeScreen",
        image: "/products/ipad/paperlike-ipad-pro-12-9.jpg",
        price: 1490,
        originalPrice: 1790,
        variant: 'iPad Pro 12.9"',
        quantity: 1,
      },
      {
        productId: "ipad-pv-pro129",
        name: 'Magnetic Privacy Film — iPad Pro 12.9" (All Gen)',
        brand: "SafeScreen",
        image: "/products/ipad/privacy-ipad-pro-12-9.jpg",
        price: 1290,
        originalPrice: 1590,
        variant: 'iPad Pro 12.9"',
        quantity: 1,
      },
    ],
    subtotal: 2780,
    shippingFee: 0,
    discount: 0,
    total: 2780,
    paymentMethod: "PromptPay",
    recipientName: "ธนิด อภิวัฒน์",
    phone: "081-234-5678",
    address: "22/4 ถ.สุขุมวิท 21 วัฒนา กรุงเทพฯ 10110",
  },
  // ── 13. Cancelled (8 days ago) ─────────────────────────────────────────────
  {
    id: "ORD-20240428-010",
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    status: "cancelled",
    items: [
      {
        productId: "4",
        name: 'NanoSnap Privacy Screen — MacBook Pro 13.3" (2019–2022)',
        brand: "SafeScreen",
        image: "/products/nano-macbook/nano-macbook-pro-13-3.jpg",
        price: 1290,
        originalPrice: 1590,
        variant: 'MacBook Pro 13.3"',
        quantity: 1,
      },
      {
        productId: "5",
        name: 'NanoSnap Privacy Screen — MacBook Pro 14" (M2/M3/M4/M5)',
        brand: "SafeScreen",
        image: "/products/nano-macbook/nano-macbook-pro-14.jpg",
        price: 1490,
        originalPrice: 1890,
        variant: 'MacBook Pro 14"',
        quantity: 1,
      },
      {
        productId: "6",
        name: 'NanoSnap Privacy Screen — MacBook Pro 16" (M2/M3/M4/M5)',
        brand: "SafeScreen",
        image: "/products/nano-macbook/nano-macbook-pro-16.jpg",
        price: 1590,
        originalPrice: 1990,
        variant: 'MacBook Pro 16"',
        quantity: 2,
      },
    ],
    subtotal: 5960,
    shippingFee: 0,
    discount: 500,
    discountBreakdown: [{ label: "โค้ด WELCOME500", amount: 500 }],
    total: 5460,
    paymentMethod: "บัตรเครดิต Mastercard •••• 5353",
    recipientName: "ธนิด อภิวัฒน์",
    phone: "081-234-5678",
    address: "22/4 ถ.สุขุมวิท 21 วัฒนา กรุงเทพฯ 10110",
  },
  // ── 14. Delivered (10 days ago), return_completed ──────────────────────────
  {
    id: "ORD-20240510-012",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: "delivered",
    items: [
      {
        productId: "1",
        name: 'NanoSnap Privacy Screen — MacBook Air 13.3" (M1/Retina)',
        brand: "SafeScreen",
        image: "/products/nano-macbook/nano-macbook-air-13-3.jpg",
        price: 1290,
        originalPrice: 1590,
        variant: 'MacBook Air 13.3"',
        quantity: 1,
        returnStatus: "return_completed",
      },
      {
        productId: "4",
        name: 'NanoSnap Privacy Screen — MacBook Pro 13.3" (2019–2022)',
        brand: "SafeScreen",
        image: "/products/nano-macbook/nano-macbook-pro-13-3.jpg",
        price: 1290,
        originalPrice: 1590,
        variant: 'MacBook Pro 13.3"',
        quantity: 1,
      },
    ],
    subtotal: 2580,
    shippingFee: 0,
    discount: 0,
    total: 2580,
    paymentMethod: "QR Promptpay",
    paidAt: "2024-05-10T09:30:00Z",
    recipientName: "ธนิดา โอวาท",
    phone: "089-123-4567",
    address: "88/12 ถ.พระราม 9 ซ.9 ห้วยขวาง กรุงเทพฯ 10310",
  },
  // ── 15. Processing (6 hours ago) ──────────────────────────────────────────
  {
    id: "ORD-20240512-013",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    status: "processing",
    items: [
      {
        productId: "2",
        name: 'NanoSnap Privacy Screen — MacBook Air 13.6" (M2/M3/M4)',
        brand: "SafeScreen",
        image: "/products/nano-macbook/nano-macbook-air-13-6.jpg",
        price: 1390,
        originalPrice: 1690,
        variant: 'MacBook Air 13.6"',
        quantity: 1,
      },
      {
        productId: "5",
        name: 'NanoSnap Privacy Screen — MacBook Pro 14" (M2/M3/M4/M5)',
        brand: "SafeScreen",
        image: "/products/nano-macbook/nano-macbook-pro-14.jpg",
        price: 1490,
        originalPrice: 1890,
        variant: 'MacBook Pro 14"',
        quantity: 1,
      },
      {
        productId: "6",
        name: 'NanoSnap Privacy Screen — MacBook Pro 16" (M2/M3/M4/M5)',
        brand: "SafeScreen",
        image: "/products/nano-macbook/nano-macbook-pro-16.jpg",
        price: 1590,
        originalPrice: 1990,
        variant: 'MacBook Pro 16"',
        quantity: 1,
      },
      {
        productId: "ipad-pl-air-m2m3",
        name: 'Magnetic Paper Like — iPad Air 11" (M2/M3)',
        brand: "SafeScreen",
        image: "/products/ipad/paperlike-ipad-air-m2m3.jpg",
        price: 1290,
        originalPrice: 1590,
        variant: 'iPad Air 11" (M2/M3)',
        quantity: 1,
      },
      {
        productId: "ipad-pv-air-m2m3",
        name: 'Magnetic Privacy Screen — iPad Air 11" (M2/M3) · ของแถม',
        brand: "SafeScreen",
        image: "/products/ipad/privacy-ipad-air-m2m3.jpg",
        price: 0,
        originalPrice: 1090,
        isFree: true,
        variant: 'iPad Air 11" · ของแถม',
        quantity: 1,
      },
    ],
    subtotal: 5760,
    shippingFee: 0,
    discount: 1000,
    discountBreakdown: [{ label: "คูปอง SCREEN1000", amount: 1000 }],
    total: 4760,
    paymentMethod: "บัตรเครดิต Visa •••• 4242",
    paidAt: new Date(Date.now() - 6 * 60 * 60 * 1000 + 3 * 60 * 1000).toISOString(),
    recipientName: "ธนิดา โอวาท",
    phone: "089-123-4567",
    address: "88/12 ถ.พระราม 9 ซ.9 ห้วยขวาง กรุงเทพฯ 10310",
  },
  // ── 16. Shipped (2 days ago) ───────────────────────────────────────────────
  {
    id: "ORD-20240513-014",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "shipped",
    items: [
      {
        productId: "ipad-pl-pro-m4m5",
        name: 'Magnetic Paper Like — iPad Pro 13" (M4/M5)',
        brand: "SafeScreen",
        image: "/products/ipad/paperlike-ipad-pro-m4m5.jpg",
        price: 1590,
        originalPrice: 1890,
        variant: 'iPad Pro 13" (M4/M5)',
        quantity: 1,
      },
      {
        productId: "ipad-pv-pro-m4m5",
        name: 'Magnetic Privacy Screen — iPad Pro 13" (M4/M5)',
        brand: "SafeScreen",
        image: "/products/ipad/privacy-ipad-pro-m4m5.jpg",
        price: 1390,
        originalPrice: 1690,
        variant: 'iPad Pro 13" (M4/M5)',
        quantity: 1,
      },
      {
        productId: "6",
        name: 'NanoSnap Privacy Screen — MacBook Pro 16" (M2/M3/M4/M5)',
        brand: "SafeScreen",
        image: "/products/nano-macbook/nano-macbook-pro-16.jpg",
        price: 1590,
        originalPrice: 1990,
        variant: 'MacBook Pro 16"',
        quantity: 1,
      },
      {
        productId: "ipad-pl-pro-m4m5-gift",
        name: 'Magnetic Paper Like — iPad Pro 13" (M4/M5) · ของแถม',
        brand: "SafeScreen",
        image: "/products/ipad/paperlike-ipad-pro-m4m5.jpg",
        price: 0,
        originalPrice: 1590,
        isFree: true,
        variant: 'iPad Pro 13" · ของแถม',
        quantity: 1,
      },
    ],
    subtotal: 4570,
    shippingFee: 0,
    discount: 0,
    total: 4570,
    paymentMethod: "บัตรเครดิต Mastercard •••• 5353",
    paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 1000).toISOString(),
    trackingNumber: "KE334455667",
    shippingProvider: "Kerry Express",
    estimatedDelivery: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    recipientName: "ธนิดา โอวาท",
    phone: "089-123-4567",
    address: "88/12 ถ.พระราม 9 ซ.9 ห้วยขวาง กรุงเทพฯ 10310",
  },
  // ── 17. Cancelled (12 days ago) ────────────────────────────────────────────
  {
    id: "ORD-20240511-015",
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    status: "cancelled",
    items: [
      {
        productId: "7",
        name: 'NanoSnap Privacy Screen — Universal 13.3" (16:9)',
        brand: "SafeScreen",
        image: "/products/nano-universal/nano-universal-13-3.jpg",
        price: 990,
        originalPrice: 1290,
        variant: 'Universal 13.3"',
        quantity: 3,
      },
      {
        productId: "9",
        name: 'NanoSnap Privacy Screen — Universal 14.5" (16:10)',
        brand: "SafeScreen",
        image: "/products/nano-universal/nano-universal-14-5.jpg",
        price: 1090,
        originalPrice: 1390,
        variant: 'Universal 14.5"',
        quantity: 2,
      },
      {
        productId: "12",
        name: 'NanoSnap Privacy Screen — Universal 16" (16:10)',
        brand: "SafeScreen",
        image: "/products/nano-universal/nano-universal-16.jpg",
        price: 1190,
        originalPrice: 1490,
        variant: 'Universal 16"',
        quantity: 1,
      },
      {
        productId: "14",
        name: 'NanoSnap Privacy Screen — Universal 17.3" (16:9)',
        brand: "SafeScreen",
        image: "/products/nano-universal/nano-universal-17-3.jpg",
        price: 1290,
        originalPrice: 1590,
        variant: 'Universal 17.3"',
        quantity: 2,
      },
    ],
    subtotal: 7720,
    shippingFee: 0,
    discount: 460,
    discountBreakdown: [{ label: "คูปอง ORD10", amount: 460 }],
    total: 7260,
    paymentMethod: "QR PromptPay",
    recipientName: "ธนิดา โอวาท",
    phone: "089-123-4567",
    address: "88/12 ถ.พระราม 9 ซ.9 ห้วยขวาง กรุงเทพฯ 10310",
  },
];

// ── Store ─────────────────────────────────────────────────────────────────────

interface OrdersStore {
  orders: Order[];
  reviews: Review[];

  // orders
  getOrder:    (id: string) => Order | undefined;
  addOrder:    (order: Order) => void;
  seedIfEmpty: () => void;
  clearOrders: () => void;

  updateStatus:  (id: string, status: OrderStatus) => void;
  updateAddress: (id: string, data: { recipientName: string; phone: string; address: string }) => void;
  submitReturn:  (orderId: string, productIds: string[]) => void;

  // reviews
  addReview:         (review: Omit<Review, "id" | "createdAt">) => void;
  getReview:         (orderId: string, productId: string) => Review | undefined;
  getProductReviews: (productId: string) => Review[];
}

export const useOrdersStore = create<OrdersStore>()(
  persist(
    (set, get) => ({
      orders: [],
      reviews: [],

      getOrder: (id) => get().orders.find((o) => o.id === id),

      addOrder: (order) => set((s) => ({ orders: [order, ...(s.orders || [])] })),

      seedIfEmpty: () => {
        if (get().orders.length === 0) set({ orders: SEED_ORDERS });
      },

      clearOrders: () => set({ orders: [], reviews: [] }),

      updateStatus: (id, status) => {
        set((s) => ({
          orders: s.orders.map((o) => {
            if (o.id !== id) return o;
            
            // Add mock tracking info if transitioning to shipped and it's missing
            if (status === "shipped" && !o.trackingNumber) {
              const providers = ["Flash Express", "Kerry Express", "J&T Express", "SPX Express"];
              const provider = providers[Math.floor(Math.random() * providers.length)];
              const prefix = provider.slice(0, 2).toUpperCase();
              return {
                ...o,
                status,
                shippingProvider: provider,
                trackingNumber: `${prefix}${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
                estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
              };
            }
            
            return { ...o, status };
          })
        }));
        
        // Trigger notification if status is delivered
        if (status === "delivered") {
          const order = get().orders.find(o => o.id === id);
          if (order) {
            useNotificationsStore.getState().addNotification({
              type: "order",
              title: "จัดส่งสินค้าสำเร็จ",
              body: `ออเดอร์ #${id} ถูกจัดส่งเรียบร้อยแล้ว อย่าลืมให้คะแนนสินค้าเพื่อรับ 10 แต้มนะ!`,
              image: order.items[0]?.image,
              href: `/account/reviews`,
              orderId: id
            });
          }
        }
      },

      updateAddress: (id, data) =>
        set((s) => ({ orders: s.orders.map((o) => o.id === id ? { ...o, ...data } : o) })),

      submitReturn: (orderId, productIds) =>
        set((s) => ({
          orders: s.orders.map((o) => {
            if (o.id !== orderId) return o;
            return {
              ...o,
              items: o.items.map((item) =>
                productIds.includes(item.productId)
                  ? { ...item, returnStatus: "return_requested" as ReturnStatus }
                  : item
              ),
            };
          }),
        })),

      addReview: (r) => {
        set((s) => {
          const existing = s.reviews.find(
            (rev) => rev.orderId === r.orderId && rev.productId === r.productId
          );
          if (existing) {
            return {
              reviews: s.reviews.map((rev) =>
                rev.id === existing.id
                  ? { ...rev, rating: r.rating, comment: r.comment ?? rev.comment, anonymous: r.anonymous ?? rev.anonymous, images: r.images }
                  : rev
              ),
            };
          }
          const id = `rev-${Date.now()}`;
          const review: Review = { ...r, id, createdAt: new Date().toISOString() };
          const orders = s.orders.map((o) => {
            if (o.id !== r.orderId) return o;
            return {
              ...o,
              items: o.items.map((item) =>
                item.productId === r.productId ? { ...item, reviewId: id } : item
              ),
            };
          });
          return { reviews: [...s.reviews, review], orders };
        });
      },

      getReview: (orderId, productId) =>
        get().reviews.find((r) => r.orderId === orderId && r.productId === productId),

      getProductReviews: (productId) =>
        get().reviews.filter((r) => r.productId === productId),
    }),
    {
      name: "karmart-orders",
      version: 15,
      migrate: () => ({ orders: SEED_ORDERS, reviews: [] }),
      partialize: (s) => ({ orders: s.orders, reviews: s.reviews }),
    }
  )
);

// ── Helpers ───────────────────────────────────────────────────────────────────

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending_payment: "ที่ต้องชำระ",
  processing:      "ที่ต้องจัดส่ง",
  shipped:         "กำลังจัดส่ง",
  delivered:       "สำเร็จ",
  cancelled:       "ยกเลิกแล้ว",
};

export const STATUS_COLOR: Record<OrderStatus, string> = {
  pending_payment: "var(--km-warning)",
  processing:      "var(--km-warning)",
  shipped:         "var(--km-warning)",
  delivered:       "var(--km-success)",
  cancelled:       "var(--km-error)",
};
