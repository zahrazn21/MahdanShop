// app/about/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Gift, Sparkles, Target, Award, Shield } from "lucide-react";

// components/about/FeaturesBoxes.ts
export interface FeatureBox {
  id: number;
  image: string;
  title: string;
  description: string;
}

export const featureBoxes: FeatureBox[] = [
  {
    id: 1,
    image: "/images/icons/gift.png", 
    title: "محصولات خاص و فانتزی",
    description: "انتخابی از بهترین و خاص‌ترین محصولات برای شما",
  },
  {
    id: 2,
    image: "/images/icons/bag.png", 
    title: "کیفیت بالا",
    description: "ما به کیفیت محصولات خود اهمیت زیادی می‌دهیم",
  },
  {
    id: 3,
    image: "/images/icons/satisfaction.png", 
    title: "رضایت شما",
    description: "رضایت و لبخند شما، اولویت اصلی ماست",
  },
  {
    id: 4,
    image: "/images/icons/car.png", // مسیر عکس ارسال سریع
    title: "ارسال سریع و مطمئن",
    description: "سفارش‌های شما در سریع‌ترین زمان ممکن ارسال می‌شود",
  },
];
export default function AboutPage() {
  return (
    <div
      style={{
        backgroundImage: "url('/images/.png')",
        backgroundSize: "cover",
        backgroundPosition: "left",
      }}
      className="min-h-screen relative overflow-hidden rounded-4xl border border-[#fdf5f9] shadow shadow-amber-50"
    >
      <section className="relative overflow-hidden ">
        {/* تصویر پس‌زمینه */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/bannerAbout.png"
            alt="درباره ما"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>

        {/* محتوای روی تصویر */}
        <div className="relative z-10 container mx-auto px-4 py-24 md:py-32 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
            داستان ما
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90 animate-fade-in-up">
            از سال ۱۴۰۰ با عشق به زیبایی و کیفیت، مسیر خود را آغاز کردیم
          </p>
        </div>
      </section>

      {/* بخش معرفی */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-12 items-center px-10">
          {/* تصویر */}
          <div className="lg:w-full">
            <div className="relative overflow-hidden ">
              <Image
                src="/images/about.png"
                alt="فروشگاه مهدان"
                width={800}
                height={700}
                className="object-cover w-full h-auto"
              />
              {/* <div className="absolute inset-0 bg-linear-to-t from-pink-500/20 to-transparent" /> */}
            </div>
          </div>

          {/* متن */}
          <div className="lg:w-2/3 text-center lg:text-right  justify-items-center grid gap-6 text-xl">
            <div className="flex items-center justify-between gap-5">
              <Image
                src="/images/love2.png"
                alt="فروشگاه مهدان"
                width={500}
                height={400}
                className="object-cover w-8 h-auto -rotate-8"
              />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                درباره ما
              </h2>
              <Image
                src="/images/love2.png"
                alt="فروشگاه مهدان"
                width={500}
                height={400}
                className="object-cover w-8 h-auto rotate-8"
              />
            </div>

            {/* <div className="w-20 h-1 bg-pink-500 mx-auto lg:mx-0 mb-6" /> */}
            <p className="text-pink-600 leading-relaxed mb-4">
              مهدان شاپ دنیایی از زیبایی و شادی
            </p>
            <p dir="rtl" className="text-pink-800 leading-relaxed text-center">
              ما در مهدان شاپ با عشق و دقت محصولاتی خاص و باکیفیت و فانتزی برای
              شما عزیزان انتخاب کرده ایم تا لحاضاتی کیوت و دوست داشتنی داشته
              باشید.
            </p>
          </div>
        </div>
      </section>

      {/*  باکس اصلی */}
      <section dir="rtl" className="container mx-auto px-4 py-4">
        {/* <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">چرا مهدان؟</h2>
          <div className="w-20 h-1 bg-pink-500 mx-auto" />
          <p className="text-gray-500 mt-4">سه دلیل برای انتخاب ما</p>
        </div> */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {featureBoxes.map((box) => (
            <div
              key={box.id}
              className="bg-[#fdf5f9] rounded-3xl p-6 text-center shadow-md hover:shadow-lg transition-all duration-300 group flex flex-col h-full"
            >
              <div className="h-32 flex items-center justify-center mb-3">
                <Image
                  src={box.image}
                  alt={box.title}
                  width={400}
                  height={300}
                  className={`object-contain w-auto h-full ${box.title=="ارسال سریع و مطمئن" && "-scale-x-100"} `}
                />
              </div>

              <h3 className="text-base font-bold text-pink-800 mb-2 min-h-12 flex items-center justify-center">
                {box.title}
              </h3>

              <p className="text-xs text-pink-500 leading-relaxed flex-1">
                {box.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* باکس هدف ما */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-linear-to-r from-pink-500 to-rose-500 rounded-3xl p-8 md:p-12 text-center text-white shadow-xl">
          <div className="max-w-3xl mx-auto">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold mb-4">هدف ما</h2>
            <p className="text-lg leading-relaxed mb-6">
              ما در فروشگاه محدان فراتر از یک فروشگاه هستیم. هدف ما ایجاد
              تجربه‌ای لذت‌بخش از خرید است. می‌خواهیم هر بار که محصولات ما را
              استفاده میکنید، لبخند بر لبانتان بنشیند و احساس خاص بودن کنید.
            </p>
            <p className="text-white/80">
              زیبایی حق همه است، ما فقط راه را نشان می‌دهیم
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
