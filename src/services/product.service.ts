// TODO: remove mock, reads from NEXT_PUBLIC_API_URL
import { apiClient } from "@/lib/api-client";
import type { Product, FlashDealProduct, ProductListParams, ProductListResponse } from "@/types/product";
import { PRODUCTS, FLASH_DEAL_PRODUCTS } from "@/lib/mock-data";

const USE_MOCK = !process.env.NEXT_PUBLIC_API_BASE_URL && !process.env.NEXT_PUBLIC_API_URL;

export async function getProducts(params: ProductListParams = {}): Promise<ProductListResponse> {
  if (!USE_MOCK) {
    return apiClient.get<ProductListResponse>("/api/products", { params: params as Record<string, string> });
  }

  let results = PRODUCTS as Product[];

  if (params.category) results = results.filter((p) => p.category === params.category);
  if (params.brand)    results = results.filter((p) => p.brand === params.brand);
  if (params.search) {
    const q = params.search.toLowerCase();
    results = results.filter((p) => p.name.toLowerCase().includes(q));
  }

  const page  = params.page  ?? 1;
  const limit = params.limit ?? results.length;
  const start = (page - 1) * limit;

  return {
    products:   results.slice(start, start + limit),
    total:      results.length,
    page,
    totalPages: Math.ceil(results.length / limit),
  };
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!USE_MOCK) {
    return apiClient.get<Product>(`/api/products/${id}`);
  }
  return (PRODUCTS as Product[]).find((p) => p.id === id) ?? null;
}

export async function getFlashDealProducts(): Promise<FlashDealProduct[]> {
  if (!USE_MOCK) {
    return apiClient.get<FlashDealProduct[]>("/api/campaigns/flash-sale/products");
  }
  return FLASH_DEAL_PRODUCTS as FlashDealProduct[];
}

// ── Service object (swap mock → real by setting NEXT_PUBLIC_API_URL) ──────────

export const productService = {
  /**
   * List products with optional filters.
   *
   * API: GET /api/products
   * Query: type?, brand?, search?
   * Response: Product[]
   */
  async getAll(params?: { type?: string; brand?: string; search?: string }): Promise<Product[]> {
    // API: GET /api/products
    // Request: { type?, brand?, search? }
    // Response: Product[]
    if (USE_MOCK) {
      let results = PRODUCTS as Product[];
      if (params?.type)   results = results.filter((p) => p.category === params.type);
      if (params?.brand)  results = results.filter((p) => p.brand === params.brand);
      if (params?.search) {
        const q = params.search.toLowerCase();
        results = results.filter((p) => p.name.toLowerCase().includes(q));
      }
      return results;
    }
    return apiClient.get<Product[]>("/api/products", {
      params: params as Record<string, string | number | boolean | undefined>,
    });
  },

  /**
   * Fetch a single product by ID.
   *
   * API: GET /api/products/:id
   * Response: Product
   */
  async getById(id: string): Promise<Product> {
    // API: GET /api/products/:id
    // Request: (id in path)
    // Response: Product
    if (USE_MOCK) {
      const product = (PRODUCTS as Product[]).find((p) => p.id === id);
      if (!product) throw new Error(`Product ${id} not found`);
      return product;
    }
    return apiClient.get<Product>(`/api/products/${id}`);
  },

  /**
   * Fetch related products for a given product ID.
   *
   * API: GET /api/products/:id/related
   * Response: Product[]
   */
  async getRelated(id: string): Promise<Product[]> {
    // API: GET /api/products/:id/related
    // Request: (id in path)
    // Response: Product[]
    if (USE_MOCK) {
      const source = (PRODUCTS as Product[]).find((p) => p.id === id);
      if (!source) return [];
      return (PRODUCTS as Product[])
        .filter((p) => p.id !== id && p.category === source.category)
        .slice(0, 6);
    }
    return apiClient.get<Product[]>(`/api/products/${id}/related`);
  },
};
