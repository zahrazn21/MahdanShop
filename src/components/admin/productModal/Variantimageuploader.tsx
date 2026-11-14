"use client";

import { useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";

interface VariantImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  disabled?: boolean;
}

async function uploadImage(file: File): Promise<string> {
  const body = new FormData();
  body.append("file", file);

  const res = await fetch("/api/upload", { method: "POST", body });
  const data = await res.json();

  if (!res.ok) throw new Error(data?.error || "خطا در آپلود فایل");
  if (!data.url) throw new Error("آدرس فایل از سرور دریافت نشد");

  return data.url;
}


export function VariantImageUploader({
  images,
  onChange,
  disabled,
}: VariantImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;

    setIsUploading(true);
    setError("");

    try {
      const urls = await Promise.all(Array.from(files).map(uploadImage));
      onChange([...images, ...urls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در آپلود تصویر");
    } finally {
      setIsUploading(false);
    }
  };

  const remove = (index: number) =>
    onChange(images.filter((_, i) => i !== index));

  const makePrimary = (index: number) =>
    onChange([images[index], ...images.filter((_, i) => i !== index)]);

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        عکس تنوع <span className="text-xs text-gray-400">(اختیاری)</span>
      </label>

      <div className="flex flex-wrap items-center gap-2">
        {images.map((src, index) => (
          <div
            key={src}
            className={`group relative h-16 w-16 overflow-hidden rounded-lg border bg-white ${
              index === 0 ? "ring-2 ring-pink-500" : ""
            }`}
          >
            <Image
              src={src}
              alt={`عکس تنوع ${index + 1}`}
              fill
              sizes="64px"
              className="object-cover"
            />

            {index === 0 ? (
              <span className="absolute inset-x-0 bottom-0 bg-pink-500/90 text-center text-[10px] text-white">
                اصلی
              </span>
            ) : (
              <button
                type="button"
                onClick={() => makePrimary(index)}
                className="absolute inset-x-0 bottom-0 bg-black/60 text-center text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                عکس اصلی
              </button>
            )}

            <button
              type="button"
              onClick={() => remove(index)}
              aria-label="حذف عکس"
              className="absolute right-0.5 top-0.5 rounded-full bg-black/60 p-0.5 text-white"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        <label
          className={`flex h-16 w-16 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-lg border-2 border-dashed border-gray-300 text-gray-400 transition-colors hover:border-pink-300 hover:text-pink-500 ${
            isUploading || disabled ? "pointer-events-none opacity-60" : ""
          }`}
        >
          {isUploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <ImagePlus className="h-5 w-5" />
          )}
          <span className="text-[10px]">افزودن</span>

          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}