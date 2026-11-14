"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Star, Plane, PackageCheck } from "lucide-react";
import { useState, useCallback } from "react";

import { useCartActions } from "@/src/shared/hooks/useCart";
import { Product } from "@/src/shared/types/product";
import FavoriteHeartButton from "../favorites/FavoriteHeartButton";
import { useToast } from "@/src/shared/contexts/ToastContext";

interface ProductCardProps {
  productItems: Product;
  onAddToCart?: (productName: string) => void;
}

export default function ProductCard({
  productItems,
  onAddToCart,
}: ProductCardProps) {
  const { addToCart } = useCartActions();
  const { showToast } = useToast();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const discount = productItems.originalPrice
    ? Math.round(
        ((productItems.originalPrice - productItems.price) /
          productItems.originalPrice) *
          100,
      )
    : 0;

  const isPreOrder = productItems.availabilityType === "PRE_ORDER";
  const isInStock = productItems.availabilityType === "IN_STOCK";

  const isPreOrderOpen =
    isPreOrder &&
    productItems.batch !== null &&
    productItems.batch !== undefined &&
    productItems.batch.status === "OPEN";

  const canPurchase =
    productItems.status === "ACTIVE" &&
    productItems.isAvailable &&
    ((isInStock && productItems.stock > 0) || (isPreOrder && isPreOrderOpen));

  const hasReviews = productItems.reviewCount > 0 && productItems.rating > 0;

  let statusText = "";

  if (isPreOrder) {
    statusText = isPreOrderOpen ? "قابل پیش‌سفارش" : "سفارش‌گیری بسته است";
  } else {
    statusText = canPurchase ? "موجود" : "ناموجود";
  }

  const productUrl = `/products/${productItems.scope}/${productItems.category}/${productItems.slug}`;
  const handleAddToCart = async () => {
    if (!canPurchase || isAddingToCart) return;

    try {
      setIsAddingToCart(true);

      await addToCart({
        productId: productItems.id,
        quantity: 1,
      });

      showToast(`${productItems.name} به سبد خرید اضافه شد`, "success");
      onAddToCart?.(productItems.name);
    } catch {
      showToast("افزودن به سبد خرید با خطا مواجه شد", "error");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleFavorite = useCallback(
    (isFavorited: boolean) => {
      showToast(
        isFavorited
          ? "به لیست علاقه‌مندی‌ها اضافه شد"
          : "از لیست علاقه‌مندی‌ها حذف شد",
        "info",
      );
    },
    [showToast],
  );

  return (
    <Link href={productUrl}>
      <div
        className="
          group relative h-auto overflow-hidden rounded-xl bg-white
          shadow shadow-[#d69db2]
          transition-all duration-300
          sm:mx-1
          md:rounded-3xl
          md:mx-0
          hover:scale-105
          hover:shadow-[0_0px_10px_rgba(252,94,143,0.25)]
        "
      >
        {discount > 0 && (
          <div
            className="
              absolute right-1.5 top-1.5 z-10
              rounded-full
              bg-linear-to-r from-red-500 to-pink-500
              px-2 py-0.5
              text-[11px] font-bold text-white
              shadow-md
              md:right-2 md:top-2
              md:px-2 md:py-1
              md:text-xs
            "
          >
            {discount}%
          </div>
        )}

        <div
          className={`
            absolute right-2 top-2 z-10
            hidden
            items-center gap-1
            rounded-full px-2 py-1
            text-[9px] font-bold text-white
            shadow-md
            md:flex md:text-xs
            ${isPreOrder ? "bg-purple-500" : "bg-emerald-500"}
          `}
        >
          {isPreOrder ? (
            <Plane className="h-3 w-3" />
          ) : (
            <PackageCheck className="h-3 w-3" />
          )}

          {isPreOrder ? "وارداتی" : "داخلی"}
        </div>

        <div
          className="
            absolute left-1.5 top-1.5 z-20
            md:left-2 md:top-2
            md:opacity-0
            md:group-hover:opacity-100
            transition-all duration-200
          "
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          onMouseDown={(event) => {
            event.stopPropagation();
          }}
        >
          <FavoriteHeartButton
            productId={productItems.id}
            initialFavorited={false}
            onToggled={handleToggleFavorite}
            className="
              h-6 w-6
              rounded-full
              bg-white/90
              shadow-sm
              ring-1 ring-black/5
              backdrop-blur-sm
              transition-transform duration-150
              hover:scale-110
              active:scale-90

              md:h-9 md:w-9
              md:shadow-md
            "
          />
        </div>

        {canPurchase && (
          <button
            type="button"
            aria-label="افزودن به سبد خرید"
            disabled={isAddingToCart}
            className="
              absolute left-1.5 top-9 z-20
              flex h-6 w-6
              items-center justify-center
              rounded-full
              bg-white/90
              shadow-sm
              ring-1 ring-black/5
              backdrop-blur-sm
              transition-all duration-150
              hover:scale-110
              hover:shadow-lg
              hover:ring-pink-200
              active:scale-90
              disabled:cursor-not-allowed
              disabled:opacity-40
              disabled:hover:scale-100

              md:left-2 md:top-13
              md:h-9 md:w-9
              md:shadow-md
              md:opacity-0
              md:group-hover:opacity-100
            "
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();

              void handleAddToCart();
            }}
            onMouseDown={(event) => {
              event.stopPropagation();
            }}
          >
            {isAddingToCart ? (
              <span
                className="
                  h-2.5 w-2.5
                  animate-spin
                  rounded-full
                  border-2 border-gray-300
                  border-t-pink-500
                  md:h-3.5 md:w-3.5
                "
              />
            ) : (
              <ShoppingBag
                className="
                  h-3 w-3
                  text-gray-500
                  transition-colors
                  hover:text-pink-500
                  md:h-4 md:w-4
                "
              />
            )}
          </button>
        )}

        <div className="relative flex w-full items-center justify-center p-1 md:p-2">
          <div
            className="
              relative
              aspect-4/3
              w-full
              overflow-hidden
              rounded-lg
              border
              border-dashed
              border-(--color-pink-white)
              md:rounded-3xl
              md:border-2
            "
          >
            <Image
              src={productItems.image}
              alt={productItems.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="
                object-cover
                transition-transform duration-300
                group-hover:scale-110
              "
            />
          </div>

          {!canPurchase && (
            <div
              className="
                absolute inset-0
                flex items-center justify-center
                bg-black/50
              "
            >
              <span
                className={`
                  rounded-full
                  px-2.5 py-1
                  text-xs
                  font-bold
                  text-white
                  shadow-md

                  md:px-3 md:py-1
                  md:text-sm

                  ${isPreOrder ? "bg-orange-500" : "bg-red-500"}
                `}
              >
                {statusText}
              </span>
            </div>
          )}

          {isInStock &&
            canPurchase &&
            productItems.stock > 0 &&
            productItems.stock < 5 && (
              <div
                className="
                  absolute bottom-1 left-1
                  rounded-full
                  bg-orange-500
                  px-2 py-0.5
                  text-[10px] text-white

                  md:bottom-2 md:left-2
                  md:px-2 md:text-xs
                "
              >
                فقط {productItems.stock} عدد
              </div>
            )}
        </div>

        <div className="px-2.5 py-2 text-right md:p-3">
          <div className="mb-0.5 flex items-center justify-between md:mb-1">
            <div className="flex items-center gap-0.5">
              {hasReviews ? (
                <>
                  <Star
                    className="
                      h-3.5 w-3.5
                      fill-yellow-400 text-yellow-400
                      md:h-3 md:w-3
                    "
                  />

                  <span className="text-xs text-gray-600 md:text-xs">
                    {productItems.rating}
                  </span>
                </>
              ) : (
                <span
                  className="
                    rounded-full
                    bg-pink-50
                    px-2 py-0.5
                    text-[11px]
                    font-medium
                    text-pink-500

                    md:px-1.5
                    md:text-xs
                  "
                >
                  جدید
                </span>
              )}
            </div>

            <span className="hidden text-xs text-gray-400 md:block">
              {productItems.brand}
            </span>
          </div>

          <h3
            className="
              min-h-10
              w-full
              overflow-hidden
              text-ellipsis
              text-[13px]
              font-semibold
              leading-5
              text-gray-800
              line-clamp-2

              md:min-h-12
              md:text-base
              md:leading-6
            "
          >
            {productItems.name}
          </h3>

          <div className="mt-0.5 flex items-center gap-1 md:mt-1">
            <span
              className={`
                rounded-full
                px-2 py-0.5
                text-[11px]
                font-semibold

                md:px-2
                md:text-[10px]

                ${
                  canPurchase
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-500"
                }
              `}
            >
              {statusText}
            </span>
          </div>

          <div className="mt-1 flex items-center justify-between gap-1 md:mt-2">
            {productItems.originalPrice && (
              <span
                className="
                  text-[11px]
                  text-gray-400
                  line-through

                  md:text-[12px]
                "
              >
                {productItems.originalPrice.toLocaleString()}
              </span>
            )}

            <div className="ms-auto flex items-center gap-0.5 md:gap-1">
              <span
                className="
                  text-sm
                  font-bold
                  text-pink-600

                  md:text-base
                "
              >
                {productItems.price.toLocaleString()}
              </span>

              <span
                className="
                  text-[11px]
                  text-gray-400

                  md:text-base
                "
              >
                تومان
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}