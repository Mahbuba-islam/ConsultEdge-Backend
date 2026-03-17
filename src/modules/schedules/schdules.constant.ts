import { Prisma } from "../../generated/client";

export const scheduleFilterableFields = [
  "id",
  "startDateTime",
  "endDateTime",
  "isDeleted",
];

export const scheduleSearchableFields = [
  "id",
  "startDateTime",
  "endDateTime",
];

export const scheduleIncludeConfig: Partial<
  Record<keyof Prisma.ScheduleInclude, Prisma.ScheduleInclude[keyof Prisma.ScheduleInclude]>
> = {
  expertSchedules: {
    include: {
      expert: {
        include: {
          user: true,
          industry: true,
        },
      },
      consultation: true,
    },
  },
};