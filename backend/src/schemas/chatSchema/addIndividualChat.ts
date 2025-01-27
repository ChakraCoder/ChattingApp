import { z } from "zod";

// Schema to validate data for adding an individual (one-on-one) chat
export const addIndividualChatSchema = z.object({
  isGroupChat: z.boolean().refine((val) => val === false, {
    message: "isGroupChat must be false for individual chat creation",
  }),
  participants: z
    .array(z.string())
    .length(2, "Exactly two participants are required for an individual chat"),
});
