
import { IIndustry } from "./industry.interface";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";
import { prisma } from "../../lib/prisma";
import { Industry } from "../../generated/client";

// ===============================
// CREATE INDUSTRY
// ===============================
const createIndustry = async (payload: IIndustry) => {
  const exists = await prisma.industry.findUnique({
    where: { name: payload.name },
  });

  if (exists) {
    throw new AppError(status.CONFLICT, "Industry already exists");
  }

  const industry = await prisma.industry.create({
    data: {
      name: payload.name,
      description: payload.description,
      icon: payload.icon,
    },
  });

  return industry;
};

// ===============================
// GET ALL INDUSTRIES
// ===============================
const getAllIndustries = async (): Promise<Industry[]> => {
  const industries = await prisma.industry.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: "desc" },
  });

  return industries;
};

// ===============================
// GET INDUSTRY BY ID
// ===============================
const getIndustryById = async (id: string): Promise<Industry> => {
  const industry = await prisma.industry.findUnique({
    where: { id, isDeleted: false },
    include: { experts: true },
  });

  if (!industry) {
    throw new AppError(status.NOT_FOUND, "Industry not found");
  }

  return industry;
};

// ===============================
// UPDATE INDUSTRY
// ===============================
const updateIndustry = async (
  id: string,
  data: Partial<Industry>
): Promise<Industry> => {
  const exists = await prisma.industry.findUnique({
    where: { id, isDeleted: false },
  });

  if (!exists) {
    throw new AppError(status.NOT_FOUND, "Industry not found");
  }

  const updated = await prisma.industry.update({
    where: { id },
    data,
  });

  return updated;
};

// ===============================
// SOFT DELETE INDUSTRY
// ===============================
const deleteIndustry = async (id: string): Promise<Industry> => {
  const exists = await prisma.industry.findUnique({
    where: { id },
  });

  if (!exists) {
    throw new AppError(status.NOT_FOUND, "Industry not found");
  }

  const deleted = await prisma.industry.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });

  return deleted;
};

// ===============================
// EXPORT SERVICE
// ===============================
export const industryService = {
  createIndustry,
  getAllIndustries,
  getIndustryById,
  updateIndustry,
  deleteIndustry,
};