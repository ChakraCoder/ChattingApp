import { NextFunction, Request, Response } from "express";
import { STATUS_CODES } from "../constants/statusCodes";
import {
  getChatMessagesService,
  uploadFileService,
} from "../services/messageService";

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
      req.body.mediaUrl = `uploads/files/${req.body.fileName}`;
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
