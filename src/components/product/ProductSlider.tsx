/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Link from "next/link";
import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import ProductCard from "./ProductCard";
import EmptyState from "../../shared/ui/EmptyState";
import notFound from "@/src/app/products/not-found";
import loading from "@/src/app/products/loading";
import { useProducts } from "@/src/shared/hooks/useProducts";

type Props = {
  scope: "domestic" | "imported" | "all";
  category?: string;
};

export default function ProductSlider({ scope, category }: Props) {
  const { data: products, isLoading, error } = useProducts({ scope, category });
  const [toast, setToast] = useState({ show: false, message: "" });

  const handleAddToCart = (productName: string) => {
    setToast({ show: true, message: `${productName} به سبد خرید اضافه شد` });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  
  if (isLoading) {
    return loading();
  }

  if (error) {
    return notFound();
  }


  

  if (products.length === 0) {
    return (
      <EmptyState
        title="محصولی یافت نشد"
        message={`محصولی در دسته ${category} وجود ندارد`}
        icon="🛍️"
        action={{
          label: "مشاهده همه محصولات",
          href: "/products",
        }}
      />
    );
  }


  return (
    <div className="w-full  md:px-20" id="products-section">
      {/* <div className="container md:mx-auto md:px-4 relative"> */}
      <div className="container mx-auto md:px-4 sm:px-3 relative">
        {/* <div
          dir="rtl"
          className="flex justify-between items-center md:mb-6 sm:mx-3"
        >
          <h2 className="text-[15px] sm:test-xl md:text-2xl font-bold">
            محصولات
          </h2>

          <Link
            href="/products"
            className="text-(--color-pink-dark) text-[15px] sm:test-xl md:text-2xl"
          >
            مشاهده همه
          </Link>
        </div> */}

        <button className="cat-next absolute -left-10 top-43.75 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow hidden md:flex items-center justify-center hover:bg-pink-50 transition-all">
          ‹
        </button>

        <button className="cat-prev absolute -right-10 top-43.75 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow hidden md:flex items-center justify-center hover:bg-pink-50 transition-all">
          ›
        </button>

        <Swiper
          dir="rtl"
          modules={[Navigation]}
          navigation={{
            nextEl: ".cat-next",
            prevEl: ".cat-prev",
          }}
          spaceBetween={0}
          slidesPerView={3}
          breakpoints={{
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 4, spaceBetween: 10 },
          }}
          className=" text-center category-swiper"
        >
          {products?.map((item: any) => (
            <SwiperSlide
              key={item.id}
              className="overflow-visible! py-3 md:py-10 z-40"
            >
              <ProductCard
                onAddToCart={handleAddToCart}
                productItems={item}
              ></ProductCard>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {toast.show && (
        <div className="fixed bottom-4 left-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {toast.message}
        </div>
      )}
    </div>
  );
}
