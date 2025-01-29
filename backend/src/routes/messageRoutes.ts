import { Router } from "express";
import { validateBody } from "../middlewares/validationMiddleware";
import { authenticate } from "../middlewares/authMiddleware";
import {
  getChatMessagesController,
  uploadFileController,
} from "../controllers/messageController";
import { fileUpload } from "../utils/uploadFileMulter";
import { getChatMessagesSchema } from "../schemas/messsageSchema";

const messagRouter = Router();

messagRouter.post(
  "/",
  authenticate,
  validateBody(getChatMessagesSchema),
  getChatMessagesController,
);

messagRouter.post(
  "/upload-file",
  authenticate,
  fileUpload.single("file"),
  uploadFileController,
);
export default messagRouter;
