import type { OrderDetail } from "@/src/shared/types/order";
import type { DomesticShippingState } from "@/src/shared/lib/domesticShipping";
import { formatPrice } from "@/src/shared/lib/format";
import { DomesticShippingBlock } from "./DomesticShippingBlock";
import { PriceRow } from "../admin/components";

interface Props {
  order: OrderDetail;
  domestic: DomesticShippingState;
}

export function PriceSummary({
  order,
  domestic,
}: Props) {
  const isPaid = domestic.paymentStatus === "PAID";

  const importedShipment = order.shipments.find(
    (shipment) => shipment.shipmentType === "IMPORTED",
  );

  const importedFreightStatus =
    importedShipment?.freightPaymentStatus ?? null;

  const importedFreightCost =
    importedShipment?.freightCostToman ?? null;

  const isImportedFreightPaid =
    importedFreightStatus === "PAID";

  const isImportedFreightPending =
    importedFreightStatus === "PENDING";

  const hasImportedFreightCost =
    importedFreightCost !== null &&
    importedFreightCost > 0;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <h2 className="font-bold text-lg mb-5">
        خلاصه مبلغ سفارش
      </h2>

      <div className="space-y-4 text-sm">
        <PriceRow
          label="مبلغ محصولات"
          value={formatPrice(order.subtotal)}
        />

        {order.discount > 0 && (
          <PriceRow
            label="تخفیف"
            value={`- ${formatPrice(order.discount)}`}
          />
        )}

        {domestic.kind === "NOT_REQUIRED" ? (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-bold text-gray-800">
                هزینه ارسال و باربری
              </p>

              <span className="text-xs font-bold text-gray-600">
                {isImportedFreightPaid
                  ? "پرداخت شده"
                  : isImportedFreightPending
                    ? "در انتظار تأیید"
                    : hasImportedFreightCost
                      ? "در انتظار پرداخت"
                      : "پرداخت بعداً"}
              </span>
            </div>

            {isImportedFreightPaid ? (
              <p className="text-xs text-gray-600 mt-3 leading-6">
                هزینه ارسال و باربری پرداخت و تأیید شده است.
              </p>
            ) : isImportedFreightPending ? (
              <p className="text-xs text-gray-600 mt-3 leading-6">
                رسید پرداخت ارسال شده و در انتظار تأیید ادمین است.
              </p>
            ) : hasImportedFreightCost ? (
              <p className="text-xs text-gray-600 mt-3 leading-6">
                هزینه ارسال و باربری اعلام شده و در انتظار پرداخت است.
              </p>
            ) : (
              <p className="text-xs text-gray-600 mt-3 leading-6">
                هزینه ارسال و باربری پس از ورود کالا محاسبه می‌شود.
              </p>
            )}

            {hasImportedFreightCost && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <PriceRow
                  label="مبلغ ارسال و باربری"
                  value={formatPrice(importedFreightCost)}
                />
              </div>
            )}
          </div>
        ) : domestic.kind === "IMMEDIATE" ? (
          <PriceRow
            label="هزینه ارسال داخلی"
            value={
              isPaid
                ? `${formatPrice(domestic.cost)} — پرداخت شده`
                : formatPrice(domestic.cost)
            }
          />
        ) : (
          <DomesticShippingBlock
            kind={domestic.kind}
            variant="row"
          />
        )}

        <div className="border-t pt-4 flex justify-between items-center">
          <span className="font-bold text-gray-800">
            مبلغ پرداختی فعلی
          </span>

          <span className="text-lg font-bold text-pink-600">
            {formatPrice(order.totalPrice)}
          </span>
        </div>
      </div>
    </div>
  );
}
