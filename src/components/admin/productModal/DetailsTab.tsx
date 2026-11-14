import { ProductFormData } from "@/src/shared/lib/validators/productValidation";
import { StringListEditor } from "./StringListEditor";
import { SpecificationsEditor } from "./SpecificationsEditor";
import { VariantsEditor } from "./VariantsEditor";

interface DetailsTabProps {
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
  handleFieldChange: (
    field: keyof ProductFormData,
    value: ProductFormData[keyof ProductFormData],
  ) => void;

  addFeature: () => void;
  updateFeature: (index: number, value: string) => void;
  removeFeature: (index: number) => void;

  addIngredient: () => void;
  updateIngredient: (index: number, value: string) => void;
  removeIngredient: (index: number) => void;
}

export function DetailsTab({
  formData,
  setFormData,
  handleFieldChange,
  addFeature,
  updateFeature,
  removeFeature,
  addIngredient,
  updateIngredient,
  removeIngredient,
}: DetailsTabProps) {
  return (
    <div className="space-y-6">
      <StringListEditor
        label="ویژگی‌های محصول"
        addButtonLabel="افزودن ویژگی"
        placeholder="مثلاً: ماندگاری 12 ساعته"
        items={Array.isArray(formData.features) ? formData.features : []}
        onAdd={addFeature}
        onUpdate={updateFeature}
        onRemove={removeFeature}
      />

      <StringListEditor
        label="مواد تشکیل‌دهنده"
        addButtonLabel="افزودن ماده"
        placeholder="مثلاً: ویتامین E"
        items={Array.isArray(formData.ingredients) ? formData.ingredients : []}
        onAdd={addIngredient}
        onUpdate={updateIngredient}
        onRemove={removeIngredient}
      />

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          نحوه استفاده
        </label>

        <textarea
          rows={3}
          value={formData.howToUse ?? ""}
          onChange={(e) => handleFieldChange("howToUse", e.target.value)}
          placeholder="مثلاً: قبل از استفاده..."
          className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2"
        />
      </div>

      <SpecificationsEditor formData={formData} setFormData={setFormData} />

      <VariantsEditor formData={formData} setFormData={setFormData} />
    </div>
  );
}
