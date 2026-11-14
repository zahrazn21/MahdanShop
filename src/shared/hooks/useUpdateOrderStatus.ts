"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "WAITING_CONFIRMATION"
  | "CONFIRMED"
  | "PREPARING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

interface UpdateOrderStatusParams {
  orderId: string;
  status: OrderStatus;
  trackingNumber?: string;
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      status,
      trackingNumber,
    }: UpdateOrderStatusParams) => {
      const res = await fetch(
        `/api/admin/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            status,
            trackingNumber,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.error || "خطا در تغییر وضعیت سفارش",
        );
      }

      return data;
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-orders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-order", variables.orderId],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-dashboard"],
      });
    },
  });
}