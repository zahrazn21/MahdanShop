import { Info } from "lucide-react";
import type { FreightDebt } from "@/src/shared/types/shippingDebt";
import type { ShipmentStatus } from "@/src/shared/types/order";
import { formatDateSafe, formatNumber } from "@/src/shared/lib/format";
import { InfoRow } from "../ui/InfoRow";
import { StatusBanner } from "../ui/StatusBanner";
import { DebtCardShell } from "./DebtCardShell";
import { ProductItem } from "./ProductItem";
import { ProductsAccordion } from "./ProductsAccordion";

const SHIPMENT_STATUS: Record<ShipmentStatus, string> = {
  PENDING: "در انتظار",
  WAITING_IMPORT: "در انتظار واردات",
  WAITING_FOR_FREIGHT: "در انتظار باربری",
  READY_TO_SHIP: "آماده ارسال",
  SHIPPED: "ارسال شده",
  DELIVERED: "تحویل شده",
};

interface Props {
  debt: FreightDebt;
  selected: boolean;
  onToggle: () => void;
}

export function FreightCard({ debt, selected, onToggle }: Props) {
  const productPaymentApproved = debt.orderPaymentStatus === "PAID";
  return (
    <DebtCardShell
      selected={selected}
      onToggle={onToggle}
      disabled={!productPaymentApproved}
      title="باربری وارداتی"
      amount={debt.totalDue}
      subtitle={
        <>
          سفارش #<span dir="ltr">{debt.orderId}</span>
          <span className="mx-2">•</span>
          {formatDateSafe(debt.orderCreatedAt, { dateStyle: "medium" })}
        </>
      }
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <InfoRow
          label="وضعیت مرسوله"
          value={SHIPMENT_STATUS[debt.shipmentStatus]}
        />
        {debt.actualWeightGram !== null && (
          <InfoRow
            label="وزن واقعی"
            value={`${formatNumber(debt.actualWeightGram)} گرم`}
          />
        )}
        {debt.freightRateYuan !== null && (
          <InfoRow label="نرخ باربری" value={`${debt.freightRateYuan} یوان`} />
        )}
      </div>
      {!productPaymentApproved && (
        <StatusBanner
          tone="amber"
          icon={Info}
          title="ابتدا پرداخت محصول باید تأیید شود"
          description="تا زمانی که هزینه محصول این سفارش پرداخت و توسط ادمین تأیید نشود، هزینه باربری وارداتی قابل پرداخت نیست."
        />
      )}
      <StatusBanner
        tone="blue"
        icon={Info}
        title="باربری وارداتی"
        description="مبلغ باربری پس از مشخص شدن هزینه واقعی واردات ثبت شده است. برای باربری وارداتی مهلت یک‌ماهه‌ی هزینه ارسال داخلی اعمال نمی‌شود."
      />

      <ProductsAccordion label="محصولات این سفارش" count={debt.items.length}>
        {debt.items.length === 0 ? (
          <p className="rounded-2xl bg-gray-50 p-4 text-center text-sm text-gray-500">
            اطلاعات محصولات موجود نیست.
          </p>
        ) : (
          debt.items.map((item) => (
            <ProductItem key={item.orderItemId} item={item} />
          ))
        )}
      </ProductsAccordion>
    </DebtCardShell>
  );
}
