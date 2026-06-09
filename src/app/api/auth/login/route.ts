import { prisma } from "@/src/app/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { mergeCart } from "@/src/app/lib/cart/mergeCart";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 🟢 اینجا cart merge میشه
    const cookieStore = await cookies();
    const cartId = cookieStore.get("cartId")?.value;

    if (cartId) {
      await mergeCart(user.id, cartId);

      // optional: پاک کردن cartId بعد از merge
      cookieStore.delete("cartId");
    }

    return NextResponse.json({
      message: "Login success",
      userId: user.id,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}