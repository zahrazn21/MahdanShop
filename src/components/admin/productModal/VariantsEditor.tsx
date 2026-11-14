import { Plus, Trash2 } from "lucide-react";
import { ProductFormData } from "@/src/shared/lib/validators/productValidation";
import { numberToPersianWords } from "@/src/shared/utils/numberToPersianWords";
import { VariantImageUploader } from "./Variantimageuploader";

interface VariantsEditorProps {
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
}

export function VariantsEditor({ formData, setFormData }: VariantsEditorProps) {
  const variants = formData.variants ?? [];

  const totalStock = variants.reduce(
    (sum, variant) => sum + (Number(variant.stock) || 0),
    0,
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-4">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">
            تنوع‌های محصول
          </h3>

          <p className="mt-1 text-xs leading-6 text-gray-500">
            اگر محصول در رنگ، سایز، حجم یا مدل‌های مختلف فروخته می‌شود، هر مدل
            را به‌عنوان یک تنوع اضافه کنید.
          </p>

          <div className="mt-2 rounded-lg bg-blue-50 px-3 py-2 text-xs leading-6 text-blue-700">
            مثال: یک کرم می‌تواند تنوع‌های «صورتی - ۳۰ میل» و «قرمز - ۵۰ میل»
            داشته باشد. برای هر تنوع می‌توانید قیمت، موجودی و SKU جداگانه
            تعیین کنید.
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              variants: [
                ...(prev.variants ?? []),
                {
                  id: crypto.randomUUID(),
                  name: "",
                  colorName: "",
                  hexCode: "",
                  stock: "",
                  price: "",
                  size: "",
                  volume: "",
                  volumeUnit: "ml",
                  sku: "",
                  images: [],
                },
              ],
            }))
          }
          className="flex shrink-0 items-center gap-1 rounded-lg bg-pink-50 px-3 py-2 text-sm font-medium text-pink-600 transition-colors hover:bg-pink-100"
        >
          <Plus className="h-4 w-4" />
          افزودن تنوع
        </button>
      </div>

      {variants.length > 0 && (
        <div
          className={`mb-4 rounded-lg px-3 py-2 text-xs font-medium ${
            totalStock === 0
              ? "bg-amber-50 text-amber-700"
              : "bg-green-50 text-green-700"
          }`}
        >
          {totalStock === 0
            ? "⚠️ مجموع موجودی همه‌ی تنوع‌ها صفر است — این محصول با این وضعیت «ناموجود» ثبت می‌شود."
            : `مجموع موجودی همه‌ی تنوع‌ها: ${totalStock} عدد`}
        </div>
      )}

      <div className="space-y-4">
        {variants.map((variant, index) => (
          <div key={variant.id} className="rounded-xl border bg-gray-50 p-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  نام تنوع
                </label>

                <input
                  type="text"
                  value={variant.name}
                  onChange={(e) =>
                    setFormData((prev) => {
                      const variants = [...(prev.variants ?? [])];

                      variants[index] = {
                        ...variants[index],
                        name: e.target.value,
                      };

                      return {
                        ...prev,
                        variants,
                      };
                    })
                  }
                  placeholder="مثلاً قرمز یا کد محصول"
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  رنگ
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={variant.hexCode || "#000000"}
                    onChange={(e) =>
                      setFormData((prev) => {
                        const variants = [...(prev.variants ?? [])];

                        variants[index] = {
                          ...variants[index],
                          hexCode: e.target.value,
                        };

                        return {
                          ...prev,
                          variants,
                        };
                      })
                    }
                    className="h-10 w-14 cursor-pointer rounded-lg border p-1"
                  />
                  <input
                    type="text"
                    value={variant.hexCode || ""}
                    onChange={(e) =>
                      setFormData((prev) => {
                        const variants = [...(prev.variants ?? [])];

                        variants[index] = {
                          ...variants[index],
                          hexCode: e.target.value,
                        };

                        return {
                          ...prev,
                          variants,
                        };
                      })
                    }
                    placeholder="#FF0000"
                    className="flex-1 rounded-lg border px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  موجودی
                </label>
                <input
                  type="number"
                  value={variant.stock}
                  onChange={(e) =>
                    setFormData((prev) => {
                      const variants = [...(prev.variants ?? [])];

                      variants[index] = {
                        ...variants[index],
                        stock: e.target.value,
                      };

                      return {
                        ...prev,
                        variants,
                      };
                    })
                  }
                  placeholder="مثلاً 10"
                  className="w-full rounded-lg border px-3 py-2"
                />

                {(!variant.stock || Number(variant.stock) === 0) && (
                  <p className="mt-1 text-xs text-amber-600">
                    ⚠️ موجودی این تنوع صفر است
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  قیمت
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={
                    variant.price !== "" && variant.price != null
                      ? Number(
                          String(variant.price).replace(/,/g, ""),
                        ).toLocaleString("en-US")
                      : ""
                  }
                  onChange={(e) => {
                    const rawValue = e.target.value
                      .replace(/,/g, "")
                      .replace(/\D/g, "");

                    setFormData((prev) => {
                      const variants = [...(prev.variants ?? [])];

                      variants[index] = {
                        ...variants[index],
                        price: rawValue,
                      };

                      return {
                        ...prev,
                        variants,
                      };
                    });
                  }}
                  placeholder="مثلاً 250,000"
                  className="w-full rounded-lg border px-3 py-2"
                />

                {variant.price && (
                  <p className="mt-1 text-xs text-gray-500">
                    {numberToPersianWords(variant.price)} تومان
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  سایز
                </label>
                <input
                  type="text"
                  value={variant.size || ""}
                  onChange={(e) =>
                    setFormData((prev) => {
                      const variants = [...(prev.variants ?? [])];

                      variants[index] = {
                        ...variants[index],
                        size: e.target.value,
                      };

                      return {
                        ...prev,
                        variants,
                      };
                    })
                  }
                  placeholder="مثلاً متوسط"
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  حجم
                </label>

                <div className="flex gap-2">
                  <input
                    type="number"
                    value={variant.volume ?? ""}
                    onChange={(e) =>
                      setFormData((prev) => {
                        const variants = [...(prev.variants ?? [])];

                        variants[index] = {
                          ...variants[index],
                          volume: e.target.value,
                        };

                        return {
                          ...prev,
                          variants,
                        };
                      })
                    }
                    placeholder="100"
                    className="w-full rounded-lg border px-3 py-2"
                  />

                  <select
                    value={variant.volumeUnit || "ml"}
                    onChange={(e) =>
                      setFormData((prev) => {
                        const variants = [...(prev.variants ?? [])];

                        variants[index] = {
                          ...variants[index],
                          volumeUnit: e.target.value as "ml" | "gr" | "oz",
                        };

                        return {
                          ...prev,
                          variants,
                        };
                      })
                    }
                    className="rounded-lg border px-3 py-2"
                  >
                    <option value="ml">ml</option>
                    <option value="gr">گرم</option>
                    <option value="oz">oz</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  SKU
                </label>

                <input
                  type="text"
                  value={variant.sku || ""}
                  onChange={(e) =>
                    setFormData((prev) => {
                      const variants = [...(prev.variants ?? [])];

                      variants[index] = {
                        ...variants[index],
                        sku: e.target.value,
                      };

                      return {
                        ...prev,
                        variants,
                      };
                    })
                  }
                  placeholder="مثلاً RED-100"
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>
            </div>
            <div className="mt-4">
              <VariantImageUploader
                images={variant.images ?? []}
                onChange={(images) =>
                  setFormData((prev) => {
                    const variants = [...(prev.variants ?? [])];

                    variants[index] = { ...variants[index], images };

                    return { ...prev, variants };
                  })
                }
              />
            </div>
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  variants: (prev.variants ?? []).filter((_, i) => i !== index),
                }))
              }
              className="mt-4 text-sm text-red-500"
            >
              حذف این تنوع
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}