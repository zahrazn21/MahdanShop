import type { ShippingInfo, ShippingPaymentMode } from "./checkout"; 
import type { AvailabilityType, ShippingClass } from "./product";

export type { ShippingPaymentMode };

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "WAITING_CONFIRMATION"
  | "CONFIRMED"
  | "PROCESSING"
  | "PARTIALLY_SHIPPED"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentReviewStatus = "PENDING" | "APPROVED" | "REJECTED";
export type ParcelBatchStatus =
  | "OPEN" | "AWAITING_PAYMENT" | "PAID" | "SHIPPED" | "CANCELLED";
export type ShipmentStatus =
  | "PENDING" | "WAITING_IMPORT" | "WAITING_FOR_FREIGHT"
  | "READY_TO_SHIP" | "SHIPPED" | "DELIVERED";
export type FreightPaymentStatus =
  | "NOT_REQUIRED" | "PENDING" | "AWAITING_USER_PAYMENT" | "PAID";
export type ShippingPaymentStatus =
  | "NOT_REQUIRED" | "AWAITING_USER_PAYMENT" | "PAID" | "EXPIRED";

export interface OrderItem {
  id: string;
  orderId: string;
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
  shippingClass: ShippingClass;
  availabilityType: AvailabilityType;
  estimatedDeliveryDays: number | null;
  batchNumber: number | null;
}

export interface OrderPayment {
  id: string;
  orderId: string;
  status: PaymentReviewStatus;
  amount: number;
  receiptImage: string | null;
  payerName: string | null;
  payerCardLast4: string | null;
  rejectionReason: string | null;
}

export interface OrderBatchRef {
  id: string;
  batchNumber: number;
  title: string;
}

export interface DomesticParcelBatch {
  id: string;
  status: ParcelBatchStatus;
  shippingCost: number;
  trackingNumber: string | null;
}

export interface ShipmentItem {
  id: string;
  orderItemId: string;
  quantity: number;
  orderItem: OrderItem;
}

interface ShipmentBase {
  id: string;
  orderId: string;
  status: ShipmentStatus;
  trackingNumber: string | null;
  subtotal: number;
  estimatedDeliveryDays: number | null;
  batchId: string | null;
  batch: OrderBatchRef | null;
  parcelBatchId: string | null;
  parcelBatch: DomesticParcelBatch | null;
  items: ShipmentItem[];

  shippingCost: number | null;
  shippingPaymentStatus: ShippingPaymentStatus;

  actualWeightGram: number | null;
  freightRateYuan: number | null;
  yuanExchangeRate: number | null;
  freightCostToman: number | null;
  freightPaymentStatus: FreightPaymentStatus;
  freightReceiptImage: string | null;
}

export interface DomesticShipment extends ShipmentBase {
  shipmentType: "DOMESTIC";
}
export interface ImportedShipment extends ShipmentBase {
  shipmentType: "IMPORTED";
}
export type OrderShipment = DomesticShipment | ImportedShipment;

export const isDomestic = (s: OrderShipment): s is DomesticShipment =>
  s.shipmentType === "DOMESTIC";
export const isImported = (s: OrderShipment): s is ImportedShipment =>
  s.shipmentType === "IMPORTED";

export interface OrderDetail {
  id: string;
  userId: string | null;
  subtotal: number;
  shippingCost: number;
  discount: number;
  tax: number;
  totalPrice: number;
  status: OrderStatus;
  shippingPaymentMode: ShippingPaymentMode;
  shippingInfo: ShippingInfo | null;
  importedFreightAccepted: boolean;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  payment: OrderPayment | null;
  shipments: OrderShipment[];
}