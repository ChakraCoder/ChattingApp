import { z } from "zod";

export const addGroupChatSchema = z.object({
  isGroupChat: z.boolean().refine((val) => val === true, {
    message: "isGroupChat must be true for group chat creation",
  }),
  groupName: z
    .string()
    .min(1, "Group name is required")
    .max(100, "Group name is too long"),
  participants: z
    .array(z.string())
    .min(2, "At least two participants are required for a group chat"),
});
