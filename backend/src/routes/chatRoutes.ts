import { Router } from "express";
import { validateBody } from "../middlewares/validationMiddleware";
import {
  addGroupChatSchema,
  addIndividualChatSchema,
} from "../schemas/chatSchema";
import { authenticate } from "../middlewares/authMiddleware";
import {
  addGroupChatController,
  addIndividualChatController,
  getAllChatController,
  getChatController,
} from "../controllers/chatController";

const chatRouter = Router();

chatRouter.get("", authenticate, getAllChatController);

chatRouter.get("/:chatId", authenticate, getChatController);

chatRouter.post(
  "/individual-chat",
  authenticate,
  validateBody(addIndividualChatSchema),
  addIndividualChatController,
);

chatRouter.post(
  "/group-chat",
  authenticate,
  validateBody(addGroupChatSchema),
  addGroupChatController,
);

export default chatRouter;
