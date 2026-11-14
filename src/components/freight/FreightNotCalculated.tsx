import { Clock } from "lucide-react";
import { StatusBanner } from "../ui/StatusBanner";

export function FreightNotCalculated() {
  return (
    <StatusBanner
      tone="purple"
      icon={Clock}
      title="هزینه باربری هنوز مشخص نشده است"
      description="هزینه نهایی باربری وارداتی پس از رسیدن کالا و مشخص شدن وزن واقعی مرسوله محاسبه خواهد شد."
      note="در حال حاضر نیازی به پرداخت یا ارسال رسید نیست."
    />
  );
}