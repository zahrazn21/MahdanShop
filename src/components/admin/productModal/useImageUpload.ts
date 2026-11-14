/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { ProductFormData } from "@/src/shared/lib/validators/productValidation";

interface UseImageUploadParams {
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  isLoading: boolean;
}


export function useImageUpload({
  setFormData,
  setErrors,
  isLoading,
}: UseImageUploadParams) {
  const [isUploadingMain, setIsUploadingMain] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  const uploadImage = async (file: File) => {
    const body = new FormData();
    body.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || "خطا در آپلود فایل");
    }

    if (!data.url) {
      throw new Error("آدرس فایل از سرور دریافت نشد");
    }

    return data.url;
  };

  const {
    getRootProps: getMainRootProps,
    getInputProps: getMainInputProps,
    isDragActive: isMainDragActive,
  } = useDropzone({
    accept: {
      "image/*": [],
    },
    multiple: false,
    disabled: isUploadingMain || isLoading,
    onDrop: async (files) => {
      if (!files.length) return;

      setIsUploadingMain(true);

      try {
        const url = await uploadImage(files[0]);

        setFormData((prev: any) => ({
          ...prev,
          image: url,
        }));

        setErrors((prev) => {
          const next = { ...prev };
          delete next.image;
          return next;
        });
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          image:
            error instanceof Error ? error.message : "خطا در آپلود تصویر اصلی",
        }));
      } finally {
        setIsUploadingMain(false);
      }
    },
  });

  const {
    getRootProps: getGalleryRootProps,
    getInputProps: getGalleryInputProps,
    isDragActive: isGalleryDragActive,
  } = useDropzone({
    accept: {
      "image/*": [],
    },
    multiple: true,
    disabled: isUploadingGallery || isLoading,
    onDrop: async (files) => {
      if (!files.length) return;

      setIsUploadingGallery(true);

      try {
        const urls = await Promise.all(files.map((file) => uploadImage(file)));

        setFormData((prev: any) => ({
          ...prev,
          images: [...(Array.isArray(prev.images) ? prev.images : []), ...urls],
        }));

        setErrors((prev) => {
          const next = { ...prev };
          delete next.images;
          return next;
        });
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          images:
            error instanceof Error
              ? error.message
              : "خطا در آپلود تصاویر گالری",
        }));
      } finally {
        setIsUploadingGallery(false);
      }
    },
  });

  const removeMainImage = () => {
    setFormData((prev: any) => ({
      ...prev,
      image: "",
    }));
  };

  const removeGalleryImage = (index: number) => {
    setFormData((prev: any) => {
      const images = Array.isArray(prev.images) ? [...prev.images] : [];

      images.splice(index, 1);

      return {
        ...prev,
        images,
      };
    });
  };

  return {
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
  };
}
