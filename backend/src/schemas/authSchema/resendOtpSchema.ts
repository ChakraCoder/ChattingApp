import { z } from "zod";

export const resendOtpSchema = z.object({
  email: z.string().email("Invalid email format").trim(),
});
