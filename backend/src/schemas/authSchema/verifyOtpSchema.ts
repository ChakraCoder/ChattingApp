import { z } from "zod";

export const verifyOtpSchema = z.object({
  email: z.string().email("Invalid email format").trim(),
  otp: z
    .number()
    .min(1000, "OTP must be a 4-digit number")
    .max(9999, "OTP must be a 4-digit number"),
});
