var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/index.ts
import express2 from "express";
import { toNodeHandler } from "better-auth/node";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// src/generated/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// src/generated/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": '// -----------------------------\n// Prisma Client Generator\n// -----------------------------\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../src/generated"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\n// TUTOR PROFILE\n\nmodel TutorProfile {\n  id         String   @id @default(uuid())\n  userId     String   @unique\n  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  categoryId String\n  category   Category @relation(fields: [categoryId], references: [id])\n  bio        String?\n  price      Float?\n  rating     Float?   @default(0)\n  subject    String[]\n\n  totalReviews Int     @default(0)\n  isFeatured   Boolean @default(false)\n\n  reviews        Review[]\n  bookings       Booking[]\n  availabilities Availability[]\n}\n\nmodel Availability {\n  id      String       @id @default(uuid())\n  tutorId String\n  tutor   TutorProfile @relation(fields: [tutorId], references: [id], onDelete: Cascade)\n\n  date      DateTime\n  timeSlots String[]\n}\n\n// CATEGORIES model\n\nmodel Category {\n  id            String         @id @default(uuid())\n  name          String         @unique\n  tutorProfiles TutorProfile[]\n}\n\n//booking model\n\nmodel Booking {\n  id String @id @default(uuid())\n\n  studentId String\n  student   User   @relation("StudentBookings", fields: [studentId], references: [id], onDelete: Cascade)\n\n  tutorId String\n  tutor   TutorProfile @relation(fields: [tutorId], references: [id], onDelete: Cascade)\n\n  date      DateTime\n  startTime String\n  endTime   String\n\n  status BookingStatus @default(CONFIRMED)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  user      User?    @relation(fields: [userId], references: [id], onDelete: Cascade)\n  userId    String?\n  reviews   Review[]\n\n  @@unique([tutorId, date, startTime])\n  @@index([studentId])\n  @@index([tutorId])\n}\n\nenum BookingStatus {\n  CONFIRMED\n  COMPLETED\n  CANCELLED\n}\n\n//review model\n\nmodel Review {\n  id        String @id @default(uuid())\n  studentId String\n  student   User   @relation(fields: [studentId], references: [id], onDelete: Cascade)\n\n  tutorId String\n  tutor   TutorProfile @relation(fields: [tutorId], references: [id], onDelete: Cascade)\n\n  bookingId String\n  booking   Booking @relation(fields: [bookingId], references: [id], onDelete: Cascade)\n\n  rating    Int\n  comment   String?\n  createdAt DateTime @default(now())\n}\n\nmodel User {\n  id String @id @default(uuid())\n\n  name          String\n  email         String\n  emailVerified Boolean   @default(false)\n  image         String?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n  sessions      Session[]\n  accounts      Account[]\n  bookings      Booking[]\n  reviews       Review[]\n\n  role            String        @default("STUDENT")\n  phone           String?\n  status          String?       @default("ACTIVE")\n  tutorProfile    TutorProfile?\n  studentBookings Booking[]     @relation("StudentBookings")\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"TutorProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TutorProfileToUser"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToTutorProfile"},{"name":"bio","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"rating","kind":"scalar","type":"Float"},{"name":"subject","kind":"scalar","type":"String"},{"name":"totalReviews","kind":"scalar","type":"Int"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToTutorProfile"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToTutorProfile"},{"name":"availabilities","kind":"object","type":"Availability","relationName":"AvailabilityToTutorProfile"}],"dbName":null},"Availability":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"AvailabilityToTutorProfile"},{"name":"date","kind":"scalar","type":"DateTime"},{"name":"timeSlots","kind":"scalar","type":"String"}],"dbName":null},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"tutorProfiles","kind":"object","type":"TutorProfile","relationName":"CategoryToTutorProfile"}],"dbName":null},"Booking":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"student","kind":"object","type":"User","relationName":"StudentBookings"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"BookingToTutorProfile"},{"name":"date","kind":"scalar","type":"DateTime"},{"name":"startTime","kind":"scalar","type":"String"},{"name":"endTime","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"BookingStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"BookingToUser"},{"name":"userId","kind":"scalar","type":"String"},{"name":"reviews","kind":"object","type":"Review","relationName":"BookingToReview"}],"dbName":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"student","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"ReviewToTutorProfile"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToReview"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"role","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"TutorProfileToUser"},{"name":"studentBookings","kind":"object","type":"Booking","relationName":"StudentBookings"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull2,
  AvailabilityScalarFieldEnum: () => AvailabilityScalarFieldEnum,
  BookingScalarFieldEnum: () => BookingScalarFieldEnum,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  TutorProfileScalarFieldEnum: () => TutorProfileScalarFieldEnum,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.3.0",
  engine: "9d6ad21cbbceab97458517b147a6a09ff43aa735"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  TutorProfile: "TutorProfile",
  Availability: "Availability",
  Category: "Category",
  Booking: "Booking",
  Review: "Review",
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var TutorProfileScalarFieldEnum = {
  id: "id",
  userId: "userId",
  categoryId: "categoryId",
  bio: "bio",
  price: "price",
  rating: "rating",
  subject: "subject",
  totalReviews: "totalReviews",
  isFeatured: "isFeatured"
};
var AvailabilityScalarFieldEnum = {
  id: "id",
  tutorId: "tutorId",
  date: "date",
  timeSlots: "timeSlots"
};
var CategoryScalarFieldEnum = {
  id: "id",
  name: "name"
};
var BookingScalarFieldEnum = {
  id: "id",
  studentId: "studentId",
  tutorId: "tutorId",
  date: "date",
  startTime: "startTime",
  endTime: "endTime",
  status: "status",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  userId: "userId"
};
var ReviewScalarFieldEnum = {
  id: "id",
  studentId: "studentId",
  tutorId: "tutorId",
  bookingId: "bookingId",
  rating: "rating",
  comment: "comment",
  createdAt: "createdAt"
};
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  image: "image",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  role: "role",
  phone: "phone",
  status: "status"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  // ✅ SAFE for local + prod
  trustedOrigins: [
    "http://localhost:3000"
  ].filter(Boolean),
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "STUDENT",
        required: true
      },
      phone: {
        type: "string",
        required: false
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false
  },
  cookies: {
    sessionToken: {
      name: "better-auth-session",
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/"
      }
    }
  }
});

// src/modules/tutors/tutors.router.ts
import { Router } from "express";

// src/modules/tutors/tutors.service.ts
var getTutors = async (payload) => {
  const { search, categoryName } = payload;
  const num = Number(search);
  const isNumber = !isNaN(num);
  return prisma.tutorProfile.findMany({
    where: {
      AND: [
        // category filter (optional)
        categoryName ? {
          category: {
            name: {
              equals: categoryName,
              mode: "insensitive"
            }
          }
        } : {},
        // search filter (optional)
        search ? {
          OR: [
            // subject search
            {
              subject: {
                has: search
              }
            },
            // rating search
            isNumber ? { rating: { equals: num } } : {},
            // price search
            isNumber ? { price: { equals: num } } : {}
          ]
        } : {}
      ]
    },
    include: {
      category: true,
      user: true
    }
  });
};
var getTutorDetails = async (id) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          name: true,
          image: true,
          email: true
        }
      },
      category: {
        select: { name: true }
      },
      reviews: {
        include: {
          student: {
            select: { name: true }
          }
        }
      }
    }
  });
  if (!tutor) {
    throw new Error("Tutor not found");
  }
  return tutor;
};
var findFeaturedTutors = async () => {
  return prisma.tutorProfile.findMany({
    where: {
      isFeatured: true
    },
    include: {
      category: true,
      user: true
    }
  });
};
var getTutorDashboard = async (tutorId) => {
  const now = /* @__PURE__ */ new Date();
  const profile = await prisma.tutorProfile.findUnique({
    where: { userId: tutorId },
    include: {
      user: true,
      category: true,
      reviews: true,
      bookings: {
        include: {
          student: true
        },
        orderBy: { date: "asc" }
      }
    }
  });
  if (!profile) throw new Error("Tutor profile not found");
  const upcomingSessions = profile.bookings.filter(
    (b) => b.date >= now
  );
  const pastSessions = profile.bookings.filter(
    (b) => b.date < now
  );
  const reviews = await prisma.review.findMany({
    where: { tutorId },
    include: {
      student: true
    },
    orderBy: { createdAt: "desc" }
  });
  return {
    profile,
    upcomingSessions,
    pastSessions,
    reviews,
    rating: profile.rating || 0,
    totalReviews: profile.totalReviews || 0
  };
};
var createTutors = async (raw3, userId) => {
  const data = {
    bio: raw3.bio ?? null,
    price: raw3.price !== void 0 ? Number(raw3.price) : null,
    categoryId: raw3.categoryId,
    isFeatured: raw3.isFeatured ?? false,
    subject: Array.isArray(raw3.subject) ? raw3.subject : [],
    userId
  };
  console.log("FINAL DATA SENT TO PRISMA:", data);
  return prisma.tutorProfile.create({
    data,
    include: {
      user: true,
      category: true
    }
  });
};
var updateTutorProfile = async (userId, raw3) => {
  const data = {};
  if (raw3.bio !== void 0) data.bio = raw3.bio;
  if (raw3.price !== void 0) data.price = Number(raw3.price);
  if (raw3.categoryId !== void 0) data.categoryId = raw3.categoryId;
  if (Array.isArray(raw3.subject)) data.subject = raw3.subject;
  if (raw3.isFeatured !== void 0) data.isFeatured = raw3.isFeatured;
  console.log("FINAL UPDATE DATA:", data);
  return prisma.tutorProfile.update({
    where: { userId },
    data,
    include: {
      user: true,
      category: true
    }
  });
};
var getTutorReviews = async (userId) => {
  const profile = await prisma.tutorProfile.findUnique({
    where: { userId },
    select: { id: true }
  });
  if (!profile) throw new Error("Tutor profile not found");
  return prisma.review.findMany({
    where: { tutorId: profile.id },
    include: {
      student: true
    },
    orderBy: { createdAt: "desc" }
  });
};
var getAvailability = async (userId) => {
  const profile = await prisma.tutorProfile.findUnique({
    where: { userId }
  });
  if (!profile) {
    throw new Error("Tutor profile not found");
  }
  return prisma.availability.findMany({
    where: { tutorId: profile.id },
    orderBy: { date: "asc" }
  });
};
var getTutorSessions = async (userId) => {
  const profile = await prisma.tutorProfile.findUnique({
    where: { userId }
  });
  if (!profile) {
    throw new Error("Tutor profile not found");
  }
  return prisma.booking.findMany({
    where: { tutorId: profile.id },
    orderBy: { date: "asc" },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
};
var updateAvailability = async (userId, data) => {
  const { date, timeSlots } = data;
  const profile = await prisma.tutorProfile.findUnique({
    where: { userId }
  });
  if (!profile) {
    throw new Error("Tutor profile not found");
  }
  const existing = await prisma.availability.findFirst({
    where: {
      tutorId: profile.id,
      // FIXED
      date: new Date(date)
    }
  });
  if (existing) {
    return prisma.availability.update({
      where: { id: existing.id },
      data: { timeSlots }
    });
  }
  return prisma.availability.create({
    data: {
      tutorId: profile.id,
      // FIXED
      date: new Date(date),
      timeSlots
    }
  });
};
var tutorsService = {
  getTutors,
  getTutorDetails,
  findFeaturedTutors,
  createTutors,
  getTutorDashboard,
  updateTutorProfile,
  updateAvailability,
  getTutorSessions,
  getAvailability,
  getTutorReviews
};

// src/modules/tutors/tutors.controler.ts
var getTutors2 = async (req, res, next) => {
  try {
    const { search } = req.query;
    const categoryName = req.query.categoryName;
    console.log(req.query);
    const searchString = typeof search === "string" ? search : void 0;
    const categoryString = typeof categoryName === "string" ? categoryName : void 0;
    console.log("search", search);
    const results = await tutorsService.getTutors({ search: searchString, categoryName: categoryString });
    res.status(201).json(results);
  } catch (error) {
    next(error);
  }
};
var getTutorDetails2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tutor = await tutorsService.getTutorDetails(id);
    res.status(200).json({
      success: true,
      data: tutor
    });
  } catch (error) {
    next(error);
  }
};
var getFeaturedTutors = async (req, res, next) => {
  try {
    const results = await tutorsService.findFeaturedTutors();
    res.status(201).json(results);
  } catch (error) {
    next(error);
  }
};
var getTutorDashboard2 = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        error: "Unothorized"
      });
    }
    const tutorId = req.user.id;
    const data = await tutorsService.getTutorDashboard(tutorId);
    return res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};
var getAvailability2 = async (req, res, next) => {
  try {
    console.log("GET availability \u2192 userId:", req.user);
    if (!req.user) {
      return res.status(400).json({
        error: "Unothorized"
      });
    }
    const userId = req.user.id;
    const result = await tutorsService.getAvailability(userId);
    console.log("GET availability \u2192 result:", result);
    res.json({
      success: true,
      message: "Availability fetched successfully",
      data: result
    });
  } catch (err) {
    next(err);
  }
};
var updateAvailability2 = async (req, res, next) => {
  try {
    const { date, timeSlots } = req.body;
    if (!req.user) {
      return res.status(400).json({
        error: "Unothorized"
      });
    }
    const result = await tutorsService.updateAvailability(req.user.id, {
      date,
      timeSlots
    });
    res.json({
      success: true,
      message: "Availability set successfully",
      data: result
    });
  } catch (err) {
    next(err);
  }
};
var createTutors2 = async (req, res, next) => {
  try {
    const user = req.user;
    console.log("REQ COOKIES:", req.cookies);
    console.log("REQ USER:", req.user);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Unauthorized"
      });
    }
    const results = await tutorsService.createTutors(req.body, user.id);
    console.log("tutor profile", results);
    return res.status(201).json({
      success: true,
      message: "Tutor profile created successfully",
      data: results
    });
  } catch (error) {
    next(error);
  }
};
var getTutorReviews2 = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    const userId = req.user.id;
    console.log("IdDDDD", userId);
    const reviews = await tutorsService.getTutorReviews(userId);
    return res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (err) {
    next(err);
  }
};
var getTutorSessions2 = async (req, res, next) => {
  try {
    const tutorId = req.user.id;
    console.log("GET SESSIONS \u2192 userId:", req.user?.id);
    const bookings = await tutorsService.getTutorSessions(tutorId);
    return res.json({
      success: true,
      bookings
    });
  } catch (err) {
    next(err);
  }
};
var updateProfile = async (req, res, next) => {
  try {
    const { bio, price, subject, categoryId, isFeatured } = req.body;
    const updatedProfile = await tutorsService.updateTutorProfile(req.user.id, {
      bio,
      price,
      subject,
      categoryId,
      isFeatured
    });
    res.json({
      success: true,
      message: "Tutor profile updated successfully",
      data: updatedProfile
    });
  } catch (err) {
    next(err);
  }
};
var tutorControler = {
  getTutors: getTutors2,
  getTutorDetails: getTutorDetails2,
  getTutorDashboard: getTutorDashboard2,
  getFeaturedTutors,
  createTutors: createTutors2,
  updateProfile,
  updateAvailability: updateAvailability2,
  getTutorSessions: getTutorSessions2,
  getAvailability: getAvailability2,
  getTutorReviews: getTutorReviews2
};

// src/middlewares/auth.ts
var auth2 = (...roles) => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers
      });
      console.log("S", session);
      if (!session) {
        return res.status(401).json({
          success: false,
          message: "you are not authorized"
        });
      }
      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
        emailVerified: session.user.emailVerified
      };
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "forbidden. You don't have right to access the resources!"
        });
      }
      next();
    } catch (e) {
      next(e);
    }
  };
};
var auth_default = auth2;

// src/modules/tutors/tutors.router.ts
var router = Router();
router.get("/", tutorControler.getTutors);
router.get("/sessions", auth_default(), tutorControler.getTutorSessions);
router.get("/reviews", auth_default(), tutorControler.getTutorReviews);
router.get("/availability", auth_default(), tutorControler.getAvailability);
router.get("/dashboard", auth_default("TUTOR" /* TUTOR */, "ADMIN" /* ADMIN */), tutorControler.getTutorDashboard);
router.get("/featured", tutorControler.getFeaturedTutors);
router.get("/:id", tutorControler.getTutorDetails);
router.post("/create", auth_default(), tutorControler.createTutors);
router.post("/availability", auth_default(), tutorControler.updateAvailability);
router.put("/profile", auth_default(), tutorControler.updateProfile);
var tutorRouter = router;

// src/middlewares/errorHandler.ts
import { PrismaClientInitializationError as PrismaClientInitializationError3 } from "@prisma/client/runtime/client";
var errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let errorMessage = "Internal server Error";
  let errDetails = err;
  if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = "You provide incorrect field type or missing fields";
  } else if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = 400;
      errorMessage = "Duplicate Entry";
    }
    if (err.code === "P2003") {
      statusCode = 400;
      errorMessage = "Invalid foreign key";
    }
    if (err.code === "P2025") {
      statusCode = 400;
      errorMessage = "Record not found";
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    statusCode = 500;
    errorMessage = "Error occured during query execution";
  } else if (err instanceof PrismaClientInitializationError3) {
    if (err.errorCode === "P1000") {
      statusCode = 400;
      errorMessage = "Authentication failed";
    } else if (err.errorCode === "P1001")
      statusCode = 503;
    errorMessage = "Failed to connect to the database. Please try again later.";
  }
  return res.status(statusCode).json({
    message: errorMessage,
    error: errDetails
  });
};

// src/middlewares/notFound.ts
function notFound(req, res) {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
    date: Date()
  });
}

// src/index.ts
import cors from "cors";

// src/modules/student/student.router.ts
import { Router as Router2 } from "express";

// src/modules/student/student.service.ts
var getProfile = async (userId) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true
    }
  });
};
var updateProfile2 = async (userId, data) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      ...data.name !== void 0 && { name: data.name },
      ...data.email !== void 0 && { email: data.email },
      ...data.image !== void 0 && { image: data.image },
      ...data.bio !== void 0 && { bio: data.bio },
      ...data.phone !== void 0 && { phone: data.phone ?? "" }
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      phone: true
    }
  });
};
var upComingBookings = async (studentId) => {
  const bookings = await prisma.booking.findMany({
    where: {
      studentId,
      date: {
        gte: /* @__PURE__ */ new Date()
      }
    },
    include: {
      tutor: {
        include: {
          user: true
        }
      }
    },
    orderBy: {
      date: "asc"
    }
  });
  return bookings;
};
var getPastBookings = async (studentId) => {
  const bookings = await prisma.booking.findMany({
    where: {
      studentId,
      date: {
        lt: /* @__PURE__ */ new Date()
      }
    },
    include: {
      tutor: {
        include: {
          user: true
        }
      }
    },
    orderBy: {
      date: "asc"
    }
  });
  return bookings;
};
var markCompleted = async (bookingId, studentId) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId }
  });
  if (!booking) {
    throw new Error("Booking not found");
  }
  if (booking.studentId !== studentId) {
    throw new Error("Unauthorized");
  }
  if (booking.status === "COMPLETED") {
    throw new Error("Already completed");
  }
  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "COMPLETED" }
  });
  return updated;
};
var bookingService = {
  markCompleted
};
var deleteAccount = async (userId) => {
  try {
    await prisma.user.delete({
      where: { id: userId }
    });
    return { success: true };
  } catch (error) {
    return { success: false, message: "Failed to delete account" };
  }
};
var studentService = {
  getProfile,
  updateProfile: updateProfile2,
  upComingBookings,
  getPastBookings,
  markCompleted,
  deleteAccount
};

// src/modules/student/student.controler.ts
var getProfile2 = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    const profile = await studentService.getProfile(req.user.id);
    res.json(profile);
  } catch (err) {
    next(err);
  }
};
var updateProfile3 = async (req, res, next) => {
  try {
    const { name, email, image, bio, phone } = req.body;
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    const updated = await studentService.updateProfile(req.user.id, {
      name,
      email,
      image,
      bio,
      phone
    });
    res.json({
      message: "Profile updated successfully",
      profile: updated
    });
  } catch (err) {
    next(err);
  }
};
var getUpcomingBookings = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    const studentId = req.user.id;
    const bookings = await studentService.upComingBookings(studentId);
    res.json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};
var getPastBookings2 = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    const studentId = req.user.id;
    const bookings = await studentService.getPastBookings(studentId);
    res.json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};
var deleteAccount2 = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    const userId = req.user.id;
    console.log("hit delete account", userId);
    const result = await studentService.deleteAccount(userId);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }
    return res.status(200).json({
      success: true,
      message: "Account deleted successfully"
    });
  } catch (error) {
    console.error("Delete account error:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Internal server error"
    });
  }
};
var markCompleted2 = async (req, res, next) => {
  try {
    const bookingId = req.params.id;
    const studentId = req.user.id;
    const updated = await bookingService.markCompleted(bookingId, studentId);
    return res.json({
      success: true,
      message: "Booking marked as completed",
      data: updated
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to complete booking"
    });
  }
};
var studentControler = {
  getProfile: getProfile2,
  updateProfile: updateProfile3,
  getPastBookings: getPastBookings2,
  getUpcomingBookings,
  markCompleted: markCompleted2,
  deleteAccount: deleteAccount2
};

// src/modules/student/student.router.ts
var router2 = Router2();
router2.get("/profile", auth_default("STUDENT" /* USER */), studentControler.getProfile);
router2.get("/bookings/upcoming", auth_default("STUDENT" /* USER */), studentControler.getUpcomingBookings);
router2.get("/bookings/past", auth_default("STUDENT" /* USER */), studentControler.getPastBookings);
router2.put(
  "/bookings/:id/complete",
  auth_default("STUDENT" /* USER */),
  studentControler.markCompleted
);
router2.put("/update-profile", auth_default("STUDENT" /* USER */), studentControler.updateProfile);
router2.delete("/delete-profile", auth_default(), studentControler.deleteAccount);
var studentsRouter = router2;

// src/modules/admin/admin.router.ts
import { Router as Router3 } from "express";

// src/modules/admin/admin.service.ts
var getAllUsersService = async () => {
  return prisma.user.findMany({
    include: {
      tutorProfile: true,
      _count: {
        select: { bookings: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });
};
var manageUser = async (userId, status) => {
  return prisma.user.update({
    where: { id: userId },
    data: { status }
  });
};
var viewAllBookings = async () => {
  return prisma.booking.findMany({
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      },
      tutor: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          }
        }
      }
    },
    orderBy: { date: "desc" }
  });
};
var createCategory = async (name) => {
  return prisma.category.create({
    data: { name }
  });
};
var updateCategory = async (id, name) => {
  return prisma.category.update({
    where: { id },
    data: { name }
  });
};
var deleteCategory = async (id) => {
  return prisma.category.delete({
    where: { id }
  });
};
var adminService = {
  getAllUsersService,
  manageUser,
  viewAllBookings,
  createCategory,
  updateCategory,
  deleteCategory
};

// src/modules/admin/admin.controler.ts
var getAllUsersController = async (req, res) => {
  try {
    const users = await adminService.getAllUsersService();
    return res.json({ users });
  } catch (err) {
    console.error("Get All Users Error:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
var manageUsers = async (req, res) => {
  try {
    const idParam = req.params.id;
    const { status } = req.body;
    if (!idParam || Array.isArray(idParam)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const id = idParam;
    if (!["ACTIVE", "BANNED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    const updatedUser = await adminService.manageUser(id, status);
    return res.json({
      message: `User status updated to ${status}`,
      user: updatedUser
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to update user status" });
  }
};
var getAllBookings = async (req, res, next) => {
  try {
    const bookings = await adminService.viewAllBookings();
    return res.json(bookings);
  } catch (err) {
    next(err);
  }
};
var createCategory2 = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }
    const category = await adminService.createCategory(name);
    return res.json({ message: "Category created", category });
  } catch (err) {
    return res.status(500).json({ message: "Failed to create category" });
  }
};
var updateCategory2 = async (req, res) => {
  try {
    const idParam = req.params.id;
    const { name } = req.body;
    if (!idParam || Array.isArray(idParam)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }
    const category = await adminService.updateCategory(idParam, name);
    return res.json({ message: "Category updated", category });
  } catch (err) {
    return res.status(500).json({ message: "Failed to update category" });
  }
};
var deleteCategory2 = async (req, res) => {
  try {
    const idParam = req.params.id;
    if (!idParam || Array.isArray(idParam)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }
    await adminService.deleteCategory(idParam);
    return res.json({ message: "Category deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to delete category" });
  }
};
var adminControler = {
  getAllUsersController,
  manageUsers,
  getAllBookings,
  createCategory: createCategory2,
  updateCategory: updateCategory2,
  deleteCategory: deleteCategory2
};

// src/modules/admin/admin.router.ts
var router3 = Router3();
router3.get("/getAllUsers", auth_default("ADMIN" /* ADMIN */), adminControler.getAllUsersController);
router3.patch("/users/:id/status", adminControler.manageUsers);
router3.get("/bookings", auth_default("ADMIN" /* ADMIN */), adminControler.getAllBookings);
router3.post("/categories", auth_default("ADMIN" /* ADMIN */), adminControler.createCategory);
router3.put("/categories/:id", adminControler.updateCategory);
router3.delete("/categories/:id", adminControler.deleteCategory);
var adminRouter = router3;

// src/modules/category/category.router.ts
import { Router as Router4 } from "express";

// src/modules/category/category.service.ts
var getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: { name: "asc" }
  });
};
var categoryService = {
  getAllCategories
};

// src/modules/category/category.controler.ts
var getAllCategories2 = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    return res.json(categories);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch categories" });
  }
};
var categoryControler = {
  getAllCategories: getAllCategories2
};

// src/modules/category/category.router.ts
var router4 = Router4();
router4.get("/", categoryControler.getAllCategories);
var categoryRouter = router4;

// src/modules/booking/booking.router.ts
import { Router as Router5 } from "express";

// src/modules/booking/booking.service.ts
var getAllBookingsForStudent = async () => {
  try {
    const results = await prisma.booking.findMany({
      where: {
        status: "CONFIRMED"
      },
      orderBy: { date: "asc" }
    });
    return results;
  } catch (err) {
    console.error("Prisma error:", err);
    throw err;
  }
};
var createBooking = async (data, studentId) => {
  return prisma.booking.create({
    data: {
      tutorId: data.tutorId,
      studentId,
      date: new Date(data.date),
      startTime: data.startTime,
      endTime: data.endTime,
      status: "CONFIRMED"
    }
  });
};
var deleteBooking = async (id) => {
  return await prisma.booking.delete({
    where: { id }
  });
};
var bookingService2 = {
  getAllBookingsForStudent,
  createBooking,
  deleteBooking
};

// src/modules/booking/booking.controler.ts
var getAllBookings2 = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        error: "Unothorized"
      });
    }
    const bookings = await bookingService2.getAllBookingsForStudent();
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};
var createBooking2 = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(400).json({ error: "Unauthorized" });
    }
    console.log("id......", req.user.id);
    if (req.user.role !== "STUDENT" /* USER */) {
      return res.status(400).json({
        success: false,
        message: "Only students can book tutoring sessions"
      });
    }
    const booking = await bookingService2.createBooking(req.body, req.user.id);
    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};
var deleteBooking2 = async (req, res, next) => {
  console.log("DELETE HIT", req.params);
  console.log("COOKIES:", req.cookies);
  try {
    const { id } = req.params;
    console.log("DELETE HITmmmm", id);
    await bookingService2.deleteBooking(id);
    return res.status(200).json({
      success: true,
      message: "Booking deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};
var bookingControler = {
  getAllBookings: getAllBookings2,
  createBooking: createBooking2,
  deleteBooking: deleteBooking2
};

// src/modules/booking/booking.router.ts
var router5 = Router5();
router5.post("/", auth_default(), bookingControler.createBooking);
router5.get("/", auth_default(), bookingControler.getAllBookings);
router5.delete("/:id", auth_default(), bookingControler.deleteBooking);
var bookingRouter = router5;

// src/modules/review/review.router.ts
import { Router as Router6 } from "express";

// src/modules/review/review.service.ts
var createReview = async (studentId, data) => {
  const { bookingId, rating, comment } = data;
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { tutor: true }
  });
  if (!booking) throw new Error("Booking not found");
  if (booking.studentId !== studentId) throw new Error("Unauthorized");
  if (booking.status !== "COMPLETED") {
    throw new Error("Session not completed");
  }
  const existing = await prisma.review.findFirst({
    where: { bookingId }
  });
  if (existing) throw new Error("Review already submitted");
  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "COMPLETED" }
  });
  const review = await prisma.review.create({
    data: {
      studentId,
      tutorId: booking.tutorId,
      bookingId: booking.id,
      rating,
      comment
    }
  });
  const stats = await prisma.review.aggregate({
    where: { tutorId: booking.tutorId },
    _avg: { rating: true },
    _count: { rating: true }
  });
  await prisma.tutorProfile.update({
    where: { id: booking.tutorId },
    data: {
      rating: stats._avg.rating || 0,
      totalReviews: stats._count.rating
      //  isFeatured: (stats._avg.rating || 0) > 4, 
    }
  });
  return review;
};
var reviewService = {
  createReview
};

// src/modules/review/review.controler.ts
var createReview2 = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    const studentId = user.id;
    const review = await reviewService.createReview(studentId, req.body);
    return res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: review
    });
  } catch (error) {
    next(error);
  }
};
var reviewController = {
  createReview: createReview2
};

// src/modules/review/review.router.ts
var router6 = Router6();
router6.post("/", auth_default("STUDENT" /* USER */), reviewController.createReview);
var reviewRouter = router6;

// src/modules/authimtecation/authentication.router.ts
import express from "express";

// src/modules/authimtecation/authentication.service.ts
var authService = {
  async updateUserRole({ userId, name, email, role }) {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        role
      }
    });
  }
};

// src/modules/authimtecation/authentication.controler.ts
var authController = {
  async register(req, res) {
    try {
      const { userId, name, email, role } = req.body;
      const updatedUser = await authService.updateUserRole({
        userId,
        name,
        email,
        role
      });
      return res.json({
        success: true,
        user: updatedUser
      });
    } catch (error) {
      console.error("REGISTER ERROR:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to update role"
      });
    }
  }
};

// src/modules/authimtecation/authentication.router.ts
var router7 = express.Router();
router7.post("/register", authController.register);
var authenticationRouter = router7;

// src/index.ts
var app = express2();
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://mentor-hub-client-rjzhykw5a-mahbubaislams-projects.vercel.app"
    ],
    credentials: true
  })
);
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express2.json());
app.get("/", (req, res) => {
  res.send("hello world");
});
app.use("/tutors", tutorRouter);
app.use("/reviews", reviewRouter);
app.use("/categories", categoryRouter);
app.use("/bookings", bookingRouter);
app.use("/student", studentsRouter);
app.use("/auth", authenticationRouter);
app.use("/admin", adminRouter);
app.use(notFound);
app.use(errorHandler);
var index_default = app;

export {
  prisma,
  index_default
};
