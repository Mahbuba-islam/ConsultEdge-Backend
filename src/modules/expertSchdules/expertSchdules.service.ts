import httpStatus from "http-status";
import { IAssignExpertSchedulePayload, IUpdateExpertSchedulePayload } from "./expertSchdules.interface";
import { prisma } from "../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import { ExpertSchedule, Prisma } from "../../generated/client";
import { QueryBuilder } from "../../utilis/queryBuilder";
import { expertScheduleFilterableFields, expertScheduleIncludeConfig, expertScheduleSearchableFields } from "./expertSchdule.constant";
import { IqueryParams } from "../../interfaces/query.interface";



// ===============================
// ASSIGN SCHEDULES TO EXPERT
// ===============================
const assignExpertSchedules = async (
  userId: string,
  payload: IAssignExpertSchedulePayload
) => {
  const expert = await prisma.expert.findFirst({
    where: { userId, isDeleted: false },
  });

  if (!expert) throw new AppError(httpStatus.NOT_FOUND, "Expert not found");

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

    if (!exists) {
      const mapping = await prisma.expertSchedule.create({
        data: {
          expertId: expert.id,
          scheduleId,
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
  const expert = await prisma.expert.findFirst({
    where: { userId, isDeleted: false },
  });

  if (!expert) throw new AppError(httpStatus.NOT_FOUND, "Expert not found");

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
// GET ALL EXPERT SCHEDULES (ADMIN)
// ===============================
const getAllExpertSchedules = async (query: IqueryParams) => {
  const qb = new QueryBuilder<
    ExpertSchedule,
    Prisma.ExpertScheduleWhereInput,
    Prisma.ExpertScheduleInclude
  >(prisma.expertSchedule, { isDeleted: false, ...query }, {
    filterableFields: expertScheduleFilterableFields,
    searchableFields: expertScheduleSearchableFields,
  });

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
// GET EXPERT SCHEDULE BY ID
// ===============================
const getExpertScheduleById = async (expertId: string, scheduleId: string) => {
  const mapping = await prisma.expertSchedule.findUnique({
    where: {
      expertId_scheduleId: {
        expertId,
        scheduleId,
      },
    },
    include: expertScheduleIncludeConfig,
  });

  if (!mapping || mapping.isDeleted)
    throw new AppError(httpStatus.NOT_FOUND, "Expert schedule not found");

  return mapping;
};

// ===============================
// UPDATE MY EXPERT SCHEDULES
// ===============================
const updateMyExpertSchedules = async (
  userId: string,
  payload: IUpdateExpertSchedulePayload
) => {
  const expert = await prisma.expert.findFirst({
    where: { userId, isDeleted: false },
  });

  if (!expert) throw new AppError(httpStatus.NOT_FOUND, "Expert not found");

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
      const data = createIds.map((scheduleId) => ({
        expertId: expert.id,
        scheduleId,
      }));

      await tx.expertSchedule.createMany({
        data,
        skipDuplicates: true,
      });
    }
  });

  return { success: true };
};

// ===============================
// DELETE MY EXPERT SCHEDULE
// ===============================
const deleteMyExpertSchedule = async (userId: string, scheduleId: string) => {
  const expert = await prisma.expert.findFirst({
    where: { userId, isDeleted: false },
  });

  if (!expert) throw new AppError(httpStatus.NOT_FOUND, "Expert not found");

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
      deletedAt: new Date(),
    },
  });

  return { success: true };
};

export const expertScheduleService = {
  assignExpertSchedules,
  getMyExpertSchedules,
  getAllExpertSchedules,
  getExpertScheduleById,
  updateMyExpertSchedules,
  deleteMyExpertSchedule,
};