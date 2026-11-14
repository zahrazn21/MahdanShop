import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;


export function signToken(payload: { userId: string; role: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  try {
    const result = jwt.verify(token, JWT_SECRET);


    return result as {
      userId: string;
      role: string;
    };

  } catch (err) {
    return null;
  }
}