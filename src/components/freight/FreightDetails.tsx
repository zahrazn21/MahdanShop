import type { ImportedShipment } from "@/src/shared/types/order";
import { InfoRow } from "../ui/InfoRow";
import { PaymentBadge } from "../ui/PaymentBadge";
import { formatNumber, formatPrice } from "@/src/shared/lib/format";

interface Props {
  shipment: ImportedShipment;
  cost: number;
  badge: { text: string; cls: string };
}

export function FreightDetails({ shipment, cost, badge }: Props) {
  return (
    <div className="grid sm:grid-cols-2 gap-3 mb-5">
      <InfoRow
        label="وزن واقعی"
        value={shipment.actualWeightGram ? `${formatNumber(shipment.actualWeightGram)} گرم` : "-"}
      />
      <InfoRow label="هزینه نهایی باربری" value={formatPrice(cost)} />

      {shipment.freightRateYuan != null && (
        <InfoRow label="نرخ باربری" value={`${shipment.freightRateYuan} یوان`} />
      )}
      {shipment.yuanExchangeRate != null && (
        <InfoRow label="نرخ تبدیل یوان" value={formatPrice(shipment.yuanExchangeRate)} />
      )}

      <div className="rounded-2xl bg-gray-50 p-4">
        <p className="text-xs text-gray-400 mb-2">وضعیت پرداخت باربری</p>
        <PaymentBadge text={badge.text} className={badge.cls} />
      </div>
    </div>
  );
}