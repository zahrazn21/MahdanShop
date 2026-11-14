
export interface ShippingPaymentHistoryItemUser {
  id: string;
  username: string | null;
  name: string | null;
  phone: string | null;
  email: string | null;
}
export interface ShippingPaymentHistoryItemProduct {
  orderItemId: string;
  name: string;
  quantity: number;
  price: number;
  selectedColor: string | null;
  selectedSize: string | null;
  selectedNumber: string | null;
}

export interface ShippingPaymentHistoryItemOrder {
  orderId: string;
  createdAt: string;
  products: ShippingPaymentHistoryItemProduct[];
}

export interface ShippingPaymentHistoryItem {
  paymentId: string;
  receiptGroupId: string;
  status: "APPROVED" | "REJECTED";
  amount: number;
  receiptImage: string | null;
  rejectionReason: string | null;
  adminNote: string | null;
  createdAt: string;
  reviewedAt: string | null;
  shipmentId: string;
  orderId: string;
  type: "DOMESTIC_BATCH" | "FREIGHT";
  parcelBatchId: string | null;
  shippingCost: number | null;
  totalVolume: number | null;
  freightCostToman: number | null;
  actualWeightGram: number | null;
  freightRateYuan: number | null;
  yuanExchangeRate: number | null;
  orders: ShippingPaymentHistoryItemOrder[];
  orderCount: number;
  productCount: number;

  user: ShippingPaymentHistoryItemUser | null;
}