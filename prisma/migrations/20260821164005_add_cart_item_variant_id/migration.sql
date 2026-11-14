/*
  Warnings:

  - A unique constraint covering the columns `[cartId,productId,variantId,selectedColor,selectedSize,selectedNumber]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "CartItem_cartId_productId_selectedColor_selectedSize_select_key";

-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "variantId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cartId_productId_variantId_selectedColor_selectedS_key" ON "CartItem"("cartId", "productId", "variantId", "selectedColor", "selectedSize", "selectedNumber");
