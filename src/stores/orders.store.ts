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
  {
    id: "ORD-20240514-485",
    createdAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    status: "pending_payment",
    items: [
      {
        productId: "boya-1",
        name: "Vitamin C Brightening Essence",
        brand: "Boya",
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80",
        price: 2890,
        variant: "50 ml",
        quantity: 2,
      },
      {
        productId: "boya-2",
        name: "Q10 Intensive Body Lotion",
        brand: "Boya",
        image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80",
        price: 490,
        variant: "500 ml",
        quantity: 1,
      },
      {
        productId: "boya-3",
        name: "Niacinamide Glow Toner",
        brand: "Boya",
        image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&q=80",
        price: 590,
        variant: "200 ml",
        quantity: 1,
      },
      {
        productId: "boya-4",
        name: "Ceramide Barrier Repair Serum",
        brand: "Boya",
        image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80",
        price: 1390,
        variant: "30 ml",
        quantity: 1,
      },
      {
        productId: "boya-5",
        name: "Sunscreen SPF50+ PA++++",
        brand: "Boya",
        image: "https://images.unsplash.com/photo-1594465919760-441fe5908ab0?w=600&q=80",
        price: 0,
        originalPrice: 490,
        isFree: true,
        variant: "30 ml · ของแถม",
        quantity: 1,
      },
    ],
    subtotal: 8250,
    shippingFee: 0,
    discount: 0,
    total: 8250,
    recipientName: "ธนิดา โอวาท",
    phone: "089-123-4567",
    address: "88/12 ถ.พระราม 9 ซ.9 ห้วยขวาง กรุงเทพฯ 10310",
  },
  {
    id: "ORD-20240514-486",
    createdAt: new Date(Date.now() - 16 * 60 * 1000).toISOString(),
    status: "pending_payment",
    items: [
      {
        productId: "sk-1",
        name: "Premium Fresh Mint Mouthwash",
        brand: "Skynlab",
        image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&q=80",
        price: 250,
        variant: "500 ml",
        quantity: 4,
      },
      {
        productId: "sk-2",
        name: "Acne Clear Purifying Foam",
        brand: "Skynlab",
        image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&q=80",
        price: 180,
        variant: "100 ml",
        quantity: 2,
      },
      {
        productId: "sk-3",
        name: "Oil Control Matte Moisturizer",
        brand: "Skynlab",
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80",
        price: 320,
        variant: "50 ml",
        quantity: 1,
      },
    ],
    subtotal: 1680,
    shippingFee: 40,
    discount: 0,
    total: 1720,
    recipientName: "ธนิดา โอวาท",
    phone: "089-123-4567",
    address: "88/12 ถ.พระราม 9 ซ.9 ห้วยขวาง กรุงเทพฯ 10310",
  },
  {
    id: "ORD-20240514-487",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: "delivered",
    items: [
      {
        productId: "cd-3",
        name: "L-Glutathione Magic Cream SPF50",
        brand: "Cathy Doll",
        image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&q=80",
        price: 890,
        variant: "138 ml",
        quantity: 1,
      },
      {
        productId: "cd-4",
        name: "Ready 2 White Boosting Cream",
        brand: "Cathy Doll",
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80",
        price: 1290,
        variant: "75 ml",
        quantity: 1,
      },
      {
        productId: "cd-5",
        name: "Super BB Cream SPF60 PA+++",
        brand: "Cathy Doll",
        image: "https://images.unsplash.com/photo-1631214524020-3c69f4d4551c?w=600&q=80",
        price: 390,
        variant: "เบอร์ 02 Natural",
        quantity: 2,
      },
      {
        productId: "cd-6",
        name: "Magic Cushion Cover Lasting SPF50",
        brand: "Cathy Doll",
        image: "https://images.unsplash.com/photo-1594465919760-441fe5908ab0?w=600&q=80",
        price: 590,
        variant: "เบอร์ 03 Honey Beige",
        quantity: 1,
      },
      {
        productId: "cd-7",
        name: "Cathy Doll Mini Lip Gloss",
        brand: "Cathy Doll",
        image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&q=80",
        price: 0,
        originalPrice: 290,
        isFree: true,
        variant: "No.04 Pink Rose · ของแถม",
        quantity: 1,
      },
    ],
    subtotal: 3940,
    shippingFee: 0,
    discount: 394,
    total: 3546,
    paymentMethod: "QR PromptPay",
    paidAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
    trackingNumber: "TH0987654321",
    shippingProvider: "Kerry Express",
    recipientName: "ธนิดา โอวาท",
    phone: "089-123-4567",
    address: "88/12 ถ.พระราม 9 ซ.9 ห้วยขวาง กรุงเทพฯ 10310",
  },
  {
    id: "ORD-20240514-488",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    status: "delivered",
    items: [
      {
        productId: "bb-5",
        name: "Watermelon & Tomato Essence Mask",
        brand: "Baby Bright",
        image: "https://images.unsplash.com/photo-1594465919760-441fe5908ab0?w=600&q=80",
        price: 39,
        variant: "20 g",
        quantity: 10,
      },
      {
        productId: "bb-6",
        name: "Plankton Matte Cushion Lip",
        brand: "Baby Bright",
        image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&q=80",
        price: 159,
        variant: "05 Sandstone",
        quantity: 2,
      },
    ],
    subtotal: 708,
    shippingFee: 35,
    discount: 0,
    total: 743,
    paymentMethod: "เก็บเงินปลายทาง",
    paidAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    trackingNumber: "FLS-888999000",
    shippingProvider: "Flash Express",
    recipientName: "ธนิดา โอวาท",
    phone: "089-123-4567",
    address: "88/12 ถ.พระราม 9 ซ.9 ห้วยขวาง กรุงเทพฯ 10310",
  },
  {
    // Multi-brand order: Clinique (3 items + freebie) + The Ordinary (2 items)
    id: "ORD-20240415-001",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "delivered",
    items: [
      {
        productId: "1",
        name: "Moisture Surge 100H Auto-Relief Hydrator",
        brand: "Clinique",
        image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80",
        price: 1490,
        variant: "50ml",
        quantity: 1,
        returnStatus: "return_pending",
      },
      {
        productId: "1b",
        name: "Even Better Clinical Serum Foundation",
        brand: "Clinique",
        image: "https://images.unsplash.com/photo-1631214524020-3c69f4d4551c?w=600&q=80",
        price: 1890,
        variant: "CN 28 Ivory",
        quantity: 1,
        returnStatus: "return_pending",
      },
      {
        productId: "1c",
        name: "Black Honey Almost Lipstick",
        brand: "Clinique",
        image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&q=80",
        price: 890,
        variant: "Black Honey",
        quantity: 2,
      },
      {
        productId: "1d",
        name: "Clinique Mini Dramatically Different Moisturizing Lotion",
        brand: "Clinique",
        image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&q=80",
        price: 0,
        originalPrice: 490,
        isFree: true,
        variant: "15ml · ของแถม",
        quantity: 1,
      },
      {
        productId: "6",
        name: "Hyaluronic Acid 2% + B5",
        brand: "The Ordinary",
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80",
        price: 490,
        variant: "30ml",
        quantity: 2,
      },
      {
        productId: "6b",
        name: "Niacinamide 10% + Zinc 1%",
        brand: "The Ordinary",
        image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&q=80",
        price: 390,
        originalPrice: 490,
        variant: "30ml",
        quantity: 1,
      },
      {
        productId: "6c",
        name: "AHA 30% + BHA 2% Peeling Solution",
        brand: "The Ordinary",
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80",
        price: 0,
        originalPrice: 590,
        isFree: true,
        variant: "30ml · ของแถม",
        quantity: 1,
      },
    ],
    subtotal: 6030,
    shippingFee: 0,
    discount: 803,
    discountBreakdown: [
      { label: "คูปอง KARM10", amount: 603 },
      { label: "ส่วนลดค่าจัดส่ง", amount: 200 },
    ],
    total: 5227,
    paymentMethod: "บัตรเครดิต Visa •••• 4242",
    paidAt: "2024-04-15T10:35:00Z",
    trackingNumber: "TH123456789",
    shippingProvider: "Kerry Express",
    estimatedDelivery: "2024-04-18",
    recipientName: "ธนิดา โอวาท",
    phone: "089-123-4567",
    address: "88/12 ถ.พระราม 9 ซ.9 ห้วยขวาง กรุงเทพฯ 10310",
  },
  {
    id: "ORD-20240420-002",
    createdAt: "2024-04-20T14:15:00Z",
    status: "shipped",
    items: [
      {
        productId: "4",
        name: "Repair Moisture Balm SPF 25",
        brand: "Reunrom",
        image: "https://images.unsplash.com/photo-1594465919760-441fe5908ab0?w=600&q=80",
        price: 890,
        variant: "30ml",
        quantity: 1,
      },
      {
        productId: "4b",
        name: "Brightening Essence Toner",
        brand: "Reunrom",
        image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80",
        price: 1290,
        variant: "150ml",
        quantity: 1,
      },
      {
        productId: "4c",
        name: "Vitamin C Brightening Serum",
        brand: "Reunrom",
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80",
        price: 1590,
        variant: "30ml",
        quantity: 1,
      },
      {
        productId: "4e",
        name: "Hydra Intense Eye Cream",
        brand: "Reunrom",
        image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&q=80",
        price: 1190,
        variant: "15ml",
        quantity: 1,
      },
      {
        productId: "4f",
        name: "Firming Collagen Night Cream",
        brand: "Reunrom",
        image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&q=80",
        price: 1890,
        variant: "50ml",
        quantity: 1,
      },
      {
        productId: "4d",
        name: "Reunrom Overnight Repair Mask",
        brand: "Reunrom",
        image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80",
        price: 0,
        originalPrice: 790,
        isFree: true,
        variant: "50ml · ของแถม",
        quantity: 1,
      },
    ],
    subtotal: 6850,
    shippingFee: 0,
    discount: 0,
    total: 6850,
    paymentMethod: "QR Promptpay",
    paidAt: "2024-04-20T14:18:00Z",
    trackingNumber: "FE987654321",
    shippingProvider: "Flash Express",
    estimatedDelivery: "2024-04-22",
    recipientName: "ธนิดา โอวาท",
    phone: "089-123-4567",
    address: "88/12 ถ.พระราม 9 ซ.9 ห้วยขวาง กรุงเทพฯ 10310",
  },
  {
    id: "ORD-20240421-007",
    createdAt: "2024-04-21T08:00:00Z",
    status: "shipped",
    items: [
      {
        productId: "cd1",
        name: "Magic Cushion Cover Lasting SPF50",
        brand: "Cathy Doll",
        image: "https://images.unsplash.com/photo-1631214524020-3c69f4d4551c?w=600&q=80",
        price: 590,
        variant: "เบอร์ 03 Honey Beige",
        quantity: 2,
      },
      {
        productId: "cd2",
        name: "Super BB Cream SPF60 PA+++",
        brand: "Cathy Doll",
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80",
        price: 390,
        variant: "เบอร์ 02 Natural",
        quantity: 1,
      },
      {
        productId: "bb1",
        name: "Whitening Body Serum",
        brand: "Baby Bright",
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80",
        price: 290,
        variant: "200ml",
        quantity: 2,
      },
    ],
    subtotal: 1560,
    shippingFee: 0,
    discount: 0,
    total: 1560,
    paymentMethod: "เก็บเงินปลายทาง",
    paidAt: "2024-04-23T11:00:00Z",
    trackingNumber: "KE112233445",
    shippingProvider: "Kerry Express",
    estimatedDelivery: "2024-04-23",
    recipientName: "ธนิดา โอวาท",
    phone: "089-123-4567",
    address: "88/12 ถ.พระราม 9 ซ.9 ห้วยขวาง กรุงเทพฯ 10310",
  },
  {
    id: "ORD-20240422-008",
    createdAt: "2024-04-22T15:30:00Z",
    status: "shipped",
    items: [
      {
        productId: "jj1",
        name: "Collagen Peptide Brightening Serum",
        brand: "Jejuvita",
        image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80",
        price: 1290,
        variant: "30ml",
        quantity: 1,
      },
      {
        productId: "jj2",
        name: "Hydra Boost Moisture Cream",
        brand: "Jejuvita",
        image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&q=80",
        price: 890,
        variant: "50ml",
        quantity: 1,
      },
      {
        productId: "sk1",
        name: "Acne Clear Spot Treatment Gel",
        brand: "Skynlab",
        image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&q=80",
        price: 350,
        variant: "15ml",
        quantity: 2,
      },
      {
        productId: "sk2",
        name: "Oil Control Matte Toner",
        brand: "Skynlab",
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80",
        price: 490,
        variant: "150ml",
        quantity: 1,
      },
    ],
    subtotal: 3370,
    shippingFee: 0,
    discount: 200,
    total: 3170,
    paymentMethod: "บัตรเครดิต Mastercard •••• 5353",
    paidAt: "2024-04-22T15:33:00Z",
    trackingNumber: "BT556677889",
    shippingProvider: "Best Express",
    estimatedDelivery: "2024-04-25",
    recipientName: "ธนิดา โอวาท",
    phone: "089-123-4567",
    address: "88/12 ถ.พระราม 9 ซ.9 ห้วยขวาง กรุงเทพฯ 10310",
  },
  {
    id: "ORD-20240425-003",
    createdAt: "2024-04-25T09:00:00Z",
    status: "processing",
    items: [
      {
        productId: "12",
        name: "Retinol Night Recovery Cream",
        brand: "Bergamo",
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80",
        price: 1890,
        variant: "50ml",
        quantity: 1,
      },
      {
        productId: "12b",
        name: "Peptide Eye Contour Serum",
        brand: "Bergamo",
        image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80",
        price: 1290,
        variant: "15ml",
        quantity: 1,
      },
      {
        productId: "12c",
        name: "Ceramide Barrier Repair Cream",
        brand: "Bergamo",
        image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&q=80",
        price: 990,
        variant: "50ml",
        quantity: 2,
      },
      {
        productId: "12e",
        name: "Luxury Caviar Lifting Serum",
        brand: "Bergamo",
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80",
        price: 2490,
        variant: "30ml",
        quantity: 1,
      },
      {
        productId: "12d",
        name: "Bergamo Mini Cleansing Balm",
        brand: "Bergamo",
        image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80",
        price: 0,
        originalPrice: 590,
        isFree: true,
        variant: "30ml · ของแถม",
        quantity: 1,
      },
      {
        productId: "16",
        name: "Brightening Vitamin C Mask Set",
        brand: "Cathy Doll",
        image: "https://images.unsplash.com/photo-1594465919760-441fe5908ab0?w=600&q=80",
        price: 690,
        variant: "1 ชุด",
        quantity: 1,
      },
      {
        productId: "16b",
        name: "BB Magic Cream SPF60 PA+++",
        brand: "Cathy Doll",
        image: "https://images.unsplash.com/photo-1631214524020-3c69f4d4551c?w=600&q=80",
        price: 390,
        variant: "เบอร์ 02 Natural",
        quantity: 2,
      },
      {
        productId: "16c",
        name: "Watermelon Hydrating Toner",
        brand: "Cathy Doll",
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80",
        price: 290,
        variant: "150ml",
        quantity: 1,
      },
    ],
    subtotal: 8810,
    shippingFee: 0,
    discount: 0,
    total: 8810,
    shippingProvider: "SPX Express",
    recipientName: "ธนิดา โอวาท",
    phone: "089-123-4567",
    address: "88/12 ถ.พระราม 9 ซ.9 ห้วยขวาง กรุงเทพฯ 10310",
  },
  {
    id: "ORD-20240426-004",
    createdAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(), // 3 นาทีที่แล้ว → เหลือ 12 นาที
    status: "pending_payment",
    items: [
      {
        productId: "8",
        name: "Concentrated Ginseng Renewing Serum",
        brand: "Sulwhasoo",
        image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80",
        price: 4590,
        variant: "30ml",
        quantity: 1,
      },
      {
        productId: "8b",
        name: "First Care Activating Serum",
        brand: "Sulwhasoo",
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80",
        price: 3290,
        variant: "60ml",
        quantity: 1,
      },
    ],
    subtotal: 7880,
    shippingFee: 0,
    discount: 0,
    total: 7880,
    recipientName: "ธนิดา โอวาท",
    phone: "089-123-4567",
    address: "88/12 ถ.พระราม 9 ซ.9 ห้วยขวาง กรุงเทพฯ 10310",
  },
  {
    id: "ORD-20240310-005",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 วันที่แล้ว (อยู่ในช่วง 7 วัน)
    status: "delivered",
    items: [
      {
        productId: "2",
        name: "Advanced Génifique Youth Activating Serum",
        brand: "Lancôme",
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80",
        price: 2890,
        variant: "30ml",
        quantity: 1,
      },
      {
        productId: "2b",
        name: "Rénergie H.C.F. Triple Serum",
        brand: "Lancôme",
        image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&q=80",
        price: 3490,
        variant: "50ml",
        quantity: 1,
      },
      {
        productId: "2c",
        name: "Lancôme Mini Génifique Eye Cream",
        brand: "Lancôme",
        image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80",
        price: 0,
        originalPrice: 1290,
        isFree: true,
        variant: "5ml · ของแถม",
        quantity: 1,
      },
    ],
    subtotal: 6380,
    shippingFee: 0,
    discount: 638,
    total: 5742,
    paymentMethod: "บัตรเครดิต Visa •••• 4242",
    paidAt: "2024-03-10T11:25:00Z",
    trackingNumber: "KR112233445",
    shippingProvider: "Kerry Express",
    estimatedDelivery: "2024-03-12",
    recipientName: "ธนิดา โอวาท",
    phone: "089-123-4567",
    address: "88/12 ถ.พระราม 9 ซ.9 ห้วยขวาง กรุงเทพฯ 10310",
  },
  {
    id: "ORD-20240501-009",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: "cancelled",
    items: [
      {
        productId: "cx1",
        name: "Lip Comfort Oil",
        brand: "Clarins",
        image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&q=80",
        price: 890,
        variant: "Honey",
        quantity: 1,
      },
      {
        productId: "cx2",
        name: "Double Serum Complete Age Control Concentrate",
        brand: "Clarins",
        image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80",
        price: 3200,
        variant: "50ml",
        quantity: 1,
      },
    ],
    subtotal: 4090,
    shippingFee: 0,
    discount: 0,
    total: 4090,
    paymentMethod: "PromptPay",
    recipientName: "ธนิด อภิวัฒน์",
    phone: "081-234-5678",
    address: "22/4 ถ.สุขุมวิท 21 วัฒนา กรุงเทพฯ 10110",
  },
  {
    id: "ORD-20240428-010",
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    status: "cancelled",
    items: [
      {
        productId: "lm1",
        name: "Génifique Youth Activating Serum",
        brand: "Lancôme",
        image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80",
        price: 3950,
        variant: "30ml",
        quantity: 1,
      },
      {
        productId: "lm2",
        name: "Rénergie H.C.F. Triple Serum",
        brand: "Lancôme",
        image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&q=80",
        price: 5200,
        variant: "50ml",
        quantity: 1,
      },
      {
        productId: "lm3",
        name: "Teint Idole Ultra Wear Foundation",
        brand: "Lancôme",
        image: "https://images.unsplash.com/photo-1631214524020-3c69f4d4551c?w=600&q=80",
        price: 1990,
        variant: "Shade 02N",
        quantity: 2,
      },
    ],
    subtotal: 13130,
    shippingFee: 0,
    discount: 500,
    discountBreakdown: [{ label: "โค้ด WELCOME500", amount: 500 }],
    total: 12630,
    paymentMethod: "บัตรเครดิต Mastercard •••• 5353",
    recipientName: "ธนิด อภิวัฒน์",
    phone: "081-234-5678",
    address: "22/4 ถ.สุขุมวิท 21 วัฒนา กรุงเทพฯ 10110",
  },
  {
    id: "ORD-20240510-012",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: "delivered",
    items: [
      {
        productId: "bt1",
        name: "Bio-Treatment Essence-in-Oil",
        brand: "Bio-Essence",
        image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&q=80",
        price: 1290,
        variant: "60ml",
        quantity: 1,
        returnStatus: "return_completed",
      },
      {
        productId: "bt2",
        name: "Face Lifting Cream with Royal Jelly",
        brand: "Bio-Essence",
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80",
        price: 1590,
        variant: "40g",
        quantity: 1,
      },
    ],
    subtotal: 2880,
    shippingFee: 0,
    discount: 0,
    total: 2880,
    paymentMethod: "QR Promptpay",
    paidAt: "2024-05-10T09:30:00Z",
    recipientName: "ธนิดา โอวาท",
    phone: "089-123-4567",
    address: "88/12 ถ.พระราม 9 ซ.9 ห้วยขวาง กรุงเทพฯ 10310",
  },
  {
    id: "ORD-20240512-013",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    status: "processing",
    items: [
      {
        productId: "su1",
        name: "Concentrated Ginseng Renewing Serum",
        brand: "Sulwhasoo",
        image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80",
        price: 4590,
        variant: "30ml",
        quantity: 1,
      },
      {
        productId: "su2",
        name: "Essential Comfort Balancing Water",
        brand: "Sulwhasoo",
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80",
        price: 2890,
        variant: "150ml",
        quantity: 1,
      },
      {
        productId: "su3",
        name: "Timetreasure Invigorating Cream",
        brand: "Sulwhasoo",
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80",
        price: 6200,
        variant: "50ml",
        quantity: 1,
      },
      {
        productId: "su4",
        name: "Bloomstay Vitalizing Eye Cream",
        brand: "Sulwhasoo",
        image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&q=80",
        price: 3490,
        variant: "20ml",
        quantity: 1,
      },
      {
        productId: "su5",
        name: "Sulwhasoo Mini First Care Activating Serum",
        brand: "Sulwhasoo",
        image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80",
        price: 0,
        originalPrice: 1490,
        isFree: true,
        variant: "15ml · ของแถม",
        quantity: 1,
      },
    ],
    subtotal: 17170,
    shippingFee: 0,
    discount: 1000,
    discountBreakdown: [{ label: "คูปอง SULW1000", amount: 1000 }],
    total: 16170,
    paymentMethod: "บัตรเครดิต Visa •••• 4242",
    paidAt: new Date(Date.now() - 6 * 60 * 60 * 1000 + 3 * 60 * 1000).toISOString(),
    recipientName: "ธนิดา โอวาท",
    phone: "089-123-4567",
    address: "88/12 ถ.พระราม 9 ซ.9 ห้วยขวาง กรุงเทพฯ 10310",
  },
  {
    id: "ORD-20240513-014",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "shipped",
    items: [
      {
        productId: "lm10",
        name: "Advanced Génifique Youth Activating Serum",
        brand: "Lancôme",
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80",
        price: 3490,
        variant: "50ml",
        quantity: 1,
      },
      {
        productId: "lm11",
        name: "Absolue Soft Cream",
        brand: "Lancôme",
        image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&q=80",
        price: 5900,
        variant: "60ml",
        quantity: 1,
      },
      {
        productId: "lm12",
        name: "Teint Idole Ultra Wear Foundation",
        brand: "Lancôme",
        image: "https://images.unsplash.com/photo-1631214524020-3c69f4d4551c?w=600&q=80",
        price: 1990,
        variant: "Shade 115W Warm Ivory",
        quantity: 1,
      },
      {
        productId: "lm13",
        name: "L'Absolu Rouge Drama Matte",
        brand: "Lancôme",
        image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&q=80",
        price: 1290,
        variant: "No.82 Rouge Framboise",
        quantity: 2,
      },
      {
        productId: "lm14",
        name: "Lancôme Mini Mascara Hypnôse",
        brand: "Lancôme",
        image: "https://images.unsplash.com/photo-1594465919760-441fe5908ab0?w=600&q=80",
        price: 0,
        originalPrice: 890,
        isFree: true,
        variant: "6ml · ของแถม",
        quantity: 1,
      },
    ],
    subtotal: 13960,
    shippingFee: 0,
    discount: 0,
    total: 13960,
    paymentMethod: "บัตรเครดิต Mastercard •••• 5353",
    paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 1000).toISOString(),
    trackingNumber: "KE334455667",
    shippingProvider: "Kerry Express",
    estimatedDelivery: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    recipientName: "ธนิดา โอวาท",
    phone: "089-123-4567",
    address: "88/12 ถ.พระราม 9 ซ.9 ห้วยขวาง กรุงเทพฯ 10310",
  },
  {
    id: "ORD-20240511-015",
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    status: "cancelled",
    items: [
      {
        productId: "nn1",
        name: "Hyaluronic Acid 2% + B5",
        brand: "The Ordinary",
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80",
        price: 490,
        variant: "30ml",
        quantity: 3,
      },
      {
        productId: "nn2",
        name: "Niacinamide 10% + Zinc 1%",
        brand: "The Ordinary",
        image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&q=80",
        price: 390,
        variant: "30ml",
        quantity: 2,
      },
      {
        productId: "nn3",
        name: "Retinol 0.5% in Squalane",
        brand: "The Ordinary",
        image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&q=80",
        price: 790,
        variant: "30ml",
        quantity: 1,
      },
      {
        productId: "nn4",
        name: "Alpha Arbutin 2% + HA",
        brand: "The Ordinary",
        image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80",
        price: 590,
        variant: "30ml",
        quantity: 2,
      },
      {
        productId: "nn5",
        name: "Peeling Solution AHA 30% + BHA 2%",
        brand: "The Ordinary",
        image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80",
        price: 690,
        variant: "30ml",
        quantity: 1,
      },
    ],
    subtotal: 4600,
    shippingFee: 0,
    discount: 460,
    discountBreakdown: [{ label: "คูปอง ORD10", amount: 460 }],
    total: 4140,
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
      version: 14,
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
