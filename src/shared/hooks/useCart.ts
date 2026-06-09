
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// ================= GET CART =================
export const useCart = () => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await fetch('/api/cart');
      if (!res.ok) throw new Error('خطا در دریافت سبد خرید');
      return res.json();
    },
  });
};


// ================= ADD TO CART =================
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { productId: string; quantity?: number }) => {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('خطا در افزودن به سبد خرید');
      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

// ================= UPDATE QUANTITY =================
export const useUpdateCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      const res = await fetch(`/api/cart?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });

      if (!res.ok) throw new Error('خطا در بروزرسانی تعداد');
      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

// ================= REMOVE ITEM =================
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/cart?id=${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('خطا در حذف از سبد خرید');
      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useCartActions = () => {
  const { data, isLoading, error } = useCart();

  const addToCart = useAddToCart();
  const updateCart = useUpdateCart();
  const removeFromCart = useRemoveFromCart();

  return {
    cart: data?.items || [],
    itemCount: data?.itemCount || 0,
    totalPrice: data?.totalPrice || 0,

    isLoading,
    error,

    addToCart: addToCart.mutate,
    updateCart: updateCart.mutate,
    removeFromCart: removeFromCart.mutate,

    isAdding: addToCart.isPending,
    isUpdating: updateCart.isPending,
    isRemoving: removeFromCart.isPending,
  };
};