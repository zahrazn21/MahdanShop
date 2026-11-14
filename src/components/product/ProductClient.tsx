"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CheckCircle } from "lucide-react";
import TabsSection from "./helpers/tabSection";
import { ProductInfoSection } from "./helpers/ProductInfoSection";
import { ProductSkeleton } from "./helpers/ProductSkeleton";
import { Breadcrumb } from "./helpers/Breadcrumb";
import ProductGallery from "./helpers/ProductGallery";
import { ServiceCard } from "./helpers/ServiceCard";
import { Gift, Truck, ShieldCheck, RefreshCw } from "lucide-react";
import { useCartActions } from "@/src/shared/hooks/useCart";
import { Product, ProductVariant } from "@/src/shared/types/product";

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

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    initialProduct.variants?.[0] ?? null,
  );

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["product", id],

    queryFn: async (): Promise<Product> => {
      const res = await fetch(`/api/products/${id}`);

      if (!res.ok) {
        throw new Error("خطا در دریافت محصول");
      }

      return res.json();
    },

    initialData: initialProduct,
    staleTime: 5 * 60 * 1000,
  });

  const { addToCartAsync, isAdding } = useCartActions();

  const isPreOrder = product.availabilityType === "PRE_ORDER";
  const isInStock = product.availabilityType === "IN_STOCK";
  const currentStock = selectedVariant?.stock ?? product.stock;
  const isPreOrderOpen = isPreOrder && product.batch?.status === "OPEN";
  const canPurchase =
    product.status === "ACTIVE" &&
    product.isAvailable &&
    ((isInStock && currentStock > 0) || (isPreOrder && isPreOrderOpen));
  const safeQuantity =
    isInStock && currentStock > 0 ? Math.min(quantity, currentStock) : quantity;

  const incrementQuantity = () => {
    if (!isPreOrder && safeQuantity >= currentStock) {
      return;
    }

    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;

  const handleAddToCart = async (variantId?: string) => {
    if (isAdding) {
      return;
    }

    if (!canPurchase) {
      alert(
        isPreOrder
          ? "مهلت پیش‌سفارش این محصول فعال نیست."
          : "این محصول در حال حاضر قابل سفارش نیست.",
      );

      return;
    }

    const resolvedVariantId = variantId ?? selectedVariant?.id;

    if (isInStock) {
      const selectedProductVariant = resolvedVariantId
        ? product.variants?.find((variant) => variant.id === resolvedVariantId)
        : undefined;

      const stock = selectedProductVariant?.stock ?? product.stock;

      if (stock <= 0) {
        alert("این محصول موجود نیست");
        return;
      }

      if (safeQuantity > stock) {
        alert(`حداکثر تعداد قابل خرید ${stock} عدد است`);
        return;
      }
    }

    try {
      await addToCartAsync({
        productId: product.id,
        quantity: safeQuantity,

        ...(resolvedVariantId ? { variantId: resolvedVariantId } : {}),

        ...(selectedColor ? { selectedColor } : {}),

        ...(selectedSize ? { selectedSize } : {}),

        ...(selectedNumber ? { selectedNumber } : {}),
      });

      setShowAddedToCart(true);

      window.setTimeout(() => {
        setShowAddedToCart(false);
      }, 3000);
    } catch (error) {
      console.error("ADD TO CART ERROR:", error);

      alert(
        error instanceof Error
          ? error.message
          : "خطا در افزودن محصول به سبد خرید",
      );
    }
  };

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

  if (isLoading) {
    return <ProductSkeleton />;
  }

  return (
    <div dir="rtl" className="min-h-screen">
      <div
        className={`fixed bottom-4 left-4 z-50 transform transition-all duration-300 ${
          showAddedToCart
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-10 opacity-0"
        }`}
      >
        <div className="flex items-center gap-2 rounded-xl bg-linear-to-r from-green-500 to-emerald-500 px-6 py-3 text-white shadow-lg">
          <CheckCircle className="h-5 w-5" />

          <span>به سبد خرید اضافه شد!</span>
        </div>
      </div>

      <div className="container md:mx-auto md:max-w-7xl md:px-4 px-2  py-2">
        <Breadcrumb product={product} />

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[1fr_500px]">
          <div className="min-w-0 lg:sticky lg:top-6 self-start">
            {" "}
            <ProductGallery
              product={product}
              selectedVariant={selectedVariant}
              discount={discount}
              isWishlist={isWishlist}
              setIsWishlist={setIsWishlist}
            />
          </div>

          <ProductInfoSection
            product={product}
            quantity={safeQuantity}
            discount={discount}
            incrementQuantity={incrementQuantity}
            decrementQuantity={decrementQuantity}
            handleAddToCart={handleAddToCart}
            selectedColor={selectedColor}
            selectedSize={selectedSize}
            selectedNumber={selectedNumber}
            onColorChange={setSelectedColor}
            onSizeChange={setSelectedSize}
            onNumberChange={setSelectedNumber}
            isAdding={isAdding}
            selectedVariant={selectedVariant}
            onVariantChange={(variant) => {
              setSelectedVariant(variant);
              setSelectedColor(variant.name ?? "");
              setSelectedSize(variant.size ?? "");
              setSelectedNumber(variant.stock?.toString() ?? "");
              setQuantity(1);
            }}
          />
        </div>

        <div className="my-5 grid grid-cols-4 gap-0 rounded-2xl bg-(--color-pink-light) py-4 shadow-xl shadow-pink-800/10">
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
