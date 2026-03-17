import z from "zod";

export const assignExpertScheduleValidation = z.object({
  body: z.object({
    scheduleIds: z.array(z.string().uuid("Invalid schedule ID")),
  }),
});

export const updateExpertScheduleValidation = z.object({
  body: z.object({
    scheduleIds: z.array(
      z.object({
        id: z.string().uuid("Invalid schedule ID"),
        shouldDelete: z.boolean(),
      })
    ),
  }),
});