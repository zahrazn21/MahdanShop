/*
  Warnings:

  - The values [PREPARING,SHIPPED,DELIVERED] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `trackingNumber` on the `orders` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "AvailabilityType" AS ENUM ('IN_STOCK', 'PRE_ORDER');

-- CreateEnum
CREATE TYPE "ShipmentType" AS ENUM ('DOMESTIC', 'IMPORTED');

-- CreateEnum
CREATE TYPE "ShipmentStatus" AS ENUM ('PENDING', 'WAITING_IMPORT', 'READY_TO_SHIP', 'SHIPPED', 'DELIVERED');

-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('PENDING_PAYMENT', 'WAITING_CONFIRMATION', 'CONFIRMED', 'PROCESSING', 'PARTIALLY_SHIPPED', 'COMPLETED', 'CANCELLED');
ALTER TABLE "public"."orders" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "orders" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "public"."OrderStatus_old";
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'PENDING_PAYMENT';
COMMIT;

-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "availabilityType" "AvailabilityType" NOT NULL DEFAULT 'IN_STOCK',
ADD COLUMN     "estimatedDeliveryDays" INTEGER;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "trackingNumber";

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "availabilityType" "AvailabilityType" NOT NULL DEFAULT 'IN_STOCK',
ADD COLUMN     "estimatedDeliveryDays" INTEGER,
ADD COLUMN     "preOrderNote" TEXT;

-- CreateTable
CREATE TABLE "order_shipments" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "status" "ShipmentStatus" NOT NULL DEFAULT 'PENDING',
    "shipmentType" "ShipmentType" NOT NULL DEFAULT 'DOMESTIC',
    "trackingNumber" TEXT,
    "shippedAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "estimatedDeliveryDays" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "subtotal" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "order_shipments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_shipment_items" (
    "id" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "orderItemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "order_shipment_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "order_shipments_orderId_idx" ON "order_shipments"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "order_shipment_items_shipmentId_orderItemId_key" ON "order_shipment_items"("shipmentId", "orderItemId");

-- CreateIndex
CREATE INDEX "products_availabilityType_idx" ON "products"("availabilityType");

-- AddForeignKey
ALTER TABLE "order_shipments" ADD CONSTRAINT "order_shipments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_shipment_items" ADD CONSTRAINT "order_shipment_items_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "order_shipments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_shipment_items" ADD CONSTRAINT "order_shipment_items_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "order_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
