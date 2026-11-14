export const formatPrice = (price: number | null | undefined) =>
  `${Number(price ?? 0).toLocaleString("fa-IR")} تومان`;

export const formatNumber = (n: number | null | undefined) =>
  Number(n ?? 0).toLocaleString("fa-IR");

export function formatDateSafe(
  value: string | Date | null | undefined,
  options?: Intl.DateTimeFormatOptions,
) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("fa-IR", options).format(date);
}