import { NextFunction, Request, Response } from "express";
import { STATUS_CODES } from "../constants/statusCodes";
import {
  checkUserNameService,
  getUserProfileByIdService,
  profileService,
} from "../services/userService";

export const profileController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.file) {
      req.body.profileImage = req.file.filename;
    }
    // @ts-expect-error req.user-error userController
    const userDetails = await profileService(req.body, req.user.id);

    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Profile added Successfully.",
      data: userDetails,
    });
  } catch (error) {
    console.error("Error during Profile:", error);
    next(error);
  }
};

export const checkUserNameController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const checkUsernameAvailable = await checkUserNameService(
      req.body,
      // @ts-expect-error req.user-error userController
      req.user.id,
    );

    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Username is Available",
      data: checkUsernameAvailable,
    });
  } catch (error) {
    console.error("Error during check UserName:", error);
    next(error);
  }
};

export const getUserProfileByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // @ts-expect-error req.user-error userController
    const userDetails = await getUserProfileByIdService(req.user.id);

    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "User Available.",
      data: userDetails,
    });
  } catch (error) {
    console.error("Error during check UserName:", error);
    next(error);
  }
};
