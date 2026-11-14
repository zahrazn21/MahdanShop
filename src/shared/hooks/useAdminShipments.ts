
"use client";

import { useQuery } from "@tanstack/react-query";

export type ShipmentStatus =
  | "PENDING"
  | "WAITING_IMPORT"
  | "WAITING_FOR_FREIGHT"
  | "READY_TO_SHIP"
  | "SHIPPED"
  | "DELIVERED";

export type ShipmentType = "DOMESTIC" | "IMPORTED";

export type FreightPaymentStatus =
  | "NOT_REQUIRED"
  | "PENDING"
  | "AWAITING_USER_PAYMENT"
  | "PAID";

export type ShippingPaymentStatus =
  | "NOT_REQUIRED"
  | "AWAITING_USER_PAYMENT"
  | "PAID"
  | "EXPIRED";

export type ShippingPaymentReviewStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export type PaymentStatus =
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

export type BatchStatus =
  | "OPEN"
  | "PROCESSING"
  | "ARRIVED"
  | "CLOSED";

export interface AdminShipmentItem {
  id: string;

  quantity: number;

  orderItem: {
    id: string;

    name: string;

    price: number;

    image: string | null;

    selectedColor: string | null;

    selectedSize: string | null;

    selectedNumber: string | null;

    variantName: string | null;

    variantSize: string | null;

    variantVolume: number | null;

    variantVolumeUnit: string | null;

    availabilityType: "IN_STOCK" | "PRE_ORDER";

    batchNumber: number | null;
  };
}


export interface AdminShippingPayment {
  id: string;

  shipmentId: string;

  amount: number;

  status: ShippingPaymentReviewStatus;

  receiptImage: string | null;

  payerName: string | null;

  payerCardLast4: string | null;

  adminNote: string | null;

  rejectionReason: string | null;

  reviewedAt: string | null;

  createdAt: string;

  updatedAt: string;

  receiptGroupId: string | null;

  userDeletedAt: string | null;

  adminDeletedAt: string | null;
}

export interface AdminShipmentOrder {
  id: string;

  totalPrice: number;

  paymentStatus: PaymentStatus;

  status: OrderStatus;

  createdAt: string;

  user: {
    id: string;

    username: string;

    email: string;
  } | null;
}

export interface AdminShipmentBatch {
  id: string;

  batchNumber: number;

  title: string;

  estimatedFreightPerKg: number | null;

  status: BatchStatus;

  createdAt: string;

  updatedAt: string;
}

export interface AdminShipment {
  id: string;

  orderId: string;

  batchId: string | null;

  status: ShipmentStatus;

  shipmentType: ShipmentType;

  trackingNumber: string | null;

  shippedAt: string | null;

  deliveredAt: string | null;

  estimatedDeliveryDays: number | null;

  subtotal: number;

  shippingCost: number | null;

  shippingPaymentStatus: ShippingPaymentStatus;

  shippingDueAt: string | null;

  shippingPaidAt: string | null;

  shippingPayments: AdminShippingPayment[];

  actualWeightGram: number | null;

  freightRateYuan: number | null;

  yuanExchangeRate: number | null;

  freightCostToman: number | null;

  freightPaymentStatus: FreightPaymentStatus;

  freightReceiptImage: string | null;

  createdAt: string;

  updatedAt: string;

  order: AdminShipmentOrder;

  batch: AdminShipmentBatch | null;

  items: AdminShipmentItem[];
}
export interface AdminShipmentsResponse {
  success: boolean;

  shipments: AdminShipment[];
}
async function fetchAdminShipments(): Promise<AdminShipmentsResponse> {
  const response = await fetch("/api/admin/shipments", {
    method: "GET",
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error || "خطا در دریافت مرسوله‌ها",
    );
  }

  return data;
}

export function useAdminShipments() {
  return useQuery({
    queryKey: ["admin-shipments"],

    queryFn: fetchAdminShipments,

    staleTime: 30 * 1000,
  });
}