"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { fetcher } from "../lib/api";

interface UseProductsParams {
  scope?: string;
  category?: string;
  sortBy?: "newest" | "oldest" | "price-low" | "price-high" | "best-selling" | string;
  minPrice?: string;
  maxPrice?: string;
  inStock?: boolean;
  onSale?: boolean;
  search?: string;
  page?: number;
  limit?: number;
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
  page = 1,
  limit = 30,
}: UseProductsParams = {}) {
  const params = new URLSearchParams();

  if (scope && scope !== "all") {
    params.set("scope", scope);
  }

  if (category) {
    params.set("category", category);
  }

  if (sortBy && sortBy !== "newest") {
    params.set("sortBy", sortBy);
  }

  if (minPrice) {
    params.set("minPrice", minPrice);
  }

  if (maxPrice) {
    params.set("maxPrice", maxPrice);
  }

  if (inStock) {
    params.set("inStock", "true");
  }

  if (onSale) {
    params.set("onSale", "true");
  }

  if (search?.trim()) {
    params.set("search", search.trim());
  }

  params.set("page", String(page));
  params.set("limit", String(limit));

  const query = params.toString();

  const url = `/api/products${query ? `?${query}` : ""}`;

  return useQuery({
    queryKey: [
      "products",
      {
        scope: scope ?? "",
        category: category ?? "",
        sortBy: sortBy ?? "",
        minPrice: minPrice ?? "",
        maxPrice: maxPrice ?? "",
        inStock: inStock ?? false,
        onSale: onSale ?? false,
        search: search?.trim() ?? "",
        page,
        limit,
      },
    ],

    queryFn: () => fetcher(url),

    staleTime: 5 * 60 * 1000,
  });
}

export function useProductsFromURL() {
  const searchParams = useSearchParams();

  return useProducts({
    scope: searchParams.get("scope") || undefined,
    category: searchParams.get("category") || undefined,
    sortBy: searchParams.get("sortBy") || undefined,
    minPrice: searchParams.get("minPrice") || undefined,
    maxPrice: searchParams.get("maxPrice") || undefined,
    inStock: searchParams.get("inStock") === "true",
    onSale: searchParams.get("onSale") === "true",
    search: searchParams.get("search") || undefined,
    page: Math.max(1, Number(searchParams.get("page") || "1")),
    limit: Math.max(1, Number(searchParams.get("limit") || "30")),
  });
}
