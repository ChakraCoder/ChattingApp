import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { STATUS_CODES } from "../constants/statusCodes";
import { JWT_SECRET } from "../config";

// Secret key for JWT (You can store it in an environment variable)
const SECRET_KEY = JWT_SECRET;

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.headers.authorization?.split(" ")[1]; // Get the token from "Authorization: Bearer <token>"

  if (!token) {
    res.status(STATUS_CODES.UNAUTHORIZED).json({ error: "Unauthorized" });
    return;
  }

  try {
    // Validate and decode the token using jwt.verify
    const decoded = jwt.verify(token, SECRET_KEY);

    // @ts-expect-error req.user error
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Token validation failed:", error);
    res.status(STATUS_CODES.UNAUTHORIZED).json({ error: "Invalid token" });
  }
};
