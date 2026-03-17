export interface IBookConsultationPayload {
  expertId: string;
  expertScheduleId: string;
}

export interface IInitiatePaymentPayload {
  consultationId: string;
}