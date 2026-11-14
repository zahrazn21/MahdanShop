/* eslint-disable @typescript-eslint/no-explicit-any */
import { Award, Check, Sparkles } from "lucide-react";
import ReviewsSection from "./ReviewsSection";
import { getCategoryName } from "../../categories/CategoryItems";
import ProductReviews from "../ProductReviews";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TabsSection({ product, activeTab, setActiveTab }: any) {
  const categoryName = getCategoryName(product.category);

  const hasDescription =
    typeof product.description === "string" &&
    product.description.trim().length > 0;

  const productType =
    product.scope === "imported"
      ? "وارداتی"
      : product.scope === "domestic"
        ? "موجودی ایران"
        : null;

  const fallbackDescription = [
    product.brand ? `این محصول از برند ${product.brand}` : "این محصول",
    categoryName ? `در دسته‌بندی ${categoryName} قرار دارد` : null,
    productType ? `و یک محصول ${productType} است.` : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="mt-5">
      <div className="bg-(--color-pink-light) shadow-xl shadow-pink-800/10 backdrop-blur-sm rounded-2xl overflow-hidden">
        <div className="flex border-b border-pink-100 text-sm ms:text-base">
          <button
            onClick={() => setActiveTab("description")}
            className={`flex-1 py-4 px-6 text-center font-semibold transition-all ${
              activeTab === "description"
                ? "text-pink-600 border-b-2 border-pink-500"
                : "text-gray-500 hover:text-pink-400"
            }`}
          >
            توضیحات محصول
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`flex-1 py-4 px-6 text-center font-semibold transition-all ${
              activeTab === "reviews"
                ? "text-pink-600 border-b-2 border-pink-500"
                : "text-gray-500 hover:text-pink-400"
            }`}
          >
            نظرات ({product.reviewCount})
          </button>

          <button
            onClick={() => setActiveTab("details")}
            className={`flex-1 py-4 px-6 text-center font-semibold transition-all ${
              activeTab === "details"
                ? "text-pink-600 border-b-2 border-pink-500"
                : "text-gray-500 hover:text-pink-400"
            }`}
          >
            مشخصات فنی
          </button>
        </div>

        <div dir="rtl" className="p-8">
          {activeTab === "description" && (
            <div className="space-y-6">
              <div className="prose max-w-none">
                {hasDescription ? (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line text-justify">
                    {product.description}
                  </p>
                ) : (
                  <div className="rounded-xl bg-linear-to-r from-pink-50 to-rose-50 p-5">
                    <h3 className="font-bold text-gray-800 text-lg mb-3">
                      درباره این محصول
                    </h3>

                    <p className="text-gray-700 leading-relaxed whitespace-pre-line text-justify">
                      {product.description}
                    </p>
                    <p className="text-gray-500 text-sm leading-relaxed mt-3">
                      توضیحات تکمیلی برای این محصول هنوز ثبت نشده است.
                    </p>
                  </div>
                )}
              </div>

              {product.howToUse && (
                <div className="bg-linear-to-r from-pink-50 to-rose-50 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-pink-600" />

                    <h3 className="font-bold text-gray-800 text-lg">
                      نحوه استفاده
                    </h3>
                  </div>

                  <p className="text-gray-700 leading-relaxed">
                    {product.howToUse}
                  </p>
                </div>
              )}

              {product.features && product.features.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                    <Award className="w-5 h-5 text-pink-600" />
                    ویژگی‌های محصول
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {product.features.map((feature: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-gray-700"
                      >
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />

                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "reviews" && <ProductReviews productId={product.id} />}

          {activeTab === "details" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailRow label="برند" value={product.brand} />

              <DetailRow
                label="دسته‌بندی"
                value={getCategoryName(product.category)}
              />

              <DetailRow
                label="نوع محصول"
                value={product.scope === "imported" ? "وارداتی" : "داخلی"}
              />

              {/* <DetailRow label="کد محصول" value={product.id} /> */}

              <DetailRow label="موجودی" value={`${product.stock} عدد`} />

              <DetailRow
                label="تاریخ ثبت"
                value={new Date(product.createdAt).toLocaleDateString("fa-IR")}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DetailRow({ label, value }: any) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-100">
      <span className="text-gray-500">{label}:</span>

      <span className="font-semibold text-gray-800">{value}</span>
    </div>
  );
}
