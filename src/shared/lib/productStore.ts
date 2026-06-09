// // lib/productStore.ts
// import { products as initialProducts } from "@/app/components/product/ProductItems";
// import { Product } from "@/app/components/product/ProductItems";

// const products = [...initialProducts];

// export const productStore = {

//   getAll: () => [...products],
  
//   getById: (id: string) => products.find(p => p.id === id),
  
//   add: (product: Omit<Product, 'id' | 'createdAt'>) => {
//     const newProduct: Product = {
//       ...product,
//       id: Date.now().toString(),
//       createdAt: new Date().toISOString(),
//       rating: product.rating || 0,
//       reviewCount: product.reviewCount || 0,
//       isAvailable: product.isAvailable ?? product.stock > 0,
//     };
//     products.push(newProduct);
//     console.log("محصول جدید اضافه شد:", newProduct);
//     console.log("تعداد کل محصولات:", products.length);
//     return newProduct;
//   },
  
//   update: (id: string, data: Partial<Product>) => {
//     const index = products.findIndex(p => p.id === id);
//     if (index === -1) return null;
//     products[index] = { ...products[index], ...data };
//     return products[index];
//   },
  
//   delete: (id: string) => {
//     const index = products.findIndex(p => p.id === id);
//     if (index === -1) return null;
//     const deleted = products[index];
//     products.splice(index, 1);
//     return deleted;
//   },
// };

import { prisma } from "@/src/app/lib/prisma";
import { Product } from "@prisma/client";

export const productService = {
  async getAll() {
    return prisma.product.findMany();
  },

  async getById(id: string) {
    return prisma.product.findUnique({
      where: { id },
    });
  },

  async add(data: Omit<Product, "id" | "createdAt" | "updatedAt">) {
    return prisma.product.create({
      data,
    });
  },

  async update(id: string, data: Partial<Product>) {
    return prisma.product.update({
      where: { id },
      data,
    });
  },

  async delete(id: string) {
    return prisma.product.delete({
      where: { id },
    });
  },
};