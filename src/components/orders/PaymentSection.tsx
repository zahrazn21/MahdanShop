"use client";

import { Upload } from "lucide-react";
import type { OrderDetail } from "@/src/shared/types/order";
import { isDomestic } from "@/src/shared/types/order";
import {
  useResetPayment,
  useSubmitOrderPayment,
} from "@/src/shared/hooks/useOrderMutations";
import { ReceiptUploader } from "../ui/ReceiptUploader";
import { PaymentInfoCard } from "./PaymentInfoCard";
import { ApprovedBanner, PendingBanner, RejectedBanner } from "./PaymentBanners";

export function PaymentSection({ order }: { order: OrderDetail }) {
  const { mutate: submit, isPending } = useSubmitOrderPayment(order.id);
  const { mutate: retry, isPending: isResetting } = useResetPayment(order.id);

  const receipt = order.payment?.receiptImage ?? null;
  const status = order.payment?.status;
  const canUpload = order.status === "PENDING_PAYMENT" && !receipt;
  const tracking = order.shipments.find(isDomestic)?.trackingNumber;

  return (
    <>
      <PaymentInfoCard order={order} trackingNumber={tracking} />

      {canUpload && (
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-pink-50 flex items-center justify-center">
              <Upload className="text-pink-500" size={22} />
            </div>
            <div>
              <h2 className="font-bold text-lg">ارسال رسید پرداخت</h2>
              <p className="text-xs text-gray-400 mt-1">
                رسید پرداخت مبلغ سفارش را ارسال کنید.
              </p>
            </div>
          </div>

          <ReceiptUploader
            label="انتخاب تصویر رسید"
            submitLabel="ثبت رسید پرداخت"
            accent="pink"
            isPending={isPending}
            onSubmit={(file, reset) => submit(file, { onSuccess: reset })}
          />
        </div>
      )}

      {receipt && status === "PENDING" && <PendingBanner receipt={receipt} />}
      {status === "APPROVED" && <ApprovedBanner receipt={receipt} />}
      {status === "REJECTED" && (
        <RejectedBanner
          reason={order.payment?.rejectionReason ?? null}
          onRetry={() => retry()}
          loading={isResetting}
        />
      )}
    </>
  );
}