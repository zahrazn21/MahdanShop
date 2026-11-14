"use client";

import { X } from "lucide-react";
import { useState } from "react";

import { BasicInfoTab } from "./productModal/BasicInfoTab";
import { ImagesTab } from "./productModal/ImagesTab";
import { DetailsTab } from "./productModal/DetailsTab";
import { SeoTab } from "./productModal/SeoTab";
import { useImageUpload } from "./productModal/useImageUpload";
import { useOrderBatches } from "./productModal/useOrderBatches";
import { useProductForm } from "./productModal/useProductForm";
import { ProductModalProps, Tab } from "./productModal/types";

const TABS: { id: Tab; label: string }[] = [
  { id: "basic", label: "اطلاعات اصلی" },
  { id: "images", label: "تصاویر" },
  { id: "details", label: "جزئیات" },
  { id: "seo", label: "SEO" },
];

export default function ProductModal({
  isOpen,
  onClose,
  onSubmit,
  editingProduct,
  formData,
  setFormData,
  isLoading = false,
}: ProductModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>("basic");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const { openBatches, isLoadingBatches } = useOrderBatches(
    isOpen,
    formData.batchId,
  );

  const {
    isUploadingMain,
    isUploadingGallery,
    getMainRootProps,
    getMainInputProps,
    isMainDragActive,
    getGalleryRootProps,
    getGalleryInputProps,
    isGalleryDragActive,
    removeMainImage,
    removeGalleryImage,
  } = useImageUpload({ setFormData, setErrors, isLoading });

  const {
    handleFieldChange,
    handleBlur,
    handleAvailabilityTypeChange,
    handleSubmit,
    hasErrorsInTab,
    addFeature,
    updateFeature,
    removeFeature,
    addIngredient,
    updateIngredient,
    removeIngredient,
  } = useProductForm({
    isOpen,
    editingProduct,
    formData,
    setFormData,
    onSubmit,
    activeTab,
    setActiveTab,
    errors,
    setErrors,
    touched,
    setTouched,
    isUploadingMain,
    isUploadingGallery,
    isLoading,
  });

  if (!isOpen) {
    return null;
  }

  const isBusy = isLoading || isUploadingMain || isUploadingGallery;

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-bold text-gray-800">
            {editingProduct ? "ویرایش محصول" : "افزودن محصول جدید"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={isBusy}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex gap-4  border-b px-4">
          {TABS.map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative whitespace-nowrap px-2 py-3 font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-b-2 border-pink-600 text-pink-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}

              {hasErrorsInTab(tab.id) && (
                <span className="absolute right-0 top-1 h-2 w-2 rounded-full bg-red-500" />
              )}
            </button>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 space-y-4 overflow-y-auto p-4"
        >
          {activeTab === "basic" && (
            <BasicInfoTab
              formData={formData}
              errors={errors}
              touched={touched}
              handleFieldChange={handleFieldChange}
              handleBlur={handleBlur}
              handleAvailabilityTypeChange={handleAvailabilityTypeChange}
              openBatches={openBatches}
              isLoadingBatches={isLoadingBatches}
            />
          )}

          {activeTab === "images" && (
            <ImagesTab
              formData={formData}
              errors={errors}
              isUploadingMain={isUploadingMain}
              isUploadingGallery={isUploadingGallery}
              getMainRootProps={getMainRootProps}
              getMainInputProps={getMainInputProps}
              isMainDragActive={isMainDragActive}
              getGalleryRootProps={getGalleryRootProps}
              getGalleryInputProps={getGalleryInputProps}
              isGalleryDragActive={isGalleryDragActive}
              removeMainImage={removeMainImage}
              removeGalleryImage={removeGalleryImage}
            />
          )}

          {activeTab === "details" && (
            <DetailsTab
              formData={formData}
              setFormData={setFormData}
              handleFieldChange={handleFieldChange}
              addFeature={addFeature}
              updateFeature={updateFeature}
              removeFeature={removeFeature}
              addIngredient={addIngredient}
              updateIngredient={updateIngredient}
              removeIngredient={removeIngredient}
            />
          )}

          {activeTab === "seo" && (
            <SeoTab
              formData={formData}
              errors={errors}
              touched={touched}
              handleFieldChange={handleFieldChange}
            />
          )}

          {Object.keys(errors).length > 0 && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-sm font-medium text-red-600">
                لطفاً خطاهای زیر را اصلاح کنید:
              </p>

              <ul className="mt-1 list-inside list-disc text-xs text-red-500">
                {Object.entries(errors).map(([field, message]) => (
                  <li key={field}>{message}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 flex gap-3 border-t pt-4">
            <button
              type="submit"
              disabled={isBusy}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-pink-500 py-2 text-white transition-colors hover:bg-pink-600 disabled:opacity-50"
            >
              {isBusy && (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}

              {isUploadingMain
                ? "در حال آپلود تصویر..."
                : isUploadingGallery
                  ? "در حال آپلود تصاویر..."
                  : isLoading
                    ? "در حال ذخیره..."
                    : editingProduct
                      ? "ویرایش"
                      : "افزودن"}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={isBusy}
              className="flex-1 rounded-full bg-gray-100 py-2 text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50"
            >
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
