-- CreateEnum
CREATE TYPE "ShippingPaymentMode" AS ENUM ('IMMEDIATE', 'DEFERRED');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "shippingPaymentMode" "ShippingPaymentMode" NOT NULL DEFAULT 'IMMEDIATE';
