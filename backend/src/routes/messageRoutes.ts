import { Router } from "express";
import { validateBody } from "../middlewares/validationMiddleware";
import { authenticate } from "../middlewares/authMiddleware";
import {
  getChatMessagesController,
  readMessageController,
  uploadFileController,
} from "../controllers/messageController";
import { fileUploadMiddleware } from "../utils/uploadFileMulter";
import {
  getChatMessagesSchema,
  readMessageSchema,
} from "../schemas/messsageSchema";

const messagRouter = Router();

messagRouter.post(
  "/read-message",
  authenticate,
  validateBody(readMessageSchema),
  readMessageController,
);

messagRouter.post(
  "/",
  authenticate,
  validateBody(getChatMessagesSchema),
  getChatMessagesController,
);

messagRouter.post(
  "/upload-file",
  authenticate,
  fileUploadMiddleware,
  uploadFileController,
);
export default messagRouter;
