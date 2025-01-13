import { NextFunction, Request, Response } from "express";
import { STATUS_CODES } from "../constants/statusCodes";
import {
  forgotPasswordService,
  loginUserService,
  registerUserService,
  resendOtpService,
  resetPasswordService,
  verifyOtpService,
} from "../services/authService";
import { ResetPasswordTokenHasExpired } from "../errors/authError";

export const loginUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = await loginUserService(req.body);
    res
      .status(STATUS_CODES.OK)
      .json({ success: true, message: "Login successful", data: { token } });
  } catch (error) {
    console.error("Error during registration:", error);
    next(error);
  }
};

export const registerUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email } = req.body;

    // Register the user
    await registerUserService(req.body);

    res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: "Registration successful. OTP sent to email.",
      data: { email },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    next(error);
  }
};

export const verifyOtpController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Verify the OTP
    const token = await verifyOtpService(req.body);

    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "OTP Verified Successfully.",
      data: { token },
    });
  } catch (error) {
    console.error("Error during OTP verification:", error);
    next(error);
  }
};

export const resendOtpController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email } = req.body;

    await resendOtpService(email);

    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "OTP re-send to email successfully.",
      data: { email },
    });
  } catch (error) {
    console.error("Error during resend Otp:", error);
    next(error);
  }
};

export const forgotPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await forgotPasswordService(req.body);
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Reset Password Link has been successfully send to your Email.",
    });
  } catch (error) {
    console.error("Error during forgot Password:", error);
    next(error);
  }
};

export const resetPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await resetPasswordService(req.body);

    res.status(200).json({
      success: true,
      message: "Password reset successfully.",
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error during reset Password:", error.message);

    // Handle specific JWT expiration error
    if (error.message === "JWT verification failed: jwt expired") {
      return next(new ResetPasswordTokenHasExpired());
    }

    next(error);
  }
};
