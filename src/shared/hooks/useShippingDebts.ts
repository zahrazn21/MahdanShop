import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { shippingDebtsApi } from "@/src/shared/lib/api/shippingDebtsApi";
import { uploadImage } from "@/src/shared/lib/api/http";

export const shippingDebtKeys = {
  all: ["shipping-debts"] as const,
};

export function useShippingDebts() {
  return useQuery({
    queryKey: shippingDebtKeys.all,
    queryFn: shippingDebtsApi.list,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
}
interface PayVars {
  file: File;
  parcelBatchIds: string[];
  shipmentIds: string[];
}

export function usePayShippingDebts() {
  const qc = useQueryClient();

  return useMutation<unknown, Error, PayVars>({
    mutationFn: async ({ file, ...ids }) => {
      const receiptImage = await uploadImage(file);

      return shippingDebtsApi.pay({
        ...ids,
        receiptImage,
      });
    },

    onSuccess: async () => {
      toast.success(
        "رسید پرداخت ثبت شد و در انتظار بررسی ادمین است.",
      );
      await qc.invalidateQueries({
        queryKey: shippingDebtKeys.all,
        refetchType: "active",
      });

      await qc.invalidateQueries({
        queryKey: ["orders"],
      });
    },

    onError: (e) => {
      toast.error(e.message);
    },
  });
}