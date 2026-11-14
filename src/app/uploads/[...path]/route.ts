import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;

  const filePath = path.join(UPLOAD_ROOT, ...segments);

  if (!filePath.startsWith(UPLOAD_ROOT + path.sep)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const contentType = MIME_TYPES[path.extname(filePath).toLowerCase()];

  if (!contentType) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const file = await fs.readFile(filePath);

    return new NextResponse(new Uint8Array(file), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}