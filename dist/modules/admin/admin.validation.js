import z from "zod";
const adminIdParamsSchema = z.object({
    id: z.string().uuid("Invalid admin id"),
});
export const updateAdminValidationSchema = z.object({
    params: adminIdParamsSchema,
    body: z
        .object({
        contactNumber: z.string().trim().min(1, "Contact number cannot be empty").optional(),
        profilePhoto: z.string().trim().min(1, "Profile photo cannot be empty").optional(),
    })
        .refine((value) => Object.keys(value).length > 0, {
        message: "At least one field is required for update",
    }),
});
export const adminIdValidationSchema = z.object({
    params: adminIdParamsSchema,
});
//# sourceMappingURL=admin.validation.js.map