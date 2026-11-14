import type {
  AvailabilityType,
  BatchStatus,
  ProductStatus,
  Scope,
  ShippingClass,
} from "./product";

export interface CartItemDisplay {
  id: string;
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  brand?: string;
  quantity: number;
  stock?: number;

  availabilityType: AvailabilityType;
  isAvailable: boolean;
  status: ProductStatus;
  batchStatus?: BatchStatus | null;

  variantId?: string | null;
  selectedVariant?: {
    id: string;
    name: string;
    volume?: number;
    volumeUnit?: string;
  };
  selectedColor?: string;
  selectedSize?: string;
  selectedNumber?: string;

  category: string;
  scope: Scope;
  shippingClass: ShippingClass;
}

export interface CartResponse {
  items: CartItemDisplay[];
  itemCount: number;
  totalPrice: number;
  totalDiscount?: number;
  finalPrice?: number;
  hasImportedItems?: boolean;
  hasDomesticItems?: boolean;
  importedFreightCost?: number;
  shippingCost?: number;
}

export interface AddToCartInput {
  productId: string;
  quantity?: number;
  variantId?: string;
  selectedColor?: string;
  selectedSize?: string;
  selectedNumber?: string;
}

export interface UpdateCartInput {
  id: string;
  quantity: number;
}