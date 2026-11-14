"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import FavoriteHeartButton from "./FavoriteHeartButton";

export type FavoriteItem = {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number | null;
  image: string;
  isAvailable: boolean;
  status: "ACTIVE" | "DRAFT" | "OUT_OF_STOCK" | "ARCHIVED";
  scope: "domestic" | "imported" | "all";
  category: "cosmetics"
      | "cosmetics"
    | "personal-care"
    | "fragrance"
    | "stationery"
    | "accessories"
    | "bags"
    | "lego"
    | "cute-items";
};

function formatToman(n: number) {
  return new Intl.NumberFormat("fa-IR").format(n) + " تومان";
}

export default function FavoritesGrid({ initialItems }: { initialItems: FavoriteItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [removingId, setRemovingId] = useState<string | null>(null);

  function handleRemoved(productId: string) {
    setRemovingId(productId);
    setTimeout(() => {
      setItems((prev) => prev.filter((p) => p.id !== productId));
      setRemovingId(null);
    }, 220);
  }

  if (items.length === 0) {
    return <EmptyState />;
  }
  



  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
      {items.map((item) => {
        const isOut = !item.isAvailable || item.status === "OUT_OF_STOCK";
        const isFading = removingId === item.id;

        return (
          <div
            key={item.id}
            className={`group relative overflow-hidden rounded-[28px] bg-white shadow-[0_6px_24px_rgba(233,64,127,0.10)] ring-1 ring-pink-300 transition-all duration-200 ${
              isFading ? "scale-95 opacity-0" : "scale-100 opacity-100 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(233,64,127,0.18)]"
            }`}
          >
            <div className="absolute right-3 top-3 z-10">
              <FavoriteHeartButton
                productId={item.id}
                initialFavorited={true}
                onToggled={(favorited) => {
                  if (!favorited) handleRemoved(item.id);
                }}
              />
            </div>

            {isOut && (
              <span className="absolute left-3 top-3 z-10 rounded-full bg-pink-800/90 px-3 py-1 text-xs text-white">
                ناموجود
              </span>
            )}

            <Link href={`/products/${item.scope}/${item.category}/${item.slug}`} className="block">
              <div className="relative aspect-square w-full bg-pink-50">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover"
                />
              </div>

              <div className="space-y-1.5 p-4">
                <h3 className="line-clamp-1 text-sm font-medium text-plum-800">{item.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-pink-600">
                    {formatToman(item.price)}
                  </span>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <span className="text-xs text-plum-300 line-through">
                      {formatToman(item.originalPrice)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 rounded-4xl bg-white/60 py-20 text-center ring-1 ring-pink-100">
      <svg viewBox="0 0 120 120" className="h-28 w-28">
        <circle cx="60" cy="60" r="56" className="fill-pink-50" />
        <path
          d="M60 88s-26-15.6-33.6-31.2C22 47.6 25 39 33 37c6.7-1.7 13.4 1 17.2 6.9a2 2 0 0 0 3.4 0C57.4 38 64.1 35.3 70.8 37c8 2 11 10.6 6.6 19.8C69.8 72.4 60 88 60 88Z"
          className="fill-pink-300"
        />
        <circle cx="30" cy="32" r="3" className="fill-gold-400" />
        <circle cx="92" cy="40" r="2.2" className="fill-gold-400" />
        <circle cx="88" cy="84" r="2.6" className="fill-lilac-300" />
      </svg>

      <div className="space-y-1.5">
        <p className="text-lg font-bold text-plum-800">لیست علاقه‌مندی‌هات خالیه</p>
        <p className="text-sm text-plum-400">
          محصولاتی که دوست داری رو با ضربه روی قلب ذخیره کن تا اینجا جمع بشن
        </p>
      </div>

      <Link
        href="/products"
        className="rounded-full bg-blossom-500 px-6 py-2.5 text-sm font-medium text-white shadow-[0_6px_18px_rgba(233,64,127,0.35)] transition-transform hover:scale-105 active:scale-95"
      >
        رفتن به فروشگاه
      </Link>
    </div>
  );
}