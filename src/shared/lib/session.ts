
import { getCurrentUser } from "./auth/getCurrentUser";
export async function getCurrentUserId(): Promise<string | null> {
  const user = await getCurrentUser();
  return user?.id ?? null;
}