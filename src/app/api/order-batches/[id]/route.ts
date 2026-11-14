
import { prisma } from "@/src/shared/lib/prisma";
import { getCurrentUser } from "@/src/shared/lib/auth/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

const VALID_BATCH_STATUSES = ["OPEN", "CLOSED"] as const;

type BatchStatus = (typeof VALID_BATCH_STATUSES)[number];

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "احراز هویت انجام نشده است" },
        { status: 401 },
      );
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "دسترسی غیرمجاز" },
        { status: 403 },
      );
    }

    const { id } = await context.params;

    const body = await req.json().catch(() => ({}));

    const {
      batchNumber,
      title,
      estimatedFreightPerKg,
      status,
    } = body ?? {};

    const existingBatch = await prisma.orderBatch.findUnique({
      where: { id },
    });

    if (!existingBatch) {
      return NextResponse.json(
        { error: "دوره پیدا نشد" },
        { status: 404 },
      );
    }

    if (title !== undefined) {
      if (!title || !String(title).trim()) {
        return NextResponse.json(
          { error: "عنوان دوره را وارد کنید" },
          { status: 400 },
        );
      }
    }


    if (batchNumber !== undefined) {
      const parsedBatchNumber = Number(batchNumber);

      if (
        batchNumber === null ||
        batchNumber === "" ||
        Number.isNaN(parsedBatchNumber)
      ) {
        return NextResponse.json(
          { error: "شماره دوره نامعتبر است" },
          { status: 400 },
        );
      }

      if (parsedBatchNumber !== existingBatch.batchNumber) {
        const duplicate = await prisma.orderBatch.findUnique({
          where: {
            batchNumber: parsedBatchNumber,
          },
        });

        if (duplicate) {
          return NextResponse.json(
            {
              error: "دوره‌ای با این شماره قبلاً ثبت شده است",
            },
            { status: 409 },
          );
        }
      }
    }
    let normalizedStatus: BatchStatus | undefined;

    if (status !== undefined) {
      if (
        typeof status !== "string" ||
        !VALID_BATCH_STATUSES.includes(status as BatchStatus)
      ) {
        return NextResponse.json(
          {
            error: "وضعیت دوره نامعتبر است. وضعیت باید OPEN یا CLOSED باشد",
          },
          { status: 400 },
        );
      }

      normalizedStatus = status as BatchStatus;
    }
    let normalizedFreight: number | null | undefined;

    if (estimatedFreightPerKg !== undefined) {
      if (
        estimatedFreightPerKg === "" ||
        estimatedFreightPerKg === null
      ) {
        normalizedFreight = null;
      } else {
        const freight = Number(estimatedFreightPerKg);

        if (Number.isNaN(freight) || freight < 0) {
          return NextResponse.json(
            {
              error: "هزینه حمل نامعتبر است",
            },
            { status: 400 },
          );
        }

        normalizedFreight = freight;
      }
    }

    // -----------------------------
    // بروزرسانی دوره
    // -----------------------------

    const batch = await prisma.orderBatch.update({
      where: {
        id,
      },

      data: {
        ...(batchNumber !== undefined
          ? {
              batchNumber: Number(batchNumber),
            }
          : {}),

        ...(title !== undefined
          ? {
              title: String(title).trim(),
            }
          : {}),

        ...(estimatedFreightPerKg !== undefined
          ? {
              estimatedFreightPerKg: normalizedFreight,
            }
          : {}),

        ...(normalizedStatus !== undefined
          ? {
              status: normalizedStatus,
            }
          : {}),
      },
    });

    return NextResponse.json({
      success: true,
      batch,
    });
  } catch (error) {
    console.error(
      "PATCH /api/order-batches/[id] ERROR:",
      error,
    );

    return NextResponse.json(
      {
        error: "خطا در ویرایش دوره",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  context: RouteContext,
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "احراز هویت انجام نشده است" },
        { status: 401 },
      );
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "دسترسی غیرمجاز" },
        { status: 403 },
      );
    }

    const { id } = await context.params;

    const existingBatch = await prisma.orderBatch.findUnique({
      where: { id },
    });

    if (!existingBatch) {
      return NextResponse.json(
        { error: "دوره پیدا نشد" },
        { status: 404 },
      );
    }

    const [productsCount, shipmentsCount] = await Promise.all([
      prisma.product.count({
        where: {
          batchId: id,
        },
      }),

      prisma.orderShipment.count({
        where: {
          batchId: id,
        },
      }),
    ]);

    if (productsCount > 0 || shipmentsCount > 0) {
      return NextResponse.json(
        {
          error: `این دوره قابل حذف نیست چون ${productsCount} محصول و ${shipmentsCount} مرسوله به آن متصل است`,
        },
        { status: 409 },
      );
    }

    await prisma.orderBatch.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "DELETE /api/order-batches/[id] ERROR:",
      error,
    );

    return NextResponse.json(
      {
        error: "خطا در حذف دوره",
      },
      { status: 500 },
    );
  }
}

