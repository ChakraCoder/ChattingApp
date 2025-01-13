import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

const SECRET_KEY = JWT_SECRET || "mySecretKeyIsHereAndIAmUsingIt";

export const generateToken = (
  id: string,
  expiresIn: string | undefined,
): string => {
  try {
    const payload = { id };
    return jwt.sign(payload, SECRET_KEY, { expiresIn: expiresIn });
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Error generating token");
  }
};
