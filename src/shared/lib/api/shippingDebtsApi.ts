import type {
  PayDebtsInput,
  ShippingDebtsResponse,
} from "@/src/shared/types/shippingDebt";
import { json, request } from "./http";

export const shippingDebtsApi = {
  list: () =>
    request<ShippingDebtsResponse>("/api/shipping-debts", {
      cache: "no-store",
    }),

  pay: (input: PayDebtsInput) =>
    request<{ success?: boolean }>("/api/shipping-debts/pay", {
      method: "POST",
      ...json(input),
    }),
};