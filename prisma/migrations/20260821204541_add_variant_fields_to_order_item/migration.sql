-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "variantName" TEXT,
ADD COLUMN     "variantSize" TEXT,
ADD COLUMN     "variantVolume" DOUBLE PRECISION,
ADD COLUMN     "variantVolumeUnit" TEXT;
