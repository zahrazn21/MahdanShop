"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Image from "next/image";

import "swiper/css";
import "swiper/css/pagination";

const banners = [
  {
    id: 1,
    image: "/images/banner.png",
    link: "/imported",
  },
  {
    id: 2,
    image: "/images/banner2.png",
    link: "/iranian",
  },
  {
    id: 3,
    image: "/images/banner9.png",
    link: "/categories",
  },
];
export default function BannerSlider() {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      autoplay={{
        delay: 4000,
        disableOnInteraction: false,
      }}
      loop={true}
    //   pagination={{ clickable: true }}
      className="banner-swiper  md:h-80 "
    >
      {banners.map((src, index) => (
        <SwiperSlide key={index}>
          <div className="relative aspect-3/1 ">
            <Image
              src={src.image}
              alt="banner"
              width={500}
              height={400}
              priority={index === 0}
              className="object-cover"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}