import httpStatus from "http-status";
import {
  IAssignExpertSchedulePayload,
  IPublishExpertSchedulePayload,
  IUpdateExpertSchedulePayload,
} from "./expertSchdules.interface";
import { prisma } from "../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import { ExpertSchedule, Prisma, Role } from "../../generated/client";
import { QueryBuilder } from "../../utilis/queryBuilder";
import { expertScheduleFilterableFields, expertScheduleIncludeConfig, expertScheduleSearchableFields } from "./expertSchdule.constant";
import { IqueryParams } from "../../interfaces/query.interface";

const getActiveExpertByUserId = async (userId: string) => {
  const expert = await prisma.expert.findUnique({
    where: { userId },
  });

  if (expert && !expert.isDeleted) {
    return expert;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (user?.role === Role.EXPERT) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Your account role is EXPERT, but your expert profile is missing or inactive. Please complete expert profile setup first."
    );
  }

  throw new AppError(
    httpStatus.FORBIDDEN,
    "Only expert accounts can manage availability schedules"
  );
};



// ===============================
// ASSIGN SCHEDULES TO EXPERT
// ===============================
const assignExpertSchedules = async (
  userId: string,
  payload: IAssignExpertSchedulePayload
) => {
  const expert = await getActiveExpertByUserId(userId);

  const created: ExpertSchedule[] = [];

  for (const scheduleId of payload.scheduleIds) {
    const schedule = await prisma.schedule.findFirst({
      where: { id: scheduleId, isDeleted: false },
    });

    if (!schedule)
      throw new AppError(
        httpStatus.NOT_FOUND,
        `Schedule not found: ${scheduleId}`
      );

    const exists = await prisma.expertSchedule.findUnique({
      where: {
        expertId_scheduleId: {
          expertId: expert.id,
          scheduleId,
        },
      },
    });

    if (exists?.isDeleted) {
      const restored = await prisma.expertSchedule.update({
        where: {
          expertId_scheduleId: {
            expertId: expert.id,
            scheduleId,
          },
        },
        data: {
          isDeleted: false,
          deletedAt: null,
          isPublished: true,
        },
      });

      created.push(restored);
      continue;
    }

    if (!exists) {
      const mapping = await prisma.expertSchedule.create({
        data: {
          expertId: expert.id,
          scheduleId,
          isPublished: true,
        },
      });

      created.push(mapping);
    }
  }

  return created;
};

// ===============================
// GET MY EXPERT SCHEDULES
// ===============================
const getMyExpertSchedules = async (userId: string, query: IqueryParams) => {
  const expert = await getActiveExpertByUserId(userId);

  const qb = new QueryBuilder<
    ExpertSchedule,
    Prisma.ExpertScheduleWhereInput,
    Prisma.ExpertScheduleInclude
  >(
    prisma.expertSchedule,
    { expertId: expert.id, isDeleted: false, ...query },
    {
      filterableFields: expertScheduleFilterableFields,
      searchableFields: expertScheduleSearchableFields,
    }
  );

  return await qb
    .search()
    .filter()
    .paginate()
    .dynamicInclude(expertScheduleIncludeConfig)
    .sort()
    .fields()
    .excute();
};





// ===============================
// UPDATE MY EXPERT SCHEDULES
// ===============================
const updateMyExpertSchedules = async (
  userId: string,
  payload: IUpdateExpertSchedulePayload
) => {
  const expert = await getActiveExpertByUserId(userId);

  const deleteIds = payload.scheduleIds
    .filter((s) => s.shouldDelete)
    .map((s) => s.id);

  const createIds = payload.scheduleIds
    .filter((s) => !s.shouldDelete)
    .map((s) => s.id);

  await prisma.$transaction(async (tx) => {
    if (deleteIds.length) {
      await tx.expertSchedule.updateMany({
        where: {
          expertId: expert.id,
          scheduleId: { in: deleteIds },
          isBooked: false,
          isDeleted: false,
        },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      });
    }

    if (createIds.length) {
      for (const scheduleId of createIds) {
        await tx.expertSchedule.upsert({
          where: {
            expertId_scheduleId: {
              expertId: expert.id,
              scheduleId,
            },
          },
          update: {
            isDeleted: false,
            deletedAt: null,
          },
          create: {
            expertId: expert.id,
            scheduleId,
            isPublished: true,
          },
        });
      }
    }
  });

  return { success: true };
};

// ===============================
// PUBLISH / UNPUBLISH MY SCHEDULES
// ===============================
const publishMyExpertSchedules = async (
  userId: string,
  payload: IPublishExpertSchedulePayload
) => {
  const expert = await getActiveExpertByUserId(userId);

  const schedules = await prisma.expertSchedule.findMany({
    where: {
      expertId: expert.id,
      scheduleId: { in: payload.scheduleIds },
      isDeleted: false,
    },
    select: { id: true, scheduleId: true },
  });

  if (schedules.length !== payload.scheduleIds.length) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "One or more schedule mappings were not found for this expert"
    );
  }

  const result = await prisma.expertSchedule.updateMany({
    where: {
      expertId: expert.id,
      scheduleId: { in: payload.scheduleIds },
      isDeleted: false,
    },
    data: {
      isPublished: payload.isPublished,
    },
  });

  return {
    success: true,
    updatedCount: result.count,
    isPublished: payload.isPublished,
  };
};

// ===============================
// GET PUBLISHED SCHEDULES BY EXPERT
// ===============================
const getPublishedExpertSchedules = async (expertId: string) => {
  const expert = await prisma.expert.findFirst({
    where: {
      id: expertId,
      isDeleted: false,
    },
    select: { id: true },
  });

  if (!expert) {
    throw new AppError(httpStatus.NOT_FOUND, "Expert not found");
  }

  const now = new Date();

  const schedules = await prisma.expertSchedule.findMany({
    where: {
      expertId,
      isDeleted: false,
      isBooked: false,
      isPublished: true,
      schedule: {
        isDeleted: false,
        startDateTime: { gt: now },
      },
    },
    include: {
      schedule: true,
      expert: {
        include: {
          user: true,
          industry: true,
        },
      },
    },
    orderBy: {
      schedule: {
        startDateTime: "asc",
      },
    },
  });

  return schedules;
};

// ===============================
// DELETE MY EXPERT SCHEDULE
// ===============================
const deleteMyExpertSchedule = async (userId: string, scheduleId: string) => {
  const expert = await getActiveExpertByUserId(userId);

  const existing = await prisma.expertSchedule.findUnique({
    where: {
      expertId_scheduleId: {
        expertId: expert.id,
        scheduleId,
      },
    },
  });

  if (!existing || existing.isDeleted)
    throw new AppError(httpStatus.NOT_FOUND, "Expert schedule not found");

  if (existing.isBooked)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cannot delete a booked schedule"
    );

  await prisma.expertSchedule.update({
    where: {
      expertId_scheduleId: {
        expertId: expert.id,
        scheduleId,
      },
    },
    data: {
      isDeleted: true,
      isPublished: false,
      deletedAt: new Date(),
    },
  });

  return { success: true };
};

export const expertScheduleService = {
  assignExpertSchedules,
  getMyExpertSchedules,
  updateMyExpertSchedules,
  deleteMyExpertSchedule,
  publishMyExpertSchedules,
  getPublishedExpertSchedules,
};