// API Request/Response TypeScript interfaces
// Used by service layer — keep in sync with backend contracts

// ── Auth ──────────────────────────────────────────────────────────────────────

export interface LoginRequest {
  email?: string;
  phone?: string;
  password?: string;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  user: User;
}

export interface RegisterRequest {
  email?: string;
  phone?: string;
  name: string;
  password?: string;
}

export interface RegisterResponse {
  success: boolean;
  message?: string;
}

export interface OtpSendRequest {
  /** Email address or phone number */
  identifier: string;
}

export interface OtpSendResponse {
  success: boolean;
  maskedDestination?: string;
}

export interface OtpVerifyRequest {
  identifier: string;
  otp: string;
}

export interface OtpVerifyResponse {
  token: string;
  refreshToken?: string;
  user: User;
}

// ── Admin Auth ────────────────────────────────────────────────────────────────

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  token: string;
  admin: AdminUser;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "super_admin";
}

// ── User ──────────────────────────────────────────────────────────────────────

export type MemberTier = "Silver" | "Gold" | "Platinum" | "Diamond";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  tier?: MemberTier;
  points?: number;
  gender?: "male" | "female" | "other";
  birthday?: string;
}

// ── Product ───────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  images: string[];
  /** Primary image — convenience alias for images[0] */
  image?: string;
  category?: string;
  stock?: number;
  rating?: number;
  reviewCount?: number;
  badge?: "hot";
  href?: string;
}

// ── Cart ──────────────────────────────────────────────────────────────────────

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  originalPrice?: number;
  variant: string;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  couponCode?: string;
  discount?: number;
  total?: number;
}

// ── Order ─────────────────────────────────────────────────────────────────────

export type OrderStatus =
  | "pending_payment"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

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
}

export interface Order {
  id: string;
  createdAt: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
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

// ── Address ───────────────────────────────────────────────────────────────────

export interface Address {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  district: string;
  subDistrict: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
  country?: string;
}
