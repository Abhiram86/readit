import { SignJWT, jwtVerify } from "jose";
import { UserData } from "@/store/user";

const JWT_SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

/**
 * Create a JWT token
 * @param data - The user data to include in the token
 * @returns A signed JWT token
 */
export const createToken = async (data: UserData) => {
  return await new SignJWT(data)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(JWT_SECRET_KEY);
};

/**
 * Verify a JWT token
 * @param token - The JWT token to verify
 * @returns The decoded token payload if valid, otherwise null
 */
export const verifyToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET_KEY);
    return payload as UserData;
  } catch (err) {
    console.error("Token verification failed:", err);
    return null;
  }
};
