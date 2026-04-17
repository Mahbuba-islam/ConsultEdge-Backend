var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/index.ts
import { Router as Router13 } from "express";

// src/modules/expertVerification/expertVerification.router.ts
import { Router } from "express";

// src/modules/expertVerification/expertVerification.validation.ts
import z from "zod";
var verifyExpertValidationSchema = z.object({
  body: z.object({
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]).refine((v) => !!v, { message: "Verification status is required" }),
    notes: z.string().optional()
  })
});

// src/middleware/cheackAuth.ts
import status3 from "http-status";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer, emailOTP } from "better-auth/plugins";

// src/config/env.ts
import dotenv from "dotenv";
import status from "http-status";

// src/errorHelpers/AppError.ts
var AppError = class extends Error {
  constructor(statusCode, message, stack = "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};
var AppError_default = AppError;

// src/config/env.ts
dotenv.config();
var loadEnvVariables = () => {
  const requiredEnvVariables = [
    "NODE_ENV",
    "PORT",
    "DATABASE_URL",
    "BETTER_AUTH_URL",
    "BETTER_AUTH_SECRET",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRY",
    "REFRESH_TOKEN_EXPIRY",
    "EMAIL_SENDER_SMTP_USER",
    "EMAIL_SENDER_SMTP_PASSWORD",
    "EMAIL_SENDER_SMTP_HOST",
    "EMAIL_SENDER_SMTP_PORT",
    "EMAIL_SENDER_SMTP_FROM",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_CALLBACK_URL",
    "FRONTEND_URL",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "ADMIN_EMAIL",
    "ADMIN_PASSWORD"
    // "BETTER_AUTH_SESSION_TOKEN_EXPIRY",
    // "BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE"
  ];
  requiredEnvVariables.forEach((variable) => {
    if (!process.env[variable]) {
      throw new AppError_default(status.INTERNAL_SERVER_ERROR, `Environment variable "${variable}" is required but missing in the .env file.`);
    }
  });
  return {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,
    EMAIL_SENDER: {
      SMTP_USER: process.env.EMAIL_SENDER_SMTP_USER,
      SMTP_PASSWORD: process.env.EMAIL_SENDER_SMTP_PASSWORD,
      SMTP_HOST: process.env.EMAIL_SENDER_SMTP_HOST,
      SMTP_PORT: process.env.EMAIL_SENDER_SMTP_PORT,
      SMTP_FROM: process.env.EMAIL_SENDER_SMTP_FROM
    },
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    FRONTEND_URL: process.env.FRONTEND_URL,
    CLOUDINARY: {
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
    },
    STRIPE: {
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET
    },
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD
    // BETTER_AUTH_SESSION_TOKEN_EXPIRY: process.env.BETTER_AUTH_SESSION_TOKEN_EXPIRY as string,
    // BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: process.env.BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE as string
  };
};
var envVars = loadEnvVariables();

// src/lib/prisma.ts
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

// src/generated/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// src/generated/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.5.0",
  "engineVersion": "280c870be64f457428992c43c1f6d557fab6e29e",
  "activeProvider": "postgresql",
  "inlineSchema": 'model Admin {\n  id            String    @id @default(uuid())\n  userId        String    @unique\n  name          String\n  email         String    @unique\n  profilePhoto  String?\n  contactNumber String?\n  isDeleted     Boolean   @default(false)\n  deletedAt     DateTime?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  @@map("admin")\n}\n\nmodel User {\n  id                 String         @id\n  name               String\n  email              String\n  emailVerified      Boolean        @default(false)\n  role               Role           @default(CLIENT)\n  status             UserStatus     @default(ACTIVE)\n  needPasswordChange Boolean        @default(false)\n  isDeleted          Boolean        @default(false)\n  deletedAt          DateTime?\n  image              String?\n  createdAt          DateTime       @default(now())\n  updatedAt          DateTime       @updatedAt\n  sessions           Session[]\n  accounts           Account[]\n  client             Client?\n  expert             Expert?\n  admin              Admin?\n  notifications      Notification[]\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel Client {\n  id           String  @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid\n  fullName     String\n  email        String  @unique\n  profilePhoto String?\n  phone        String?\n  address      String?\n\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n\n  // User Relation\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  // Relations\n  consultations Consultation[]\n  testimonials  Testimonial[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([email], name: "idx_client_email")\n  @@index([isDeleted], name: "idx_client_isDeleted")\n  @@map("clients")\n}\n\nmodel Consultation {\n  id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid\n\n  videoCallId   String             @unique @db.Uuid()\n  status        ConsultationStatus @default(PENDING)\n  paymentStatus PaymentStatus      @default(UNPAID)\n\n  date DateTime\n\n  // Relations\n  clientId String @db.Uuid\n  client   Client @relation(fields: [clientId], references: [id], onDelete: Cascade)\n\n  expertScheduleId String         @unique @db.Uuid\n  expertSchedule   ExpertSchedule @relation("ExpertScheduleToConsultation", fields: [expertScheduleId], references: [id])\n\n  payment     Payment?\n  testimonial Testimonial?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  expert    Expert?  @relation(fields: [expertId], references: [id])\n  expertId  String?  @db.Uuid\n\n  @@index([clientId])\n  @@index([expertScheduleId])\n  @@index([status])\n  @@map("consultations")\n}\n\nenum ConsultationStatus {\n  PENDING\n  CONFIRMED\n  COMPLETED\n  CANCELLED\n}\n\nenum PaymentStatus {\n  PAID\n  REFUNDED\n  FAILED\n  UNPAID\n}\n\nenum VerificationStatus {\n  PENDING\n  APPROVED\n  REJECTED\n}\n\nenum ReviewStatus {\n  PENDING\n  APPROVED\n  HIDDEN\n}\n\nenum Role {\n  ADMIN\n  EXPERT\n  CLIENT\n}\n\nenum UserStatus {\n  ACTIVE\n  BLOCKED\n  DELETED\n  SUSPENDED\n}\n\nmodel Expert {\n  id              String  @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid\n  fullName        String\n  email           String  @unique\n  profilePhoto    String?\n  phone           String?\n  bio             String?\n  title           String?\n  experience      Int     @default(0)\n  consultationFee Int\n  isVerified      Boolean @default(false)\n\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  industryId String   @db.Uuid\n  industry   Industry @relation(fields: [industryId], references: [id])\n\n  schedules     ExpertSchedule[]\n  consultations Consultation[]\n  testimonials  Testimonial[]\n  verification  ExpertVerification?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("expert")\n}\n\nmodel ExpertSchedule {\n  id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid\n\n  expertId String @db.Uuid\n  expert   Expert @relation(fields: [expertId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  scheduleId String   @db.Uuid\n  schedule   Schedule @relation(fields: [scheduleId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  consultationId String?       @db.Uuid\n  consultation   Consultation? @relation("ExpertScheduleToConsultation")\n\n  isBooked  Boolean   @default(false)\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([expertId, scheduleId])\n  @@index([expertId])\n  @@index([scheduleId])\n  @@map("expert_schedules")\n}\n\nmodel ExpertVerification {\n  id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid\n\n  expertId String @unique @db.Uuid\n  expert   Expert @relation(fields: [expertId], references: [id])\n\n  status     VerificationStatus @default(PENDING)\n  notes      String?\n  verifiedBy String?\n  verifiedAt DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("expert_verifications")\n}\n\n// model TeamMemberVerification {\n//     id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid\n\n//     teamMemberId String     @unique @db.Uuid\n//     teamMember   TeamMember @relation(fields: [teamMemberId], references: [id], onDelete: Cascade)\n\n//     status     VerificationStatus @default(PENDING)\n//     notes      String?\n//     verifiedBy String? // admin userId\n//     verifiedAt DateTime?\n\n//     createdAt DateTime @default(now())\n//     updatedAt DateTime @updatedAt\n\n//     @@map("team_member_verifications")\n// }\n\nmodel Industry {\n  id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid\n\n  name        String  @unique @db.VarChar(100)\n  description String? @db.Text\n  icon        String? @db.VarChar(255)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n\n  experts Expert[]\n\n  @@index([isDeleted], name: "idx_industry_isDeleted")\n  @@index([name], name: "idx_industry_name")\n  @@map("industries")\n}\n\nmodel Notification {\n  id        String   @id @default(uuid())\n  type      String\n  message   String\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  createdAt DateTime @default(now())\n  read      Boolean  @default(false)\n}\n\nmodel Payment {\n  id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid\n\n  consultationId String       @unique @db.Uuid\n  consultation   Consultation @relation(fields: [consultationId], references: [id], onDelete: Cascade)\n\n  amount Float\n  status PaymentStatus @default(UNPAID)\n\n  transactionId      String  @unique\n  stripeEventId      String? @unique\n  paymentGatewayData Json?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([consultationId])\n  @@index([transactionId])\n  @@map("payments")\n}\n\n// model Payment {\n//     id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid\n\n//     projectId String\n//     project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)\n\n//     clientId String\n//     client   User   @relation(fields: [clientId], references: [id])\n\n//     amount Float\n//     status PaymentStatus @default(UNPAID)\n\n//     transactionId      String  @unique\n//     stripeEventId      String? @unique\n//     paymentGatewayData Json?\n\n//     createdAt DateTime @default(now())\n//     updatedAt DateTime @updatedAt\n\n//     @@index([projectId])\n//     @@index([transactionId])\n//     @@map("payments")\n// }\n\nmodel Schedule {\n  id            String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid\n  startDateTime DateTime\n  endDateTime   DateTime\n\n  expertSchedules ExpertSchedule[]\n\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("schedules")\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../src/generated"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Testimonial {\n  id      String       @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid\n  rating  Int\n  comment String?\n  status  ReviewStatus @default(PENDING)\n\n  expertReply     String?\n  expertRepliedAt DateTime?\n\n  clientId String @db.Uuid\n  client   Client @relation(fields: [clientId], references: [id])\n\n  expertId String @db.Uuid\n  expert   Expert @relation(fields: [expertId], references: [id])\n\n  consultationId String?       @unique @db.Uuid\n  consultation   Consultation? @relation(fields: [consultationId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("testimonials")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Admin":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"contactNumber","kind":"scalar","type":"String"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"AdminToUser"}],"dbName":"admin"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"needPasswordChange","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"client","kind":"object","type":"Client","relationName":"ClientToUser"},{"name":"expert","kind":"object","type":"Expert","relationName":"ExpertToUser"},{"name":"admin","kind":"object","type":"Admin","relationName":"AdminToUser"},{"name":"notifications","kind":"object","type":"Notification","relationName":"NotificationToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Client":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"fullName","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"ClientToUser"},{"name":"consultations","kind":"object","type":"Consultation","relationName":"ClientToConsultation"},{"name":"testimonials","kind":"object","type":"Testimonial","relationName":"ClientToTestimonial"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"clients"},"Consultation":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"videoCallId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"ConsultationStatus"},{"name":"paymentStatus","kind":"enum","type":"PaymentStatus"},{"name":"date","kind":"scalar","type":"DateTime"},{"name":"clientId","kind":"scalar","type":"String"},{"name":"client","kind":"object","type":"Client","relationName":"ClientToConsultation"},{"name":"expertScheduleId","kind":"scalar","type":"String"},{"name":"expertSchedule","kind":"object","type":"ExpertSchedule","relationName":"ExpertScheduleToConsultation"},{"name":"payment","kind":"object","type":"Payment","relationName":"ConsultationToPayment"},{"name":"testimonial","kind":"object","type":"Testimonial","relationName":"ConsultationToTestimonial"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"expert","kind":"object","type":"Expert","relationName":"ConsultationToExpert"},{"name":"expertId","kind":"scalar","type":"String"}],"dbName":"consultations"},"Expert":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"fullName","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"experience","kind":"scalar","type":"Int"},{"name":"consultationFee","kind":"scalar","type":"Int"},{"name":"isVerified","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"ExpertToUser"},{"name":"industryId","kind":"scalar","type":"String"},{"name":"industry","kind":"object","type":"Industry","relationName":"ExpertToIndustry"},{"name":"schedules","kind":"object","type":"ExpertSchedule","relationName":"ExpertToExpertSchedule"},{"name":"consultations","kind":"object","type":"Consultation","relationName":"ConsultationToExpert"},{"name":"testimonials","kind":"object","type":"Testimonial","relationName":"ExpertToTestimonial"},{"name":"verification","kind":"object","type":"ExpertVerification","relationName":"ExpertToExpertVerification"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"expert"},"ExpertSchedule":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expertId","kind":"scalar","type":"String"},{"name":"expert","kind":"object","type":"Expert","relationName":"ExpertToExpertSchedule"},{"name":"scheduleId","kind":"scalar","type":"String"},{"name":"schedule","kind":"object","type":"Schedule","relationName":"ExpertScheduleToSchedule"},{"name":"consultationId","kind":"scalar","type":"String"},{"name":"consultation","kind":"object","type":"Consultation","relationName":"ExpertScheduleToConsultation"},{"name":"isBooked","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"expert_schedules"},"ExpertVerification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expertId","kind":"scalar","type":"String"},{"name":"expert","kind":"object","type":"Expert","relationName":"ExpertToExpertVerification"},{"name":"status","kind":"enum","type":"VerificationStatus"},{"name":"notes","kind":"scalar","type":"String"},{"name":"verifiedBy","kind":"scalar","type":"String"},{"name":"verifiedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"expert_verifications"},"Industry":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"icon","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"experts","kind":"object","type":"Expert","relationName":"ExpertToIndustry"}],"dbName":"industries"},"Notification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"type","kind":"scalar","type":"String"},{"name":"message","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"NotificationToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"read","kind":"scalar","type":"Boolean"}],"dbName":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"consultationId","kind":"scalar","type":"String"},{"name":"consultation","kind":"object","type":"Consultation","relationName":"ConsultationToPayment"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"stripeEventId","kind":"scalar","type":"String"},{"name":"paymentGatewayData","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"payments"},"Schedule":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"startDateTime","kind":"scalar","type":"DateTime"},{"name":"endDateTime","kind":"scalar","type":"DateTime"},{"name":"expertSchedules","kind":"object","type":"ExpertSchedule","relationName":"ExpertScheduleToSchedule"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"schedules"},"Testimonial":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"ReviewStatus"},{"name":"expertReply","kind":"scalar","type":"String"},{"name":"expertRepliedAt","kind":"scalar","type":"DateTime"},{"name":"clientId","kind":"scalar","type":"String"},{"name":"client","kind":"object","type":"Client","relationName":"ClientToTestimonial"},{"name":"expertId","kind":"scalar","type":"String"},{"name":"expert","kind":"object","type":"Expert","relationName":"ExpertToTestimonial"},{"name":"consultationId","kind":"scalar","type":"String"},{"name":"consultation","kind":"object","type":"Consultation","relationName":"ConsultationToTestimonial"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"testimonials"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","client","experts","_count","industry","schedules","consultations","expert","consultation","testimonials","verification","expertSchedules","schedule","expertSchedule","payment","testimonial","admin","notifications","Admin.findUnique","Admin.findUniqueOrThrow","Admin.findFirst","Admin.findFirstOrThrow","Admin.findMany","data","Admin.createOne","Admin.createMany","Admin.createManyAndReturn","Admin.updateOne","Admin.updateMany","Admin.updateManyAndReturn","create","update","Admin.upsertOne","Admin.deleteOne","Admin.deleteMany","having","_min","_max","Admin.groupBy","Admin.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Client.findUnique","Client.findUniqueOrThrow","Client.findFirst","Client.findFirstOrThrow","Client.findMany","Client.createOne","Client.createMany","Client.createManyAndReturn","Client.updateOne","Client.updateMany","Client.updateManyAndReturn","Client.upsertOne","Client.deleteOne","Client.deleteMany","Client.groupBy","Client.aggregate","Consultation.findUnique","Consultation.findUniqueOrThrow","Consultation.findFirst","Consultation.findFirstOrThrow","Consultation.findMany","Consultation.createOne","Consultation.createMany","Consultation.createManyAndReturn","Consultation.updateOne","Consultation.updateMany","Consultation.updateManyAndReturn","Consultation.upsertOne","Consultation.deleteOne","Consultation.deleteMany","Consultation.groupBy","Consultation.aggregate","Expert.findUnique","Expert.findUniqueOrThrow","Expert.findFirst","Expert.findFirstOrThrow","Expert.findMany","Expert.createOne","Expert.createMany","Expert.createManyAndReturn","Expert.updateOne","Expert.updateMany","Expert.updateManyAndReturn","Expert.upsertOne","Expert.deleteOne","Expert.deleteMany","_avg","_sum","Expert.groupBy","Expert.aggregate","ExpertSchedule.findUnique","ExpertSchedule.findUniqueOrThrow","ExpertSchedule.findFirst","ExpertSchedule.findFirstOrThrow","ExpertSchedule.findMany","ExpertSchedule.createOne","ExpertSchedule.createMany","ExpertSchedule.createManyAndReturn","ExpertSchedule.updateOne","ExpertSchedule.updateMany","ExpertSchedule.updateManyAndReturn","ExpertSchedule.upsertOne","ExpertSchedule.deleteOne","ExpertSchedule.deleteMany","ExpertSchedule.groupBy","ExpertSchedule.aggregate","ExpertVerification.findUnique","ExpertVerification.findUniqueOrThrow","ExpertVerification.findFirst","ExpertVerification.findFirstOrThrow","ExpertVerification.findMany","ExpertVerification.createOne","ExpertVerification.createMany","ExpertVerification.createManyAndReturn","ExpertVerification.updateOne","ExpertVerification.updateMany","ExpertVerification.updateManyAndReturn","ExpertVerification.upsertOne","ExpertVerification.deleteOne","ExpertVerification.deleteMany","ExpertVerification.groupBy","ExpertVerification.aggregate","Industry.findUnique","Industry.findUniqueOrThrow","Industry.findFirst","Industry.findFirstOrThrow","Industry.findMany","Industry.createOne","Industry.createMany","Industry.createManyAndReturn","Industry.updateOne","Industry.updateMany","Industry.updateManyAndReturn","Industry.upsertOne","Industry.deleteOne","Industry.deleteMany","Industry.groupBy","Industry.aggregate","Notification.findUnique","Notification.findUniqueOrThrow","Notification.findFirst","Notification.findFirstOrThrow","Notification.findMany","Notification.createOne","Notification.createMany","Notification.createManyAndReturn","Notification.updateOne","Notification.updateMany","Notification.updateManyAndReturn","Notification.upsertOne","Notification.deleteOne","Notification.deleteMany","Notification.groupBy","Notification.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","Schedule.findUnique","Schedule.findUniqueOrThrow","Schedule.findFirst","Schedule.findFirstOrThrow","Schedule.findMany","Schedule.createOne","Schedule.createMany","Schedule.createManyAndReturn","Schedule.updateOne","Schedule.updateMany","Schedule.updateManyAndReturn","Schedule.upsertOne","Schedule.deleteOne","Schedule.deleteMany","Schedule.groupBy","Schedule.aggregate","Testimonial.findUnique","Testimonial.findUniqueOrThrow","Testimonial.findFirst","Testimonial.findFirstOrThrow","Testimonial.findMany","Testimonial.createOne","Testimonial.createMany","Testimonial.createManyAndReturn","Testimonial.updateOne","Testimonial.updateMany","Testimonial.updateManyAndReturn","Testimonial.upsertOne","Testimonial.deleteOne","Testimonial.deleteMany","Testimonial.groupBy","Testimonial.aggregate","AND","OR","NOT","id","rating","comment","ReviewStatus","status","expertReply","expertRepliedAt","clientId","expertId","consultationId","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","startDateTime","endDateTime","isDeleted","deletedAt","every","some","none","amount","PaymentStatus","transactionId","stripeEventId","paymentGatewayData","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","type","message","userId","read","name","description","icon","VerificationStatus","notes","verifiedBy","verifiedAt","scheduleId","isBooked","fullName","email","profilePhoto","phone","bio","title","experience","consultationFee","isVerified","industryId","videoCallId","ConsultationStatus","paymentStatus","date","expertScheduleId","address","identifier","value","expiresAt","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","emailVerified","Role","role","UserStatus","needPasswordChange","image","contactNumber","expertId_scheduleId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "lAeEAfABDgMAAN8DACCPAgAA-AMAMJACAAAwABCRAgAA-AMAMJICAQAAAAGcAkAAtgMAIZ0CQAC2AwAhqwIgALcDACGsAkAAuAMAIb0CAQAAAAG_AgEAzQMAIckCAQAAAAHKAgEAzgMAIe0CAQDOAwAhAQAAAAEAIAwDAADfAwAgjwIAAIwEADCQAgAAAwAQkQIAAIwEADCSAgEAzQMAIZwCQAC2AwAhnQJAALYDACG9AgEAzQMAIdoCQAC2AwAh5AIBAM0DACHlAgEAzgMAIeYCAQDOAwAhAwMAANIFACDlAgAAjQQAIOYCAACNBAAgDAMAAN8DACCPAgAAjAQAMJACAAADABCRAgAAjAQAMJICAQAAAAGcAkAAtgMAIZ0CQAC2AwAhvQIBAM0DACHaAkAAtgMAIeQCAQAAAAHlAgEAzgMAIeYCAQDOAwAhAwAAAAMAIAEAAAQAMAIAAAUAIBEDAADfAwAgjwIAAIsEADCQAgAABwAQkQIAAIsEADCSAgEAzQMAIZwCQAC2AwAhnQJAALYDACG9AgEAzQMAIdsCAQDNAwAh3AIBAM0DACHdAgEAzgMAId4CAQDOAwAh3wIBAM4DACHgAkAAuAMAIeECQAC4AwAh4gIBAM4DACHjAgEAzgMAIQgDAADSBQAg3QIAAI0EACDeAgAAjQQAIN8CAACNBAAg4AIAAI0EACDhAgAAjQQAIOICAACNBAAg4wIAAI0EACARAwAA3wMAII8CAACLBAAwkAIAAAcAEJECAACLBAAwkgIBAAAAAZwCQAC2AwAhnQJAALYDACG9AgEAzQMAIdsCAQDNAwAh3AIBAM0DACHdAgEAzgMAId4CAQDOAwAh3wIBAM4DACHgAkAAuAMAIeECQAC4AwAh4gIBAM4DACHjAgEAzgMAIQMAAAAHACABAAAIADACAAAJACARAwAA3wMAIAsAAOADACAOAADhAwAgjwIAAN4DADCQAgAACwAQkQIAAN4DADCSAgEAtQMAIZwCQAC2AwAhnQJAALYDACGrAiAAtwMAIawCQAC4AwAhvQIBAM0DACHIAgEAzQMAIckCAQDNAwAhygIBAM4DACHLAgEAzgMAIdcCAQDOAwAhAQAAAAsAIBIGAAD8AwAgDAAA8wMAIBIAAIgEACATAACJBAAgFAAAigQAII8CAACGBAAwkAIAAA0AEJECAACGBAAwkgIBALUDACGWAgAAhwTUAiKZAgEAtQMAIZoCAQD-AwAhnAJAALYDACGdAkAAtgMAIdICAQC1AwAh1AIAAMcDsgIi1QJAALYDACHWAgEAtQMAIQYGAACoBgAgDAAAqQUAIBIAALMGACATAAC0BgAgFAAAtQYAIJoCAACNBAAgEgYAAPwDACAMAADzAwAgEgAAiAQAIBMAAIkEACAUAACKBAAgjwIAAIYEADCQAgAADQAQkQIAAIYEADCSAgEAAAABlgIAAIcE1AIimQIBALUDACGaAgEA_gMAIZwCQAC2AwAhnQJAALYDACHSAgEAAAAB1AIAAMcDsgIi1QJAALYDACHWAgEAAAABAwAAAA0AIAEAAA4AMAIAAA8AIBkDAADfAwAgCQAAhAQAIAoAALkDACALAADgAwAgDgAA4QMAIA8AAIUEACCPAgAAgwQAMJACAAARABCRAgAAgwQAMJICAQC1AwAhnAJAALYDACGdAkAAtgMAIasCIAC3AwAhrAJAALgDACG9AgEAzQMAIcgCAQDNAwAhyQIBAM0DACHKAgEAzgMAIcsCAQDOAwAhzAIBAM4DACHNAgEAzgMAIc4CAgD6AwAhzwICAPoDACHQAiAAtwMAIdECAQC1AwAhCwMAANIFACAJAACxBgAgCgAAzwQAIAsAANMFACAOAADUBQAgDwAAsgYAIKwCAACNBAAgygIAAI0EACDLAgAAjQQAIMwCAACNBAAgzQIAAI0EACAZAwAA3wMAIAkAAIQEACAKAAC5AwAgCwAA4AMAIA4AAOEDACAPAACFBAAgjwIAAIMEADCQAgAAEQAQkQIAAIMEADCSAgEAAAABnAJAALYDACGdAkAAtgMAIasCIAC3AwAhrAJAALgDACG9AgEAAAAByAIBAM0DACHJAgEAAAABygIBAM4DACHLAgEAzgMAIcwCAQDOAwAhzQIBAM4DACHOAgIA-gMAIc8CAgD6AwAh0AIgALcDACHRAgEAtQMAIQMAAAARACABAAASADACAAATACABAAAAEQAgDwwAANYDACANAAD9AwAgEQAAggQAII8CAACBBAAwkAIAABYAEJECAACBBAAwkgIBALUDACGaAgEAtQMAIZsCAQD-AwAhnAJAALYDACGdAkAAtgMAIasCIAC3AwAhrAJAALgDACHGAgEAtQMAIccCIAC3AwAhBQwAAKkFACANAADXBAAgEQAAsAYAIJsCAACNBAAgrAIAAI0EACAQDAAA1gMAIA0AAP0DACARAACCBAAgjwIAAIEEADCQAgAAFgAQkQIAAIEEADCSAgEAAAABmgIBALUDACGbAgEA_gMAIZwCQAC2AwAhnQJAALYDACGrAiAAtwMAIawCQAC4AwAhxgIBALUDACHHAiAAtwMAIe4CAACABAAgAwAAABYAIAEAABcAMAIAABgAIAMAAAANACABAAAOADACAAAPACARBgAA_AMAIAwAANYDACANAAD9AwAgjwIAAPkDADCQAgAAGwAQkQIAAPkDADCSAgEAtQMAIZMCAgD6AwAhlAIBAM4DACGWAgAA-wOWAiKXAgEAzgMAIZgCQAC4AwAhmQIBALUDACGaAgEAtQMAIZsCAQD-AwAhnAJAALYDACGdAkAAtgMAIQcGAACoBgAgDAAAqQUAIA0AANcEACCUAgAAjQQAIJcCAACNBAAgmAIAAI0EACCbAgAAjQQAIBEGAAD8AwAgDAAA1gMAIA0AAP0DACCPAgAA-QMAMJACAAAbABCRAgAA-QMAMJICAQAAAAGTAgIA-gMAIZQCAQDOAwAhlgIAAPsDlgIilwIBAM4DACGYAkAAuAMAIZkCAQC1AwAhmgIBALUDACGbAgEAAAABnAJAALYDACGdAkAAtgMAIQMAAAAbACABAAAcADACAAAdACABAAAADQAgDAwAANYDACCPAgAA1AMAMJACAAAgABCRAgAA1AMAMJICAQC1AwAhlgIAANUDwwIimgIBALUDACGcAkAAtgMAIZ0CQAC2AwAhwwIBAM4DACHEAgEAzgMAIcUCQAC4AwAhAQAAACAAIAEAAAAWACABAAAADQAgAQAAABsAIAMAAAAWACABAAAXADACAAAYACABAAAAFgAgAQAAAA0AIA0NAADJAwAgjwIAAMUDADCQAgAAKAAQkQIAAMUDADCSAgEAtQMAIZYCAADHA7ICIpsCAQC1AwAhnAJAALYDACGdAkAAtgMAIbACCADGAwAhsgIBAM0DACGzAgEAzgMAIbQCAADIAwAgAQAAACgAIAEAAAAbACABAAAAEQAgAwAAABsAIAEAABwAMAIAAB0AIAEAAAANACABAAAAGwAgAQAAABEAIA4DAADfAwAgjwIAAPgDADCQAgAAMAAQkQIAAPgDADCSAgEAzQMAIZwCQAC2AwAhnQJAALYDACGrAiAAtwMAIawCQAC4AwAhvQIBAM0DACG_AgEAzQMAIckCAQDNAwAhygIBAM4DACHtAgEAzgMAIQEAAAAwACAKAwAA3wMAII8CAAD3AwAwkAIAADIAEJECAAD3AwAwkgIBAM0DACGcAkAAtgMAIbsCAQDNAwAhvAIBAM0DACG9AgEAzQMAIb4CIAC3AwAhAQMAANIFACAKAwAA3wMAII8CAAD3AwAwkAIAADIAEJECAAD3AwAwkgIBAAAAAZwCQAC2AwAhuwIBAM0DACG8AgEAzQMAIb0CAQDNAwAhvgIgALcDACEDAAAAMgAgAQAAMwAwAgAANAAgAQAAAAMAIAEAAAAHACABAAAAMgAgAQAAAAEAIAQDAADSBQAgrAIAAI0EACDKAgAAjQQAIO0CAACNBAAgAwAAADAAIAEAADoAMAIAAAEAIAMAAAAwACABAAA6ADACAAABACADAAAAMAAgAQAAOgAwAgAAAQAgCwMAAK8GACCSAgEAAAABnAJAAAAAAZ0CQAAAAAGrAiAAAAABrAJAAAAAAb0CAQAAAAG_AgEAAAAByQIBAAAAAcoCAQAAAAHtAgEAAAABARwAAD4AIAqSAgEAAAABnAJAAAAAAZ0CQAAAAAGrAiAAAAABrAJAAAAAAb0CAQAAAAG_AgEAAAAByQIBAAAAAcoCAQAAAAHtAgEAAAABARwAAEAAMAEcAABAADALAwAArgYAIJICAQCTBAAhnAJAAJgEACGdAkAAmAQAIasCIACiBAAhrAJAAJcEACG9AgEAkwQAIb8CAQCTBAAhyQIBAJMEACHKAgEAlQQAIe0CAQCVBAAhAgAAAAEAIBwAAEMAIAqSAgEAkwQAIZwCQACYBAAhnQJAAJgEACGrAiAAogQAIawCQACXBAAhvQIBAJMEACG_AgEAkwQAIckCAQCTBAAhygIBAJUEACHtAgEAlQQAIQIAAAAwACAcAABFACACAAAAMAAgHAAARQAgAwAAAAEAICMAAD4AICQAAEMAIAEAAAABACABAAAAMAAgBggAAKsGACApAACtBgAgKgAArAYAIKwCAACNBAAgygIAAI0EACDtAgAAjQQAIA2PAgAA9gMAMJACAABMABCRAgAA9gMAMJICAQC-AwAhnAJAAKADACGdAkAAoAMAIasCIACxAwAhrAJAAJ4DACG9AgEAvgMAIb8CAQC-AwAhyQIBAL4DACHKAgEAnAMAIe0CAQCcAwAhAwAAADAAIAEAAEsAMCgAAEwAIAMAAAAwACABAAA6ADACAAABACAVBAAA8AMAIAUAAPEDACAGAADyAwAgDAAA8wMAIBUAAPQDACAWAAD1AwAgjwIAAO0DADCQAgAAUgAQkQIAAO0DADCSAgEAAAABlgIAAO8D6wIinAJAALYDACGdAkAAtgMAIasCIAC3AwAhrAJAALgDACG_AgEAzQMAIckCAQAAAAHnAiAAtwMAIekCAADuA-kCIusCIAC3AwAh7AIBAM4DACEBAAAATwAgAQAAAE8AIBUEAADwAwAgBQAA8QMAIAYAAPIDACAMAADzAwAgFQAA9AMAIBYAAPUDACCPAgAA7QMAMJACAABSABCRAgAA7QMAMJICAQDNAwAhlgIAAO8D6wIinAJAALYDACGdAkAAtgMAIasCIAC3AwAhrAJAALgDACG_AgEAzQMAIckCAQDNAwAh5wIgALcDACHpAgAA7gPpAiLrAiAAtwMAIewCAQDOAwAhCAQAAKYGACAFAACnBgAgBgAAqAYAIAwAAKkFACAVAACpBgAgFgAAqgYAIKwCAACNBAAg7AIAAI0EACADAAAAUgAgAQAAUwAwAgAATwAgAwAAAFIAIAEAAFMAMAIAAE8AIAMAAABSACABAABTADACAABPACASBAAAoAYAIAUAAKEGACAGAACiBgAgDAAAowYAIBUAAKQGACAWAAClBgAgkgIBAAAAAZYCAAAA6wICnAJAAAAAAZ0CQAAAAAGrAiAAAAABrAJAAAAAAb8CAQAAAAHJAgEAAAAB5wIgAAAAAekCAAAA6QIC6wIgAAAAAewCAQAAAAEBHAAAVwAgDJICAQAAAAGWAgAAAOsCApwCQAAAAAGdAkAAAAABqwIgAAAAAawCQAAAAAG_AgEAAAAByQIBAAAAAecCIAAAAAHpAgAAAOkCAusCIAAAAAHsAgEAAAABARwAAFkAMAEcAABZADASBAAA5wUAIAUAAOgFACAGAADpBQAgDAAA6gUAIBUAAOsFACAWAADsBQAgkgIBAJMEACGWAgAA5gXrAiKcAkAAmAQAIZ0CQACYBAAhqwIgAKIEACGsAkAAlwQAIb8CAQCTBAAhyQIBAJMEACHnAiAAogQAIekCAADlBekCIusCIACiBAAh7AIBAJUEACECAAAATwAgHAAAXAAgDJICAQCTBAAhlgIAAOYF6wIinAJAAJgEACGdAkAAmAQAIasCIACiBAAhrAJAAJcEACG_AgEAkwQAIckCAQCTBAAh5wIgAKIEACHpAgAA5QXpAiLrAiAAogQAIewCAQCVBAAhAgAAAFIAIBwAAF4AIAIAAABSACAcAABeACADAAAATwAgIwAAVwAgJAAAXAAgAQAAAE8AIAEAAABSACAFCAAA4gUAICkAAOQFACAqAADjBQAgrAIAAI0EACDsAgAAjQQAIA-PAgAA5gMAMJACAABlABCRAgAA5gMAMJICAQC-AwAhlgIAAOgD6wIinAJAAKADACGdAkAAoAMAIasCIACxAwAhrAJAAJ4DACG_AgEAvgMAIckCAQC-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-AwAhnAJAAKADACGdAkAAoAMAIdgCAQC-AwAh2QIBAL4DACHaAkAAoAMAIQMAAACXAQAgAQAAqQEAMCgAAKoBACADAAAAlwEAIAEAAJgBADACAACUAQAgEQMAAN8DACALAADgAwAgDgAA4QMAII8CAADeAwAwkAIAAAsAEJECAADeAwAwkgIBAAAAAZwCQAC2AwAhnQJAALYDACGrAiAAtwMAIawCQAC4AwAhvQIBAAAAAcgCAQDNAwAhyQIBAAAAAcoCAQDOAwAhywIBAM4DACHXAgEAzgMAIQEAAACtAQAgAQAAAK0BACAHAwAA0gUAIAsAANMFACAOAADUBQAgrAIAAI0EACDKAgAAjQQAIMsCAACNBAAg1wIAAI0EACADAAAACwAgAQAAsAEAMAIAAK0BACADAAAACwAgAQAAsAEAMAIAAK0BACADAAAACwAgAQAAsAEAMAIAAK0BACAOAwAAzwUAIAsAANAFACAOAADRBQAgkgIBAAAAAZwCQAAAAAGdAkAAAAABqwIgAAAAAawCQAAAAAG9AgEAAAAByAIBAAAAAckCAQAAAAHKAgEAAAABywIBAAAAAdcCAQAAAAEBHAAAtAEAIAuSAgEAAAABnAJAAAAAAZ0CQAAAAAGrAiAAAAABrAJAAAAAAb0CAQAAAAHIAgEAAAAByQIBAAAAAcoCAQAAAAHLAgEAAAAB1wIBAAAAAQEcAAC2AQAwARwAALYBADAOAwAAugUAIAsAALsFACAOAAC8BQAgkgIBAJMEACGcAkAAmAQAIZ0CQACYBAAhqwIgAKIEACGsAkAAlwQAIb0CAQCTBAAhyAIBAJMEACHJAgEAkwQAIcoCAQCVBAAhywIBAJUEACHXAgEAlQQAIQIAAACtAQAgHAAAuQEAIAuSAgEAkwQAIZwCQACYBAAhnQJAAJgEACGrAiAAogQAIawCQACXBAAhvQIBAJMEACHIAgEAkwQAIckCAQCTBAAhygIBAJUEACHLAgEAlQQAIdcCAQCVBAAhAgAAAAsAIBwAALsBACACAAAACwAgHAAAuwEAIAMAAACtAQAgIwAAtAEAICQAALkBACABAAAArQEAIAEAAAALACAHCAAAtwUAICkAALkFACAqAAC4BQAgrAIAAI0EACDKAgAAjQQAIMsCAACNBAAg1wIAAI0EACAOjwIAAN0DADCQAgAAwgEAEJECAADdAwAwkgIBAJoDACGcAkAAoAMAIZ0CQACgAwAhqwIgALEDACGsAkAAngMAIb0CAQC-AwAhyAIBAL4DACHJAgEAvgMAIcoCAQCcAwAhywIBAJwDACHXAgEAnAMAIQMAAAALACABAADBAQAwKAAAwgEAIAMAAAALACABAACwAQAwAgAArQEAIAEAAAAPACABAAAADwAgAwAAAA0AIAEAAA4AMAIAAA8AIAMAAAANACABAAAOADACAAAPACADAAAADQAgAQAADgAwAgAADwAgDwYAAMcEACAMAADKBAAgEgAAkAUAIBMAAMgEACAUAADJBAAgkgIBAAAAAZYCAAAA1AICmQIBAAAAAZoCAQAAAAGcAkAAAAABnQJAAAAAAdICAQAAAAHUAgAAALICAtUCQAAAAAHWAgEAAAABARwAAMoBACAKkgIBAAAAAZYCAAAA1AICmQIBAAAAAZoCAQAAAAGcAkAAAAABnQJAAAAAAdICAQAAAAHUAgAAALICAtUCQAAAAAHWAgEAAAABARwAAMwBADABHAAAzAEAMAEAAAARACAPBgAAuAQAIAwAALsEACASAACOBQAgEwAAuQQAIBQAALoEACCSAgEAkwQAIZYCAAC2BNQCIpkCAQCTBAAhmgIBAJUEACGcAkAAmAQAIZ0CQACYBAAh0gIBAJMEACHUAgAAtwSyAiLVAkAAmAQAIdYCAQCTBAAhAgAAAA8AIBwAANABACAKkgIBAJMEACGWAgAAtgTUAiKZAgEAkwQAIZoCAQCVBAAhnAJAAJgEACGdAkAAmAQAIdICAQCTBAAh1AIAALcEsgIi1QJAAJgEACHWAgEAkwQAIQIAAAANACAcAADSAQAgAgAAAA0AIBwAANIBACABAAAAEQAgAwAAAA8AICMAAMoBACAkAADQAQAgAQAAAA8AIAEAAAANACAECAAAtAUAICkAALYFACAqAAC1BQAgmgIAAI0EACANjwIAANkDADCQAgAA2gEAEJECAADZAwAwkgIBAJoDACGWAgAA2gPUAiKZAgEAmgMAIZoCAQCfAwAhnAJAAKADACGdAkAAoAMAIdICAQCaAwAh1AIAAL0DsgIi1QJAAKADACHWAgEAmgMAIQMAAAANACABAADZAQAwKAAA2gEAIAMAAAANACABAAAOADACAAAPACABAAAAEwAgAQAAABMAIAMAAAARACABAAASADACAAATACADAAAAEQAgAQAAEgAwAgAAEwAgAwAAABEAIAEAABIAMAIAABMAIBYDAACdBQAgCQAAswUAIAoAAJ4FACALAACfBQAgDgAAoAUAIA8AAKEFACCSAgEAAAABnAJAAAAAAZ0CQAAAAAGrAiAAAAABrAJAAAAAAb0CAQAAAAHIAgEAAAAByQIBAAAAAcoCAQAAAAHLAgEAAAABzAIBAAAAAc0CAQAAAAHOAgIAAAABzwICAAAAAdACIAAAAAHRAgEAAAABARwAAOIBACAQkgIBAAAAAZwCQAAAAAGdAkAAAAABqwIgAAAAAawCQAAAAAG9AgEAAAAByAIBAAAAAckCAQAAAAHKAgEAAAABywIBAAAAAcwCAQAAAAHNAgEAAAABzgICAAAAAc8CAgAAAAHQAiAAAAAB0QIBAAAAAQEcAADkAQAwARwAAOQBADAWAwAA7AQAIAkAALIFACAKAADtBAAgCwAA7gQAIA4AAO8EACAPAADwBAAgkgIBAJMEACGcAkAAmAQAIZ0CQACYBAAhqwIgAKIEACGsAkAAlwQAIb0CAQCTBAAhyAIBAJMEACHJAgEAkwQAIcoCAQCVBAAhywIBAJUEACHMAgEAlQQAIc0CAQCVBAAhzgICAJQEACHPAgIAlAQAIdACIACiBAAh0QIBAJMEACECAAAAEwAgHAAA5wEAIBCSAgEAkwQAIZwCQACYBAAhnQJAAJgEACGrAiAAogQAIawCQACXBAAhvQIBAJMEACHIAgEAkwQAIckCAQCTBAAhygIBAJUEACHLAgEAlQQAIcwCAQCVBAAhzQIBAJUEACHOAgIAlAQAIc8CAgCUBAAh0AIgAKIEACHRAgEAkwQAIQIAAAARACAcAADpAQAgAgAAABEAIBwAAOkBACADAAAAEwAgIwAA4gEAICQAAOcBACABAAAAEwAgAQAAABEAIAoIAACtBQAgKQAAsAUAICoAAK8FACCbAQAArgUAIJwBAACxBQAgrAIAAI0EACDKAgAAjQQAIMsCAACNBAAgzAIAAI0EACDNAgAAjQQAIBOPAgAA2AMAMJACAADwAQAQkQIAANgDADCSAgEAmgMAIZwCQACgAwAhnQJAAKADACGrAiAAsQMAIawCQACeAwAhvQIBAL4DACHIAgEAvgMAIckCAQC-AwAhygIBAJwDACHLAgEAnAMAIcwCAQCcAwAhzQIBAJwDACHOAgIAmwMAIc8CAgCbAwAh0AIgALEDACHRAgEAmgMAIQMAAAARACABAADvAQAwKAAA8AEAIAMAAAARACABAAASADACAAATACABAAAAGAAgAQAAABgAIAMAAAAWACABAAAXADACAAAYACADAAAAFgAgAQAAFwAwAgAAGAAgAwAAABYAIAEAABcAMAIAABgAIAwMAADMBAAgDQAAzQQAIBEAAJsFACCSAgEAAAABmgIBAAAAAZsCAQAAAAGcAkAAAAABnQJAAAAAAasCIAAAAAGsAkAAAAABxgIBAAAAAccCIAAAAAEBHAAA-AEAIAmSAgEAAAABmgIBAAAAAZsCAQAAAAGcAkAAAAABnQJAAAAAAasCIAAAAAGsAkAAAAABxgIBAAAAAccCIAAAAAEBHAAA-gEAMAEcAAD6AQAwDAwAAK8EACANAACwBAAgEQAAmQUAIJICAQCTBAAhmgIBAJMEACGbAgEAlQQAIZwCQACYBAAhnQJAAJgEACGrAiAAogQAIawCQACXBAAhxgIBAJMEACHHAiAAogQAIQIAAAAYACAcAAD9AQAgCZICAQCTBAAhmgIBAJMEACGbAgEAlQQAIZwCQACYBAAhnQJAAJgEACGrAiAAogQAIawCQACXBAAhxgIBAJMEACHHAiAAogQAIQIAAAAWACAcAAD_AQAgAgAAABYAIBwAAP8BACADAAAAGAAgIwAA-AEAICQAAP0BACABAAAAGAAgAQAAABYAIAUIAACqBQAgKQAArAUAICoAAKsFACCbAgAAjQQAIKwCAACNBAAgDI8CAADXAwAwkAIAAIYCABCRAgAA1wMAMJICAQCaAwAhmgIBAJoDACGbAgEAnwMAIZwCQACgAwAhnQJAAKADACGrAiAAsQMAIawCQACeAwAhxgIBAJoDACHHAiAAsQMAIQMAAAAWACABAACFAgAwKAAAhgIAIAMAAAAWACABAAAXADACAAAYACAMDAAA1gMAII8CAADUAwAwkAIAACAAEJECAADUAwAwkgIBAAAAAZYCAADVA8MCIpoCAQAAAAGcAkAAtgMAIZ0CQAC2AwAhwwIBAM4DACHEAgEAzgMAIcUCQAC4AwAhAQAAAIkCACABAAAAiQIAIAQMAACpBQAgwwIAAI0EACDEAgAAjQQAIMUCAACNBAAgAwAAACAAIAEAAIwCADACAACJAgAgAwAAACAAIAEAAIwCADACAACJAgAgAwAAACAAIAEAAIwCADACAACJAgAgCQwAAKgFACCSAgEAAAABlgIAAADDAgKaAgEAAAABnAJAAAAAAZ0CQAAAAAHDAgEAAAABxAIBAAAAAcUCQAAAAAEBHAAAkAIAIAiSAgEAAAABlgIAAADDAgKaAgEAAAABnAJAAAAAAZ0CQAAAAAHDAgEAAAABxAIBAAAAAcUCQAAAAAEBHAAAkgIAMAEcAACSAgAwCQwAAKcFACCSAgEAkwQAIZYCAAD2BMMCIpoCAQCTBAAhnAJAAJgEACGdAkAAmAQAIcMCAQCVBAAhxAIBAJUEACHFAkAAlwQAIQIAAACJAgAgHAAAlQIAIAiSAgEAkwQAIZYCAAD2BMMCIpoCAQCTBAAhnAJAAJgEACGdAkAAmAQAIcMCAQCVBAAhxAIBAJUEACHFAkAAlwQAIQIAAAAgACAcAACXAgAgAgAAACAAIBwAAJcCACADAAAAiQIAICMAAJACACAkAACVAgAgAQAAAIkCACABAAAAIAAgBggAAKQFACApAACmBQAgKgAApQUAIMMCAACNBAAgxAIAAI0EACDFAgAAjQQAIAuPAgAA0AMAMJACAACeAgAQkQIAANADADCSAgEAmgMAIZYCAADRA8MCIpoCAQCaAwAhnAJAAKADACGdAkAAoAMAIcMCAQCcAwAhxAIBAJwDACHFAkAAngMAIQMAAAAgACABAACdAgAwKAAAngIAIAMAAAAgACABAACMAgAwAgAAiQIAIAwHAADPAwAgjwIAAMwDADCQAgAApAIAEJECAADMAwAwkgIBAAAAAZwCQAC2AwAhnQJAALYDACGrAiAAtwMAIawCQAC4AwAhvwIBAAAAAcACAQDOAwAhwQIBAM4DACEBAAAAoQIAIAEAAAChAgAgDAcAAM8DACCPAgAAzAMAMJACAACkAgAQkQIAAMwDADCSAgEAtQMAIZwCQAC2AwAhnQJAALYDACGrAiAAtwMAIawCQAC4AwAhvwIBAM0DACHAAgEAzgMAIcECAQDOAwAhBAcAAKMFACCsAgAAjQQAIMACAACNBAAgwQIAAI0EACADAAAApAIAIAEAAKUCADACAAChAgAgAwAAAKQCACABAAClAgAwAgAAoQIAIAMAAACkAgAgAQAApQIAMAIAAKECACAJBwAAogUAIJICAQAAAAGcAkAAAAABnQJAAAAAAasCIAAAAAGsAkAAAAABvwIBAAAAAcACAQAAAAHBAgEAAAABARwAAKkCACAIkgIBAAAAAZwCQAAAAAGdAkAAAAABqwIgAAAAAawCQAAAAAG_AgEAAAABwAIBAAAAAcECAQAAAAEBHAAAqwIAMAEcAACrAgAwCQcAAOAEACCSAgEAkwQAIZwCQACYBAAhnQJAAJgEACGrAiAAogQAIawCQACXBAAhvwIBAJMEACHAAgEAlQQAIcECAQCVBAAhAgAAAKECACAcAACuAgAgCJICAQCTBAAhnAJAAJgEACGdAkAAmAQAIasCIACiBAAhrAJAAJcEACG_AgEAkwQAIcACAQCVBAAhwQIBAJUEACECAAAApAIAIBwAALACACACAAAApAIAIBwAALACACADAAAAoQIAICMAAKkCACAkAACuAgAgAQAAAKECACABAAAApAIAIAYIAADdBAAgKQAA3wQAICoAAN4EACCsAgAAjQQAIMACAACNBAAgwQIAAI0EACALjwIAAMsDADCQAgAAtwIAEJECAADLAwAwkgIBAJoDACGcAkAAoAMAIZ0CQACgAwAhqwIgALEDACGsAkAAngMAIb8CAQC-AwAhwAIBAJwDACHBAgEAnAMAIQMAAACkAgAgAQAAtgIAMCgAALcCACADAAAApAIAIAEAAKUCADACAAChAgAgAQAAADQAIAEAAAA0ACADAAAAMgAgAQAAMwAwAgAANAAgAwAAADIAIAEAADMAMAIAADQAIAMAAAAyACABAAAzADACAAA0ACAHAwAA3AQAIJICAQAAAAGcAkAAAAABuwIBAAAAAbwCAQAAAAG9AgEAAAABvgIgAAAAAQEcAAC_AgAgBpICAQAAAAGcAkAAAAABuwIBAAAAAbwCAQAAAAG9AgEAAAABvgIgAAAAAQEcAADBAgAwARwAAMECADAHAwAA2wQAIJICAQCTBAAhnAJAAJgEACG7AgEAkwQAIbwCAQCTBAAhvQIBAJMEACG-AiAAogQAIQIAAAA0ACAcAADEAgAgBpICAQCTBAAhnAJAAJgEACG7AgEAkwQAIbwCAQCTBAAhvQIBAJMEACG-AiAAogQAIQIAAAAyACAcAADGAgAgAgAAADIAIBwAAMYCACADAAAANAAgIwAAvwIAICQAAMQCACABAAAANAAgAQAAADIAIAMIAADYBAAgKQAA2gQAICoAANkEACAJjwIAAMoDADCQAgAAzQIAEJECAADKAwAwkgIBAL4DACGcAkAAoAMAIbsCAQC-AwAhvAIBAL4DACG9AgEAvgMAIb4CIACxAwAhAwAAADIAIAEAAMwCADAoAADNAgAgAwAAADIAIAEAADMAMAIAADQAIA0NAADJAwAgjwIAAMUDADCQAgAAKAAQkQIAAMUDADCSAgEAAAABlgIAAMcDsgIimwIBAAAAAZwCQAC2AwAhnQJAALYDACGwAggAxgMAIbICAQAAAAGzAgEAAAABtAIAAMgDACABAAAA0AIAIAEAAADQAgAgAw0AANcEACCzAgAAjQQAILQCAACNBAAgAwAAACgAIAEAANMCADACAADQAgAgAwAAACgAIAEAANMCADACAADQAgAgAwAAACgAIAEAANMCADACAADQAgAgCg0AANYEACCSAgEAAAABlgIAAACyAgKbAgEAAAABnAJAAAAAAZ0CQAAAAAGwAggAAAABsgIBAAAAAbMCAQAAAAG0AoAAAAABARwAANcCACAJkgIBAAAAAZYCAAAAsgICmwIBAAAAAZwCQAAAAAGdAkAAAAABsAIIAAAAAbICAQAAAAGzAgEAAAABtAKAAAAAAQEcAADZAgAwARwAANkCADAKDQAA1QQAIJICAQCTBAAhlgIAALcEsgIimwIBAJMEACGcAkAAmAQAIZ0CQACYBAAhsAIIAMYEACGyAgEAkwQAIbMCAQCVBAAhtAKAAAAAAQIAAADQAgAgHAAA3AIAIAmSAgEAkwQAIZYCAAC3BLICIpsCAQCTBAAhnAJAAJgEACGdAkAAmAQAIbACCADGBAAhsgIBAJMEACGzAgEAlQQAIbQCgAAAAAECAAAAKAAgHAAA3gIAIAIAAAAoACAcAADeAgAgAwAAANACACAjAADXAgAgJAAA3AIAIAEAAADQAgAgAQAAACgAIAcIAADQBAAgKQAA0wQAICoAANIEACCbAQAA0QQAIJwBAADUBAAgswIAAI0EACC0AgAAjQQAIAyPAgAAuwMAMJACAADlAgAQkQIAALsDADCSAgEAmgMAIZYCAAC9A7ICIpsCAQCaAwAhnAJAAKADACGdAkAAoAMAIbACCAC8AwAhsgIBAL4DACGzAgEAnAMAIbQCAAC_AwAgAwAAACgAIAEAAOQCADAoAADlAgAgAwAAACgAIAEAANMCADACAADQAgAgCxAAALkDACCPAgAAtAMAMJACAADrAgAQkQIAALQDADCSAgEAAAABnAJAALYDACGdAkAAtgMAIakCQAC2AwAhqgJAALYDACGrAiAAtwMAIawCQAC4AwAhAQAAAOgCACABAAAA6AIAIAsQAAC5AwAgjwIAALQDADCQAgAA6wIAEJECAAC0AwAwkgIBALUDACGcAkAAtgMAIZ0CQAC2AwAhqQJAALYDACGqAkAAtgMAIasCIAC3AwAhrAJAALgDACECEAAAzwQAIKwCAACNBAAgAwAAAOsCACABAADsAgAwAgAA6AIAIAMAAADrAgAgAQAA7AIAMAIAAOgCACADAAAA6wIAIAEAAOwCADACAADoAgAgCBAAAM4EACCSAgEAAAABnAJAAAAAAZ0CQAAAAAGpAkAAAAABqgJAAAAAAasCIAAAAAGsAkAAAAABARwAAPACACAHkgIBAAAAAZwCQAAAAAGdAkAAAAABqQJAAAAAAaoCQAAAAAGrAiAAAAABrAJAAAAAAQEcAADyAgAwARwAAPICADAIEAAAowQAIJICAQCTBAAhnAJAAJgEACGdAkAAmAQAIakCQACYBAAhqgJAAJgEACGrAiAAogQAIawCQACXBAAhAgAAAOgCACAcAAD1AgAgB5ICAQCTBAAhnAJAAJgEACGdAkAAmAQAIakCQACYBAAhqgJAAJgEACGrAiAAogQAIawCQACXBAAhAgAAAOsCACAcAAD3AgAgAgAAAOsCACAcAAD3AgAgAwAAAOgCACAjAADwAgAgJAAA9QIAIAEAAADoAgAgAQAAAOsCACAECAAAnwQAICkAAKEEACAqAACgBAAgrAIAAI0EACAKjwIAALADADCQAgAA_gIAEJECAACwAwAwkgIBAJoDACGcAkAAoAMAIZ0CQACgAwAhqQJAAKADACGqAkAAoAMAIasCIACxAwAhrAJAAJ4DACEDAAAA6wIAIAEAAP0CADAoAAD-AgAgAwAAAOsCACABAADsAgAwAgAA6AIAIAEAAAAdACABAAAAHQAgAwAAABsAIAEAABwAMAIAAB0AIAMAAAAbACABAAAcADACAAAdACADAAAAGwAgAQAAHAAwAgAAHQAgDgYAAJwEACAMAACdBAAgDQAAngQAIJICAQAAAAGTAgIAAAABlAIBAAAAAZYCAAAAlgIClwIBAAAAAZgCQAAAAAGZAgEAAAABmgIBAAAAAZsCAQAAAAGcAkAAAAABnQJAAAAAAQEcAACGAwAgC5ICAQAAAAGTAgIAAAABlAIBAAAAAZYCAAAAlgIClwIBAAAAAZgCQAAAAAGZAgEAAAABmgIBAAAAAZsCAQAAAAGcAkAAAAABnQJAAAAAAQEcAACIAwAwARwAAIgDADABAAAADQAgDgYAAJkEACAMAACaBAAgDQAAmwQAIJICAQCTBAAhkwICAJQEACGUAgEAlQQAIZYCAACWBJYCIpcCAQCVBAAhmAJAAJcEACGZAgEAkwQAIZoCAQCTBAAhmwIBAJUEACGcAkAAmAQAIZ0CQACYBAAhAgAAAB0AIBwAAIwDACALkgIBAJMEACGTAgIAlAQAIZQCAQCVBAAhlgIAAJYElgIilwIBAJUEACGYAkAAlwQAIZkCAQCTBAAhmgIBAJMEACGbAgEAlQQAIZwCQACYBAAhnQJAAJgEACECAAAAGwAgHAAAjgMAIAIAAAAbACAcAACOAwAgAQAAAA0AIAMAAAAdACAjAACGAwAgJAAAjAMAIAEAAAAdACABAAAAGwAgCQgAAI4EACApAACRBAAgKgAAkAQAIJsBAACPBAAgnAEAAJIEACCUAgAAjQQAIJcCAACNBAAgmAIAAI0EACCbAgAAjQQAIA6PAgAAmQMAMJACAACWAwAQkQIAAJkDADCSAgEAmgMAIZMCAgCbAwAhlAIBAJwDACGWAgAAnQOWAiKXAgEAnAMAIZgCQACeAwAhmQIBAJoDACGaAgEAmgMAIZsCAQCfAwAhnAJAAKADACGdAkAAoAMAIQMAAAAbACABAACVAwAwKAAAlgMAIAMAAAAbACABAAAcADACAAAdACAOjwIAAJkDADCQAgAAlgMAEJECAACZAwAwkgIBAJoDACGTAgIAmwMAIZQCAQCcAwAhlgIAAJ0DlgIilwIBAJwDACGYAkAAngMAIZkCAQCaAwAhmgIBAJoDACGbAgEAnwMAIZwCQACgAwAhnQJAAKADACELCAAAogMAICkAAK8DACAqAACvAwAgngIBAAAAAZ8CAQAAAASgAgEAAAAEoQIBAAAAAaICAQAAAAGjAgEAAAABpAIBAAAAAaUCAQCuAwAhDQgAAKIDACApAACiAwAgKgAAogMAIJsBAACtAwAgnAEAAKIDACCeAgIAAAABnwICAAAABKACAgAAAAShAgIAAAABogICAAAAAaMCAgAAAAGkAgIAAAABpQICAKwDACEOCAAApQMAICkAAKYDACAqAACmAwAgngIBAAAAAZ8CAQAAAAWgAgEAAAAFoQIBAAAAAaICAQAAAAGjAgEAAAABpAIBAAAAAaUCAQCrAwAhpgIBAAAAAacCAQAAAAGoAgEAAAABBwgAAKIDACApAACqAwAgKgAAqgMAIJ4CAAAAlgICnwIAAACWAgigAgAAAJYCCKUCAACpA5YCIgsIAAClAwAgKQAAqAMAICoAAKgDACCeAkAAAAABnwJAAAAABaACQAAAAAWhAkAAAAABogJAAAAAAaMCQAAAAAGkAkAAAAABpQJAAKcDACELCAAApQMAICkAAKYDACAqAACmAwAgngIBAAAAAZ8CAQAAAAWgAgEAAAAFoQIBAAAAAaICAQAAAAGjAgEAAAABpAIBAAAAAaUCAQCkAwAhCwgAAKIDACApAACjAwAgKgAAowMAIJ4CQAAAAAGfAkAAAAAEoAJAAAAABKECQAAAAAGiAkAAAAABowJAAAAAAaQCQAAAAAGlAkAAoQMAIQsIAACiAwAgKQAAowMAICoAAKMDACCeAkAAAAABnwJAAAAABKACQAAAAAShAkAAAAABogJAAAAAAaMCQAAAAAGkAkAAAAABpQJAAKEDACEIngICAAAAAZ8CAgAAAASgAgIAAAAEoQICAAAAAaICAgAAAAGjAgIAAAABpAICAAAAAaUCAgCiAwAhCJ4CQAAAAAGfAkAAAAAEoAJAAAAABKECQAAAAAGiAkAAAAABowJAAAAAAaQCQAAAAAGlAkAAowMAIQsIAAClAwAgKQAApgMAICoAAKYDACCeAgEAAAABnwIBAAAABaACAQAAAAWhAgEAAAABogIBAAAAAaMCAQAAAAGkAgEAAAABpQIBAKQDACEIngICAAAAAZ8CAgAAAAWgAgIAAAAFoQICAAAAAaICAgAAAAGjAgIAAAABpAICAAAAAaUCAgClAwAhC54CAQAAAAGfAgEAAAAFoAIBAAAABaECAQAAAAGiAgEAAAABowIBAAAAAaQCAQAAAAGlAgEApgMAIaYCAQAAAAGnAgEAAAABqAIBAAAAAQsIAAClAwAgKQAAqAMAICoAAKgDACCeAkAAAAABnwJAAAAABaACQAAAAAWhAkAAAAABogJAAAAAAaMCQAAAAAGkAkAAAAABpQJAAKcDACEIngJAAAAAAZ8CQAAAAAWgAkAAAAAFoQJAAAAAAaICQAAAAAGjAkAAAAABpAJAAAAAAaUCQACoAwAhBwgAAKIDACApAACqAwAgKgAAqgMAIJ4CAAAAlgICnwIAAACWAgigAgAAAJYCCKUCAACpA5YCIgSeAgAAAJYCAp8CAAAAlgIIoAIAAACWAgilAgAAqgOWAiIOCAAApQMAICkAAKYDACAqAACmAwAgngIBAAAAAZ8CAQAAAAWgAgEAAAAFoQIBAAAAAaICAQAAAAGjAgEAAAABpAIBAAAAAaUCAQCrAwAhpgIBAAAAAacCAQAAAAGoAgEAAAABDQgAAKIDACApAACiAwAgKgAAogMAIJsBAACtAwAgnAEAAKIDACCeAgIAAAABnwICAAAABKACAgAAAAShAgIAAAABogICAAAAAaMCAgAAAAGkAgIAAAABpQICAKwDACEIngIIAAAAAZ8CCAAAAASgAggAAAAEoQIIAAAAAaICCAAAAAGjAggAAAABpAIIAAAAAaUCCACtAwAhCwgAAKIDACApAACvAwAgKgAArwMAIJ4CAQAAAAGfAgEAAAAEoAIBAAAABKECAQAAAAGiAgEAAAABowIBAAAAAaQCAQAAAAGlAgEArgMAIQueAgEAAAABnwIBAAAABKACAQAAAAShAgEAAAABogIBAAAAAaMCAQAAAAGkAgEAAAABpQIBAK8DACGmAgEAAAABpwIBAAAAAagCAQAAAAEKjwIAALADADCQAgAA_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_AgEAvgMAIcACAQCcAwAhwQIBAJwDACEMBwAAzwMAII8CAADMAwAwkAIAAKQCABCRAgAAzAMAMJICAQC1AwAhnAJAALYDACGdAkAAtgMAIasCIAC3AwAhrAJAALgDACG_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_AgEAzQMAIckCAQDNAwAh5wIgALcDACHpAgAA7gPpAiLrAiAAtwMAIewCAQDOAwAh7wIAAFIAIPACAABSACADrQIAAA0AIK4CAAANACCvAgAADQAgA60CAAAbACCuAgAAGwAgrwIAABsAIAmPAgAA4gMAMJACAACqAQAQkQIAAOIDADCSAgEAvgMAIZwCQACgAwAhnQJAAKADACHYAgEAvgMAIdkCAQC-AwAh2gJAAKADACEJjwIAAOMDADCQAgAAlwEAEJECAADjAwAwkgIBAM0DACGcAkAAtgMAIZ0CQAC2AwAh2AIBAM0DACHZAgEAzQMAIdoCQAC2AwAhEI8CAADkAwAwkAIAAJEBABCRAgAA5AMAMJICAQC-AwAhnAJAAKADACGdAkAAoAMAIb0CAQC-AwAh2wIBAL4DACHcAgEAvgMAId0CAQCcAwAh3gIBAJwDACHfAgEAnAMAIeACQACeAwAh4QJAAJ4DACHiAgEAnAMAIeMCAQCcAwAhC48CAADlAwAwkAIAAHsAEJECAADlAwAwkgIBAL4DACGcAkAAoAMAIZ0CQACgAwAhvQIBAL4DACHaAkAAoAMAIeQCAQC-AwAh5QIBAJwDACHmAgEAnAMAIQ-PAgAA5gMAMJACAABlABCRAgAA5gMAMJICAQC-AwAhlgIAAOgD6wIinAJAAKADACGdAkAAoAMAIasCIACxAwAhrAJAAJ4DACG_AgEAvgMAIckCAQC-AwAh5wIgALEDACHpAgAA5wPpAiLrAiAAsQMAIewCAQCcAwAhBwgAAKIDACApAADsAwAgKgAA7AMAIJ4CAAAA6QICnwIAAADpAgigAgAAAOkCCKUCAADrA-kCIgcIAACiAwAgKQAA6gMAICoAAOoDACCeAgAAAOsCAp8CAAAA6wIIoAIAAADrAgilAgAA6QPrAiIHCAAAogMAICkAAOoDACAqAADqAwAgngIAAADrAgKfAgAAAOsCCKACAAAA6wIIpQIAAOkD6wIiBJ4CAAAA6wICnwIAAADrAgigAgAAAOsCCKUCAADqA-sCIgcIAACiAwAgKQAA7AMAICoAAOwDACCeAgAAAOkCAp8CAAAA6QIIoAIAAADpAgilAgAA6wPpAiIEngIAAADpAgKfAgAAAOkCCKACAAAA6QIIpQIAAOwD6QIiFQQAAPADACAFAADxAwAgBgAA8gMAIAwAAPMDACAVAAD0AwAgFgAA9QMAII8CAADtAwAwkAIAAFIAEJECAADtAwAwkgIBAM0DACGWAgAA7wPrAiKcAkAAtgMAIZ0CQAC2AwAhqwIgALcDACGsAkAAuAMAIb8CAQDNAwAhyQIBAM0DACHnAiAAtwMAIekCAADuA-kCIusCIAC3AwAh7AIBAM4DACEEngIAAADpAgKfAgAAAOkCCKACAAAA6QIIpQIAAOwD6QIiBJ4CAAAA6wICnwIAAADrAgigAgAAAOsCCKUCAADqA-sCIgOtAgAAAwAgrgIAAAMAIK8CAAADACADrQIAAAcAIK4CAAAHACCvAgAABwAgEwMAAN8DACALAADgAwAgDgAA4QMAII8CAADeAwAwkAIAAAsAEJECAADeAwAwkgIBALUDACGcAkAAtgMAIZ0CQAC2AwAhqwIgALcDACGsAkAAuAMAIb0CAQDNAwAhyAIBAM0DACHJAgEAzQMAIcoCAQDOAwAhywIBAM4DACHXAgEAzgMAIe8CAAALACDwAgAACwAgGwMAAN8DACAJAACEBAAgCgAAuQMAIAsAAOADACAOAADhAwAgDwAAhQQAII8CAACDBAAwkAIAABEAEJECAACDBAAwkgIBALUDACGcAkAAtgMAIZ0CQAC2AwAhqwIgALcDACGsAkAAuAMAIb0CAQDNAwAhyAIBAM0DACHJAgEAzQMAIcoCAQDOAwAhywIBAM4DACHMAgEAzgMAIc0CAQDOAwAhzgICAPoDACHPAgIA-gMAIdACIAC3AwAh0QIBALUDACHvAgAAEQAg8AIAABEAIBADAADfAwAgjwIAAPgDADCQAgAAMAAQkQIAAPgDADCSAgEAzQMAIZwCQAC2AwAhnQJAALYDACGrAiAAtwMAIawCQAC4AwAhvQIBAM0DACG_AgEAzQMAIckCAQDNAwAhygIBAM4DACHtAgEAzgMAIe8CAAAwACDwAgAAMAAgA60CAAAyACCuAgAAMgAgrwIAADIAIA2PAgAA9gMAMJACAABMABCRAgAA9gMAMJICAQC-AwAhnAJAAKADACGdAkAAoAMAIasCIACxAwAhrAJAAJ4DACG9AgEAvgMAIb8CAQC-AwAhyQIBAL4DACHKAgEAnAMAIe0CAQCcAwAhCgMAAN8DACCPAgAA9wMAMJACAAAyABCRAgAA9wMAMJICAQDNAwAhnAJAALYDACG7AgEAzQMAIbwCAQDNAwAhvQIBAM0DACG-AiAAtwMAIQ4DAADfAwAgjwIAAPgDADCQAgAAMAAQkQIAAPgDADCSAgEAzQMAIZwCQAC2AwAhnQJAALYDACGrAiAAtwMAIawCQAC4AwAhvQIBAM0DACG_AgEAzQMAIckCAQDNAwAhygIBAM4DACHtAgEAzgMAIREGAAD8AwAgDAAA1gMAIA0AAP0DACCPAgAA-QMAMJACAAAbABCRAgAA-QMAMJICAQC1AwAhkwICAPoDACGUAgEAzgMAIZYCAAD7A5YCIpcCAQDOAwAhmAJAALgDACGZAgEAtQMAIZoCAQC1AwAhmwIBAP4DACGcAkAAtgMAIZ0CQAC2AwAhCJ4CAgAAAAGfAgIAAAAEoAICAAAABKECAgAAAAGiAgIAAAABowICAAAAAaQCAgAAAAGlAgIAogMAIQSeAgAAAJYCAp8CAAAAlgIIoAIAAACWAgilAgAAqgOWAiITAwAA3wMAIAsAAOADACAOAADhAwAgjwIAAN4DADCQAgAACwAQkQIAAN4DADCSAgEAtQMAIZwCQAC2AwAhnQJAALYDACGrAiAAtwMAIawCQAC4AwAhvQIBAM0DACHIAgEAzQMAIckCAQDNAwAhygIBAM4DACHLAgEAzgMAIdcCAQDOAwAh7wIAAAsAIPACAAALACAUBgAA_AMAIAwAAPMDACASAACIBAAgEwAAiQQAIBQAAIoEACCPAgAAhgQAMJACAAANABCRAgAAhgQAMJICAQC1AwAhlgIAAIcE1AIimQIBALUDACGaAgEA_gMAIZwCQAC2AwAhnQJAALYDACHSAgEAtQMAIdQCAADHA7ICItUCQAC2AwAh1gIBALUDACHvAgAADQAg8AIAAA0AIAieAgEAAAABnwIBAAAABaACAQAAAAWhAgEAAAABogIBAAAAAaMCAQAAAAGkAgEAAAABpQIBAP8DACEIngIBAAAAAZ8CAQAAAAWgAgEAAAAFoQIBAAAAAaICAQAAAAGjAgEAAAABpAIBAAAAAaUCAQD_AwAhApoCAQAAAAHGAgEAAAABDwwAANYDACANAAD9AwAgEQAAggQAII8CAACBBAAwkAIAABYAEJECAACBBAAwkgIBALUDACGaAgEAtQMAIZsCAQD-AwAhnAJAALYDACGdAkAAtgMAIasCIAC3AwAhrAJAALgDACHGAgEAtQMAIccCIAC3AwAhDRAAALkDACCPAgAAtAMAMJACAADrAgAQkQIAALQDADCSAgEAtQMAIZwCQAC2AwAhnQJAALYDACGpAkAAtgMAIaoCQAC2AwAhqwIgALcDACGsAkAAuAMAIe8CAADrAgAg8AIAAOsCACAZAwAA3wMAIAkAAIQEACAKAAC5AwAgCwAA4AMAIA4AAOEDACAPAACFBAAgjwIAAIMEADCQAgAAEQAQkQIAAIMEADCSAgEAtQMAIZwCQAC2AwAhnQJAALYDACGrAiAAtwMAIawCQAC4AwAhvQIBAM0DACHIAgEAzQMAIckCAQDNAwAhygIBAM4DACHLAgEAzgMAIcwCAQDOAwAhzQIBAM4DACHOAgIA-gMAIc8CAgD6AwAh0AIgALcDACHRAgEAtQMAIQ4HAADPAwAgjwIAAMwDADCQAgAApAIAEJECAADMAwAwkgIBALUDACGcAkAAtgMAIZ0CQAC2AwAhqwIgALcDACGsAkAAuAMAIb8CAQDNAwAhwAIBAM4DACHBAgEAzgMAIe8CAACkAgAg8AIAAKQCACAODAAA1gMAII8CAADUAwAwkAIAACAAEJECAADUAwAwkgIBALUDACGWAgAA1QPDAiKaAgEAtQMAIZwCQAC2AwAhnQJAALYDACHDAgEAzgMAIcQCAQDOAwAhxQJAALgDACHvAgAAIAAg8AIAACAAIBIGAAD8AwAgDAAA8wMAIBIAAIgEACATAACJBAAgFAAAigQAII8CAACGBAAwkAIAAA0AEJECAACGBAAwkgIBALUDACGWAgAAhwTUAiKZAgEAtQMAIZoCAQD-AwAhnAJAALYDACGdAkAAtgMAIdICAQC1AwAh1AIAAMcDsgIi1QJAALYDACHWAgEAtQMAIQSeAgAAANQCAp8CAAAA1AIIoAIAAADUAgilAgAA3APUAiIRDAAA1gMAIA0AAP0DACARAACCBAAgjwIAAIEEADCQAgAAFgAQkQIAAIEEADCSAgEAtQMAIZoCAQC1AwAhmwIBAP4DACGcAkAAtgMAIZ0CQAC2AwAhqwIgALcDACGsAkAAuAMAIcYCAQC1AwAhxwIgALcDACHvAgAAFgAg8AIAABYAIA8NAADJAwAgjwIAAMUDADCQAgAAKAAQkQIAAMUDADCSAgEAtQMAIZYCAADHA7ICIpsCAQC1AwAhnAJAALYDACGdAkAAtgMAIbACCADGAwAhsgIBAM0DACGzAgEAzgMAIbQCAADIAwAg7wIAACgAIPACAAAoACATBgAA_AMAIAwAANYDACANAAD9AwAgjwIAAPkDADCQAgAAGwAQkQIAAPkDADCSAgEAtQMAIZMCAgD6AwAhlAIBAM4DACGWAgAA-wOWAiKXAgEAzgMAIZgCQAC4AwAhmQIBALUDACGaAgEAtQMAIZsCAQD-AwAhnAJAALYDACGdAkAAtgMAIe8CAAAbACDwAgAAGwAgEQMAAN8DACCPAgAAiwQAMJACAAAHABCRAgAAiwQAMJICAQDNAwAhnAJAALYDACGdAkAAtgMAIb0CAQDNAwAh2wIBAM0DACHcAgEAzQMAId0CAQDOAwAh3gIBAM4DACHfAgEAzgMAIeACQAC4AwAh4QJAALgDACHiAgEAzgMAIeMCAQDOAwAhDAMAAN8DACCPAgAAjAQAMJACAAADABCRAgAAjAQAMJICAQDNAwAhnAJAALYDACGdAkAAtgMAIb0CAQDNAwAh2gJAALYDACHkAgEAzQMAIeUCAQDOAwAh5gIBAM4DACEAAAAAAAAB9AIBAAAAAQX0AgIAAAAB-gICAAAAAfsCAgAAAAH8AgIAAAAB_QICAAAAAQH0AgEAAAABAfQCAAAAlgICAfQCQAAAAAEB9AJAAAAAAQUjAACKBwAgJAAAkwcAIPECAACLBwAg8gIAAJIHACD3AgAArQEAIAUjAACIBwAgJAAAkAcAIPECAACJBwAg8gIAAI8HACD3AgAAEwAgByMAAIYHACAkAACNBwAg8QIAAIcHACDyAgAAjAcAIPUCAAANACD2AgAADQAg9wIAAA8AIAMjAACKBwAg8QIAAIsHACD3AgAArQEAIAMjAACIBwAg8QIAAIkHACD3AgAAEwAgAyMAAIYHACDxAgAAhwcAIPcCAAAPACAAAAAB9AIgAAAAAQsjAACkBAAwJAAAqQQAMPECAAClBAAw8gIAAKYEADDzAgAApwQAIPQCAACoBAAw9QIAAKgEADD2AgAAqAQAMPcCAACoBAAw-AIAAKoEADD5AgAAqwQAMAoMAADMBAAgDQAAzQQAIJICAQAAAAGaAgEAAAABmwIBAAAAAZwCQAAAAAGdAkAAAAABqwIgAAAAAawCQAAAAAHHAiAAAAABAgAAABgAICMAAMsEACADAAAAGAAgIwAAywQAICQAAK4EACABHAAAhQcAMBAMAADWAwAgDQAA_QMAIBEAAIIEACCPAgAAgQQAMJACAAAWABCRAgAAgQQAMJICAQAAAAGaAgEAtQMAIZsCAQD-AwAhnAJAALYDACGdAkAAtgMAIasCIAC3AwAhrAJAALgDACHGAgEAtQMAIccCIAC3AwAh7gIAAIAEACACAAAAGAAgHAAArgQAIAIAAACsBAAgHAAArQQAIAyPAgAAqwQAMJACAACsBAAQkQIAAKsEADCSAgEAtQMAIZoCAQC1AwAhmwIBAP4DACGcAkAAtgMAIZ0CQAC2AwAhqwIgALcDACGsAkAAuAMAIcYCAQC1AwAhxwIgALcDACEMjwIAAKsEADCQAgAArAQAEJECAACrBAAwkgIBALUDACGaAgEAtQMAIZsCAQD-AwAhnAJAALYDACGdAkAAtgMAIasCIAC3AwAhrAJAALgDACHGAgEAtQMAIccCIAC3AwAhCJICAQCTBAAhmgIBAJMEACGbAgEAlQQAIZwCQACYBAAhnQJAAJgEACGrAiAAogQAIawCQACXBAAhxwIgAKIEACEKDAAArwQAIA0AALAEACCSAgEAkwQAIZoCAQCTBAAhmwIBAJUEACGcAkAAmAQAIZ0CQACYBAAhqwIgAKIEACGsAkAAlwQAIccCIACiBAAhBSMAAPYGACAkAACDBwAg8QIAAPcGACDyAgAAggcAIPcCAAATACAHIwAAsQQAICQAALQEACDxAgAAsgQAIPICAACzBAAg9QIAAA0AIPYCAAANACD3AgAADwAgDQYAAMcEACAMAADKBAAgEwAAyAQAIBQAAMkEACCSAgEAAAABlgIAAADUAgKZAgEAAAABmgIBAAAAAZwCQAAAAAGdAkAAAAAB0gIBAAAAAdQCAAAAsgIC1QJAAAAAAQIAAAAPACAjAACxBAAgAwAAAA0AICMAALEEACAkAAC1BAAgDwAAAA0AIAYAALgEACAMAAC7BAAgEwAAuQQAIBQAALoEACAcAAC1BAAgkgIBAJMEACGWAgAAtgTUAiKZAgEAkwQAIZoCAQCVBAAhnAJAAJgEACGdAkAAmAQAIdICAQCTBAAh1AIAALcEsgIi1QJAAJgEACENBgAAuAQAIAwAALsEACATAAC5BAAgFAAAugQAIJICAQCTBAAhlgIAALYE1AIimQIBAJMEACGaAgEAlQQAIZwCQACYBAAhnQJAAJgEACHSAgEAkwQAIdQCAAC3BLICItUCQACYBAAhAfQCAAAA1AICAfQCAAAAsgICBSMAAPoGACAkAACABwAg8QIAAPsGACDyAgAA_wYAIPcCAACtAQAgByMAAMEEACAkAADEBAAg8QIAAMIEACDyAgAAwwQAIPUCAAAoACD2AgAAKAAg9wIAANACACAHIwAAvAQAICQAAL8EACDxAgAAvQQAIPICAAC-BAAg9QIAABsAIPYCAAAbACD3AgAAHQAgByMAAPgGACAkAAD9BgAg8QIAAPkGACDyAgAA_AYAIPUCAAARACD2AgAAEQAg9wIAABMAIAwGAACcBAAgDAAAnQQAIJICAQAAAAGTAgIAAAABlAIBAAAAAZYCAAAAlgIClwIBAAAAAZgCQAAAAAGZAgEAAAABmgIBAAAAAZwCQAAAAAGdAkAAAAABAgAAAB0AICMAALwEACADAAAAGwAgIwAAvAQAICQAAMAEACAOAAAAGwAgBgAAmQQAIAwAAJoEACAcAADABAAgkgIBAJMEACGTAgIAlAQAIZQCAQCVBAAhlgIAAJYElgIilwIBAJUEACGYAkAAlwQAIZkCAQCTBAAhmgIBAJMEACGcAkAAmAQAIZ0CQACYBAAhDAYAAJkEACAMAACaBAAgkgIBAJMEACGTAgIAlAQAIZQCAQCVBAAhlgIAAJYElgIilwIBAJUEACGYAkAAlwQAIZkCAQCTBAAhmgIBAJMEACGcAkAAmAQAIZ0CQACYBAAhCJICAQAAAAGWAgAAALICApwCQAAAAAGdAkAAAAABsAIIAAAAAbICAQAAAAGzAgEAAAABtAKAAAAAAQIAAADQAgAgIwAAwQQAIAMAAAAoACAjAADBBAAgJAAAxQQAIAoAAAAoACAcAADFBAAgkgIBAJMEACGWAgAAtwSyAiKcAkAAmAQAIZ0CQACYBAAhsAIIAMYEACGyAgEAkwQAIbMCAQCVBAAhtAKAAAAAAQiSAgEAkwQAIZYCAAC3BLICIpwCQACYBAAhnQJAAJgEACGwAggAxgQAIbICAQCTBAAhswIBAJUEACG0AoAAAAABBfQCCAAAAAH6AggAAAAB-wIIAAAAAfwCCAAAAAH9AggAAAABAyMAAPoGACDxAgAA-wYAIPcCAACtAQAgAyMAAMEEACDxAgAAwgQAIPcCAADQAgAgAyMAALwEACDxAgAAvQQAIPcCAAAdACADIwAA-AYAIPECAAD5BgAg9wIAABMAIAoMAADMBAAgDQAAzQQAIJICAQAAAAGaAgEAAAABmwIBAAAAAZwCQAAAAAGdAkAAAAABqwIgAAAAAawCQAAAAAHHAiAAAAABAyMAAPYGACDxAgAA9wYAIPcCAAATACADIwAAsQQAIPECAACyBAAg9wIAAA8AIAQjAACkBAAw8QIAAKUEADDzAgAApwQAIPcCAACoBAAwAAAAAAAABSMAAPEGACAkAAD0BgAg8QIAAPIGACDyAgAA8wYAIPcCAAAPACADIwAA8QYAIPECAADyBgAg9wIAAA8AIAYGAACoBgAgDAAAqQUAIBIAALMGACATAAC0BgAgFAAAtQYAIJoCAACNBAAgAAAABSMAAOwGACAkAADvBgAg8QIAAO0GACDyAgAA7gYAIPcCAABPACADIwAA7AYAIPECAADtBgAg9wIAAE8AIAAAAAsjAADhBAAwJAAA5gQAMPECAADiBAAw8gIAAOMEADDzAgAA5AQAIPQCAADlBAAw9QIAAOUEADD2AgAA5QQAMPcCAADlBAAw-AIAAOcEADD5AgAA6AQAMBQDAACdBQAgCgAAngUAIAsAAJ8FACAOAACgBQAgDwAAoQUAIJICAQAAAAGcAkAAAAABnQJAAAAAAasCIAAAAAGsAkAAAAABvQIBAAAAAcgCAQAAAAHJAgEAAAABygIBAAAAAcsCAQAAAAHMAgEAAAABzQIBAAAAAc4CAgAAAAHPAgIAAAAB0AIgAAAAAQIAAAATACAjAACcBQAgAwAAABMAICMAAJwFACAkAADrBAAgARwAAOsGADAZAwAA3wMAIAkAAIQEACAKAAC5AwAgCwAA4AMAIA4AAOEDACAPAACFBAAgjwIAAIMEADCQAgAAEQAQkQIAAIMEADCSAgEAAAABnAJAALYDACGdAkAAtgMAIasCIAC3AwAhrAJAALgDACG9AgEAAAAByAIBAM0DACHJAgEAAAABygIBAM4DACHLAgEAzgMAIcwCAQDOAwAhzQIBAM4DACHOAgIA-gMAIc8CAgD6AwAh0AIgALcDACHRAgEAtQMAIQIAAAATACAcAADrBAAgAgAAAOkEACAcAADqBAAgE48CAADoBAAwkAIAAOkEABCRAgAA6AQAMJICAQC1AwAhnAJAALYDACGdAkAAtgMAIasCIAC3AwAhrAJAALgDACG9AgEAzQMAIcgCAQDNAwAhyQIBAM0DACHKAgEAzgMAIcsCAQDOAwAhzAIBAM4DACHNAgEAzgMAIc4CAgD6AwAhzwICAPoDACHQAiAAtwMAIdECAQC1AwAhE48CAADoBAAwkAIAAOkEABCRAgAA6AQAMJICAQC1AwAhnAJAALYDACGdAkAAtgMAIasCIAC3AwAhrAJAALgDACG9AgEAzQMAIcgCAQDNAwAhyQIBAM0DACHKAgEAzgMAIcsCAQDOAwAhzAIBAM4DACHNAgEAzgMAIc4CAgD6AwAhzwICAPoDACHQAiAAtwMAIdECAQC1AwAhD5ICAQCTBAAhnAJAAJgEACGdAkAAmAQAIasCIACiBAAhrAJAAJcEACG9AgEAkwQAIcgCAQCTBAAhyQIBAJMEACHKAgEAlQQAIcsCAQCVBAAhzAIBAJUEACHNAgEAlQQAIc4CAgCUBAAhzwICAJQEACHQAiAAogQAIRQDAADsBAAgCgAA7QQAIAsAAO4EACAOAADvBAAgDwAA8AQAIJICAQCTBAAhnAJAAJgEACGdAkAAmAQAIasCIACiBAAhrAJAAJcEACG9AgEAkwQAIcgCAQCTBAAhyQIBAJMEACHKAgEAlQQAIcsCAQCVBAAhzAIBAJUEACHNAgEAlQQAIc4CAgCUBAAhzwICAJQEACHQAiAAogQAIQUjAADZBgAgJAAA6QYAIPECAADaBgAg8gIAAOgGACD3AgAATwAgCyMAAJEFADAkAACVBQAw8QIAAJIFADDyAgAAkwUAMPMCAACUBQAg9AIAAKgEADD1AgAAqAQAMPYCAACoBAAw9wIAAKgEADD4AgAAlgUAMPkCAACrBAAwCyMAAIMFADAkAACIBQAw8QIAAIQFADDyAgAAhQUAMPMCAACGBQAg9AIAAIcFADD1AgAAhwUAMPYCAACHBQAw9wIAAIcFADD4AgAAiQUAMPkCAACKBQAwCyMAAPcEADAkAAD8BAAw8QIAAPgEADDyAgAA-QQAMPMCAAD6BAAg9AIAAPsEADD1AgAA-wQAMPYCAAD7BAAw9wIAAPsEADD4AgAA_QQAMPkCAAD-BAAwByMAAPEEACAkAAD0BAAg8QIAAPIEACDyAgAA8wQAIPUCAAAgACD2AgAAIAAg9wIAAIkCACAHkgIBAAAAAZYCAAAAwwICnAJAAAAAAZ0CQAAAAAHDAgEAAAABxAIBAAAAAcUCQAAAAAECAAAAiQIAICMAAPEEACADAAAAIAAgIwAA8QQAICQAAPUEACAJAAAAIAAgHAAA9QQAIJICAQCTBAAhlgIAAPYEwwIinAJAAJgEACGdAkAAmAQAIcMCAQCVBAAhxAIBAJUEACHFAkAAlwQAIQeSAgEAkwQAIZYCAAD2BMMCIpwCQACYBAAhnQJAAJgEACHDAgEAlQQAIcQCAQCVBAAhxQJAAJcEACEB9AIAAADDAgIMBgAAnAQAIA0AAJ4EACCSAgEAAAABkwICAAAAAZQCAQAAAAGWAgAAAJYCApcCAQAAAAGYAkAAAAABmQIBAAAAAZsCAQAAAAGcAkAAAAABnQJAAAAAAQIAAAAdACAjAACCBQAgAwAAAB0AICMAAIIFACAkAACBBQAgARwAAOcGADARBgAA_AMAIAwAANYDACANAAD9AwAgjwIAAPkDADCQAgAAGwAQkQIAAPkDADCSAgEAAAABkwICAPoDACGUAgEAzgMAIZYCAAD7A5YCIpcCAQDOAwAhmAJAALgDACGZAgEAtQMAIZoCAQC1AwAhmwIBAAAAAZwCQAC2AwAhnQJAALYDACECAAAAHQAgHAAAgQUAIAIAAAD_BAAgHAAAgAUAIA6PAgAA_gQAMJACAAD_BAAQkQIAAP4EADCSAgEAtQMAIZMCAgD6AwAhlAIBAM4DACGWAgAA-wOWAiKXAgEAzgMAIZgCQAC4AwAhmQIBALUDACGaAgEAtQMAIZsCAQD-AwAhnAJAALYDACGdAkAAtgMAIQ6PAgAA_gQAMJACAAD_BAAQkQIAAP4EADCSAgEAtQMAIZMCAgD6AwAhlAIBAM4DACGWAgAA-wOWAiKXAgEAzgMAIZgCQAC4AwAhmQIBALUDACGaAgEAtQMAIZsCAQD-AwAhnAJAALYDACGdAkAAtgMAIQqSAgEAkwQAIZMCAgCUBAAhlAIBAJUEACGWAgAAlgSWAiKXAgEAlQQAIZgCQACXBAAhmQIBAJMEACGbAgEAlQQAIZwCQACYBAAhnQJAAJgEACEMBgAAmQQAIA0AAJsEACCSAgEAkwQAIZMCAgCUBAAhlAIBAJUEACGWAgAAlgSWAiKXAgEAlQQAIZgCQACXBAAhmQIBAJMEACGbAgEAlQQAIZwCQACYBAAhnQJAAJgEACEMBgAAnAQAIA0AAJ4EACCSAgEAAAABkwICAAAAAZQCAQAAAAGWAgAAAJYCApcCAQAAAAGYAkAAAAABmQIBAAAAAZsCAQAAAAGcAkAAAAABnQJAAAAAAQ0GAADHBAAgEgAAkAUAIBMAAMgEACAUAADJBAAgkgIBAAAAAZYCAAAA1AICmQIBAAAAAZwCQAAAAAGdAkAAAAAB0gIBAAAAAdQCAAAAsgIC1QJAAAAAAdYCAQAAAAECAAAADwAgIwAAjwUAIAMAAAAPACAjAACPBQAgJAAAjQUAIAEcAADmBgAwEgYAAPwDACAMAADzAwAgEgAAiAQAIBMAAIkEACAUAACKBAAgjwIAAIYEADCQAgAADQAQkQIAAIYEADCSAgEAAAABlgIAAIcE1AIimQIBALUDACGaAgEA_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-wQAMPcCAAD7BAAw-AIAAMIFADD5AgAA_gQAMAwMAACdBAAgDQAAngQAIJICAQAAAAGTAgIAAAABlAIBAAAAAZYCAAAAlgIClwIBAAAAAZgCQAAAAAGaAgEAAAABmwIBAAAAAZwCQAAAAAGdAkAAAAABAgAAAB0AICMAAMUFACADAAAAHQAgIwAAxQUAICQAAMQFACABHAAAywYAMAIAAAAdACAcAADEBQAgAgAAAP8EACAcAADDBQAgCpICAQCTBAAhkwICAJQEACGUAgEAlQQAIZYCAACWBJYCIpcCAQCVBAAhmAJAAJcEACGaAgEAkwQAIZsCAQCVBAAhnAJAAJgEACGdAkAAmAQAIQwMAACaBAAgDQAAmwQAIJICAQCTBAAhkwICAJQEACGUAgEAlQQAIZYCAACWBJYCIpcCAQCVBAAhmAJAAJcEACGaAgEAkwQAIZsCAQCVBAAhnAJAAJgEACGdAkAAmAQAIQwMAACdBAAgDQAAngQAIJICAQAAAAGTAgIAAAABlAIBAAAAAZYCAAAAlgIClwIBAAAAAZgCQAAAAAGaAgEAAAABmwIBAAAAAZwCQAAAAAGdAkAAAAABDQwAAMoEACASAACQBQAgEwAAyAQAIBQAAMkEACCSAgEAAAABlgIAAADUAgKaAgEAAAABnAJAAAAAAZ0CQAAAAAHSAgEAAAAB1AIAAACyAgLVAkAAAAAB1gIBAAAAAQIAAAAPACAjAADOBQAgAwAAAA8AICMAAM4FACAkAADNBQAgARwAAMoGADACAAAADwAgHAAAzQUAIAIAAACLBQAgHAAAzAUAIAmSAgEAkwQAIZYCAAC2BNQCIpoCAQCVBAAhnAJAAJgEACGdAkAAmAQAIdICAQCTBAAh1AIAALcEsgIi1QJAAJgEACHWAgEAkwQAIQ0MAAC7BAAgEgAAjgUAIBMAALkEACAUAAC6BAAgkgIBAJMEACGWAgAAtgTUAiKaAgEAlQQAIZwCQACYBAAhnQJAAJgEACHSAgEAkwQAIdQCAAC3BLICItUCQACYBAAh1gIBAJMEACENDAAAygQAIBIAAJAFACATAADIBAAgFAAAyQQAIJICAQAAAAGWAgAAANQCApoCAQAAAAGcAkAAAAABnQJAAAAAAdICAQAAAAHUAgAAALICAtUCQAAAAAHWAgEAAAABAyMAAMgGACDxAgAAyQYAIPcCAABPACAEIwAAxgUAMPECAADHBQAw8wIAAMkFACD3AgAAhwUAMAQjAAC9BQAw8QIAAL4FADDzAgAAwAUAIPcCAAD7BAAwCAQAAKYGACAFAACnBgAgBgAAqAYAIAwAAKkFACAVAACpBgAgFgAAqgYAIKwCAACNBAAg7AIAAI0EACAAAAAAAAAAAAUjAADDBgAgJAAAxgYAIPECAADEBgAg8gIAAMUGACD3AgAATwAgAyMAAMMGACDxAgAAxAYAIPcCAABPACAAAAAFIwAAvgYAICQAAMEGACDxAgAAvwYAIPICAADABgAg9wIAAE8AIAMjAAC-BgAg8QIAAL8GACD3AgAATwAgAAAAAfQCAAAA6QICAfQCAAAA6wICCyMAAJQGADAkAACZBgAw8QIAAJUGADDyAgAAlgYAMPMCAACXBgAg9AIAAJgGADD1AgAAmAYAMPYCAACYBgAw9wIAAJgGADD4AgAAmgYAMPkCAACbBgAwCyMAAIgGADAkAACNBgAw8QIAAIkGADDyAgAAigYAMPMCAACLBgAg9AIAAIwGADD1AgAAjAYAMPYCAACMBgAw9wIAAIwGADD4AgAAjgYAMPkCAACPBgAwByMAAIMGACAkAACGBgAg8QIAAIQGACDyAgAAhQYAIPUCAAALACD2AgAACwAg9wIAAK0BACAHIwAA_gUAICQAAIEGACDxAgAA_wUAIPICAACABgAg9QIAABEAIPYCAAARACD3AgAAEwAgByMAAPkFACAkAAD8BQAg8QIAAPoFACDyAgAA-wUAIPUCAAAwACD2AgAAMAAg9wIAAAEAIAsjAADtBQAwJAAA8gUAMPECAADuBQAw8gIAAO8FADDzAgAA8AUAIPQCAADxBQAw9QIAAPEFADD2AgAA8QUAMPcCAADxBQAw-AIAAPMFADD5AgAA9AUAMAWSAgEAAAABnAJAAAAAAbsCAQAAAAG8AgEAAAABvgIgAAAAAQIAAAA0ACAjAAD4BQAgAwAAADQAICMAAPgFACAkAAD3BQAgARwAAL0GADAKAwAA3wMAII8CAAD3AwAwkAIAADIAEJECAAD3AwAwkgIBAAAAAZwCQAC2AwAhuwIBAM0DACG8AgEAzQMAIb0CAQDNAwAhvgIgALcDACECAAAANAAgHAAA9wUAIAIAAAD1BQAgHAAA9gUAIAmPAgAA9AUAMJACAAD1BQAQkQIAAPQFADCSAgEAzQMAIZwCQAC2AwAhuwIBAM0DACG8AgEAzQMAIb0CAQDNAwAhvgIgALcDACEJjwIAAPQFADCQAgAA9QUAEJECAAD0BQAwkgIBAM0DACGcAkAAtgMAIbsCAQDNAwAhvAIBAM0DACG9AgEAzQMAIb4CIAC3AwAhBZICAQCTBAAhnAJAAJgEACG7AgEAkwQAIbwCAQCTBAAhvgIgAKIEACEFkgIBAJMEACGcAkAAmAQAIbsCAQCTBAAhvAIBAJMEACG-AiAAogQAIQWSAgEAAAABnAJAAAAAAbsCAQAAAAG8AgEAAAABvgIgAAAAAQmSAgEAAAABnAJAAAAAAZ0CQAAAAAGrAiAAAAABrAJAAAAAAb8CAQAAAAHJAgEAAAABygIBAAAAAe0CAQAAAAECAAAAAQAgIwAA-QUAIAMAAAAwACAjAAD5BQAgJAAA_QUAIAsAAAAwACAcAAD9BQAgkgIBAJMEACGcAkAAmAQAIZ0CQACYBAAhqwIgAKIEACGsAkAAlwQAIb8CAQCTBAAhyQIBAJMEACHKAgEAlQQAIe0CAQCVBAAhCZICAQCTBAAhnAJAAJgEACGdAkAAmAQAIasCIACiBAAhrAJAAJcEACG_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_AgEAkwQAIckCAQCTBAAh5wIgAKIEACHpAgAA5QXpAiLrAiAAogQAIewCAQCVBAAhEQQAAOcFACAFAADoBQAgBgAA6QUAIAwAAOoFACAWAADsBQAgkgIBAJMEACGWAgAA5gXrAiKcAkAAmAQAIZ0CQACYBAAhqwIgAKIEACGsAkAAlwQAIb8CAQCTBAAhyQIBAJMEACHnAiAAogQAIekCAADlBekCIusCIACiBAAh7AIBAJUEACEHkgIBAAAAAZwCQAAAAAGdAkAAAAAB2gJAAAAAAeQCAQAAAAHlAgEAAAAB5gIBAAAAAQySAgEAAAABnAJAAAAAAZ0CQAAAAAHbAgEAAAAB3AIBAAAAAd0CAQAAAAHeAgEAAAAB3wIBAAAAAeACQAAAAAHhAkAAAAAB4gIBAAAAAeMCAQAAAAEFkgIBAAAAAZwCQAAAAAG7AgEAAAABvAIBAAAAAb4CIAAAAAERBQAAoQYAIAYAAKIGACAMAACjBgAgFQAApAYAIBYAAKUGACCSAgEAAAABlgIAAADrAgKcAkAAAAABnQJAAAAAAasCIAAAAAGsAkAAAAABvwIBAAAAAckCAQAAAAHnAiAAAAAB6QIAAADpAgLrAiAAAAAB7AIBAAAAAQIAAABPACAjAAC-BgAgAwAAAFIAICMAAL4GACAkAADCBgAgEwAAAFIAIAUAAOgFACAGAADpBQAgDAAA6gUAIBUAAOsFACAWAADsBQAgHAAAwgYAIJICAQCTBAAhlgIAAOYF6wIinAJAAJgEACGdAkAAmAQAIasCIACiBAAhrAJAAJcEACG_AgEAkwQAIckCAQCTBAAh5wIgAKIEACHpAgAA5QXpAiLrAiAAogQAIewCAQCVBAAhEQUAAOgFACAGAADpBQAgDAAA6gUAIBUAAOsFACAWAADsBQAgkgIBAJMEACGWAgAA5gXrAiKcAkAAmAQAIZ0CQACYBAAhqwIgAKIEACGsAkAAlwQAIb8CAQCTBAAhyQIBAJMEACHnAiAAogQAIekCAADlBekCIusCIACiBAAh7AIBAJUEACERBAAAoAYAIAYAAKIGACAMAACjBgAgFQAApAYAIBYAAKUGACCSAgEAAAABlgIAAADrAgKcAkAAAAABnQJAAAAAAasCIAAAAAGsAkAAAAABvwIBAAAAAckCAQAAAAHnAiAAAAAB6QIAAADpAgLrAiAAAAAB7AIBAAAAAQIAAABPACAjAADDBgAgAwAAAFIAICMAAMMGACAkAADHBgAgEwAAAFIAIAQAAOcFACAGAADpBQAgDAAA6gUAIBUAAOsFACAWAADsBQAgHAAAxwYAIJICAQCTBAAhlgIAAOYF6wIinAJAAJgEACGdAkAAmAQAIasCIACiBAAhrAJAAJcEACG_AgEAkwQAIckCAQCTBAAh5wIgAKIEACHpAgAA5QXpAiLrAiAAogQAIewCAQCVBAAhEQQAAOcFACAGAADpBQAgDAAA6gUAIBUAAOsFACAWAADsBQAgkgIBAJMEACGWAgAA5gXrAiKcAkAAmAQAIZ0CQACYBAAhqwIgAKIEACGsAkAAlwQAIb8CAQCTBAAhyQIBAJMEACHnAiAAogQAIekCAADlBekCIusCIACiBAAh7AIBAJUEACERBAAAoAYAIAUAAKEGACAMAACjBgAgFQAApAYAIBYAAKUGACCSAgEAAAABlgIAAADrAgKcAkAAAAABnQJAAAAAAasCIAAAAAGsAkAAAAABvwIBAAAAAckCAQAAAAHnAiAAAAAB6QIAAADpAgLrAiAAAAAB7AIBAAAAAQIAAABPACAjAADIBgAgCZICAQAAAAGWAgAAANQCApoCAQAAAAGcAkAAAAABnQJAAAAAAdICAQAAAAHUAgAAALICAtUCQAAAAAHWAgEAAAABCpICAQAAAAGTAgIAAAABlAIBAAAAAZYCAAAAlgIClwIBAAAAAZgCQAAAAAGaAgEAAAABmwIBAAAAAZwCQAAAAAGdAkAAAAABAwAAAFIAICMAAMgGACAkAADOBgAgEwAAAFIAIAQAAOcFACAFAADoBQAgDAAA6gUAIBUAAOsFACAWAADsBQAgHAAAzgYAIJICAQCTBAAhlgIAAOYF6wIinAJAAJgEACGdAkAAmAQAIasCIACiBAAhrAJAAJcEACG_AgEAkwQAIckCAQCTBAAh5wIgAKIEACHpAgAA5QXpAiLrAiAAogQAIewCAQCVBAAhEQQAAOcFACAFAADoBQAgDAAA6gUAIBUAAOsFACAWAADsBQAgkgIBAJMEACGWAgAA5gXrAiKcAkAAmAQAIZ0CQACYBAAhqwIgAKIEACGsAkAAlwQAIb8CAQCTBAAhyQIBAJMEACHnAiAAogQAIekCAADlBekCIusCIACiBAAh7AIBAJUEACEIkgIBAAAAAZwCQAAAAAGdAkAAAAABqwIgAAAAAawCQAAAAAG_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_AgEAkwQAIckCAQCTBAAh5wIgAKIEACHpAgAA5QXpAiLrAiAAogQAIewCAQCVBAAhEQQAAOcFACAFAADoBQAgBgAA6QUAIAwAAOoFACAVAADrBQAgkgIBAJMEACGWAgAA5gXrAiKcAkAAmAQAIZ0CQACYBAAhqwIgAKIEACGsAkAAlwQAIb8CAQCTBAAhyQIBAJMEACHnAiAAogQAIekCAADlBekCIusCIACiBAAh7AIBAJUEACEOBgAAxwQAIAwAAMoEACASAACQBQAgFAAAyQQAIJICAQAAAAGWAgAAANQCApkCAQAAAAGaAgEAAAABnAJAAAAAAZ0CQAAAAAHSAgEAAAAB1AIAAACyAgLVAkAAAAAB1gIBAAAAAQIAAAAPACAjAADxBgAgAwAAAA0AICMAAPEGACAkAAD1BgAgEAAAAA0AIAYAALgEACAMAAC7BAAgEgAAjgUAIBQAALoEACAcAAD1BgAgkgIBAJMEACGWAgAAtgTUAiKZAgEAkwQAIZoCAQCVBAAhnAJAAJgEACGdAkAAmAQAIdICAQCTBAAh1AIAALcEsgIi1QJAAJgEACHWAgEAkwQAIQ4GAAC4BAAgDAAAuwQAIBIAAI4FACAUAAC6BAAgkgIBAJMEACGWAgAAtgTUAiKZAgEAkwQAIZoCAQCVBAAhnAJAAJgEACGdAkAAmAQAIdICAQCTBAAh1AIAALcEsgIi1QJAAJgEACHWAgEAkwQAIRUDAACdBQAgCQAAswUAIAsAAJ8FACAOAACgBQAgDwAAoQUAIJICAQAAAAGcAkAAAAABnQJAAAAAAasCIAAAAAGsAkAAAAABvQIBAAAAAcgCAQAAAAHJAgEAAAABygIBAAAAAcsCAQAAAAHMAgEAAAABzQIBAAAAAc4CAgAAAAHPAgIAAAAB0AIgAAAAAdECAQAAAAECAAAAEwAgIwAA9gYAIBUDAACdBQAgCQAAswUAIAoAAJ4FACAOAACgBQAgDwAAoQUAIJICAQAAAAGcAkAAAAABnQJAAAAAAasCIAAAAAGsAkAAAAABvQIBAAAAAcgCAQAAAAHJAgEAAAABygIBAAAAAcsCAQAAAAHMAgEAAAABzQIBAAAAAc4CAgAAAAHPAgIAAAAB0AIgAAAAAdECAQAAAAECAAAAEwAgIwAA-AYAIA0DAADPBQAgDgAA0QUAIJICAQAAAAGcAkAAAAABnQJAAAAAAasCIAAAAAGsAkAAAAABvQIBAAAAAcgCAQAAAAHJAgEAAAABygIBAAAAAcsCAQAAAAHXAgEAAAABAgAAAK0BACAjAAD6BgAgAwAAABEAICMAAPgGACAkAAD-BgAgFwAAABEAIAMAAOwEACAJAACyBQAgCgAA7QQAIA4AAO8EACAPAADwBAAgHAAA_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_AR5BFB9CFSBEASFGFCJHFiVIASZJASdKFCtNFyxOGy1QAi5RAi9UAjBVAjFWAjJYAjNaFDRbHDVdAjZfFDdgHThhAjliAjpjFDtmHjxnIj1oAz5pAz9qA0BrA0FsA0JuA0NwFERxI0VzA0Z1FEd2JEh3A0l4A0p5FEt8JUx9KU1-BE5_BE-AAQRQgQEEUYIBBFKEAQRThgEUVIcBKlWJAQRWiwEUV4wBK1iNAQRZjgEEWo8BFFuSASxckwEwXZUBMV6WATFfmQExYJoBMWGbATFinQExY58BFGSgATJlogExZqQBFGelATNopgExaacBMWqoARRrqwE0bKwBOG2uAQVurwEFb7EBBXCyAQVxswEFcrUBBXO3ARR0uAE5dboBBXa8ARR3vQE6eL4BBXm_AQV6wAEUe8MBO3zEAT99xQEGfsYBBn_HAQaAAcgBBoEByQEGggHLAQaDAc0BFIQBzgFAhQHRAQaGAdMBFIcB1AFBiAHWAQaJAdcBBooB2AEUiwHbAUKMAdwBRo0B3QEIjgHeAQiPAd8BCJAB4AEIkQHhAQiSAeMBCJMB5QEUlAHmAUeVAegBCJYB6gEUlwHrAUiYAewBCJkB7QEImgHuARSdAfEBSZ4B8gFPnwHzAQegAfQBB6EB9QEHogH2AQejAfcBB6QB-QEHpQH7ARSmAfwBUKcB_gEHqAGAAhSpAYECUaoBggIHqwGDAgesAYQCFK0BhwJSrgGIAlavAYoCDLABiwIMsQGNAgyyAY4CDLMBjwIMtAGRAgy1AZMCFLYBlAJXtwGWAgy4AZgCFLkBmQJYugGaAgy7AZsCDLwBnAIUvQGfAlm-AaACXb8BogIJwAGjAgnBAaYCCcIBpwIJwwGoAgnEAaoCCcUBrAIUxgGtAl7HAa8CCcgBsQIUyQGyAl_KAbMCCcsBtAIJzAG1AhTNAbgCYM4BuQJkzwG6AhLQAbsCEtEBvAIS0gG9AhLTAb4CEtQBwAIS1QHCAhTWAcMCZdcBxQIS2AHHAhTZAcgCZtoByQIS2wHKAhLcAcsCFN0BzgJn3gHPAmvfAdECEOAB0gIQ4QHUAhDiAdUCEOMB1gIQ5AHYAhDlAdoCFOYB2wJs5wHdAhDoAd8CFOkB4AJt6gHhAhDrAeICEOwB4wIU7QHmAm7uAecCdO8B6QIO8AHqAg7xAe0CDvIB7gIO8wHvAg70AfECDvUB8wIU9gH0AnX3AfYCDvgB-AIU-QH5Anb6AfoCDvsB-wIO_AH8AhT9Af8Cd_4BgAN7_wGBAwuAAoIDC4ECgwMLggKEAwuDAoUDC4QChwMLhQKJAxSGAooDfIcCjQMLiAKPAxSJApADfYoCkgMLiwKTAwuMApQDFI0ClwN-jgKYA4QB"
};
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
  AdminScalarFieldEnum: () => AdminScalarFieldEnum,
  AnyNull: () => AnyNull2,
  ClientScalarFieldEnum: () => ClientScalarFieldEnum,
  ConsultationScalarFieldEnum: () => ConsultationScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  ExpertScalarFieldEnum: () => ExpertScalarFieldEnum,
  ExpertScheduleScalarFieldEnum: () => ExpertScheduleScalarFieldEnum,
  ExpertVerificationScalarFieldEnum: () => ExpertVerificationScalarFieldEnum,
  IndustryScalarFieldEnum: () => IndustryScalarFieldEnum,
  JsonNull: () => JsonNull2,
  JsonNullValueFilter: () => JsonNullValueFilter,
  ModelName: () => ModelName,
  NotificationScalarFieldEnum: () => NotificationScalarFieldEnum,
  NullTypes: () => NullTypes2,
  NullableJsonNullValueInput: () => NullableJsonNullValueInput,
  NullsOrder: () => NullsOrder,
  PaymentScalarFieldEnum: () => PaymentScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  ScheduleScalarFieldEnum: () => ScheduleScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TestimonialScalarFieldEnum: () => TestimonialScalarFieldEnum,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
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
  client: "7.5.0",
  engine: "280c870be64f457428992c43c1f6d557fab6e29e"
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
  Admin: "Admin",
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  Client: "Client",
  Consultation: "Consultation",
  Expert: "Expert",
  ExpertSchedule: "ExpertSchedule",
  ExpertVerification: "ExpertVerification",
  Industry: "Industry",
  Notification: "Notification",
  Payment: "Payment",
  Schedule: "Schedule",
  Testimonial: "Testimonial"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var AdminScalarFieldEnum = {
  id: "id",
  userId: "userId",
  name: "name",
  email: "email",
  profilePhoto: "profilePhoto",
  contactNumber: "contactNumber",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  role: "role",
  status: "status",
  needPasswordChange: "needPasswordChange",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  image: "image",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
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
var ClientScalarFieldEnum = {
  id: "id",
  fullName: "fullName",
  email: "email",
  profilePhoto: "profilePhoto",
  phone: "phone",
  address: "address",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  userId: "userId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ConsultationScalarFieldEnum = {
  id: "id",
  videoCallId: "videoCallId",
  status: "status",
  paymentStatus: "paymentStatus",
  date: "date",
  clientId: "clientId",
  expertScheduleId: "expertScheduleId",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  expertId: "expertId"
};
var ExpertScalarFieldEnum = {
  id: "id",
  fullName: "fullName",
  email: "email",
  profilePhoto: "profilePhoto",
  phone: "phone",
  bio: "bio",
  title: "title",
  experience: "experience",
  consultationFee: "consultationFee",
  isVerified: "isVerified",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  userId: "userId",
  industryId: "industryId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ExpertScheduleScalarFieldEnum = {
  id: "id",
  expertId: "expertId",
  scheduleId: "scheduleId",
  consultationId: "consultationId",
  isBooked: "isBooked",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ExpertVerificationScalarFieldEnum = {
  id: "id",
  expertId: "expertId",
  status: "status",
  notes: "notes",
  verifiedBy: "verifiedBy",
  verifiedAt: "verifiedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var IndustryScalarFieldEnum = {
  id: "id",
  name: "name",
  description: "description",
  icon: "icon",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt"
};
var NotificationScalarFieldEnum = {
  id: "id",
  type: "type",
  message: "message",
  userId: "userId",
  createdAt: "createdAt",
  read: "read"
};
var PaymentScalarFieldEnum = {
  id: "id",
  consultationId: "consultationId",
  amount: "amount",
  status: "status",
  transactionId: "transactionId",
  stripeEventId: "stripeEventId",
  paymentGatewayData: "paymentGatewayData",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ScheduleScalarFieldEnum = {
  id: "id",
  startDateTime: "startDateTime",
  endDateTime: "endDateTime",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TestimonialScalarFieldEnum = {
  id: "id",
  rating: "rating",
  comment: "comment",
  status: "status",
  expertReply: "expertReply",
  expertRepliedAt: "expertRepliedAt",
  clientId: "clientId",
  expertId: "expertId",
  consultationId: "consultationId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var NullableJsonNullValueInput = {
  DbNull: DbNull2,
  JsonNull: JsonNull2
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var JsonNullValueFilter = {
  DbNull: DbNull2,
  JsonNull: JsonNull2,
  AnyNull: AnyNull2
};
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/enums.ts
var ConsultationStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED"
};
var PaymentStatus = {
  PAID: "PAID",
  REFUNDED: "REFUNDED",
  FAILED: "FAILED",
  UNPAID: "UNPAID"
};
var VerificationStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED"
};
var ReviewStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  HIDDEN: "HIDDEN"
};
var Role = {
  ADMIN: "ADMIN",
  EXPERT: "EXPERT",
  CLIENT: "CLIENT"
};
var UserStatus = {
  ACTIVE: "ACTIVE",
  BLOCKED: "BLOCKED",
  DELETED: "DELETED",
  SUSPENDED: "SUSPENDED"
};

// src/generated/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = envVars.DATABASE_URL;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/utilis/email.ts
import nodemailer from "nodemailer";
import status2 from "http-status";
import path2 from "path";
import ejs from "ejs";
var transporter = nodemailer.createTransport({
  host: envVars.EMAIL_SENDER.SMTP_HOST,
  secure: true,
  auth: {
    user: envVars.EMAIL_SENDER.SMTP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASSWORD
  },
  port: parseInt(envVars.EMAIL_SENDER.SMTP_PORT)
});
var sendEmail = async ({ subject, templateData, templateName, to, attachments }) => {
  try {
    const templatePath = path2.resolve(process.cwd(), `src/templates/${templateName}.ejs`);
    const html = await ejs.renderFile(templatePath, templateData);
    const info = await transporter.sendMail({
      from: envVars.EMAIL_SENDER.SMTP_FROM,
      to,
      subject,
      html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.fileName,
        content: attachment.contentType,
        contentType: attachment.contentType
      }))
    });
    console.log(`email sent ${to}: ${info.messageId} `);
  } catch (err) {
    console.log("email sending error", err.message);
    throw new AppError_default(status2.INTERNAL_SERVER_ERROR, "failed to send");
  }
};

// src/lib/auth.ts
var auth = betterAuth({
  baseURL: envVars.BETTER_AUTH_URL,
  secret: envVars.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql"
    // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true
  },
  socialProviders: {
    google: {
      clientId: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      // callbackUrl: envVars.GOOGLE_CALLBACK_URL,
      mapProfileToUser: () => {
        return {
          role: Role.CLIENT,
          status: UserStatus.ACTIVE,
          needPasswordChange: false,
          emailVerified: true,
          isDeleted: false,
          deletedAt: null
        };
      }
    }
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: Role.CLIENT
      },
      status: {
        type: "string",
        required: true,
        defaultValue: UserStatus.ACTIVE
      },
      needPasswordChange: {
        type: "boolean",
        required: true,
        defaultValue: false
      },
      isDeleted: {
        type: "boolean",
        required: true,
        defaultValue: false
      },
      deletedAt: {
        type: "date",
        required: false,
        defaultValue: null
      }
    }
  },
  plugins: [
    bearer(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "email-verification") {
          const user = await prisma.user.findUnique({
            where: {
              email
            }
          });
          if (!user) {
            console.error(`User with email ${email} not found. Cannot send verification OTP.`);
            return;
          }
          if (user && user.role === Role.ADMIN) {
            console.log(`User with email ${email} is a super admin. Skipping sending verification OTP.`);
            return;
          }
          if (user && !user.emailVerified) {
            sendEmail({
              to: email,
              subject: "Verify your email",
              templateName: "otp",
              templateData: {
                name: user.name,
                otp
              }
            });
          }
        } else if (type === "forget-password") {
          const user = await prisma.user.findUnique({
            where: {
              email
            }
          });
          if (user) {
            sendEmail({
              to: email,
              subject: "Password Reset OTP",
              templateName: "otp",
              templateData: {
                name: user.name,
                otp
              }
            });
          }
        }
      },
      expiresIn: 2 * 60,
      // 2 minutes in seconds
      otpLength: 6
    })
  ],
  session: {
    expiresIn: 60 * 60 * 60 * 24,
    // 1 day in seconds
    updateAge: 60 * 60 * 60 * 24,
    // 1 day in seconds
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 60 * 24
      // 1 day in seconds
    }
  },
  redirectURLs: {
    signIn: `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success`
  },
  trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:5000", envVars.FRONTEND_URL],
  advanced: {
    // disableCSRFCheck: true,
    useSecureCookies: false,
    cookies: {
      state: {
        attributes: {
          sameSite: "none",
          secure: true,
          httpOnly: true,
          path: "/"
        }
      },
      sessionToken: {
        attributes: {
          sameSite: "none",
          secure: true,
          httpOnly: true,
          path: "/"
        }
      }
    }
  }
});

// src/utilis/cookie.ts
var setCookie = (res, key, value, options) => {
  res.cookie(key, value, options);
};
var getCookie = (req, key) => {
  return req.cookies[key];
};
var clearCookie = (res, key, options) => {
  res.clearCookie(key, options);
};
var CookieUtils = {
  setCookie,
  getCookie,
  clearCookie
};

// src/utilis/jwt.ts
import jwt from "jsonwebtoken";
var createToken = (payload, secret, { expiresIn }) => {
  const token = jwt.sign(payload, secret, { expiresIn });
  return token;
};
var verifyToken = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return {
      success: true,
      data: decoded
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error
    };
  }
};
var decodeToken = (token) => {
  const decoded = jwt.decode(token);
  return decoded;
};
var jwtUtils = {
  createToken,
  verifyToken,
  decodeToken
};

// src/middleware/cheackAuth.ts
var checkAuth = (...authRoles) => async (req, res, next) => {
  try {
    const accessToken = CookieUtils.getCookie(req, "accessToken");
    if (!accessToken) {
      throw new AppError_default(status3.UNAUTHORIZED, "Unauthorized! No access token.");
    }
    const verified = jwtUtils.verifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET);
    if (!verified.success || !verified.data?.userId) {
      throw new AppError_default(status3.UNAUTHORIZED, "Unauthorized! Invalid token.");
    }
    const user = await prisma.user.findUnique({
      where: { id: String(verified.data.userId) }
    });
    if (!user) {
      throw new AppError_default(status3.UNAUTHORIZED, "Unauthorized! User not found.");
    }
    const userRole = user.role;
    if (user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED || user.isDeleted) {
      throw new AppError_default(status3.UNAUTHORIZED, "Unauthorized! User inactive.");
    }
    if (authRoles.length > 0 && !authRoles.includes(userRole)) {
      throw new AppError_default(status3.FORBIDDEN, "Forbidden! No permission.");
    }
    req.user = {
      userId: user.id,
      role: userRole,
      email: user.email
    };
    const cookieHeader = req.headers.cookie;
    if (cookieHeader?.includes("better-auth.session_token")) {
      const betterAuthSession = await auth.api.getSession({
        headers: {
          cookie: cookieHeader
        }
      }).catch(() => null);
      if (betterAuthSession?.session && betterAuthSession.user?.id === user.id) {
        const now = /* @__PURE__ */ new Date();
        const expiresAt = new Date(betterAuthSession.session.expiresAt);
        const createdAt = new Date(betterAuthSession.session.createdAt);
        const sessionLifetime = expiresAt.getTime() - createdAt.getTime();
        const timeRemaining = expiresAt.getTime() - now.getTime();
        if (sessionLifetime > 0) {
          const percentRemaining = timeRemaining / sessionLifetime * 100;
          if (percentRemaining < 20) {
            res.setHeader("X-Session-Refresh", "true");
            res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
            res.setHeader("X-Time-Remaining", timeRemaining.toString());
          }
        }
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};

// src/middleware/validateRequest.ts
var validateRequest = (zodSchema) => {
  return (req, res, next) => {
    try {
      if (typeof req.body?.data === "string") {
        req.body = JSON.parse(req.body.data);
      }
      const requestData = {
        body: req.body,
        query: req.query,
        params: req.params
      };
      const wrappedResult = zodSchema.safeParse(requestData);
      if (wrappedResult.success) {
        const parsedData = wrappedResult.data;
        if (parsedData.body !== void 0) {
          req.body = parsedData.body;
        }
        if (parsedData.query !== void 0) {
          req.query = parsedData.query;
        }
        if (parsedData.params !== void 0) {
          req.params = parsedData.params;
        }
        return next();
      }
      const bodyOnlyResult = zodSchema.safeParse(req.body);
      if (!bodyOnlyResult.success) {
        return next(bodyOnlyResult.error);
      }
      req.body = bodyOnlyResult.data;
      next();
    } catch (error) {
      next(error);
    }
  };
};

// src/modules/expertVerification/expertVerification.controler.ts
import status5 from "http-status";

// src/modules/expertVerification/expertVerification.service.ts
import status4 from "http-status";
var verifyExpert = async (expertId, adminId, payload) => {
  const expert = await prisma.expert.findUnique({
    where: { id: expertId, isDeleted: false }
  });
  if (!expert) {
    throw new AppError_default(status4.NOT_FOUND, "Expert not found");
  }
  const verificationMessage = payload.status === VerificationStatus.APPROVED ? "Your expert profile has been approved by the admin." : payload.status === VerificationStatus.REJECTED ? `Your expert verification request has been rejected${payload.notes ? `: ${payload.notes}` : "."}` : "Your expert verification status is now pending review.";
  const verification = await prisma.$transaction(async (tx) => {
    const record = await tx.expertVerification.upsert({
      where: { expertId },
      create: {
        expertId,
        status: payload.status,
        notes: payload.notes,
        verifiedBy: adminId,
        verifiedAt: /* @__PURE__ */ new Date()
      },
      update: {
        status: payload.status,
        notes: payload.notes,
        verifiedBy: adminId,
        verifiedAt: /* @__PURE__ */ new Date()
      }
    });
    await tx.expert.update({
      where: { id: expertId },
      data: {
        isVerified: payload.status === VerificationStatus.APPROVED
      }
    });
    await tx.notification.create({
      data: {
        type: "EXPERT_VERIFICATION_UPDATE",
        message: verificationMessage,
        userId: expert.userId
      }
    });
    return record;
  });
  return verification;
};
var expertVerificationService = {
  verifyExpert
};

// src/shared/catchAsync.ts
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

// src/shared/sendResponsr.ts
var sendResponse = (res, responseData) => {
  const { httpStatusCode, success, message, data } = responseData;
  res.status(httpStatusCode).json({
    success,
    message,
    data
  });
};

// src/modules/expertVerification/expertVerification.controler.ts
var verifyExpert2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const adminId = req.user.userId;
  const payload = req.body;
  const result = await expertVerificationService.verifyExpert(
    id,
    adminId,
    payload
  );
  sendResponse(res, {
    httpStatusCode: status5.OK,
    success: true,
    message: "Expert verification updated successfully",
    data: result
  });
});
var expertVerificationController = {
  verifyExpert: verifyExpert2
};

// src/modules/expertVerification/expertVerification.router.ts
var router = Router();
router.patch(
  "/verify/:id",
  checkAuth(Role.ADMIN),
  validateRequest(verifyExpertValidationSchema),
  expertVerificationController.verifyExpert
);
var expertVerificationRouter = router;

// src/modules/auth/auth.router.ts
import { Router as Router2 } from "express";

// src/modules/auth/auth.service.ts
import status6 from "http-status";

// src/utilis/token.ts
var getAccessToken = (payload) => {
  const accessToken = jwtUtils.createToken(
    payload,
    envVars.ACCESS_TOKEN_SECRET,
    { expiresIn: envVars.ACCESS_TOKEN_EXPIRY }
  );
  return accessToken;
};
var getRefreshToken = (payload) => {
  const refreshToken = jwtUtils.createToken(
    payload,
    envVars.REFRESH_TOKEN_SECRET,
    { expiresIn: envVars.REFRESH_TOKEN_EXPIRY }
  );
  return refreshToken;
};
var setAccessTokenCookie = (res, token) => {
  CookieUtils.setCookie(res, "accessToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    //1 day
    maxAge: 60 * 60 * 24 * 1e3
  });
};
var setRefreshTokenCookie = (res, token) => {
  CookieUtils.setCookie(res, "refreshToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    //7d
    maxAge: 60 * 60 * 24 * 1e3 * 7
  });
};
var setBetterAuthSessionCookie = (res, token) => {
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    //1 day
    maxAge: 60 * 60 * 24 * 1e3
  };
  CookieUtils.setCookie(res, "better-auth.session_token", token, options);
  CookieUtils.setCookie(res, "__Secure-better-auth.session_token", token, options);
};
var tokenUtils = {
  getAccessToken,
  getRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setBetterAuthSessionCookie
};

// src/modules/auth/auth.service.ts
var registerClient = async (payload) => {
  const { fullName, email, password } = payload;
  const data = await auth.api.signUpEmail({
    body: { name: fullName, email, password }
  });
  if (!data.user) {
    throw new AppError_default(status6.BAD_REQUEST, "Failed to register user");
  }
  await prisma.user.update({
    where: { id: data.user.id },
    data: { role: Role.CLIENT }
  });
  const client = await prisma.$transaction(async (tx) => {
    try {
      const profile = await tx.client.create({
        data: {
          userId: data.user.id,
          fullName,
          email
        }
      });
      return profile;
    } catch (err) {
      await prisma.user.delete({ where: { id: data.user.id } });
      throw err;
    }
  });
  const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    email: data.user.email,
    name: data.user.name,
    role: Role.CLIENT,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: data.user.id,
    email: data.user.email,
    name: data.user.name,
    role: Role.CLIENT,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified
  });
  console.log(data, accessToken, refreshToken, client);
  return {
    ...data,
    accessToken,
    refreshToken,
    client
  };
};
var loginUser = async (payload) => {
  const { email, password } = payload;
  const data = await auth.api.signInEmail({
    body: { email, password }
  });
  if (data.user.status === UserStatus.BLOCKED) {
    throw new AppError_default(status6.FORBIDDEN, "User is Blocked");
  }
  if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
    throw new AppError_default(status6.FORBIDDEN, "User is deleted");
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    email: data.user.email,
    name: data.user.name,
    role: data.user.role,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: data.user.id,
    email: data.user.email,
    name: data.user.name,
    role: data.user.role,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified
  });
  return {
    ...data,
    accessToken,
    refreshToken
    // user: data.user,
    // token: data.token,        // <-- BetterAuth session token
    // redirect: data.redirect,
    // url: data.url,
    // accessToken,
    // refreshToken
  };
};
var getMe = async (user) => {
  const isUserExists = await prisma.user.findUnique({
    where: { id: user.userId },
    include: {
      client: true,
      expert: {
        include: {
          industry: true,
          consultations: true,
          testimonials: true,
          schedules: true
        }
      },
      admin: true
    }
  });
  if (!isUserExists) {
    throw new AppError_default(status6.NOT_FOUND, "User not found");
  }
  return isUserExists;
};
var getNewToken = async (refreshToken, sessionToken) => {
  const verifyRefreshToken = jwtUtils.verifyToken(refreshToken, envVars.REFRESH_TOKEN_SECRET);
  if (!verifyRefreshToken.success) {
    throw new AppError_default(status6.UNAUTHORIZED, "invalid refresh token");
  }
  ;
  const data = verifyRefreshToken.data;
  if (!data?.userId) {
    throw new AppError_default(status6.UNAUTHORIZED, "invalid refresh token payload");
  }
  const user = await prisma.user.findUnique({
    where: {
      id: data.userId
    }
  });
  if (!user || user.isDeleted || user.status === UserStatus.DELETED || user.status === UserStatus.BLOCKED) {
    throw new AppError_default(status6.UNAUTHORIZED, "User is not authorized");
  }
  let nextSessionToken = null;
  if (sessionToken) {
    try {
      const betterAuthSession = await auth.api.getSession({
        headers: {
          Cookie: `better-auth.session_token=${sessionToken}`
        }
      });
      if (betterAuthSession?.session && betterAuthSession.user?.id === user.id) {
        await prisma.session.update({
          where: {
            token: betterAuthSession.session.token
          },
          data: {
            expiresAt: new Date(Date.now() + 60 * 60 * 60 * 24 * 1e3),
            updatedAt: /* @__PURE__ */ new Date()
          }
        }).catch(() => null);
        nextSessionToken = sessionToken;
      }
    } catch {
      nextSessionToken = null;
    }
  }
  const newAccessToken = tokenUtils.getAccessToken({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    status: user.status,
    isDeleted: user.isDeleted,
    emailVerified: user.emailVerified
  });
  const newRefreshToken = tokenUtils.getRefreshToken({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    status: user.status,
    isDeleted: user.isDeleted,
    emailVerified: user.emailVerified
  });
  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    sessionToken: nextSessionToken
  };
};
var changePassword = async (payload, sessionToken) => {
  if (!sessionToken) {
    throw new AppError_default(status6.UNAUTHORIZED, "Session expired. Please login again.");
  }
  const authHeaders = new Headers({
    Authorization: `Bearer ${sessionToken}`,
    Cookie: `better-auth.session_token=${sessionToken}`
  });
  const session = await auth.api.getSession({
    headers: authHeaders
  });
  if (!session?.user) {
    throw new AppError_default(status6.UNAUTHORIZED, "Invalid session token");
  }
  const { currentPassword, newPassword } = payload;
  const credentialAccount = await prisma.account.findFirst({
    where: {
      userId: session.user.id,
      providerId: "credential"
    }
  });
  let result;
  if (credentialAccount?.password) {
    if (!currentPassword) {
      throw new AppError_default(status6.BAD_REQUEST, "Current password is required");
    }
    result = await auth.api.changePassword({
      body: {
        currentPassword,
        newPassword,
        revokeOtherSessions: true
      },
      headers: authHeaders
    });
  } else {
    result = await auth.api.setPassword({
      body: {
        newPassword
      },
      headers: authHeaders
    });
  }
  if (session.user.needPasswordChange) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { needPasswordChange: false }
    });
  }
  const updatedUser = await prisma.user.findUnique({
    where: { id: session.user.id }
  });
  if (!updatedUser) {
    throw new AppError_default(status6.NOT_FOUND, "User not found");
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: updatedUser.id,
    email: updatedUser.email,
    name: updatedUser.name,
    role: updatedUser.role,
    status: updatedUser.status,
    isDeleted: updatedUser.isDeleted,
    emailVerified: updatedUser.emailVerified
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: updatedUser.id,
    email: updatedUser.email,
    name: updatedUser.name,
    role: updatedUser.role,
    status: updatedUser.status,
    isDeleted: updatedUser.isDeleted,
    emailVerified: updatedUser.emailVerified
  });
  const betterAuthToken = "token" in result ? result.token : null;
  const operationStatus = "status" in result ? result.status : true;
  return {
    status: operationStatus,
    token: betterAuthToken,
    user: updatedUser,
    accessToken,
    refreshToken
  };
};
var logOutUser = async (sessionToken) => {
  const result = await auth.api.signOut({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  return result;
};
var verifyEmail = async (email, otp) => {
  const result = await auth.api.verifyEmailOTP({
    body: {
      email,
      otp
    }
  });
  if (result.status && !result.user.emailVerified) {
    await prisma.user.update({
      where: {
        email
      },
      data: {
        emailVerified: true
      }
    });
  }
};
var forgetPassword = async (email) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!isUserExists) {
    throw new AppError_default(status6.NOT_FOUND, "user not found");
  }
  if (!isUserExists.emailVerified) {
    throw new AppError_default(status6.BAD_REQUEST, "email not verified");
  }
  if (isUserExists.isDeleted || isUserExists.status === UserStatus.DELETED) {
    throw new AppError_default(status6.NOT_FOUND, "user not found");
  }
  await auth.api.requestPasswordResetEmailOTP({
    body: {
      email
    }
  });
};
var resetPassword = async (email, otp, newPassword) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!isUserExists) {
    throw new AppError_default(status6.NOT_FOUND, "user not found");
  }
  if (!isUserExists.emailVerified) {
    throw new AppError_default(status6.BAD_REQUEST, "email not verified");
  }
  if (isUserExists.isDeleted || isUserExists.status === UserStatus.DELETED) {
    throw new AppError_default(status6.NOT_FOUND, "user not found");
  }
  await auth.api.resetPasswordEmailOTP({
    body: {
      email,
      otp,
      password: newPassword
    }
  });
  if (isUserExists.needPasswordChange) {
    await prisma.user.update({
      where: {
        id: isUserExists.id
      },
      data: {
        needPasswordChange: false
      }
    });
  }
  await prisma.session.deleteMany({
    where: {
      userId: isUserExists.id
    }
  });
};
var googleLoginSuccess = async (session) => {
  const isPatientExists = await prisma.client.findUnique({
    where: {
      userId: session.user.id
    }
  });
  if (!isPatientExists) {
    await prisma.client.create({
      data: {
        userId: session.user.id,
        fullName: session.user.name,
        email: session.user.email
      }
    });
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name
  });
  return {
    accessToken,
    refreshToken
  };
};
var checkEmailExists = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email }
  });
  return !!user;
};
var updateProfile = async (user, payload) => {
  const baseUpdate = {
    name: payload.name,
    email: payload.email,
    image: payload.image
  };
  const updatedUser = await prisma.user.update({
    where: { id: user.userId },
    data: baseUpdate
  });
  if (updatedUser.role === "EXPERT") {
    await prisma.expert.update({
      where: { userId: user.userId },
      data: {
        title: payload.title,
        experience: payload.experience,
        industryId: payload.industryId
      }
    });
  }
  if (updatedUser.role === "CLIENT") {
    await prisma.client.update({
      where: { userId: user.userId },
      data: {
        fullName: payload.fullName
      }
    });
  }
  return updatedUser;
};
var authService = {
  registerClient,
  loginUser,
  getMe,
  getNewToken,
  changePassword,
  logOutUser,
  verifyEmail,
  forgetPassword,
  resetPassword,
  googleLoginSuccess,
  checkEmailExists,
  updateProfile
};

// src/modules/auth/auth.controler.ts
import status7 from "http-status";
var getBetterAuthSessionToken = (req) => req.cookies["better-auth.session_token"] ?? req.cookies["__Secure-better-auth.session_token"];
var registeredUser = catchAsync(
  async (req, res) => {
    const payload = req.body;
    console.log(payload);
    const result = await authService.registerClient(payload);
    sendResponse(res, {
      httpStatusCode: status7.CREATED,
      success: true,
      message: "user registered successfully",
      data: result
    });
  }
);
var loginUser2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await authService.loginUser(payload);
  const {
    accessToken,
    refreshToken,
    token,
    // BetterAuth session token
    user,
    // MUST be included
    ...rest
    // role, emailVerified, needPasswordChange, redirect, etc.
  } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    httpStatusCode: status7.OK,
    success: true,
    message: "login successfully",
    data: {
      accessToken,
      refreshToken,
      token,
      user,
      // REQUIRED
      ...rest
      // role, emailVerified, needPasswordChange, redirect
    }
  });
});
var getMe2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    const result = await authService.getMe(user);
    sendResponse(res, {
      httpStatusCode: status7.OK,
      success: true,
      message: "user profile fetched successfully",
      data: result
    });
  }
);
var getNewToken2 = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const betterAuthSessionToken = getBetterAuthSessionToken(req);
  if (!refreshToken) {
    throw new AppError_default(status7.UNAUTHORIZED, "refresh token is missing");
  }
  const results = await authService.getNewToken(refreshToken, betterAuthSessionToken);
  const { accessToken, refreshToken: newRefreshToken, sessionToken } = results;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, newRefreshToken);
  if (sessionToken) {
    tokenUtils.setBetterAuthSessionCookie(res, sessionToken);
  }
  sendResponse(res, {
    httpStatusCode: status7.OK,
    success: true,
    message: "new tokens successfully",
    data: {
      accessToken,
      refreshToken: newRefreshToken,
      sessionToken
    }
  });
});
var changePassword2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const betterAuthSessionToken = getBetterAuthSessionToken(req);
  const result = await authService.changePassword(
    payload,
    betterAuthSessionToken
  );
  const { accessToken, refreshToken } = result;
  const betterAuthToken = result.token;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  if (betterAuthToken) {
    tokenUtils.setBetterAuthSessionCookie(res, betterAuthToken);
  }
  sendResponse(res, {
    httpStatusCode: status7.OK,
    success: true,
    message: "Password changed successfully",
    data: result
  });
});
var logOutUser2 = catchAsync(async (req, res) => {
  const betterAuthSessionToken = getBetterAuthSessionToken(req);
  const result = await authService.logOutUser(betterAuthSessionToken);
  CookieUtils.clearCookie(res, "accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  CookieUtils.clearCookie(res, "refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  CookieUtils.clearCookie(res, "better-auth.session_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  sendResponse(res, {
    httpStatusCode: status7.OK,
    success: true,
    message: "successfully Logout",
    data: result
  });
});
var verifyEmail2 = catchAsync(async (req, res) => {
  const { email, otp } = req.body;
  await authService.verifyEmail(email, otp);
  sendResponse(res, {
    httpStatusCode: status7.OK,
    success: true,
    message: "email verified successfully"
  });
});
var forgetPassword2 = catchAsync(async (req, res) => {
  const { email } = req.body;
  await authService.forgetPassword(email);
  sendResponse(res, {
    httpStatusCode: status7.OK,
    success: true,
    message: "password reset OTP sent to email successfully"
  });
});
var resetPassword2 = catchAsync(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  await authService.resetPassword(email, otp, newPassword);
  sendResponse(res, {
    httpStatusCode: status7.OK,
    success: true,
    message: "password reset successfully"
  });
});
var googleLogin = catchAsync((req, res) => {
  const redirectPath = req.query.redirect || "/dashboard";
  const encodedRedirectPath = encodeURIComponent(redirectPath);
  const callbackURL = `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success?redirect=${encodedRedirectPath}`;
  res.render("googleRedirect", {
    callbackURL,
    betterAuthUrl: envVars.BETTER_AUTH_URL
  });
});
var googleLoginSuccess2 = catchAsync(async (req, res) => {
  const redirectPath = req.query.redirect || "/dashboard";
  const sessionToken = getBetterAuthSessionToken(req);
  if (!sessionToken) {
    return res.redirect(`${envVars.FRONTEND_URL}/login?error=oauth_failed`);
  }
  const session = await auth.api.getSession({
    headers: {
      "Cookie": `better-auth.session_token=${sessionToken}`
    }
  });
  if (!session) {
    return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_session_found`);
  }
  if (session && !session.user) {
    return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_user_found`);
  }
  const result = await authService.googleLoginSuccess(session);
  const { accessToken, refreshToken } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, sessionToken);
  const isValidRedirectPath = redirectPath.startsWith("/") && !redirectPath.startsWith("//");
  const finalRedirectPath = isValidRedirectPath ? redirectPath : "/dashboard";
  res.redirect(`${envVars.FRONTEND_URL}${finalRedirectPath}`);
});
var handlerOAuthError = catchAsync(async (req, res) => {
  const error = req.query.error || "oauth failed";
  res.redirect(`${envVars.FRONTEND_URL}/login?error=${error}`);
});
var checkEmailAvailability = catchAsync(async (req, res) => {
  const email = req.query.email;
  const exists = await authService.checkEmailExists(email);
  if (exists) {
    return sendResponse(res, {
      httpStatusCode: 400,
      success: false,
      message: "Email already exists"
    });
  }
  return sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Email available"
  });
});
var updateProfile2 = catchAsync(async (req, res) => {
  const user = req.user;
  const payload = req.body;
  const result = await authService.updateProfile(user, payload);
  sendResponse(res, {
    httpStatusCode: status7.OK,
    success: true,
    message: "Profile updated successfully",
    data: result
  });
});
var authControler = {
  registeredUser,
  loginUser: loginUser2,
  getMe: getMe2,
  getNewToken: getNewToken2,
  changePassword: changePassword2,
  logOutUser: logOutUser2,
  verifyEmail: verifyEmail2,
  forgetPassword: forgetPassword2,
  resetPassword: resetPassword2,
  googleLogin,
  googleLoginSuccess: googleLoginSuccess2,
  handlerOAuthError,
  checkEmailAvailability,
  updateProfile: updateProfile2
};

// src/modules/auth/auth.validation.ts
import { z as z2 } from "zod";
var registerZodSchema = z2.object({
  fullName: z2.string().min(3, "Full name is required"),
  email: z2.string().email("Invalid email"),
  password: z2.string().min(6, "Password must be at least 6 characters")
});
var loginZodSchema = z2.object({
  email: z2.email("Invalid email address"),
  password: z2.string().min(1, "Password is required").min(8, "Password must be at least 8 characters long").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/[0-9]/, "Password must contain at least one number").regex(/[@$!%*?&]/, "Password must contain at least one special character (@, $, !, %, *, ?, &)")
});
var forgotPasswordZodSchema = z2.object({
  email: z2.string().email("Invalid email")
});
var changePasswordZodSchema = z2.object({
  currentPassword: z2.string().trim().optional().transform((value) => value || void 0),
  newPassword: z2.string().min(8, "Password must be at least 8 characters long").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/[0-9]/, "Password must contain at least one number").regex(/[@$!%*?&]/, "Password must contain at least one special character (@, $, !, %, *, ?, &)")
});
var updateProfileSchema = z2.object({
  name: z2.string().min(2).optional(),
  email: z2.string().email().optional(),
  image: z2.string().url().nullable().optional(),
  // Expert fields
  title: z2.string().optional(),
  experience: z2.number().optional(),
  industryId: z2.string().optional(),
  // Client fields
  fullName: z2.string().optional()
});

// src/modules/auth/auth.router.ts
var router2 = Router2();
router2.post("/register", validateRequest(registerZodSchema), authControler.registeredUser);
router2.post("/login", validateRequest(loginZodSchema), authControler.loginUser);
router2.get("/me", checkAuth(), authControler.getMe);
router2.post("/refresh-token", authControler.getNewToken);
router2.post(
  "/change-password",
  checkAuth(Role.CLIENT, Role.EXPERT, Role.ADMIN),
  validateRequest(changePasswordZodSchema),
  authControler.changePassword
);
router2.post("/logOut", checkAuth(Role.ADMIN, Role.CLIENT, Role.EXPERT), authControler.logOutUser);
var authRoutes = router2;
router2.post("/verify-email", authControler.verifyEmail);
router2.post("/forget-password", validateRequest(forgotPasswordZodSchema), authControler.forgetPassword);
router2.post("/reset-password", authControler.resetPassword);
router2.get("/login/google", authControler.googleLogin);
router2.get("/google/success", authControler.googleLoginSuccess);
router2.get("/oauth/error", authControler.handlerOAuthError);
router2.get("/check-email", authControler.checkEmailAvailability);
router2.put(
  "/update-profile",
  checkAuth(),
  validateRequest(updateProfileSchema),
  authControler.updateProfile
);

// src/modules/expert/expert.route.ts
import { Router as Router3 } from "express";

// src/modules/expert/expert.controler.ts
import status9 from "http-status";

// src/modules/expert/expert.service.ts
import status8 from "http-status";

// src/utilis/queryBuilder.ts
var QueryBuilder = class {
  constructor(model, queryParams, config2) {
    this.model = model;
    this.queryParams = queryParams;
    this.config = config2;
    this.page = 1;
    this.limit = 10;
    this.skip = 0;
    this.sortBy = "createdAt";
    this.sortOrder = "desc";
    this.selectFields = {};
    this.query = {
      where: {},
      include: {},
      orderBy: {},
      skip: 0,
      take: 10
    };
    this.countQuery = {
      where: {}
    };
  }
  // SEARCH
  search() {
    const { searchTerm } = this.queryParams;
    const { searchableFields } = this.config;
    if (searchTerm && searchableFields && searchableFields.length > 0) {
      const searchConditions = searchableFields.map(
        (field) => {
          if (field.includes(".")) {
            const parts = field.split(".");
            if (parts.length === 2) {
              const [relation, nestedField] = parts;
              const stringFilter2 = {
                contains: searchTerm,
                mode: "insensitive"
              };
              return {
                [relation]: {
                  [nestedField]: stringFilter2
                }
              };
            } else if (parts.length === 3) {
              const [relation, nestedRelation, nestedField] = parts;
              const stringFilter2 = {
                contains: searchTerm,
                mode: "insensitive"
              };
              return {
                [relation]: {
                  some: {
                    [nestedRelation]: {
                      [nestedField]: stringFilter2
                    }
                  }
                }
              };
            }
          }
          const stringFilter = {
            contains: searchTerm,
            mode: "insensitive"
          };
          return {
            [field]: stringFilter
          };
        }
      );
      const whereConditions = this.query.where;
      whereConditions.OR = searchConditions;
      const countWhereConditions = this.countQuery.where;
      countWhereConditions.OR = searchConditions;
    }
    return this;
  }
  // FILTER
  filter() {
    const { filterableFields } = this.config;
    const excludedField = ["searchTerm", "page", "limit", "sortBy", "sortOrder", "fields", "include"];
    const filterParams = {};
    Object.keys(this.queryParams).forEach((key) => {
      if (!excludedField.includes(key)) {
        filterParams[key] = this.queryParams[key];
      }
    });
    const queryWhere = this.query.where;
    const countQueryWhere = this.countQuery.where;
    Object.keys(filterParams).forEach((key) => {
      const value = filterParams[key];
      if (value === void 0 || value === "") {
        return;
      }
      const isAllowedField = !filterableFields || filterableFields.length === 0 || filterableFields.includes(key);
      if (key.includes(".")) {
        const parts = key.split(".");
        if (filterableFields && !filterableFields.includes(key)) {
          return;
        }
        if (parts.length === 2) {
          const [relation, nestedField] = parts;
          if (!queryWhere[relation]) {
            queryWhere[relation] = {};
            countQueryWhere[relation] = {};
          }
          const queryRelation = queryWhere[relation];
          const countRelation = countQueryWhere[relation];
          queryRelation[nestedField] = this.parseFilterValue(value);
          countRelation[nestedField] = this.parseFilterValue(value);
          return;
        } else if (parts.length === 3) {
          const [relation, nestedRelation, nestedField] = parts;
          if (!queryWhere[relation]) {
            queryWhere[relation] = {
              some: {}
            };
            countQueryWhere[relation] = {
              some: {}
            };
          }
          const queryRelation = queryWhere[relation];
          const countRelation = countQueryWhere[relation];
          if (!queryRelation.some) {
            queryRelation.some = {};
          }
          if (!countRelation.some) {
            countRelation.some = {};
          }
          const querySome = queryRelation.some;
          const countSome = countRelation.some;
          if (!querySome[nestedRelation]) {
            querySome[nestedRelation] = {};
          }
          if (!countSome[nestedRelation]) {
            countSome[nestedRelation] = {};
          }
          const queryNestedRelation = querySome[nestedRelation];
          const countNestedRelation = countSome[nestedRelation];
          queryNestedRelation[nestedField] = this.parseFilterValue(value);
          countNestedRelation[nestedField] = this.parseFilterValue(value);
          return;
        }
      }
      if (!isAllowedField) {
        return;
      }
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        queryWhere[key] = this.parseRangeFilter(value);
        countQueryWhere[key] = this.parseRangeFilter(value);
        return;
      }
      queryWhere[key] = this.parseFilterValue(value);
      countQueryWhere[key] = this.parseFilterValue(value);
    });
    return this;
  }
  //paginate
  paginate() {
    const page = Number(this.queryParams.page) || 1;
    const limit = Number(this.queryParams.limit) || 10;
    this.page = page;
    this.limit = limit;
    this.skip = (page - 1) * limit;
    this.query.skip = this.skip;
    this.query.take = this.limit;
    return this;
  }
  //sort 
  sort() {
    const sortBy = this.queryParams.sortBy || "createdAt";
    const sortOrder = this.queryParams.sortOrder === "asc" ? "asc" : "desc";
    this.sortBy = sortBy;
    this.sortOrder = sortOrder;
    if (sortBy.includes(".")) {
      const parts = sortBy.split(".");
      if (parts.length === 2) {
        const [realation, nestedField] = parts;
        this.query.orderBy = {
          [realation]: {
            [nestedField]: sortOrder
          }
        };
      } else if (parts.length === 3) {
        const [realation, nestedRealition, nestedField] = parts;
        this.query.orderBy = {
          [realation]: {
            [nestedField]: {
              [nestedRealition]: sortOrder
            }
          }
        };
      } else {
        this.query.orderBy = {
          [sortBy]: sortOrder
        };
      }
    }
    return this;
  }
  //  //fields
  //  fields():this{
  //   const fieldsParams = this.queryParams.fields
  // if(fieldsParams && typeof fieldsParams === 'string'){
  //     const fieldsArray = fieldsParams?.split(',').map(field => field.trim())
  //   this.selectFields = {}
  //   fieldsArray?.forEach(field => {
  //     if(this.selectFields){
  //       this.selectFields[field] = true
  //     }
  //   })
  //   this.query.select = this.selectFields as Record<string, boolean | Record<string, unknown>>
  //   delete this.query.include
  // }
  //   return this
  //  }
  //include
  include(relation) {
    if (Object.keys(this.selectFields).length > 0) return this;
    this.query.include = { ...this.query.include, ...relation };
    return this;
  }
  //dynamicInclude
  dynamicInclude(includeConfig, defaultInclude) {
    if (this.selectFields) {
      return this;
    }
    const result = {};
    defaultInclude?.forEach((field) => {
      if (includeConfig[field]) {
        result[field] = includeConfig[field];
      }
    });
    const includeParam = this.queryParams.includes;
    if (includeParam && typeof includeParam === "string") {
      const requestRelations = includeParam.split(",").map((relation) => relation.trim());
      requestRelations.forEach((relation) => {
        if (includeConfig[relation]) {
          result[relation] = includeConfig[relation];
        }
      });
    }
    this.query.include = { ...this.query.include, ...result };
    return this;
  }
  fields() {
    const fieldsParams = this.queryParams.fields;
    if (fieldsParams && typeof fieldsParams === "string") {
      const fieldsArray = fieldsParams.split(",").map((field) => field.trim());
      this.selectFields = {};
      fieldsArray.forEach((field) => {
        this.selectFields[field] = true;
      });
      this.query.select = this.selectFields;
    }
    return this;
  }
  //where
  where(condition) {
    this.query.where = this.deepMerge(this.query.where, condition);
    this.countQuery.where = this.deepMerge(this.countQuery.where, condition);
    return this;
  }
  //excute
  async excute() {
    const [total, data] = await Promise.all([
      this.model.count(this.countQuery),
      this.model.findMany(this.query)
    ]);
    const totalPages = Math.ceil(total / this.limit);
    return {
      data,
      meta: {
        page: this.page,
        limit: this.limit,
        total,
        totalPages
      }
    };
  }
  //count
  async count() {
    return await this.model.count(this.countQuery);
  }
  //debugging purpose method
  getQuery() {
    return this.query;
  }
  //deep merge
  deepMerge(target, source) {
    const result = { ...target };
    for (const key in source) {
      if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
        if (result[key] && typeof result[key] === "object" && !Array.isArray(result[key])) {
          result[key] = this.deepMerge(result[key], source[key]);
        } else {
          result[key] = source[key];
        }
      }
    }
    return result;
  }
  parseFilterValue(value) {
    if (value === "true") {
      return true;
    }
    if (value === "false") {
      return false;
    }
    if (typeof value === "string" && !isNaN(Number(value)) && value != "") {
      return Number(value);
    }
    if (Array.isArray(value)) {
      return { in: value.map((item) => this.parseFilterValue(item)) };
    }
    return value;
  }
  parseRangeFilter(value) {
    const rangeQuery = {};
    Object.keys(value).forEach((operator) => {
      const operatorValue = value[operator];
      const parsedValue = typeof operatorValue === "string" && !isNaN(Number(operatorValue)) ? Number(operatorValue) : operatorValue;
      switch (operator) {
        case "lt":
        case "lte":
        case "gt":
        case "gte":
        case "equals":
        case "not":
        case "contains":
        case "startsWith":
        case "endsWith":
          rangeQuery[operator] = parsedValue;
          break;
        case "in":
        case "notIn":
          if (Array.isArray(operatorValue)) {
            rangeQuery[operator] = operatorValue;
          } else {
            rangeQuery[operator] = [parsedValue];
          }
          break;
        default:
          break;
      }
    });
    return Object.keys(rangeQuery).length > 0 ? rangeQuery : value;
  }
};

// src/modules/expert/expert.constant.ts
var expertSearchableFields = [
  "fullName",
  "email",
  "title",
  "bio",
  "phone",
  "industry.name"
];
var expertFilterableFields = [
  "isVerified",
  "industryId",
  "experience",
  "price",
  "isDeleted"
];
var expertIncludeConfig = {
  user: true,
  industry: true,
  schedules: {
    include: { schedule: true }
  },
  consultations: {
    include: {
      client: true,
      expertSchedule: true
    }
  },
  testimonials: true,
  verification: true
};

// src/modules/expert/expert.service.ts
var getAllExperts = async (query) => {
  const qb = new QueryBuilder(prisma.expert, query, {
    searchableFields: expertSearchableFields,
    filterableFields: expertFilterableFields
  });
  const result = await qb.search().filter().where({ isDeleted: false }).include({
    user: true,
    industry: true
  }).dynamicInclude(expertIncludeConfig).paginate().sort().fields().excute();
  return result;
};
var getExpertById = async (id) => {
  const expert = await prisma.expert.findUnique({
    where: { id, isDeleted: false },
    include: {
      user: true,
      industry: true,
      schedules: {
        include: { schedule: true }
      },
      consultations: {
        include: {
          client: true,
          expertSchedule: true
        }
      },
      testimonials: true,
      verification: true
    }
  });
  if (!expert) {
    throw new AppError_default(status8.NOT_FOUND, "Expert not found");
  }
  return expert;
};
var updateExpert = async (id, payload) => {
  const existingExpert = await prisma.expert.findUnique({
    where: { id, isDeleted: false }
  });
  if (!existingExpert) {
    throw new AppError_default(status8.NOT_FOUND, "Expert not found");
  }
  const { expert: expertData } = payload;
  await prisma.expert.update({
    where: { id },
    data: {
      ...expertData
    }
  });
  return await getExpertById(id);
};
var deleteExpert = async (id) => {
  const expert = await prisma.expert.findUnique({
    where: { id },
    include: { user: true }
  });
  if (!expert) {
    throw new AppError_default(status8.NOT_FOUND, "Expert not found");
  }
  await prisma.$transaction(async (tx) => {
    await tx.expert.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: /* @__PURE__ */ new Date()
      }
    });
    await tx.user.update({
      where: { id: expert.userId },
      data: {
        isDeleted: true,
        deletedAt: /* @__PURE__ */ new Date(),
        status: UserStatus.DELETED
      }
    });
    await tx.session.deleteMany({
      where: { userId: expert.userId }
    });
  });
  return { message: "Expert deleted successfully" };
};
var applyExpert = async (userId, payload) => {
  const existing = await prisma.expert.findUnique({
    where: { userId }
  });
  if (existing) {
    throw new AppError_default(status8.BAD_REQUEST, "You have already applied to become an expert");
  }
  const parsedExperience = Number(payload.experience ?? 0);
  const parsedConsultationFee = Number(payload.consultationFee);
  if (!Number.isInteger(parsedExperience) || parsedExperience < 0) {
    throw new AppError_default(
      status8.BAD_REQUEST,
      "Experience must be a non-negative integer"
    );
  }
  if (!Number.isInteger(parsedConsultationFee) || parsedConsultationFee <= 0) {
    throw new AppError_default(
      status8.BAD_REQUEST,
      "Consultation fee must be a positive integer"
    );
  }
  const expert = await prisma.expert.create({
    data: {
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      bio: payload.bio,
      title: payload.title,
      experience: parsedExperience,
      consultationFee: parsedConsultationFee,
      industryId: payload.industryId,
      profilePhoto: payload.profilePicture ?? payload.profilePhoto,
      userId
    }
  });
  await prisma.user.update({
    where: { id: userId },
    data: { role: Role.EXPERT }
  });
  const admins = await prisma.user.findMany({
    where: {
      role: Role.ADMIN,
      isDeleted: false,
      status: UserStatus.ACTIVE
    },
    select: { id: true }
  });
  if (admins.length > 0) {
    await prisma.notification.createMany({
      data: admins.map((admin) => ({
        type: "EXPERT_APPLICATION",
        message: `${expert.fullName} applied to become an expert`,
        userId: admin.id
      }))
    });
  }
  return expert;
};
var expertService = {
  getAllExperts,
  updateExpert,
  getExpertById,
  deleteExpert,
  applyExpert
};

// src/modules/expert/expert.controler.ts
var getAllExperts2 = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await expertService.getAllExperts(query);
  sendResponse(res, {
    httpStatusCode: status9.OK,
    success: true,
    message: "Experts fetched successfully",
    data: result.data,
    meta: result.meta
  });
});
var getExpertById2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const expert = await expertService.getExpertById(id);
  sendResponse(res, {
    httpStatusCode: status9.OK,
    success: true,
    message: "Expert retrieved successfully",
    data: expert
  });
});
var updateExpert2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const updatedExpert = await expertService.updateExpert(id, payload);
  sendResponse(res, {
    httpStatusCode: status9.OK,
    success: true,
    message: "Expert updated successfully",
    data: updatedExpert
  });
});
var deleteExpert2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const deletedExpert = await expertService.deleteExpert(id);
  sendResponse(res, {
    httpStatusCode: status9.OK,
    success: true,
    message: "Expert deleted successfully",
    data: deletedExpert
  });
});
var applyExpert2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const profilePicture = req.file ? req.file.path : null;
  const result = await expertService.applyExpert(userId, { ...req.body, profilePicture });
  sendResponse(res, {
    success: true,
    httpStatusCode: 201,
    message: "Expert application submitted successfully",
    data: result
  });
});
var expertController = {
  getAllExperts: getAllExperts2,
  getExpertById: getExpertById2,
  updateExpert: updateExpert2,
  deleteExpert: deleteExpert2,
  applyExpert: applyExpert2
};

// src/modules/expert/expert.validationSchema.ts
import z3 from "zod";
var updateExpertValidationSchema = z3.object({
  body: z3.object({
    fullName: z3.string().optional(),
    email: z3.string().email("Invalid email format").optional(),
    profilePhoto: z3.string().url("Invalid URL format").optional(),
    phone: z3.string().optional(),
    bio: z3.string().optional(),
    title: z3.string().optional(),
    experience: z3.number().int().nonnegative().optional(),
    price: z3.number().int().positive("Price must be positive").optional(),
    industryId: z3.string().uuid("Industry ID must be a valid UUID").optional()
  })
});
var applyExpertValidation = z3.object({
  fullName: z3.string().min(2),
  email: z3.string().email("Invalid email"),
  phone: z3.string().optional(),
  bio: z3.string().optional(),
  title: z3.string().optional(),
  experience: z3.number().int().min(0).optional(),
  consultationFee: z3.number().int().min(1),
  industryId: z3.string().uuid()
});

// src/config/multer.config.ts
import { CloudinaryStorage } from "multer-storage-cloudinary";

// src/config/cloudinary.config.ts
import { v2 as cloudinary } from "cloudinary";
import status10 from "http-status";
cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET
});
var cloudinaryUpload = cloudinary;

// src/config/multer.config.ts
import multer from "multer";
var storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: async (req, file) => {
    const originalName = file.originalname;
    const extention = originalName.split(".").pop()?.toLocaleLowerCase();
    const fileNameWithoutExtension = originalName.split(".").slice(0, -1).join(".").toLocaleLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9/-]/g, "");
    const uniqueName = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileNameWithoutExtension;
    const folder = extention === "pdf" ? "pdfs" : "images";
    return {
      folder: `ph-health-care/${folder}`,
      public_id: uniqueName,
      resource_type: "auto"
    };
  }
});
var multerUpload = multer({ storage });

// src/modules/expert/expert.route.ts
var router3 = Router3();
router3.get("/", expertController.getAllExperts);
router3.get("/:id", expertController.getExpertById);
router3.post("/apply", multerUpload.single("profilePhoto"), checkAuth(Role.CLIENT, Role.ADMIN), expertController.applyExpert);
router3.put(
  "/:id",
  validateRequest(updateExpertValidationSchema),
  checkAuth(Role.ADMIN, Role.EXPERT),
  expertController.updateExpert
);
router3.delete("/:id", checkAuth(Role.ADMIN, Role.EXPERT), expertController.deleteExpert);
var expertRouter = router3;

// src/modules/admin/admin.router.ts
import { Router as Router4 } from "express";

// src/modules/admin/admin.controler.ts
import status12 from "http-status";

// src/modules/admin/admin.service.ts
import status11 from "http-status";

// src/modules/admin/admin.constant.ts
var adminSearchableFields = [
  "name",
  "email",
  "contactNumber",
  "user.role",
  "user.status"
];
var adminFilterableFields = [
  "isDeleted",
  "email",
  "contactNumber",
  "user.role",
  "user.status"
];
var adminIncludeConfig = {
  user: true
};

// src/modules/admin/admin.service.ts
var getAllAdmin = async (query) => {
  const queryBuilder = new QueryBuilder(prisma.admin, query, {
    searchableFields: adminSearchableFields,
    filterableFields: adminFilterableFields
  });
  const result = await queryBuilder.search().filter().where({
    isDeleted: false
  }).include({
    user: true
  }).dynamicInclude(adminIncludeConfig).paginate().sort().fields().excute();
  return result;
};
var getAdminById = async (id) => {
  const admin = await prisma.admin.findUnique({
    where: { id, isDeleted: false },
    include: { user: true }
  });
  if (!admin) {
    throw new AppError_default(status11.NOT_FOUND, "Admin not found");
  }
  return admin;
};
var updateAdmin = async (id, payload) => {
  const admin = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false
    }
  });
  if (!admin) {
    throw new AppError_default(status11.NOT_FOUND, "admin in this id not found");
  }
  const updatedAdmin = await prisma.admin.update({
    where: { id },
    data: payload,
    include: {
      user: true
    }
  });
  return updatedAdmin;
};
var markDeleteAdmin = async (id, user) => {
  const admin = await prisma.admin.findUnique({
    where: { id, isDeleted: false }
  });
  if (!admin) {
    throw new AppError_default(status11.NOT_FOUND, "Admin not found");
  }
  if (admin.userId === user.userId) {
    throw new AppError_default(status11.BAD_REQUEST, "You cannot delete yourself");
  }
  const result = await prisma.$transaction(async (tx) => {
    await tx.admin.update({
      where: { id },
      data: { isDeleted: true, deletedAt: /* @__PURE__ */ new Date() }
    });
    await tx.user.update({
      where: { id: admin.userId },
      data: { isDeleted: true, status: "DELETED" }
    });
    return true;
  });
  return result;
};
var adminService = {
  getAllAdmin,
  updateAdmin,
  getAdminById,
  markDeleteAdmin
};

// src/modules/admin/admin.controler.ts
var getAllAdmin2 = catchAsync(async (req, res) => {
  const admins = await adminService.getAllAdmin(req.query);
  sendResponse(res, {
    httpStatusCode: status12.OK,
    success: true,
    message: "Admins retrieved successfully",
    data: admins
  });
});
var getAdminById2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const admin = await adminService.getAdminById(id);
  sendResponse(res, {
    httpStatusCode: status12.OK,
    success: true,
    message: "admin retrieved successfully",
    data: admin
  });
});
var updateAdmin2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const updatedAdmin = await adminService.updateAdmin(id, data);
  sendResponse(res, {
    httpStatusCode: status12.OK,
    success: true,
    message: "Admin updated successfully",
    data: updatedAdmin
  });
});
var deleteAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  const adminDoctor = await adminService.markDeleteAdmin(id, user);
  sendResponse(res, {
    httpStatusCode: status12.OK,
    success: true,
    message: "admin deleted successfully",
    data: adminDoctor
  });
});
var adminController = {
  getAllAdmin: getAllAdmin2,
  updateAdmin: updateAdmin2,
  getAdminById: getAdminById2,
  deleteAdmin
};

// src/modules/admin/admin.validation.ts
import z4 from "zod";
var updateAdminValidationSchema = z4.object({
  body: z4.object({
    contactNumber: z4.string().optional(),
    profilePhoto: z4.string().optional()
  })
});

// src/modules/admin/admin.router.ts
var router4 = Router4();
router4.get("/", checkAuth(Role.ADMIN, Role.ADMIN), adminController.getAllAdmin);
router4.get("/:id", checkAuth(Role.ADMIN, Role.ADMIN), adminController.getAdminById);
router4.put(
  "/:id",
  checkAuth(Role.ADMIN),
  validateRequest(updateAdminValidationSchema),
  checkAuth(Role.ADMIN),
  adminController.updateAdmin
);
router4.delete("/:id", checkAuth(Role.ADMIN), adminController.deleteAdmin);
var adminRouter = router4;

// src/modules/expertSchdules/expertSchdules.router.ts
import { Router as Router5 } from "express";

// src/modules/expertSchdules/expertSchdule.validation.ts
import z5 from "zod";
var assignExpertScheduleValidation = z5.object({
  body: z5.object({
    scheduleIds: z5.array(z5.string().uuid("Invalid schedule ID"))
  })
});
var updateExpertScheduleValidation = z5.object({
  body: z5.object({
    scheduleIds: z5.array(
      z5.object({
        id: z5.string().uuid("Invalid schedule ID"),
        shouldDelete: z5.boolean()
      })
    )
  })
});

// src/modules/expertSchdules/expertSchdules.controler.ts
import status13 from "http-status";

// src/modules/expertSchdules/expertSchdules.service.ts
import httpStatus from "http-status";

// src/modules/expertSchdules/expertSchdule.constant.ts
var expertScheduleFilterableFields = [
  "expertId",
  "scheduleId",
  "isBooked",
  "isDeleted"
];
var expertScheduleSearchableFields = ["expertId", "scheduleId"];
var expertScheduleIncludeConfig = {
  schedule: true,
  expert: {
    include: {
      user: true,
      industry: true
    }
  },
  consultation: true
};

// src/modules/expertSchdules/expertSchdules.service.ts
var assignExpertSchedules = async (userId, payload) => {
  const expert = await prisma.expert.findFirst({
    where: { userId, isDeleted: false }
  });
  if (!expert) throw new AppError_default(httpStatus.NOT_FOUND, "Expert not found");
  const created = [];
  for (const scheduleId of payload.scheduleIds) {
    const schedule = await prisma.schedule.findFirst({
      where: { id: scheduleId, isDeleted: false }
    });
    if (!schedule)
      throw new AppError_default(
        httpStatus.NOT_FOUND,
        `Schedule not found: ${scheduleId}`
      );
    const exists = await prisma.expertSchedule.findUnique({
      where: {
        expertId_scheduleId: {
          expertId: expert.id,
          scheduleId
        }
      }
    });
    if (!exists) {
      const mapping = await prisma.expertSchedule.create({
        data: {
          expertId: expert.id,
          scheduleId
        }
      });
      created.push(mapping);
    }
  }
  return created;
};
var getMyExpertSchedules = async (userId, query) => {
  const expert = await prisma.expert.findFirst({
    where: { userId, isDeleted: false }
  });
  if (!expert) throw new AppError_default(httpStatus.NOT_FOUND, "Expert not found");
  const qb = new QueryBuilder(
    prisma.expertSchedule,
    { expertId: expert.id, isDeleted: false, ...query },
    {
      filterableFields: expertScheduleFilterableFields,
      searchableFields: expertScheduleSearchableFields
    }
  );
  return await qb.search().filter().paginate().dynamicInclude(expertScheduleIncludeConfig).sort().fields().excute();
};
var getAllExpertSchedules = async (query) => {
  const qb = new QueryBuilder(prisma.expertSchedule, { isDeleted: false, ...query }, {
    filterableFields: expertScheduleFilterableFields,
    searchableFields: expertScheduleSearchableFields
  });
  return await qb.search().filter().paginate().dynamicInclude(expertScheduleIncludeConfig).sort().fields().excute();
};
var getExpertScheduleById = async (expertId, scheduleId) => {
  const mapping = await prisma.expertSchedule.findUnique({
    where: {
      expertId_scheduleId: {
        expertId,
        scheduleId
      }
    },
    include: expertScheduleIncludeConfig
  });
  if (!mapping || mapping.isDeleted)
    throw new AppError_default(httpStatus.NOT_FOUND, "Expert schedule not found");
  return mapping;
};
var updateMyExpertSchedules = async (userId, payload) => {
  const expert = await prisma.expert.findFirst({
    where: { userId, isDeleted: false }
  });
  if (!expert) throw new AppError_default(httpStatus.NOT_FOUND, "Expert not found");
  const deleteIds = payload.scheduleIds.filter((s) => s.shouldDelete).map((s) => s.id);
  const createIds = payload.scheduleIds.filter((s) => !s.shouldDelete).map((s) => s.id);
  await prisma.$transaction(async (tx) => {
    if (deleteIds.length) {
      await tx.expertSchedule.updateMany({
        where: {
          expertId: expert.id,
          scheduleId: { in: deleteIds },
          isBooked: false,
          isDeleted: false
        },
        data: {
          isDeleted: true,
          deletedAt: /* @__PURE__ */ new Date()
        }
      });
    }
    if (createIds.length) {
      const data = createIds.map((scheduleId) => ({
        expertId: expert.id,
        scheduleId
      }));
      await tx.expertSchedule.createMany({
        data,
        skipDuplicates: true
      });
    }
  });
  return { success: true };
};
var deleteMyExpertSchedule = async (userId, scheduleId) => {
  const expert = await prisma.expert.findFirst({
    where: { userId, isDeleted: false }
  });
  if (!expert) throw new AppError_default(httpStatus.NOT_FOUND, "Expert not found");
  const existing = await prisma.expertSchedule.findUnique({
    where: {
      expertId_scheduleId: {
        expertId: expert.id,
        scheduleId
      }
    }
  });
  if (!existing || existing.isDeleted)
    throw new AppError_default(httpStatus.NOT_FOUND, "Expert schedule not found");
  if (existing.isBooked)
    throw new AppError_default(
      httpStatus.BAD_REQUEST,
      "Cannot delete a booked schedule"
    );
  await prisma.expertSchedule.update({
    where: {
      expertId_scheduleId: {
        expertId: expert.id,
        scheduleId
      }
    },
    data: {
      isDeleted: true,
      deletedAt: /* @__PURE__ */ new Date()
    }
  });
  return { success: true };
};
var expertScheduleService = {
  assignExpertSchedules,
  getMyExpertSchedules,
  getAllExpertSchedules,
  getExpertScheduleById,
  updateMyExpertSchedules,
  deleteMyExpertSchedule
};

// src/modules/expertSchdules/expertSchdules.controler.ts
var assignExpertSchedules2 = catchAsync(async (req, res) => {
  const result = await expertScheduleService.assignExpertSchedules(
    req.user.userId,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: status13.CREATED,
    success: true,
    message: "Schedules assigned successfully",
    data: result
  });
});
var getMyExpertSchedules2 = catchAsync(async (req, res) => {
  const result = await expertScheduleService.getMyExpertSchedules(
    req.user.userId,
    req.query
  );
  sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: "Expert schedules fetched successfully",
    data: result
  });
});
var getAllExpertSchedules2 = catchAsync(async (req, res) => {
  const result = await expertScheduleService.getAllExpertSchedules(req.query);
  sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: "All expert schedules fetched successfully",
    data: result
  });
});
var getExpertScheduleById2 = catchAsync(async (req, res) => {
  const { expertId, scheduleId } = req.params;
  const result = await expertScheduleService.getExpertScheduleById(
    expertId,
    scheduleId
  );
  sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: "Expert schedule retrieved successfully",
    data: result
  });
});
var updateMyExpertSchedules2 = catchAsync(async (req, res) => {
  const result = await expertScheduleService.updateMyExpertSchedules(
    req.user.userId,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: "Expert schedules updated successfully",
    data: result
  });
});
var deleteMyExpertSchedule2 = catchAsync(async (req, res) => {
  const result = await expertScheduleService.deleteMyExpertSchedule(
    req.user.userId,
    req.params.scheduleId
  );
  sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: "Expert schedule deleted successfully",
    data: result
  });
});
var expertScheduleController = {
  assignExpertSchedules: assignExpertSchedules2,
  getMyExpertSchedules: getMyExpertSchedules2,
  getAllExpertSchedules: getAllExpertSchedules2,
  getExpertScheduleById: getExpertScheduleById2,
  updateMyExpertSchedules: updateMyExpertSchedules2,
  deleteMyExpertSchedule: deleteMyExpertSchedule2
};

// src/modules/expertSchdules/expertSchdules.router.ts
var router5 = Router5();
router5.post(
  "/assign",
  validateRequest(assignExpertScheduleValidation),
  checkAuth(),
  expertScheduleController.assignExpertSchedules
);
router5.get(
  "/my",
  checkAuth(Role.EXPERT),
  expertScheduleController.getMyExpertSchedules
);
router5.get(
  "/",
  checkAuth(Role.ADMIN),
  expertScheduleController.getAllExpertSchedules
);
router5.get(
  "/:expertId/:scheduleId",
  checkAuth(Role.ADMIN),
  expertScheduleController.getExpertScheduleById
);
router5.put(
  "/my",
  validateRequest(updateExpertScheduleValidation),
  checkAuth(Role.EXPERT),
  expertScheduleController.updateMyExpertSchedules
);
router5.delete(
  "/my/:scheduleId",
  checkAuth(Role.EXPERT),
  expertScheduleController.deleteMyExpertSchedule
);
var expertScheduleRouter = router5;

// src/modules/schedules/schedules.router.ts
import { Router as Router6 } from "express";

// src/modules/schedules/schedules.controler.ts
import status15 from "http-status";

// src/modules/schedules/schedules.service.ts
import status14 from "http-status";
import { addHours, addMinutes, format } from "date-fns";

// src/modules/schedules/schdule.utils.ts
var convertDateTime = async (date) => {
  const offset = date.getTimezoneOffset() * 6e4;
  return new Date(date.getTime() + offset);
};

// src/modules/schedules/schdules.constant.ts
var scheduleFilterableFields = [
  "id",
  "startDateTime",
  "endDateTime",
  "isDeleted"
];
var scheduleSearchableFields = [
  "id",
  "startDateTime",
  "endDateTime"
];
var scheduleIncludeConfig = {
  expertSchedules: {
    include: {
      expert: {
        include: {
          user: true,
          industry: true
        }
      },
      consultation: true
    }
  }
};

// src/modules/schedules/schedules.service.ts
var createSchedules = async (payload) => {
  const { startDate, endDate, startTime, endTime } = payload;
  const interval = 30;
  const schedules = [];
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
          endDateTime: e
        }
      });
      if (!existing) {
        const created = await prisma.schedule.create({
          data: {
            startDateTime: s,
            endDateTime: e
          }
        });
        schedules.push(created);
      }
      startDateTime.setMinutes(startDateTime.getMinutes() + interval);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return schedules;
};
var getAllSchedules = async (query) => {
  const qb = new QueryBuilder(
    prisma.schedule,
    query,
    {
      searchableFields: scheduleSearchableFields,
      filterableFields: scheduleFilterableFields
    }
  );
  const result = await qb.search().filter().paginate().dynamicInclude(scheduleIncludeConfig).sort().fields().excute();
  return result;
};
var getScheduleById = async (id) => {
  if (!id || typeof id !== "string") {
    throw new AppError_default(status14.BAD_REQUEST, "Invalid schedule ID");
  }
  const schedule = await prisma.schedule.findUnique({
    where: { id },
    include: {
      expertSchedules: {
        include: {
          expert: {
            include: {
              user: true,
              industry: true
            }
          },
          consultation: true
        }
      }
    }
  });
  if (!schedule) {
    throw new AppError_default(status14.NOT_FOUND, "Schedule not found");
  }
  return schedule;
};
var updateSchedule = async (id, payload) => {
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
      endDateTime
    }
  });
};
var deleteSchedule = async (id) => {
  if (!id || typeof id !== "string") {
    throw new AppError_default(status14.BAD_REQUEST, "Invalid schedule ID");
  }
  const schedule = await prisma.schedule.findUnique({
    where: { id },
    include: {
      expertSchedules: true
    }
  });
  if (!schedule) {
    throw new AppError_default(status14.NOT_FOUND, "Schedule not found");
  }
  const isBooked = schedule.expertSchedules.some((es) => es.isBooked);
  if (isBooked) {
    throw new AppError_default(
      status14.BAD_REQUEST,
      "Cannot delete schedule \u2014 it is already booked"
    );
  }
  const deleted = await prisma.schedule.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: /* @__PURE__ */ new Date()
    }
  });
  return {
    message: "Schedule deleted successfully",
    data: deleted
  };
};
var schedulesService = {
  createSchedules,
  getAllSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule
};

// src/modules/schedules/schedules.controler.ts
var createSchedule = catchAsync(async (req, res) => {
  const payload = req.body;
  const schedule = await schedulesService.createSchedules(payload);
  sendResponse(res, {
    success: true,
    httpStatusCode: status15.CREATED,
    message: "Schedule created successfully",
    data: schedule
  });
});
var getAllSchedules2 = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await schedulesService.getAllSchedules(query);
  sendResponse(res, {
    success: true,
    httpStatusCode: status15.OK,
    message: "Schedules retrieved successfully",
    data: result.data,
    meta: result.meta
  });
});
var getScheduleById2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const schedule = await schedulesService.getScheduleById(id);
  sendResponse(res, {
    success: true,
    httpStatusCode: status15.OK,
    message: "Schedule retrieved successfully",
    data: schedule
  });
});
var updateSchedule2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const updatedSchedule = await schedulesService.updateSchedule(id, payload);
  sendResponse(res, {
    success: true,
    httpStatusCode: status15.OK,
    message: "Schedule updated successfully",
    data: updatedSchedule
  });
});
var deleteSchedule2 = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    await schedulesService.deleteSchedule(id);
    sendResponse(res, {
      success: true,
      httpStatusCode: status15.OK,
      message: "Schedule deleted successfully"
    });
  }
);
var ScheduleController = {
  createSchedule,
  getAllSchedules: getAllSchedules2,
  getScheduleById: getScheduleById2,
  updateSchedule: updateSchedule2,
  deleteSchedule: deleteSchedule2
};

// src/modules/schedules/schedule.validation.ts
import z6 from "zod";
var createScheduleZodSchema = z6.object({
  startDate: z6.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format"
  }),
  endDate: z6.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format"
  }),
  startTime: z6.string().refine((time) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time), {
    message: "Invalid time format"
  }),
  endTime: z6.string().refine((time) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time), {
    message: "Invalid time format"
  })
});
var updateScheduleZodSchema = z6.object({
  startDate: z6.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format"
  }).optional(),
  endDate: z6.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format"
  }).optional(),
  startTime: z6.string().refine((time) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time), {
    message: "Invalid time format"
  }).optional(),
  endTime: z6.string().refine((time) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time), {
    message: "Invalid time format"
  }).optional()
});
var ScheduleValidation = {
  createScheduleZodSchema,
  updateScheduleZodSchema
};

// src/modules/schedules/schedules.router.ts
var router6 = Router6();
router6.post("/", checkAuth(Role.ADMIN), validateRequest(ScheduleValidation.createScheduleZodSchema), ScheduleController.createSchedule);
router6.get("/", checkAuth(Role.ADMIN, Role.EXPERT), ScheduleController.getAllSchedules);
router6.get("/:id", checkAuth(Role.ADMIN, Role.EXPERT), ScheduleController.getScheduleById);
router6.patch("/:id", checkAuth(Role.ADMIN), validateRequest(ScheduleValidation.updateScheduleZodSchema), ScheduleController.updateSchedule);
router6.delete("/:id", checkAuth(Role.ADMIN), ScheduleController.deleteSchedule);
var scheduleRoutes = router6;

// src/modules/user/user.router.ts
import { Router as Router7 } from "express";

// src/modules/user/user.service.ts
import status16 from "http-status";
var createAdmin = async (payload) => {
  const existsUser = await prisma.user.findUnique({
    where: {
      email: payload.admin.email
    }
  });
  if (existsUser) {
    throw new AppError_default(status16.BAD_REQUEST, "user with same email already exists");
  }
  const userData = await auth.api.signUpEmail({
    body: {
      email: payload.admin.email,
      password: payload.password,
      name: payload.admin.name,
      role: Role.ADMIN,
      needPasswordChange: true
    }
  });
  console.log("User Data from auth:", userData);
  try {
    const result = await prisma.$transaction(async (tx) => {
      const adminData = await tx.admin.create({
        data: {
          userId: userData.user.id,
          ...payload.admin
        }
      });
      console.log("Payload admin:", payload.admin);
      console.log("Admin Data from DB:", adminData.id);
      const admin = await tx.admin.findUnique({
        where: {
          id: adminData.id
        },
        select: {
          id: true,
          name: true,
          email: true,
          contactNumber: true,
          profilePhoto: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              status: true,
              emailVerified: true
            }
          }
        }
      });
      console.log("admin:", admin);
      return admin;
    });
    console.log("result:", result);
    return result;
  } catch (error) {
    console.log("transaction error", error);
    await prisma.user.delete({
      where: {
        id: userData.user.id
      }
    });
    throw new AppError_default(status16.INTERNAL_SERVER_ERROR, "Failed to create admin profile");
  }
};
var getAllClients = async (query) => {
  const queryBuilder = new QueryBuilder(prisma.client, query, {
    searchableFields: ["fullName", "email", "phone", "address", "user.name", "user.email"],
    filterableFields: ["fullName", "email", "phone", "address", "isDeleted", "userId"]
  });
  const result = await queryBuilder.search().filter().where({
    isDeleted: false
  }).include({
    user: {
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        emailVerified: true
      }
    }
  }).paginate().sort().fields().excute();
  return result;
};
var userService = {
  createAdmin,
  getAllClients
};

// src/modules/user/user.controler.ts
import status17 from "http-status";
var createAdmin2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await userService.createAdmin(payload);
  sendResponse(res, {
    success: true,
    httpStatusCode: status17.CREATED,
    message: "Admin created successfully",
    data: result
  });
});
var getAllClients2 = catchAsync(async (req, res) => {
  const result = await userService.getAllClients(req.query);
  sendResponse(res, {
    success: true,
    httpStatusCode: status17.OK,
    message: "Clients retrieved successfully",
    data: result.data,
    meta: result.meta
  });
});
var userController = {
  createAdmin: createAdmin2,
  getAllClients: getAllClients2
};

// src/modules/user/user.validation.ts
import z7 from "zod";
var createAdminZodSchema = z7.object({
  password: z7.string("Password is required").min(8, "Password must be at least 8 characters long").max(50, "Password must be less than 100 characters long"),
  admin: z7.object({
    name: z7.string("Name is required").min(5, "Name must be at least 5 characters long").max(20, "Name must be less than 20 characters long"),
    email: z7.email("Invalid email address"),
    contactNumber: z7.string("Contact number is required").min(11, "Contact number must be at least 10 characters long").max(15, "Contact number must be less than 15 characters long").optional(),
    address: z7.string("Address is required").min(10, "Address must be at least 10 characters long").max(100, "Address must be less than 100 characters long").optional(),
    profilePhoto: z7.url({ message: "Profile photo must be a valid URL" }).optional()
  })
});

// src/modules/user/user.router.ts
var router7 = Router7();
router7.get("/clients", checkAuth(Role.ADMIN), userController.getAllClients);
router7.post("/create-admin", validateRequest(createAdminZodSchema), checkAuth(Role.ADMIN), userController.createAdmin);
var userRouter = router7;

// src/modules/consultation/consultation.router.ts
import { Router as Router8 } from "express";

// src/modules/consultation/consultation.validation.ts
import z8 from "zod";
var bookConsultationValidation = z8.object({
  body: z8.object({
    expertId: z8.string().uuid("Invalid expert id"),
    expertScheduleId: z8.string().uuid("Invalid expert schedule id")
  })
});
var initiateConsultationPaymentValidation = z8.object({
  params: z8.object({
    consultationId: z8.string().uuid("Invalid consultation id")
  })
});

// src/modules/consultation/consultation.controler.ts
import status19 from "http-status";

// src/modules/consultation/consultation.service.ts
import status18 from "http-status";
import { v7 as uuidv7 } from "uuid";

// src/config/stripe.config.ts
import Stripe from "stripe";
var stripe = new Stripe(envVars.STRIPE.STRIPE_SECRET_KEY);

// src/modules/consultation/consultation.service.ts
var bookConsultation = async (payload, user) => {
  const client = await prisma.client.findUniqueOrThrow({
    where: { email: user.email }
  });
  const expert = await prisma.expert.findUniqueOrThrow({
    where: {
      id: payload.expertId,
      isDeleted: false
    }
  });
  const expertSchedule = await prisma.expertSchedule.findUniqueOrThrow({
    where: {
      id: payload.expertScheduleId,
      isDeleted: false
    },
    include: {
      schedule: true
    }
  });
  if (expertSchedule.isBooked) {
    throw new AppError_default(
      status18.BAD_REQUEST,
      "This schedule is already booked for another consultation"
    );
  }
  const videoCallId = uuidv7();
  const result = await prisma.$transaction(async (tx) => {
    const consultation = await tx.consultation.create({
      data: {
        clientId: client.id,
        expertId: expert.id,
        expertScheduleId: expertSchedule.id,
        videoCallId,
        date: expertSchedule.schedule.startDateTime,
        status: ConsultationStatus.PENDING,
        paymentStatus: PaymentStatus.UNPAID
      },
      include: {
        expert: true
      }
    });
    await tx.expertSchedule.update({
      where: { id: expertSchedule.id },
      data: {
        isBooked: true,
        consultationId: consultation.id
      }
    });
    const transactionId = uuidv7();
    const payment = await tx.payment.create({
      data: {
        consultationId: consultation.id,
        amount: expert.consultationFee,
        // adjust field name
        transactionId,
        status: PaymentStatus.UNPAID
      }
    });
    await tx.notification.create({
      data: {
        type: "CONSULTATION_BOOKED",
        message: `Your consultation with ${expert.fullName} has been booked successfully. Please complete the payment to confirm it.`,
        userId: client.userId
      }
    });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            // or "bdt"
            product_data: {
              name: `Consultation with ${expert.fullName}`
            },
            unit_amount: expert.consultationFee * 100
            // cents
          },
          quantity: 1
        }
      ],
      metadata: {
        consultationId: consultation.id,
        paymentId: payment.id
      },
      success_url: `${envVars.FRONTEND_URL}/dashboard/payment/consultation-success`,
      cancel_url: `${envVars.FRONTEND_URL}/dashboard/consultations`
    });
    return {
      consultation,
      payment,
      paymentUrl: session.url
    };
  });
  return {
    consultation: result.consultation,
    payment: result.payment,
    paymentUrl: result.paymentUrl
  };
};
var bookConsultationWithPayLater = async (payload, user) => {
  const client = await prisma.client.findUniqueOrThrow({
    where: { email: user.email }
  });
  const expert = await prisma.expert.findUniqueOrThrow({
    where: {
      id: payload.expertId,
      isDeleted: false
    }
  });
  const expertSchedule = await prisma.expertSchedule.findUniqueOrThrow({
    where: {
      id: payload.expertScheduleId,
      isDeleted: false
    },
    include: {
      schedule: true
    }
  });
  if (expertSchedule.isBooked) {
    throw new AppError_default(
      status18.BAD_REQUEST,
      "This schedule is already booked for another consultation"
    );
  }
  const videoCallId = uuidv7();
  const result = await prisma.$transaction(async (tx) => {
    const consultation = await tx.consultation.create({
      data: {
        clientId: client.id,
        expertId: expert.id,
        expertScheduleId: expertSchedule.id,
        videoCallId,
        date: expertSchedule.schedule.startDateTime,
        status: ConsultationStatus.PENDING,
        paymentStatus: PaymentStatus.UNPAID
      },
      include: {
        expert: true
      }
    });
    await tx.expertSchedule.update({
      where: { id: expertSchedule.id },
      data: {
        isBooked: true,
        consultationId: consultation.id
      }
    });
    const transactionId = String(uuidv7());
    const payment = await tx.payment.create({
      data: {
        consultationId: consultation.id,
        amount: expert.consultationFee,
        transactionId,
        status: PaymentStatus.UNPAID
      }
    });
    await tx.notification.create({
      data: {
        type: "CONSULTATION_BOOKED",
        message: `Your consultation with ${expert.fullName} has been booked successfully.`,
        userId: client.userId
      }
    });
    return {
      consultation,
      payment
    };
  });
  return result;
};
var getMyBookings = async (user) => {
  if (user.role === Role.CLIENT) {
    const client = await prisma.client.findUniqueOrThrow({
      where: { userId: user.userId }
    });
    return prisma.consultation.findMany({
      where: { clientId: client.id },
      include: {
        client: true,
        expert: true,
        payment: true,
        expertSchedule: {
          include: {
            schedule: true
          }
        },
        testimonial: true
      },
      orderBy: { createdAt: "desc" }
    });
  }
  if (user.role === Role.EXPERT) {
    const expert = await prisma.expert.findUniqueOrThrow({
      where: { userId: user.userId }
    });
    return prisma.consultation.findMany({
      where: { expertId: expert.id },
      include: {
        client: true,
        expert: true,
        payment: true,
        expertSchedule: {
          include: {
            schedule: true
          }
        },
        testimonial: true
      },
      orderBy: { createdAt: "desc" }
    });
  }
  throw new AppError_default(status18.FORBIDDEN, "Only clients and experts can view their bookings");
};
var initiateConsultationPayment = async (consultationId, user) => {
  const client = await prisma.client.findUniqueOrThrow({
    where: { email: user.email }
  });
  const consultation = await prisma.consultation.findUniqueOrThrow({
    where: {
      id: consultationId,
      clientId: client.id
    },
    include: {
      expert: true,
      payment: true
    }
  });
  if (!consultation.payment) {
    throw new AppError_default(status18.BAD_REQUEST, "Payment not found for this consultation");
  }
  if (consultation.payment.status === PaymentStatus.PAID) {
    throw new AppError_default(
      status18.BAD_REQUEST,
      "Payment already completed for this consultation"
    );
  }
  if (consultation.status === ConsultationStatus.CANCELLED) {
    throw new AppError_default(
      status18.BAD_REQUEST,
      "This consultation is canceled. Payment cannot be initiated."
    );
  }
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Consultation with ${consultation.expert?.fullName}`
          },
          unit_amount: consultation.payment.amount * 100
        },
        quantity: 1
      }
    ],
    metadata: {
      consultationId: consultation.id,
      paymentId: consultation.payment.id
    },
    success_url: `${envVars.FRONTEND_URL}/dashboard/payment/consultation-success`,
    cancel_url: `${envVars.FRONTEND_URL}/dashboard/consultations`
  });
  return {
    paymentUrl: session.url
  };
};
var cancelUnpaidConsultations = async () => {
  const now = /* @__PURE__ */ new Date();
  const cutoffTime = new Date(now.getTime() + 30 * 60 * 1e3);
  const unpaidConsultations = await prisma.consultation.findMany({
    where: {
      date: { lte: cutoffTime },
      // start time is within next 30 minutes
      paymentStatus: PaymentStatus.UNPAID,
      status: ConsultationStatus.PENDING
    },
    select: {
      id: true,
      expertScheduleId: true
    }
  });
  if (!unpaidConsultations.length) return;
  const consultationIds = unpaidConsultations.map((c) => c.id);
  const scheduleIds = unpaidConsultations.map((c) => c.expertScheduleId);
  await prisma.$transaction(async (tx) => {
    await tx.consultation.updateMany({
      where: { id: { in: consultationIds } },
      data: { status: ConsultationStatus.CANCELLED }
    });
    await tx.payment.deleteMany({
      where: { consultationId: { in: consultationIds } }
    });
    await tx.expertSchedule.updateMany({
      where: { id: { in: scheduleIds } },
      data: {
        isBooked: false,
        consultationId: null
      }
    });
  });
};
var consultationService = {
  bookConsultation,
  bookConsultationWithPayLater,
  getMyBookings,
  initiateConsultationPayment,
  cancelUnpaidConsultations
};

// src/modules/consultation/consultation.controler.ts
var bookConsultation2 = catchAsync(async (req, res) => {
  const result = await consultationService.bookConsultation(req.body, req.user);
  sendResponse(res, {
    httpStatusCode: status19.CREATED,
    success: true,
    message: "Consultation booked successfully",
    data: result
  });
});
var bookConsultationWithPayLater2 = catchAsync(async (req, res) => {
  const result = await consultationService.bookConsultationWithPayLater(
    req.body,
    req.user
  );
  sendResponse(res, {
    httpStatusCode: status19.CREATED,
    success: true,
    message: "Consultation booked with pay later successfully",
    data: result
  });
});
var getMyBookings2 = catchAsync(async (req, res) => {
  const result = await consultationService.getMyBookings(req.user);
  sendResponse(res, {
    httpStatusCode: status19.OK,
    success: true,
    message: "My bookings retrieved successfully",
    data: result
  });
});
var initiateConsultationPayment2 = catchAsync(async (req, res) => {
  const { consultationId } = req.params;
  const result = await consultationService.initiateConsultationPayment(
    consultationId,
    req.user
  );
  sendResponse(res, {
    httpStatusCode: status19.OK,
    success: true,
    message: "Payment session created successfully",
    data: result
  });
});
var cancelUnpaidConsultations2 = catchAsync(async (_req, res) => {
  await consultationService.cancelUnpaidConsultations();
  sendResponse(res, {
    httpStatusCode: status19.OK,
    success: true,
    message: "Unpaid consultations canceled successfully",
    data: null
  });
});
var consultationController = {
  bookConsultation: bookConsultation2,
  bookConsultationWithPayLater: bookConsultationWithPayLater2,
  getMyBookings: getMyBookings2,
  initiateConsultationPayment: initiateConsultationPayment2,
  cancelUnpaidConsultations: cancelUnpaidConsultations2
};

// src/modules/consultation/consultation.router.ts
var router8 = Router8();
router8.post(
  "/book",
  checkAuth(Role.CLIENT),
  validateRequest(bookConsultationValidation),
  consultationController.bookConsultation
);
router8.post(
  "/book/pay-later",
  checkAuth(Role.CLIENT),
  validateRequest(bookConsultationValidation),
  consultationController.bookConsultationWithPayLater
);
router8.get(
  "/my-bookings",
  checkAuth(Role.CLIENT, Role.EXPERT),
  consultationController.getMyBookings
);
router8.post(
  "/:consultationId/initiate-payment",
  checkAuth(Role.CLIENT),
  validateRequest(initiateConsultationPaymentValidation),
  consultationController.initiateConsultationPayment
);
router8.post(
  "/cancel-unpaid",
  checkAuth(Role.ADMIN),
  consultationController.cancelUnpaidConsultations
);
var consultationRouter = router8;

// src/modules/industry/industry.router.ts
import { Router as Router9 } from "express";

// src/modules/industry/industry.validation.ts
import z9 from "zod";
var createIndustryValidation = z9.object({
  name: z9.string().min(2, "Industry name is too short"),
  description: z9.string().optional(),
  icon: z9.string().url("Invalid icon URL").optional()
});
var updateIndustryValidation = z9.object({
  name: z9.string().optional(),
  description: z9.string().optional(),
  icon: z9.string().url("Invalid icon URL").optional()
});

// src/modules/industry/industry.controler.ts
import status21 from "http-status";

// src/modules/industry/industry.service.ts
import status20 from "http-status";
var createIndustry = async (payload) => {
  const exists = await prisma.industry.findUnique({
    where: { name: payload.name }
  });
  if (exists) {
    throw new AppError_default(status20.CONFLICT, "Industry already exists");
  }
  const industry = await prisma.industry.create({
    data: {
      name: payload.name,
      description: payload.description,
      icon: payload.icon
    }
  });
  return industry;
};
var getAllIndustries = async () => {
  const industries = await prisma.industry.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: "desc" }
  });
  return industries;
};
var getIndustryById = async (id) => {
  const industry = await prisma.industry.findUnique({
    where: { id, isDeleted: false },
    include: { experts: true }
  });
  if (!industry) {
    throw new AppError_default(status20.NOT_FOUND, "Industry not found");
  }
  return industry;
};
var updateIndustry = async (id, data) => {
  const exists = await prisma.industry.findUnique({
    where: { id, isDeleted: false }
  });
  if (!exists) {
    throw new AppError_default(status20.NOT_FOUND, "Industry not found");
  }
  const updated = await prisma.industry.update({
    where: { id },
    data
  });
  return updated;
};
var deleteIndustry = async (id) => {
  const exists = await prisma.industry.findUnique({
    where: { id }
  });
  if (!exists) {
    throw new AppError_default(status20.NOT_FOUND, "Industry not found");
  }
  const deleted = await prisma.industry.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: /* @__PURE__ */ new Date()
    }
  });
  return deleted;
};
var industryService = {
  createIndustry,
  getAllIndustries,
  getIndustryById,
  updateIndustry,
  deleteIndustry
};

// src/modules/industry/industry.controler.ts
var createIndustry2 = catchAsync(async (req, res) => {
  const { name, description } = req.body;
  const icon = req.file?.path || void 0;
  console.log(icon);
  const result = await industryService.createIndustry({
    name,
    description,
    icon
  });
  sendResponse(res, {
    httpStatusCode: status21.CREATED,
    success: true,
    message: "Industry created successfully",
    data: result
  });
});
var getAllIndustries2 = catchAsync(async (req, res) => {
  const result = await industryService.getAllIndustries();
  sendResponse(res, {
    httpStatusCode: status21.OK,
    success: true,
    message: "Industries fetched successfully",
    data: result
  });
});
var getIndustryById2 = catchAsync(async (req, res) => {
  const result = await industryService.getIndustryById(req.params.id);
  sendResponse(res, {
    httpStatusCode: status21.OK,
    success: true,
    message: "Industry retrieved successfully",
    data: result
  });
});
var updateIndustry2 = catchAsync(async (req, res) => {
  const result = await industryService.updateIndustry(req.params.id, req.body);
  sendResponse(res, {
    httpStatusCode: status21.OK,
    success: true,
    message: "Industry updated successfully",
    data: result
  });
});
var deleteIndustry2 = catchAsync(async (req, res) => {
  const result = await industryService.deleteIndustry(req.params.id);
  sendResponse(res, {
    httpStatusCode: status21.OK,
    success: true,
    message: "Industry deleted successfully",
    data: result
  });
});
var industryController = {
  createIndustry: createIndustry2,
  getAllIndustries: getAllIndustries2,
  getIndustryById: getIndustryById2,
  updateIndustry: updateIndustry2,
  deleteIndustry: deleteIndustry2
};

// src/modules/industry/industry.router.ts
var router9 = Router9();
router9.post("/", multerUpload.single("file"), validateRequest(createIndustryValidation), checkAuth(Role.ADMIN), industryController.createIndustry);
router9.get("/", industryController.getAllIndustries);
router9.get("/:id", industryController.getIndustryById);
router9.delete("/:id", checkAuth(Role.ADMIN), industryController.deleteIndustry);
router9.put("/:id", checkAuth(Role.ADMIN), industryController.updateIndustry);
var industryRouter = router9;

// src/modules/testimonial/testimonial.router.ts
import express from "express";

// src/modules/testimonial/testimonial.validation.ts
import { z as z10 } from "zod";
var createTestimonialSchema = z10.object({
  body: z10.object({
    rating: z10.number().min(1).max(5),
    comment: z10.string().optional(),
    consultationId: z10.string().uuid()
  })
});
var updateTestimonialSchema = z10.object({
  body: z10.object({
    rating: z10.number().min(1).max(5).optional(),
    comment: z10.string().optional()
  })
});
var replyToTestimonialSchema = z10.object({
  body: z10.object({
    expertReply: z10.string().trim().min(1, "Reply is required")
  })
});
var updateReviewStatusSchema = z10.object({
  body: z10.object({
    status: z10.enum(["APPROVED", "HIDDEN"])
  })
});

// src/modules/testimonial/testimonial.controler.ts
import status23 from "http-status";

// src/modules/testimonial/testimonial.service.ts
import status22 from "http-status";

// src/modules/testimonial/testimonial.constant.ts
var testimonialSearchableFields = ["comment", "expertReply"];
var testimonialFilterableFields = [
  "rating",
  "expertId",
  "clientId",
  "status"
];
var testimonialIncludeConfig = {
  client: true,
  expert: true,
  consultation: true
};

// src/modules/testimonial/testimonial.service.ts
var createTestimonial = async (clientId, payload) => {
  const { rating, comment, consultationId } = payload;
  const consultation = await prisma.consultation.findUnique({
    where: { id: consultationId }
  });
  if (!consultation) {
    throw new AppError_default(status22.NOT_FOUND, "Consultation not found");
  }
  if (consultation.clientId !== clientId) {
    throw new AppError_default(status22.FORBIDDEN, "Not your consultation");
  }
  if (!consultation.expertId) {
    throw new AppError_default(
      status22.BAD_REQUEST,
      "Consultation has no expert assigned"
    );
  }
  const expertId = consultation.expertId;
  const testimonial = await prisma.$transaction(async (tx) => {
    const createdTestimonial = await tx.testimonial.create({
      data: {
        rating,
        comment,
        clientId,
        expertId,
        consultationId,
        status: ReviewStatus.PENDING
      }
    });
    const expert = await tx.expert.findUnique({
      where: { id: expertId },
      select: { userId: true }
    });
    if (expert) {
      await tx.notification.create({
        data: {
          type: "NEW_TESTIMONIAL",
          message: "You received a new review from a client.",
          userId: expert.userId
        }
      });
    }
    return createdTestimonial;
  });
  return testimonial;
};
var getAllTestimonials = async (query, includeAll = false) => {
  const effectiveQuery = includeAll ? query : { ...query, status: ReviewStatus.APPROVED };
  const qb = new QueryBuilder(prisma.testimonial, effectiveQuery, {
    searchableFields: testimonialSearchableFields,
    filterableFields: testimonialFilterableFields
  });
  const result = await qb.search().filter().paginate().dynamicInclude(testimonialIncludeConfig).sort().fields().excute();
  return result;
};
var getTestimonialsByExpert = async (expertId) => {
  const result = await prisma.testimonial.findMany({
    where: {
      expertId,
      status: ReviewStatus.APPROVED
    },
    include: testimonialIncludeConfig,
    orderBy: { createdAt: "desc" }
  });
  return result;
};
var updateTestimonial = async (id, clientId, payload) => {
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) {
    throw new AppError_default(status22.NOT_FOUND, "Testimonial not found");
  }
  if (testimonial.clientId !== clientId) {
    throw new AppError_default(status22.FORBIDDEN, "Not your testimonial");
  }
  return prisma.testimonial.update({
    where: { id },
    data: {
      ...payload,
      status: ReviewStatus.PENDING
    }
  });
};
var replyToTestimonial = async (id, expertUserId, payload) => {
  const expert = await prisma.expert.findUnique({
    where: { userId: expertUserId },
    select: { id: true, fullName: true }
  });
  if (!expert) {
    throw new AppError_default(status22.NOT_FOUND, "Expert profile not found");
  }
  const testimonial = await prisma.testimonial.findUnique({
    where: { id },
    include: {
      client: {
        select: { userId: true }
      }
    }
  });
  if (!testimonial) {
    throw new AppError_default(status22.NOT_FOUND, "Testimonial not found");
  }
  if (testimonial.expertId !== expert.id) {
    throw new AppError_default(status22.FORBIDDEN, "You can only reply to your own reviews");
  }
  const result = await prisma.$transaction(async (tx) => {
    const updatedTestimonial = await tx.testimonial.update({
      where: { id },
      data: {
        expertReply: payload.expertReply,
        expertRepliedAt: /* @__PURE__ */ new Date()
      }
    });
    await tx.notification.create({
      data: {
        type: "REVIEW_REPLY",
        message: `${expert.fullName} replied to your review.`,
        userId: testimonial.client.userId
      }
    });
    return updatedTestimonial;
  });
  return result;
};
var updateReviewStatus = async (id, payload) => {
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) {
    throw new AppError_default(status22.NOT_FOUND, "Testimonial not found");
  }
  return prisma.testimonial.update({
    where: { id },
    data: {
      status: payload.status
    }
  });
};
var deleteTestimonial = async (id, clientId) => {
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) {
    throw new AppError_default(status22.NOT_FOUND, "Testimonial not found");
  }
  if (testimonial.clientId !== clientId) {
    throw new AppError_default(status22.FORBIDDEN, "Not your testimonial");
  }
  await prisma.testimonial.delete({ where: { id } });
  return { message: "Testimonial deleted successfully" };
};
var testimonialService = {
  createTestimonial,
  getAllTestimonials,
  getTestimonialsByExpert,
  updateTestimonial,
  replyToTestimonial,
  updateReviewStatus,
  deleteTestimonial
};

// src/modules/testimonial/testimonial.controler.ts
var createTestimonial2 = catchAsync(async (req, res) => {
  const user = req.user;
  const payload = req.body;
  const testimonial = await testimonialService.createTestimonial(
    user.userId,
    payload
  );
  sendResponse(res, {
    success: true,
    httpStatusCode: status23.CREATED,
    message: "Testimonial created successfully",
    data: testimonial
  });
});
var getAllTestimonials2 = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await testimonialService.getAllTestimonials(
    query
  );
  sendResponse(res, {
    success: true,
    httpStatusCode: status23.OK,
    message: "Testimonials retrieved successfully",
    data: result.data,
    meta: result.meta
  });
});
var getAllTestimonialsForAdmin = catchAsync(
  async (req, res) => {
    const query = req.query;
    const result = await testimonialService.getAllTestimonials(
      query,
      true
    );
    sendResponse(res, {
      success: true,
      httpStatusCode: status23.OK,
      message: "All testimonials retrieved successfully",
      data: result.data,
      meta: result.meta
    });
  }
);
var getTestimonialsByExpert2 = catchAsync(
  async (req, res) => {
    const { expertId } = req.params;
    const normalizedExpertId = Array.isArray(expertId) ? expertId[0] : expertId;
    const testimonials = await testimonialService.getTestimonialsByExpert(
      normalizedExpertId
    );
    sendResponse(res, {
      success: true,
      httpStatusCode: status23.OK,
      message: "Expert testimonials retrieved successfully",
      data: testimonials
    });
  }
);
var updateTestimonial2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const clientId = req.user.userId;
  const payload = req.body;
  const updated = await testimonialService.updateTestimonial(
    id,
    clientId,
    payload
  );
  sendResponse(res, {
    success: true,
    httpStatusCode: status23.OK,
    message: "Testimonial updated successfully",
    data: updated
  });
});
var replyToTestimonial2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const expertUserId = req.user.userId;
  const result = await testimonialService.replyToTestimonial(
    id,
    expertUserId,
    req.body
  );
  sendResponse(res, {
    success: true,
    httpStatusCode: status23.OK,
    message: "Reply added successfully",
    data: result
  });
});
var updateReviewStatus2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await testimonialService.updateReviewStatus(
    id,
    req.body
  );
  sendResponse(res, {
    success: true,
    httpStatusCode: status23.OK,
    message: "Review status updated successfully",
    data: result
  });
});
var deleteTestimonial2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const clientId = req.user.userId;
  await testimonialService.deleteTestimonial(id, clientId);
  sendResponse(res, {
    success: true,
    httpStatusCode: status23.OK,
    message: "Testimonial deleted successfully"
  });
});
var TestimonialController = {
  createTestimonial: createTestimonial2,
  getAllTestimonials: getAllTestimonials2,
  getAllTestimonialsForAdmin,
  getTestimonialsByExpert: getTestimonialsByExpert2,
  updateTestimonial: updateTestimonial2,
  replyToTestimonial: replyToTestimonial2,
  updateReviewStatus: updateReviewStatus2,
  deleteTestimonial: deleteTestimonial2
};

// src/modules/testimonial/testimonial.router.ts
var router10 = express.Router();
router10.post(
  "/",
  checkAuth(Role.CLIENT),
  validateRequest(createTestimonialSchema),
  TestimonialController.createTestimonial
);
router10.get("/", TestimonialController.getAllTestimonials);
router10.get("/admin", checkAuth(Role.ADMIN), TestimonialController.getAllTestimonialsForAdmin);
router10.get("/expert/:expertId", TestimonialController.getTestimonialsByExpert);
router10.patch(
  "/:id/reply",
  checkAuth(Role.EXPERT),
  validateRequest(replyToTestimonialSchema),
  TestimonialController.replyToTestimonial
);
router10.patch(
  "/:id/status",
  checkAuth(Role.ADMIN),
  validateRequest(updateReviewStatusSchema),
  TestimonialController.updateReviewStatus
);
router10.put(
  "/:id",
  checkAuth(Role.CLIENT),
  validateRequest(updateTestimonialSchema),
  TestimonialController.updateTestimonial
);
router10.delete(
  "/:id",
  checkAuth(Role.CLIENT),
  TestimonialController.deleteTestimonial
);
var testimonialRoutes = router10;

// src/modules/stats/stats.router.ts
import express2 from "express";

// src/modules/stats/stats.controler.ts
import status25 from "http-status";

// src/modules/stats/stats.service.ts
import status24 from "http-status";
var getDashboardStatsData = async (user) => {
  switch (user.role) {
    case Role.ADMIN:
      return getAdminStats();
    case Role.EXPERT:
      return getExpertStats(user);
    case Role.CLIENT:
      return getClientStats(user);
    default:
      throw new AppError_default(status24.BAD_REQUEST, "Invalid user role for dashboard");
  }
};
var getAdminStats = async () => {
  const expertCount = await prisma.expert.count();
  const clientCount = await prisma.client.count();
  const consultationCount = await prisma.consultation.count();
  const industryCount = await prisma.industry.count();
  const paymentCount = await prisma.payment.count();
  const userCount = await prisma.user.count();
  const totalRevenueAgg = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: { status: PaymentStatus.PAID }
  });
  const consultationStatusDistribution = await prisma.consultation.groupBy({
    by: ["status"],
    _count: { id: true }
  });
  const formattedStatus = consultationStatusDistribution.map(({ status: status30, _count }) => ({
    status: status30,
    count: _count.id
  }));
  const revenueByMonth = await getRevenueByMonth();
  return {
    expertCount,
    clientCount,
    consultationCount,
    industryCount,
    paymentCount,
    userCount,
    totalRevenue: totalRevenueAgg._sum.amount || 0,
    consultationStatusDistribution: formattedStatus,
    revenueByMonth
  };
};
var getExpertStats = async (user) => {
  const expert = await prisma.expert.findUniqueOrThrow({
    where: { userId: user.userId }
  });
  const consultationCount = await prisma.consultation.count({
    where: { expertId: expert.id }
  });
  const uniqueClients = await prisma.consultation.groupBy({
    by: ["clientId"],
    where: { expertId: expert.id },
    _count: { id: true }
  });
  const totalRevenueAgg = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: {
      status: PaymentStatus.PAID,
      consultation: { expertId: expert.id }
    }
  });
  const consultationStatusDistribution = await prisma.consultation.groupBy({
    by: ["status"],
    where: { expertId: expert.id },
    _count: { id: true }
  });
  const formattedStatus = consultationStatusDistribution.map(({ status: status30, _count }) => ({
    status: status30,
    count: _count.id
  }));
  const reviewCount = await prisma.testimonial.count({
    where: { expertId: expert.id }
  });
  return {
    consultationCount,
    clientCount: uniqueClients.length,
    totalRevenue: totalRevenueAgg._sum.amount || 0,
    consultationStatusDistribution: formattedStatus,
    reviewCount
  };
};
var getClientStats = async (user) => {
  const client = await prisma.client.findUnique({
    where: { userId: user.userId },
    select: { id: true }
  });
  if (!client) {
    return {
      consultationCount: 0,
      consultationStatusDistribution: []
    };
  }
  const consultationCount = await prisma.consultation.count({
    where: { clientId: client.id }
  });
  const consultationStatusDistribution = await prisma.consultation.groupBy({
    by: ["status"],
    where: { clientId: client.id },
    _count: { id: true }
  });
  const formattedStatus = consultationStatusDistribution.map(({ status: status30, _count }) => ({
    status: status30,
    count: _count.id
  }));
  return {
    consultationCount,
    consultationStatusDistribution: formattedStatus
  };
};
var getRevenueByMonth = async () => {
  const revenueByMonth = await prisma.$queryRaw`
    SELECT DATE_TRUNC('month', "createdAt") AS month,
           CAST(SUM("amount") AS INTEGER) AS amount
    FROM "payments"
    WHERE "status" = 'PAID'
    GROUP BY month
    ORDER BY month ASC;
  `;
  return revenueByMonth;
};
var StatsService = {
  getDashboardStatsData
};

// src/modules/stats/stats.controler.ts
var getDashboardStatsData2 = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await StatsService.getDashboardStatsData(user);
  sendResponse(res, {
    httpStatusCode: status25.OK,
    success: true,
    message: "Dashboard stats retrieved successfully!",
    data: result
  });
});
var StatsController = {
  getDashboardStatsData: getDashboardStatsData2
};

// src/modules/stats/stats.router.ts
var router11 = express2.Router();
router11.get(
  "/",
  checkAuth(Role.ADMIN, Role.EXPERT, Role.CLIENT),
  // Only allow authenticated users with these roles
  StatsController.getDashboardStatsData
);
var StatsRoutes = router11;

// src/modules/payment/payment.router.ts
import { Router as Router10 } from "express";
var router12 = Router10();
var PaymentRoutes = router12;

// src/modules/notification/notification.route.ts
import { Router as Router11 } from "express";

// src/modules/notification/notification.controler.ts
import status27 from "http-status";

// src/modules/notification/notification.service.ts
import status26 from "http-status";
var createNotification = async (payload) => {
  const { type, message, userId, role } = payload;
  if (!type || !message) {
    throw new AppError_default(status26.BAD_REQUEST, "Type and message are required");
  }
  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    if (!user) {
      throw new AppError_default(status26.NOT_FOUND, "Target user not found");
    }
    return prisma.notification.create({
      data: {
        type,
        message,
        userId
      }
    });
  }
  if (role) {
    if (!Object.values(Role).includes(role)) {
      throw new AppError_default(status26.BAD_REQUEST, "Invalid role provided");
    }
    const users = await prisma.user.findMany({
      where: {
        role,
        isDeleted: false,
        status: UserStatus.ACTIVE
      },
      select: { id: true }
    });
    if (!users.length) {
      return { count: 0 };
    }
    const result = await prisma.notification.createMany({
      data: users.map((user) => ({
        type,
        message,
        userId: user.id
      }))
    });
    return result;
  }
  throw new AppError_default(status26.BAD_REQUEST, "Either userId or role is required");
};
var getAllNotifications = async () => {
  return prisma.notification.findMany({
    orderBy: { createdAt: "desc" }
  });
};
var getMyNotifications = async (user) => {
  return prisma.notification.findMany({
    where: { userId: user.userId },
    orderBy: { createdAt: "desc" }
  });
};
var getUnreadCount = async (user) => {
  const unreadCount = await prisma.notification.count({
    where: {
      userId: user.userId,
      read: false
    }
  });
  return { unreadCount };
};
var markAsRead = async (id, user) => {
  const notification = await prisma.notification.findUnique({
    where: { id }
  });
  if (!notification) {
    throw new AppError_default(status26.NOT_FOUND, "Notification not found");
  }
  if (user.role !== Role.ADMIN && notification.userId !== user.userId) {
    throw new AppError_default(status26.FORBIDDEN, "Forbidden access to this notification");
  }
  return prisma.notification.update({
    where: { id },
    data: { read: true }
  });
};
var markAllAsRead = async (user) => {
  const result = await prisma.notification.updateMany({
    where: {
      userId: user.userId,
      read: false
    },
    data: { read: true }
  });
  return result;
};
var deleteNotification = async (id, user) => {
  const notification = await prisma.notification.findUnique({
    where: { id }
  });
  if (!notification) {
    throw new AppError_default(status26.NOT_FOUND, "Notification not found");
  }
  if (user.role !== Role.ADMIN && notification.userId !== user.userId) {
    throw new AppError_default(status26.FORBIDDEN, "Forbidden access to this notification");
  }
  await prisma.notification.delete({
    where: { id }
  });
  return null;
};
var notificationService = {
  createNotification,
  getAllNotifications,
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification
};

// src/modules/notification/notification.controler.ts
var createNotification2 = catchAsync(async (req, res) => {
  const result = await notificationService.createNotification(req.body);
  sendResponse(res, {
    httpStatusCode: status27.CREATED,
    success: true,
    message: "Notification created successfully",
    data: result
  });
});
var getAllNotifications2 = catchAsync(async (_req, res) => {
  const result = await notificationService.getAllNotifications();
  sendResponse(res, {
    httpStatusCode: status27.OK,
    success: true,
    message: "Notifications retrieved successfully",
    data: result
  });
});
var getMyNotifications2 = catchAsync(async (req, res) => {
  const result = await notificationService.getMyNotifications(req.user);
  sendResponse(res, {
    httpStatusCode: status27.OK,
    success: true,
    message: "My notifications retrieved successfully",
    data: result
  });
});
var getUnreadCount2 = catchAsync(async (req, res) => {
  const result = await notificationService.getUnreadCount(req.user);
  sendResponse(res, {
    httpStatusCode: status27.OK,
    success: true,
    message: "Unread notification count retrieved successfully",
    data: result
  });
});
var markAsRead2 = catchAsync(async (req, res) => {
  const result = await notificationService.markAsRead(String(req.params.id), req.user);
  sendResponse(res, {
    httpStatusCode: status27.OK,
    success: true,
    message: "Notification marked as read",
    data: result
  });
});
var markAllAsRead2 = catchAsync(async (req, res) => {
  const result = await notificationService.markAllAsRead(req.user);
  sendResponse(res, {
    httpStatusCode: status27.OK,
    success: true,
    message: "All notifications marked as read",
    data: result
  });
});
var deleteNotification2 = catchAsync(async (req, res) => {
  await notificationService.deleteNotification(String(req.params.id), req.user);
  sendResponse(res, {
    httpStatusCode: status27.OK,
    success: true,
    message: "Notification deleted successfully",
    data: null
  });
});
var notificationController = {
  createNotification: createNotification2,
  getAllNotifications: getAllNotifications2,
  getMyNotifications: getMyNotifications2,
  getUnreadCount: getUnreadCount2,
  markAsRead: markAsRead2,
  markAllAsRead: markAllAsRead2,
  deleteNotification: deleteNotification2
};

// src/modules/notification/notification.route.ts
var router13 = Router11();
router13.get(
  "/my",
  checkAuth(Role.ADMIN, Role.EXPERT, Role.CLIENT),
  notificationController.getMyNotifications
);
router13.get(
  "/unread-count",
  checkAuth(Role.ADMIN, Role.EXPERT, Role.CLIENT),
  notificationController.getUnreadCount
);
router13.patch(
  "/read-all",
  checkAuth(Role.ADMIN, Role.EXPERT, Role.CLIENT),
  notificationController.markAllAsRead
);
router13.patch(
  "/:id/read",
  checkAuth(Role.ADMIN, Role.EXPERT, Role.CLIENT),
  notificationController.markAsRead
);
router13.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.EXPERT, Role.CLIENT),
  notificationController.deleteNotification
);
router13.post("/", checkAuth(Role.ADMIN), notificationController.createNotification);
router13.get("/", checkAuth(Role.ADMIN), notificationController.getAllNotifications);
var notificationRouter = router13;

// src/modules/client/client.router.ts
import { Router as Router12 } from "express";

// src/modules/client/client.controler.ts
import status29 from "http-status";

// src/modules/client/client.service.ts
import status28 from "http-status";
var getAllClients3 = async (query) => {
  const queryBuilder = new QueryBuilder(prisma.client, query, {
    searchableFields: ["fullName", "email", "phone", "address", "user.name", "user.email"],
    filterableFields: ["fullName", "email", "phone", "address", "isDeleted", "userId"]
  });
  const result = await queryBuilder.search().filter().where({ isDeleted: false }).include({ user: true }).paginate().sort().fields().excute();
  return result;
};
var getClientById = async (id) => {
  const client = await prisma.client.findUnique({
    where: { id, isDeleted: false },
    include: {
      user: true,
      consultations: true,
      testimonials: true
    }
  });
  if (!client) {
    throw new AppError_default(status28.NOT_FOUND, "Client not found");
  }
  return client;
};
var getMyProfile = async (userId) => {
  const client = await prisma.client.findUnique({
    where: { userId, isDeleted: false },
    include: {
      user: true,
      consultations: true,
      testimonials: true
    }
  });
  if (!client) {
    throw new AppError_default(status28.NOT_FOUND, "Client profile not found");
  }
  return client;
};
var updateClient = async (id, payload, user) => {
  const existingClient = await prisma.client.findUnique({
    where: { id, isDeleted: false },
    include: { user: true }
  });
  if (!existingClient) {
    throw new AppError_default(status28.NOT_FOUND, "Client not found");
  }
  if (user.role !== Role.ADMIN && existingClient.userId !== user.userId) {
    throw new AppError_default(status28.FORBIDDEN, "Forbidden access to update this client");
  }
  const result = await prisma.$transaction(async (tx) => {
    if (payload.email && payload.email !== existingClient.email) {
      const duplicateUser = await tx.user.findFirst({
        where: {
          email: payload.email,
          NOT: { id: existingClient.userId }
        }
      });
      if (duplicateUser) {
        throw new AppError_default(status28.BAD_REQUEST, "User with same email already exists");
      }
    }
    await tx.user.update({
      where: { id: existingClient.userId },
      data: {
        ...payload.email ? { email: payload.email } : {},
        ...payload.fullName ? { name: payload.fullName } : {}
      }
    });
    return tx.client.update({
      where: { id },
      data: {
        ...payload.fullName !== void 0 ? { fullName: payload.fullName } : {},
        ...payload.email !== void 0 ? { email: payload.email } : {},
        ...payload.profilePhoto !== void 0 ? { profilePhoto: payload.profilePhoto } : {},
        ...payload.phone !== void 0 ? { phone: payload.phone } : {},
        ...payload.address !== void 0 ? { address: payload.address } : {}
      },
      include: { user: true }
    });
  });
  return result;
};
var deleteClient = async (id) => {
  const client = await prisma.client.findUnique({
    where: { id },
    include: { user: true }
  });
  if (!client) {
    throw new AppError_default(status28.NOT_FOUND, "Client not found");
  }
  await prisma.$transaction(async (tx) => {
    await tx.client.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: /* @__PURE__ */ new Date()
      }
    });
    await tx.user.update({
      where: { id: client.userId },
      data: {
        isDeleted: true,
        deletedAt: /* @__PURE__ */ new Date(),
        status: UserStatus.DELETED
      }
    });
    await tx.session.deleteMany({
      where: { userId: client.userId }
    });
  });
  return { message: "Client deleted successfully" };
};
var clientService = {
  getAllClients: getAllClients3,
  getClientById,
  getMyProfile,
  updateClient,
  deleteClient
};

// src/modules/client/client.controler.ts
var getAllClients4 = catchAsync(async (req, res) => {
  const result = await clientService.getAllClients(req.query);
  sendResponse(res, {
    httpStatusCode: status29.OK,
    success: true,
    message: "Clients fetched successfully",
    data: result.data,
    meta: result.meta
  });
});
var getClientById2 = catchAsync(async (req, res) => {
  const result = await clientService.getClientById(String(req.params.id));
  sendResponse(res, {
    httpStatusCode: status29.OK,
    success: true,
    message: "Client retrieved successfully",
    data: result
  });
});
var getMyProfile2 = catchAsync(async (req, res) => {
  const result = await clientService.getMyProfile(req.user.userId);
  sendResponse(res, {
    httpStatusCode: status29.OK,
    success: true,
    message: "Client profile retrieved successfully",
    data: result
  });
});
var updateClient2 = catchAsync(async (req, res) => {
  const result = await clientService.updateClient(
    String(req.params.id),
    req.body,
    req.user
  );
  sendResponse(res, {
    httpStatusCode: status29.OK,
    success: true,
    message: "Client updated successfully",
    data: result
  });
});
var deleteClient2 = catchAsync(async (req, res) => {
  const result = await clientService.deleteClient(String(req.params.id));
  sendResponse(res, {
    httpStatusCode: status29.OK,
    success: true,
    message: "Client deleted successfully",
    data: result
  });
});
var clientController = {
  getAllClients: getAllClients4,
  getClientById: getClientById2,
  getMyProfile: getMyProfile2,
  updateClient: updateClient2,
  deleteClient: deleteClient2
};

// src/modules/client/client.router.ts
var router14 = Router12();
router14.get("/", checkAuth(Role.ADMIN), clientController.getAllClients);
router14.get("/me", checkAuth(Role.CLIENT, Role.ADMIN), clientController.getMyProfile);
router14.get("/:id", checkAuth(Role.ADMIN), clientController.getClientById);
router14.put("/:id", checkAuth(Role.ADMIN, Role.CLIENT), clientController.updateClient);
router14.delete("/:id", checkAuth(Role.ADMIN), clientController.deleteClient);
var clientRouter = router14;

// src/index.ts
var router15 = Router13();
router15.use("/auth", authRoutes);
router15.use("/users", userRouter);
router15.use("/experts", expertRouter);
router15.use("/clients", clientRouter);
router15.use("/schedules", scheduleRoutes);
router15.use("/expert-schedules", expertScheduleRouter);
router15.use("/consultations", consultationRouter);
router15.use("/admin", adminRouter);
router15.use("/stats", StatsRoutes);
router15.use("/payments", PaymentRoutes);
router15.use("/notifications", notificationRouter);
router15.use("/industries", industryRouter);
router15.use("/expert-verification", expertVerificationRouter);
router15.use("/testimonial", testimonialRoutes);
var indexRoutes = router15;

export {
  AppError_default,
  envVars,
  prismaNamespace_exports,
  PaymentStatus,
  Role,
  prisma,
  auth,
  catchAsync,
  sendResponse,
  stripe,
  indexRoutes
};
