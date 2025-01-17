import { STATUS_CODES } from "../constants/statusCodes";
import { CustomError } from "./customError";

export class OnlyImageFileAreAllowed extends CustomError {
  constructor() {
    super(
      "OnlyImageFileAreAllowed",
      "Only Image File Are Allowed.",
      STATUS_CODES.BAD_REQUEST,
    );
  }
}
