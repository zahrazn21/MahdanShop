// // lib/db/cart.ts

// export interface CartItemType {
//   id: string;

//   category: string;
//   scope: "domestic" | "imported" | "all";

//   productId: string;

//   name: string;
//   price: number;
//   originalPrice?: number;

//   image: string;
//   brand: string;

//   quantity: number;

//   // Variant
//   variantId?: string;
//   variantName?: string;
//   variantSize?: string;
//   variantVolume?: number;
//   variantVolumeUnit?: string;

//   // Legacy options
//   selectedColor?: string;
//   selectedSize?: string;
//   selectedNumber?: string;

//   addedAt: string;
// }
// export interface Cart {
//   items: CartItemType[];
//   totalPrice: number;
//   totalDiscount: number;
//   finalPrice: number;
//   itemCount: number;
// }

// // دیتابیس در حافظه
// let cartItems: CartItemType[] = [];

// // توابع سبد خرید
// export const cartDB = {
//   // دریافت همه آیتم‌ها
//   getItems: (): CartItemType[] => {
//     return cartItems;
//   },

//   // دریافت سبد خرید کامل با محاسبات
//   getCart: (): Cart => {
//     const items = cartItems;
//     const totalPrice = items.reduce(
//       (sum, item) => sum + item.price * item.quantity,
//       0,
//     );
//     const totalDiscount = items.reduce((sum, item) => {
//       if (item.originalPrice && item.originalPrice > item.price) {
//         return sum + (item.originalPrice - item.price) * item.quantity;
//       }
//       return sum;
//     }, 0);
//     const finalPrice = totalPrice - totalDiscount;
//     const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

//     return {
//       items,
//       totalPrice,
//       totalDiscount,
//       finalPrice,
//       itemCount,
//     };
//   },

//   // افزودن به سبد خرید
//   addItem: (item: Omit<CartItemType, "id" | "addedAt">): CartItemType => {
    
//     const existingIndex = cartItems.findIndex(
//       (i) =>
//         i.productId === item.productId &&
//         i.variantId === item.variantId &&
//         i.selectedColor === item.selectedColor &&
//         i.selectedSize === item.selectedSize &&
//         i.selectedNumber === item.selectedNumber,
//     );

//     if (existingIndex !== -1) {
//       // اگر موجود بود، تعداد را افزایش بده
//       cartItems[existingIndex].quantity += item.quantity;
//       return cartItems[existingIndex];
//     } else {
//       // اگر موجود نبود، اضافه کن
//       const newItem: CartItemType = {
//         ...item,
//         id: Date.now().toString(),
//         addedAt: new Date().toISOString(),
//       };
//       cartItems.push(newItem);
//       return newItem;
//     }
//   },

//   // به‌روزرسانی تعداد
//   updateQuantity: (id: string, quantity: number): CartItemType | null => {
//     const index = cartItems.findIndex((i) => i.id === id);
//     if (index === -1) return null;

//     if (quantity <= 0) {
//       // اگر تعداد صفر یا منفی شد، حذف کن
//       return cartDB.removeItem(id);
//     }

//     cartItems[index].quantity = quantity;
//     return cartItems[index];
//   },

//   // حذف از سبد خرید
//   removeItem: (id: string): CartItemType | null => {
//     const index = cartItems.findIndex((i) => i.id === id);
//     if (index === -1) return null;

//     const removed = cartItems[index];
//     cartItems.splice(index, 1);
//     return removed;
//   },

//   // خالی کردن سبد خرید
//   clearCart: (): void => {
//     cartItems = [];
//   },

//   // دریافت تعداد کل
//   getItemCount: (): number => {
//     return cartItems.reduce((sum, item) => sum + item.quantity, 0);
//   },

//   // دریافت قیمت کل
//   getTotalPrice: (): number => {
//     return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
//   },

//   // دریافت تخفیف کل
//   getTotalDiscount: (): number => {
//     return cartItems.reduce((sum, item) => {
//       if (item.originalPrice && item.originalPrice > item.price) {
//         return sum + (item.originalPrice - item.price) * item.quantity;
//       }
//       return sum;
//     }, 0);
//   },
// };
