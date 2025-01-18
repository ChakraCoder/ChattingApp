import { z } from "zod";

export const profileSchema = z.object({
  userName: z
    .string()
    .min(3, "User name is required and must be at least 3 characters long")
    .max(50, "User name must not exceed 50 characters")
    .trim()
    .optional(),
});

export const checkUserNameSchema = z.object({
  userName: z
    .string()
    .min(3, "User name is required and must be at least 3 characters long")
    .max(50, "User name must not exceed 50 characters")
    .regex(
      /^[a-zA-Z0-9_]*$/,
      "Username can only contain letters, numbers, and underscores",
    )
    .trim()
    .optional(),
});
