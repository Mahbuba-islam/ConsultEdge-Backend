import { Prisma } from "../../generated/client";

export const bookingSearchableFields = [
  "client.user.name",
  "client.user.email",
  "expert.user.name",
  "expert.user.email",
  "videoCallId",
  "payment.transactionId",
];
export const bookingFilterableFields = [
  "status",
  "paymentStatus",
  "clientId",
  "expertId",
  "date",
  "createdAt",
];





export const bookingIncludeConfig = {
  client: {
    include: {
      user: true,
    },
  },
  expert: {
    include: {
      user: true,
    },
  },
  payment: true,
  expertSchedule: {
    include: {
      schedule: true,
    },
  },
  testimonial: true,
};
