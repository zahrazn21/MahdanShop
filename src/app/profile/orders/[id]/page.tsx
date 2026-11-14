"use client";

import { useParams } from "next/navigation";

import { useOrder } from "@/src/shared/hooks/useOrders";
import { getDomesticShippingState } from "@/src/shared/lib/domesticShipping";

import { OrderHeader } from "@/src/components/orders/OrderHeader";
import { OrderSummaryCards } from "@/src/components/orders/OrderSummaryCards";
import { PriceSummary } from "@/src/components/orders/PriceSummary";
import { OrderItemsList } from "@/src/components/orders/OrderItemsList";
import { ShippingInfoCard } from "@/src/components/orders/ShippingInfoCard";
import { PaymentSection } from "@/src/components/orders/PaymentSection";
import {
  OrderLoading,
  OrderNotFound,
} from "@/src/components/orders/OrderStates";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useOrder(id);

  if (isLoading) return <OrderLoading />;
  if (!order) return <OrderNotFound />;

  const domestic = getDomesticShippingState(order);

  return (
    <div className="min-h-screen p-4 md:p-8" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-6">
        <OrderHeader order={order} />
        <OrderSummaryCards order={order} domestic={domestic} />
        <PriceSummary order={order} domestic={domestic} />

        <OrderItemsList items={order.items} shipments={order.shipments} />{" "}
        <ShippingInfoCard info={order.shippingInfo} />
        <PaymentSection order={order} />
      </div>
    </div>
  );
}