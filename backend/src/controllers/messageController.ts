import { NextFunction, Request, Response } from "express";
import { STATUS_CODES } from "../constants/statusCodes";
import { getChatMessagesService } from "../services/messageService";

export const getChatMessagesController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const chatMessage = await getChatMessagesService(req.body);

    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Fetched chat messages successfully .",
      data: { chatMessage },
    });
  } catch (error) {
    console.error("Error during getChatMessagesController:", error);
    next(error);
  }
};
