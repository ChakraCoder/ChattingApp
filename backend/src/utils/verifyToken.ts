import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { JWT_SECRET } from "../config";

export const verifyToken = <T = JwtPayload>(token: string): T => {
  try {
    const secret: Secret = JWT_SECRET || "mySecretKeyIsHereAndIAmUsingIt";
    const decoded = jwt.verify(token, secret) as T;
    return decoded;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`JWT verification failed: ${error.message}`);
    }
    throw new Error("Unexpected error during JWT verification.");
  }
};
