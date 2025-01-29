import { Router } from "express";
import { validateBody } from "../middlewares/validationMiddleware";
import { authenticate } from "../middlewares/authMiddleware";
import { getChatMessagesSchema } from "../schemas/chatSchema/getChatMessages";
import { getChatMessagesController } from "../controllers/messageController";

const messagRouter = Router();

messagRouter.post(
  "/",
  authenticate,
  validateBody(getChatMessagesSchema),
  getChatMessagesController,
);

export default messagRouter;
