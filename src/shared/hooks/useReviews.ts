"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

interface ReviewUser {
  username: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  imageUrls: string[];
  createdAt: string;
  user: ReviewUser;
}

interface ReviewsResponse {
  rating: number | null;
  reviewCount: number;
  reviews: Review[];
}

interface CreateReviewData {
  rating: number;
  comment: string;
  images?: File[];
}

interface CreateReviewResponse {
  message: string;
  review: {
    id: string;
    rating: number;
    comment: string;
    imageUrls: string[];
    status: string;
    createdAt: string;
  };
}

async function fetchReviews(
  productId: string,
): Promise<ReviewsResponse> {
  const res = await fetch(
    `/api/products/${productId}/reviews`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message || "خطا در دریافت نظرات",
    );
  }

  return data;
}

async function createReview(
  productId: string,
  data: CreateReviewData,
): Promise<CreateReviewResponse> {
  const formData = new FormData();

  formData.append(
    "rating",
    String(data.rating),
  );

  formData.append(
    "comment",
    data.comment,
  );

  for (const image of data.images ?? []) {
    formData.append("images", image);
  }

  const res = await fetch(
    `/api/products/${productId}/reviews`,
    {
      method: "POST",
      credentials: "include",
      body: formData,
    },
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.message || "خطا در ثبت نظر",
    );
  }

  return result;
}

export function useReviews(productId: string) {
  const queryClient = useQueryClient();

  const reviewsQuery =
    useQuery<ReviewsResponse>({
      queryKey: ["reviews", productId],
      queryFn: () => fetchReviews(productId),
      enabled: Boolean(productId),
    });

  const reviewMutation = useMutation<
    CreateReviewResponse,
    Error,
    CreateReviewData
  >({
    mutationFn: (data) =>
      createReview(productId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reviews", productId],
      });

      queryClient.invalidateQueries({
        queryKey: ["product", productId],
      });
    },
  });

  return {
    reviews:
      reviewsQuery.data?.reviews ?? [],

    rating:
      reviewsQuery.data?.rating ?? 0,

    reviewCount:
      reviewsQuery.data?.reviewCount ?? 0,

    isLoading:
      reviewsQuery.isLoading,

    isFetching:
      reviewsQuery.isFetching,

    error:
      reviewsQuery.error,

    submitReview:
      reviewMutation.mutateAsync,

    isSubmitting:
      reviewMutation.isPending,

    submitError:
      reviewMutation.error,

    refetchReviews:
      reviewsQuery.refetch,
  };
}
