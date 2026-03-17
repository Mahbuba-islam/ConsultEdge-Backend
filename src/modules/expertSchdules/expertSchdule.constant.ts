import { Prisma } from "../../generated/client";

export const expertScheduleFilterableFields = [
  "expertId",
  "scheduleId",
  "isBooked",
  "isDeleted",
];

export const expertScheduleSearchableFields = ["expertId", "scheduleId"];

export const expertScheduleIncludeConfig: Prisma.ExpertScheduleInclude = {
  schedule: true,
  expert: {
    include: {
      user: true,
      industry: true,
    },
  },
  consultation: true,
};
