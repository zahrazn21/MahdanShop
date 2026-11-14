import { ProductFormData } from "@/src/shared/lib/validators/productValidation";
import { numberToPersianWords } from "@/src/shared/utils/numberToPersianWords";
import { OrderBatch, ShippingClass } from "./types";

interface BasicInfoTabProps {
  formData: ProductFormData;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  handleFieldChange: (
    field: keyof ProductFormData,
    value: ProductFormData[keyof ProductFormData],
  ) => void;
  handleBlur: (field: keyof ProductFormData) => void;
  handleAvailabilityTypeChange: (value: "IN_STOCK" | "PRE_ORDER") => void;
  openBatches: OrderBatch[];
  isLoadingBatches: boolean;
}

export function BasicInfoTab({
  formData,
  errors,
  touched,
  handleFieldChange,
  handleBlur,
  handleAvailabilityTypeChange,
  openBatches,
  isLoadingBatches,
}: BasicInfoTabProps) {
  const hasVariants =
    Array.isArray(formData.variants) && formData.variants.length > 0;

  const variantsTotalStock = hasVariants
    ? (formData.variants ?? []).reduce(
        (sum, variant) => sum + (Number(variant.stock) || 0),
        0,
      )
    : 0;

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          نام محصول <span className="text-red-500">*</span>
        </label>

        <input
          type="text"
          required
          value={formData.name ?? ""}
          onChange={(e) => handleFieldChange("name", e.target.value)}
          onBlur={() => handleBlur("name")}
          className={`w-full rounded-lg border px-3 py-2 focus:border-pink-400 focus:outline-none ${
            errors.name && touched.name ? "border-red-500" : "border-gray-200"
          }`}
        />

        {errors.name && touched.name && (
          <p className="mt-1 text-xs text-red-500">{errors.name}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            قیمت (تومان) <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            inputMode="numeric"
            required
            value={
              formData.price !== "" && formData.price != null
                ? Number(String(formData.price).replace(/,/g, "")).toLocaleString(
                    "en-US",
                  )
                : ""
            }
            onChange={(e) => {
              const rawValue = e.target.value.replace(/,/g, "").replace(/\D/g, "");

              handleFieldChange("price", rawValue);
            }}
            onBlur={() => handleBlur("price")}
            placeholder="مثلاً 250,000"
            className={`w-full rounded-lg border px-3 py-2 ${
              errors.price && touched.price ? "border-red-500" : "border-gray-200"
            }`}
          />

          {/* نمایش قیمت به حروف */}
          {formData.price && (
            <p className="mt-1 text-xs text-gray-500">
              {numberToPersianWords(formData.price)} تومان
            </p>
          )}

          {errors.price && touched.price && (
            <p className="mt-1 text-xs text-red-500">{errors.price}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            قیمت اصلی (تومان)
          </label>

          <input
            type="text"
            inputMode="numeric"
            value={
              formData.originalPrice !== "" && formData.originalPrice != null
                ? Number(
                    String(formData.originalPrice).replace(/,/g, ""),
                  ).toLocaleString("en-US")
                : ""
            }
            onChange={(e) => {
              const rawValue = e.target.value.replace(/,/g, "").replace(/\D/g, "");

              handleFieldChange("originalPrice", rawValue);
            }}
            placeholder="مثلاً 500,000"
            className="w-full rounded-lg border border-gray-200 px-3 py-2"
          />

          {formData.originalPrice && (
            <p className="mt-1 text-xs text-gray-500">
              {numberToPersianWords(formData.originalPrice)} تومان
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            برند <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            required
            value={formData.brand ?? ""}
            onChange={(e) => handleFieldChange("brand", e.target.value)}
            onBlur={() => handleBlur("brand")}
            className={`w-full rounded-lg border px-3 py-2 ${
              errors.brand && touched.brand ? "border-red-500" : "border-gray-200"
            }`}
          />

          {errors.brand && touched.brand && (
            <p className="mt-1 text-xs text-red-500">{errors.brand}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            موجودی <span className="text-red-500">*</span>
          </label>

          <input
            type="number"
            required={!hasVariants}
            disabled={hasVariants}
            value={hasVariants ? variantsTotalStock : (formData.stock ?? "")}
            onChange={(e) => handleFieldChange("stock", e.target.value)}
            onBlur={() => handleBlur("stock")}
            className={`w-full rounded-lg border px-3 py-2 ${
              hasVariants ? "bg-gray-100 text-gray-500" : ""
            } ${
              errors.stock && touched.stock ? "border-red-500" : "border-gray-200"
            }`}
          />

          {hasVariants && (
            <p
              className={`mt-1 text-xs ${
                variantsTotalStock === 0 ? "text-amber-600" : "text-gray-400"
              }`}
            >
              {variantsTotalStock === 0
                ? "⚠️ چون این محصول تنوع دارد، این فیلد نادیده گرفته می‌شود و موجودی از مجموع تنوع‌ها محاسبه می‌شود؛ در حال حاضر هیچ‌کدام از تنوع‌ها موجودی ندارند، پس محصول ناموجود اعلام خواهد شد. موجودی هر تنوع را در تب «جزئیات» تنظیم کنید."
                : "چون این محصول تنوع دارد، موجودی از مجموع موجودی تنوع‌ها محاسبه می‌شود (این فیلد صرفاً نمایشی است)."}
            </p>
          )}

          {!hasVariants && formData.availabilityType === "PRE_ORDER" && (
            <p className="mt-1 text-xs text-gray-400">
              برای محصولات وارداتی این عدد صرفاً اطلاعاتی است و روی نمایش
              محصول در سایت تأثیر ندارد.
            </p>
          )}

          {errors.stock && touched.stock && (
            <p className="mt-1 text-xs text-red-500">{errors.stock}</p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            اندازه بسته‌بندی <span className="text-red-500">*</span>
          </label>

          <select
            value={formData.shippingClass ?? "SMALL"}
            onChange={(e) =>
              handleFieldChange("shippingClass", e.target.value as ShippingClass)
            }
            className="w-full rounded-lg border border-gray-200 px-3 py-2"
          >
            <option value="SMALL">کوچک - پاکت پستی</option>

            <option value="MEDIUM">متوسط - جعبه کوچک</option>

            <option value="LARGE">بزرگ - جعبه بزرگ</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              کد محصول
            </label>

            <input
              type="text"
              value={formData.sku ?? ""}
              onChange={(e) => handleFieldChange("sku", e.target.value)}
              onBlur={() => handleBlur("sku")}
              className={`w-full rounded-lg border border-gray-200 px-3 py-2`}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              وزن (گرم)
            </label>

            <input
              type="number"
              value={formData.weight ?? ""}
              onChange={(e) => handleFieldChange("weight", e.target.value)}
              onBlur={() => handleBlur("weight")}
              className={`w-full rounded-lg border border-gray-200 px-3 py-2`}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="group">
          <label
            htmlFor="category"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            دسته‌بندی <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <select
              id="category"
              value={formData.category ?? ""}
              onChange={(e) => handleFieldChange("category", e.target.value)}
              className="
        w-full appearance-none
        rounded-xl border border-gray-200
        bg-gray-50
        px-4 py-3 pl-11
        text-sm font-medium text-gray-700
        shadow-sm
        transition-all
        duration-200
        hover:border-gray-300
        hover:bg-white
        focus:border-indigo-500
        focus:bg-white
        focus:outline-none
        focus:ring-4
        focus:ring-indigo-500/10
      "
            >
              <option value="" disabled>
                انتخاب دسته‌بندی...
              </option>

              <optgroup label="زیبایی و مراقبت">
                {" "}
                <option value="cosmetics">لوازم آرایشی</option>{" "}
                <option value="personal-care">
                  مراقبت از پوست، مو و بدن
                </option>{" "}
                <option value="fragrance">عطر و ادکلن</option>{" "}
              </optgroup>

              <optgroup label="فروشگاه">
                <option value="stationery">لوازم تحریر</option>
                <option value="accessories">اکسسوری</option>
                <option value="clothing">پوشاک</option>
                <option value="bags">کیف و کوله پشتی</option>
                <option value="lego">لگو</option>
                <option value="cute-items">آیتم‌های فانتزی</option>
              </optgroup>
            </select>

            <svg
              className="
        pointer-events-none
        absolute left-4 top-1/2
        h-5 w-5 -translate-y-1/2
        text-gray-400
        transition-colors
        group-focus-within:text-indigo-500
      "
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 1.04l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            وضعیت انتشار
          </label>

          <select
            className="w-full rounded-lg border border-gray-200 px-3 py-2"
            value={formData.status}
            onChange={(e) =>
              handleFieldChange(
                "status",
                e.target.value as ProductFormData["status"],
              )
            }
          >
            <option value="ACTIVE">فعال</option>

            <option value="DRAFT">پیش‌نویس</option>

            <option value="OUT_OF_STOCK">ناموجود</option>

            <option value="ARCHIVED">بایگانی</option>
          </select>
        </div>
      </div>
      <div className="rounded-xl border border-gray-200 p-4">
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          نوع تأمین <span className="text-red-500">*</span>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleAvailabilityTypeChange("IN_STOCK")}
            className={`rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors ${
              formData.availabilityType === "IN_STOCK"
                ? "border-pink-500 bg-pink-50 text-pink-700"
                : "border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            داخلی
            <span className="mt-0.5 block text-xs font-normal opacity-70">
              موجود در انبار
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleAvailabilityTypeChange("PRE_ORDER")}
            className={`rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors ${
              formData.availabilityType === "PRE_ORDER"
                ? "border-pink-500 bg-pink-50 text-pink-700"
                : "border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            وارداتی
            <span className="mt-0.5 block text-xs font-normal opacity-70">
              پیش‌سفارش / دوره‌ای
            </span>
          </button>
        </div>

        {errors.availabilityType && touched.availabilityType && (
          <p className="mt-2 text-xs text-red-500">
            {errors.availabilityType}
          </p>
        )}

        {formData.availabilityType === "PRE_ORDER" && (
          <div className="mt-4 space-y-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-800">
              تنظیمات محصول وارداتی
            </p>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                دوره سفارش‌گیری <span className="text-red-500">*</span>
              </label>

              <select
                value={formData.batchId ?? ""}
                onChange={(e) =>
                  handleFieldChange("batchId", e.target.value || null)
                }
                onBlur={() => handleBlur("batchId")}
                className={`w-full rounded-lg border px-3 py-2 ${
                  errors.batchId && touched.batchId
                    ? "border-red-500"
                    : "border-gray-200"
                }`}
              >
                <option value="" disabled>
                  {isLoadingBatches ? "در حال بارگذاری..." : "انتخاب دوره..."}
                </option>

                {openBatches.map((batch) => (
                  <option key={batch.id} value={batch.id}>
                    {batch.title} (دوره {batch.batchNumber})
                    {batch.status !== "OPEN" ? " — غیرفعال" : ""}
                  </option>
                ))}
              </select>

              {openBatches.filter((b) => b.status === "OPEN").length === 0 &&
                !isLoadingBatches && (
                  <p className="mt-1 text-xs text-amber-700">
                    هیچ دوره‌ی بازی برای سفارش‌گیری وجود ندارد. ابتدا یک دوره
                    جدید بسازید.
                  </p>
                )}

              {errors.batchId && touched.batchId && (
                <p className="mt-1 text-xs text-red-500">{errors.batchId}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                زمان تقریبی تأمین (روز) <span className="text-red-500">*</span>
              </label>

              <input
                type="number"
                value={formData.estimatedDeliveryDays ?? ""}
                onChange={(e) =>
                  handleFieldChange("estimatedDeliveryDays", e.target.value)
                }
                onBlur={() => handleBlur("estimatedDeliveryDays")}
                placeholder="مثلاً 90"
                className={`w-full rounded-lg border px-3 py-2 ${
                  errors.estimatedDeliveryDays && touched.estimatedDeliveryDays
                    ? "border-red-500"
                    : "border-gray-200"
                }`}
              />

              {errors.estimatedDeliveryDays && touched.estimatedDeliveryDays && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.estimatedDeliveryDays}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                توضیح پیش‌سفارش
              </label>

              <textarea
                rows={2}
                value={formData.preOrderNote ?? ""}
                onChange={(e) => handleFieldChange("preOrderNote", e.target.value)}
                placeholder="این محصول پس از تأمین خارجی ارسال می‌شود"
                className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2"
              />
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          توضیحات
        </label>

        <textarea
          rows={4}
          value={formData.description ?? ""}
          onChange={(e) => handleFieldChange("description", e.target.value)}
          className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2"
        />
      </div>
    </div>
  );
}
