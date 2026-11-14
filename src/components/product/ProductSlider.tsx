/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useId, useState } from "react";
import Link from "next/link";

import "swiper/css";
import "swiper/css/navigation";

import ProductCard from "./ProductCard";
import EmptyState from "../../shared/ui/EmptyState";
import { useProducts } from "@/src/shared/hooks/useProducts";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import ProductsGridSkeleton from "../../shared/ui/ProductsGridSkeleton";
import { getCategoryName } from "../categories/CategoryItems";

type Props = {
  title?: string;

  scope?: "domestic" | "imported" | "all";

  category?: string;

  sortBy?:
    | "newest"
    | "oldest"
    | "price-low"
    | "price-high"
    | "best-selling";

  minPrice?: string;

  maxPrice?: string;

  inStock?: boolean;

  onSale?: boolean;

  limit?: number;
};

export default function ProductSlider({
  title,
  scope = "all",
  category,
  sortBy = "newest",
  minPrice,
  maxPrice,
  inStock,
  onSale,
  limit = 10,
}: Props) {
  const sliderId = useId();

  const { data, isLoading, error } = useProducts({
    scope,
    category,
    sortBy,
    minPrice,
    maxPrice,
    inStock,
    onSale,
    limit,
    page: 1,
  });

  const [toast, setToast] = useState({
    show: false,
    message: "",
  });

  const products = data?.products ?? [];

  const handleAddToCart = (productName: string) => {
    setToast({
      show: true,
      message: `${productName} به سبد خرید اضافه شد`,
    });

    setTimeout(() => {
      setToast({
        show: false,
        message: "",
      });
    }, 3000);
  };


if (!isLoading && !error && sortBy === "best-selling" && products.length < 4) {
  return null;
}

  const nextButton = `slider-next-${sliderId}`;
  const prevButton = `slider-prev-${sliderId}`;

  const buildFilterUrl = () => {
    const params = new URLSearchParams();

    if (scope && scope !== "all") {
      params.set("scope", scope);
    }

    if (category) {
      params.set("category", category);
    }

    if (sortBy && sortBy !== "newest") {
      params.set("sortBy", sortBy);
    }

    if (minPrice) {
      params.set("minPrice", minPrice);
    }

    if (maxPrice) {
      params.set("maxPrice", maxPrice);
    }

    if (inStock) {
      params.set("inStock", "true");
    }

    if (onSale) {
      params.set("onSale", "true");
    }

    const query = params.toString();

    return query ? `/products?${query}` : "/products";
  };

  return (
    <div className="w-full md:px-3" id="products-section">
      {title && (
        <div
          dir="rtl"
          className="mb-5 flex items-center justify-between px-3"
        >
          <div className="flex items-center">
            <Image
              src="/images/love.png"
              alt="test"
              width={60}
              height={60}
              className="w-10 h-auto rotate-6"
            />

            <h2 className="text-xl font-bold text-gray-800">
              {title}
            </h2>
          </div>

          <Link
            href={buildFilterUrl()}
            className="flex items-center text-(--color-pink-dark) text-[11px] sm:test-xl md:text-base font-bold"
          >
            مشاهده همه
            <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
          </Link>
        </div>
      )}
      {isLoading ? (
        <div className="container mx-auto sm:px-3 md:px-20">
          <ProductsGridSkeleton
            count={4}
            className="grid grid-cols-2 gap-4 md:grid-cols-4"
            itemClassName="max-md:nth-[n+3]:hidden"
          />
        </div>
      ) : error ? (
        <div
          dir="rtl"
          className="mx-3 rounded-2xl bg-red-50 px-5 py-10 text-center text-red-500"
        >
          خطا در دریافت محصولات
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          title="محصولی یافت نشد"
          message={
            category
              ? `محصولی در دسته ${getCategoryName(category)} وجود ندارد`
              : "محصولی برای نمایش وجود ندارد"
          }
          icon="🛍️"
          action={{
            label: "مشاهده همه محصولات",
            href: "/products",
          }}
        />
      ) : (
        <div className="relative container mx-auto sm:px-3 md:px-20">
        <button
          className={`${nextButton} absolute left-5 top-[43.75%] z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow transition-all hover:bg-pink-50 md:flex`}
          aria-label="محصول بعدی"
        >
          ‹
        </button>

        <button
          className={`${prevButton} absolute right-5 top-[43.75%] z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow transition-all hover:bg-pink-50 md:flex`}
          aria-label="محصول قبلی"
        >
          ›
        </button>

        <Swiper
          dir="rtl"
          modules={[Navigation]}
          navigation={{
            nextEl: `.${nextButton}`,
            prevEl: `.${prevButton}`,
          }}
          spaceBetween={12}
          slidesPerView={2.2}
          slidesOffsetBefore={12}
          slidesOffsetAfter={12}
          breakpoints={{
            480: {
              slidesPerView: 2.6,
            },

            640: {
              slidesPerView: 3.4,
            },

            768: {
              slidesPerView: 4,
              spaceBetween: 0,
              slidesOffsetBefore: 0,
              slidesOffsetAfter: 0,
            },

            1024: {
              slidesPerView: 4,
              spaceBetween: 0,
              slidesOffsetBefore: 0,
              slidesOffsetAfter: 0,
            },

            1280: {
              slidesPerView: 5,
              spaceBetween: 0,
              slidesOffsetBefore: 0,
              slidesOffsetAfter: 0,
            },
          }}
          className="category-swiper text-center"
        >
          {products.map((item: any) => (
            <SwiperSlide
              key={item.id}
              className="z-40 overflow-visible! py-3 md:py-10 md:pl-3 md:pr-2"
            >
              <ProductCard
                onAddToCart={handleAddToCart}
                productItems={item}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      )}
     
      {toast.show && (
        <div className="fixed bottom-4 left-4 z-50 rounded-lg bg-green-500 px-4 py-2 text-white shadow-lg">
          {toast.message}
        </div>
      )}
    </div>
  );
}