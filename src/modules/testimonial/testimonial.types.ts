export interface ICreateTestimonialPayload {
  rating: number;
  comment?: string;
  consultationId: string;
}

export interface IUpdateTestimonialPayload {
  rating?: number;
  comment?: string;
}