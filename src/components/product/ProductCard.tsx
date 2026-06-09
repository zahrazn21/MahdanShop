// components/ProductCard.tsx

import React from "react";
import Image from "next/image";
import { Product } from "./ProductItems";
import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useCartActions } from "@/src/shared/hooks/useCart";

export default function ProductCard({
  productItems,
  onAddToCart 
}: {
  productItems: Product ,onAddToCart?: (productName: string) => void;
}) {
  const discount = productItems.originalPrice
    ? Math.round(
        ((productItems.originalPrice - productItems.price) /
          productItems.originalPrice) *
          100,
      )
    : 0;

  const { addToCart, isAdding } = useCartActions();

  const handleAddToCart = async () => {
    await  addToCart({
      productId: productItems.id,
      name: productItems.name,
      price: productItems.price,
      category: productItems.category,
      scope: productItems.scope,
      originalPrice: productItems.originalPrice,
      image: productItems.image,
      brand: productItems.brand,
      quantity: 1,
    });
    if (onAddToCart) {
      onAddToCart(productItems.name);
    }
  };


  
  return (
    <Link
      href={`/products/${productItems.scope}/${productItems.category}/${productItems.id}`}
    >
      <div className="group hover:scale-105 relative bg-white rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-[0_0px_10px_rgba(252,94,143,0.25)] cursor-pointer h-54 md:h-auto md:mx-2 shadow shadow-[#d69db2] sm:mx-1">
        {discount > 0 && (
          <div className="absolute top-2 right-2 z-10 bg-linear-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
            {discount}%
          </div>
        )}

        <button
          className="absolute top-2 left-2 z-10 bg-white/80 backdrop-blur-sm p-1.5 rounded-full md:opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 "
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <Heart className="w-4 h-4 text-gray-500 hover:text-pink-500" />
        </button>

        <button
          className="absolute top-10 left-2 z-10 bg-white/80 backdrop-blur-sm p-1.5 rounded-full md:opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 "
          onClick={(e) => {
            e.preventDefault(); // جلوگیری از رفتار پیش‌فرض
            e.stopPropagation(); // جلوگیری از propagation به parent
            handleAddToCart();
          }}
        >
          <ShoppingBag className="w-4 h-4 text-gray-500 hover:text-pink-500" />
        </button>
        <div className="relative  w-full aspect-   flex items-center justify-center p-1 md:p-4">
          <div className="flex p-4  w-full border-2 border-dashed border-(--color-pink-white) rounded-3xl place-content-center ">
            <Image
              src={productItems.image}
              alt={productItems.name}
              width={180}
              height={180}
              className="sm:w-26 object-contain transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 640px) 150px, (max-width: 768px) 180px, 200px"
            />
          </div>

          {productItems.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                ناموجود
              </span>
            </div>
          )}
          {productItems.stock < 5 && productItems.stock > 0 && (
            <div className="absolute bottom-2 left-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
              فقط {productItems.stock} عدد
            </div>
          )}
        </div>

        <div className=" py-1 px-2 md:p-3 text-right">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-0.5">
              <Star className="w-2 h-2 md:w-3 md:h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-[8px] md:text-xs text-gray-600">
                {productItems.rating}
              </span>
            </div>
            <span className="text-[8px] md:text-xs text-gray-400">
              {productItems.brand}
            </span>
          </div>

          <h3 className="w-25 md:w-full font-semibold text-gray-800 text-[10px] md:text-base line-clamp-1 overflow-hidden text-ellipsis min-h-5 md:min-h-12">
            {productItems.name}
          </h3>

          <div className="md:flex sm:flex block items-center justify-between gap-1">
            {productItems.originalPrice && (
              <span className="text-gray-400 line-through md:text-base text-[10px]">
                {productItems.originalPrice.toLocaleString()}
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-pink-600 font-bold md:text-base text-[10px]">
                {productItems.price.toLocaleString()}
              </span>
              <span className="text-[9px] md:text-base text-gray-400">
                تومان
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
