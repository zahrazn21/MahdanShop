

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

import { computeStockAndAvailability } from "../src/shared/lib/productAvailability";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      stock: true,
      isAvailable: true,
      availabilityType: true,
      variants: true,
    },
  });
  for (const product of products) {
    const variants = Array.isArray(product.variants)
      ? (product.variants as unknown as { stock?: number | string | null }[])
      : null;

    const { stock, isAvailable } = computeStockAndAvailability({
      availabilityType:
        product.availabilityType === "PRE_ORDER" ? "PRE_ORDER" : "IN_STOCK",
      baseStock: product.stock,
      variants,
    });

    const needsFix =
      stock !== product.stock || isAvailable !== product.isAvailable;

    if (!needsFix) {
      continue;
    }
    await prisma.product.update({
      where: { id: product.id },
      data: { stock, isAvailable },
    });

  }

}

main()
  .catch((error) => {
    console.error("❌ خطا در اجرای اسکریپت:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
