-- CreateEnum
CREATE TYPE "ParcelBatchStatus" AS ENUM ('OPEN', 'AWAITING_PAYMENT', 'PAID', 'SHIPPED', 'CANCELLED');

-- AlterTable
ALTER TABLE "order_shipments" ADD COLUMN     "parcelBatchId" TEXT;

-- CreateTable
CREATE TABLE "domestic_parcel_batches" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "ParcelBatchStatus" NOT NULL DEFAULT 'OPEN',
    "totalVolume" INTEGER NOT NULL DEFAULT 0,
    "shippingCost" INTEGER NOT NULL DEFAULT 0,
    "shippingDueAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "shippedAt" TIMESTAMP(3),
    "trackingNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "domestic_parcel_batches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "domestic_parcel_batches_userId_idx" ON "domestic_parcel_batches"("userId");

-- CreateIndex
CREATE INDEX "domestic_parcel_batches_status_idx" ON "domestic_parcel_batches"("status");

-- CreateIndex
CREATE INDEX "order_shipments_parcelBatchId_idx" ON "order_shipments"("parcelBatchId");

-- AddForeignKey
ALTER TABLE "domestic_parcel_batches" ADD CONSTRAINT "domestic_parcel_batches_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_shipments" ADD CONSTRAINT "order_shipments_parcelBatchId_fkey" FOREIGN KEY ("parcelBatchId") REFERENCES "domestic_parcel_batches"("id") ON DELETE SET NULL ON UPDATE CASCADE;
