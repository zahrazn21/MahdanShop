import { getCategoryName } from "../categories/CategoryItems";

const scopeLabels = {
  all: "همه محصولات",
  imported: "محصولات وارداتی",
  domestic: "محصولات داخلی",
} as const;

export default function ProductsEmpty({
  scope,
  category,
}: {
  scope: keyof typeof scopeLabels;
  category?: string;
}) {
  return (
    <div className="rounded-2xl bg-linear-to-br from-pink-50 to-rose-50 py-16 text-center">
      <div className="mb-4 text-6xl">🛍️</div>
      <p className="font-medium text-gray-500">محصولی یافت نشد</p>
      <p className="mt-1 text-sm text-gray-400">
        {scopeLabels[scope]}
        {category && ` در دسته ${getCategoryName(category)}`} موجود نیست
      </p>
    </div>
  );
}