-- CreateEnum
CREATE TYPE "ShippingPaymentStatus" AS ENUM ('NOT_REQUIRED', 'AWAITING_USER_PAYMENT', 'PAID', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ShippingPaymentReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "order_shipments" ADD COLUMN     "shippingCost" INTEGER,
ADD COLUMN     "shippingDueAt" TIMESTAMP(3),
ADD COLUMN     "shippingPaidAt" TIMESTAMP(3),
ADD COLUMN     "shippingPaymentStatus" "ShippingPaymentStatus" NOT NULL DEFAULT 'NOT_REQUIRED';

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "importedFreightAccepted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "importedFreightAcceptedAt" TIMESTAMP(3),
ADD COLUMN     "importedFreightTermsVersion" TEXT;

-- CreateTable
CREATE TABLE "shipping_payments" (
    "id" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" "ShippingPaymentReviewStatus" NOT NULL DEFAULT 'PENDING',
    "receiptImage" TEXT,
    "payerName" TEXT,
    "payerCardLast4" TEXT,
    "adminNote" TEXT,
    "rejectionReason" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shipping_payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "shipping_payments_shipmentId_idx" ON "shipping_payments"("shipmentId");

-- CreateIndex
CREATE INDEX "shipping_payments_status_idx" ON "shipping_payments"("status");

-- AddForeignKey
ALTER TABLE "shipping_payments" ADD CONSTRAINT "shipping_payments_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "order_shipments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
