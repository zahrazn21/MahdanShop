import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET
);

export async function verifyMiddlewareToken(token: string) {
  try {
    const { payload } = await jwtVerify(
      token,
      JWT_SECRET
    );

    return payload as {
      userId: string;
      role: string;
    };

  } catch (error) {
    return null;
  }
}