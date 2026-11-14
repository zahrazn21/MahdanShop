/* eslint-disable @typescript-eslint/no-explicit-any */

import { Loader2, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { ProductFormData } from "@/src/shared/lib/validators/productValidation";

interface ImagesTabProps {
  formData: ProductFormData;
  errors: Record<string, string>;

  isUploadingMain: boolean;
  isUploadingGallery: boolean;

  getMainRootProps: () => any;
  getMainInputProps: () => any;
  isMainDragActive: boolean;

  getGalleryRootProps: () => any;
  getGalleryInputProps: () => any;
  isGalleryDragActive: boolean;

  removeMainImage: () => void;
  removeGalleryImage: (index: number) => void;
}

export function ImagesTab({
  formData,
  errors,
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
}: ImagesTabProps) {
  return (
    <div className="space-y-8">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          تصویر اصلی محصول <span className="text-red-500">*</span>
        </label>

        <div
          {...getMainRootProps()}
          className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
            isMainDragActive
              ? "border-pink-500 bg-pink-50"
              : "border-gray-300 hover:border-pink-400"
          }`}
        >
          <input {...getMainInputProps()} />

          {isUploadingMain ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
              <p className="text-gray-600">در حال آپلود تصویر...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-gray-400" />

              <p className="text-gray-600">عکس را اینجا بکشید و رها کنید</p>

              <p className="text-sm text-gray-400">
                یا برای انتخاب عکس کلیک کنید
              </p>
            </div>
          )}
        </div>

        {formData.image && (
          <div className="mt-4">
            <div className="relative h-40 w-40 overflow-hidden rounded-xl border bg-gray-50">
              <Image
                src={formData.image}
                alt="تصویر اصلی محصول"
                fill
                className="object-contain"
              />

              <button
                type="button"
                onClick={removeMainImage}
                className="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-white hover:bg-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {errors.image && (
          <p className="mt-2 text-xs text-red-500">{errors.image}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          گالری تصاویر
        </label>

        <div
          {...getGalleryRootProps()}
          className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
            isGalleryDragActive
              ? "border-pink-500 bg-pink-50"
              : "border-gray-300 hover:border-pink-400"
          }`}
        >
          <input {...getGalleryInputProps()} />

          {isUploadingGallery ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
              <p className="text-gray-600">در حال آپلود تصاویر...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-gray-400" />

              <p className="text-gray-600">
                چند عکس را اینجا بکشید و رها کنید
              </p>

              <p className="text-sm text-gray-400">
                یا برای انتخاب چند عکس کلیک کنید
              </p>
            </div>
          )}
        </div>

        {Array.isArray(formData.images) && formData.images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {formData.images.map((img: string, index: number) => (
              <div
                key={`${img}-${index}`}
                className="group relative aspect-square overflow-hidden rounded-lg border bg-gray-50"
              >
                <Image
                  src={img}
                  alt={`گالری ${index + 1}`}
                  fill
                  className="object-cover"
                />

                <button
                  type="button"
                  onClick={() => removeGalleryImage(index)}
                  className="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {errors.images && (
          <p className="mt-2 text-xs text-red-500">{errors.images}</p>
        )}
      </div>
    </div>
  );
}
