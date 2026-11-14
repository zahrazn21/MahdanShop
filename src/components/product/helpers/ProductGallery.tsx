"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react";
import { createPortal } from "react-dom";
import type { ProductVariant } from "@/src/shared/types/product";

interface ProductGalleryProps {
  product: {
    image: string;
    images?: string[];
    name: string;
    variants?: ProductVariant[];
  };
  selectedVariant?: ProductVariant | null;
  discount: number;
  isWishlist: boolean;
  setIsWishlist: (value: boolean) => void;
}

export default function ProductGallery({
  product,
  selectedVariant,
  discount,
  isWishlist,
  setIsWishlist,
}: ProductGalleryProps) {
  const allImages = Array.from(
    new Set(
      [
        product.image,
        ...(product.images ?? []),
        ...(product.variants ?? []).flatMap((v) => [
          ...(v.image ? [v.image] : []),
          ...(v.images ?? []),
        ]),
      ].filter(Boolean),
    ),
  );

  const variantImage = selectedVariant?.image ?? selectedVariant?.images?.[0];
  const [selectedImage, setSelectedImage] = useState(0);
  const [prevVariantId, setPrevVariantId] = useState(selectedVariant?.id);

  if (prevVariantId !== selectedVariant?.id) {
    setPrevVariantId(selectedVariant?.id);

    const index = variantImage ? allImages.indexOf(variantImage) : -1;
    if (index !== -1) setSelectedImage(index);
  }

  const thumbsRef = useRef<HTMLDivElement>(null);

  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [isHoverZoom, setIsHoverZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const hasMultipleImages = allImages.length > 1;

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setSelectedImage(
      (prev) => (prev - 1 + allImages.length) % allImages.length,
    );
  };
  useEffect(() => {
    const container = thumbsRef.current;
    const el = container?.children[selectedImage] as HTMLElement | undefined;
    if (!container || !el) return;

    const c = container.getBoundingClientRect();
    const t = el.getBoundingClientRect();
    container.scrollBy({
      left: t.left + t.width / 2 - (c.left + c.width / 2),
      behavior: "smooth",
    });
  }, [selectedImage]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHoverZoom) return;
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  return (
    <div className="min-w-0 max-w-full space-y-4 bg-(--color-pink-light) shadow-xl shadow-pink-800/10 p-4 rounded-3xl">
      {" "}
      <div className="relative group rounded-2xl overflow-hidden bg-white/70 shadow-xl shadow-pink-100">
        <div
          className="relative w-full h-96 md:h-125 cursor-zoom-in overflow-hidden"
          onMouseEnter={() => setIsHoverZoom(true)}
          onMouseLeave={() => setIsHoverZoom(false)}
          onMouseMove={handleMouseMove}
        >
          <Image
            src={allImages[selectedImage]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300"
            style={{
              transform: isHoverZoom ? "scale(2)" : "scale(1)",
              transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
            }}
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {hasMultipleImages && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:scale-110 transition-transform opacity-100 md:opacity-0 md:group-hover:opacity-100"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:scale-110 transition-transform opacity-100 md:opacity-0 md:group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </>
        )}

        <button
          onClick={() => setIsZoomModalOpen(true)}
          className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm p-2 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity "
        >
          <ZoomIn className="w-5 h-5 text-white" />
        </button>

        {discount > 0 && (
          <div className="absolute top-4 right-4 bg-linear-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
            {discount}% تخفیف
          </div>
        )}

        {/* دکمه‌های اکشن
        <div className="absolute top-4 left-4 flex gap-2">
          <button
            onClick={() => setIsWishlist(!isWishlist)}
            className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
          >
            <Heart
              className={`w-5 h-5 ${isWishlist ? "fill-red-500 text-red-500" : "text-gray-600"}`}
            />
          </button>
          <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
            <Share2 className="w-5 h-5 text-gray-600" />
          </button>
        </div> */}

        {hasMultipleImages && (
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs">
            {selectedImage + 1} / {allImages.length}
          </div>
        )}
      </div>
      {hasMultipleImages && (
        <div
          ref={thumbsRef}
          className="flex w-full min-w-0 snap-x snap-mandatory gap-2 overflow-x-auto p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {allImages.map((img, idx) => (
            <button
              key={img}
              type="button"
              onClick={() => setSelectedImage(idx)}
              aria-label={`نمایش تصویر ${idx + 1}`}
              aria-current={selectedImage === idx}
              className={`relative aspect-square w-16 shrink-0 snap-center overflow-hidden rounded-lg transition-all duration-200 md:w-20 ${
                selectedImage === idx
                  ? "ring-2 ring-pink-500 shadow-lg"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`${product.name} ${idx + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
              {idx === 0 && discount > 0 && (
                <div className="absolute top-1 right-1 rounded-full bg-red-500 px-1 text-[10px] text-white">
                  {discount}%
                </div>
              )}
            </button>
          ))}
        </div>
      )}
      {isZoomModalOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setIsZoomModalOpen(false)}
          >
            <button
              type="button"
              className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors z-10"
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomModalOpen(false);
              }}
            >
              <X className="w-6 h-6" />
            </button>

            <div
              className="relative w-full max-w-5xl h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={allImages[selectedImage]}
                alt={product.name}
                fill
                className="object-contain"
                quality={100}
                sizes="100vw"
              />
            </div>

            {hasMultipleImages && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
                  {selectedImage + 1} / {allImages.length}
                </div>
              </>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
}
