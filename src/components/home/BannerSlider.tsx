"use client";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSlider } from "@/src/shared/hooks/use-slider";
type SlideDir = "left" | "center" | "right";

interface Slide {
  id: number;
  img: string;
  title: string;
  text: string;
  href: string;
  dir: SlideDir;
}
const slides : Slide[]= [
  {
    id: 1,
    title: "زیبایی، یک سبک زندگی است",
    text: "با بهترین محصولات آرایشی و مراقبتی همیشه درخشان باش",
    img: "/images/banner.png",
    href: "/products?category=cosmetics",
    dir: "left",
  },
  {
    id: 2,
    title: "دنیای کوچیک و دوست‌داشتنی",
    text: "لوازم کیوت و دخترانه برای حال خوب هر روزت",
    img: "/images/banner4.png",
    href: "/products?category=cute-items",
    dir: "right",
  },
  {
    id: 3,
    title: "جزئیات کوچک، استایل خاص",
    text: "اکسسوری‌های فانتزی برای کامل‌تر شدن استایل تو",
    img: "/images/banner2.png",
    href: "/products?category=cosmetics",
    dir: "left",
  },
];

const positionClass = {
  center: "mx-auto",
  left: "ml-15 mr-auto",
  right: "mr-15 ml-auto",
} as const;
export default function BannerSlider() {
  const { index, next, prev, goTo, pause, resume } = useSlider(slides.length);
  return (
    <section
      className="rounded-2xl relative h-80 overflow-hidden bg-pink-200 md:h-104"
      onMouseEnter={pause}
      onMouseLeave={resume}
      aria-roledescription="carousel"
    >
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100" : "pointer-events-none opacity-0"}`}
          aria-hidden={i !== index}
        >
          <Image
            src={s.img}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            quality={90}
            className="object-cover"
          />
          {/* <Image src={s.img} alt="" fill unoptimized className="object-cover" /> */}
          <div className="relative flex h-full items-center ">
           <div className={`max-w-md text-center ${positionClass[s.dir]}`}>
              <h1 className="text-3xl font-bold leading-snug text-pink-900 md:text-5xl">
                {s.title}
              </h1>

              <p className="mt-4 text-plum-700">{s.text}</p>

              <Link
                href={s.href}
                className="mt-6 inline-block rounded-full bg-pink-700 px-6 py-2.5 text-sm text-white hover:bg-pink-900"
              >
                مشاهده محصولات
              </Link>
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={next}
        aria-label="قبلی"
        className="absolute top-1/2 right-4 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-white/70"
      >
        <ChevronRight size={18} />
      </button>
      <button
        onClick={prev}
        aria-label="بعدی"
        className="absolute top-1/2 left-4 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-white/70"
      >
        <ChevronLeft size={18} />
      </button>
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i)}
            aria-label={`اسلاید ${i + 1}`}
            className={`size-2 rounded-full ${i === index ? "bg-white" : "bg-white/50"}`}
          />
        ))}
      </div>
    </section>
  );
}
