import { Prisma } from "../../generated/client";

export const adminSearchableFields = [
  "name",
  "email",
  "contactNumber",
  "user.role",
  "user.status",
];

export const adminFilterableFields = [
  "isDeleted",
  "email",
  "contactNumber",
  "user.role",
  "user.status",
];

export const adminIncludeConfig: Partial<
  Record<
    keyof Prisma.AdminInclude,
    Prisma.AdminInclude[keyof Prisma.AdminInclude]
  >
> = {
  user: true,
};


