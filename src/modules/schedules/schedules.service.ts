//create schedules


import AppError from "../../errorHelpers/AppError"
import status from "http-status"
import { ICreateSchedulePayload, IUpdateSchedulePayload } from "./schdules.interface";
import { Prisma, Schedule } from "../../generated/client";
import { addHours, addMinutes, format } from "date-fns";
import { convertDateTime } from "./schdule.utils";
import { prisma } from "../../lib/prisma";
import { IqueryParams } from "../../interfaces/query.interface";
import { QueryBuilder } from "../../utilis/queryBuilder";
import { scheduleFilterableFields, scheduleIncludeConfig, scheduleSearchableFields } from "./schdules.constant";


//createSchedules

const createSchedules = async (payload: ICreateSchedulePayload) => {
  const { startDate, endDate, startTime, endTime } = payload;

  const interval = 30; // minutes
  const schedules: Schedule[] = [];

  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  while (currentDate <= lastDate) {
    const startDateTime = new Date(
      addMinutes(
        addHours(format(currentDate, "yyyy-MM-dd"), Number(startTime.split(":")[0])),
        Number(startTime.split(":")[1])
      )
    );

    const endDateTime = new Date(
      addMinutes(
        addHours(format(currentDate, "yyyy-MM-dd"), Number(endTime.split(":")[0])),
        Number(endTime.split(":")[1])
      )
    );

    while (startDateTime < endDateTime) {
      const s = await convertDateTime(startDateTime);
      const e = await convertDateTime(addMinutes(startDateTime, interval));

      const existing = await prisma.schedule.findFirst({
        where: {
          startDateTime: s,
          endDateTime: e,
        },
      });

      if (!existing) {
        const created = await prisma.schedule.create({
          data: {
            startDateTime: s,
            endDateTime: e,
          },
        });

        schedules.push(created);
      }

      startDateTime.setMinutes(startDateTime.getMinutes() + interval);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return schedules;
};



//getAllSchedules
 
const getAllSchedules = async (query: IqueryParams) => {
  const qb = new QueryBuilder<Schedule, Prisma.ScheduleWhereInput, Prisma.ScheduleInclude>(
    prisma.schedule,
    query,
    {
      searchableFields: scheduleSearchableFields,
      filterableFields: scheduleFilterableFields,
    }
  );

  const result = await qb
    .search()
    .filter()
    .paginate()
    .dynamicInclude(scheduleIncludeConfig)
    .sort()
    .fields()
    .excute();

  return result;
};



const getScheduleById = async (id: string) => {
  // 1. Validate ID format
  if (!id || typeof id !== "string") {
    throw new AppError(status.BAD_REQUEST, "Invalid schedule ID");
  }

  // 2. Fetch schedule with relations
  const schedule = await prisma.schedule.findUnique({
    where: { id },
    include: {
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
    },
  });

  // 3. Handle not found
  if (!schedule) {
    throw new AppError(status.NOT_FOUND, "Schedule not found");
  }

  return schedule;
};





//updateSchedule
const updateSchedule = async (id: string, payload: IUpdateSchedulePayload) => {
  const { startDate, endDate, startTime, endTime } = payload;

  const startDateTime = new Date(
    addMinutes(
      addHours(format(new Date(startDate), "yyyy-MM-dd"), Number(startTime.split(":")[0])),
      Number(startTime.split(":")[1])
    )
  );

  const endDateTime = new Date(
    addMinutes(
      addHours(format(new Date(endDate), "yyyy-MM-dd"), Number(endTime.split(":")[0])),
      Number(endTime.split(":")[1])
    )
  );

  return await prisma.schedule.update({
    where: { id },
    data: {
      startDateTime,
      endDateTime,
    },
  });
};


//deleteSchedule

const deleteSchedule = async (id: string) => {
  // 1. Validate ID
  if (!id || typeof id !== "string") {
    throw new AppError(status.BAD_REQUEST, "Invalid schedule ID");
  }

  // 2. Check schedule exists
  const schedule = await prisma.schedule.findUnique({
    where: { id },
    include: {
      expertSchedules: true,
    },
  });

  if (!schedule) {
    throw new AppError(status.NOT_FOUND, "Schedule not found");
  }

  // 3. Prevent deleting booked schedules
  const isBooked = schedule.expertSchedules.some((es) => es.isBooked);

  if (isBooked) {
    throw new AppError(
      status.BAD_REQUEST,
      "Cannot delete schedule — it is already booked"
    );
  }

  // 4. Soft delete instead of hard delete
  const deleted = await prisma.schedule.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });

  return {
    message: "Schedule deleted successfully",
    data: deleted,
  };
};



export const schedulesService = {
   createSchedules,
   getAllSchedules,
   getScheduleById,
   updateSchedule,
   deleteSchedule
} 