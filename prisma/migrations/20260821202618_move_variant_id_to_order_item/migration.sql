/*
  Warnings:

  - You are about to drop the column `variantId` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "variantId" TEXT;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "variantId";
