import { STATUS_CODES } from "../constants/statusCodes";
import { CustomError } from "./customError";

export class IndividualChatCreatedError extends CustomError {
  constructor() {
    super(
      "IndividualChatCreatedError",
      "Individual Chat Created.",
      STATUS_CODES.BAD_REQUEST,
    );
  }
}

export class FileSizeIsTooLarge extends CustomError {
  constructor() {
    super(
      "FileSizeIsTooLarge",
      "File is too large. Max size is 10MB.",
      STATUS_CODES.BAD_REQUEST,
    );
  }
}
