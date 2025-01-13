import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { STATUS_CODES } from "../constants/statusCodes";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateBody = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          error: error.errors.map((e) => e.message).join(", "),
        });
        return;
      }
      next(error);
    }
  };
};
