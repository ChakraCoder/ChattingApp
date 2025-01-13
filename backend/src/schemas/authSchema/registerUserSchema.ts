import { z } from "zod";

export const registerUserSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name is required and must be at least 2 characters long")
    .trim(),
  lastName: z
    .string()
    .min(2, "Last name is required and must be at least 2 characters long")
    .trim(),
  email: z.string().email("Invalid email format").trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[@$!%*?&]/, "Password must contain at least one special character")
    .trim(),
});