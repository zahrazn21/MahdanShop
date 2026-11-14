"use client";

import { OrderData } from "@/src/shared/types/checkout";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface CreateOrderResponse {
  success: boolean;
  orderId: string;
  totalPrice: number;
  paymentStatus: "PENDING" | "REVIEW" | "PAID" | "REJECTED";
  status:
    | "PENDING_PAYMENT"
    | "WAITING_CONFIRMATION"
    | "CONFIRMED"
    | "PREPARING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";
  message: string;
}

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<CreateOrderResponse, Error, OrderData>({
    mutationFn: async (
      orderData: OrderData,
    ): Promise<CreateOrderResponse> => {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.error || "خطا در ثبت سفارش",
        );
      }

      return data;
    },

    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
      router.push(`/payment/${data.orderId}`);
    },
  });
};