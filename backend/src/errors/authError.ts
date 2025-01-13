import { STATUS_CODES } from "../constants/statusCodes";
import { CustomError } from "./customError";

export class OtpExpiredError extends CustomError {
  constructor() {
    super("OtpExpiredError", "OTP has Expired.", STATUS_CODES.BAD_REQUEST);
  }
}

export class OtpInvalidError extends CustomError {
  constructor() {
    super("OtpInvalidError", "Invalid OTP.", STATUS_CODES.BAD_REQUEST);
  }
}

export class UserNotFoundError extends CustomError {
  constructor() {
    super("UserNotFoundError", "User not Found.", STATUS_CODES.NOT_FOUND);
  }
}

export class EmailAlreadyExistError extends CustomError {
  constructor() {
    super(
      "EmailAlreadyExistError",
      "This email is already registered.",
      STATUS_CODES.CONFLICT,
    );
  }
}

export class FailedToSendOtpError extends CustomError {
  constructor() {
    super(
      "FailedToSendOtpError",
      "Failed to send OTP.",
      STATUS_CODES.INTERNAL_SERVER_ERROR,
    );
  }
}

export class InvalidEmailPasswordError extends CustomError {
  constructor() {
    super(
      "InvalidEmailPasswordError",
      "Email or Password is Invalid.",
      STATUS_CODES.BAD_REQUEST,
    );
  }
}

export class UserNotVerifiedError extends CustomError {
  constructor() {
    super(
      "UserNotVerifiedError",
      "User is not Verified.",
      STATUS_CODES.BAD_REQUEST,
    );
  }
}

export class UserNameAlreadyExistError extends CustomError {
  constructor() {
    super(
      "UserNameAlreadyExistError",
      "Username already Exists.",
      STATUS_CODES.CONFLICT,
    );
  }
}

export class FailedToSendResetPasswordEmail extends CustomError {
  constructor() {
    super(
      "FailedToSendResetPasswordEmail",
      "Failed to Send Reset Password Email.",
      STATUS_CODES.BAD_REQUEST,
    );
  }
}

export class ResetPasswordTokenHasExpired extends CustomError {
  constructor() {
    super(
      "ResetPasswordTokenHasExpired",
      "Your reset link has expired. Please request a new one to reset your password.",
      STATUS_CODES.BAD_REQUEST,
    );
  }
}
