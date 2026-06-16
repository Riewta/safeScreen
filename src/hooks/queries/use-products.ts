"use client";

import { useQuery } from "@tanstack/react-query";
import { getProducts, getProductById, getFlashDealProducts } from "@/services/product.service";
import type { ProductListParams } from "@/types";

export const productKeys = {
  all:        ["products"] as const,
  list:       (params: ProductListParams) => ["products", "list", params] as const,
  detail:     (id: string)               => ["products", "detail", id]   as const,
  flashDeals: ()                         => ["products", "flash-deals"]  as const,
};

export function useProducts(params: ProductListParams = {}) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn:  () => getProducts(params),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn:  () => getProductById(id),
    enabled:  !!id,
  });
}

export function useFlashDealProducts() {
  return useQuery({
    queryKey: productKeys.flashDeals(),
    queryFn:  getFlashDealProducts,
    staleTime: 1000 * 60,
  });
}
