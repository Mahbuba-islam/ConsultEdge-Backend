import { z } from "zod";

export const createTestimonialSchema = z.object({
  body: z.object({
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
    consultationId: z.string().uuid(),
  }),
});

export const updateTestimonialSchema = z.object({
  body: z.object({
    rating: z.number().min(1).max(5).optional(),
    comment: z.string().optional(),
  }),
});