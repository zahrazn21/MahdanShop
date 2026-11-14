import { cookies } from "next/headers";
import { verifyToken } from "./jwt";
import { prisma } from "../prisma";

export async function getCurrentUser() {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  return prisma.user.findUnique({ where: { id: payload.userId } });
}