// ProductClient.tsx - نسخه کامل با گالری هوشمند

"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CheckCircle } from "lucide-react";
import TabsSection from "./helpers/tabSection";
import { Product } from "./ProductItems";
import { ProductInfoSection } from "./helpers/ProductInfoSection";
import { ProductSkeleton } from "./helpers/ProductSkeleton";
import { Breadcrumb } from "./helpers/Breadcrumb";
import ProductGallery from "./helpers/ProductGallery";
import { ServiceCard } from "./helpers/ServiceCard";
import { Gift, Truck, ShieldCheck, RefreshCw } from "lucide-react";
import { useCartActions } from "@/src/shared/hooks/useCart";
interface Props {
  id: string;
  initialProduct: Product;
}

export default function ProductClient({ id, initialProduct }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [isWishlist, setIsWishlist] = useState(false);
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "description" | "reviews" | "details"
  >("description");

  const [selectedColor, setSelectedColor] = useState(
    initialProduct.colors?.[0] || "",
  );
  const [selectedSize, setSelectedSize] = useState(
    initialProduct.sizes?.[0] || "",
  );
  const [selectedNumber, setSelectedNumber] = useState(
    initialProduct.numbers?.[0] || "",
  );

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await fetch(`/api/products/${id}`);
      return res.json();
    },
    initialData: initialProduct,
    staleTime: 5 * 60 * 1000,
  });

  const { addToCart, isAdding } = useCartActions();
  const incrementQuantity = () => {
    if (quantity < product.stock) setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;


const handleAddToCart = () => {
  if (!product || isAdding) return;

  if (quantity > product.stock) return;

  addToCart({
    productId: product.id,
    quantity,
    selectedColor,
    selectedSize,
    selectedNumber,
  });

  setShowAddedToCart(true);
  setTimeout(() => setShowAddedToCart(false), 3000);
};
  console.log("p", product);
  console.log("id", product.id);

  // servicesData.ts یا داخل خود کامپوننت
  const services = [
    {
      id: 1,
      icon: <Truck />,
      title: "ارسال سریع",
      subtitle: "۲۴ ساعته",
    },
    {
      id: 2,
      icon: <ShieldCheck />,
      title: "ضمانت اصالت",
      subtitle: "بازگشت وجه",
    },
    {
      id: 3,
      icon: <RefreshCw />,
      title: "هفت روز گارانتی",
      subtitle: "تعویض محصول",
    },
    {
      id: 4,
      icon: <Gift />,
      title: "بسته بندی شیک",
      subtitle: "مناسب هدیه دادن",
    },
  ];

  if (isLoading) return <ProductSkeleton />;

  return (
    <div dir="rtl" className="min-h-screen">
      <div
        className={`fixed bottom-4 left-4 z-50 transition-all duration-300 transform ${
          showAddedToCart
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none"
        }`}
      >
        <div className="bg-linear-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span>به سبد خرید اضافه شد!</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Breadcrumb product={product} />

<div className="grid grid-cols-1 lg:grid-cols-[1fr_500px] gap-5 items-start">
            <div className="sticky top-6 self-start">
            <ProductGallery
              product={product}
              discount={discount}
              isWishlist={isWishlist}
              setIsWishlist={setIsWishlist}
            />
          </div>

          <ProductInfoSection
            product={product}
            quantity={quantity}
            discount={discount}
            incrementQuantity={incrementQuantity}
            decrementQuantity={decrementQuantity}
            handleAddToCart={handleAddToCart}
            // ✅ props جدید
            selectedColor={selectedColor}
            selectedSize={selectedSize}
            selectedNumber={selectedNumber}
            onColorChange={setSelectedColor}
            onSizeChange={setSelectedSize}
            onNumberChange={setSelectedNumber}
            isAdding={isAdding}
          />
        </div>
        <div className="grid grid-cols-4 gap-0  rounded-2xl  py-4 my-5 bg-(--color-pink-light) shadow-xl shadow-pink-800/10 ">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              id={service.id}
              icon={service.icon}
              title={service.title}
              subtitle={service.subtitle}
            />
          ))}
        </div>
        <TabsSection
          product={product}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
    </div>
  );
}
