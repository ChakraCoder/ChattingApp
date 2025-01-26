import { z } from "zod";

export const profileSchema = z.object({
  userName: z
    .string()
    .min(3, "User name must be at least 3 characters long")
    .max(50, "User name must not exceed 50 characters")
    .trim()
    .optional(),
});
