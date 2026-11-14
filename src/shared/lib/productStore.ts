
import { Prisma, Product } from "@prisma/client";
import { prisma } from "./prisma";

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
      data: data as Prisma.ProductUncheckedCreateInput,
    });
  },
  async update(id: string, data: Partial<Product>) {
    return prisma.product.update({
      where: { id },
      data: data as Prisma.ProductUncheckedUpdateInput,
    });
  },

  async delete(id: string) {
    return prisma.product.delete({
      where: { id },
    });
  },
};