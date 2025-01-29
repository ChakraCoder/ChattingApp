import { NextFunction, Request, Response } from "express";
import { STATUS_CODES } from "../constants/statusCodes";
import {
  addGroupChatService,
  addIndividualChatService,
  getAllChatService,
} from "../services/chatService";

export const addIndividualChatController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const chat = await addIndividualChatService(req.body);

    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Individual Chat Added Successfully.",
      data: { chat },
    });
  } catch (error) {
    console.error("Error during addIndividualChatController:", error);
    next(error);
  }
};

export const addGroupChatController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const chat = await addGroupChatService(req.body);

    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Group Chat Added Successfully.",
      data: { chat },
    });
  } catch (error) {
    console.error("Error during addGroupChatController:", error);
    next(error);
  }
};

export const getAllChatController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // @ts-expect-error req.user.id
    const userId = req.user.id;
    const chat = await getAllChatService(userId);

    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Fetched All existing chat of user.",
      data: { chat },
    });
  } catch (error) {
    console.error("Error during getAllChatController:", error);
    next(error);
  }
};
