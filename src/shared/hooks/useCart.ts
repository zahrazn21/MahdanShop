"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { cartApi } from "@/src/shared/lib/api/cartApi";

import type {
  AddToCartInput,
  CartResponse,
  UpdateCartInput,
} from "@/src/shared/types/cart";

export const cartKeys = {
  all: ["cart"] as const,
};

export function useCart() {
  return useQuery({
    queryKey: cartKeys.all,
    queryFn: cartApi.get,
    staleTime: 10_000,
  });
}

function useInvalidateCart() {
  const qc = useQueryClient();

  return () => {
    qc.invalidateQueries({
      queryKey: cartKeys.all,
    });
  };
}

export function useAddToCart() {
  const invalidate = useInvalidateCart();

  return useMutation<unknown, Error, AddToCartInput>({
    mutationFn: cartApi.add,

    onSuccess: invalidate,

    onError: (e) => {
      toast.error(e.message);
    },
  });
}

export function useUpdateCart() {
  const qc = useQueryClient();

  return useMutation<
    unknown,
    Error,
    UpdateCartInput,
    { previous?: CartResponse }
  >({
    mutationFn: cartApi.update,

    onMutate: async ({ id, quantity }) => {
      await qc.cancelQueries({
        queryKey: cartKeys.all,
      });

      const previous =
        qc.getQueryData<CartResponse>(cartKeys.all);

      if (previous) {
        qc.setQueryData<CartResponse>(cartKeys.all, {
          ...previous,

          items: previous.items.map((i) =>
            i.id === id
              ? {
                  ...i,
                  quantity,
                }
              : i,
          ),
        });
      }

      return {
        previous,
      };
    },

    onError: (e, _vars, ctx) => {
      if (ctx?.previous) {
        qc.setQueryData(
          cartKeys.all,
          ctx.previous,
        );
      }

      toast.error(e.message);
    },

    onSettled: () => {
      qc.invalidateQueries({
        queryKey: cartKeys.all,
      });
    },
  });
}

export function useRemoveFromCart() {
  const invalidate = useInvalidateCart();

  return useMutation<unknown, Error, string>({
    mutationFn: cartApi.remove,

    onSuccess: invalidate,

    onError: (e) => {
      toast.error(e.message);
    },
  });
}

const EMPTY: CartResponse["items"] = [];

export function useCartActions() {
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useCart();

  const add = useAddToCart();
  const update = useUpdateCart();
  const remove = useRemoveFromCart();

  return {
    cart: data?.items ?? EMPTY,
    itemCount: data?.itemCount ?? 0,

    totalPrice: data?.totalPrice ?? 0,

    totalDiscount: data?.totalDiscount ?? 0,

    finalPrice: data?.finalPrice ?? 0,

    shippingCost: data?.shippingCost ?? 0,

    importedFreightCost:
      data?.importedFreightCost ?? 0,

    hasImportedItems:
      data?.hasImportedItems ?? false,

    hasDomesticItems:
      data?.hasDomesticItems ?? false,

    isLoading,
    isFetching,
    error,
    refetch,

    addToCart: add.mutate,
    addToCartAsync: add.mutateAsync,

    updateCart: update.mutate,
    removeFromCart: remove.mutate,

    isAdding: add.isPending,

    isMutating:
      add.isPending ||
      update.isPending ||
      remove.isPending,

    updatingId: update.isPending
      ? update.variables?.id
      : undefined,

    removingId: remove.isPending
      ? remove.variables
      : undefined,
  };
}
