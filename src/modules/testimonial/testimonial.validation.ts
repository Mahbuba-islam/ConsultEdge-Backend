import { z } from "zod";

export const createTestimonialSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  consultationId: z.string().uuid(),
});

export const updateTestimonialSchema = z.object({
  body: z.object({
    rating: z.number().min(1).max(5).optional(),
    comment: z.string().optional(),
  }),
});

export const replyToTestimonialSchema = z.object({
  body: z.object({
    expertReply: z.string().trim().min(1, "Reply is required"),
  }),
});

export const updateReviewStatusSchema = z.object({
  body: z.object({
    status: z.enum(["APPROVED", "HIDDEN"]),
  }),
});