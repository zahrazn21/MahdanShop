"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ShowProductButton from "./showProductButton";

const banners = [
  {
    id: 1,
    image: "/images/bannermobile6.png",
    link: "/imported",
    alt: "بنر محصولات وارداتی",
    text: "از آرایش تا نوشتن؛ هر آنچه نیاز داری",
  },
  {
    id: 2,
    image: "/images/bannermobile5.png",
    link: "/iranian",
    alt: "بنر محصولات ایرانی",
    text: "خرید از ما یعنی وقتِ بیشتر برای خودت",
  },
  {
    id: 3,
    image: "/images/bannermobile8.png",
    link: "/categories",
    alt: "بنر دسته‌بندی محصولات",
    text: "شاپی برای تمام سلیقه‌ها",
  },
];

export default function BannerMobile() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % banners.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <>
      {/* <div>
        shadow-[0px_-50px_196px_rgba(255,0,174,1)]
       </div> */}
      <div className="  relative w-full  overflow-hidden  group">
        {/* اسلایدر کانتینر */}
        <div
          className=" relative flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className="relative w-full shrink-0"
              style={{ width: "100%" }}
            >
              {/* افزایش ارتفاع با تغییر pt درصد */}
              <div className="relative w-full pt-[50%] md:pt-[45%] lg:pt-[50%] xl:pt-[55%]">
                <Image
                  src={banner.image}
                  alt={banner.alt}
                  fill
                  priority={index === 0}
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 600px"
                />
              </div>
              <div className="z-20 flex flex-col items-center text-center gap-3 sm:gap-6 absolute sm:top-[40%] top-[20%] left-[5%] sm:left-[10%]  max-w-xl">
                <p className="text-[15px] sm:text-2xl text-(--color-pink-dark) leading-relaxed sm:max-w-50 max-w-24 whitespace-normal">
                  {banner.text}
                </p>
                <ShowProductButton />
              </div>
            </div>
          ))}
        </div>

        {/* دکمه قبلی */}
        <button
          onClick={prevSlide}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 
                   bg-black/50 hover:bg-black/70 text-white 
                   w-8 h-8 md:w-10 md:h-10 rounded-full 
                   flex items-center justify-center
                   transition-all duration-300 opacity-0 group-hover:opacity-100
                   focus:opacity-100 z-10"
          aria-label="اسلاید قبلی"
        >
          <svg
            className="w-4 h-4 md:w-6 md:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* دکمه بعدی */}
        <button
          onClick={nextSlide}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 
                   bg-black/50 hover:bg-black/70 text-white 
                   w-8 h-8 md:w-10 md:h-10 rounded-full 
                   flex items-center justify-center
                   transition-all duration-300 opacity-0 group-hover:opacity-100
                   focus:opacity-100 z-10"
          aria-label="اسلاید بعدی"
        >
          <svg
            className="w-4 h-4 md:w-6 md:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* دات‌های ناوبری */}
        <div
          className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 
                      flex gap-1 md:gap-2 z-10"
        >
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full
              ${
                currentSlide === index
                  ? "w-6 md:w-8 h-1.5 md:h-2 bg-(--color-pink-font)"
                  : "w-1.5 md:w-2 h-1.5 md:h-2 bg-white/60 hover:bg-white/80"
              }`}
              aria-label={`رفتن به اسلاید ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </>
  );
}
