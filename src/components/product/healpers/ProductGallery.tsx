// components/product/ProductGallery.tsx

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Heart, Share2, ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductGalleryProps {
  product: {
    image: string;
    images?: string[];
    name: string;
  };
  discount: number;
  isWishlist: boolean;
  setIsWishlist: (value: boolean) => void;
}

export default function ProductGallery({ 
  product, 
  discount, 
  isWishlist, 
  setIsWishlist 
}: ProductGalleryProps) {
  // ساخت آرایه کامل از تصاویر
  const allImages = product.images && product.images.length > 0 
    ? [product.image, ...product.images]
    : [product.image];
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [isHoverZoom, setIsHoverZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const hasMultipleImages = allImages.length > 1;

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  // هندلر حرکت موس برای زوم
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHoverZoom) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  return (
    <div className="space-y-4 bg-(--color-pink-light) shadow-xl shadow-pink-800/10 p-4 rounded-3xl">
      {/* تصویر اصلی با زوم هاوری */}
      <div className="relative group rounded-2xl overflow-hidden bg-white/70 shadow-xl shadow-pink-100">
        <div 
          className="relative w-full h-96 md:h-[500px] cursor-zoom-in overflow-hidden"
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
              transform: isHoverZoom ? 'scale(2)' : 'scale(1)',
              transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
            }}
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* دکمه‌های ناوبری بین تصاویر */}
        {hasMultipleImages && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:scale-110 transition-transform opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:scale-110 transition-transform opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </>
        )}

        {/* دکمه زوم (باز کردن مودال بزرگ) */}
        <button
          onClick={() => setIsZoomModalOpen(true)}
          className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ZoomIn className="w-5 h-5 text-white" />
        </button>
        
        {discount > 0 && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
            {discount}% تخفیف
          </div>
        )}
        
        {/* دکمه‌های اکشن */}
        <div className="absolute top-4 left-4 flex gap-2">
          <button
            onClick={() => setIsWishlist(!isWishlist)}
            className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
          >
            <Heart className={`w-5 h-5 ${isWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </button>
          <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
            <Share2 className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* شمارنده تصاویر */}
        {hasMultipleImages && (
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs">
            {selectedImage + 1} / {allImages.length}
          </div>
        )}
      </div>

      {/* تصاویر کوچک (thumbnail) */}
      {hasMultipleImages && (
        <div className="grid grid-cols-4 gap-3 ">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={`relative rounded-lg overflow-hidden aspect-square transition-all duration-200  ${
                selectedImage === idx 
                  ? 'ring-2 ring-pink-500 shadow-lg scale-95' 
                  : 'opacity-70 hover:opacity-100 hover:scale-105'
              }`}
            >
              <Image 
                src={img} 
                alt={`${product.name} ${idx + 1}`} 
                fill 
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 10vw"
              />
              {/* نشان کوچک تخفیف روی تامبنیل‌ها */}
              {idx === 0 && discount > 0 && (
                <div className="absolute top-1 right-1 bg-red-500 text-white text-[10px] px-1 rounded-full">
                  {discount}%
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* مودال زوم (نمایش بزرگ تصویر با کلیک) */}
      {isZoomModalOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setIsZoomModalOpen(false)}
        >
          <button 
            className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors z-10"
            onClick={() => setIsZoomModalOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="relative w-full max-w-5xl h-[85vh]">
            <Image
              src={allImages[selectedImage]}
              alt={product.name}
              fill
              className="object-contain"
              quality={100}
            />
          </div>
          
          {/* دکمه‌های ناوبری در مودال */}
          {hasMultipleImages && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
                {selectedImage + 1} / {allImages.length}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}