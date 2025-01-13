import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/customError";
import { STATUS_CODES } from "../constants/statusCodes";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.error(error.stack);

  if (error instanceof CustomError) {
    res.status(error.statusCode).json({
      success: false,
      error: error.message,
    });
    return;
  }

  // Fallback for unexpected errors
  res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: "Internal Server Error",
  });
};
