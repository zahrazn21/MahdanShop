import { ProductFormData } from "@/src/shared/lib/validators/productValidation";

interface SeoTabProps {
  formData: ProductFormData;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  handleFieldChange: (
    field: keyof ProductFormData,
    value: ProductFormData[keyof ProductFormData],
  ) => void;
}

export function SeoTab({
  formData,
  errors,
  touched,
  handleFieldChange,
}: SeoTabProps) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        Slug (آدرس)
      </label>

      <input
        type="text"
        value={
          formData.slug ?? formData.name?.replace(/ /g, "-").toLowerCase() ?? ""
        }
        onChange={(e) => handleFieldChange("slug", e.target.value)}
        className={`w-full rounded-lg border px-3 py-2 ${
          errors.slug && touched.slug ? "border-red-500" : "border-gray-200"
        }`}
      />

      {errors.slug && touched.slug && (
        <p className="mt-1 text-xs text-red-500">{errors.slug}</p>
      )}

      <p className="mt-1 text-xs text-gray-400">آدرس یکتا برای صفحه محصول</p>
    </div>
  );
}
