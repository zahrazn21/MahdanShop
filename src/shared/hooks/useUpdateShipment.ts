"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

export type ShipmentStatus =
  | "PENDING"
  | "WAITING_IMPORT"
  | "WAITING_FOR_FREIGHT"
  | "READY_TO_SHIP"
  | "SHIPPED"
  | "DELIVERED";

interface UpdateShipmentParams {
  shipmentId: string;
  status: ShipmentStatus;
  trackingNumber?: string;
}

export function useUpdateShipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      shipmentId,
      status,
      trackingNumber,
    }: UpdateShipmentParams) => {
      const res = await fetch(
        `/api/admin/shipments/${shipmentId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
            trackingNumber,
          }),
        },
      );

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          data?.error ||
            data?.message ||
            "خطا در به‌روزرسانی مرسوله",
        );
      }

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-orders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-order"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-shipments"],
      });
    },
  });
}