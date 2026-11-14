export type Notification = {
  id: string;

  type:
    | "SHIPPING_DEBT"
    | "SHIPPING_DEBT_OVERDUE"
    | "FREIGHT_PAYMENT_PENDING"
    | "FREIGHT_PAYMENT_APPROVED"
    | "FREIGHT_PAYMENT_REJECTED";

  title: string;
  message: string;

  href?: string;

  priority: "HIGH" | "NORMAL";

  orderId?: string;
  amount?: number;
  dueAt?: string;
  createdAt?: string;
  rejectionReason?: string;
  actionLabel?: string;

  read?: boolean;
};

