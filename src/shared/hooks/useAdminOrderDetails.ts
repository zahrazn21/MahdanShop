"use client";

import { useQuery } from "@tanstack/react-query";

export function useAdminOrderDetails(orderId: string | null) {
  return useQuery({
    queryKey: ["admin-order", orderId],
    queryFn: async () => {
      if (!orderId) return null;
      const res = await fetch(`/api/admin/orders/${orderId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "خطا در دریافت جزئیات سفارش");
      }

      return data.order;
    },
    enabled: !!orderId,
    staleTime: 30 * 1000,
  });
}