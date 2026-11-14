
import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("شروع پاک‌سازی داده‌های سفارش و ارسال...");
  const deletedOrders = await prisma.order.deleteMany({});

  console.log(
    `تعداد سفارش‌های حذف‌شده: ${deletedOrders.count}`,
  );


  const deletedParcelBatches =
    await prisma.domesticParcelBatch.deleteMany({});

  console.log(
    `تعداد DomesticParcelBatch های حذف‌شده: ${deletedParcelBatches.count}`,
  );

  console.log("پاک‌سازی با موفقیت انجام شد.");
}

main()
  .catch((error) => {
    console.error("خطا در پاک‌سازی:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
