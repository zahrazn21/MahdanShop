-- AlterTable
ALTER TABLE "shipping_payments" ADD COLUMN     "adminDeletedAt" TIMESTAMP(3),
ADD COLUMN     "userDeletedAt" TIMESTAMP(3);
