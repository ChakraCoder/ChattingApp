import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { STATUS_CODES } from "../constants/statusCodes";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateBody = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next(); // If validation passes, proceed with the next middleware
    } catch (error) {
      console.error(error);

      if (error instanceof ZodError) {
        // Optimistic approach: Provide detailed error feedback, but allow the request to continue
        res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: "Validation failed, but the request continues.",
          errors: error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
        return;
      }

      next(error);
    }
  };
};
