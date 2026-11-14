export interface Product {
  id: string;

  name: string;

  price: number;

  originalPrice?: number;

  image?: string;

  images?: string[];

  category: string;

  brand: string;

  scope: "domestic" | "imported" | "all";

  stock: number;

  isAvailable: boolean;

  rating: number;

  reviewCount: number;
  description: string;
  shippingClass: "SMALL" | "MEDIUM" | "LARGE";
}

export interface ProductFormData {
  name: string;
  price: string;
  originalPrice: string;
  image?: string;

  images?: string[];

  category: string;
  brand: string;

  scope: "domestic" | "imported" | "all";

  stock: string;

  description: string;

  features?: string[];

  ingredients?: string[];

  howToUse?: string;

  slug?: string;

  shippingClass: "SMALL" | "MEDIUM" | "LARGE";
}
