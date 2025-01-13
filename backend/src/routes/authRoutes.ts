import { Router } from "express";
import { validateBody } from "../middlewares/validationMiddleware";
import {
  forgotPasswordController,
  loginUserController,
  registerUserController,
  resendOtpController,
  resetPasswordController,
  verifyOtpController,
} from "../controllers/authController";

import {
  forgotPasswordSchema,
  loginUserSchema,
  registerUserSchema,
  resendOtpSchema,
  resetPasswordSchema,
  verifyOtpSchema,
} from "../schemas/authSchema";

const authRouter = Router();

authRouter.post("/login", validateBody(loginUserSchema), loginUserController);
authRouter.post(
  "/signup",
  validateBody(registerUserSchema),
  registerUserController,
);
authRouter.post(
  "/verify-otp",
  validateBody(verifyOtpSchema),
  verifyOtpController,
);
authRouter.post(
  "/resend-otp",
  validateBody(resendOtpSchema),
  resendOtpController,
);
authRouter.post(
  "/forgot-password",
  validateBody(forgotPasswordSchema),
  forgotPasswordController,
);

authRouter.post(
  "/reset-password",
  validateBody(resetPasswordSchema),
  resetPasswordController,
);

export default authRouter;
