export interface SavedAddress {
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

export interface ShippingOption {
  id: string;
  name: string;
  eta: string;
  fee: number;
  promoFee: number;
}

export type PaymentMethod = "card" | "promptpay" | "cod" | "bank";

export interface SavedCard {
  id: string;
  last4: string;
  brand: string;
  name?: string;
}

export interface SavedBank {
  id: string;
  bankId: string;
  accountNo: string;
  name: string;
}

export interface PlaceOrderPayload {
  addressId: string;
  shippingId: string;
  paymentMethod: PaymentMethod | string;
  cartItemIds: string[];
  couponCode?: string;
}

export interface PlaceOrderResponse {
  orderId: string;
  paymentUrl?: string;
  qrData?: string;
  total: number;
}
