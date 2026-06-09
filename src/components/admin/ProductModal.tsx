/* eslint-disable @typescript-eslint/no-explicit-any */
// components/admin/ModalEditAdd.tsx
"use client";

import { X, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { ProductFormSchema } from "@/src/app/lib/validators/productValidation";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  editingProduct: any | null;
  formData: any;
  setFormData: (data: any) => void;
  isLoading?: boolean;
}

export default function ProductModal({
  isOpen,
  onClose,
  onSubmit,
  editingProduct,
  formData,
  setFormData,
  isLoading = false,
}: ProductModalProps) {
  const [activeTab, setActiveTab] = useState<"basic" | "images" | "details" | "seo">("basic");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // اعتبارسنجی یک فیلد
  const validateField = (name: string, value: any) => {
    const testData = { ...formData, [name]: value };
    const result = ProductFormSchema.safeParse(testData);
    
    if (!result.success) {
      const fieldError = result.error.issues.find((err) => err.path[0] === name);
      if (fieldError) {
        setErrors((prev) => ({ ...prev, [name]: fieldError.message }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    if (touched[field]) {
      validateField(field, value);
    }
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...(formData.features || []), ""],
    });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...(formData.features || [])];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const removeFeature = (index: number) => {
    const newFeatures = [...(formData.features || [])];
    newFeatures.splice(index, 1);
    setFormData({ ...formData, features: newFeatures });
  };

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...(formData.ingredients || []), ""],
    });
  };

  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...(formData.ingredients || [])];
    newIngredients[index] = value;
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const removeIngredient = (index: number) => {
    const newIngredients = [...(formData.ingredients || [])];
    newIngredients.splice(index, 1);
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const addGalleryImage = () => {
    const newImage = prompt("آدرس تصویر را وارد کنید:");
    if (newImage && newImage.trim()) {
      setFormData({
        ...formData,
        images: [...(formData.images || []), newImage.trim()],
      });
    }
  };

  const removeGalleryImage = (index: number) => {
    const newImages = [...(formData.images || [])];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // اعتبارسنجی کل فرم
    const result = ProductFormSchema.safeParse(formData);
    
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(newErrors);
      
      const allTouched: Record<string, boolean> = {};
      Object.keys(formData).forEach((key) => {
        allTouched[key] = true;
      });
      setTouched(allTouched);
      
      if (Object.keys(newErrors).length > 0) {
        setActiveTab("basic");
      }
      return;
    }
    
    setErrors({});
    onSubmit(result.data);
  };

  const hasErrorsInTab = (tab: string) => {
    const tabFields = {
      basic: ["name", "price", "brand", "stock", "category", "scope"],
      images: ["image"],
      details: [],
      seo: ["slug"],
    };
    
    const fields = tabFields[tab as keyof typeof tabFields] || [];
    return fields.some(field => errors[field]);
  };

  if (!isOpen) return null;

  return (
    <div dir="rtl" className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* هدر */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">
            {editingProduct ? "ویرایش محصول" : "افزودن محصول جدید"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* تب‌ها */}
        <div className="flex border-b px-4 gap-4 overflow-x-auto">
          {[
            { id: "basic", label: "اطلاعات اصلی" },
            { id: "images", label: "تصاویر" },
            { id: "details", label: "جزئیات" },
            { id: "seo", label: "SEO" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-2 font-medium transition-colors whitespace-nowrap relative ${
                activeTab === tab.id
                  ? "text-pink-600 border-b-2 border-pink-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              {hasErrorsInTab(tab.id) && (
                <span className="absolute top-1 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
          ))}
        </div>

        {/* فرم */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* تب اطلاعات اصلی */}
          {activeTab === "basic" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نام محصول <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                  onBlur={() => handleBlur("name")}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-pink-400 ${
                    errors.name && touched.name ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.name && touched.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    قیمت (تومان) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => handleFieldChange("price", e.target.value)}
                    onBlur={() => handleBlur("price")}
                    className={`w-full border rounded-lg px-3 py-2 ${
                      errors.price && touched.price ? "border-red-500" : "border-gray-200"
                    }`}
                  />
                  {errors.price && touched.price && (
                    <p className="text-red-500 text-xs mt-1">{errors.price}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">قیمت اصلی (تومان)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => handleFieldChange("originalPrice", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    برند <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => handleFieldChange("brand", e.target.value)}
                    onBlur={() => handleBlur("brand")}
                    className={`w-full border rounded-lg px-3 py-2 ${
                      errors.brand && touched.brand ? "border-red-500" : "border-gray-200"
                    }`}
                  />
                  {errors.brand && touched.brand && (
                    <p className="text-red-500 text-xs mt-1">{errors.brand}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    موجودی <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => handleFieldChange("stock", e.target.value)}
                    onBlur={() => handleBlur("stock")}
                    className={`w-full border rounded-lg px-3 py-2 ${
                      errors.stock && touched.stock ? "border-red-500" : "border-gray-200"
                    }`}
                  />
                  {errors.stock && touched.stock && (
                    <p className="text-red-500 text-xs mt-1">{errors.stock}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">دسته‌بندی *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleFieldChange("category", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2"
                  >
                    <option value="cosmetics">لوازم آرایشی</option>
                    <option value="stationery">لوازم تحریر</option>
                    <option value="cute-items">آیتم‌های فانتزی</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">نوع *</label>
                  <select
                    value={formData.scope}
                    onChange={(e) => handleFieldChange("scope", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2"
                  >
                    <option value="imported">وارداتی</option>
                    <option value="domestic">داخلی</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">توضیحات</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleFieldChange("description", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 resize-none"
                />
              </div>
            </div>
          )}

          {/* تب تصاویر - بدون آپلود و با ورودی دستی */}
          {activeTab === "images" && (
            <div className="space-y-6">
              {/* تصویر اصلی - ورودی دستی */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  آدرس تصویر اصلی <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.image}
                  onChange={(e) => handleFieldChange("image", e.target.value)}
                  onBlur={() => handleBlur("image")}
                  placeholder="/images/products/example.png"
                  className={`w-full border rounded-lg px-3 py-2 ${
                    errors.image && touched.image ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.image && touched.image && (
                  <p className="text-red-500 text-xs mt-1">{errors.image}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  آدرس تصویر را وارد کنید (مثال: /images/products/1.png)
                </p>
                
                {/* پیش‌نمایش تصویر */}
                {formData.image && formData.image !== "/images/products/new.png" && (
                  <div className="mt-2 relative w-32 h-32">
                    <Image
                      src={formData.image}
                      alt="پیش‌نمایش"
                      fill
                      className="object-contain border rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* گالری تصاویر - با ورودی دستی */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">گالری تصاویر</label>
                  <button
                    type="button"
                    onClick={addGalleryImage}
                    className="text-pink-600 text-sm flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> افزودن تصویر
                  </button>
                </div>
                <p className="text-xs text-gray-400 mb-2">
                  آدرس تصاویر اضافی را وارد کنید
                </p>

                {formData.images && formData.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-3 mt-2">
                    {formData.images.map((img: string, index: number) => (
                      <div key={index} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border">
                        <Image src={img} alt={`گالری ${index + 1}`} fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* تب جزئیات */}
          {activeTab === "details" && (
            <div className="space-y-6">
              {/* ویژگی‌ها */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">ویژگی‌های محصول</label>
                  <button type="button" onClick={addFeature} className="text-pink-600 text-sm flex items-center gap-1">
                    <Plus className="w-4 h-4" /> افزودن ویژگی
                  </button>
                </div>
                <div className="space-y-2">
                  {(formData.features || []).map((feature: string, index: number) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        placeholder="مثلاً: ماندگاری 12 ساعته"
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2"
                      />
                      <button type="button" onClick={() => removeFeature(index)} className="text-red-500">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* مواد تشکیل‌دهنده */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">مواد تشکیل‌دهنده</label>
                  <button type="button" onClick={addIngredient} className="text-pink-600 text-sm flex items-center gap-1">
                    <Plus className="w-4 h-4" /> افزودن ماده
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(formData.ingredients || []).map((ingredient: string, index: number) => (
                    <div key={index} className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1">
                      <span className="text-sm">{ingredient}</span>
                      <button type="button" onClick={() => removeIngredient(index)} className="text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* نحوه استفاده */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نحوه استفاده</label>
                <textarea
                  rows={3}
                  value={formData.howToUse || ""}
                  onChange={(e) => handleFieldChange("howToUse", e.target.value)}
                  placeholder="مثلاً: قبل از استفاده، لب‌ها را با بالم لب مرطوب کنید..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 resize-none"
                />
              </div>
            </div>
          )}

          {/* تب SEO */}
          {activeTab === "seo" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug (آدرس)</label>
                <input
                  type="text"
                  value={formData.slug || formData.name?.replace(/ /g, "-").toLowerCase() || ""}
                  onChange={(e) => handleFieldChange("slug", e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 ${
                    errors.slug && touched.slug ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.slug && touched.slug && (
                  <p className="text-red-500 text-xs mt-1">{errors.slug}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">آدرس یکتا برای صفحه محصول</p>
              </div>
            </div>
          )}

          {/* نمایش خلاصه خطاها */}
          {Object.keys(errors).length > 0 && Object.values(touched).some(Boolean) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm font-medium">لطفاً خطاهای زیر را اصلاح کنید:</p>
              <ul className="list-disc list-inside text-red-500 text-xs mt-1">
                {Object.entries(errors).map(([field, message]) => (
                  <li key={field}>{message}</li>
                ))}
              </ul>
            </div>
          )}

          {/* دکمه‌ها */}
          <div className="flex gap-3 pt-4 border-t mt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-pink-500 text-white py-2 rounded-full hover:bg-pink-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {editingProduct ? "ویرایش" : "افزودن"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}