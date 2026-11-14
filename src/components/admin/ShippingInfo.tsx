import {
  EmptyText,
  InfoRow,
} from "./components";

export default function ShippingInfo({
  shippingInfo,
}: {
  shippingInfo: Record<string, unknown> | null;
}) {
  if (
    !shippingInfo ||
    Object.keys(shippingInfo).length === 0
  ) {
    return (
      <EmptyText text="اطلاعات ارسال ثبت نشده است." />
    );
  }

  const entries = Object.entries(shippingInfo);

  return (
    <div className="space-y-3">
      {entries.map(([key, value]) => (
        <InfoRow
          key={key}
          label={shippingLabel(key)}
          value={String(value ?? "-")}
        />
      ))}
    </div>
  );
}

function shippingLabel(key: string) {
  const labels: Record<string, string> = {
    firstName: "نام",
    lastName: "نام خانوادگی",
    fullName: "نام و نام خانوادگی",
    phone: "شماره تماس",
    mobile: "موبایل",
    province: "استان",
    city: "شهر",

    telegramId: "آیدی تلگرام",
    idTelegram: "آیدی تلگرام",

    district: "منطقه",
    address: "آدرس",
    postalCode: "کد پستی",
    zipCode: "کد پستی",
    plaque: "پلاک",
    unit: "واحد",
  };

  return labels[key] ?? key;
}