import z from "zod";

export const bookConsultationValidation = z.object({
  body: z.object({
    expertId: z.string().uuid("Invalid expert id"),
    expertScheduleId: z.string().uuid("Invalid expert schedule id"),
  }),
});

export const initiateConsultationPaymentValidation = z.object({
  params: z.object({
    consultationId: z.string().uuid("Invalid consultation id"),
  }),
});