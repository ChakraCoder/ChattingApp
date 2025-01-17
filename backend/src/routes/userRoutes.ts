import express from "express";
import {
  checkUserNameController,
  getUserProfileByIdController,
  profileController,
} from "../controllers/userController";
import { validateBody } from "../middlewares/validationMiddleware";
import { checkUserNameSchema, profileSchema } from "../schemas/userSchema";
import { profileImageUpload } from "../utils";
import { authenticate } from "../middlewares/authMiddleware";

const userRouter = express.Router();

// Routes for user operations
userRouter.get("/user", authenticate, getUserProfileByIdController);

userRouter.post(
  "/update-profile",
  authenticate,
  profileImageUpload.single("profileImage"),
  validateBody(profileSchema),
  profileController,
);
userRouter.post(
  "/check-username",
  authenticate,
  validateBody(checkUserNameSchema),
  checkUserNameController,
);
export default userRouter;
