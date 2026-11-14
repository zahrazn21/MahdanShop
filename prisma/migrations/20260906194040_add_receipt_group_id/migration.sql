/*
  Warnings:

  - You are about to drop the column `receiptGroupId` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "receiptGroupId";

-- AlterTable
ALTER TABLE "shipping_payments" ADD COLUMN     "receiptGroupId" TEXT;
