import z from "zod";

export const verifyExpertValidationSchema = z.object({
  body: z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"])
  .refine((v) => !!v, { message: "Verification status is required" }),
notes: z.string().optional(),
  }),
});

export const reviewApplicationValidationSchema = z.object({
  body: z.object({
    status: z.enum(["APPROVED", "REJECTED"]),
    notes: z.string().max(1000).optional(),
  }),
  params: z.object({
    id: z.string().uuid("Application ID must be a valid UUID"),
  }),
});

export const applicationIdParamValidationSchema = z.object({
  params: z.object({
    id: z.string().uuid("Application ID must be a valid UUID"),
  }),
});

export const adminApplicationsListValidationSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    searchTerm: z.string().trim().optional(),
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
    industryId: z.string().uuid().optional(),
    reviewedBy: z.string().optional(),
    sortBy: z.enum(["createdAt", "updatedAt", "reviewedAt", "fullName"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
  }),
});

export const applicationResumeAccessValidationSchema = z.object({
  params: z.object({
    id: z.string().uuid("Application ID must be a valid UUID"),
  }),
  query: z.object({
    download: z.enum(["true", "false"]).optional(),
  }),
});