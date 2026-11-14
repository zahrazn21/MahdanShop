"use client";

import { useQuery } from "@tanstack/react-query";


export type ShipmentType = "DOMESTIC" | "IMPORTED";

export type ShipmentStatus =
  | "PENDING"
  | "WAITING_IMPORT"
  | "WAITING_FOR_FREIGHT"
  | "READY_TO_SHIP"
  | "SHIPPED"
  | "DELIVERED";

export type FreightPaymentStatus =
  | "NOT_REQUIRED"
  | "PENDING"
  | "AWAITING_USER_PAYMENT"
  | "PAID";

export type BatchStatus = "OPEN" | "PROCESSING" | "ARRIVED" | "CLOSED";

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "WAITING_CONFIRMATION"
  | "CONFIRMED"
  | "PROCESSING"
  | "PARTIALLY_SHIPPED"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "REVIEW" | "PAID" | "REJECTED";

export type PaymentReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface AdminOrderBatch {
  id: string;

  batchNumber: number;

  title: string;

  estimatedFreightPerKg: number | null;

  status: BatchStatus;

  createdAt: string;

  updatedAt: string;
}


export interface AdminOrderItem {
  id: string;

  productId: string;

  variantId: string | null;

  name: string;

  price: number;

  quantity: number;

  selectedColor: string | null;

  selectedSize: string | null;

  selectedNumber: string | null;

  shippingClass: "SMALL" | "MEDIUM" | "LARGE";

  image: string | null;

  variantName: string | null;

  variantSize: string | null;

  variantVolume: number | null;

  variantVolumeUnit: string | null;

  availabilityType: "IN_STOCK" | "PRE_ORDER";

  estimatedDeliveryDays: number | null;

  batchNumber: number | null;
}


export interface AdminOrderPayment {
  id: string;

  method: "CARD_TO_CARD";

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
}

export interface AdminOrderUser {
  id: string;

  username: string;

  email: string;

  phoneNumber?: string | null;
}
export interface AdminOrderShipmentItem {
  id: string;

  shipmentId: string;

  orderItemId: string;

  quantity: number;

  orderItem: AdminOrderItem;
}
export type AdminOrderShipment = {
  id: string;
  status: ShipmentStatus;
  batchId?: string | null;
  shipmentType: "DOMESTIC" | "IMPORTED";
  shippingCost?: number | null;
  shippingPaymentStatus:
    | "NOT_REQUIRED"
    | "AWAITING_USER_PAYMENT"
    | "PAID"
    | "EXPIRED";
  shippingDueAt?: string | null;
  shippingPaidAt?: string | null;
  actualWeightGram?: number | null;
  freightRateYuan?: number | null;
  yuanExchangeRate?: number | null;
  freightCostToman?: number | null;
  freightPaymentStatus:
    | "NOT_REQUIRED"
    | "PENDING"
    | "AWAITING_USER_PAYMENT"
    | "PAID";
  freightReceiptImage?: string | null;
  trackingNumber?: string | null;
  shippedAt?: string | null;
  deliveredAt?: string | null;
  estimatedDeliveryDays?: number | null;

  subtotal: number;

  items: Array<{
    id: string;
    quantity: number;
    orderItem: {
      id: string;
      name: string;
      image?: string | null;
    };
  }>;
};


export interface AdminOrder {
  id: string;

  userId: string | null;

  subtotal: number;

  shippingCost: number;

  discount: number;

  tax: number;

  totalPrice: number;

  paymentMethod: "CARD_TO_CARD";

  paymentStatus: PaymentStatus;

  status: OrderStatus;

  shippingInfo: Record<string, unknown> | null;

  createdAt: string;

  updatedAt: string;

  user: AdminOrderUser | null;

  items: AdminOrderItem[];

  payment: AdminOrderPayment | null;

  shipments: AdminOrderShipment[];
}


export interface AdminOrdersPagination {
  page: number;

  limit: number;

  total: number;

  totalPages: number;
}


export interface AdminOrdersResponse {
  success: boolean;

  orders: AdminOrder[];

  pagination: AdminOrdersPagination;
}

export interface AdminOrdersFilters {
  page?: number;

  limit?: number;

  status?: OrderStatus;

  paymentStatus?: PaymentStatus;

  batchId?: string;

  batchNumber?: number;
}


async function fetchAdminOrders(
  filters: AdminOrdersFilters = {},
): Promise<AdminOrdersResponse> {
  const searchParams = new URLSearchParams();

  if (filters.page !== undefined) {
    searchParams.set("page", String(filters.page));
  }

  if (filters.limit !== undefined) {
    searchParams.set("limit", String(filters.limit));
  }

  if (filters.status) {
    searchParams.set("status", filters.status);
  }

  if (filters.paymentStatus) {
    searchParams.set("paymentStatus", filters.paymentStatus);
  }

  if (filters.batchId) {
    searchParams.set("batchId", filters.batchId);
  }

  if (filters.batchNumber !== undefined) {
    searchParams.set("batchNumber", String(filters.batchNumber));
  }

  const query = searchParams.toString();

  const response = await fetch(`/api/admin/orders${query ? `?${query}` : ""}`, {
    method: "GET",

    headers: {
      "Content-Type": "application/json",
    },

    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || "خطا در دریافت سفارش‌ها");
  }

  return data;
}

export function useAdminOrders(filters: AdminOrdersFilters = {}) {
  return useQuery({
    queryKey: ["admin-orders", filters],

    queryFn: () => fetchAdminOrders(filters),

    staleTime: 30 * 1000,
  });
}
