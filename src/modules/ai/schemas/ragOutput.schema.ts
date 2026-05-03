import { z } from "zod";

export const ragSourceSchema = z.object({
  source_id: z.string().min(1),
  evidence: z.string().min(1),
});

export const ragResponseSchema = z.object({
  answer: z.string().min(1),
  reasoning: z.string().min(1),
  sources: z.array(ragSourceSchema),
  suggestions: z.array(z.string().min(1)).max(5),
});

export type RagResponse = z.infer<typeof ragResponseSchema>;
