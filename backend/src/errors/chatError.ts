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
