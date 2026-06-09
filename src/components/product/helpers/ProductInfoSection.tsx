// components/product/ProductInfoSection.tsx
import { useState } from "react";
import { ShoppingBag, Minus, Plus, Heart } from "lucide-react";
import Link from "next/link";
import { getCategoryName } from "../ProductItems";
import { RenderStars } from "./renderStars";
import ProductOptions from "./ProductOptions";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ProductInfoSection({
  product,
  quantity,
  discount,
  incrementQuantity,
  decrementQuantity,
  handleAddToCart,
  isAdding ,

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) {
  // Stateهای انتخاب ویژگی‌ها
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "");
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "");
  const [selectedNumber, setSelectedNumber] = useState(
    product.numbers?.[0] || "",
  );

  // بررسی آیا ویژگی‌ها وجود دارد
  const hasOptions =
    product.colors?.length > 0 ||
    product.sizes?.length > 0 ||
    product.numbers?.length > 0;


  return (
    <div className="space-y-6 bg-(--color-pink-light) shadow-xl shadow-pink-800/10 rounded-3xl py-4 px-8">
      <div>
        <div className="flex items-center gap-2 text-sm mb-2">
          <span className="text-pink-600 font-semibold">{product.brand}</span>
          <span className="text-gray-300">|</span>
          <Link
            href={`/products/${product.scope}/${product.category}`}
            className="text-gray-500 hover:text-pink-600"
          >
            {getCategoryName(product.category)}
          </Link>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
          {product.name}
        </h1>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1" dir="ltr">
          <span className="text-gray-600 mr-2 ">{product.rating}</span>
          {RenderStars(product.rating)}
        </div>
        <div className="text-gray-400">|</div>
        <div className="text-gray-500">{product.reviewCount} نظر</div>
        <div className="text-gray-400">|</div>
        <div
          className={`${product.stock > 0 ? "text-green-600" : "text-red-500"} font-semibold`}
        >
          {product.stock > 0 ? `موجودی: ${product.stock} عدد` : "ناموجود"}
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4">
        <div className="flex items-end gap-3 flex-wrap">
          <span className="text-3xl font-bold text-pink-600">
            {product.price.toLocaleString()}
          </span>
          <span className="text-gray-500 mb-1">تومان</span>
          {product.originalPrice && (
            <>
              <span className="text-gray-400 line-through text-lg">
                {product.originalPrice.toLocaleString()}
              </span>
              <span className="text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-full text-sm">
                {discount}% تخفیف
              </span>
            </>
          )}
        </div>
      </div>

      {/* انتخاب ویژگی‌ها */}
      {hasOptions && (
        <ProductOptions
          colors={product.colors}
          sizes={product.sizes}
          numbers={product.numbers}
          selectedColor={selectedColor}
          selectedSize={selectedSize}
          selectedNumber={selectedNumber}
          onColorChange={setSelectedColor}
          onSizeChange={setSelectedSize}
          onNumberChange={setSelectedNumber}
        />
      )}

      <div className="space-y-3">
        <label className="block text-gray-700 font-semibold">تعداد:</label>
        <div className="flex items-center gap-4">
          <div className="flex items-center border-2 border-pink-100 rounded-full bg-white">
            <button
              onClick={decrementQuantity}
              disabled={quantity <= 1}
              className="w-12 h-12 flex items-center justify-center rounded-r-full hover:bg-pink-50 disabled:opacity-50 transition-colors"
            >
              <Minus className="w-5 h-5 text-gray-600" />
            </button>
            <span className="w-16 text-center font-semibold text-lg">
              {quantity}
            </span>
            <button
              onClick={incrementQuantity}
              disabled={quantity >= product.stock}
              className="w-12 h-12 flex items-center justify-center rounded-l-full hover:bg-pink-50 disabled:opacity-50 transition-colors"
            >
              <Plus className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <span className="text-gray-500 text-sm">
            حداکثر {product.stock} عدد موجود است
          </span>
        </div>
      </div>

      {/* <button
        onClick={() => handleAddToCart({
          ...product,
          selectedColor,
          selectedSize,
          selectedNumber,
          quantity,
        })}
        disabled={!product.isAvailable || product.stock === 0}
        className="w-full bg-linear-to-r from-pink-500 to-rose-500 text-white py-3 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
      >
        <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
        افزودن به سبد خرید
      </button> */}
      <button
        onClick={handleAddToCart}
        disabled={!product.isAvailable || product.stock === 0 || isAdding}
        className="w-full bg-linear-to-r from-pink-500 to-rose-500 text-white py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
      >
        {isAdding ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            در حال افزودن...
          </>
        ) : (
          <>
            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
            افزودن به سبد خرید
          </>
        )}
      </button>
      <button
        onClick={() => {
          /* منطق علاقه‌مندی */
        }}
        disabled={!product.isAvailable || product.stock === 0}
        className="w-full bg-pink-300/10 text-pink-500 py-3 rounded-full font-bold text-lg border hover:shadow-xl hover:shadow-pink-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
      >
        <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
        افزودن به علاقه مندی ها
      </button>
    </div>
  );
}
