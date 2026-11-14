
export type Scope = "domestic" | "imported" | "all";

export type ProductStatus = "ACTIVE" | "DRAFT" | "OUT_OF_STOCK" | "ARCHIVED";

export type ShippingClass = "SMALL" | "MEDIUM" | "LARGE";

export type VolumeUnit = "ml" | "gr" | "oz";

export type AvailabilityType = "IN_STOCK" | "PRE_ORDER";

export type BatchStatus = "OPEN" | "PROCESSING" | "ARRIVED" | "CLOSED";

export interface ProductSpecification {
  key: string;
  label: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku?: string | null;
  price: number;
  originalPrice?: number | null;
  stock: number;
  isAvailable?: boolean;
  colorName?: string | null;
  hexCode?: string | null;
  size?: string | null;
  volume?: number | null;
  volumeUnit?: VolumeUnit | null;
  image?: string | null;
  images?: string[];
  weight?: number | null;
}

export interface ProductBatch {
  id: string;
  batchNumber: number;
  title: string;
  estimatedFreightPerKg?: number | null;
  status?: BatchStatus;
}

export interface Product {
  id: string;
  name: string;
  slug: string;

  price: number;
  originalPrice?: number | null;

  image: string;
  images?: string[];

  category: string;
  brand?: string | null;
  scope: Scope;

  availabilityType: AvailabilityType;
  estimatedDeliveryDays?: number | null;
  preOrderNote?: string | null;

  batchId?: string | null;
  batch?: ProductBatch | null;

  stock: number;
  isAvailable: boolean;
  shippingClass: ShippingClass;
  weight?: number | null;

  colors?: string[];
  sizes?: string[];
  numbers?: string[];

  rating: number;
  reviewCount: number;

  description?: string | null;
  features?: string[];
  ingredients?: string[];
  howToUse?: string | null;

  status: ProductStatus;
  sku?: string | null;
  expirationDate?: string | null;

  specifications?: ProductSpecification[];
  variants?: ProductVariant[];

  createdAt?: string;
  updatedAt?: string;
}