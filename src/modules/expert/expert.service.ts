import status from "http-status";

import AppError from "../../errorHelpers/AppError";
import { updateExpertInterface } from "./expert.interface";

import { IqueryParams } from "../../interfaces/query.interface";
import { QueryBuilder } from "../../utilis/queryBuilder";

import { expertFilterableFields, expertIncludeConfig, expertSearchableFields } from "./expert.constant";
import { Expert, Prisma, UserStatus } from "../../generated/client";
import { any } from "zod";
import { prisma } from "../../lib/prisma";

const getAllExperts = async (query: IqueryParams) => {
  const qb = new QueryBuilder<
    Expert,
    Prisma.ExpertWhereInput,
    Prisma.ExpertInclude
  >(prisma.expert, query, {
    searchableFields: expertSearchableFields,
    filterableFields: expertFilterableFields,
  });

  const result = await qb
    .search()
    .filter()
    .where({ isDeleted: false })
    .include({
      user: true,
      industry: true,
    })
    .dynamicInclude(expertIncludeConfig)
    .paginate()
    .sort()
    .fields()
    .excute();

  return result;
};


const getExpertById = async (id: string) => {
  const expert = await prisma.expert.findUnique({
    where: { id, isDeleted: false },
    include: {
      user: true,
      industry: true,
      schedules: {
        include: { schedule: true },
      },
      consultations: {
        include: {
          client: true,
          expertSchedule: true,
        },
      },
      testimonials: true,
      verification: true,
    },
  });

  if (!expert) {
    throw new AppError(status.NOT_FOUND, "Expert not found");
  }

  return expert;
};








const updateExpert = async (id: string, payload: updateExpertInterface) => {
  const existingExpert = await prisma.expert.findUnique({
    where: { id, isDeleted: false },
  });

  if (!existingExpert) {
    throw new AppError(status.NOT_FOUND, "Expert not found");
  }

  const { expert: expertData } = payload;

  await prisma.expert.update({
    where: { id },
    data: {
      ...expertData,
    },
  });

  return await getExpertById(id);
};




const deleteExpert = async (id: string) => {
  const expert = await prisma.expert.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!expert) {
    throw new AppError(status.NOT_FOUND, "Expert not found");
  }

  await prisma.$transaction(async (tx) => {
    await tx.expert.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    await tx.user.update({
      where: { id: expert.userId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        status: UserStatus.DELETED,
      },
    });

    await tx.session.deleteMany({
      where: { userId: expert.userId },
    });
  });

  return { message: "Expert deleted successfully" };
};




//apply expert

const applyExpert = async (userId: string, payload: any) => {
  // Check if already applied
  const existing = await prisma.expert.findUnique({
    where: { userId },
  });

  if (existing) {
    throw new Error("You have already applied to become an expert");
  }

  const expert = await prisma.expert.create({
  data: {
    fullName: payload.fullName,
    email: payload.email,        
    phone: payload.phone,
    bio: payload.bio,
    title: payload.title,
    experience: payload.experience || 0,
    consultationFee: payload.consultationFee,
    industryId: payload.industryId,
    userId,
  },
});

 return expert;
};




export const expertService = {
    getAllExperts,
    updateExpert,
    getExpertById,
    deleteExpert,
    applyExpert
}