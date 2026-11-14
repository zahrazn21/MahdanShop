import type { OrderStatus, ShipmentStatus } from "./order";
import type {
  AvailabilityType,
  ShippingClass,
} from "./product";

export interface ShippingDebtItem {
  orderItemId: string;
  quantity: number;
  name: string;
  price: number;

  selectedColor: string | null;
  selectedSize: string | null;
  selectedNumber: string | null;

  shippingClass: ShippingClass;

  volume: number | null;
  volumeUnit: string | null;

  availabilityType: AvailabilityType;
}
export type OrderPaymentStatus =
  | "PENDING"
  | "REVIEW"
  | "PAID"
  | "REJECTED";

export interface DomesticUnbatchedShipment {
  type: "DOMESTIC_UNBATCHED";

  shipmentId: string;
  orderId: string;

  createdAt: string;
  status: OrderStatus;


  orderPaymentStatus: OrderPaymentStatus;

  shippingDueAt: string | null;

  items: ShippingDebtItem[];
}

export interface DomesticBatchDebt {
  type: "DOMESTIC_BATCH";

  parcelBatchId: string;

  status: "OPEN" | "AWAITING_PAYMENT";

  totalVolume: number;
  totalDue: number;

  createdAt: string;
  updatedAt: string;

  orders: DomesticOrder[];

  paymentStatus: "PENDING" | "REJECTED" | null;
  rejectionReason: string | null;
}

export interface DomesticOrder {
  orderId: string;
  createdAt: string;
  status: OrderStatus;
  orderPaymentStatus: OrderPaymentStatus;
  shippingDueAt: string | null;

  items: ShippingDebtItem[];
}
export interface FreightDebt {
  type: "FREIGHT";

  shipmentId: string;
  orderId: string;
  orderCreatedAt: string;

  shipmentType: "IMPORTED";
  shipmentStatus: ShipmentStatus;
  orderPaymentStatus: OrderPaymentStatus;

  freightCostToman: number;
  totalDue: number;

  actualWeightGram: number | null;
  freightRateYuan: number | null;
  yuanExchangeRate: number | null;

  paymentStatus: "PENDING" | "REJECTED" | null;
  rejectionReason: string | null;

  items: ShippingDebtItem[];
}
export type ShippingDebt =
  | DomesticUnbatchedShipment
  | DomesticBatchDebt
  | FreightDebt;

export interface ShippingDebtsResponse {
  debts: ShippingDebt[];

  totalAmount: number;

  summary?: {
    domesticTotal: number;
    freightTotal: number;
    debtCount: number;
  };
}


export interface PayDebtsInput {
  parcelBatchIds: string[];
  shipmentIds: string[];
  receiptImage: string;
}


export const isDomesticUnbatched = (
  d: ShippingDebt,
): d is DomesticUnbatchedShipment =>
  d.type === "DOMESTIC_UNBATCHED";

export const isDomesticDebt = (
  d: ShippingDebt,
): d is DomesticBatchDebt =>
  d.type === "DOMESTIC_BATCH";

export const isFreightDebt = (
  d: ShippingDebt,
): d is FreightDebt =>
  d.type === "FREIGHT";


export const debtKey = (d: ShippingDebt) => {
  if (isDomesticUnbatched(d)) {
    return `domestic-shipment:${d.shipmentId}`;
  }

  if (isDomesticDebt(d)) {
    return `domestic-batch:${d.parcelBatchId}`;
  }

  return `freight:${d.shipmentId}`;
};