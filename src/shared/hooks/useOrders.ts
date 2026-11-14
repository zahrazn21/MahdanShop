
import { useQuery } from "@tanstack/react-query";
import { orderApi } from "../lib/api/orderApi";

export const orderKeys = {
  detail: (id: string) => ["orders", id] as const,
};

export function useOrder(id?: string) {
  return useQuery({
    queryKey: orderKeys.detail(id!),
    queryFn: () => orderApi.get(id!),
    enabled: !!id,
  });
}