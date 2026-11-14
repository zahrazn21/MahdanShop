import { MapPin } from "lucide-react";
import type { ShippingInfo } from "@/src/shared/types/checkout";
import { InfoRow } from "../ui/InfoRow";

export function ShippingInfoCard({ info }: { info: ShippingInfo | null }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <h2 className="font-bold text-lg mb-5 flex items-center gap-2">
        <MapPin className="text-pink-500" />
        اطلاعات ارسال
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <InfoRow label="نام و نام خانوادگی" value={info?.fullName} />
        <InfoRow label="شماره تماس" value={info?.phone} />
        <InfoRow label="استان" value={info?.province} />
        <InfoRow label="شهر" value={info?.city} />
        <InfoRow label="کد پستی" value={info?.postalCode} />
        <InfoRow label="آیدی تلگرام" value={info?.telegramId} />
        <div className="md:col-span-2">
          <InfoRow label="آدرس" value={info?.address} />
        </div>
      </div>
    </div>
  );
}