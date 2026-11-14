/*
  Warnings:

  - You are about to drop the column `trackingNumber` on the `orders` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "BatchStatus" AS ENUM ('OPEN', 'PROCESSING', 'ARRIVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "FreightPaymentStatus" AS ENUM ('NOT_REQUIRED', 'PENDING', 'AWAITING_USER_PAYMENT', 'PAID');

-- AlterEnum
ALTER TYPE "ShipmentStatus" ADD VALUE 'WAITING_FOR_FREIGHT';

-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "batchNumber" INTEGER;

-- AlterTable
ALTER TABLE "order_shipments" ADD COLUMN     "actualWeightGram" INTEGER,
ADD COLUMN     "batchId" TEXT,
ADD COLUMN     "freightCostToman" INTEGER,
ADD COLUMN     "freightPaymentStatus" "FreightPaymentStatus" NOT NULL DEFAULT 'NOT_REQUIRED',
ADD COLUMN     "freightRateYuan" DOUBLE PRECISION,
ADD COLUMN     "freightReceiptImage" TEXT,
ADD COLUMN     "yuanExchangeRate" INTEGER;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "trackingNumber";

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "batchId" TEXT;

-- CreateTable
CREATE TABLE "order_batches" (
    "id" TEXT NOT NULL,
    "batchNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "estimatedFreightPerKg" DOUBLE PRECISION,
    "status" "BatchStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_batches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "order_batches_batchNumber_key" ON "order_batches"("batchNumber");

-- CreateIndex
CREATE INDEX "order_shipments_batchId_idx" ON "order_shipments"("batchId");

-- CreateIndex
CREATE INDEX "products_batchId_idx" ON "products"("batchId");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "order_batches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_shipments" ADD CONSTRAINT "order_shipments_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "order_batches"("id") ON DELETE SET NULL ON UPDATE CASCADE;
