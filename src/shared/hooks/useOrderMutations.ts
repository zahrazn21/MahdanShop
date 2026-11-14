import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderKeys } from "./useOrders";
import { orderApi } from "../lib/api/orderApi";
import { toast } from "sonner";

function useOrderMutation<TVars = void>(
  orderId: string,
  fn: (vars: TVars) => Promise<unknown>,
  successMessage: string,
) {
  const qc = useQueryClient();
  return useMutation<unknown, Error, TVars>({
    mutationFn: fn,
    onSuccess: () => {
      toast.success(successMessage);
      return qc.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
    },
    onError: (e) => toast.error(e.message),
  });
}

export const useSubmitOrderPayment = (orderId: string) =>
  useOrderMutation(
    orderId,
    async (file: File) => {
      const url = await orderApi.uploadImage(file);
      return orderApi.submitPayment(orderId, url);
    },
    "رسید با موفقیت ارسال شد و در انتظار بررسی ادمین است.",
  );

export const useResetPayment = (orderId: string) =>
  useOrderMutation(
    orderId,
    () => orderApi.resetPayment(orderId),
    "رسید قبلی حذف شد، اکنون می‌توانید رسید جدید ارسال کنید.",
  );
  
export const useSubmitFreightPayment = (orderId: string, shipmentId: string) =>
  useOrderMutation(
    orderId,
    async (file: File) => {
      const url = await orderApi.uploadImage(file);
      return orderApi.submitFreightPayment(orderId, shipmentId, url);
    },
    "رسید باربری با موفقیت ارسال شد و در انتظار بررسی ادمین است.",
  );
