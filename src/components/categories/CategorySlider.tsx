"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Link from "next/link";
import CategoryCard from "./CategoryCard";
import { categories } from "./CategoryItems";
import { useState, useEffect } from "react";

import "swiper/css";
import "swiper/css/navigation";

type Props = {
  scope: "domestic" | "imported" | "all";
};

export default function CategorySlider({ scope }: Props) {
  const [activeScope, setActiveScope] = useState<
    "domestic" | "imported" | "all"
  >(scope);

  useEffect(() => {
    setActiveScope(scope);
  }, [scope]);

  const filteredCategories = categories.filter((cat) => {
    if (activeScope === "all") return true;
    return cat.scope === activeScope;
  });

  return (
    <div className="w-full md:px-20 mx-auto">
      <div className="container mx-auto md:px-4 sm:px-3 relative">
        <div
          dir="rtl"
          className="flex flex-wrap justify-between items-center gap-4 mx-3 md:mx-0"
        >
          <div className="flex flex-wrap items-center gap-2">
            {/* <h2 className="md:text-xl text-[15px] sm:text-2xl font-bold">دسته‌بندی محصولات</h2> */}
            <div className="hidden flex items-center gap-1 border-b-2 border-b-pink-100 pb-1">
              <button
                className={`px-2  text-[15px] md:text-2xl sm:text-base rounded-2xl transition-all ${
                  activeScope === "domestic"
                    ? "text-(--color-pink) font-bold"
                    : "text-gray-500 hover:text-(--color-pink)"
                }`}
                onClick={() => setActiveScope("domestic")}
              >
                داخلی
              </button>
              <span className="text-pink-100 text-[15px] md:text-2xl sm:text-base">/</span>
              <button
                className={`px-2  text-[15px] md:text-2xl sm:text-base rounded-2xl transition-all ${
                  activeScope === "imported"
                    ? "text-(--color-pink) font-bold"
                    : "text-gray-500 hover:text-(--color-pink)"
                }`}
                onClick={() => setActiveScope("imported")}
              >
                وارداتی
              </button>
            </div>
          </div>
          <button
            onClick={() => setActiveScope("all")}
            className="hidden text-(--color-pink-dark) hover:underline text-[15px] sm:text-sm md:text-2xl  whitespace-nowrap"
          >
            مشاهده همه
          </button>
        </div>

        {/* دکمه بعدی - سمت راست */}
        <button className="hidden category-prev absolute -right-10 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow md:flex items-center justify-center hover:bg-pink-50 transition-all">
          ›
        </button>

        {/* دکمه قبلی - سمت چپ */}
        <button className="hidden category-next absolute -left-10 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow md:flex items-center justify-center hover:bg-pink-50 transition-all">
          ‹
        </button>

        <Swiper
          key={activeScope}
          dir="rtl"
          modules={[Navigation]}
          navigation={{
            nextEl: ".category-next ",
            prevEl: ".category-prev ",
          }}
          spaceBetween={0}
          slidesPerView={5}
          breakpoints={{
            640: { slidesPerView: 4, spaceBetween: 10 },
            768: { slidesPerView: 3, spaceBetween: 5 },
            1024: { slidesPerView: 6, spaceBetween: 0 },
            1280: { slidesPerView: 5, spaceBetween: 10 },
          }}
          className="text-center category-swiper "
        >
          {categories.map((category, index) => (
            <SwiperSlide

              key={`${category.id}-${index}-${activeScope}`} // کلید یکتا با ترکیب
              className="overflow-visible! py-6"
            >
              <div className="px-1">
                <CategoryCard category={category} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
