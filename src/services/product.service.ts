import type { Product, FlashDealProduct, ProductListParams, ProductListResponse } from "@/types/product";

// Mock import — replace with apiClient calls when backend is ready
import { PRODUCTS, FLASH_DEAL_PRODUCTS } from "@/lib/mock-data";

export async function getProducts(params: ProductListParams = {}): Promise<ProductListResponse> {
  // TODO: return apiClient.get<ProductListResponse>("/api/products", { params })
  let results = PRODUCTS as Product[];

  if (params.category) {
    results = results.filter((p) => p.category === params.category);
  }
  if (params.brand) {
    results = results.filter((p) => p.brand === params.brand);
  }
  if (params.search) {
    const q = params.search.toLowerCase();
    results = results.filter((p) => p.name.toLowerCase().includes(q));
  }

  const page = params.page ?? 1;
  const limit = params.limit ?? results.length;
  const start = (page - 1) * limit;

  return {
    products: results.slice(start, start + limit),
    total: results.length,
    page,
    totalPages: Math.ceil(results.length / limit),
  };
}

export async function getProductById(id: string): Promise<Product | null> {
  // TODO: return apiClient.get<Product>(`/api/products/${id}`)
  const product = (PRODUCTS as Product[]).find((p) => p.id === id);
  return product ?? null;
}

export async function getFlashDealProducts(): Promise<FlashDealProduct[]> {
  // TODO: return apiClient.get<FlashDealProduct[]>("/api/campaigns/flash-sale/products")
  return FLASH_DEAL_PRODUCTS as FlashDealProduct[];
}
