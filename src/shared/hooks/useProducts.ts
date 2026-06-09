// hooks/useProducts.ts
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../lib/api";

interface UseProductsParams {
  scope?: string;
  category?: string;
  sortBy?: string;
  minPrice?: string;
  maxPrice?: string;
  inStock?: boolean;
  onSale?: boolean;
  search?: string;
}

export function useProducts({
  scope,
  category,
  sortBy,
  minPrice,
  maxPrice,
  inStock,
  onSale,
  search,
}: UseProductsParams = {}) {
  const params = new URLSearchParams();

  if (scope && scope !== "all") params.set("scope", scope);
  
  if (category) params.set("category", category);
  
  if (sortBy && sortBy !== "newest") params.set("sortBy", sortBy);
  
  if (minPrice) params.set("minPrice", minPrice);
  if (maxPrice) params.set("maxPrice", maxPrice);
  
  if (inStock) params.set("available", "true");
  if (onSale) params.set("onSale", "true");
  
  if (search) params.set("search", search);

  const query = params.toString();
  const url = `/api/products${query ? `?${query}` : ""}`;

  return useQuery({
    queryKey: ["products", scope, category, sortBy, minPrice, maxPrice, inStock, onSale, search],
    queryFn: () => fetcher(url),
    staleTime: 5 * 60 * 1000,
  });
}



export function useProductsFromURL() {
  const searchParams = typeof window !== "undefined" 
    ? new URLSearchParams(window.location.search)
    : new URLSearchParams();
  
  return useProducts({
    scope: searchParams.get("scope") || undefined,
    category: searchParams.get("category") || undefined,
    sortBy: searchParams.get("sortBy") || undefined,
    minPrice: searchParams.get("minPrice") || undefined,
    maxPrice: searchParams.get("maxPrice") || undefined,
    inStock: searchParams.get("inStock") === "true",
    onSale: searchParams.get("onSale") === "true",
    search: searchParams.get("search") || undefined,
  });
}