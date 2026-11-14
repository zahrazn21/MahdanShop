import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import { ReceiptPreview } from "../ui/ReceiptPreview";
import { StatusBanner } from "../ui/StatusBanner";
import { formatPrice } from "../admin/utils";

export function FreightPaidBanner({ img }: { img: string | null }) {
  return (
    <StatusBanner
      tone="green"
      icon={CheckCircle}
      title="هزینه باربری پرداخت شده است"
      description="پرداخت باربری این مرسوله توسط مدیریت تأیید شده است."
      footer={img && <ReceiptPreview src={img} title="رسید باربری" />}
    />
  );
}

export function FreightPendingBanner({ img }: { img: string | null }) {
  return (
    <StatusBanner
      tone="blue"
      icon={Clock}
      title="رسید باربری ارسال شد"
      description="رسید شما ثبت شده و در انتظار بررسی ادمین است."
      footer={img && <ReceiptPreview src={img} title="رسید باربری شما" />}
    />
  );
}

export function FreightAwaitingBanner({ cost }: { cost: number }) {
  return (
    <StatusBanner
      tone="amber"
      icon={AlertCircle}
      title="هزینه باربری آماده پرداخت است"
      description={
        <>
          هزینه نهایی باربری این مرسوله مشخص شده است. لطفاً مبلغ{" "}
          <span className="font-bold">{formatPrice(cost)}</span>{" "}
          را پرداخت کرده و تصویر رسید را ارسال کنید.
        </>
      }
      note="برای این هزینه مهلت یک‌ماهه تعیین نشده است."
    />
  );
}