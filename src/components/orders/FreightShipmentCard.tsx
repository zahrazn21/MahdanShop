import type { ImportedShipment } from "@/src/shared/types/order";
import { FreightAwaitingBanner, FreightPaidBanner, FreightPendingBanner } from "../freight/FreightBanners";
import { FreightDetails } from "../freight/FreightDetails";
import { useSubmitFreightPayment } from "@/src/shared/hooks/useOrderMutations";
import { ReceiptUploader } from "../ui/ReceiptUploader";
import { FreightNotCalculated } from "../freight/FreightNotCalculated";

type FreightState = "NO_COST" | "AWAITING" | "PENDING" | "PAID";

function getFreightState(s: ImportedShipment): FreightState {
  if (Number(s.freightCostToman ?? 0) <= 0) return "NO_COST";
  if (s.freightPaymentStatus === "PAID") return "PAID";
  if (s.freightPaymentStatus === "PENDING") return "PENDING";
  return "AWAITING";
}

const BADGE: Record<FreightState, { text: string; cls: string }> = {
  PAID:     { text: "پرداخت تأیید شده",      cls: "bg-green-100 text-green-700" },
  PENDING:  { text: "در انتظار بررسی رسید",  cls: "bg-blue-100 text-blue-700" },
  AWAITING: { text: "در انتظار پرداخت",      cls: "bg-yellow-100 text-yellow-700" },
  NO_COST:  { text: "در انتظار تعیین هزینه", cls: "bg-gray-100 text-gray-700" },
};

interface Props {
  orderId: string;
  shipment: ImportedShipment;
  index: number;
  total: number;
}

export function FreightShipmentCard({ orderId, shipment, index, total }: Props) {
  const state = getFreightState(shipment);
  const cost = Number(shipment.freightCostToman ?? 0);
  const { mutate, isPending } = useSubmitFreightPayment(orderId, shipment.id);

  return (
    <div className="rounded-3xl border border-gray-200 overflow-hidden">
      <div className="p-5">
        {state === "NO_COST" && <FreightNotCalculated />}
        {state !== "NO_COST" && (
          <FreightDetails shipment={shipment} cost={cost} badge={BADGE[state]} />
        )}
        {state === "PAID" && <FreightPaidBanner img={shipment.freightReceiptImage} />}
        {state === "PENDING" && <FreightPendingBanner img={shipment.freightReceiptImage} />}
        {state === "AWAITING" && (
          <>
            <FreightAwaitingBanner cost={cost} />
            <div className="mt-5">
              <ReceiptUploader
                title="ارسال رسید باربری"
                label="انتخاب تصویر رسید باربری"
                submitLabel="ثبت رسید باربری"
                accent="purple"
                isPending={isPending}
                onSubmit={(file, reset) => mutate(file, { onSuccess: reset })}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}