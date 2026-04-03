import z from "zod";

export const createIndustryValidation = z.object({
  name: z.string().min(2, "Industry name is too short"),
  description: z.string().optional(),
  icon: z.string().url("Invalid icon URL").optional(),
});


export const updateIndustryValidation = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().url("Invalid icon URL").optional(),
});
