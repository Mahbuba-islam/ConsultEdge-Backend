import { ReviewStatus } from "../../generated/enums";

export interface ICreateTestimonialPayload {
  rating: number;
  comment?: string;
  consultationId: string;
}

export interface IUpdateTestimonialPayload {
  rating?: number;
  comment?: string;
}

export interface IReplyToTestimonialPayload {
  expertReply: string;
}

export interface IUpdateReviewStatusPayload {
  status: ReviewStatus;
}