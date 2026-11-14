import { Plus, Trash2 } from "lucide-react";
import { ProductFormData } from "@/src/shared/lib/validators/productValidation";

interface SpecificationsEditorProps {
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
}

export function SpecificationsEditor({
  formData,
  setFormData,
}: SpecificationsEditorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            مشخصات محصول
          </label>

          <p className="mt-1 text-xs leading-6 text-gray-500">
            مشخصات اضافی محصول را وارد کنید؛ مثل برند، کشور سازنده، حجم، نوع
            پوست، جنس، رنگ و سایر ویژگی‌های محصول.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              specifications: [
                ...(prev.specifications ?? []),
                {
                  key: "",
                  label: "",
                  value: "",
                },
              ],
            }))
          }
          className="flex shrink-0 items-center gap-1 rounded-lg bg-pink-50 px-3 py-2 text-sm font-medium text-pink-600 transition hover:bg-pink-100"
        >
          <Plus className="h-4 w-4" />
          افزودن مشخصه
        </button>
      </div>

      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
        <p className="mb-2 text-sm font-semibold text-blue-800">
          💡 راهنمای تکمیل مشخصات
        </p>

        <div className="space-y-1 text-xs leading-6 text-blue-700">
          <p>
            <strong>کلید داخلی:</strong> یک نام انگلیسی کوتاه برای استفاده
            سیستم است؛ مثل <code className="rounded bg-white px-1">madeIn</code>{" "}
            یا <code className="rounded bg-white px-1">volume</code>.
          </p>

          <p>
            <strong>عنوان:</strong> نامی که مشتری در سایت می‌بیند؛ مثل «کشور
            سازنده» یا «حجم».
          </p>

          <p>
            <strong>مقدار:</strong> مقدار واقعی مشخصه را وارد کنید؛ مثل «کره
            جنوبی» یا «100 میلی‌لیتر».
          </p>
        </div>

        <div className="mt-3 rounded-lg bg-white/70 p-3 text-xs text-blue-800">
          <span className="font-semibold">مثال:</span>
          <span className="mr-2">
            کلید داخلی: <code>madeIn</code>
          </span>
          <span className="mr-2">
            عنوان: <strong>کشور سازنده</strong>
          </span>
          <span>
            مقدار: <strong>کره جنوبی</strong>
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {(formData.specifications ?? []).map((spec, index) => (
          <div
            key={index}
            className="rounded-xl border border-gray-200 bg-gray-50 p-3"
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_2fr_auto]">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                  کلید داخلی
                </label>

                <input
                  value={spec.key}
                  onChange={(e) =>
                    setFormData((prev) => {
                      const specifications = [...prev.specifications];

                      specifications[index] = {
                        ...specifications[index],
                        key: e.target.value,
                      };

                      return {
                        ...prev,
                        specifications,
                      };
                    })
                  }
                  placeholder="مثلاً: madeIn"
                  dir="ltr"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-pink-400 focus:outline-none"
                />

                <p className="mt-1 text-[11px] text-gray-400">
                  نام انگلیسی برای سیستم
                </p>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                  عنوان
                </label>

                <input
                  value={spec.label}
                  onChange={(e) =>
                    setFormData((prev) => {
                      const specifications = [...prev.specifications];

                      specifications[index] = {
                        ...specifications[index],
                        label: e.target.value,
                      };

                      return {
                        ...prev,
                        specifications,
                      };
                    })
                  }
                  placeholder="مثلاً: کشور سازنده"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-pink-400 focus:outline-none"
                />

                <p className="mt-1 text-[11px] text-gray-400">
                  عنوانی که مشتری می‌بیند
                </p>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                  مقدار
                </label>

                <input
                  value={spec.value}
                  onChange={(e) =>
                    setFormData((prev) => {
                      const specifications = [...prev.specifications];

                      specifications[index] = {
                        ...specifications[index],
                        value: e.target.value,
                      };

                      return {
                        ...prev,
                        specifications,
                      };
                    })
                  }
                  placeholder="مثلاً: کره جنوبی"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-pink-400 focus:outline-none"
                />

                <p className="mt-1 text-[11px] text-gray-400">
                  مقدار واقعی مشخصه
                </p>
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      specifications: prev.specifications.filter(
                        (_, i) => i !== index,
                      ),
                    }))
                  }
                  className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 hover:text-red-600"
                  title="حذف مشخصه"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {(formData.specifications ?? []).length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
          <p className="text-sm text-gray-500">هنوز مشخصه‌ای اضافه نشده است.</p>

          <p className="mt-1 text-xs text-gray-400">
            برای اضافه کردن مشخصات مثل برند، کشور سازنده، حجم یا جنس، روی
            «افزودن مشخصه» کلیک کنید.
          </p>
        </div>
      )}
    </div>
  );
}
