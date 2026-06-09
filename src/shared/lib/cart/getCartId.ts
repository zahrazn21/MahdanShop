import { cookies } from "next/headers";

export async function getCartId() {
  const cookieStore = await cookies();
  return cookieStore.get("cartId")?.value;
}
