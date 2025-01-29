import { z } from "zod";

export const getChatMessagesSchema = z.object({
  chatId: z.string().trim(),
});
