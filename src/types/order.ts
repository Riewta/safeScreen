export type OrderStatus =
  | "pending_payment"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type ReturnStatus =
  | "return_requested"
  | "return_pending"
  | "return_completed";

export interface OrderItem {
  productId: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  originalPrice?: number;
  isFree?: boolean;
  variant: string;
  quantity: number;
  reviewId?: string;
  returnStatus?: ReturnStatus;
}

export interface Order {
  id: string;
  createdAt: string;
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
  rating: number;
  comment: string;
  user?: string;
  avatar?: string;
  images?: string[];
  anonymous?: boolean;
  createdAt: string;
}

export interface SubmitReviewPayload {
  orderId: string;
  productId: string;
  rating: number;
  comment: string;
  images?: string[];
  anonymous?: boolean;
}

export interface SubmitReturnPayload {
  orderId: string;
  productIds: string[];
  reason?: string;
}
