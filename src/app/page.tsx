import Image from "next/image";
import Banner from "../components/home/Banner";
import CategorySlider from "../components/categories/CategorySlider";
import ProductSlider from "../components/product/ProductSlider";
import {
  Truck,
  ShieldCheck,
  RefreshCw,
  CreditCard,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import FAQ from "../components/layout/FAQ";
import { Metadata } from "next";

export interface ServiceItem {
  id: number;
  icon: React.ElementType;
  title: string;
  subtitle: string;
}

export const servicesData: ServiceItem[] = [
  {
    id: 1,
    icon: Truck,
    title: "ارسال سریع",
    subtitle: "۲۴ ساعته",
  },
  {
    id: 2,
    icon: ShieldCheck,
    title: "ضمانت اصالت",
    subtitle: "بازگشت وجه",
  },
  {
    id: 3,
    icon: RefreshCw,
    title: "۷ روز گارانتی",
    subtitle: "تعویض محصول",
  },
  {
    id: 4,
    icon: CreditCard,
    title: "پرداخت امن",
    subtitle: "ضمانت بازگشت",
  },
];
export const metadata: Metadata = {
  title: "Mahdan Shop | مهدان شاپ",
  description: "بهترین محصولات آرایشی و مراقبتی، اصل و با ارسال سریع",
};
export default function Home() {
  return (
    <div className="">
      <Banner></Banner>
      <div className="">

      <div className=" md:my-6 md:rounded-3xl md:back drop-blur-sm md:border-2 md:bg-[#fffafd] md:border-pink-100 md:py-3">
        <h2
          dir="rtl"
          className="flex items-center md:mx-4 md:text-xl text-[15px] sm:text-2xl font-bold"
        >
          <Image
            src="/images/love.png"
            alt="test"
            width={60}
            height={60}
            className="w-10  h-auto rotate-6"
          />
          دسته‌بندی محصولات
        </h2>
        <CategorySlider />
      </div>
      <div className="space-y-6 md:my-4 md:rounded-3xl md:backdrop-blur-sm md:border-2 md:bg-[#fffafd] md:border-pink-100 md:py-6">
        <div className="">
          <div
            dir="rtl"
            className="flex items-center justify-between md:mx-4 mx-4 md:text-xl text-[15px] sm:text-2xl font-bold "
          >
            <div className="flex items-center">
              <Image
                src="/images/love.png"
                alt="test"
                width={60}
                height={60}
                className="w-10  h-auto rotate-6"
              />
              محصولات
            </div>
            <Link
              href="/products"
              className="flex items-center text-(--color-pink-dark) text-[11px] sm:test-xl md:text-base"
            >
              <p>مشاهده همه</p>
              <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
            </Link>
          </div>
          <ProductSlider scope="all" />
        </div>

        <div
          style={{
            backgroundImage: "url('/images/offer.png')",
            backgroundSize: "cover",
            backgroundPosition: "bottom center",
            backgroundRepeat: "no-repeat",
          }}
          className="relative h-30 md:h-80 md:mx-8 sm:h-45 my-4 md:my-7 md:rounded-3xl"
        >
          <div className="absolute inset-0 bg-black/5 md:hidden" />
          <div className="absolute left-2 sm:left-4 md:left-40  bottom-1 sm:bottom-2 md:bottom-3  p-0.5 rounded-lg sm:rounded-xl md:rounded-2xl bg-linear-to-r from-pink-400 via-pink-500 to-rose-500 shadow-md hover:shadow-pink-500/30 transition-all duration-300">
            <button className="relative overflow-hidden border border-white border-dashed md:text-2xl text-sm rounded-2xl md:w-44 md:h-10 md:py-3 px-5 font-medium text-white flex items-center justify-center transition-all duration-300 bg-linear-to-r from-pink-500/80 to-rose-500/80 backdrop-blur-sm hover:scale-105">
              <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shine" />
              <span className="relative z-10 drop-shadow-xl">خرید کنید</span>
            </button>
          </div>
        </div>

        <div>
         
          <ProductSlider title="پرفروش‌ترین‌ها" sortBy="best-selling" />
          <ProductSlider title="جدیدترین محصولات" sortBy="newest" />
          <ProductSlider title="ارزان‌ترین محصولات" sortBy="price-low" />
          {/* <ProductSlider title="محصولات وارداتی" scope="imported" /> */}
        </div>

        <div className="md:mx-8 md:h-24  bg-(--color-pink-footer) border border-white sm:rounded-4xl md:rounded-3xl grid place-content-center place-items-center grid-cols-4 sm:grid-cols-4 cd:gap-4 sm:gap-0 ">
          {servicesData.map((service) => (
            <div
              key={service.id}
              className={`md:flex md:px-10 px-2 justify-center items-center text-center  w-full py-1   ${service.id != 4 && "border-r-2 border-pink-100"} `}
            >
              <div className="w-12 h-12  bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <service.icon className="w-6 h-6 text-pink-500" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] md:text-xs font-semibold text-gray-700 ">
                  {service.title}
                </p>
                <p className="md:text-xs text-[10px] text-gray-400">
                  {service.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div
            dir="rtl"
            className=" flex items-center md:mx-4 mx-4 md:text-xl text-[15px] sm:text-2xl font-bold "
          >
            <Image
              src="/images/love.png"
              alt="test"
              width={60}
              height={60}
              className="w-10  h-auto rotate-6"
            />
            سوالات متداول
          </div>
          <FAQ></FAQ>
        </div>
      </div>
      </div>
    </div>
  );
}
