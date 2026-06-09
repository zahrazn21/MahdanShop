// import { db } from "../db"

import { products } from "@/src/components/product/ProductItems"

// export async function getProducts() {
//   return db.product.findMany()
// }

// export async function getProductById(id: string) {
//   return db.product.findUnique({
//     where: { id }
//   })
// }

// export async function createProduct(data: {
//   name: string
//   price: number
//   category: string
//   image: string
// }) {
//   return db.product.create({
//     data
//   })
// }

// export async function updateProduct(
//   id: string,
//   data: Partial<{
//     name: string
//     price: number
//     category: string
//     image: string
//   }>
// ) {
//   return db.product.update({
//     where: { id },
//     data
//   })
// }

// export async function deleteProduct(id: string) {
//   return db.product.delete({
//     where: { id }
//   })
// }

export async function getProducts() {
  return products
}

export async function getProductById(id: string) {
  return products.find(p => p.id === id)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createProduct(data: any) {
  const newProduct = { id: String(Date.now()), ...data }
  products.push(newProduct)
  return newProduct
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateProduct(id: string, data: any) {
  const index = products.findIndex(p => p.id === id)
  if (index === -1) throw new Error("Product not found")

  products[index] = { ...products[index], ...data }
  return products[index]
}

export async function deleteProduct(id: string) {
  const index = products.findIndex(p => p.id === id)
  if (index === -1) throw new Error("Product not found")

  const deleted = products[index]
  products.splice(index, 1)
  return deleted
}
