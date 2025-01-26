import { z } from "zod";

export const searchContactSchema = z.object({
  searchTerm: z
    .string()
    .max(50, "User name must not exceed 50 characters")
    .trim(),
});
