export interface CartFreeGift {
  productId: string;
  name: string;
  image: string;
  originalPrice: number;
  quantity: number;
  maxPerUnit: number;
  minQty: number;
  brand?: string;
  isThreshold?: boolean;
}

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
  freeGifts?: CartFreeGift[];
}

export interface CouponValidatePayload {
  code: string;
  subtotal: number;
}

export interface CouponValidateResponse {
  valid: boolean;
  discountPercent?: number;
  discountAmount?: number;
  message?: string;
}
