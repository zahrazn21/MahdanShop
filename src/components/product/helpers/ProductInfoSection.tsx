
import type {
  Product,
  ProductVariant,
} from "@/src/shared/types/product";
import { ProductHeader } from "./info/ProductHeader";
import { ProductRating } from "./info/ProductRating";
import { ProductPrice } from "./info/ProductPrice";
import { ProductDelivery } from "./info/ProductDelivery";
import { ProductFeatures } from "./info/ProductFeatures";
import ProductVariants from "./ProductVariants";
import ProductOptions from "./ProductOptions";
import { ProductQuantity } from "./info/ProductQuantity";
import { ProductPurchaseStatus } from "./info/ProductPurchaseStatus";
import { ProductActions } from "./info/ProductActions";
import { ProductSpecifications } from "./info/ProductSpecifications";
import { useProductPurchase } from "@/src/shared/hooks/product/useProductPurchase";

export interface ProductInfoSectionProps {
  product: Product;

  quantity: number;
  discount: number;

  incrementQuantity: () => void;
  decrementQuantity: () => void;

  handleAddToCart: (variantId?: string) => void;
  isAdding: boolean;

  selectedColor?: string;
  selectedSize?: string;
  selectedNumber?: string;

  onColorChange?: (value: string) => void;
  onSizeChange?: (value: string) => void;
  onNumberChange?: (value: string) => void;

  selectedVariant?: ProductVariant | null;
  onVariantChange: (variant: ProductVariant) => void;

  initialFavorited?: boolean;
}

export function ProductInfoSection({
  product,
  quantity,
  discount,
  incrementQuantity,
  decrementQuantity,
  handleAddToCart,
  isAdding,
  selectedColor,
  selectedSize,
  selectedNumber,
  onColorChange,
  onSizeChange,
  onNumberChange,
  selectedVariant,
  onVariantChange,
  initialFavorited = false,
}: ProductInfoSectionProps) {
  const {
    isPreOrder,
    isInStock,
    hasVariants,
    hasBatch,
    activeVariant,
    currentPrice,
    currentStock,
    sku,
    canPurchase,
    purchaseDisabledReason,
  } = useProductPurchase({
    product,
    selectedVariant,
  });

  const hasLegacyOptions =
    (product.colors?.length ?? 0) > 0 ||
    (product.sizes?.length ?? 0) > 0 ||
    (product.numbers?.length ?? 0) > 0;

  return (
    <div className="space-y-6 rounded-3xl bg-(--color-pink-light) px-6 py-4 shadow-xl shadow-pink-800/10 sm:px-8">
      <ProductHeader
        product={product}
        sku={sku}
      />

      <ProductRating
        product={product}
        canPurchase={canPurchase}
        isPreOrder={isPreOrder}
        currentStock={currentStock}
      />

      <ProductPrice
        product={product}
        currentPrice={currentPrice}
        discount={discount}
      />

      <ProductDelivery
        product={product}
        isPreOrder={isPreOrder}
        hasBatch={hasBatch}
      />

      <ProductFeatures
        features={product.features}
      />

      {hasVariants ? (
        <ProductVariants
          variants={product.variants ?? []}
          selectedVariantId={activeVariant?.id}
          onVariantChange={onVariantChange}
        />
      ) : (
        hasLegacyOptions && (
          <ProductOptions
            colors={product.colors}
            sizes={product.sizes}
            numbers={product.numbers}
            selectedColor={selectedColor}
            selectedSize={selectedSize}
            selectedNumber={selectedNumber}
            onColorChange={onColorChange}
            onSizeChange={onSizeChange}
            onNumberChange={onNumberChange}
          />
        )
      )}

      <ProductQuantity
        quantity={quantity}
        currentStock={currentStock}
        isInStock={isInStock}
        isPreOrder={isPreOrder}
        canPurchase={canPurchase}
        onIncrement={incrementQuantity}
        onDecrement={decrementQuantity}
      />

      <ProductPurchaseStatus
        canPurchase={canPurchase}
        reason={purchaseDisabledReason}
      />

      <ProductActions
        product={product}
        activeVariant={activeVariant}
        isPreOrder={isPreOrder}
        canPurchase={canPurchase}
        isAdding={isAdding}
        handleAddToCart={handleAddToCart}
        initialFavorited={initialFavorited}
      />

      <ProductSpecifications
        specifications={product.specifications}
      />
    </div>
  );
}