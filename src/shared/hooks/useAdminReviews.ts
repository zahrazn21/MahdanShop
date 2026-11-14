"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";


export type ReviewStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export interface AdminReview {
  id: string;

  rating: number;

  comment: string;

  status: ReviewStatus;

  adminNote: string | null;

  createdAt: string;

  updatedAt: string;

  user: {
    id: string;

    username: string;

    email: string;
  };

  product: {
    id: string;

    name: string;

    slug: string;

    image: string;
  };
}

export interface ReviewsResponse {
  reviews: AdminReview[];
}

async function fetchAdminReviews(): Promise<ReviewsResponse> {
  const response = await fetch(
    "/api/admin/reviews",
    {
      method: "GET",

      credentials: "include",

      cache: "no-store",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error ||
        data?.message ||
        "خطا در دریافت نظرات",
    );
  }

  return data;
}

export function useAdminReviews() {
  return useQuery<ReviewsResponse>({
    queryKey: ["admin-reviews"],

    queryFn: fetchAdminReviews,

    staleTime: 30 * 1000,

    refetchOnWindowFocus: true,
  });
}
export function useUpdateReviewStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;

      status: "APPROVED" | "REJECTED";
    }) => {
      const response = await fetch(
        `/api/admin/reviews/${id}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            status,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            data?.message ||
            "خطا در تغییر وضعیت نظر",
        );
      }

      return data;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin-reviews"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["product"],
      });
    },
  });
}