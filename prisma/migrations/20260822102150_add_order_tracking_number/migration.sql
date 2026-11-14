/*
  Warnings:

  - You are about to drop the column `trackingNumber` on the `payments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "trackingNumber" TEXT;

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "trackingNumber";
