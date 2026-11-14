import type { OrderStatus } from "@/src/shared/types/order";

export const ORDER_STATUS: Record<OrderStatus, { text: string; color: string }> = {
  PENDING_PAYMENT:      { text: "در انتظار ارسال رسید",  color: "bg-yellow-100 text-yellow-700" },
  WAITING_CONFIRMATION: { text: "در انتظار تأیید پرداخت", color: "bg-blue-100 text-blue-700" },
  CONFIRMED:            { text: "تأیید شده",              color: "bg-green-100 text-green-700" },
  PROCESSING:           { text: "در حال آماده‌سازی",      color: "bg-purple-100 text-purple-700" },
  PARTIALLY_SHIPPED:    { text: "ارسال بخشی از سفارش",    color: "bg-indigo-100 text-indigo-700" },
  COMPLETED:            { text: "تکمیل شده",              color: "bg-green-100 text-green-700" },
  CANCELLED:            { text: "لغو شده",                color: "bg-red-100 text-red-700" },
};