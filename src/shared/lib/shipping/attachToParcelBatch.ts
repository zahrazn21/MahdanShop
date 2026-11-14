import { Prisma } from "@prisma/client";

import { getShippingTierCost } from "./calculateDomesticShipping";

const BATCH_CONSOLIDATION_DAYS = 7;

export async function attachToParcelBatch(
  tx: Prisma.TransactionClient,
  userId: string,
  volume: number,
): Promise<string> {
  if (!userId) {
    throw new Error("شناسه کاربر معتبر نیست");
  }

  if (!Number.isFinite(volume) || volume <= 0) {
    throw new Error("حجم ارسال داخلی باید بیشتر از صفر باشد");
  }

  const now = new Date();

  const batchCutoff = new Date(now);
  batchCutoff.setDate(
    batchCutoff.getDate() - BATCH_CONSOLIDATION_DAYS,
  );
  let batch = await tx.domesticParcelBatch.findFirst({
    where: {
      userId,
      status: "OPEN",
      createdAt: {
        gt: batchCutoff,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!batch) {
    const shippingCost = await getShippingTierCost(
      tx,
      volume,
    );

    const shippingDueAt = new Date(now);
    shippingDueAt.setDate(shippingDueAt.getDate() + 30);

    batch = await tx.domesticParcelBatch.create({
      data: {
        userId,
        status: "OPEN",
        totalVolume: volume,
        shippingCost,
        shippingDueAt,
      },
    });

    return batch.id;
  }

  const newTotalVolume = batch.totalVolume + volume;

  const newShippingCost = await getShippingTierCost(
    tx,
    newTotalVolume,
  );

  await tx.domesticParcelBatch.update({
    where: {
      id: batch.id,
    },
    data: {
      totalVolume: newTotalVolume,
      shippingCost: newShippingCost,
    },
  });

  return batch.id;
}