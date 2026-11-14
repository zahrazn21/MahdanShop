"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

interface ReviewPaymentParams {
  orderId: string;

  action: "APPROVE" | "REJECT";

  adminNote?: string;

  rejectionReason?: string;
}

export function useReviewAdminPayment() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      action,
      adminNote,
      rejectionReason,
    }: ReviewPaymentParams) => {
      const response = await fetch(
        `/api/admin/orders/${orderId}/payment`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            action,
            adminNote,
            rejectionReason,
          }),
        },
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "خطا در بررسی پرداخت",
        );
      }

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-orders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-payments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-dashboard"],
      });
    },
  });
}