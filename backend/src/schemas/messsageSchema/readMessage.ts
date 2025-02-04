import { z } from "zod";

export const readMessageSchema = z.object({
  chatId: z.string().trim(),
});
