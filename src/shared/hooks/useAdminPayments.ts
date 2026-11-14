"use client";

import { useQuery } from "@tanstack/react-query";


export type PaymentReviewStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export type PaymentMethod = "CARD_TO_CARD";


export type OrderPaymentStatus =
  | "PENDING"
  | "REVIEW"
  | "PAID"
  | "REJECTED";

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "WAITING_CONFIRMATION"
  | "CONFIRMED"
  | "PROCESSING"
  | "PARTIALLY_SHIPPED"
  | "COMPLETED"
  | "CANCELLED";


export interface AdminPaymentUser {
  id: string;

  username: string;

  email: string;

  phoneNumber?: string | null;
}


export interface AdminPaymentOrder {
  id: string;

  totalPrice: number;

  paymentStatus: OrderPaymentStatus;

  status: OrderStatus;

  createdAt: string;

  user: AdminPaymentUser | null;
}


export interface AdminPayment {
  id: string;

  orderId: string;

  method: PaymentMethod;

  status: PaymentReviewStatus;

  amount: number;

  receiptImage: string | null;

  payerName: string | null;

  payerCardLast4: string | null;

  adminNote: string | null;

  rejectionReason: string | null;

  reviewedAt: string | null;

  createdAt: string;

  updatedAt: string;

  order: AdminPaymentOrder;
}


export interface AdminPaymentStatistics {
  total: number;

  pending: number;

  review: number;

  approved: number;

  rejected: number;
}


export interface AdminPaymentsPagination {
  page: number;

  limit: number;

  total: number;

  totalPages: number;
}


export interface AdminPaymentsResponse {
  success?: boolean;

  payments: AdminPayment[];

  statistics: AdminPaymentStatistics;

  pagination?: AdminPaymentsPagination;
}


export interface AdminPaymentsFilters {
  status?: PaymentReviewStatus | "";

  search?: string;

  page?: number;

  limit?: number;
}


async function fetchAdminPayments(
  filters: AdminPaymentsFilters = {},
): Promise<AdminPaymentsResponse> {
  const params = new URLSearchParams();

  if (filters.status) {
    params.set("status", filters.status);
  }

  if (filters.search?.trim()) {
    params.set("search", filters.search.trim());
  }

  if (filters.page !== undefined) {
    params.set("page", String(filters.page));
  }

  if (filters.limit !== undefined) {
    params.set("limit", String(filters.limit));
  }

  const query = params.toString();

  const response = await fetch(
    `/api/admin/payments${query ? `?${query}` : ""}`,
    {
      method: "GET",

      credentials: "include",

      cache: "no-store",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error || "خطا در دریافت پرداخت‌ها",
    );
  }

  return data;
}


export function useAdminPayments(
  filters: AdminPaymentsFilters = {},
) {
  return useQuery<AdminPaymentsResponse>({
    queryKey: [
      "admin-payments",
      filters.status ?? "",
      filters.search ?? "",
      filters.page ?? 1,
      filters.limit ?? 20,
    ],

    queryFn: () => fetchAdminPayments(filters),

    staleTime: 15_000,
  });
}