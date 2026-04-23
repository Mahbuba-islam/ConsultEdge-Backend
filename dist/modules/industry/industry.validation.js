import z from "zod";
const industryBodySchema = z.object({
    name: z.string().trim().min(2, "Industry name is too short"),
    description: z.string().trim().optional(),
    icon: z.string().trim().url("Invalid icon URL").optional(),
});
const industryIdParamsSchema = z.object({
    id: z.string().uuid("Invalid industry id"),
});
export const createIndustryValidation = z.object({
    body: industryBodySchema,
});
export const updateIndustryValidation = z.object({
    params: industryIdParamsSchema,
    body: industryBodySchema.partial(),
});
export const industryIdValidation = z.object({
    params: industryIdParamsSchema,
});
//# sourceMappingURL=industry.validation.js.map