import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { IqueryParams } from "../../interfaces/query.interface";
import { QueryBuilder } from "../../utilis/queryBuilder";
import { Client, Prisma, Role, UserStatus } from "../../generated/client";
import { IRequestUser } from "../../interfaces/requestUser.interface";

const getAllClients = async (query: IqueryParams) => {
  const queryBuilder = new QueryBuilder<
    Client,
    Prisma.ClientWhereInput,
    Prisma.ClientInclude
  >(prisma.client, query, {
    searchableFields: ["fullName", "email", "phone", "address", "user.name", "user.email"],
    filterableFields: ["fullName", "email", "phone", "address", "isDeleted", "userId"],
  });

  const result = await queryBuilder
    .search()
    .filter()
    .where({ isDeleted: false })
    .include({ user: true })
    .paginate()
    .sort()
    .fields()
    .excute();

  return result;
};

const getClientById = async (id: string) => {
  const client = await prisma.client.findUnique({
    where: { id, isDeleted: false },
    include: {
      user: true,
      consultations: true,
      testimonials: true,
    },
  });

  if (!client) {
    throw new AppError(status.NOT_FOUND, "Client not found");
  }

  return client;
};

const getMyProfile = async (userId: string) => {
  const client = await prisma.client.findUnique({
    where: { userId, isDeleted: false },
    include: {
      user: true,
      consultations: true,
      testimonials: true,
    },
  });

  if (!client) {
    throw new AppError(status.NOT_FOUND, "Client profile not found");
  }

  return client;
};

const updateClient = async (
  id: string,
  payload: Partial<{
    fullName: string;
    email: string;
    profilePhoto: string;
    phone: string;
    address: string;
  }>,
  user: IRequestUser
) => {
  const existingClient = await prisma.client.findUnique({
    where: { id, isDeleted: false },
    include: { user: true },
  });

  if (!existingClient) {
    throw new AppError(status.NOT_FOUND, "Client not found");
  }

  if (user.role !== Role.ADMIN && existingClient.userId !== user.userId) {
    throw new AppError(status.FORBIDDEN, "Forbidden access to update this client");
  }

  const result = await prisma.$transaction(async (tx) => {
    if (payload.email && payload.email !== existingClient.email) {
      const duplicateUser = await tx.user.findFirst({
        where: {
          email: payload.email,
          NOT: { id: existingClient.userId },
        },
      });

      if (duplicateUser) {
        throw new AppError(status.BAD_REQUEST, "User with same email already exists");
      }
    }

    await tx.user.update({
      where: { id: existingClient.userId },
      data: {
        ...(payload.email ? { email: payload.email } : {}),
        ...(payload.fullName ? { name: payload.fullName } : {}),
      },
    });

    return tx.client.update({
      where: { id },
      data: {
        ...(payload.fullName !== undefined ? { fullName: payload.fullName } : {}),
        ...(payload.email !== undefined ? { email: payload.email } : {}),
        ...(payload.profilePhoto !== undefined ? { profilePhoto: payload.profilePhoto } : {}),
        ...(payload.phone !== undefined ? { phone: payload.phone } : {}),
        ...(payload.address !== undefined ? { address: payload.address } : {}),
      },
      include: { user: true },
    });
  });

  return result;
};

const deleteClient = async (id: string) => {
  const client = await prisma.client.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!client) {
    throw new AppError(status.NOT_FOUND, "Client not found");
  }

  await prisma.$transaction(async (tx) => {
    await tx.client.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    await tx.user.update({
      where: { id: client.userId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        status: UserStatus.DELETED,
      },
    });

    await tx.session.deleteMany({
      where: { userId: client.userId },
    });
  });

  return { message: "Client deleted successfully" };
};

export const clientService = {
  getAllClients,
  getClientById,
  getMyProfile,
  updateClient,
  deleteClient,
};
