import { NextFunction, Request, Response } from "express";
import { STATUS_CODES } from "../constants/statusCodes";
import {
  getChatMessagesService,
  readMessageService,
  uploadFileService,
} from "../services/messageService";

export const readMessageController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // @ts-expect-error req.user.id
    const userId = req.user.id;
    req.body.userId = userId;
    await readMessageService(req.body);

    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "message readed successfully .",
      // data: { chatMessage },
    });
  } catch (error) {
    console.error("Error during readMessageController:", error);
    next(error);
  }
};

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

export const uploadFileController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (req.file) {
      req.body.fileName = req.file.filename;
      req.body.mediaUrl = `/opt/render/uploads/files/${req.body.fileName}`;
    }
    const uploadFile = await uploadFileService(req.body);

    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "File Uploaded successfully .",
      data: { uploadFile },
    });
  } catch (error) {
    console.error("Error during uploadFileController:", error);
    next(error);
  }
};
