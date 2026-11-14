"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import CategoryCard from "./CategoryCard";
import { categories, CategoryGroup } from "./CategoryItems";

import "swiper/css";
import "swiper/css/navigation";

type Props = {
  group?: CategoryGroup;
};

export default function CategorySlider({ group }: Props) {
  const filteredCategories = group
    ? categories.filter((category) => category.group === group)
    : categories;

  return (
    <div className="w-full md:px-20 mx-auto">
      <div className="container mx-auto md:px-4 sm:px-3 relative">

        <div
          dir="rtl"
          className="flex flex-wrap justify-between items-center gap-4 mx-3 md:mx-0"
        >
          <div className="flex flex-wrap items-center gap-2">
          </div>
        </div>

        <button className="hidden category-prev absolute -right-10 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow md:flex items-center justify-center hover:bg-pink-50 transition-all">
          ›
        </button>

        <button className="hidden category-next absolute -left-10 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow md:flex items-center justify-center hover:bg-pink-50 transition-all">
          ‹
        </button>

        <Swiper
          key={group ?? "all"}
          dir="rtl"
          modules={[Navigation]}
          navigation={{
            nextEl: ".category-next",
            prevEl: ".category-prev",
          }}
          spaceBetween={0}
          slidesPerView={5}
          breakpoints={{
            640: {
              slidesPerView: 4,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 5,
            },
            1024: {
              slidesPerView: 6,
              spaceBetween: 0,
            },
            1280: {
              slidesPerView: 5,
              spaceBetween: 10,
            },
          }}
          className="text-center category-swiper"
        >
          {filteredCategories.map((category) => (
            <SwiperSlide
              key={`${category.id}-${group ?? "all"}`}
              className="overflow-visible! py-6 md:px-4"
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