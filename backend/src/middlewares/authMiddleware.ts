import { Request, Response, NextFunction } from "express";
import { STATUS_CODES } from "../constants/statusCodes";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.headers.authorization;

  if (!token) {
    res.status(STATUS_CODES.UNAUTHORIZED).json({ error: "Unauthorized" });
    return;
  }

  // Validate token (pseudo-code)
  // const user = validateToken(token);
  // if (!user) return res.status(STATUS_CODES.UNAUTHORIZED).json({ error: "Invalid token" });

  next();
};
