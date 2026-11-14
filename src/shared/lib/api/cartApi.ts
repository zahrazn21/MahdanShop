import type {
  AddToCartInput,
  CartResponse,
  UpdateCartInput,
} from "@/src/shared/types/cart";
import { json, request } from "./http";

const opts = { credentials: "include" as const };

export const cartApi = {
  get: () =>
    request<CartResponse>("/api/cart", { ...opts, cache: "no-store" }),

  add: (input: AddToCartInput) =>
    request<unknown>("/api/cart", { method: "POST", ...opts, ...json(input) }),

  update: ({ id, quantity }: UpdateCartInput) =>
    request<unknown>(`/api/cart?id=${encodeURIComponent(id)}`, {
      method: "PUT",
      ...opts,
      ...json({ quantity }),
    }),

  remove: (id: string) =>
    request<unknown>(`/api/cart?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
      ...opts,
    }),
};