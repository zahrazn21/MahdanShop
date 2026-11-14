"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  ImagePlus,
  MessageCircle,
  Send,
  Star,
  UserCircle,
  X,
} from "lucide-react";
import { useReviews } from "@/src/shared/hooks/useReviews";

const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

function Stars({
  rating,
  interactive = false,
  onChange,
}: {
  rating: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}) {
  return (
    <div dir="ltr" className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? "button" : undefined}
          disabled={!interactive}
          onClick={() => onChange?.(star)}
          className={
            interactive
              ? "rounded-md p-0.5 transition hover:scale-110"
              : "cursor-default"
          }
          aria-label={`${star} ستاره`}
        >
          <Star
            size={interactive ? 25 : 17}
            className={
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }
          />
        </button>
      ))}
    </div>
  );
}

function formatReviewDate(date: string) {
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      dateStyle: "medium",
    }).format(new Date(date));
  } catch {
    return "";
  }
}

interface ProductReviewsProps {
  productId: string;
}

interface SelectedImage {
  file: File;
  preview: string;
}

export default function ProductReviews({
  productId,
}: ProductReviewsProps) {
  const {
    reviews,
    rating,
    reviewCount,
    isLoading,
    submitReview,
    isSubmitting,
    submitError,
  } = useReviews(productId);

  const [selectedRating, setSelectedRating] = useState(0);
  const [comment, setComment] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [images, setImages] = useState<SelectedImage[]>([]);
  const [imageError, setImageError] = useState("");
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const previewUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => {
        URL.revokeObjectURL(url);
      });

      previewUrlsRef.current = [];
    };
  }, []);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setImageError("");

    const selectedFiles = Array.from(e.target.files ?? []);

    if (selectedFiles.length === 0) {
      return;
    }

    if (images.length + selectedFiles.length > MAX_IMAGES) {
      setImageError(
        `حداکثر ${MAX_IMAGES} تصویر می‌توانید برای هر نظر انتخاب کنید.`,
      );

      e.target.value = "";
      return;
    }

    const invalidType = selectedFiles.find(
      (file) => !ALLOWED_IMAGE_TYPES.includes(file.type),
    );

    if (invalidType) {
      setImageError(
        "فرمت تصاویر باید JPG، PNG یا WebP باشد.",
      );

      e.target.value = "";
      return;
    }

    const oversizedFile = selectedFiles.find(
      (file) => file.size > MAX_IMAGE_SIZE,
    );

    if (oversizedFile) {
      setImageError(
        "حجم هر تصویر نباید بیشتر از ۵ مگابایت باشد.",
      );

      e.target.value = "";
      return;
    }

    const newImages: SelectedImage[] = selectedFiles.map(
      (file) => {
        const preview = URL.createObjectURL(file);

        previewUrlsRef.current.push(preview);

        return {
          file,
          preview,
        };
      },
    );

    setImages((previous) => [
      ...previous,
      ...newImages,
    ]);

    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((previous) => {
      const imageToRemove = previous[index];

      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);

        previewUrlsRef.current =
          previewUrlsRef.current.filter(
            (url) => url !== imageToRemove.preview,
          );
      }

      return previous.filter(
        (_, imageIndex) => imageIndex !== index,
      );
    });

    setImageError("");
  };

  const clearImages = () => {
    images.forEach((image) => {
      URL.revokeObjectURL(image.preview);
    });

    previewUrlsRef.current = [];

    setImages([]);

    setImageError("");

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    setSuccessMessage("");
    setImageError("");

    if (selectedRating === 0) {
      return;
    }

    if (comment.trim().length < 3) {
      return;
    }

    try {
      const result = await submitReview({
        rating: selectedRating,
        comment: comment.trim(),
        images: images.map((image) => image.file),
      });

      setSuccessMessage(
        result.message ||
          "نظر شما با موفقیت ثبت شد و پس از بررسی نمایش داده می‌شود.",
      );

      setSelectedRating(0);
      setComment("");
      clearImages();
    } catch {}
  };

  return (
    <section
      dir="rtl"
      className="mt-8 rounded-3xl bg-white p-5 shadow-sm sm:p-7"
    >
      <div className="mb-7 flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <MessageCircle
              size={22}
              className="text-pink-500"
            />

            <h2 className="text-lg font-bold text-gray-900">
              نظرات کاربران
            </h2>
          </div>

          <p className="mt-1 text-sm text-gray-500">
            تجربه‌ات را درباره این محصول با دیگران به
            اشتراک بگذار.
          </p>
        </div>
      </div>

      <div className="mb-8 rounded-2xl bg-gray-50 p-5">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:flex-wrap">
          <div className="text-center">
            <div
              dir="ltr"
              className="text-3xl font-bold text-gray-900"
            >
              {rating > 0 ? rating.toFixed(1) : "—"}
            </div>

            <div className="mt-1">
              <Stars rating={rating} />
            </div>

            <div className="mt-1 text-xs text-gray-500">
              {reviewCount} نظر
            </div>
          </div>

          <div className="hidden h-12 w-px bg-gray-200 sm:block" />
          <div className="h-px w-full bg-gray-200 sm:hidden" />

          <div className="text-center text-sm text-gray-500 sm:text-right">
            {reviewCount > 0
              ? `بر اساس ${reviewCount} نظر ثبت‌شده`
              : "هنوز نظری برای این محصول ثبت نشده است."}
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {isLoading ? (
          <div className="rounded-2xl bg-gray-50 p-6 text-center text-sm text-gray-500">
            در حال دریافت نظرات...
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center">
            <MessageCircle
              size={32}
              className="mx-auto mb-3 text-gray-300"
            />

            <p className="font-semibold text-gray-600">
              هنوز نظری ثبت نشده است
            </p>

            <p className="mt-1 text-sm text-gray-400">
              اولین نفری باش که تجربه‌ات را ثبت می‌کند.
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <article
              key={review.id}
              className="rounded-2xl border border-gray-100 p-5"
            >
              <div className="flex items-start gap-3">
                <div className="shrink-0">
                  <UserCircle
                    size={44}
                    strokeWidth={1.5}
                    className="text-gray-300"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {review.user.username}
                      </p>

                      <p className="mt-0.5 text-xs text-gray-400">
                        {formatReviewDate(
                          review.createdAt,
                        )}
                      </p>
                    </div>

                    <Stars rating={review.rating} />
                  </div>

                  <p className="mt-4 whitespace-pre-line text-sm leading-7 text-gray-600">
                    {review.comment}
                  </p>

                  {review.imageUrls?.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                      {review.imageUrls.map(
                        (imageUrl, index) => (
                          <a
                            key={`${review.id}-${index}`}
                            href={imageUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="group relative aspect-square overflow-hidden rounded-2xl"
                          >
                            <Image
                              src={imageUrl}
                              alt={`تصویر ${
                                index + 1
                              } از نظر ${review.user.username}`}
                              fill
                              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                              unoptimized
                              className="object-cover transition duration-300 group-hover:scale-105"
                            />
                          </a>
                        ),
                      )}
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      <div className="mt-10 border-t border-gray-100 pt-8">
        <div className="mb-5">
          <h3 className="text-base font-bold text-gray-900">
            نظر خودت را ثبت کن
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            می‌توانی برای یک محصول چند تجربه متفاوت ثبت کنی.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              امتیاز شما
            </label>

            <Stars
              rating={selectedRating}
              interactive
              onChange={setSelectedRating}
            />
          </div>

          <div>
            <label
              htmlFor="review-comment"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              متن نظر
            </label>

            <textarea
              id="review-comment"
              value={comment}
              onChange={(e) =>
                setComment(e.target.value)
              }
              placeholder="تجربه‌ات درباره این محصول را بنویس..."
              rows={5}
              maxLength={2000}
              className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            />

            <div className="mt-1 text-left text-xs text-gray-400">
              {comment.length}/2000
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              تصاویر محصول
              <span className="mr-1 font-normal text-gray-400">
                (اختیاری، حداکثر ۵ تصویر)
              </span>
            </label>

            <input
              ref={imageInputRef}
              id="review-images"
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />

            <div className="flex flex-wrap gap-3">
              {images.map((image, index) => (
                <div
                  key={`${image.preview}-${index}`}
                  className="relative"
                >
                  <div className="relative h-24 w-24 overflow-hidden rounded-2xl sm:h-28 sm:w-28">
                    <Image
                      src={image.preview}
                      alt={`پیش‌نمایش تصویر ${
                        index + 1
                      }`}
                      fill
                      sizes="112px"
                      unoptimized
                      className="object-cover"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      removeImage(index)
                    }
                    className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition hover:bg-red-600"
                    aria-label={`حذف تصویر ${
                      index + 1
                    }`}
                  >
                    <X size={15} />
                  </button>
                </div>
              ))}

              {images.length < MAX_IMAGES && (
                <label
                  htmlFor="review-images"
                  className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-300 text-gray-500 transition hover:border-pink-400 hover:bg-pink-50 hover:text-pink-600 sm:h-28 sm:w-28"
                >
                  <ImagePlus size={22} />

                  <span className="text-xs font-medium">
                    افزودن تصویر
                  </span>

                  <span className="text-[10px] text-gray-400">
                    {images.length}/{MAX_IMAGES}
                  </span>
                </label>
              )}
            </div>

            <p className="mt-2 text-xs text-gray-400">
              JPG، PNG یا WebP — حداکثر ۵ مگابایت برای هر
              تصویر
            </p>

            {imageError && (
              <p className="mt-2 text-xs text-red-500">
                {imageError}
              </p>
            )}
          </div>

          {submitError && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {submitError.message}
            </div>
          )}

          {successMessage && (
            <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-600">
              {successMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={
              isSubmitting ||
              selectedRating === 0 ||
              comment.trim().length < 3
            }
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-pink-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-50 sm:inline-flex sm:w-auto"
          >
            <Send size={17} />

            {isSubmitting
              ? "در حال ارسال..."
              : "ثبت نظر"}
          </button>
        </form>
      </div>
    </section>
  );
}