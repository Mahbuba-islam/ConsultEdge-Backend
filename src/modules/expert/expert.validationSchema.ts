import z from "zod";

export const updateExpertValidationSchema = z.object({
  body: z.object({
    fullName: z.string().optional(),
    email: z.string().email("Invalid email format").optional(),
    profilePhoto: z.string().url("Invalid URL format").optional(),
    phone: z.string().optional(),
    bio: z.string().optional(),
    title: z.string().optional(),
    experience: z.number().int().nonnegative().optional(),
    price: z.number().int().positive("Price must be positive").optional(),
    industryId: z.string().uuid("Industry ID must be a valid UUID").optional(),
  }),
});

