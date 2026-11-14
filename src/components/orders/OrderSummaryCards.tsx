import { CreditCard, Package, Truck } from "lucide-react";
import type { OrderDetail } from "@/src/shared/types/order";
import type { DomesticShippingState } from "@/src/shared/lib/domesticShipping";
import { formatNumber, formatPrice } from "@/src/shared/lib/format";
import { DomesticShippingBlock } from "./DomesticShippingBlock";
import { SummaryCard } from "../ui/SummaryCard";

interface Props {
  order: OrderDetail;
  domestic: DomesticShippingState;
}

export function OrderSummaryCards({ order, domestic }: Props) {
  const importedShipment = order.shipments.find(
    (shipment) => shipment.shipmentType === "IMPORTED",
  );

  const importedFreightStatus = importedShipment?.freightPaymentStatus ?? null;

  const importedFreightCost = importedShipment?.freightCostToman ?? null;
  const freightPaymentNeeded =
    importedFreightCost !== null &&
    importedFreightCost > 0 &&
    importedFreightStatus !== "PAID" &&
    importedFreightStatus !== "PENDING";

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      <SummaryCard
        icon={<CreditCard size={20} />}
        title="مبلغ پرداختی سفارش"
        value={formatPrice(order.totalPrice)}
        highlight
      />

      <SummaryCard
        icon={<Package size={20} />}
        title="مبلغ محصولات"
        value={formatPrice(order.subtotal)}
      />

      {domestic.kind === "NOT_REQUIRED" ? (
        <SummaryCard
          icon={<Truck size={20} />}
          title="هزینه ارسال و باربری"
          value={
            importedFreightStatus === "PAID"
              ? "پرداخت شده"
              : importedFreightStatus === "PENDING"
                ? "در انتظار تأیید"
                : importedFreightCost !== null && importedFreightCost > 0
                  ? formatPrice(importedFreightCost)
                  : "پرداخت بعداً"
          }
          subtitle={
            importedFreightStatus === "PAID"
              ? "هزینه ارسال و باربری پرداخت و تأیید شده است"
              : importedFreightStatus === "PENDING"
                ? "رسید پرداخت ارسال شده و در انتظار تأیید ادمین است"
                : importedFreightCost !== null && importedFreightCost > 0
                  ? "هزینه ارسال و باربری اعلام شده و در انتظار پرداخت است"
                  : "هزینه ارسال و باربری پس از ورود کالا محاسبه می‌شود"
          }
          action={
            freightPaymentNeeded
              ? { href: "/profile/shipping-debts", label: "پرداخت از اینجا" }
              : undefined
          }
        />
      ) : domestic.kind === "IMMEDIATE" ? (
        <SummaryCard
          icon={<Truck size={20} />}
          title="هزینه ارسال داخلی"
          value={formatPrice(domestic.cost)}
          subtitle={
            domestic.paymentStatus === "PAID"
              ? "پرداخت و تأیید شده"
              : "پرداخت در زمان ثبت سفارش"
          }
        />
      ) : (
        <DomesticShippingBlock kind={domestic.kind} variant="card" />
      )}

      <SummaryCard
        icon={<Package size={20} />}
        title="تعداد کالا"
        value={`${formatNumber(order.items.length)} کالا`}
      />
    </div>
  );
}
