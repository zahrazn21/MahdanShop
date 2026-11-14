export const formatPrice = (
  price: number | null | undefined,
) =>
  `${Number(price ?? 0).toLocaleString("fa-IR")} تومان`;

export const formatDate = (
  date: string | Date,
) => {
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  } catch {
    return "-";
  }
};