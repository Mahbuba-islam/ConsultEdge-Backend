import z from "zod";

export const toggleMessageReactionValidation = z.object({
  params: z.object({
    roomId: z.string().min(1, "roomId is required"),
    messageId: z.string().min(1, "messageId is required"),
  }),
  body: z.object({
    emoji: z.string().trim().min(1, "Emoji is required").max(32, "Emoji is too long"),
  }),
});