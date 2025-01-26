import { NextFunction, Request, Response } from "express";
import { STATUS_CODES } from "../constants/statusCodes";
import { searchContactsService } from "../services/contactsService";

export const searchContactsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // @ts-expect-error req.user error
    req.body.userId = req.user.id;
    const users = await searchContactsService(req.body);

    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Searched Contacts Successfully.",
      data: { users },
    });
  } catch (error) {
    console.error("Error during searchContactsController:", error);
    next(error);
  }
};
