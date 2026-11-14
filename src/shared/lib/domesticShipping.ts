import {
  isDomestic,
  type DomesticShipment,
  type OrderDetail,
} from "@/src/shared/types/order";

export type DomesticKind =
  | "NOT_REQUIRED"
  | "IMMEDIATE"
  | "DEFERRED_PAID"
  | "DEFERRED_DEBT"
  | "DEFERRED_UNKNOWN";

export interface DomesticShippingState {
  shipment: DomesticShipment | undefined;
  kind: DomesticKind;
  isDeferred: boolean;
  cost: number;
  paymentStatus: DomesticShipment["shippingPaymentStatus"];
}

export function getDomesticShippingState(
  order: OrderDetail,
): DomesticShippingState {
  const shipment = order.shipments.find(isDomestic);
  if (!shipment) {
    return {
      shipment: undefined,
      kind: "NOT_REQUIRED",
      isDeferred: false,
      cost: 0,
      paymentStatus: "NOT_REQUIRED",
    };
  }

  const isDeferred = order.shippingPaymentMode === "DEFERRED";

  const batchStatus = shipment.parcelBatch?.status ?? null;

  let kind: DomesticKind = "IMMEDIATE";

  if (isDeferred) {
    if (
      batchStatus === "PAID" ||
      batchStatus === "SHIPPED"
    ) {
      kind = "DEFERRED_PAID";
    } else if (
      batchStatus === "OPEN" ||
      batchStatus === "AWAITING_PAYMENT"
    ) {
      kind = "DEFERRED_DEBT";
    } else {
      kind = "DEFERRED_UNKNOWN";
    }
  }

  return {
    shipment,
    kind,
    isDeferred,
    cost: isDeferred
      ? 0
      : Number(shipment.shippingCost ?? 0),
    paymentStatus:
      shipment.shippingPaymentStatus ?? "NOT_REQUIRED",
  };
}