import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/shared/lib/auth/getCurrentUser";

export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "لطفاً ابتدا وارد حساب کاربری شوید" },
      { status: 401 },
    );
  }

  if (user.role !== "ADMIN") {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  return null;
}