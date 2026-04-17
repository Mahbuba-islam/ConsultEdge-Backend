//create schedules


import AppError from "../../errorHelpers/AppError"
import status from "http-status"
import { ICreateSchedulePayload, IUpdateSchedulePayload } from "./schdules.interface";
import { Prisma, Role, Schedule } from "../../generated/client";
import { addHours, addMinutes, format } from "date-fns";
import { convertDateTime } from "./schdule.utils";
import { prisma } from "../../lib/prisma";
import { IqueryParams } from "../../interfaces/query.interface";
import { QueryBuilder } from "../../utilis/queryBuilder";
import { scheduleFilterableFields, scheduleIncludeConfig, scheduleSearchableFields } from "./schdules.constant";

const getActiveExpertByUserId = async (userId: string) => {
  const expert = await prisma.expert.findUnique({
    where: { userId },
  });

  if (expert && !expert.isDeleted) {
    return expert;
  }

  throw new AppError(
    status.FORBIDDEN,
    "Only expert accounts can manage their own schedule catalog"
  );
};


//createSchedules

// const createSchedules = async (
//   payload: ICreateSchedulePayload,
//   user?: { userId?: string; role?: Role }
// ) => {
//   const { startDate, endDate, startTime, endTime } = payload;

//   const interval = 30;
//   const schedules: Schedule[] = [];

//   const currentDate = new Date(startDate);
//   const lastDate = new Date(endDate);

//   while (currentDate <= lastDate) {
//     const [sh, sm] = startTime.split(":").map(Number);
//     const [eh, em] = endTime.split(":").map(Number);

//     const startDateTime = new Date(
//       currentDate.getFullYear(),
//       currentDate.getMonth(),
//       currentDate.getDate(),
//       sh,
//       sm,
//       0,
//       0
//     );

//     const endDateTime = new Date(
//       currentDate.getFullYear(),
//       currentDate.getMonth(),
//       currentDate.getDate(),
//       eh,
//       em,
//       0,
//       0
//     );

//     while (startDateTime < endDateTime) {
//       const s = await convertDateTime(startDateTime);
//       const e = await convertDateTime(addMinutes(startDateTime, interval));

//       const existing = await prisma.schedule.findFirst({
//         where: {
//           startDateTime: s,
//           endDateTime: e,
//           isDeleted: false,
//         },
//       });

//       const schedule =
//         existing ??
//         (await prisma.schedule.create({
//           data: {
//             startDateTime: s,
//             endDateTime: e,
//           },
//         }));

//       schedules.push(schedule);

//       startDateTime.setMinutes(startDateTime.getMinutes() + interval);
//     }

//     currentDate.setDate(currentDate.getDate() + 1);
//   }

//   if (user?.role === Role.EXPERT && user.userId && schedules.length) {
//     const expert = await getActiveExpertByUserId(user.userId);

//     await prisma.$transaction(
//       schedules.map((schedule) =>
//         prisma.expertSchedule.upsert({
//           where: {
//             expertId_scheduleId: {
//               expertId: expert.id,
//               scheduleId: schedule.id,
//             },
//           },
//           update: {
//             isDeleted: false,
//             deletedAt: null,
//           },
//           create: {
//             expertId: expert.id,
//             scheduleId: schedule.id,
//             isPublished: true,
//           },
//         })
//       )
//     );
//   }

//   return schedules;
// };

const createSchedules = async (
  payload: ICreateSchedulePayload,
  user?: { userId?: string; role?: Role }
) => {
  const { startDate, endDate, startTime, endTime } = payload;

  const interval = 30;
  const schedules: Schedule[] = [];

  const parseLocalDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d);
  };

  const currentDate = parseLocalDate(startDate);
  const lastDate = parseLocalDate(endDate);

  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);

  while (currentDate <= lastDate) {
    let cursor = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      sh,
      sm,
      0,
      0
    );

    const endDateTime = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      eh,
      em,
      0,
      0
    );

    while (cursor < endDateTime) {
      const next = new Date(cursor.getTime() + interval * 60 * 1000);

      const s = cursor;
      const e = next;

      // ✅ FIX: no slotKey — use real DB fields
      const existing = await prisma.schedule.findFirst({
        where: {
          startDateTime: s,
          endDateTime: e,
        },
      });

      const schedule =
        existing ??
        (await prisma.schedule.create({
          data: {
            startDateTime: s,
            endDateTime: e,
          },
        }));

      schedules.push(schedule);

      cursor = next;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  if (user?.role === Role.EXPERT && user.userId && schedules.length) {
    const expert = await getActiveExpertByUserId(user.userId);

    await prisma.$transaction(
      schedules.map((schedule) =>
        prisma.expertSchedule.upsert({
          where: {
            expertId_scheduleId: {
              expertId: expert.id,
              scheduleId: schedule.id,
            },
          },
          update: {
            isDeleted: false,
            deletedAt: null,
          },
          create: {
            expertId: expert.id,
            scheduleId: schedule.id,
            isPublished: true,
          },
        })
      )
    );
  }

  return schedules;
};










//getAllSchedules
 
const getAllSchedules = async (
  query: IqueryParams,
  user?: { userId?: string; role?: Role }
) => {
  let baseQuery: Prisma.ScheduleWhereInput = {
    isDeleted: false,
  };

  if (user?.role === Role.EXPERT && user.userId) {
    const expert = await getActiveExpertByUserId(user.userId);

    baseQuery = {
      ...baseQuery,
      expertSchedules: {
        some: {
          expertId: expert.id,
          isDeleted: false,
        },
      },
    };
  }

  if (user?.role === Role.CLIENT) {
    baseQuery = {
      ...baseQuery,
      startDateTime: {
        gt: new Date(),
      },
      expertSchedules: {
        some: {
          isDeleted: false,
          isBooked: false,
          isPublished: true,
          expert: {
            isDeleted: false,
          },
        },
      },
    };
  }

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
    .where(baseQuery)
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

const getPublishedSchedulesByExpertId = async (expertId: string) => {
  const expert = await prisma.expert.findFirst({
    where: {
      id: expertId,
      isDeleted: false,
    },
    select: { id: true },
  });

  if (!expert) {
    throw new AppError(status.NOT_FOUND, "Expert not found");
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





//updateSchedule
const updateSchedule = async (id: string, payload: IUpdateSchedulePayload) => {
  const { startDate, endDate, startTime, endTime } = payload;

  const baseStart = new Date(startDate);
  const baseEnd = new Date(endDate);

  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);

  const startDateTime = new Date(
    baseStart.getFullYear(),
    baseStart.getMonth(),
    baseStart.getDate(),
    sh,
    sm,
    0,
    0
  );

  const endDateTime = new Date(
    baseEnd.getFullYear(),
    baseEnd.getMonth(),
    baseEnd.getDate(),
    eh,
    em,
    0,
    0
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
  getPublishedSchedulesByExpertId,
   updateSchedule,
   deleteSchedule
} 