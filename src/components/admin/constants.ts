export const paymentStatusMap = {
  PENDING: {
    label: "در انتظار پرداخت",
    className: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },

  REVIEW: {
    label: "در انتظار بررسی",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },

  PAID: {
    label: "پرداخت تأیید شده",
    className: "bg-green-50 text-green-700 border-green-200",
  },

  REJECTED: {
    label: "پرداخت رد شده",
    className: "bg-red-50 text-red-700 border-red-200",
  },
} as const;

export const orderStatusMap: Record<
  string,
  {
    label: string;
    className: string;
  }
> = {
  PENDING_PAYMENT: {
    label: "در انتظار پرداخت",
    className: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },

  WAITING_CONFIRMATION: {
    label: "در انتظار تأیید",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },

  CONFIRMED: {
    label: "تأیید شده",
    className: "bg-green-50 text-green-700 border-green-200",
  },

  PROCESSING: {
    label: "در حال آماده‌سازی",
    className: "bg-purple-50 text-purple-700 border-purple-200",
  },

  PARTIALLY_SHIPPED: {
    label: "بخشی از سفارش ارسال شده",
    className: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },

  SHIPPED: {
    label: "ارسال شده",
    className: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },

  DELIVERED: {
    label: "تحویل داده شده",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },

  COMPLETED: {
    label: "تکمیل شده",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },

  CANCELLED: {
    label: "لغو شده",
    className: "bg-red-50 text-red-700 border-red-200",
  },
};

export const shipmentStatusMap: Record<
  string,
  {
    label: string;
    className: string;
  }
> = {
  PENDING: {
    label: "در انتظار آماده‌سازی",
    className: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },

  WAITING_IMPORT: {
    label: "در انتظار ورود",
    className: "bg-orange-50 text-orange-700 border-orange-200",
  },

  WAITING_FOR_FREIGHT: {
    label: "در انتظار باربری",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },

  READY_TO_SHIP: {
    label: "آماده ارسال",
    className: "bg-purple-50 text-purple-700 border-purple-200",
  },

  SHIPPED: {
    label: "ارسال شده",
    className: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },

  DELIVERED: {
    label: "تحویل شده",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
};