import { Box, CheckCircle, Clock, CreditCard, Package, Truck } from "lucide-react";

import { AdminShipment, ShipmentStatus } from "@/src/shared/hooks/useAdminShipments";

export const formatPrice = (price: number) => `${price.toLocaleString("fa-IR")} تومان`;

export const formatDate = (date: string) =>
  new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(date));

export const formatWeight = (gram: number | null) => {
  if (!gram || gram <= 0) return "-";
  if (gram >= 1000) return `${(gram / 1000).toLocaleString("fa-IR")} کیلوگرم`;
  return `${gram.toLocaleString("fa-IR")} گرم`;
};

export const statusMap: Record<ShipmentStatus, { label: string; className: string; icon: typeof Clock }> = {
  PENDING: { label: "در انتظار", className: "bg-yellow-100 text-yellow-700", icon: Clock },
  WAITING_IMPORT: { label: "در انتظار تأمین", className: "bg-orange-100 text-orange-700", icon: Package },
  WAITING_FOR_FREIGHT: { label: "در انتظار باربری", className: "bg-blue-100 text-blue-700", icon: CreditCard },
  READY_TO_SHIP: { label: "آماده ارسال", className: "bg-purple-100 text-purple-700", icon: Box },
  SHIPPED: { label: "ارسال شده", className: "bg-indigo-100 text-indigo-700", icon: Truck },
  DELIVERED: { label: "تحویل داده شده", className: "bg-green-100 text-green-700", icon: CheckCircle },
};

export const shipmentTypeMap = {
  DOMESTIC: { label: "داخلی", className: "bg-gray-100 text-gray-600" },
  IMPORTED: { label: "وارداتی", className: "bg-pink-100 text-pink-600" },
};

export const freightStatusMap = {
  NOT_REQUIRED: { label: "نیازی ندارد", className: "bg-gray-100 text-gray-500" },
  PENDING: { label: "در انتظار بررسی", className: "bg-yellow-100 text-yellow-700" },
  AWAITING_USER_PAYMENT: { label: "در انتظار پرداخت", className: "bg-orange-100 text-orange-700" },
  PAID: { label: "پرداخت شده", className: "bg-green-100 text-green-700" },
};

export type FilterStatus = "ALL" | ShipmentStatus;

export const getPendingPayment = (shipment: AdminShipment) =>
  shipment.shippingPayments.find((payment) => payment.status === "PENDING" && !!payment.receiptImage) ?? null;
