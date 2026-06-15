export interface ProductFreeGift {
  productId: string;
  name: string;
  image: string;
  originalPrice: number;
  quantity: number;
  maxPerUnit?: number;
  minQty?: number;
  brand?: string;
  isThreshold?: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  href?: string;
  rank?: number;
  badge?: "hot";
  category?: string;
  rating?: number;
  reviewCount?: number;
  freeGifts?: ProductFreeGift[];
  customBrandColor?: string;
  unavailableRegions?: string[];
}

export interface FlashDealProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  image: string;
  sold: number;
  total: number;
  endsAt: string;
  rating?: number;
  reviewCount?: number;
  badge?: "hot";
}

export interface ProductListParams {
  category?: string;
  brand?: string;
  search?: string;
  sort?: "price_asc" | "price_desc" | "rating" | "newest";
  page?: number;
  limit?: number;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}
