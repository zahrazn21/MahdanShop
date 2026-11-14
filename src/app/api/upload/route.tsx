import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { requireAdmin } from "@/src/shared/lib/auth/requireAdmin";

const MAX_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
};

export async function POST(req: Request) {
  try {
    const denied = await requireAdmin();

    if (denied) {
      return denied;
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "هیچ فایلی آپلود نشده است" },
        { status: 400 },
      );
    }

    const ext = ALLOWED_TYPES[file.type];

    if (!ext) {
      return NextResponse.json(
        { error: "فرمت تصویر مجاز نیست" },
        { status: 400 },
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "حجم فایل نباید بیشتر از 5 مگابایت باشد" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadDir = path.join(process.cwd(), "public", "uploads");

    await mkdir(uploadDir, { recursive: true });

    const filename = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${ext}`;

    await writeFile(path.join(uploadDir, filename), buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/${filename}`,
      filename,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return NextResponse.json(
      { success: false, error: "خطا در آپلود فایل" },
      { status: 500 },
    );
  }
}