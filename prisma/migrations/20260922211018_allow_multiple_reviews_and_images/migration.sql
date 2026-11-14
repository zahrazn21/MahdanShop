/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `reviews` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "reviews_userId_productId_key";

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "imageUrl",
ADD COLUMN     "imageUrls" TEXT[] DEFAULT ARRAY[]::TEXT[];
