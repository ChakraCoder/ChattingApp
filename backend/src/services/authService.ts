import { User } from "@prisma/client";
import { prisma } from "../config/db";
import { checkIfUserExists } from "./userService";
import { sendOtpEmail, sendResetPasswordEmail } from "./emailService";
import { JWT_EXPIRY, JWT_RESET_PASSWORD_EXPIRY } from "../config";
import {
  hashPassword,
  comparePassword,
  generateToken,
  generateRandomNumber,
  verifyToken,
} from "../utils";

import {
  EmailAlreadyExistError,
  FailedToSendOtpError,
  FailedToSendResetPasswordEmail,
  InvalidEmailPasswordError,
  OtpExpiredError,
  OtpInvalidError,
  // UserNameAlreadyExistError,
  UserNotFoundError,
  UserNotVerifiedError,
} from "../errors/authError";

export const loginUserService = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, password: true, isVerify: true },
  });

  if (!user) {
    throw new InvalidEmailPasswordError();
  }

  // Check if the password is valid
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new InvalidEmailPasswordError();
  }

  // Check if the user is verified
  if (!user.isVerify) {
    throw new UserNotVerifiedError();
  }

  // Generate a JWT token upon successful login
  return generateToken(user.id, JWT_EXPIRY);
};

export const registerUserService = async ({
  firstName,
  lastName,
  email,
  password,
}: User) => {
  // Check if user exist
  const userExists = await checkIfUserExists(email);
  if (userExists) {
    throw new EmailAlreadyExistError();
  }

  // // Check if username exist
  // const userNameExists = await checkIfUserNameExists(userName);
  // if (userNameExists) {
  //   throw new UserNameAlreadyExistError();
  // }

  // Generate OTP and send it
  const otp = generateRandomNumber(4);
  const otpSent = await sendOtpEmail(email, otp);
  if (!otpSent) {
    throw new FailedToSendOtpError();
  }

  const hashedPassword = await hashPassword(password);
  const otpExpiry = new Date().getTime() + 5 * 60 * 1000;

  await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      isVerify: false,
      otp,
      otpExpiry,
    },
  });
};

export const verifyOtpService = async ({
  email,
  otp,
}: {
  email: string;
  otp: number;
}) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, otp: true, otpExpiry: true },
  });

  if (!user) {
    throw new UserNotFoundError();
  }

  if (!user.otp) {
    throw new OtpInvalidError();
  }

  // Check if the OTP has expired
  const currentTime = new Date().getTime();
  if (user.otpExpiry && currentTime > user.otpExpiry) {
    throw new OtpExpiredError();
  }

  // Check if the OTP is invalid
  if (otp !== user.otp) {
    throw new OtpInvalidError();
  }

  // Clear OTP after successful verification
  await prisma.user.update({
    where: { email },
    data: { isVerify: true, otp: null, otpExpiry: null },
  });

  return generateToken(user.id, JWT_EXPIRY);
};

export const resendOtpService = async (email: string) => {
  // Check if user not exist
  const userExists = await checkIfUserExists(email);
  if (!userExists) {
    throw new UserNotFoundError();
  }

  // Generate OTP and send it
  const otp = generateRandomNumber(4);
  const otpSent = await sendOtpEmail(email, otp);
  if (!otpSent) {
    throw new FailedToSendOtpError();
  }

  const otpExpiry = new Date().getTime() + 5 * 60 * 1000;

  await prisma.user.update({
    where: { email },
    data: { otp, otpExpiry },
  });
};

export const forgotPasswordService = async ({ email }: { email: string }) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!user) {
    throw new UserNotFoundError();
  }

  const token = generateToken(user.id, JWT_RESET_PASSWORD_EXPIRY);

  // Send the reset token to the user's email
  const emailSent = await sendResetPasswordEmail(email, token);

  if (!emailSent) {
    throw new FailedToSendResetPasswordEmail();
  }
};

export const resetPasswordService = async ({
  token,
  newPassword,
}: {
  token: string;
  newPassword: string;
}) => {
  // Use the utility to verify the token
  const decodedToken = verifyToken<{ id: string }>(token);

  // Remaining logic
  const user = await prisma.user.findUnique({
    where: { id: decodedToken.id },
    select: { id: true },
  });

  if (!user) {
    throw new UserNotFoundError();
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
    },
  });

  return true;
};
