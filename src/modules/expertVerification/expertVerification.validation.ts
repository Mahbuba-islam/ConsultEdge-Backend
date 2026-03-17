import z from "zod";

export const verifyExpertValidationSchema = z.object({
  body: z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"])
  .refine((v) => !!v, { message: "Verification status is required" }),
notes: z.string().optional(),
  }),
});