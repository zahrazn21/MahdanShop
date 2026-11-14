export type PaymentType = "CARD_TO_CARD";

export type ShippingPaymentMode = "IMMEDIATE" | "DEFERRED";


export interface ShippingInfo {
  fullName: string;
  phone: string;
  email: string;
  telegramId: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  deliveryNote?: string;
}
export interface CheckoutCartItem {
  id: string;
  productId: string;

  variantId: string | null;

  name: string;

  price: number;
  originalPrice: number | null;

  image: string | null;

  quantity: number;

  selectedColor: string | null;
  selectedSize: string | null;
  selectedNumber: string | null;

  shippingClass: "SMALL" | "MEDIUM" | "LARGE";
  availabilityType: "IN_STOCK" | "PRE_ORDER";
}

export interface OrderData {
  userId?: string;

  shippingInfo: ShippingInfo;

  paymentMethod: PaymentType;

  items: CheckoutCartItem[];


  totalPrice: number;

  discount: number;


  shippingCost: number;


  shippingPaymentMode: ShippingPaymentMode;


  finalPrice: number;

  importedFreightAccepted?: boolean;
}