"use client";

import { useQuery } from "@tanstack/react-query";

export interface AdminUserOrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;

  selectedColor: string | null;
  selectedSize: string | null;
  selectedNumber: string | null;

  variantId: string | null;
  variantName: string | null;
  variantSize: string | null;
  variantVolume: number | null;
  variantVolumeUnit: string | null;
}

export interface AdminUserPayment {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  amount: number;
  receiptImage: string | null;

  payerName: string | null;
  payerCardLast4: string | null;

  adminNote: string | null;
  rejectionReason: string | null;

  reviewedAt: string | null;
  createdAt: string;
}

export interface AdminUserOrder {
  id: string;

  subtotal: number;
  shippingCost: number;
  discount: number;
  tax: number;
  totalPrice: number;

  paymentMethod: "CARD_TO_CARD";
  paymentStatus:
    | "PENDING"
    | "REVIEW"
    | "PAID"
    | "REJECTED";

  status:
    | "PENDING_PAYMENT"
    | "WAITING_CONFIRMATION"
    | "CONFIRMED"
    | "PREPARING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";

  trackingNumber: string | null;

  createdAt: string;
  updatedAt: string;

  payment: AdminUserPayment | null;

  items: AdminUserOrderItem[];
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: "USER" | "ADMIN";
  points: number;
  createdAt: string;
}

export interface AdminUserStatistics {
  totalOrders: number;
  paidOrders: number;
  pendingOrders: number;
  rejectedOrders: number;
  cancelledOrders: number;
  totalPurchased: number;
  totalItems: number;
}

export interface AdminUserResponse {
  user: AdminUser;
  statistics: AdminUserStatistics;
  orders: AdminUserOrder[];
}

async function fetchAdminUser(
  userId: string,
): Promise<AdminUserResponse> {
  const response = await fetch(
    `/api/admin/users/${userId}`,
    {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error || "خطا در دریافت اطلاعات کاربر",
    );
  }

  return data;
}

export function useAdminUser(userId: string) {
  return useQuery<AdminUserResponse>({
    queryKey: ["admin-user", userId],

    queryFn: () => fetchAdminUser(userId),

    enabled: Boolean(userId),

    staleTime: 30_000,
  });
}