var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/index.ts
import { Router as Router14 } from "express";

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
  "inlineSchema": 'model Admin {\n  id            String    @id @default(uuid())\n  userId        String    @unique\n  name          String\n  email         String    @unique\n  profilePhoto  String?\n  contactNumber String?\n  isDeleted     Boolean   @default(false)\n  deletedAt     DateTime?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  @@map("admin")\n}\n\nmodel Attachment {\n  id        String  @id @default(uuid())\n  messageId String  @unique\n  message   Message @relation(fields: [messageId], references: [id], onDelete: Cascade)\n\n  fileUrl  String\n  fileName String\n  fileType String\n  fileSize Int\n\n  createdAt DateTime @default(now())\n\n  @@map("attachments")\n}\n\nmodel User {\n  id                 String         @id\n  name               String\n  email              String\n  emailVerified      Boolean        @default(false)\n  role               Role           @default(CLIENT)\n  status             UserStatus     @default(ACTIVE)\n  needPasswordChange Boolean        @default(false)\n  isDeleted          Boolean        @default(false)\n  deletedAt          DateTime?\n  image              String?\n  createdAt          DateTime       @default(now())\n  updatedAt          DateTime       @updatedAt\n  sessions           Session[]\n  accounts           Account[]\n  client             Client?\n  expert             Expert?\n  admin              Admin?\n  notifications      Notification[]\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel Call {\n  id     String   @id @default(uuid())\n  roomId String\n  room   ChatRoom @relation(fields: [roomId], references: [id], onDelete: Cascade)\n\n  status    CallStatus @default(PENDING)\n  startedAt DateTime?\n  endedAt   DateTime?\n  createdAt DateTime   @default(now())\n\n  participants CallParticipant[]\n\n  @@index([roomId])\n  @@map("calls")\n}\n\nmodel CallParticipant {\n  id     String @id @default(uuid())\n  callId String\n  call   Call   @relation(fields: [callId], references: [id], onDelete: Cascade)\n\n  userId String\n  role   UserRole\n\n  joinedAt DateTime?\n  leftAt   DateTime?\n\n  @@index([callId])\n  @@index([userId])\n  @@map("call_participants")\n}\n\nmodel ChatRoom {\n  id             String        @id @default(uuid())\n  consultationId String?       @db.Uuid\n  consultation   Consultation? @relation(fields: [consultationId], references: [id], onDelete: SetNull)\n\n  clientId String @db.Uuid\n  client   Client @relation("ClientChatRooms", fields: [clientId], references: [id], onDelete: Cascade)\n\n  expertId String @db.Uuid\n  expert   Expert @relation("ExpertChatRooms", fields: [expertId], references: [id], onDelete: Cascade)\n\n  messages Message[]\n  calls    Call[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([consultationId])\n  @@index([clientId])\n  @@index([expertId])\n  @@map("chat_rooms")\n}\n\nmodel Client {\n  id           String  @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid\n  fullName     String\n  email        String  @unique\n  profilePhoto String?\n  phone        String?\n  address      String?\n\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n\n  // User Relation\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  // Relations\n  consultations Consultation[]\n  testimonials  Testimonial[]\n  chatRooms     ChatRoom[]     @relation("ClientChatRooms")\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([email], name: "idx_client_email")\n  @@index([isDeleted], name: "idx_client_isDeleted")\n  @@map("clients")\n}\n\nmodel Consultation {\n  id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid\n\n  videoCallId   String             @unique @db.Uuid()\n  status        ConsultationStatus @default(PENDING)\n  paymentStatus PaymentStatus      @default(UNPAID)\n\n  date DateTime\n\n  // Relations\n  clientId String @db.Uuid\n  client   Client @relation(fields: [clientId], references: [id], onDelete: Cascade)\n\n  expertScheduleId String         @unique @db.Uuid\n  expertSchedule   ExpertSchedule @relation("ExpertScheduleToConsultation", fields: [expertScheduleId], references: [id])\n\n  payment     Payment?\n  testimonial Testimonial?\n  chatRooms   ChatRoom[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  expert    Expert?  @relation(fields: [expertId], references: [id])\n  expertId  String?  @db.Uuid\n\n  @@index([clientId])\n  @@index([expertScheduleId])\n  @@index([status])\n  @@map("consultations")\n}\n\nenum ConsultationStatus {\n  PENDING\n  CONFIRMED\n  COMPLETED\n  CANCELLED\n}\n\nenum PaymentStatus {\n  PAID\n  REFUNDED\n  FAILED\n  UNPAID\n}\n\nenum MessageType {\n  TEXT\n  FILE\n  SYSTEM\n}\n\nenum UserRole {\n  CLIENT\n  EXPERT\n  ADMIN\n}\n\nenum CallStatus {\n  PENDING\n  ACTIVE\n  ENDED\n}\n\nenum VerificationStatus {\n  PENDING\n  APPROVED\n  REJECTED\n}\n\nenum ReviewStatus {\n  PENDING\n  APPROVED\n  HIDDEN\n}\n\nenum Role {\n  ADMIN\n  EXPERT\n  CLIENT\n}\n\nenum UserStatus {\n  ACTIVE\n  BLOCKED\n  DELETED\n  SUSPENDED\n}\n\nmodel Expert {\n  id              String  @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid\n  fullName        String\n  email           String  @unique\n  profilePhoto    String?\n  phone           String?\n  bio             String?\n  title           String?\n  experience      Int     @default(0)\n  consultationFee Int\n  isVerified      Boolean @default(false)\n\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  industryId String   @db.Uuid\n  industry   Industry @relation(fields: [industryId], references: [id])\n\n  schedules     ExpertSchedule[]\n  consultations Consultation[]\n  testimonials  Testimonial[]\n  verification  ExpertVerification?\n  chatRooms     ChatRoom[]          @relation("ExpertChatRooms")\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("expert")\n}\n\nmodel ExpertSchedule {\n  id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid\n\n  expertId String @db.Uuid\n  expert   Expert @relation(fields: [expertId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  scheduleId String   @db.Uuid\n  schedule   Schedule @relation(fields: [scheduleId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  consultationId String?       @db.Uuid\n  consultation   Consultation? @relation("ExpertScheduleToConsultation")\n\n  isBooked    Boolean   @default(false)\n  isPublished Boolean   @default(false)\n  isDeleted   Boolean   @default(false)\n  deletedAt   DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([expertId, scheduleId])\n  @@index([expertId])\n  @@index([scheduleId])\n  @@map("expert_schedules")\n}\n\nmodel ExpertVerification {\n  id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid\n\n  expertId String @unique @db.Uuid\n  expert   Expert @relation(fields: [expertId], references: [id])\n\n  status     VerificationStatus @default(PENDING)\n  notes      String?\n  verifiedBy String?\n  verifiedAt DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("expert_verifications")\n}\n\n// model TeamMemberVerification {\n//     id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid\n\n//     teamMemberId String     @unique @db.Uuid\n//     teamMember   TeamMember @relation(fields: [teamMemberId], references: [id], onDelete: Cascade)\n\n//     status     VerificationStatus @default(PENDING)\n//     notes      String?\n//     verifiedBy String? // admin userId\n//     verifiedAt DateTime?\n\n//     createdAt DateTime @default(now())\n//     updatedAt DateTime @updatedAt\n\n//     @@map("team_member_verifications")\n// }\n\nmodel Industry {\n  id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid\n\n  name        String  @unique @db.VarChar(100)\n  description String? @db.Text\n  icon        String? @db.VarChar(255)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n\n  experts Expert[]\n\n  @@index([isDeleted], name: "idx_industry_isDeleted")\n  @@index([name], name: "idx_industry_name")\n  @@map("industries")\n}\n\nmodel Message {\n  id     String   @id @default(uuid())\n  roomId String\n  room   ChatRoom @relation(fields: [roomId], references: [id], onDelete: Cascade)\n\n  senderId   String\n  senderRole UserRole\n\n  type       MessageType @default(TEXT)\n  text       String?\n  attachment Attachment?\n\n  createdAt DateTime @default(now())\n\n  @@index([roomId])\n  @@index([senderId])\n  @@map("messages")\n}\n\nmodel Notification {\n  id        String   @id @default(uuid())\n  type      String\n  message   String\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  createdAt DateTime @default(now())\n  read      Boolean  @default(false)\n}\n\nmodel Payment {\n  id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid\n\n  consultationId String       @unique @db.Uuid\n  consultation   Consultation @relation(fields: [consultationId], references: [id], onDelete: Cascade)\n\n  amount Float\n  status PaymentStatus @default(UNPAID)\n\n  transactionId      String  @unique\n  stripeEventId      String? @unique\n  paymentGatewayData Json?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([consultationId])\n  @@index([transactionId])\n  @@map("payments")\n}\n\n// model Payment {\n//     id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid\n\n//     projectId String\n//     project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)\n\n//     clientId String\n//     client   User   @relation(fields: [clientId], references: [id])\n\n//     amount Float\n//     status PaymentStatus @default(UNPAID)\n\n//     transactionId      String  @unique\n//     stripeEventId      String? @unique\n//     paymentGatewayData Json?\n\n//     createdAt DateTime @default(now())\n//     updatedAt DateTime @updatedAt\n\n//     @@index([projectId])\n//     @@index([transactionId])\n//     @@map("payments")\n// }\n\nmodel Schedule {\n  id            String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid\n  startDateTime DateTime\n  endDateTime   DateTime\n\n  expertSchedules ExpertSchedule[]\n\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("schedules")\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../src/generated"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Testimonial {\n  id      String       @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid\n  rating  Int\n  comment String?\n  status  ReviewStatus @default(PENDING)\n\n  expertReply     String?\n  expertRepliedAt DateTime?\n\n  clientId String @db.Uuid\n  client   Client @relation(fields: [clientId], references: [id])\n\n  expertId String @db.Uuid\n  expert   Expert @relation(fields: [expertId], references: [id])\n\n  consultationId String?       @unique @db.Uuid\n  consultation   Consultation? @relation(fields: [consultationId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("testimonials")\n}\n\nmodel TypingState {\n  id        String   @id @default(uuid())\n  roomId    String\n  userId    String\n  isTyping  Boolean  @default(false)\n  updatedAt DateTime @updatedAt\n\n  @@unique([roomId, userId])\n  @@index([roomId])\n  @@map("typing_states")\n}\n\nmodel UserPresence {\n  userId   String   @id\n  isOnline Boolean  @default(false)\n  lastSeen DateTime @default(now())\n\n  @@map("user_presence")\n}\n',
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
config.runtimeDataModel = JSON.parse('{"models":{"Admin":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"contactNumber","kind":"scalar","type":"String"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"AdminToUser"}],"dbName":"admin"},"Attachment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"messageId","kind":"scalar","type":"String"},{"name":"message","kind":"object","type":"Message","relationName":"AttachmentToMessage"},{"name":"fileUrl","kind":"scalar","type":"String"},{"name":"fileName","kind":"scalar","type":"String"},{"name":"fileType","kind":"scalar","type":"String"},{"name":"fileSize","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"attachments"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"needPasswordChange","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"client","kind":"object","type":"Client","relationName":"ClientToUser"},{"name":"expert","kind":"object","type":"Expert","relationName":"ExpertToUser"},{"name":"admin","kind":"object","type":"Admin","relationName":"AdminToUser"},{"name":"notifications","kind":"object","type":"Notification","relationName":"NotificationToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Call":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"roomId","kind":"scalar","type":"String"},{"name":"room","kind":"object","type":"ChatRoom","relationName":"CallToChatRoom"},{"name":"status","kind":"enum","type":"CallStatus"},{"name":"startedAt","kind":"scalar","type":"DateTime"},{"name":"endedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"participants","kind":"object","type":"CallParticipant","relationName":"CallToCallParticipant"}],"dbName":"calls"},"CallParticipant":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"callId","kind":"scalar","type":"String"},{"name":"call","kind":"object","type":"Call","relationName":"CallToCallParticipant"},{"name":"userId","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"UserRole"},{"name":"joinedAt","kind":"scalar","type":"DateTime"},{"name":"leftAt","kind":"scalar","type":"DateTime"}],"dbName":"call_participants"},"ChatRoom":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"consultationId","kind":"scalar","type":"String"},{"name":"consultation","kind":"object","type":"Consultation","relationName":"ChatRoomToConsultation"},{"name":"clientId","kind":"scalar","type":"String"},{"name":"client","kind":"object","type":"Client","relationName":"ClientChatRooms"},{"name":"expertId","kind":"scalar","type":"String"},{"name":"expert","kind":"object","type":"Expert","relationName":"ExpertChatRooms"},{"name":"messages","kind":"object","type":"Message","relationName":"ChatRoomToMessage"},{"name":"calls","kind":"object","type":"Call","relationName":"CallToChatRoom"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"chat_rooms"},"Client":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"fullName","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"ClientToUser"},{"name":"consultations","kind":"object","type":"Consultation","relationName":"ClientToConsultation"},{"name":"testimonials","kind":"object","type":"Testimonial","relationName":"ClientToTestimonial"},{"name":"chatRooms","kind":"object","type":"ChatRoom","relationName":"ClientChatRooms"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"clients"},"Consultation":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"videoCallId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"ConsultationStatus"},{"name":"paymentStatus","kind":"enum","type":"PaymentStatus"},{"name":"date","kind":"scalar","type":"DateTime"},{"name":"clientId","kind":"scalar","type":"String"},{"name":"client","kind":"object","type":"Client","relationName":"ClientToConsultation"},{"name":"expertScheduleId","kind":"scalar","type":"String"},{"name":"expertSchedule","kind":"object","type":"ExpertSchedule","relationName":"ExpertScheduleToConsultation"},{"name":"payment","kind":"object","type":"Payment","relationName":"ConsultationToPayment"},{"name":"testimonial","kind":"object","type":"Testimonial","relationName":"ConsultationToTestimonial"},{"name":"chatRooms","kind":"object","type":"ChatRoom","relationName":"ChatRoomToConsultation"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"expert","kind":"object","type":"Expert","relationName":"ConsultationToExpert"},{"name":"expertId","kind":"scalar","type":"String"}],"dbName":"consultations"},"Expert":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"fullName","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"experience","kind":"scalar","type":"Int"},{"name":"consultationFee","kind":"scalar","type":"Int"},{"name":"isVerified","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"ExpertToUser"},{"name":"industryId","kind":"scalar","type":"String"},{"name":"industry","kind":"object","type":"Industry","relationName":"ExpertToIndustry"},{"name":"schedules","kind":"object","type":"ExpertSchedule","relationName":"ExpertToExpertSchedule"},{"name":"consultations","kind":"object","type":"Consultation","relationName":"ConsultationToExpert"},{"name":"testimonials","kind":"object","type":"Testimonial","relationName":"ExpertToTestimonial"},{"name":"verification","kind":"object","type":"ExpertVerification","relationName":"ExpertToExpertVerification"},{"name":"chatRooms","kind":"object","type":"ChatRoom","relationName":"ExpertChatRooms"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"expert"},"ExpertSchedule":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expertId","kind":"scalar","type":"String"},{"name":"expert","kind":"object","type":"Expert","relationName":"ExpertToExpertSchedule"},{"name":"scheduleId","kind":"scalar","type":"String"},{"name":"schedule","kind":"object","type":"Schedule","relationName":"ExpertScheduleToSchedule"},{"name":"consultationId","kind":"scalar","type":"String"},{"name":"consultation","kind":"object","type":"Consultation","relationName":"ExpertScheduleToConsultation"},{"name":"isBooked","kind":"scalar","type":"Boolean"},{"name":"isPublished","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"expert_schedules"},"ExpertVerification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expertId","kind":"scalar","type":"String"},{"name":"expert","kind":"object","type":"Expert","relationName":"ExpertToExpertVerification"},{"name":"status","kind":"enum","type":"VerificationStatus"},{"name":"notes","kind":"scalar","type":"String"},{"name":"verifiedBy","kind":"scalar","type":"String"},{"name":"verifiedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"expert_verifications"},"Industry":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"icon","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"experts","kind":"object","type":"Expert","relationName":"ExpertToIndustry"}],"dbName":"industries"},"Message":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"roomId","kind":"scalar","type":"String"},{"name":"room","kind":"object","type":"ChatRoom","relationName":"ChatRoomToMessage"},{"name":"senderId","kind":"scalar","type":"String"},{"name":"senderRole","kind":"enum","type":"UserRole"},{"name":"type","kind":"enum","type":"MessageType"},{"name":"text","kind":"scalar","type":"String"},{"name":"attachment","kind":"object","type":"Attachment","relationName":"AttachmentToMessage"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"messages"},"Notification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"type","kind":"scalar","type":"String"},{"name":"message","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"NotificationToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"read","kind":"scalar","type":"Boolean"}],"dbName":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"consultationId","kind":"scalar","type":"String"},{"name":"consultation","kind":"object","type":"Consultation","relationName":"ConsultationToPayment"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"stripeEventId","kind":"scalar","type":"String"},{"name":"paymentGatewayData","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"payments"},"Schedule":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"startDateTime","kind":"scalar","type":"DateTime"},{"name":"endDateTime","kind":"scalar","type":"DateTime"},{"name":"expertSchedules","kind":"object","type":"ExpertSchedule","relationName":"ExpertScheduleToSchedule"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"schedules"},"Testimonial":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"ReviewStatus"},{"name":"expertReply","kind":"scalar","type":"String"},{"name":"expertRepliedAt","kind":"scalar","type":"DateTime"},{"name":"clientId","kind":"scalar","type":"String"},{"name":"client","kind":"object","type":"Client","relationName":"ClientToTestimonial"},{"name":"expertId","kind":"scalar","type":"String"},{"name":"expert","kind":"object","type":"Expert","relationName":"ExpertToTestimonial"},{"name":"consultationId","kind":"scalar","type":"String"},{"name":"consultation","kind":"object","type":"Consultation","relationName":"ConsultationToTestimonial"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"testimonials"},"TypingState":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"roomId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"isTyping","kind":"scalar","type":"Boolean"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"typing_states"},"UserPresence":{"fields":[{"name":"userId","kind":"scalar","type":"String"},{"name":"isOnline","kind":"scalar","type":"Boolean"},{"name":"lastSeen","kind":"scalar","type":"DateTime"}],"dbName":"user_presence"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","client","experts","_count","industry","schedules","consultations","expert","consultation","testimonials","verification","room","message","attachment","messages","call","participants","calls","chatRooms","expertSchedules","schedule","expertSchedule","payment","testimonial","admin","notifications","Admin.findUnique","Admin.findUniqueOrThrow","Admin.findFirst","Admin.findFirstOrThrow","Admin.findMany","data","Admin.createOne","Admin.createMany","Admin.createManyAndReturn","Admin.updateOne","Admin.updateMany","Admin.updateManyAndReturn","create","update","Admin.upsertOne","Admin.deleteOne","Admin.deleteMany","having","_min","_max","Admin.groupBy","Admin.aggregate","Attachment.findUnique","Attachment.findUniqueOrThrow","Attachment.findFirst","Attachment.findFirstOrThrow","Attachment.findMany","Attachment.createOne","Attachment.createMany","Attachment.createManyAndReturn","Attachment.updateOne","Attachment.updateMany","Attachment.updateManyAndReturn","Attachment.upsertOne","Attachment.deleteOne","Attachment.deleteMany","_avg","_sum","Attachment.groupBy","Attachment.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Call.findUnique","Call.findUniqueOrThrow","Call.findFirst","Call.findFirstOrThrow","Call.findMany","Call.createOne","Call.createMany","Call.createManyAndReturn","Call.updateOne","Call.updateMany","Call.updateManyAndReturn","Call.upsertOne","Call.deleteOne","Call.deleteMany","Call.groupBy","Call.aggregate","CallParticipant.findUnique","CallParticipant.findUniqueOrThrow","CallParticipant.findFirst","CallParticipant.findFirstOrThrow","CallParticipant.findMany","CallParticipant.createOne","CallParticipant.createMany","CallParticipant.createManyAndReturn","CallParticipant.updateOne","CallParticipant.updateMany","CallParticipant.updateManyAndReturn","CallParticipant.upsertOne","CallParticipant.deleteOne","CallParticipant.deleteMany","CallParticipant.groupBy","CallParticipant.aggregate","ChatRoom.findUnique","ChatRoom.findUniqueOrThrow","ChatRoom.findFirst","ChatRoom.findFirstOrThrow","ChatRoom.findMany","ChatRoom.createOne","ChatRoom.createMany","ChatRoom.createManyAndReturn","ChatRoom.updateOne","ChatRoom.updateMany","ChatRoom.updateManyAndReturn","ChatRoom.upsertOne","ChatRoom.deleteOne","ChatRoom.deleteMany","ChatRoom.groupBy","ChatRoom.aggregate","Client.findUnique","Client.findUniqueOrThrow","Client.findFirst","Client.findFirstOrThrow","Client.findMany","Client.createOne","Client.createMany","Client.createManyAndReturn","Client.updateOne","Client.updateMany","Client.updateManyAndReturn","Client.upsertOne","Client.deleteOne","Client.deleteMany","Client.groupBy","Client.aggregate","Consultation.findUnique","Consultation.findUniqueOrThrow","Consultation.findFirst","Consultation.findFirstOrThrow","Consultation.findMany","Consultation.createOne","Consultation.createMany","Consultation.createManyAndReturn","Consultation.updateOne","Consultation.updateMany","Consultation.updateManyAndReturn","Consultation.upsertOne","Consultation.deleteOne","Consultation.deleteMany","Consultation.groupBy","Consultation.aggregate","Expert.findUnique","Expert.findUniqueOrThrow","Expert.findFirst","Expert.findFirstOrThrow","Expert.findMany","Expert.createOne","Expert.createMany","Expert.createManyAndReturn","Expert.updateOne","Expert.updateMany","Expert.updateManyAndReturn","Expert.upsertOne","Expert.deleteOne","Expert.deleteMany","Expert.groupBy","Expert.aggregate","ExpertSchedule.findUnique","ExpertSchedule.findUniqueOrThrow","ExpertSchedule.findFirst","ExpertSchedule.findFirstOrThrow","ExpertSchedule.findMany","ExpertSchedule.createOne","ExpertSchedule.createMany","ExpertSchedule.createManyAndReturn","ExpertSchedule.updateOne","ExpertSchedule.updateMany","ExpertSchedule.updateManyAndReturn","ExpertSchedule.upsertOne","ExpertSchedule.deleteOne","ExpertSchedule.deleteMany","ExpertSchedule.groupBy","ExpertSchedule.aggregate","ExpertVerification.findUnique","ExpertVerification.findUniqueOrThrow","ExpertVerification.findFirst","ExpertVerification.findFirstOrThrow","ExpertVerification.findMany","ExpertVerification.createOne","ExpertVerification.createMany","ExpertVerification.createManyAndReturn","ExpertVerification.updateOne","ExpertVerification.updateMany","ExpertVerification.updateManyAndReturn","ExpertVerification.upsertOne","ExpertVerification.deleteOne","ExpertVerification.deleteMany","ExpertVerification.groupBy","ExpertVerification.aggregate","Industry.findUnique","Industry.findUniqueOrThrow","Industry.findFirst","Industry.findFirstOrThrow","Industry.findMany","Industry.createOne","Industry.createMany","Industry.createManyAndReturn","Industry.updateOne","Industry.updateMany","Industry.updateManyAndReturn","Industry.upsertOne","Industry.deleteOne","Industry.deleteMany","Industry.groupBy","Industry.aggregate","Message.findUnique","Message.findUniqueOrThrow","Message.findFirst","Message.findFirstOrThrow","Message.findMany","Message.createOne","Message.createMany","Message.createManyAndReturn","Message.updateOne","Message.updateMany","Message.updateManyAndReturn","Message.upsertOne","Message.deleteOne","Message.deleteMany","Message.groupBy","Message.aggregate","Notification.findUnique","Notification.findUniqueOrThrow","Notification.findFirst","Notification.findFirstOrThrow","Notification.findMany","Notification.createOne","Notification.createMany","Notification.createManyAndReturn","Notification.updateOne","Notification.updateMany","Notification.updateManyAndReturn","Notification.upsertOne","Notification.deleteOne","Notification.deleteMany","Notification.groupBy","Notification.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","Schedule.findUnique","Schedule.findUniqueOrThrow","Schedule.findFirst","Schedule.findFirstOrThrow","Schedule.findMany","Schedule.createOne","Schedule.createMany","Schedule.createManyAndReturn","Schedule.updateOne","Schedule.updateMany","Schedule.updateManyAndReturn","Schedule.upsertOne","Schedule.deleteOne","Schedule.deleteMany","Schedule.groupBy","Schedule.aggregate","Testimonial.findUnique","Testimonial.findUniqueOrThrow","Testimonial.findFirst","Testimonial.findFirstOrThrow","Testimonial.findMany","Testimonial.createOne","Testimonial.createMany","Testimonial.createManyAndReturn","Testimonial.updateOne","Testimonial.updateMany","Testimonial.updateManyAndReturn","Testimonial.upsertOne","Testimonial.deleteOne","Testimonial.deleteMany","Testimonial.groupBy","Testimonial.aggregate","TypingState.findUnique","TypingState.findUniqueOrThrow","TypingState.findFirst","TypingState.findFirstOrThrow","TypingState.findMany","TypingState.createOne","TypingState.createMany","TypingState.createManyAndReturn","TypingState.updateOne","TypingState.updateMany","TypingState.updateManyAndReturn","TypingState.upsertOne","TypingState.deleteOne","TypingState.deleteMany","TypingState.groupBy","TypingState.aggregate","UserPresence.findUnique","UserPresence.findUniqueOrThrow","UserPresence.findFirst","UserPresence.findFirstOrThrow","UserPresence.findMany","UserPresence.createOne","UserPresence.createMany","UserPresence.createManyAndReturn","UserPresence.updateOne","UserPresence.updateMany","UserPresence.updateManyAndReturn","UserPresence.upsertOne","UserPresence.deleteOne","UserPresence.deleteMany","UserPresence.groupBy","UserPresence.aggregate","AND","OR","NOT","userId","isOnline","lastSeen","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","id","roomId","isTyping","updatedAt","roomId_userId","rating","comment","ReviewStatus","status","expertReply","expertRepliedAt","clientId","expertId","consultationId","createdAt","startDateTime","endDateTime","isDeleted","deletedAt","every","some","none","amount","PaymentStatus","transactionId","stripeEventId","paymentGatewayData","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","type","read","senderId","UserRole","senderRole","MessageType","text","name","description","icon","VerificationStatus","notes","verifiedBy","verifiedAt","scheduleId","isBooked","isPublished","fullName","email","profilePhoto","phone","bio","title","experience","consultationFee","isVerified","industryId","videoCallId","ConsultationStatus","paymentStatus","date","expertScheduleId","address","callId","role","joinedAt","leftAt","CallStatus","startedAt","endedAt","identifier","value","expiresAt","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","emailVerified","Role","UserStatus","needPasswordChange","image","messageId","fileUrl","fileName","fileType","fileSize","contactNumber","expertId_scheduleId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "pArBAeACDgMAAKoFACCHAwAAzgUAMIgDAABLABCJAwAAzgUAMIoDAQAAAAGYAwEAAAABmwNAAOYEACGmA0AA5gQAIakDIADlBAAhqgNAAP8EACHAAwEA5AQAIcsDAQAAAAHMAwEAmQUAIfoDAQCZBQAhAQAAAAEAIAwDAACqBQAghwMAAO4FADCIAwAAAwAQiQMAAO4FADCKAwEA5AQAIZgDAQDkBAAhmwNAAOYEACGmA0AA5gQAIeMDQADmBAAh7QMBAOQEACHuAwEAmQUAIe8DAQCZBQAhAwMAAJ0IACDuAwAA-AUAIO8DAAD4BQAgDAMAAKoFACCHAwAA7gUAMIgDAAADABCJAwAA7gUAMIoDAQDkBAAhmAMBAAAAAZsDQADmBAAhpgNAAOYEACHjA0AA5gQAIe0DAQAAAAHuAwEAmQUAIe8DAQCZBQAhAwAAAAMAIAEAAAQAMAIAAAUAIBEDAACqBQAghwMAAO0FADCIAwAABwAQiQMAAO0FADCKAwEA5AQAIZgDAQDkBAAhmwNAAOYEACGmA0AA5gQAIeQDAQDkBAAh5QMBAOQEACHmAwEAmQUAIecDAQCZBQAh6AMBAJkFACHpA0AA_wQAIeoDQAD_BAAh6wMBAJkFACHsAwEAmQUAIQgDAACdCAAg5gMAAPgFACDnAwAA-AUAIOgDAAD4BQAg6QMAAPgFACDqAwAA-AUAIOsDAAD4BQAg7AMAAPgFACARAwAAqgUAIIcDAADtBQAwiAMAAAcAEIkDAADtBQAwigMBAOQEACGYAwEAAAABmwNAAOYEACGmA0AA5gQAIeQDAQDkBAAh5QMBAOQEACHmAwEAmQUAIecDAQCZBQAh6AMBAJkFACHpA0AA_wQAIeoDQAD_BAAh6wMBAJkFACHsAwEAmQUAIQMAAAAHACABAAAIADACAAAJACASAwAAqgUAIAsAAKsFACAOAACsBQAgFwAArQUAIIcDAACpBQAwiAMAAAsAEIkDAACpBQAwigMBAOQEACGYAwEA_gQAIZsDQADmBAAhpgNAAOYEACGpAyAA5QQAIaoDQAD_BAAhygMBAOQEACHLAwEA5AQAIcwDAQCZBQAhzQMBAJkFACHZAwEAmQUAIQEAAAALACATBgAA3AUAIAwAAMUFACAXAACtBQAgGgAA6gUAIBsAAOsFACAcAADsBQAghwMAAOgFADCIAwAADQAQiQMAAOgFADCYAwEA_gQAIZsDQADmBAAhoAMAAOkF1gMiowMBAP4EACGkAwEA2gUAIaYDQADmBAAh1AMBAP4EACHWAwAAjAWwAyLXA0AA5gQAIdgDAQD-BAAhBwYAAIEJACAMAADpBwAgFwAAoAgAIBoAAJoJACAbAACbCQAgHAAAnAkAIKQDAAD4BQAgEwYAANwFACAMAADFBQAgFwAArQUAIBoAAOoFACAbAADrBQAgHAAA7AUAIIcDAADoBQAwiAMAAA0AEIkDAADoBQAwmAMBAAAAAZsDQADmBAAhoAMAAOkF1gMiowMBAP4EACGkAwEA2gUAIaYDQADmBAAh1AMBAAAAAdYDAACMBbADItcDQADmBAAh2AMBAAAAAQMAAAANACABAAAOADACAAAPACAaAwAAqgUAIAkAAOYFACAKAACABQAgCwAAqwUAIA4AAKwFACAPAADnBQAgFwAArQUAIIcDAADlBQAwiAMAABEAEIkDAADlBQAwigMBAOQEACGYAwEA_gQAIZsDQADmBAAhpgNAAOYEACGpAyAA5QQAIaoDQAD_BAAhygMBAOQEACHLAwEA5AQAIcwDAQCZBQAhzQMBAJkFACHOAwEAmQUAIc8DAQCZBQAh0AMCAMoFACHRAwIAygUAIdIDIADlBAAh0wMBAP4EACEMAwAAnQgAIAkAAJgJACAKAAD9BgAgCwAAnggAIA4AAJ8IACAPAACZCQAgFwAAoAgAIKoDAAD4BQAgzAMAAPgFACDNAwAA-AUAIM4DAAD4BQAgzwMAAPgFACAaAwAAqgUAIAkAAOYFACAKAACABQAgCwAAqwUAIA4AAKwFACAPAADnBQAgFwAArQUAIIcDAADlBQAwiAMAABEAEIkDAADlBQAwigMBAAAAAZgDAQAAAAGbA0AA5gQAIaYDQADmBAAhqQMgAOUEACGqA0AA_wQAIcoDAQDkBAAhywMBAAAAAcwDAQCZBQAhzQMBAJkFACHOAwEAmQUAIc8DAQCZBQAh0AMCAMoFACHRAwIAygUAIdIDIADlBAAh0wMBAP4EACEDAAAAEQAgAQAAEgAwAgAAEwAgAQAAABEAIBAMAAChBQAgDQAA2wUAIBkAAOQFACCHAwAA4wUAMIgDAAAWABCJAwAA4wUAMJgDAQD-BAAhmwNAAOYEACGkAwEA_gQAIaUDAQDaBQAhpgNAAOYEACGpAyAA5QQAIaoDQAD_BAAhxwMBAP4EACHIAyAA5QQAIckDIADlBAAhBQwAAOkHACANAACFBwAgGQAAlwkAIKUDAAD4BQAgqgMAAPgFACARDAAAoQUAIA0AANsFACAZAADkBQAghwMAAOMFADCIAwAAFgAQiQMAAOMFADCYAwEAAAABmwNAAOYEACGkAwEA_gQAIaUDAQDaBQAhpgNAAOYEACGpAyAA5QQAIaoDQAD_BAAhxwMBAP4EACHIAyAA5QQAIckDIADlBAAh-wMAAOIFACADAAAAFgAgAQAAFwAwAgAAGAAgAwAAAA0AIAEAAA4AMAIAAA8AIBEGAADcBQAgDAAAoQUAIA0AANsFACCHAwAA4AUAMIgDAAAbABCJAwAA4AUAMJgDAQD-BAAhmwNAAOYEACGdAwIAygUAIZ4DAQCZBQAhoAMAAOEFoAMioQMBAJkFACGiA0AA_wQAIaMDAQD-BAAhpAMBAP4EACGlAwEA2gUAIaYDQADmBAAhBwYAAIEJACAMAADpBwAgDQAAhQcAIJ4DAAD4BQAgoQMAAPgFACCiAwAA-AUAIKUDAAD4BQAgEQYAANwFACAMAAChBQAgDQAA2wUAIIcDAADgBQAwiAMAABsAEIkDAADgBQAwmAMBAAAAAZsDQADmBAAhnQMCAMoFACGeAwEAmQUAIaADAADhBaADIqEDAQCZBQAhogNAAP8EACGjAwEA_gQAIaQDAQD-BAAhpQMBAAAAAaYDQADmBAAhAwAAABsAIAEAABwAMAIAAB0AIAEAAAANACAMDAAAoQUAIIcDAACfBQAwiAMAACAAEIkDAACfBQAwmAMBAP4EACGbA0AA5gQAIaADAACgBcQDIqQDAQD-BAAhpgNAAOYEACHEAwEAmQUAIcUDAQCZBQAhxgNAAP8EACEBAAAAIAAgDgYAANwFACAMAAChBQAgDQAA2wUAIBMAAN0FACAWAADeBQAghwMAANkFADCIAwAAIgAQiQMAANkFADCYAwEA5AQAIZsDQADmBAAhowMBAP4EACGkAwEA_gQAIaUDAQDaBQAhpgNAAOYEACEGBgAAgQkAIAwAAOkHACANAACFBwAgEwAAlQkAIBYAAJYJACClAwAA-AUAIA4GAADcBQAgDAAAoQUAIA0AANsFACATAADdBQAgFgAA3gUAIIcDAADZBQAwiAMAACIAEIkDAADZBQAwmAMBAAAAAZsDQADmBAAhowMBAP4EACGkAwEA_gQAIaUDAQDaBQAhpgNAAOYEACEDAAAAIgAgAQAAIwAwAgAAJAAgAQAAAA0AIAwQAADUBQAgEgAA2AUAIIcDAADWBQAwiAMAACcAEIkDAADWBQAwmAMBAOQEACGZAwEA5AQAIaYDQADmBAAhuQMAANcFvwMiuwMBAOQEACG9AwAA0AW9AyK_AwEAmQUAIQMQAACSCQAgEgAAlAkAIL8DAAD4BQAgDBAAANQFACASAADYBQAghwMAANYFADCIAwAAJwAQiQMAANYFADCYAwEAAAABmQMBAOQEACGmA0AA5gQAIbkDAADXBb8DIrsDAQDkBAAhvQMAANAFvQMivwMBAJkFACEDAAAAJwAgAQAAKAAwAgAAKQAgCxEAAMsFACCHAwAAyQUAMIgDAAArABCJAwAAyQUAMJgDAQDkBAAhpgNAAOYEACH1AwEA5AQAIfYDAQDkBAAh9wMBAOQEACH4AwEA5AQAIfkDAgDKBQAhAQAAACsAIAsQAADUBQAgFQAA1QUAIIcDAADSBQAwiAMAAC0AEIkDAADSBQAwmAMBAOQEACGZAwEA5AQAIaADAADTBd8DIqYDQADmBAAh3wNAAP8EACHgA0AA_wQAIQQQAACSCQAgFQAAkwkAIN8DAAD4BQAg4AMAAPgFACALEAAA1AUAIBUAANUFACCHAwAA0gUAMIgDAAAtABCJAwAA0gUAMJgDAQAAAAGZAwEA5AQAIaADAADTBd8DIqYDQADmBAAh3wNAAP8EACHgA0AA_wQAIQMAAAAtACABAAAuADACAAAvACAKFAAA0QUAIIcDAADPBQAwiAMAADEAEIkDAADPBQAwigMBAOQEACGYAwEA5AQAIdoDAQDkBAAh2wMAANAFvQMi3ANAAP8EACHdA0AA_wQAIQMUAACRCQAg3AMAAPgFACDdAwAA-AUAIAoUAADRBQAghwMAAM8FADCIAwAAMQAQiQMAAM8FADCKAwEA5AQAIZgDAQAAAAHaAwEA5AQAIdsDAADQBb0DItwDQAD_BAAh3QNAAP8EACEDAAAAMQAgAQAAMgAwAgAAMwAgAQAAADEAIAEAAAAnACABAAAALQAgAQAAABYAIAEAAAANACABAAAAGwAgAQAAACIAIAMAAAAWACABAAAXADACAAAYACABAAAAFgAgAQAAAA0AIA0NAACOBQAghwMAAIoFADCIAwAAPwAQiQMAAIoFADCYAwEA_gQAIZsDQADmBAAhoAMAAIwFsAMipQMBAP4EACGmA0AA5gQAIa4DCACLBQAhsAMBAOQEACGxAwEAmQUAIbIDAACNBQAgAQAAAD8AIAEAAAAbACADAAAAIgAgAQAAIwAwAgAAJAAgAQAAABEAIAEAAAAiACADAAAAGwAgAQAAHAAwAgAAHQAgAwAAACIAIAEAACMAMAIAACQAIAEAAAANACABAAAAGwAgAQAAACIAIAEAAAARACAOAwAAqgUAIIcDAADOBQAwiAMAAEsAEIkDAADOBQAwigMBAOQEACGYAwEA5AQAIZsDQADmBAAhpgNAAOYEACGpAyAA5QQAIaoDQAD_BAAhwAMBAOQEACHLAwEA5AQAIcwDAQCZBQAh-gMBAJkFACEBAAAASwAgCgMAAKoFACARAQDkBAAhhwMAAM0FADCIAwAATQAQiQMAAM0FADCKAwEA5AQAIZgDAQDkBAAhpgNAAOYEACG5AwEA5AQAIboDIADlBAAhAQMAAJ0IACAKAwAAqgUAIBEBAOQEACGHAwAAzQUAMIgDAABNABCJAwAAzQUAMIoDAQDkBAAhmAMBAAAAAaYDQADmBAAhuQMBAOQEACG6AyAA5QQAIQMAAABNACABAABOADACAABPACABAAAAAwAgAQAAAAcAIAEAAABNACABAAAAAQAgBAMAAJ0IACCqAwAA-AUAIMwDAAD4BQAg-gMAAPgFACADAAAASwAgAQAAVQAwAgAAAQAgAwAAAEsAIAEAAFUAMAIAAAEAIAMAAABLACABAABVADACAAABACALAwAAkAkAIIoDAQAAAAGYAwEAAAABmwNAAAAAAaYDQAAAAAGpAyAAAAABqgNAAAAAAcADAQAAAAHLAwEAAAABzAMBAAAAAfoDAQAAAAEBJAAAWQAgCooDAQAAAAGYAwEAAAABmwNAAAAAAaYDQAAAAAGpAyAAAAABqgNAAAAAAcADAQAAAAHLAwEAAAABzAMBAAAAAfoDAQAAAAEBJAAAWwAwASQAAFsAMAsDAACPCQAgigMBAPIFACGYAwEA8gUAIZsDQAD0BQAhpgNAAPQFACGpAyAA8wUAIaoDQACBBgAhwAMBAPIFACHLAwEA8gUAIcwDAQD_BQAh-gMBAP8FACECAAAAAQAgJAAAXgAgCooDAQDyBQAhmAMBAPIFACGbA0AA9AUAIaYDQAD0BQAhqQMgAPMFACGqA0AAgQYAIcADAQDyBQAhywMBAPIFACHMAwEA_wUAIfoDAQD_BQAhAgAAAEsAICQAAGAAIAIAAABLACAkAABgACADAAAAAQAgKwAAWQAgLAAAXgAgAQAAAAEAIAEAAABLACAGCAAAjAkAIDEAAI4JACAyAACNCQAgqgMAAPgFACDMAwAA-AUAIPoDAAD4BQAgDYcDAADMBQAwiAMAAGcAEIkDAADMBQAwigMBANkEACGYAwEA2QQAIZsDQADbBAAhpgNAANsEACGpAyAA2gQAIaoDQADvBAAhwAMBANkEACHLAwEA2QQAIcwDAQDtBAAh-gMBAO0EACEDAAAASwAgAQAAZgAwMAAAZwAgAwAAAEsAIAEAAFUAMAIAAAEAIAsRAADLBQAghwMAAMkFADCIAwAAKwAQiQMAAMkFADCYAwEAAAABpgNAAOYEACH1AwEAAAAB9gMBAOQEACH3AwEA5AQAIfgDAQDkBAAh-QMCAMoFACEBAAAAagAgAQAAAGoAIAERAACLCQAgAwAAACsAIAEAAG0AMAIAAGoAIAMAAAArACABAABtADACAABqACADAAAAKwAgAQAAbQAwAgAAagAgCBEAAIoJACCYAwEAAAABpgNAAAAAAfUDAQAAAAH2AwEAAAAB9wMBAAAAAfgDAQAAAAH5AwIAAAABASQAAHEAIAeYAwEAAAABpgNAAAAAAfUDAQAAAAH2AwEAAAAB9wMBAAAAAfgDAQAAAAH5AwIAAAABASQAAHMAMAEkAABzADAIEQAAiQkAIJgDAQDyBQAhpgNAAPQFACH1AwEA8gUAIfYDAQDyBQAh9wMBAPIFACH4AwEA8gUAIfkDAgD-BQAhAgAAAGoAICQAAHYAIAeYAwEA8gUAIaYDQAD0BQAh9QMBAPIFACH2AwEA8gUAIfcDAQDyBQAh-AMBAPIFACH5AwIA_gUAIQIAAAArACAkAAB4ACACAAAAKwAgJAAAeAAgAwAAAGoAICsAAHEAICwAAHYAIAEAAABqACABAAAAKwAgBQgAAIQJACAxAACHCQAgMgAAhgkAIEMAAIUJACBEAACICQAgCocDAADIBQAwiAMAAH8AEIkDAADIBQAwmAMBANkEACGmA0AA2wQAIfUDAQDZBAAh9gMBANkEACH3AwEA2QQAIfgDAQDZBAAh-QMCAOwEACEDAAAAKwAgAQAAfgAwMAAAfwAgAwAAACsAIAEAAG0AMAIAAGoAIBUEAADCBQAgBQAAwwUAIAYAAMQFACAMAADFBQAgHQAAxgUAIB4AAMcFACCHAwAAvwUAMIgDAACFAQAQiQMAAL8FADCYAwEAAAABmwNAAOYEACGgAwAAwQXzAyKmA0AA5gQAIakDIADlBAAhqgNAAP8EACHAAwEA5AQAIcsDAQAAAAHbAwAAwAXyAyLwAyAA5QQAIfMDIADlBAAh9AMBAJkFACEBAAAAggEAIAEAAACCAQAgFQQAAMIFACAFAADDBQAgBgAAxAUAIAwAAMUFACAdAADGBQAgHgAAxwUAIIcDAAC_BQAwiAMAAIUBABCJAwAAvwUAMJgDAQDkBAAhmwNAAOYEACGgAwAAwQXzAyKmA0AA5gQAIakDIADlBAAhqgNAAP8EACHAAwEA5AQAIcsDAQDkBAAh2wMAAMAF8gMi8AMgAOUEACHzAyAA5QQAIfQDAQCZBQAhCAQAAP8IACAFAACACQAgBgAAgQkAIAwAAOkHACAdAACCCQAgHgAAgwkAIKoDAAD4BQAg9AMAAPgFACADAAAAhQEAIAEAAIYBADACAACCAQAgAwAAAIUBACABAACGAQAwAgAAggEAIAMAAACFAQAgAQAAhgEAMAIAAIIBACASBAAA-QgAIAUAAPoIACAGAAD7CAAgDAAA_AgAIB0AAP0IACAeAAD-CAAgmAMBAAAAAZsDQAAAAAGgAwAAAPMDAqYDQAAAAAGpAyAAAAABqgNAAAAAAcADAQAAAAHLAwEAAAAB2wMAAADyAwLwAyAAAAAB8wMgAAAAAfQDAQAAAAEBJAAAigEAIAyYAwEAAAABmwNAAAAAAaADAAAA8wMCpgNAAAAAAakDIAAAAAGqA0AAAAABwAMBAAAAAcsDAQAAAAHbAwAAAPIDAvADIAAAAAHzAyAAAAAB9AMBAAAAAQEkAACMAQAwASQAAIwBADASBAAAwAgAIAUAAMEIACAGAADCCAAgDAAAwwgAIB0AAMQIACAeAADFCAAgmAMBAPIFACGbA0AA9AUAIaADAAC_CPMDIqYDQAD0BQAhqQMgAPMFACGqA0AAgQYAIcADAQDyBQAhywMBAPIFACHbAwAAvgjyAyLwAyAA8wUAIfMDIADzBQAh9AMBAP8FACECAAAAggEAICQAAI8BACAMmAMBAPIFACGbA0AA9AUAIaADAAC_CPMDIqYDQAD0BQAhqQMgAPMFACGqA0AAgQYAIcADAQDyBQAhywMBAPIFACHbAwAAvgjyAyLwAyAA8wUAIfMDIADzBQAh9AMBAP8FACECAAAAhQEAICQAAJEBACACAAAAhQEAICQAAJEBACADAAAAggEAICsAAIoBACAsAACPAQAgAQAAAIIBACABAAAAhQEAIAUIAAC7CAAgMQAAvQgAIDIAALwIACCqAwAA-AUAIPQDAAD4BQAgD4cDAAC4BQAwiAMAAJgBABCJAwAAuAUAMJgDAQDZBAAhmwNAANsEACGgAwAAugXzAyKmA0AA2wQAIakDIADaBAAhqgNAAO8EACHAAwEA2QQAIcsDAQDZBAAh2wMAALkF8gMi8AMgANoEACHzAyAA2gQAIfQDAQDtBAAhAwAAAIUBACABAACXAQAwMAAAmAEAIAMAAACFAQAgAQAAhgEAMAIAAIIBACABAAAABQAgAQAAAAUAIAMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAkDAAC6CAAgigMBAAAAAZgDAQAAAAGbA0AAAAABpgNAAAAAAeMDQAAAAAHtAwEAAAAB7gMBAAAAAe8DAQAAAAEBJAAAoAEAIAiKAwEAAAABmAMBAAAAAZsDQAAAAAGmA0AAAAAB4wNAAAAAAe0DAQAAAAHuAwEAAAAB7wMBAAAAAQEkAACiAQAwASQAAKIBADAJAwAAuQgAIIoDAQDyBQAhmAMBAPIFACGbA0AA9AUAIaYDQAD0BQAh4wNAAPQFACHtAwEA8gUAIe4DAQD_BQAh7wMBAP8FACECAAAABQAgJAAApQEAIAiKAwEA8gUAIZgDAQDyBQAhmwNAAPQFACGmA0AA9AUAIeMDQAD0BQAh7QMBAPIFACHuAwEA_wUAIe8DAQD_BQAhAgAAAAMAICQAAKcBACACAAAAAwAgJAAApwEAIAMAAAAFACArAACgAQAgLAAApQEAIAEAAAAFACABAAAAAwAgBQgAALYIACAxAAC4CAAgMgAAtwgAIO4DAAD4BQAg7wMAAPgFACALhwMAALcFADCIAwAArgEAEIkDAAC3BQAwigMBANkEACGYAwEA2QQAIZsDQADbBAAhpgNAANsEACHjA0AA2wQAIe0DAQDZBAAh7gMBAO0EACHvAwEA7QQAIQMAAAADACABAACtAQAwMAAArgEAIAMAAAADACABAAAEADACAAAFACABAAAACQAgAQAAAAkAIAMAAAAHACABAAAIADACAAAJACADAAAABwAgAQAACAAwAgAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIA4DAAC1CAAgigMBAAAAAZgDAQAAAAGbA0AAAAABpgNAAAAAAeQDAQAAAAHlAwEAAAAB5gMBAAAAAecDAQAAAAHoAwEAAAAB6QNAAAAAAeoDQAAAAAHrAwEAAAAB7AMBAAAAAQEkAAC2AQAgDYoDAQAAAAGYAwEAAAABmwNAAAAAAaYDQAAAAAHkAwEAAAAB5QMBAAAAAeYDAQAAAAHnAwEAAAAB6AMBAAAAAekDQAAAAAHqA0AAAAAB6wMBAAAAAewDAQAAAAEBJAAAuAEAMAEkAAC4AQAwDgMAALQIACCKAwEA8gUAIZgDAQDyBQAhmwNAAPQFACGmA0AA9AUAIeQDAQDyBQAh5QMBAPIFACHmAwEA_wUAIecDAQD_BQAh6AMBAP8FACHpA0AAgQYAIeoDQACBBgAh6wMBAP8FACHsAwEA_wUAIQIAAAAJACAkAAC7AQAgDYoDAQDyBQAhmAMBAPIFACGbA0AA9AUAIaYDQAD0BQAh5AMBAPIFACHlAwEA8gUAIeYDAQD_BQAh5wMBAP8FACHoAwEA_wUAIekDQACBBgAh6gNAAIEGACHrAwEA_wUAIewDAQD_BQAhAgAAAAcAICQAAL0BACACAAAABwAgJAAAvQEAIAMAAAAJACArAAC2AQAgLAAAuwEAIAEAAAAJACABAAAABwAgCggAALEIACAxAACzCAAgMgAAsggAIOYDAAD4BQAg5wMAAPgFACDoAwAA-AUAIOkDAAD4BQAg6gMAAPgFACDrAwAA-AUAIOwDAAD4BQAgEIcDAAC2BQAwiAMAAMQBABCJAwAAtgUAMIoDAQDZBAAhmAMBANkEACGbA0AA2wQAIaYDQADbBAAh5AMBANkEACHlAwEA2QQAIeYDAQDtBAAh5wMBAO0EACHoAwEA7QQAIekDQADvBAAh6gNAAO8EACHrAwEA7QQAIewDAQDtBAAhAwAAAAcAIAEAAMMBADAwAADEAQAgAwAAAAcAIAEAAAgAMAIAAAkAIAmHAwAAtQUAMIgDAADKAQAQiQMAALUFADCYAwEAAAABmwNAAOYEACGmA0AA5gQAIeEDAQDkBAAh4gMBAOQEACHjA0AA5gQAIQEAAADHAQAgAQAAAMcBACAJhwMAALUFADCIAwAAygEAEIkDAAC1BQAwmAMBAOQEACGbA0AA5gQAIaYDQADmBAAh4QMBAOQEACHiAwEA5AQAIeMDQADmBAAhAAMAAADKAQAgAQAAywEAMAIAAMcBACADAAAAygEAIAEAAMsBADACAADHAQAgAwAAAMoBACABAADLAQAwAgAAxwEAIAaYAwEAAAABmwNAAAAAAaYDQAAAAAHhAwEAAAAB4gMBAAAAAeMDQAAAAAEBJAAAzwEAIAaYAwEAAAABmwNAAAAAAaYDQAAAAAHhAwEAAAAB4gMBAAAAAeMDQAAAAAEBJAAA0QEAMAEkAADRAQAwBpgDAQDyBQAhmwNAAPQFACGmA0AA9AUAIeEDAQDyBQAh4gMBAPIFACHjA0AA9AUAIQIAAADHAQAgJAAA1AEAIAaYAwEA8gUAIZsDQAD0BQAhpgNAAPQFACHhAwEA8gUAIeIDAQDyBQAh4wNAAPQFACECAAAAygEAICQAANYBACACAAAAygEAICQAANYBACADAAAAxwEAICsAAM8BACAsAADUAQAgAQAAAMcBACABAAAAygEAIAMIAACuCAAgMQAAsAgAIDIAAK8IACAJhwMAALQFADCIAwAA3QEAEIkDAAC0BQAwmAMBANkEACGbA0AA2wQAIaYDQADbBAAh4QMBANkEACHiAwEA2QQAIeMDQADbBAAhAwAAAMoBACABAADcAQAwMAAA3QEAIAMAAADKAQAgAQAAywEAMAIAAMcBACABAAAALwAgAQAAAC8AIAMAAAAtACABAAAuADACAAAvACADAAAALQAgAQAALgAwAgAALwAgAwAAAC0AIAEAAC4AMAIAAC8AIAgQAACtCAAgFQAAzwYAIJgDAQAAAAGZAwEAAAABoAMAAADfAwKmA0AAAAAB3wNAAAAAAeADQAAAAAEBJAAA5QEAIAaYAwEAAAABmQMBAAAAAaADAAAA3wMCpgNAAAAAAd8DQAAAAAHgA0AAAAABASQAAOcBADABJAAA5wEAMAgQAACsCAAgFQAAwAYAIJgDAQDyBQAhmQMBAPIFACGgAwAAvgbfAyKmA0AA9AUAId8DQACBBgAh4ANAAIEGACECAAAALwAgJAAA6gEAIAaYAwEA8gUAIZkDAQDyBQAhoAMAAL4G3wMipgNAAPQFACHfA0AAgQYAIeADQACBBgAhAgAAAC0AICQAAOwBACACAAAALQAgJAAA7AEAIAMAAAAvACArAADlAQAgLAAA6gEAIAEAAAAvACABAAAALQAgBQgAAKkIACAxAACrCAAgMgAAqggAIN8DAAD4BQAg4AMAAPgFACAJhwMAALAFADCIAwAA8wEAEIkDAACwBQAwmAMBANkEACGZAwEA2QQAIaADAACxBd8DIqYDQADbBAAh3wNAAO8EACHgA0AA7wQAIQMAAAAtACABAADyAQAwMAAA8wEAIAMAAAAtACABAAAuADACAAAvACABAAAAMwAgAQAAADMAIAMAAAAxACABAAAyADACAAAzACADAAAAMQAgAQAAMgAwAgAAMwAgAwAAADEAIAEAADIAMAIAADMAIAcUAACoCAAgigMBAAAAAZgDAQAAAAHaAwEAAAAB2wMAAAC9AwLcA0AAAAAB3QNAAAAAAQEkAAD7AQAgBooDAQAAAAGYAwEAAAAB2gMBAAAAAdsDAAAAvQMC3ANAAAAAAd0DQAAAAAEBJAAA_QEAMAEkAAD9AQAwBxQAAKcIACCKAwEA8gUAIZgDAQDyBQAh2gMBAPIFACHbAwAAywa9AyLcA0AAgQYAId0DQACBBgAhAgAAADMAICQAAIACACAGigMBAPIFACGYAwEA8gUAIdoDAQDyBQAh2wMAAMsGvQMi3ANAAIEGACHdA0AAgQYAIQIAAAAxACAkAACCAgAgAgAAADEAICQAAIICACADAAAAMwAgKwAA-wEAICwAAIACACABAAAAMwAgAQAAADEAIAUIAACkCAAgMQAApggAIDIAAKUIACDcAwAA-AUAIN0DAAD4BQAgCYcDAACvBQAwiAMAAIkCABCJAwAArwUAMIoDAQDZBAAhmAMBANkEACHaAwEA2QQAIdsDAACRBb0DItwDQADvBAAh3QNAAO8EACEDAAAAMQAgAQAAiAIAMDAAAIkCACADAAAAMQAgAQAAMgAwAgAAMwAgAQAAACQAIAEAAAAkACADAAAAIgAgAQAAIwAwAgAAJAAgAwAAACIAIAEAACMAMAIAACQAIAMAAAAiACABAAAjADACAAAkACALBgAA5QYAIAwAAOYGACANAACvBwAgEwAA5wYAIBYAAOgGACCYAwEAAAABmwNAAAAAAaMDAQAAAAGkAwEAAAABpQMBAAAAAaYDQAAAAAEBJAAAkQIAIAaYAwEAAAABmwNAAAAAAaMDAQAAAAGkAwEAAAABpQMBAAAAAaYDQAAAAAEBJAAAkwIAMAEkAACTAgAwAQAAAA0AIAsGAACwBgAgDAAAsQYAIA0AAK0HACATAACyBgAgFgAAswYAIJgDAQDyBQAhmwNAAPQFACGjAwEA8gUAIaQDAQDyBQAhpQMBAP8FACGmA0AA9AUAIQIAAAAkACAkAACXAgAgBpgDAQDyBQAhmwNAAPQFACGjAwEA8gUAIaQDAQDyBQAhpQMBAP8FACGmA0AA9AUAIQIAAAAiACAkAACZAgAgAgAAACIAICQAAJkCACABAAAADQAgAwAAACQAICsAAJECACAsAACXAgAgAQAAACQAIAEAAAAiACAECAAAoQgAIDEAAKMIACAyAACiCAAgpQMAAPgFACAJhwMAAK4FADCIAwAAoQIAEIkDAACuBQAwmAMBANkEACGbA0AA2wQAIaMDAQDrBAAhpAMBAOsEACGlAwEA8AQAIaYDQADbBAAhAwAAACIAIAEAAKACADAwAAChAgAgAwAAACIAIAEAACMAMAIAACQAIBIDAACqBQAgCwAAqwUAIA4AAKwFACAXAACtBQAghwMAAKkFADCIAwAACwAQiQMAAKkFADCKAwEAAAABmAMBAAAAAZsDQADmBAAhpgNAAOYEACGpAyAA5QQAIaoDQAD_BAAhygMBAOQEACHLAwEAAAABzAMBAJkFACHNAwEAmQUAIdkDAQCZBQAhAQAAAKQCACABAAAApAIAIAgDAACdCAAgCwAAnggAIA4AAJ8IACAXAACgCAAgqgMAAPgFACDMAwAA-AUAIM0DAAD4BQAg2QMAAPgFACADAAAACwAgAQAApwIAMAIAAKQCACADAAAACwAgAQAApwIAMAIAAKQCACADAAAACwAgAQAApwIAMAIAAKQCACAPAwAAmQgAIAsAAJoIACAOAACbCAAgFwAAnAgAIIoDAQAAAAGYAwEAAAABmwNAAAAAAaYDQAAAAAGpAyAAAAABqgNAAAAAAcoDAQAAAAHLAwEAAAABzAMBAAAAAc0DAQAAAAHZAwEAAAABASQAAKsCACALigMBAAAAAZgDAQAAAAGbA0AAAAABpgNAAAAAAakDIAAAAAGqA0AAAAABygMBAAAAAcsDAQAAAAHMAwEAAAABzQMBAAAAAdkDAQAAAAEBJAAArQIAMAEkAACtAgAwDwMAAPoHACALAAD7BwAgDgAA_AcAIBcAAP0HACCKAwEA8gUAIZgDAQDyBQAhmwNAAPQFACGmA0AA9AUAIakDIADzBQAhqgNAAIEGACHKAwEA8gUAIcsDAQDyBQAhzAMBAP8FACHNAwEA_wUAIdkDAQD_BQAhAgAAAKQCACAkAACwAgAgC4oDAQDyBQAhmAMBAPIFACGbA0AA9AUAIaYDQAD0BQAhqQMgAPMFACGqA0AAgQYAIcoDAQDyBQAhywMBAPIFACHMAwEA_wUAIc0DAQD_BQAh2QMBAP8FACECAAAACwAgJAAAsgIAIAIAAAALACAkAACyAgAgAwAAAKQCACArAACrAgAgLAAAsAIAIAEAAACkAgAgAQAAAAsAIAcIAAD3BwAgMQAA-QcAIDIAAPgHACCqAwAA-AUAIMwDAAD4BQAgzQMAAPgFACDZAwAA-AUAIA6HAwAAqAUAMIgDAAC5AgAQiQMAAKgFADCKAwEA2QQAIZgDAQDrBAAhmwNAANsEACGmA0AA2wQAIakDIADaBAAhqgNAAO8EACHKAwEA2QQAIcsDAQDZBAAhzAMBAO0EACHNAwEA7QQAIdkDAQDtBAAhAwAAAAsAIAEAALgCADAwAAC5AgAgAwAAAAsAIAEAAKcCADACAACkAgAgAQAAAA8AIAEAAAAPACADAAAADQAgAQAADgAwAgAADwAgAwAAAA0AIAEAAA4AMAIAAA8AIAMAAAANACABAAAOADACAAAPACAQBgAA9AYAIAwAAPgGACAXAAD3BgAgGgAAzwcAIBsAAPUGACAcAAD2BgAgmAMBAAAAAZsDQAAAAAGgAwAAANYDAqMDAQAAAAGkAwEAAAABpgNAAAAAAdQDAQAAAAHWAwAAALADAtcDQAAAAAHYAwEAAAABASQAAMECACAKmAMBAAAAAZsDQAAAAAGgAwAAANYDAqMDAQAAAAGkAwEAAAABpgNAAAAAAdQDAQAAAAHWAwAAALADAtcDQAAAAAHYAwEAAAABASQAAMMCADABJAAAwwIAMAEAAAARACAQBgAAoAYAIAwAAKQGACAXAACjBgAgGgAAzQcAIBsAAKEGACAcAACiBgAgmAMBAPIFACGbA0AA9AUAIaADAACeBtYDIqMDAQDyBQAhpAMBAP8FACGmA0AA9AUAIdQDAQDyBQAh1gMAAJ8GsAMi1wNAAPQFACHYAwEA8gUAIQIAAAAPACAkAADHAgAgCpgDAQDyBQAhmwNAAPQFACGgAwAAngbWAyKjAwEA8gUAIaQDAQD_BQAhpgNAAPQFACHUAwEA8gUAIdYDAACfBrADItcDQAD0BQAh2AMBAPIFACECAAAADQAgJAAAyQIAIAIAAAANACAkAADJAgAgAQAAABEAIAMAAAAPACArAADBAgAgLAAAxwIAIAEAAAAPACABAAAADQAgBAgAAPQHACAxAAD2BwAgMgAA9QcAIKQDAAD4BQAgDYcDAACkBQAwiAMAANECABCJAwAApAUAMJgDAQDrBAAhmwNAANsEACGgAwAApQXWAyKjAwEA6wQAIaQDAQDwBAAhpgNAANsEACHUAwEA6wQAIdYDAACEBbADItcDQADbBAAh2AMBAOsEACEDAAAADQAgAQAA0AIAMDAAANECACADAAAADQAgAQAADgAwAgAADwAgAQAAABMAIAEAAAATACADAAAAEQAgAQAAEgAwAgAAEwAgAwAAABEAIAEAABIAMAIAABMAIAMAAAARACABAAASADACAAATACAXAwAA3AcAIAkAAPMHACAKAADdBwAgCwAA3gcAIA4AAN8HACAPAADgBwAgFwAA4QcAIIoDAQAAAAGYAwEAAAABmwNAAAAAAaYDQAAAAAGpAyAAAAABqgNAAAAAAcoDAQAAAAHLAwEAAAABzAMBAAAAAc0DAQAAAAHOAwEAAAABzwMBAAAAAdADAgAAAAHRAwIAAAAB0gMgAAAAAdMDAQAAAAEBJAAA2QIAIBCKAwEAAAABmAMBAAAAAZsDQAAAAAGmA0AAAAABqQMgAAAAAaoDQAAAAAHKAwEAAAABywMBAAAAAcwDAQAAAAHNAwEAAAABzgMBAAAAAc8DAQAAAAHQAwIAAAAB0QMCAAAAAdIDIAAAAAHTAwEAAAABASQAANsCADABJAAA2wIAMBcDAACfBwAgCQAA8gcAIAoAAKAHACALAAChBwAgDgAAogcAIA8AAKMHACAXAACkBwAgigMBAPIFACGYAwEA8gUAIZsDQAD0BQAhpgNAAPQFACGpAyAA8wUAIaoDQACBBgAhygMBAPIFACHLAwEA8gUAIcwDAQD_BQAhzQMBAP8FACHOAwEA_wUAIc8DAQD_BQAh0AMCAP4FACHRAwIA_gUAIdIDIADzBQAh0wMBAPIFACECAAAAEwAgJAAA3gIAIBCKAwEA8gUAIZgDAQDyBQAhmwNAAPQFACGmA0AA9AUAIakDIADzBQAhqgNAAIEGACHKAwEA8gUAIcsDAQDyBQAhzAMBAP8FACHNAwEA_wUAIc4DAQD_BQAhzwMBAP8FACHQAwIA_gUAIdEDAgD-BQAh0gMgAPMFACHTAwEA8gUAIQIAAAARACAkAADgAgAgAgAAABEAICQAAOACACADAAAAEwAgKwAA2QIAICwAAN4CACABAAAAEwAgAQAAABEAIAoIAADtBwAgMQAA8AcAIDIAAO8HACBDAADuBwAgRAAA8QcAIKoDAAD4BQAgzAMAAPgFACDNAwAA-AUAIM4DAAD4BQAgzwMAAPgFACAThwMAAKMFADCIAwAA5wIAEIkDAACjBQAwigMBANkEACGYAwEA6wQAIZsDQADbBAAhpgNAANsEACGpAyAA2gQAIaoDQADvBAAhygMBANkEACHLAwEA2QQAIcwDAQDtBAAhzQMBAO0EACHOAwEA7QQAIc8DAQDtBAAh0AMCAOwEACHRAwIA7AQAIdIDIADaBAAh0wMBAOsEACEDAAAAEQAgAQAA5gIAMDAAAOcCACADAAAAEQAgAQAAEgAwAgAAEwAgAQAAABgAIAEAAAAYACADAAAAFgAgAQAAFwAwAgAAGAAgAwAAABYAIAEAABcAMAIAABgAIAMAAAAWACABAAAXADACAAAYACANDAAA-gYAIA0AAPsGACAZAADaBwAgmAMBAAAAAZsDQAAAAAGkAwEAAAABpQMBAAAAAaYDQAAAAAGpAyAAAAABqgNAAAAAAccDAQAAAAHIAyAAAAAByQMgAAAAAQEkAADvAgAgCpgDAQAAAAGbA0AAAAABpAMBAAAAAaUDAQAAAAGmA0AAAAABqQMgAAAAAaoDQAAAAAHHAwEAAAAByAMgAAAAAckDIAAAAAEBJAAA8QIAMAEkAADxAgAwDQwAAJcGACANAACYBgAgGQAA2AcAIJgDAQDyBQAhmwNAAPQFACGkAwEA8gUAIaUDAQD_BQAhpgNAAPQFACGpAyAA8wUAIaoDQACBBgAhxwMBAPIFACHIAyAA8wUAIckDIADzBQAhAgAAABgAICQAAPQCACAKmAMBAPIFACGbA0AA9AUAIaQDAQDyBQAhpQMBAP8FACGmA0AA9AUAIakDIADzBQAhqgNAAIEGACHHAwEA8gUAIcgDIADzBQAhyQMgAPMFACECAAAAFgAgJAAA9gIAIAIAAAAWACAkAAD2AgAgAwAAABgAICsAAO8CACAsAAD0AgAgAQAAABgAIAEAAAAWACAFCAAA6gcAIDEAAOwHACAyAADrBwAgpQMAAPgFACCqAwAA-AUAIA2HAwAAogUAMIgDAAD9AgAQiQMAAKIFADCYAwEA6wQAIZsDQADbBAAhpAMBAOsEACGlAwEA8AQAIaYDQADbBAAhqQMgANoEACGqA0AA7wQAIccDAQDrBAAhyAMgANoEACHJAyAA2gQAIQMAAAAWACABAAD8AgAwMAAA_QIAIAMAAAAWACABAAAXADACAAAYACAMDAAAoQUAIIcDAACfBQAwiAMAACAAEIkDAACfBQAwmAMBAAAAAZsDQADmBAAhoAMAAKAFxAMipAMBAAAAAaYDQADmBAAhxAMBAJkFACHFAwEAmQUAIcYDQAD_BAAhAQAAAIADACABAAAAgAMAIAQMAADpBwAgxAMAAPgFACDFAwAA-AUAIMYDAAD4BQAgAwAAACAAIAEAAIMDADACAACAAwAgAwAAACAAIAEAAIMDADACAACAAwAgAwAAACAAIAEAAIMDADACAACAAwAgCQwAAOgHACCYAwEAAAABmwNAAAAAAaADAAAAxAMCpAMBAAAAAaYDQAAAAAHEAwEAAAABxQMBAAAAAcYDQAAAAAEBJAAAhwMAIAiYAwEAAAABmwNAAAAAAaADAAAAxAMCpAMBAAAAAaYDQAAAAAHEAwEAAAABxQMBAAAAAcYDQAAAAAEBJAAAiQMAMAEkAACJAwAwCQwAAOcHACCYAwEA8gUAIZsDQAD0BQAhoAMAALUHxAMipAMBAPIFACGmA0AA9AUAIcQDAQD_BQAhxQMBAP8FACHGA0AAgQYAIQIAAACAAwAgJAAAjAMAIAiYAwEA8gUAIZsDQAD0BQAhoAMAALUHxAMipAMBAPIFACGmA0AA9AUAIcQDAQD_BQAhxQMBAP8FACHGA0AAgQYAIQIAAAAgACAkAACOAwAgAgAAACAAICQAAI4DACADAAAAgAMAICsAAIcDACAsAACMAwAgAQAAAIADACABAAAAIAAgBggAAOQHACAxAADmBwAgMgAA5QcAIMQDAAD4BQAgxQMAAPgFACDGAwAA-AUAIAuHAwAAmwUAMIgDAACVAwAQiQMAAJsFADCYAwEA6wQAIZsDQADbBAAhoAMAAJwFxAMipAMBAOsEACGmA0AA2wQAIcQDAQDtBAAhxQMBAO0EACHGA0AA7wQAIQMAAAAgACABAACUAwAwMAAAlQMAIAMAAAAgACABAACDAwAwAgAAgAMAIAwHAACaBQAghwMAAJgFADCIAwAAmwMAEIkDAACYBQAwmAMBAAAAAZsDQADmBAAhpgNAAOYEACGpAyAA5QQAIaoDQAD_BAAhwAMBAAAAAcEDAQCZBQAhwgMBAJkFACEBAAAAmAMAIAEAAACYAwAgDAcAAJoFACCHAwAAmAUAMIgDAACbAwAQiQMAAJgFADCYAwEA_gQAIZsDQADmBAAhpgNAAOYEACGpAyAA5QQAIaoDQAD_BAAhwAMBAOQEACHBAwEAmQUAIcIDAQCZBQAhBAcAAOMHACCqAwAA-AUAIMEDAAD4BQAgwgMAAPgFACADAAAAmwMAIAEAAJwDADACAACYAwAgAwAAAJsDACABAACcAwAwAgAAmAMAIAMAAACbAwAgAQAAnAMAMAIAAJgDACAJBwAA4gcAIJgDAQAAAAGbA0AAAAABpgNAAAAAAakDIAAAAAGqA0AAAAABwAMBAAAAAcEDAQAAAAHCAwEAAAABASQAAKADACAImAMBAAAAAZsDQAAAAAGmA0AAAAABqQMgAAAAAaoDQAAAAAHAAwEAAAABwQMBAAAAAcIDAQAAAAEBJAAAogMAMAEkAACiAwAwCQcAAJMHACCYAwEA8gUAIZsDQAD0BQAhpgNAAPQFACGpAyAA8wUAIaoDQACBBgAhwAMBAPIFACHBAwEA_wUAIcIDAQD_BQAhAgAAAJgDACAkAAClAwAgCJgDAQDyBQAhmwNAAPQFACGmA0AA9AUAIakDIADzBQAhqgNAAIEGACHAAwEA8gUAIcEDAQD_BQAhwgMBAP8FACECAAAAmwMAICQAAKcDACACAAAAmwMAICQAAKcDACADAAAAmAMAICsAAKADACAsAAClAwAgAQAAAJgDACABAAAAmwMAIAYIAACQBwAgMQAAkgcAIDIAAJEHACCqAwAA-AUAIMEDAAD4BQAgwgMAAPgFACALhwMAAJcFADCIAwAArgMAEIkDAACXBQAwmAMBAOsEACGbA0AA2wQAIaYDQADbBAAhqQMgANoEACGqA0AA7wQAIcADAQDZBAAhwQMBAO0EACHCAwEA7QQAIQMAAACbAwAgAQAArQMAMDAAAK4DACADAAAAmwMAIAEAAJwDADACAACYAwAgAQAAACkAIAEAAAApACADAAAAJwAgAQAAKAAwAgAAKQAgAwAAACcAIAEAACgAMAIAACkAIAMAAAAnACABAAAoADACAAApACAJEAAAjwcAIBIAAOMGACCYAwEAAAABmQMBAAAAAaYDQAAAAAG5AwAAAL8DArsDAQAAAAG9AwAAAL0DAr8DAQAAAAEBJAAAtgMAIAeYAwEAAAABmQMBAAAAAaYDQAAAAAG5AwAAAL8DArsDAQAAAAG9AwAAAL0DAr8DAQAAAAEBJAAAuAMAMAEkAAC4AwAwCRAAAI4HACASAADcBgAgmAMBAPIFACGZAwEA8gUAIaYDQAD0BQAhuQMAANoGvwMiuwMBAPIFACG9AwAAywa9AyK_AwEA_wUAIQIAAAApACAkAAC7AwAgB5gDAQDyBQAhmQMBAPIFACGmA0AA9AUAIbkDAADaBr8DIrsDAQDyBQAhvQMAAMsGvQMivwMBAP8FACECAAAAJwAgJAAAvQMAIAIAAAAnACAkAAC9AwAgAwAAACkAICsAALYDACAsAAC7AwAgAQAAACkAIAEAAAAnACAECAAAiwcAIDEAAI0HACAyAACMBwAgvwMAAPgFACAKhwMAAJAFADCIAwAAxAMAEIkDAACQBQAwmAMBANkEACGZAwEA2QQAIaYDQADbBAAhuQMAAJIFvwMiuwMBANkEACG9AwAAkQW9AyK_AwEA7QQAIQMAAAAnACABAADDAwAwMAAAxAMAIAMAAAAnACABAAAoADACAAApACABAAAATwAgAQAAAE8AIAMAAABNACABAABOADACAABPACADAAAATQAgAQAATgAwAgAATwAgAwAAAE0AIAEAAE4AMAIAAE8AIAcDAACKBwAgEQEAAAABigMBAAAAAZgDAQAAAAGmA0AAAAABuQMBAAAAAboDIAAAAAEBJAAAzAMAIAYRAQAAAAGKAwEAAAABmAMBAAAAAaYDQAAAAAG5AwEAAAABugMgAAAAAQEkAADOAwAwASQAAM4DADAHAwAAiQcAIBEBAPIFACGKAwEA8gUAIZgDAQDyBQAhpgNAAPQFACG5AwEA8gUAIboDIADzBQAhAgAAAE8AICQAANEDACAGEQEA8gUAIYoDAQDyBQAhmAMBAPIFACGmA0AA9AUAIbkDAQDyBQAhugMgAPMFACECAAAATQAgJAAA0wMAIAIAAABNACAkAADTAwAgAwAAAE8AICsAAMwDACAsAADRAwAgAQAAAE8AIAEAAABNACADCAAAhgcAIDEAAIgHACAyAACHBwAgCREBANkEACGHAwAAjwUAMIgDAADaAwAQiQMAAI8FADCKAwEA2QQAIZgDAQDZBAAhpgNAANsEACG5AwEA2QQAIboDIADaBAAhAwAAAE0AIAEAANkDADAwAADaAwAgAwAAAE0AIAEAAE4AMAIAAE8AIA0NAACOBQAghwMAAIoFADCIAwAAPwAQiQMAAIoFADCYAwEAAAABmwNAAOYEACGgAwAAjAWwAyKlAwEAAAABpgNAAOYEACGuAwgAiwUAIbADAQAAAAGxAwEAAAABsgMAAI0FACABAAAA3QMAIAEAAADdAwAgAw0AAIUHACCxAwAA-AUAILIDAAD4BQAgAwAAAD8AIAEAAOADADACAADdAwAgAwAAAD8AIAEAAOADADACAADdAwAgAwAAAD8AIAEAAOADADACAADdAwAgCg0AAIQHACCYAwEAAAABmwNAAAAAAaADAAAAsAMCpQMBAAAAAaYDQAAAAAGuAwgAAAABsAMBAAAAAbEDAQAAAAGyA4AAAAABASQAAOQDACAJmAMBAAAAAZsDQAAAAAGgAwAAALADAqUDAQAAAAGmA0AAAAABrgMIAAAAAbADAQAAAAGxAwEAAAABsgOAAAAAAQEkAADmAwAwASQAAOYDADAKDQAAgwcAIJgDAQDyBQAhmwNAAPQFACGgAwAAnwawAyKlAwEA8gUAIaYDQAD0BQAhrgMIAPMGACGwAwEA8gUAIbEDAQD_BQAhsgOAAAAAAQIAAADdAwAgJAAA6QMAIAmYAwEA8gUAIZsDQAD0BQAhoAMAAJ8GsAMipQMBAPIFACGmA0AA9AUAIa4DCADzBgAhsAMBAPIFACGxAwEA_wUAIbIDgAAAAAECAAAAPwAgJAAA6wMAIAIAAAA_ACAkAADrAwAgAwAAAN0DACArAADkAwAgLAAA6QMAIAEAAADdAwAgAQAAAD8AIAcIAAD-BgAgMQAAgQcAIDIAAIAHACBDAAD_BgAgRAAAggcAILEDAAD4BQAgsgMAAPgFACAMhwMAAIIFADCIAwAA8gMAEIkDAACCBQAwmAMBAOsEACGbA0AA2wQAIaADAACEBbADIqUDAQDrBAAhpgNAANsEACGuAwgAgwUAIbADAQDZBAAhsQMBAO0EACGyAwAAhQUAIAMAAAA_ACABAADxAwAwMAAA8gMAIAMAAAA_ACABAADgAwAwAgAA3QMAIAsYAACABQAghwMAAP0EADCIAwAA-AMAEIkDAAD9BAAwmAMBAAAAAZsDQADmBAAhpgNAAOYEACGnA0AA5gQAIagDQADmBAAhqQMgAOUEACGqA0AA_wQAIQEAAAD1AwAgAQAAAPUDACALGAAAgAUAIIcDAAD9BAAwiAMAAPgDABCJAwAA_QQAMJgDAQD-BAAhmwNAAOYEACGmA0AA5gQAIacDQADmBAAhqANAAOYEACGpAyAA5QQAIaoDQAD_BAAhAhgAAP0GACCqAwAA-AUAIAMAAAD4AwAgAQAA-QMAMAIAAPUDACADAAAA-AMAIAEAAPkDADACAAD1AwAgAwAAAPgDACABAAD5AwAwAgAA9QMAIAgYAAD8BgAgmAMBAAAAAZsDQAAAAAGmA0AAAAABpwNAAAAAAagDQAAAAAGpAyAAAAABqgNAAAAAAQEkAAD9AwAgB5gDAQAAAAGbA0AAAAABpgNAAAAAAacDQAAAAAGoA0AAAAABqQMgAAAAAaoDQAAAAAEBJAAA_wMAMAEkAAD_AwAwCBgAAIsGACCYAwEA8gUAIZsDQAD0BQAhpgNAAPQFACGnA0AA9AUAIagDQAD0BQAhqQMgAPMFACGqA0AAgQYAIQIAAAD1AwAgJAAAggQAIAeYAwEA8gUAIZsDQAD0BQAhpgNAAPQFACGnA0AA9AUAIagDQAD0BQAhqQMgAPMFACGqA0AAgQYAIQIAAAD4AwAgJAAAhAQAIAIAAAD4AwAgJAAAhAQAIAMAAAD1AwAgKwAA_QMAICwAAIIEACABAAAA9QMAIAEAAAD4AwAgBAgAAIgGACAxAACKBgAgMgAAiQYAIKoDAAD4BQAgCocDAAD8BAAwiAMAAIsEABCJAwAA_AQAMJgDAQDrBAAhmwNAANsEACGmA0AA2wQAIacDQADbBAAhqANAANsEACGpAyAA2gQAIaoDQADvBAAhAwAAAPgDACABAACKBAAwMAAAiwQAIAMAAAD4AwAgAQAA-QMAMAIAAPUDACABAAAAHQAgAQAAAB0AIAMAAAAbACABAAAcADACAAAdACADAAAAGwAgAQAAHAAwAgAAHQAgAwAAABsAIAEAABwAMAIAAB0AIA4GAACFBgAgDAAAhgYAIA0AAIcGACCYAwEAAAABmwNAAAAAAZ0DAgAAAAGeAwEAAAABoAMAAACgAwKhAwEAAAABogNAAAAAAaMDAQAAAAGkAwEAAAABpQMBAAAAAaYDQAAAAAEBJAAAkwQAIAuYAwEAAAABmwNAAAAAAZ0DAgAAAAGeAwEAAAABoAMAAACgAwKhAwEAAAABogNAAAAAAaMDAQAAAAGkAwEAAAABpQMBAAAAAaYDQAAAAAEBJAAAlQQAMAEkAACVBAAwAQAAAA0AIA4GAACCBgAgDAAAgwYAIA0AAIQGACCYAwEA8gUAIZsDQAD0BQAhnQMCAP4FACGeAwEA_wUAIaADAACABqADIqEDAQD_BQAhogNAAIEGACGjAwEA8gUAIaQDAQDyBQAhpQMBAP8FACGmA0AA9AUAIQIAAAAdACAkAACZBAAgC5gDAQDyBQAhmwNAAPQFACGdAwIA_gUAIZ4DAQD_BQAhoAMAAIAGoAMioQMBAP8FACGiA0AAgQYAIaMDAQDyBQAhpAMBAPIFACGlAwEA_wUAIaYDQAD0BQAhAgAAABsAICQAAJsEACACAAAAGwAgJAAAmwQAIAEAAAANACADAAAAHQAgKwAAkwQAICwAAJkEACABAAAAHQAgAQAAABsAIAkIAAD5BQAgMQAA_AUAIDIAAPsFACBDAAD6BQAgRAAA_QUAIJ4DAAD4BQAgoQMAAPgFACCiAwAA-AUAIKUDAAD4BQAgDocDAADqBAAwiAMAAKMEABCJAwAA6gQAMJgDAQDrBAAhmwNAANsEACGdAwIA7AQAIZ4DAQDtBAAhoAMAAO4EoAMioQMBAO0EACGiA0AA7wQAIaMDAQDrBAAhpAMBAOsEACGlAwEA8AQAIaYDQADbBAAhAwAAABsAIAEAAKIEADAwAACjBAAgAwAAABsAIAEAABwAMAIAAB0AIAmHAwAA6AQAMIgDAACpBAAQiQMAAOgEADCKAwEA5AQAIZgDAQAAAAGZAwEA5AQAIZoDIADlBAAhmwNAAOYEACGcAwAA6QQAIAEAAACmBAAgAQAAAKYEACAIhwMAAOgEADCIAwAAqQQAEIkDAADoBAAwigMBAOQEACGYAwEA5AQAIZkDAQDkBAAhmgMgAOUEACGbA0AA5gQAIQADAAAAqQQAIAEAAKoEADACAACmBAAgAwAAAKkEACABAACqBAAwAgAApgQAIAMAAACpBAAgAQAAqgQAMAIAAKYEACAFigMBAAAAAZgDAQAAAAGZAwEAAAABmgMgAAAAAZsDQAAAAAEBJAAArgQAIAWKAwEAAAABmAMBAAAAAZkDAQAAAAGaAyAAAAABmwNAAAAAAQEkAACwBAAwASQAALAEADAFigMBAPIFACGYAwEA8gUAIZkDAQDyBQAhmgMgAPMFACGbA0AA9AUAIQIAAACmBAAgJAAAswQAIAWKAwEA8gUAIZgDAQDyBQAhmQMBAPIFACGaAyAA8wUAIZsDQAD0BQAhAgAAAKkEACAkAAC1BAAgAgAAAKkEACAkAAC1BAAgAwAAAKYEACArAACuBAAgLAAAswQAIAEAAACmBAAgAQAAAKkEACADCAAA9QUAIDEAAPcFACAyAAD2BQAgCIcDAADnBAAwiAMAALwEABCJAwAA5wQAMIoDAQDZBAAhmAMBANkEACGZAwEA2QQAIZoDIADaBAAhmwNAANsEACEDAAAAqQQAIAEAALsEADAwAAC8BAAgAwAAAKkEACABAACqBAAwAgAApgQAIAaHAwAA4wQAMIgDAADCBAAQiQMAAOMEADCKAwEAAAABiwMgAOUEACGMA0AA5gQAIQEAAAC_BAAgAQAAAL8EACAGhwMAAOMEADCIAwAAwgQAEIkDAADjBAAwigMBAOQEACGLAyAA5QQAIYwDQADmBAAhAAMAAADCBAAgAQAAwwQAMAIAAL8EACADAAAAwgQAIAEAAMMEADACAAC_BAAgAwAAAMIEACABAADDBAAwAgAAvwQAIAOKAwEAAAABiwMgAAAAAYwDQAAAAAEBJAAAxwQAIAOKAwEAAAABiwMgAAAAAYwDQAAAAAEBJAAAyQQAMAEkAADJBAAwA4oDAQDyBQAhiwMgAPMFACGMA0AA9AUAIQIAAAC_BAAgJAAAzAQAIAOKAwEA8gUAIYsDIADzBQAhjANAAPQFACECAAAAwgQAICQAAM4EACACAAAAwgQAICQAAM4EACADAAAAvwQAICsAAMcEACAsAADMBAAgAQAAAL8EACABAAAAwgQAIAMIAADvBQAgMQAA8QUAIDIAAPAFACAGhwMAANgEADCIAwAA1QQAEIkDAADYBAAwigMBANkEACGLAyAA2gQAIYwDQADbBAAhAwAAAMIEACABAADUBAAwMAAA1QQAIAMAAADCBAAgAQAAwwQAMAIAAL8EACAGhwMAANgEADCIAwAA1QQAEIkDAADYBAAwigMBANkEACGLAyAA2gQAIYwDQADbBAAhDggAAN0EACAxAADiBAAgMgAA4gQAII0DAQAAAAGOAwEAAAAEjwMBAAAABJADAQAAAAGRAwEAAAABkgMBAAAAAZMDAQAAAAGUAwEA4QQAIZUDAQAAAAGWAwEAAAABlwMBAAAAAQUIAADdBAAgMQAA4AQAIDIAAOAEACCNAyAAAAABlAMgAN8EACELCAAA3QQAIDEAAN4EACAyAADeBAAgjQNAAAAAAY4DQAAAAASPA0AAAAAEkANAAAAAAZEDQAAAAAGSA0AAAAABkwNAAAAAAZQDQADcBAAhCwgAAN0EACAxAADeBAAgMgAA3gQAII0DQAAAAAGOA0AAAAAEjwNAAAAABJADQAAAAAGRA0AAAAABkgNAAAAAAZMDQAAAAAGUA0AA3AQAIQiNAwIAAAABjgMCAAAABI8DAgAAAASQAwIAAAABkQMCAAAAAZIDAgAAAAGTAwIAAAABlAMCAN0EACEIjQNAAAAAAY4DQAAAAASPA0AAAAAEkANAAAAAAZEDQAAAAAGSA0AAAAABkwNAAAAAAZQDQADeBAAhBQgAAN0EACAxAADgBAAgMgAA4AQAII0DIAAAAAGUAyAA3wQAIQKNAyAAAAABlAMgAOAEACEOCAAA3QQAIDEAAOIEACAyAADiBAAgjQMBAAAAAY4DAQAAAASPAwEAAAAEkAMBAAAAAZEDAQAAAAGSAwEAAAABkwMBAAAAAZQDAQDhBAAhlQMBAAAAAZYDAQAAAAGXAwEAAAABC40DAQAAAAGOAwEAAAAEjwMBAAAABJADAQAAAAGRAwEAAAABkgMBAAAAAZMDAQAAAAGUAwEA4gQAIZUDAQAAAAGWAwEAAAABlwMBAAAAAQaHAwAA4wQAMIgDAADCBAAQiQMAAOMEADCKAwEA5AQAIYsDIADlBAAhjANAAOYEACELjQMBAAAAAY4DAQAAAASPAwEAAAAEkAMBAAAAAZEDAQAAAAGSAwEAAAABkwMBAAAAAZQDAQDiBAAhlQMBAAAAAZYDAQAAAAGXAwEAAAABAo0DIAAAAAGUAyAA4AQAIQiNA0AAAAABjgNAAAAABI8DQAAAAASQA0AAAAABkQNAAAAAAZIDQAAAAAGTA0AAAAABlANAAN4EACEIhwMAAOcEADCIAwAAvAQAEIkDAADnBAAwigMBANkEACGYAwEA2QQAIZkDAQDZBAAhmgMgANoEACGbA0AA2wQAIQiHAwAA6AQAMIgDAACpBAAQiQMAAOgEADCKAwEA5AQAIZgDAQDkBAAhmQMBAOQEACGaAyAA5QQAIZsDQADmBAAhAooDAQAAAAGZAwEAAAABDocDAADqBAAwiAMAAKMEABCJAwAA6gQAMJgDAQDrBAAhmwNAANsEACGdAwIA7AQAIZ4DAQDtBAAhoAMAAO4EoAMioQMBAO0EACGiA0AA7wQAIaMDAQDrBAAhpAMBAOsEACGlAwEA8AQAIaYDQADbBAAhCwgAAN0EACAxAADiBAAgMgAA4gQAII0DAQAAAAGOAwEAAAAEjwMBAAAABJADAQAAAAGRAwEAAAABkgMBAAAAAZMDAQAAAAGUAwEA-wQAIQ0IAADdBAAgMQAA3QQAIDIAAN0EACBDAAD6BAAgRAAA3QQAII0DAgAAAAGOAwIAAAAEjwMCAAAABJADAgAAAAGRAwIAAAABkgMCAAAAAZMDAgAAAAGUAwIA-QQAIQ4IAADyBAAgMQAA8wQAIDIAAPMEACCNAwEAAAABjgMBAAAABY8DAQAAAAWQAwEAAAABkQMBAAAAAZIDAQAAAAGTAwEAAAABlAMBAPgEACGVAwEAAAABlgMBAAAAAZcDAQAAAAEHCAAA3QQAIDEAAPcEACAyAAD3BAAgjQMAAACgAwKOAwAAAKADCI8DAAAAoAMIlAMAAPYEoAMiCwgAAPIEACAxAAD1BAAgMgAA9QQAII0DQAAAAAGOA0AAAAAFjwNAAAAABZADQAAAAAGRA0AAAAABkgNAAAAAAZMDQAAAAAGUA0AA9AQAIQsIAADyBAAgMQAA8wQAIDIAAPMEACCNAwEAAAABjgMBAAAABY8DAQAAAAWQAwEAAAABkQMBAAAAAZIDAQAAAAGTAwEAAAABlAMBAPEEACELCAAA8gQAIDEAAPMEACAyAADzBAAgjQMBAAAAAY4DAQAAAAWPAwEAAAAFkAMBAAAAAZEDAQAAAAGSAwEAAAABkwMBAAAAAZQDAQDxBAAhCI0DAgAAAAGOAwIAAAAFjwMCAAAABZADAgAAAAGRAwIAAAABkgMCAAAAAZMDAgAAAAGUAwIA8gQAIQuNAwEAAAABjgMBAAAABY8DAQAAAAWQAwEAAAABkQMBAAAAAZIDAQAAAAGTAwEAAAABlAMBAPMEACGVAwEAAAABlgMBAAAAAZcDAQAAAAELCAAA8gQAIDEAAPUEACAyAAD1BAAgjQNAAAAAAY4DQAAAAAWPA0AAAAAFkANAAAAAAZEDQAAAAAGSA0AAAAABkwNAAAAAAZQDQAD0BAAhCI0DQAAAAAGOA0AAAAAFjwNAAAAABZADQAAAAAGRA0AAAAABkgNAAAAAAZMDQAAAAAGUA0AA9QQAIQcIAADdBAAgMQAA9wQAIDIAAPcEACCNAwAAAKADAo4DAAAAoAMIjwMAAACgAwiUAwAA9gSgAyIEjQMAAACgAwKOAwAAAKADCI8DAAAAoAMIlAMAAPcEoAMiDggAAPIEACAxAADzBAAgMgAA8wQAII0DAQAAAAGOAwEAAAAFjwMBAAAABZADAQAAAAGRAwEAAAABkgMBAAAAAZMDAQAAAAGUAwEA-AQAIZUDAQAAAAGWAwEAAAABlwMBAAAAAQ0IAADdBAAgMQAA3QQAIDIAAN0EACBDAAD6BAAgRAAA3QQAII0DAgAAAAGOAwIAAAAEjwMCAAAABJADAgAAAAGRAwIAAAABkgMCAAAAAZMDAgAAAAGUAwIA-QQAIQiNAwgAAAABjgMIAAAABI8DCAAAAASQAwgAAAABkQMIAAAAAZIDCAAAAAGTAwgAAAABlAMIAPoEACELCAAA3QQAIDEAAOIEACAyAADiBAAgjQMBAAAAAY4DAQAAAASPAwEAAAAEkAMBAAAAAZEDAQAAAAGSAwEAAAABkwMBAAAAAZQDAQD7BAAhCocDAAD8BAAwiAMAAIsEABCJAwAA_AQAMJgDAQDrBAAhmwNAANsEACGmA0AA2wQAIacDQADbBAAhqANAANsEACGpAyAA2gQAIaoDQADvBAAhCxgAAIAFACCHAwAA_QQAMIgDAAD4AwAQiQMAAP0EADCYAwEA_gQAIZsDQADmBAAhpgNAAOYEACGnA0AA5gQAIagDQADmBAAhqQMgAOUEACGqA0AA_wQAIQiNAwEAAAABjgMBAAAABI8DAQAAAASQAwEAAAABkQMBAAAAAZIDAQAAAAGTAwEAAAABlAMBAIEFACEIjQNAAAAAAY4DQAAAAAWPA0AAAAAFkANAAAAAAZEDQAAAAAGSA0AAAAABkwNAAAAAAZQDQAD1BAAhA6sDAAAWACCsAwAAFgAgrQMAABYAIAiNAwEAAAABjgMBAAAABI8DAQAAAASQAwEAAAABkQMBAAAAAZIDAQAAAAGTAwEAAAABlAMBAIEFACEMhwMAAIIFADCIAwAA8gMAEIkDAACCBQAwmAMBAOsEACGbA0AA2wQAIaADAACEBbADIqUDAQDrBAAhpgNAANsEACGuAwgAgwUAIbADAQDZBAAhsQMBAO0EACGyAwAAhQUAIA0IAADdBAAgMQAA-gQAIDIAAPoEACBDAAD6BAAgRAAA-gQAII0DCAAAAAGOAwgAAAAEjwMIAAAABJADCAAAAAGRAwgAAAABkgMIAAAAAZMDCAAAAAGUAwgAiQUAIQcIAADdBAAgMQAAiAUAIDIAAIgFACCNAwAAALADAo4DAAAAsAMIjwMAAACwAwiUAwAAhwWwAyIPCAAA8gQAIDEAAIYFACAyAACGBQAgjQOAAAAAAZADgAAAAAGRA4AAAAABkgOAAAAAAZMDgAAAAAGUA4AAAAABswMBAAAAAbQDAQAAAAG1AwEAAAABtgOAAAAAAbcDgAAAAAG4A4AAAAABDI0DgAAAAAGQA4AAAAABkQOAAAAAAZIDgAAAAAGTA4AAAAABlAOAAAAAAbMDAQAAAAG0AwEAAAABtQMBAAAAAbYDgAAAAAG3A4AAAAABuAOAAAAAAQcIAADdBAAgMQAAiAUAIDIAAIgFACCNAwAAALADAo4DAAAAsAMIjwMAAACwAwiUAwAAhwWwAyIEjQMAAACwAwKOAwAAALADCI8DAAAAsAMIlAMAAIgFsAMiDQgAAN0EACAxAAD6BAAgMgAA-gQAIEMAAPoEACBEAAD6BAAgjQMIAAAAAY4DCAAAAASPAwgAAAAEkAMIAAAAAZEDCAAAAAGSAwgAAAABkwMIAAAAAZQDCACJBQAhDQ0AAI4FACCHAwAAigUAMIgDAAA_ABCJAwAAigUAMJgDAQD-BAAhmwNAAOYEACGgAwAAjAWwAyKlAwEA_gQAIaYDQADmBAAhrgMIAIsFACGwAwEA5AQAIbEDAQCZBQAhsgMAAI0FACAIjQMIAAAAAY4DCAAAAASPAwgAAAAEkAMIAAAAAZEDCAAAAAGSAwgAAAABkwMIAAAAAZQDCAD6BAAhBI0DAAAAsAMCjgMAAACwAwiPAwAAALADCJQDAACIBbADIgyNA4AAAAABkAOAAAAAAZEDgAAAAAGSA4AAAAABkwOAAAAAAZQDgAAAAAGzAwEAAAABtAMBAAAAAbUDAQAAAAG2A4AAAAABtwOAAAAAAbgDgAAAAAEVBgAA3AUAIAwAAMUFACAXAACtBQAgGgAA6gUAIBsAAOsFACAcAADsBQAghwMAAOgFADCIAwAADQAQiQMAAOgFADCYAwEA_gQAIZsDQADmBAAhoAMAAOkF1gMiowMBAP4EACGkAwEA2gUAIaYDQADmBAAh1AMBAP4EACHWAwAAjAWwAyLXA0AA5gQAIdgDAQD-BAAh_AMAAA0AIP0DAAANACAJEQEA2QQAIYcDAACPBQAwiAMAANoDABCJAwAAjwUAMIoDAQDZBAAhmAMBANkEACGmA0AA2wQAIbkDAQDZBAAhugMgANoEACEKhwMAAJAFADCIAwAAxAMAEIkDAACQBQAwmAMBANkEACGZAwEA2QQAIaYDQADbBAAhuQMAAJIFvwMiuwMBANkEACG9AwAAkQW9AyK_AwEA7QQAIQcIAADdBAAgMQAAlgUAIDIAAJYFACCNAwAAAL0DAo4DAAAAvQMIjwMAAAC9AwiUAwAAlQW9AyIHCAAA3QQAIDEAAJQFACAyAACUBQAgjQMAAAC_AwKOAwAAAL8DCI8DAAAAvwMIlAMAAJMFvwMiBwgAAN0EACAxAACUBQAgMgAAlAUAII0DAAAAvwMCjgMAAAC_AwiPAwAAAL8DCJQDAACTBb8DIgSNAwAAAL8DAo4DAAAAvwMIjwMAAAC_AwiUAwAAlAW_AyIHCAAA3QQAIDEAAJYFACAyAACWBQAgjQMAAAC9AwKOAwAAAL0DCI8DAAAAvQMIlAMAAJUFvQMiBI0DAAAAvQMCjgMAAAC9AwiPAwAAAL0DCJQDAACWBb0DIguHAwAAlwUAMIgDAACuAwAQiQMAAJcFADCYAwEA6wQAIZsDQADbBAAhpgNAANsEACGpAyAA2gQAIaoDQADvBAAhwAMBANkEACHBAwEA7QQAIcIDAQDtBAAhDAcAAJoFACCHAwAAmAUAMIgDAACbAwAQiQMAAJgFADCYAwEA_gQAIZsDQADmBAAhpgNAAOYEACGpAyAA5QQAIaoDQAD_BAAhwAMBAOQEACHBAwEAmQUAIcIDAQCZBQAhC40DAQAAAAGOAwEAAAAFjwMBAAAABZADAQAAAAGRAwEAAAABkgMBAAAAAZMDAQAAAAGUAwEA8wQAIZUDAQAAAAGWAwEAAAABlwMBAAAAAQOrAwAAEQAgrAMAABEAIK0DAAARACALhwMAAJsFADCIAwAAlQMAEIkDAACbBQAwmAMBAOsEACGbA0AA2wQAIaADAACcBcQDIqQDAQDrBAAhpgNAANsEACHEAwEA7QQAIcUDAQDtBAAhxgNAAO8EACEHCAAA3QQAIDEAAJ4FACAyAACeBQAgjQMAAADEAwKOAwAAAMQDCI8DAAAAxAMIlAMAAJ0FxAMiBwgAAN0EACAxAACeBQAgMgAAngUAII0DAAAAxAMCjgMAAADEAwiPAwAAAMQDCJQDAACdBcQDIgSNAwAAAMQDAo4DAAAAxAMIjwMAAADEAwiUAwAAngXEAyIMDAAAoQUAIIcDAACfBQAwiAMAACAAEIkDAACfBQAwmAMBAP4EACGbA0AA5gQAIaADAACgBcQDIqQDAQD-BAAhpgNAAOYEACHEAwEAmQUAIcUDAQCZBQAhxgNAAP8EACEEjQMAAADEAwKOAwAAAMQDCI8DAAAAxAMIlAMAAJ4FxAMiHAMAAKoFACAJAADmBQAgCgAAgAUAIAsAAKsFACAOAACsBQAgDwAA5wUAIBcAAK0FACCHAwAA5QUAMIgDAAARABCJAwAA5QUAMIoDAQDkBAAhmAMBAP4EACGbA0AA5gQAIaYDQADmBAAhqQMgAOUEACGqA0AA_wQAIcoDAQDkBAAhywMBAOQEACHMAwEAmQUAIc0DAQCZBQAhzgMBAJkFACHPAwEAmQUAIdADAgDKBQAh0QMCAMoFACHSAyAA5QQAIdMDAQD-BAAh_AMAABEAIP0DAAARACANhwMAAKIFADCIAwAA_QIAEIkDAACiBQAwmAMBAOsEACGbA0AA2wQAIaQDAQDrBAAhpQMBAPAEACGmA0AA2wQAIakDIADaBAAhqgNAAO8EACHHAwEA6wQAIcgDIADaBAAhyQMgANoEACEThwMAAKMFADCIAwAA5wIAEIkDAACjBQAwigMBANkEACGYAwEA6wQAIZsDQADbBAAhpgNAANsEACGpAyAA2gQAIaoDQADvBAAhygMBANkEACHLAwEA2QQAIcwDAQDtBAAhzQMBAO0EACHOAwEA7QQAIc8DAQDtBAAh0AMCAOwEACHRAwIA7AQAIdIDIADaBAAh0wMBAOsEACENhwMAAKQFADCIAwAA0QIAEIkDAACkBQAwmAMBAOsEACGbA0AA2wQAIaADAAClBdYDIqMDAQDrBAAhpAMBAPAEACGmA0AA2wQAIdQDAQDrBAAh1gMAAIQFsAMi1wNAANsEACHYAwEA6wQAIQcIAADdBAAgMQAApwUAIDIAAKcFACCNAwAAANYDAo4DAAAA1gMIjwMAAADWAwiUAwAApgXWAyIHCAAA3QQAIDEAAKcFACAyAACnBQAgjQMAAADWAwKOAwAAANYDCI8DAAAA1gMIlAMAAKYF1gMiBI0DAAAA1gMCjgMAAADWAwiPAwAAANYDCJQDAACnBdYDIg6HAwAAqAUAMIgDAAC5AgAQiQMAAKgFADCKAwEA2QQAIZgDAQDrBAAhmwNAANsEACGmA0AA2wQAIakDIADaBAAhqgNAAO8EACHKAwEA2QQAIcsDAQDZBAAhzAMBAO0EACHNAwEA7QQAIdkDAQDtBAAhEgMAAKoFACALAACrBQAgDgAArAUAIBcAAK0FACCHAwAAqQUAMIgDAAALABCJAwAAqQUAMIoDAQDkBAAhmAMBAP4EACGbA0AA5gQAIaYDQADmBAAhqQMgAOUEACGqA0AA_wQAIcoDAQDkBAAhywMBAOQEACHMAwEAmQUAIc0DAQCZBQAh2QMBAJkFACEXBAAAwgUAIAUAAMMFACAGAADEBQAgDAAAxQUAIB0AAMYFACAeAADHBQAghwMAAL8FADCIAwAAhQEAEIkDAAC_BQAwmAMBAOQEACGbA0AA5gQAIaADAADBBfMDIqYDQADmBAAhqQMgAOUEACGqA0AA_wQAIcADAQDkBAAhywMBAOQEACHbAwAAwAXyAyLwAyAA5QQAIfMDIADlBAAh9AMBAJkFACH8AwAAhQEAIP0DAACFAQAgA6sDAAANACCsAwAADQAgrQMAAA0AIAOrAwAAGwAgrAMAABsAIK0DAAAbACADqwMAACIAIKwDAAAiACCtAwAAIgAgCYcDAACuBQAwiAMAAKECABCJAwAArgUAMJgDAQDZBAAhmwNAANsEACGjAwEA6wQAIaQDAQDrBAAhpQMBAPAEACGmA0AA2wQAIQmHAwAArwUAMIgDAACJAgAQiQMAAK8FADCKAwEA2QQAIZgDAQDZBAAh2gMBANkEACHbAwAAkQW9AyLcA0AA7wQAId0DQADvBAAhCYcDAACwBQAwiAMAAPMBABCJAwAAsAUAMJgDAQDZBAAhmQMBANkEACGgAwAAsQXfAyKmA0AA2wQAId8DQADvBAAh4ANAAO8EACEHCAAA3QQAIDEAALMFACAyAACzBQAgjQMAAADfAwKOAwAAAN8DCI8DAAAA3wMIlAMAALIF3wMiBwgAAN0EACAxAACzBQAgMgAAswUAII0DAAAA3wMCjgMAAADfAwiPAwAAAN8DCJQDAACyBd8DIgSNAwAAAN8DAo4DAAAA3wMIjwMAAADfAwiUAwAAswXfAyIJhwMAALQFADCIAwAA3QEAEIkDAAC0BQAwmAMBANkEACGbA0AA2wQAIaYDQADbBAAh4QMBANkEACHiAwEA2QQAIeMDQADbBAAhCYcDAAC1BQAwiAMAAMoBABCJAwAAtQUAMJgDAQDkBAAhmwNAAOYEACGmA0AA5gQAIeEDAQDkBAAh4gMBAOQEACHjA0AA5gQAIRCHAwAAtgUAMIgDAADEAQAQiQMAALYFADCKAwEA2QQAIZgDAQDZBAAhmwNAANsEACGmA0AA2wQAIeQDAQDZBAAh5QMBANkEACHmAwEA7QQAIecDAQDtBAAh6AMBAO0EACHpA0AA7wQAIeoDQADvBAAh6wMBAO0EACHsAwEA7QQAIQuHAwAAtwUAMIgDAACuAQAQiQMAALcFADCKAwEA2QQAIZgDAQDZBAAhmwNAANsEACGmA0AA2wQAIeMDQADbBAAh7QMBANkEACHuAwEA7QQAIe8DAQDtBAAhD4cDAAC4BQAwiAMAAJgBABCJAwAAuAUAMJgDAQDZBAAhmwNAANsEACGgAwAAugXzAyKmA0AA2wQAIakDIADaBAAhqgNAAO8EACHAAwEA2QQAIcsDAQDZBAAh2wMAALkF8gMi8AMgANoEACHzAyAA2gQAIfQDAQDtBAAhBwgAAN0EACAxAAC-BQAgMgAAvgUAII0DAAAA8gMCjgMAAADyAwiPAwAAAPIDCJQDAAC9BfIDIgcIAADdBAAgMQAAvAUAIDIAALwFACCNAwAAAPMDAo4DAAAA8wMIjwMAAADzAwiUAwAAuwXzAyIHCAAA3QQAIDEAALwFACAyAAC8BQAgjQMAAADzAwKOAwAAAPMDCI8DAAAA8wMIlAMAALsF8wMiBI0DAAAA8wMCjgMAAADzAwiPAwAAAPMDCJQDAAC8BfMDIgcIAADdBAAgMQAAvgUAIDIAAL4FACCNAwAAAPIDAo4DAAAA8gMIjwMAAADyAwiUAwAAvQXyAyIEjQMAAADyAwKOAwAAAPIDCI8DAAAA8gMIlAMAAL4F8gMiFQQAAMIFACAFAADDBQAgBgAAxAUAIAwAAMUFACAdAADGBQAgHgAAxwUAIIcDAAC_BQAwiAMAAIUBABCJAwAAvwUAMJgDAQDkBAAhmwNAAOYEACGgAwAAwQXzAyKmA0AA5gQAIakDIADlBAAhqgNAAP8EACHAAwEA5AQAIcsDAQDkBAAh2wMAAMAF8gMi8AMgAOUEACHzAyAA5QQAIfQDAQCZBQAhBI0DAAAA8gMCjgMAAADyAwiPAwAAAPIDCJQDAAC-BfIDIgSNAwAAAPMDAo4DAAAA8wMIjwMAAADzAwiUAwAAvAXzAyIDqwMAAAMAIKwDAAADACCtAwAAAwAgA6sDAAAHACCsAwAABwAgrQMAAAcAIBQDAACqBQAgCwAAqwUAIA4AAKwFACAXAACtBQAghwMAAKkFADCIAwAACwAQiQMAAKkFADCKAwEA5AQAIZgDAQD-BAAhmwNAAOYEACGmA0AA5gQAIakDIADlBAAhqgNAAP8EACHKAwEA5AQAIcsDAQDkBAAhzAMBAJkFACHNAwEAmQUAIdkDAQCZBQAh_AMAAAsAIP0DAAALACAcAwAAqgUAIAkAAOYFACAKAACABQAgCwAAqwUAIA4AAKwFACAPAADnBQAgFwAArQUAIIcDAADlBQAwiAMAABEAEIkDAADlBQAwigMBAOQEACGYAwEA_gQAIZsDQADmBAAhpgNAAOYEACGpAyAA5QQAIaoDQAD_BAAhygMBAOQEACHLAwEA5AQAIcwDAQCZBQAhzQMBAJkFACHOAwEAmQUAIc8DAQCZBQAh0AMCAMoFACHRAwIAygUAIdIDIADlBAAh0wMBAP4EACH8AwAAEQAg_QMAABEAIBADAACqBQAghwMAAM4FADCIAwAASwAQiQMAAM4FADCKAwEA5AQAIZgDAQDkBAAhmwNAAOYEACGmA0AA5gQAIakDIADlBAAhqgNAAP8EACHAAwEA5AQAIcsDAQDkBAAhzAMBAJkFACH6AwEAmQUAIfwDAABLACD9AwAASwAgA6sDAABNACCsAwAATQAgrQMAAE0AIAqHAwAAyAUAMIgDAAB_ABCJAwAAyAUAMJgDAQDZBAAhpgNAANsEACH1AwEA2QQAIfYDAQDZBAAh9wMBANkEACH4AwEA2QQAIfkDAgDsBAAhCxEAAMsFACCHAwAAyQUAMIgDAAArABCJAwAAyQUAMJgDAQDkBAAhpgNAAOYEACH1AwEA5AQAIfYDAQDkBAAh9wMBAOQEACH4AwEA5AQAIfkDAgDKBQAhCI0DAgAAAAGOAwIAAAAEjwMCAAAABJADAgAAAAGRAwIAAAABkgMCAAAAAZMDAgAAAAGUAwIA3QQAIQ4QAADUBQAgEgAA2AUAIIcDAADWBQAwiAMAACcAEIkDAADWBQAwmAMBAOQEACGZAwEA5AQAIaYDQADmBAAhuQMAANcFvwMiuwMBAOQEACG9AwAA0AW9AyK_AwEAmQUAIfwDAAAnACD9AwAAJwAgDYcDAADMBQAwiAMAAGcAEIkDAADMBQAwigMBANkEACGYAwEA2QQAIZsDQADbBAAhpgNAANsEACGpAyAA2gQAIaoDQADvBAAhwAMBANkEACHLAwEA2QQAIcwDAQDtBAAh-gMBAO0EACEKAwAAqgUAIBEBAOQEACGHAwAAzQUAMIgDAABNABCJAwAAzQUAMIoDAQDkBAAhmAMBAOQEACGmA0AA5gQAIbkDAQDkBAAhugMgAOUEACEOAwAAqgUAIIcDAADOBQAwiAMAAEsAEIkDAADOBQAwigMBAOQEACGYAwEA5AQAIZsDQADmBAAhpgNAAOYEACGpAyAA5QQAIaoDQAD_BAAhwAMBAOQEACHLAwEA5AQAIcwDAQCZBQAh-gMBAJkFACEKFAAA0QUAIIcDAADPBQAwiAMAADEAEIkDAADPBQAwigMBAOQEACGYAwEA5AQAIdoDAQDkBAAh2wMAANAFvQMi3ANAAP8EACHdA0AA_wQAIQSNAwAAAL0DAo4DAAAAvQMIjwMAAAC9AwiUAwAAlgW9AyINEAAA1AUAIBUAANUFACCHAwAA0gUAMIgDAAAtABCJAwAA0gUAMJgDAQDkBAAhmQMBAOQEACGgAwAA0wXfAyKmA0AA5gQAId8DQAD_BAAh4ANAAP8EACH8AwAALQAg_QMAAC0AIAsQAADUBQAgFQAA1QUAIIcDAADSBQAwiAMAAC0AEIkDAADSBQAwmAMBAOQEACGZAwEA5AQAIaADAADTBd8DIqYDQADmBAAh3wNAAP8EACHgA0AA_wQAIQSNAwAAAN8DAo4DAAAA3wMIjwMAAADfAwiUAwAAswXfAyIQBgAA3AUAIAwAAKEFACANAADbBQAgEwAA3QUAIBYAAN4FACCHAwAA2QUAMIgDAAAiABCJAwAA2QUAMJgDAQDkBAAhmwNAAOYEACGjAwEA_gQAIaQDAQD-BAAhpQMBANoFACGmA0AA5gQAIfwDAAAiACD9AwAAIgAgA6sDAAAxACCsAwAAMQAgrQMAADEAIAwQAADUBQAgEgAA2AUAIIcDAADWBQAwiAMAACcAEIkDAADWBQAwmAMBAOQEACGZAwEA5AQAIaYDQADmBAAhuQMAANcFvwMiuwMBAOQEACG9AwAA0AW9AyK_AwEAmQUAIQSNAwAAAL8DAo4DAAAAvwMIjwMAAAC_AwiUAwAAlAW_AyINEQAAywUAIIcDAADJBQAwiAMAACsAEIkDAADJBQAwmAMBAOQEACGmA0AA5gQAIfUDAQDkBAAh9gMBAOQEACH3AwEA5AQAIfgDAQDkBAAh-QMCAMoFACH8AwAAKwAg_QMAACsAIA4GAADcBQAgDAAAoQUAIA0AANsFACATAADdBQAgFgAA3gUAIIcDAADZBQAwiAMAACIAEIkDAADZBQAwmAMBAOQEACGbA0AA5gQAIaMDAQD-BAAhpAMBAP4EACGlAwEA2gUAIaYDQADmBAAhCI0DAQAAAAGOAwEAAAAFjwMBAAAABZADAQAAAAGRAwEAAAABkgMBAAAAAZMDAQAAAAGUAwEA3wUAIRUGAADcBQAgDAAAxQUAIBcAAK0FACAaAADqBQAgGwAA6wUAIBwAAOwFACCHAwAA6AUAMIgDAAANABCJAwAA6AUAMJgDAQD-BAAhmwNAAOYEACGgAwAA6QXWAyKjAwEA_gQAIaQDAQDaBQAhpgNAAOYEACHUAwEA_gQAIdYDAACMBbADItcDQADmBAAh2AMBAP4EACH8AwAADQAg_QMAAA0AIBQDAACqBQAgCwAAqwUAIA4AAKwFACAXAACtBQAghwMAAKkFADCIAwAACwAQiQMAAKkFADCKAwEA5AQAIZgDAQD-BAAhmwNAAOYEACGmA0AA5gQAIakDIADlBAAhqgNAAP8EACHKAwEA5AQAIcsDAQDkBAAhzAMBAJkFACHNAwEAmQUAIdkDAQCZBQAh_AMAAAsAIP0DAAALACADqwMAACcAIKwDAAAnACCtAwAAJwAgA6sDAAAtACCsAwAALQAgrQMAAC0AIAiNAwEAAAABjgMBAAAABY8DAQAAAAWQAwEAAAABkQMBAAAAAZIDAQAAAAGTAwEAAAABlAMBAN8FACERBgAA3AUAIAwAAKEFACANAADbBQAghwMAAOAFADCIAwAAGwAQiQMAAOAFADCYAwEA_gQAIZsDQADmBAAhnQMCAMoFACGeAwEAmQUAIaADAADhBaADIqEDAQCZBQAhogNAAP8EACGjAwEA_gQAIaQDAQD-BAAhpQMBANoFACGmA0AA5gQAIQSNAwAAAKADAo4DAAAAoAMIjwMAAACgAwiUAwAA9wSgAyICpAMBAAAAAccDAQAAAAEQDAAAoQUAIA0AANsFACAZAADkBQAghwMAAOMFADCIAwAAFgAQiQMAAOMFADCYAwEA_gQAIZsDQADmBAAhpAMBAP4EACGlAwEA2gUAIaYDQADmBAAhqQMgAOUEACGqA0AA_wQAIccDAQD-BAAhyAMgAOUEACHJAyAA5QQAIQ0YAACABQAghwMAAP0EADCIAwAA-AMAEIkDAAD9BAAwmAMBAP4EACGbA0AA5gQAIaYDQADmBAAhpwNAAOYEACGoA0AA5gQAIakDIADlBAAhqgNAAP8EACH8AwAA-AMAIP0DAAD4AwAgGgMAAKoFACAJAADmBQAgCgAAgAUAIAsAAKsFACAOAACsBQAgDwAA5wUAIBcAAK0FACCHAwAA5QUAMIgDAAARABCJAwAA5QUAMIoDAQDkBAAhmAMBAP4EACGbA0AA5gQAIaYDQADmBAAhqQMgAOUEACGqA0AA_wQAIcoDAQDkBAAhywMBAOQEACHMAwEAmQUAIc0DAQCZBQAhzgMBAJkFACHPAwEAmQUAIdADAgDKBQAh0QMCAMoFACHSAyAA5QQAIdMDAQD-BAAhDgcAAJoFACCHAwAAmAUAMIgDAACbAwAQiQMAAJgFADCYAwEA_gQAIZsDQADmBAAhpgNAAOYEACGpAyAA5QQAIaoDQAD_BAAhwAMBAOQEACHBAwEAmQUAIcIDAQCZBQAh_AMAAJsDACD9AwAAmwMAIA4MAAChBQAghwMAAJ8FADCIAwAAIAAQiQMAAJ8FADCYAwEA_gQAIZsDQADmBAAhoAMAAKAFxAMipAMBAP4EACGmA0AA5gQAIcQDAQCZBQAhxQMBAJkFACHGA0AA_wQAIfwDAAAgACD9AwAAIAAgEwYAANwFACAMAADFBQAgFwAArQUAIBoAAOoFACAbAADrBQAgHAAA7AUAIIcDAADoBQAwiAMAAA0AEIkDAADoBQAwmAMBAP4EACGbA0AA5gQAIaADAADpBdYDIqMDAQD-BAAhpAMBANoFACGmA0AA5gQAIdQDAQD-BAAh1gMAAIwFsAMi1wNAAOYEACHYAwEA_gQAIQSNAwAAANYDAo4DAAAA1gMIjwMAAADWAwiUAwAApwXWAyISDAAAoQUAIA0AANsFACAZAADkBQAghwMAAOMFADCIAwAAFgAQiQMAAOMFADCYAwEA_gQAIZsDQADmBAAhpAMBAP4EACGlAwEA2gUAIaYDQADmBAAhqQMgAOUEACGqA0AA_wQAIccDAQD-BAAhyAMgAOUEACHJAyAA5QQAIfwDAAAWACD9AwAAFgAgDw0AAI4FACCHAwAAigUAMIgDAAA_ABCJAwAAigUAMJgDAQD-BAAhmwNAAOYEACGgAwAAjAWwAyKlAwEA_gQAIaYDQADmBAAhrgMIAIsFACGwAwEA5AQAIbEDAQCZBQAhsgMAAI0FACD8AwAAPwAg_QMAAD8AIBMGAADcBQAgDAAAoQUAIA0AANsFACCHAwAA4AUAMIgDAAAbABCJAwAA4AUAMJgDAQD-BAAhmwNAAOYEACGdAwIAygUAIZ4DAQCZBQAhoAMAAOEFoAMioQMBAJkFACGiA0AA_wQAIaMDAQD-BAAhpAMBAP4EACGlAwEA2gUAIaYDQADmBAAh_AMAABsAIP0DAAAbACARAwAAqgUAIIcDAADtBQAwiAMAAAcAEIkDAADtBQAwigMBAOQEACGYAwEA5AQAIZsDQADmBAAhpgNAAOYEACHkAwEA5AQAIeUDAQDkBAAh5gMBAJkFACHnAwEAmQUAIegDAQCZBQAh6QNAAP8EACHqA0AA_wQAIesDAQCZBQAh7AMBAJkFACEMAwAAqgUAIIcDAADuBQAwiAMAAAMAEIkDAADuBQAwigMBAOQEACGYAwEA5AQAIZsDQADmBAAhpgNAAOYEACHjA0AA5gQAIe0DAQDkBAAh7gMBAJkFACHvAwEAmQUAIQAAAAGBBAEAAAABAYEEIAAAAAEBgQRAAAAAAQAAAAAAAAAAAAWBBAIAAAABhwQCAAAAAYgEAgAAAAGJBAIAAAABigQCAAAAAQGBBAEAAAABAYEEAAAAoAMCAYEEQAAAAAEFKwAAmgoAICwAAKMKACD-AwAAmwoAIP8DAACiCgAghAQAAKQCACAFKwAAmAoAICwAAKAKACD-AwAAmQoAIP8DAACfCgAghAQAABMAIAcrAACWCgAgLAAAnQoAIP4DAACXCgAg_wMAAJwKACCCBAAADQAggwQAAA0AIIQEAAAPACADKwAAmgoAIP4DAACbCgAghAQAAKQCACADKwAAmAoAIP4DAACZCgAghAQAABMAIAMrAACWCgAg_gMAAJcKACCEBAAADwAgAAAACysAAIwGADAsAACRBgAw_gMAAI0GADD_AwAAjgYAMIAEAACPBgAggQQAAJAGADCCBAAAkAYAMIMEAACQBgAwhAQAAJAGADCFBAAAkgYAMIYEAACTBgAwCwwAAPoGACANAAD7BgAgmAMBAAAAAZsDQAAAAAGkAwEAAAABpQMBAAAAAaYDQAAAAAGpAyAAAAABqgNAAAAAAcgDIAAAAAHJAyAAAAABAgAAABgAICsAAPkGACADAAAAGAAgKwAA-QYAICwAAJYGACABJAAAlQoAMBEMAAChBQAgDQAA2wUAIBkAAOQFACCHAwAA4wUAMIgDAAAWABCJAwAA4wUAMJgDAQAAAAGbA0AA5gQAIaQDAQD-BAAhpQMBANoFACGmA0AA5gQAIakDIADlBAAhqgNAAP8EACHHAwEA_gQAIcgDIADlBAAhyQMgAOUEACH7AwAA4gUAIAIAAAAYACAkAACWBgAgAgAAAJQGACAkAACVBgAgDYcDAACTBgAwiAMAAJQGABCJAwAAkwYAMJgDAQD-BAAhmwNAAOYEACGkAwEA_gQAIaUDAQDaBQAhpgNAAOYEACGpAyAA5QQAIaoDQAD_BAAhxwMBAP4EACHIAyAA5QQAIckDIADlBAAhDYcDAACTBgAwiAMAAJQGABCJAwAAkwYAMJgDAQD-BAAhmwNAAOYEACGkAwEA_gQAIaUDAQDaBQAhpgNAAOYEACGpAyAA5QQAIaoDQAD_BAAhxwMBAP4EACHIAyAA5QQAIckDIADlBAAhCZgDAQDyBQAhmwNAAPQFACGkAwEA8gUAIaUDAQD_BQAhpgNAAPQFACGpAyAA8wUAIaoDQACBBgAhyAMgAPMFACHJAyAA8wUAIQsMAACXBgAgDQAAmAYAIJgDAQDyBQAhmwNAAPQFACGkAwEA8gUAIaUDAQD_BQAhpgNAAPQFACGpAyAA8wUAIaoDQACBBgAhyAMgAPMFACHJAyAA8wUAIQUrAAD4CQAgLAAAkwoAIP4DAAD5CQAg_wMAAJIKACCEBAAAEwAgBysAAJkGACAsAACcBgAg_gMAAJoGACD_AwAAmwYAIIIEAAANACCDBAAADQAghAQAAA8AIA4GAAD0BgAgDAAA-AYAIBcAAPcGACAbAAD1BgAgHAAA9gYAIJgDAQAAAAGbA0AAAAABoAMAAADWAwKjAwEAAAABpAMBAAAAAaYDQAAAAAHUAwEAAAAB1gMAAACwAwLXA0AAAAABAgAAAA8AICsAAJkGACADAAAADQAgKwAAmQYAICwAAJ0GACAQAAAADQAgBgAAoAYAIAwAAKQGACAXAACjBgAgGwAAoQYAIBwAAKIGACAkAACdBgAgmAMBAPIFACGbA0AA9AUAIaADAACeBtYDIqMDAQDyBQAhpAMBAP8FACGmA0AA9AUAIdQDAQDyBQAh1gMAAJ8GsAMi1wNAAPQFACEOBgAAoAYAIAwAAKQGACAXAACjBgAgGwAAoQYAIBwAAKIGACCYAwEA8gUAIZsDQAD0BQAhoAMAAJ4G1gMiowMBAPIFACGkAwEA_wUAIaYDQAD0BQAh1AMBAPIFACHWAwAAnwawAyLXA0AA9AUAIQGBBAAAANYDAgGBBAAAALADAgUrAAD8CQAgLAAAkAoAIP4DAAD9CQAg_wMAAI8KACCEBAAApAIAIAcrAADuBgAgLAAA8QYAIP4DAADvBgAg_wMAAPAGACCCBAAAPwAggwQAAD8AIIQEAADdAwAgBysAAOkGACAsAADsBgAg_gMAAOoGACD_AwAA6wYAIIIEAAAbACCDBAAAGwAghAQAAB0AIAsrAAClBgAwLAAAqgYAMP4DAACmBgAw_wMAAKcGADCABAAAqAYAIIEEAACpBgAwggQAAKkGADCDBAAAqQYAMIQEAACpBgAwhQQAAKsGADCGBAAArAYAMAcrAAD6CQAgLAAAjQoAIP4DAAD7CQAg_wMAAIwKACCCBAAAEQAggwQAABEAIIQEAAATACAJBgAA5QYAIAwAAOYGACATAADnBgAgFgAA6AYAIJgDAQAAAAGbA0AAAAABowMBAAAAAaQDAQAAAAGmA0AAAAABAgAAACQAICsAAOQGACADAAAAJAAgKwAA5AYAICwAAK8GACABJAAAiwoAMA4GAADcBQAgDAAAoQUAIA0AANsFACATAADdBQAgFgAA3gUAIIcDAADZBQAwiAMAACIAEIkDAADZBQAwmAMBAAAAAZsDQADmBAAhowMBAP4EACGkAwEA_gQAIaUDAQDaBQAhpgNAAOYEACECAAAAJAAgJAAArwYAIAIAAACtBgAgJAAArgYAIAmHAwAArAYAMIgDAACtBgAQiQMAAKwGADCYAwEA5AQAIZsDQADmBAAhowMBAP4EACGkAwEA_gQAIaUDAQDaBQAhpgNAAOYEACEJhwMAAKwGADCIAwAArQYAEIkDAACsBgAwmAMBAOQEACGbA0AA5gQAIaMDAQD-BAAhpAMBAP4EACGlAwEA2gUAIaYDQADmBAAhBZgDAQDyBQAhmwNAAPQFACGjAwEA8gUAIaQDAQDyBQAhpgNAAPQFACEJBgAAsAYAIAwAALEGACATAACyBgAgFgAAswYAIJgDAQDyBQAhmwNAAPQFACGjAwEA8gUAIaQDAQDyBQAhpgNAAPQFACEFKwAAgAoAICwAAIkKACD-AwAAgQoAIP8DAACICgAghAQAAKQCACAFKwAA_gkAICwAAIYKACD-AwAA_wkAIP8DAACFCgAghAQAABMAIAsrAADQBgAwLAAA1QYAMP4DAADRBgAw_wMAANIGADCABAAA0wYAIIEEAADUBgAwggQAANQGADCDBAAA1AYAMIQEAADUBgAwhQQAANYGADCGBAAA1wYAMAsrAAC0BgAwLAAAuQYAMP4DAAC1BgAw_wMAALYGADCABAAAtwYAIIEEAAC4BgAwggQAALgGADCDBAAAuAYAMIQEAAC4BgAwhQQAALoGADCGBAAAuwYAMAYVAADPBgAgmAMBAAAAAaADAAAA3wMCpgNAAAAAAd8DQAAAAAHgA0AAAAABAgAAAC8AICsAAM4GACADAAAALwAgKwAAzgYAICwAAL8GACABJAAAhAoAMAsQAADUBQAgFQAA1QUAIIcDAADSBQAwiAMAAC0AEIkDAADSBQAwmAMBAAAAAZkDAQDkBAAhoAMAANMF3wMipgNAAOYEACHfA0AA_wQAIeADQAD_BAAhAgAAAC8AICQAAL8GACACAAAAvAYAICQAAL0GACAJhwMAALsGADCIAwAAvAYAEIkDAAC7BgAwmAMBAOQEACGZAwEA5AQAIaADAADTBd8DIqYDQADmBAAh3wNAAP8EACHgA0AA_wQAIQmHAwAAuwYAMIgDAAC8BgAQiQMAALsGADCYAwEA5AQAIZkDAQDkBAAhoAMAANMF3wMipgNAAOYEACHfA0AA_wQAIeADQAD_BAAhBZgDAQDyBQAhoAMAAL4G3wMipgNAAPQFACHfA0AAgQYAIeADQACBBgAhAYEEAAAA3wMCBhUAAMAGACCYAwEA8gUAIaADAAC-Bt8DIqYDQAD0BQAh3wNAAIEGACHgA0AAgQYAIQsrAADBBgAwLAAAxgYAMP4DAADCBgAw_wMAAMMGADCABAAAxAYAIIEEAADFBgAwggQAAMUGADCDBAAAxQYAMIQEAADFBgAwhQQAAMcGADCGBAAAyAYAMAWKAwEAAAABmAMBAAAAAdsDAAAAvQMC3ANAAAAAAd0DQAAAAAECAAAAMwAgKwAAzQYAIAMAAAAzACArAADNBgAgLAAAzAYAIAEkAACDCgAwChQAANEFACCHAwAAzwUAMIgDAAAxABCJAwAAzwUAMIoDAQDkBAAhmAMBAAAAAdoDAQDkBAAh2wMAANAFvQMi3ANAAP8EACHdA0AA_wQAIQIAAAAzACAkAADMBgAgAgAAAMkGACAkAADKBgAgCYcDAADIBgAwiAMAAMkGABCJAwAAyAYAMIoDAQDkBAAhmAMBAOQEACHaAwEA5AQAIdsDAADQBb0DItwDQAD_BAAh3QNAAP8EACEJhwMAAMgGADCIAwAAyQYAEIkDAADIBgAwigMBAOQEACGYAwEA5AQAIdoDAQDkBAAh2wMAANAFvQMi3ANAAP8EACHdA0AA_wQAIQWKAwEA8gUAIZgDAQDyBQAh2wMAAMsGvQMi3ANAAIEGACHdA0AAgQYAIQGBBAAAAL0DAgWKAwEA8gUAIZgDAQDyBQAh2wMAAMsGvQMi3ANAAIEGACHdA0AAgQYAIQWKAwEAAAABmAMBAAAAAdsDAAAAvQMC3ANAAAAAAd0DQAAAAAEGFQAAzwYAIJgDAQAAAAGgAwAAAN8DAqYDQAAAAAHfA0AAAAAB4ANAAAAAAQQrAADBBgAw_gMAAMIGADCABAAAxAYAIIQEAADFBgAwBxIAAOMGACCYAwEAAAABpgNAAAAAAbkDAAAAvwMCuwMBAAAAAb0DAAAAvQMCvwMBAAAAAQIAAAApACArAADiBgAgAwAAACkAICsAAOIGACAsAADbBgAgASQAAIIKADAMEAAA1AUAIBIAANgFACCHAwAA1gUAMIgDAAAnABCJAwAA1gUAMJgDAQAAAAGZAwEA5AQAIaYDQADmBAAhuQMAANcFvwMiuwMBAOQEACG9AwAA0AW9AyK_AwEAmQUAIQIAAAApACAkAADbBgAgAgAAANgGACAkAADZBgAgCocDAADXBgAwiAMAANgGABCJAwAA1wYAMJgDAQDkBAAhmQMBAOQEACGmA0AA5gQAIbkDAADXBb8DIrsDAQDkBAAhvQMAANAFvQMivwMBAJkFACEKhwMAANcGADCIAwAA2AYAEIkDAADXBgAwmAMBAOQEACGZAwEA5AQAIaYDQADmBAAhuQMAANcFvwMiuwMBAOQEACG9AwAA0AW9AyK_AwEAmQUAIQaYAwEA8gUAIaYDQAD0BQAhuQMAANoGvwMiuwMBAPIFACG9AwAAywa9AyK_AwEA_wUAIQGBBAAAAL8DAgcSAADcBgAgmAMBAPIFACGmA0AA9AUAIbkDAADaBr8DIrsDAQDyBQAhvQMAAMsGvQMivwMBAP8FACEHKwAA3QYAICwAAOAGACD-AwAA3gYAIP8DAADfBgAgggQAACsAIIMEAAArACCEBAAAagAgBpgDAQAAAAGmA0AAAAAB9gMBAAAAAfcDAQAAAAH4AwEAAAAB-QMCAAAAAQIAAABqACArAADdBgAgAwAAACsAICsAAN0GACAsAADhBgAgCAAAACsAICQAAOEGACCYAwEA8gUAIaYDQAD0BQAh9gMBAPIFACH3AwEA8gUAIfgDAQDyBQAh-QMCAP4FACEGmAMBAPIFACGmA0AA9AUAIfYDAQDyBQAh9wMBAPIFACH4AwEA8gUAIfkDAgD-BQAhBxIAAOMGACCYAwEAAAABpgNAAAAAAbkDAAAAvwMCuwMBAAAAAb0DAAAAvQMCvwMBAAAAAQMrAADdBgAg_gMAAN4GACCEBAAAagAgCQYAAOUGACAMAADmBgAgEwAA5wYAIBYAAOgGACCYAwEAAAABmwNAAAAAAaMDAQAAAAGkAwEAAAABpgNAAAAAAQMrAACACgAg_gMAAIEKACCEBAAApAIAIAMrAAD-CQAg_gMAAP8JACCEBAAAEwAgBCsAANAGADD-AwAA0QYAMIAEAADTBgAghAQAANQGADAEKwAAtAYAMP4DAAC1BgAwgAQAALcGACCEBAAAuAYAMAwGAACFBgAgDAAAhgYAIJgDAQAAAAGbA0AAAAABnQMCAAAAAZ4DAQAAAAGgAwAAAKADAqEDAQAAAAGiA0AAAAABowMBAAAAAaQDAQAAAAGmA0AAAAABAgAAAB0AICsAAOkGACADAAAAGwAgKwAA6QYAICwAAO0GACAOAAAAGwAgBgAAggYAIAwAAIMGACAkAADtBgAgmAMBAPIFACGbA0AA9AUAIZ0DAgD-BQAhngMBAP8FACGgAwAAgAagAyKhAwEA_wUAIaIDQACBBgAhowMBAPIFACGkAwEA8gUAIaYDQAD0BQAhDAYAAIIGACAMAACDBgAgmAMBAPIFACGbA0AA9AUAIZ0DAgD-BQAhngMBAP8FACGgAwAAgAagAyKhAwEA_wUAIaIDQACBBgAhowMBAPIFACGkAwEA8gUAIaYDQAD0BQAhCJgDAQAAAAGbA0AAAAABoAMAAACwAwKmA0AAAAABrgMIAAAAAbADAQAAAAGxAwEAAAABsgOAAAAAAQIAAADdAwAgKwAA7gYAIAMAAAA_ACArAADuBgAgLAAA8gYAIAoAAAA_ACAkAADyBgAgmAMBAPIFACGbA0AA9AUAIaADAACfBrADIqYDQAD0BQAhrgMIAPMGACGwAwEA8gUAIbEDAQD_BQAhsgOAAAAAAQiYAwEA8gUAIZsDQAD0BQAhoAMAAJ8GsAMipgNAAPQFACGuAwgA8wYAIbADAQDyBQAhsQMBAP8FACGyA4AAAAABBYEECAAAAAGHBAgAAAABiAQIAAAAAYkECAAAAAGKBAgAAAABAysAAPwJACD-AwAA_QkAIIQEAACkAgAgAysAAO4GACD-AwAA7wYAIIQEAADdAwAgAysAAOkGACD-AwAA6gYAIIQEAAAdACAEKwAApQYAMP4DAACmBgAwgAQAAKgGACCEBAAAqQYAMAMrAAD6CQAg_gMAAPsJACCEBAAAEwAgCwwAAPoGACANAAD7BgAgmAMBAAAAAZsDQAAAAAGkAwEAAAABpQMBAAAAAaYDQAAAAAGpAyAAAAABqgNAAAAAAcgDIAAAAAHJAyAAAAABAysAAPgJACD-AwAA-QkAIIQEAAATACADKwAAmQYAIP4DAACaBgAghAQAAA8AIAQrAACMBgAw_gMAAI0GADCABAAAjwYAIIQEAACQBgAwAAAAAAAABSsAAPMJACAsAAD2CQAg_gMAAPQJACD_AwAA9QkAIIQEAAAPACADKwAA8wkAIP4DAAD0CQAghAQAAA8AIAcGAACBCQAgDAAA6QcAIBcAAKAIACAaAACaCQAgGwAAmwkAIBwAAJwJACCkAwAA-AUAIAAAAAUrAADuCQAgLAAA8QkAIP4DAADvCQAg_wMAAPAJACCEBAAAggEAIAMrAADuCQAg_gMAAO8JACCEBAAAggEAIAAAAAUrAADpCQAgLAAA7AkAIP4DAADqCQAg_wMAAOsJACCEBAAAJAAgAysAAOkJACD-AwAA6gkAIIQEAAAkACAAAAALKwAAlAcAMCwAAJkHADD-AwAAlQcAMP8DAACWBwAwgAQAAJcHACCBBAAAmAcAMIIEAACYBwAwgwQAAJgHADCEBAAAmAcAMIUEAACaBwAwhgQAAJsHADAVAwAA3AcAIAoAAN0HACALAADeBwAgDgAA3wcAIA8AAOAHACAXAADhBwAgigMBAAAAAZgDAQAAAAGbA0AAAAABpgNAAAAAAakDIAAAAAGqA0AAAAABygMBAAAAAcsDAQAAAAHMAwEAAAABzQMBAAAAAc4DAQAAAAHPAwEAAAAB0AMCAAAAAdEDAgAAAAHSAyAAAAABAgAAABMAICsAANsHACADAAAAEwAgKwAA2wcAICwAAJ4HACABJAAA6AkAMBoDAACqBQAgCQAA5gUAIAoAAIAFACALAACrBQAgDgAArAUAIA8AAOcFACAXAACtBQAghwMAAOUFADCIAwAAEQAQiQMAAOUFADCKAwEAAAABmAMBAAAAAZsDQADmBAAhpgNAAOYEACGpAyAA5QQAIaoDQAD_BAAhygMBAOQEACHLAwEAAAABzAMBAJkFACHNAwEAmQUAIc4DAQCZBQAhzwMBAJkFACHQAwIAygUAIdEDAgDKBQAh0gMgAOUEACHTAwEA_gQAIQIAAAATACAkAACeBwAgAgAAAJwHACAkAACdBwAgE4cDAACbBwAwiAMAAJwHABCJAwAAmwcAMIoDAQDkBAAhmAMBAP4EACGbA0AA5gQAIaYDQADmBAAhqQMgAOUEACGqA0AA_wQAIcoDAQDkBAAhywMBAOQEACHMAwEAmQUAIc0DAQCZBQAhzgMBAJkFACHPAwEAmQUAIdADAgDKBQAh0QMCAMoFACHSAyAA5QQAIdMDAQD-BAAhE4cDAACbBwAwiAMAAJwHABCJAwAAmwcAMIoDAQDkBAAhmAMBAP4EACGbA0AA5gQAIaYDQADmBAAhqQMgAOUEACGqA0AA_wQAIcoDAQDkBAAhywMBAOQEACHMAwEAmQUAIc0DAQCZBQAhzgMBAJkFACHPAwEAmQUAIdADAgDKBQAh0QMCAMoFACHSAyAA5QQAIdMDAQD-BAAhD4oDAQDyBQAhmAMBAPIFACGbA0AA9AUAIaYDQAD0BQAhqQMgAPMFACGqA0AAgQYAIcoDAQDyBQAhywMBAPIFACHMAwEA_wUAIc0DAQD_BQAhzgMBAP8FACHPAwEA_wUAIdADAgD-BQAh0QMCAP4FACHSAyAA8wUAIRUDAACfBwAgCgAAoAcAIAsAAKEHACAOAACiBwAgDwAAowcAIBcAAKQHACCKAwEA8gUAIZgDAQDyBQAhmwNAAPQFACGmA0AA9AUAIakDIADzBQAhqgNAAIEGACHKAwEA8gUAIcsDAQDyBQAhzAMBAP8FACHNAwEA_wUAIc4DAQD_BQAhzwMBAP8FACHQAwIA_gUAIdEDAgD-BQAh0gMgAPMFACEFKwAA0AkAICwAAOYJACD-AwAA0QkAIP8DAADlCQAghAQAAIIBACALKwAA0AcAMCwAANQHADD-AwAA0QcAMP8DAADSBwAwgAQAANMHACCBBAAAkAYAMIIEAACQBgAwgwQAAJAGADCEBAAAkAYAMIUEAADVBwAwhgQAAJMGADALKwAAwgcAMCwAAMcHADD-AwAAwwcAMP8DAADEBwAwgAQAAMUHACCBBAAAxgcAMIIEAADGBwAwgwQAAMYHADCEBAAAxgcAMIUEAADIBwAwhgQAAMkHADALKwAAtgcAMCwAALsHADD-AwAAtwcAMP8DAAC4BwAwgAQAALkHACCBBAAAugcAMIIEAAC6BwAwgwQAALoHADCEBAAAugcAMIUEAAC8BwAwhgQAAL0HADAHKwAAsAcAICwAALMHACD-AwAAsQcAIP8DAACyBwAgggQAACAAIIMEAAAgACCEBAAAgAMAIAsrAAClBwAwLAAAqQcAMP4DAACmBwAw_wMAAKcHADCABAAAqAcAIIEEAACpBgAwggQAAKkGADCDBAAAqQYAMIQEAACpBgAwhQQAAKoHADCGBAAArAYAMAkGAADlBgAgDQAArwcAIBMAAOcGACAWAADoBgAgmAMBAAAAAZsDQAAAAAGjAwEAAAABpQMBAAAAAaYDQAAAAAECAAAAJAAgKwAArgcAIAMAAAAkACArAACuBwAgLAAArAcAIAEkAADkCQAwAgAAACQAICQAAKwHACACAAAArQYAICQAAKsHACAFmAMBAPIFACGbA0AA9AUAIaMDAQDyBQAhpQMBAP8FACGmA0AA9AUAIQkGAACwBgAgDQAArQcAIBMAALIGACAWAACzBgAgmAMBAPIFACGbA0AA9AUAIaMDAQDyBQAhpQMBAP8FACGmA0AA9AUAIQcrAADfCQAgLAAA4gkAIP4DAADgCQAg_wMAAOEJACCCBAAADQAggwQAAA0AIIQEAAAPACAJBgAA5QYAIA0AAK8HACATAADnBgAgFgAA6AYAIJgDAQAAAAGbA0AAAAABowMBAAAAAaUDAQAAAAGmA0AAAAABAysAAN8JACD-AwAA4AkAIIQEAAAPACAHmAMBAAAAAZsDQAAAAAGgAwAAAMQDAqYDQAAAAAHEAwEAAAABxQMBAAAAAcYDQAAAAAECAAAAgAMAICsAALAHACADAAAAIAAgKwAAsAcAICwAALQHACAJAAAAIAAgJAAAtAcAIJgDAQDyBQAhmwNAAPQFACGgAwAAtQfEAyKmA0AA9AUAIcQDAQD_BQAhxQMBAP8FACHGA0AAgQYAIQeYAwEA8gUAIZsDQAD0BQAhoAMAALUHxAMipgNAAPQFACHEAwEA_wUAIcUDAQD_BQAhxgNAAIEGACEBgQQAAADEAwIMBgAAhQYAIA0AAIcGACCYAwEAAAABmwNAAAAAAZ0DAgAAAAGeAwEAAAABoAMAAACgAwKhAwEAAAABogNAAAAAAaMDAQAAAAGlAwEAAAABpgNAAAAAAQIAAAAdACArAADBBwAgAwAAAB0AICsAAMEHACAsAADABwAgASQAAN4JADARBgAA3AUAIAwAAKEFACANAADbBQAghwMAAOAFADCIAwAAGwAQiQMAAOAFADCYAwEAAAABmwNAAOYEACGdAwIAygUAIZ4DAQCZBQAhoAMAAOEFoAMioQMBAJkFACGiA0AA_wQAIaMDAQD-BAAhpAMBAP4EACGlAwEAAAABpgNAAOYEACECAAAAHQAgJAAAwAcAIAIAAAC-BwAgJAAAvwcAIA6HAwAAvQcAMIgDAAC-BwAQiQMAAL0HADCYAwEA_gQAIZsDQADmBAAhnQMCAMoFACGeAwEAmQUAIaADAADhBaADIqEDAQCZBQAhogNAAP8EACGjAwEA_gQAIaQDAQD-BAAhpQMBANoFACGmA0AA5gQAIQ6HAwAAvQcAMIgDAAC-BwAQiQMAAL0HADCYAwEA_gQAIZsDQADmBAAhnQMCAMoFACGeAwEAmQUAIaADAADhBaADIqEDAQCZBQAhogNAAP8EACGjAwEA_gQAIaQDAQD-BAAhpQMBANoFACGmA0AA5gQAIQqYAwEA8gUAIZsDQAD0BQAhnQMCAP4FACGeAwEA_wUAIaADAACABqADIqEDAQD_BQAhogNAAIEGACGjAwEA8gUAIaUDAQD_BQAhpgNAAPQFACEMBgAAggYAIA0AAIQGACCYAwEA8gUAIZsDQAD0BQAhnQMCAP4FACGeAwEA_wUAIaADAACABqADIqEDAQD_BQAhogNAAIEGACGjAwEA8gUAIaUDAQD_BQAhpgNAAPQFACEMBgAAhQYAIA0AAIcGACCYAwEAAAABmwNAAAAAAZ0DAgAAAAGeAwEAAAABoAMAAACgAwKhAwEAAAABogNAAAAAAaMDAQAAAAGlAwEAAAABpgNAAAAAAQ4GAAD0BgAgFwAA9wYAIBoAAM8HACAbAAD1BgAgHAAA9gYAIJgDAQAAAAGbA0AAAAABoAMAAADWAwKjAwEAAAABpgNAAAAAAdQDAQAAAAHWAwAAALADAtcDQAAAAAHYAwEAAAABAgAAAA8AICsAAM4HACADAAAADwAgKwAAzgcAICwAAMwHACABJAAA3QkAMBMGAADcBQAgDAAAxQUAIBcAAK0FACAaAADqBQAgGwAA6wUAIBwAAOwFACCHAwAA6AUAMIgDAAANABCJAwAA6AUAMJgDAQAAAAGbA0AA5gQAIaADAADpBdYDIqMDAQD-BAAhpAMBANoFACGmA0AA5gQAIdQDAQAAAAHWAwAAjAWwAyLXA0AA5gQAIdgDAQAAAAECAAAADwAgJAAAzAcAIAIAAADKBwAgJAAAywcAIA2HAwAAyQcAMIgDAADKBwAQiQMAAMkHADCYAwEA_gQAIZsDQADmBAAhoAMAAOkF1gMiowMBAP4EACGkAwEA2gUAIaYDQADmBAAh1AMBAP4EACHWAwAAjAWwAyLXA0AA5gQAIdgDAQD-BAAhDYcDAADJBwAwiAMAAMoHABCJAwAAyQcAMJgDAQD-BAAhmwNAAOYEACGgAwAA6QXWAyKjAwEA_gQAIaQDAQDaBQAhpgNAAOYEACHUAwEA_gQAIdYDAACMBbADItcDQADmBAAh2AMBAP4EACEJmAMBAPIFACGbA0AA9AUAIaADAACeBtYDIqMDAQDyBQAhpgNAAPQFACHUAwEA8gUAIdYDAACfBrADItcDQAD0BQAh2AMBAPIFACEOBgAAoAYAIBcAAKMGACAaAADNBwAgGwAAoQYAIBwAAKIGACCYAwEA8gUAIZsDQAD0BQAhoAMAAJ4G1gMiowMBAPIFACGmA0AA9AUAIdQDAQDyBQAh1gMAAJ8GsAMi1wNAAPQFACHYAwEA8gUAIQUrAADYCQAgLAAA2wkAIP4DAADZCQAg_wMAANoJACCEBAAAGAAgDgYAAPQGACAXAAD3BgAgGgAAzwcAIBsAAPUGACAcAAD2BgAgmAMBAAAAAZsDQAAAAAGgAwAAANYDAqMDAQAAAAGmA0AAAAAB1AMBAAAAAdYDAAAAsAMC1wNAAAAAAdgDAQAAAAEDKwAA2AkAIP4DAADZCQAghAQAABgAIAsNAAD7BgAgGQAA2gcAIJgDAQAAAAGbA0AAAAABpQMBAAAAAaYDQAAAAAGpAyAAAAABqgNAAAAAAccDAQAAAAHIAyAAAAAByQMgAAAAAQIAAAAYACArAADZBwAgAwAAABgAICsAANkHACAsAADXBwAgASQAANcJADACAAAAGAAgJAAA1wcAIAIAAACUBgAgJAAA1gcAIAmYAwEA8gUAIZsDQAD0BQAhpQMBAP8FACGmA0AA9AUAIakDIADzBQAhqgNAAIEGACHHAwEA8gUAIcgDIADzBQAhyQMgAPMFACELDQAAmAYAIBkAANgHACCYAwEA8gUAIZsDQAD0BQAhpQMBAP8FACGmA0AA9AUAIakDIADzBQAhqgNAAIEGACHHAwEA8gUAIcgDIADzBQAhyQMgAPMFACEFKwAA0gkAICwAANUJACD-AwAA0wkAIP8DAADUCQAghAQAAPUDACALDQAA-wYAIBkAANoHACCYAwEAAAABmwNAAAAAAaUDAQAAAAGmA0AAAAABqQMgAAAAAaoDQAAAAAHHAwEAAAAByAMgAAAAAckDIAAAAAEDKwAA0gkAIP4DAADTCQAghAQAAPUDACAVAwAA3AcAIAoAAN0HACALAADeBwAgDgAA3wcAIA8AAOAHACAXAADhBwAgigMBAAAAAZgDAQAAAAGbA0AAAAABpgNAAAAAAakDIAAAAAGqA0AAAAABygMBAAAAAcsDAQAAAAHMAwEAAAABzQMBAAAAAc4DAQAAAAHPAwEAAAAB0AMCAAAAAdEDAgAAAAHSAyAAAAABAysAANAJACD-AwAA0QkAIIQEAACCAQAgBCsAANAHADD-AwAA0QcAMIAEAADTBwAghAQAAJAGADAEKwAAwgcAMP4DAADDBwAwgAQAAMUHACCEBAAAxgcAMAQrAAC2BwAw_gMAALcHADCABAAAuQcAIIQEAAC6BwAwAysAALAHACD-AwAAsQcAIIQEAACAAwAgBCsAAKUHADD-AwAApgcAMIAEAACoBwAghAQAAKkGADAEKwAAlAcAMP4DAACVBwAwgAQAAJcHACCEBAAAmAcAMAAAAAAFKwAAywkAICwAAM4JACD-AwAAzAkAIP8DAADNCQAghAQAABMAIAMrAADLCQAg_gMAAMwJACCEBAAAEwAgDAMAAJ0IACAJAACYCQAgCgAA_QYAIAsAAJ4IACAOAACfCAAgDwAAmQkAIBcAAKAIACCqAwAA-AUAIMwDAAD4BQAgzQMAAPgFACDOAwAA-AUAIM8DAAD4BQAgAAAAAAAAAAAFKwAAxgkAICwAAMkJACD-AwAAxwkAIP8DAADICQAghAQAAJgDACADKwAAxgkAIP4DAADHCQAghAQAAJgDACAAAAAAAAAFKwAAvgkAICwAAMQJACD-AwAAvwkAIP8DAADDCQAghAQAAIIBACALKwAAkAgAMCwAAJQIADD-AwAAkQgAMP8DAACSCAAwgAQAAJMIACCBBAAAxgcAMIIEAADGBwAwgwQAAMYHADCEBAAAxgcAMIUEAACVCAAwhgQAAMkHADALKwAAhwgAMCwAAIsIADD-AwAAiAgAMP8DAACJCAAwgAQAAIoIACCBBAAAugcAMIIEAAC6BwAwgwQAALoHADCEBAAAugcAMIUEAACMCAAwhgQAAL0HADALKwAA_gcAMCwAAIIIADD-AwAA_wcAMP8DAACACAAwgAQAAIEIACCBBAAAqQYAMIIEAACpBgAwgwQAAKkGADCEBAAAqQYAMIUEAACDCAAwhgQAAKwGADAJDAAA5gYAIA0AAK8HACATAADnBgAgFgAA6AYAIJgDAQAAAAGbA0AAAAABpAMBAAAAAaUDAQAAAAGmA0AAAAABAgAAACQAICsAAIYIACADAAAAJAAgKwAAhggAICwAAIUIACABJAAAwgkAMAIAAAAkACAkAACFCAAgAgAAAK0GACAkAACECAAgBZgDAQDyBQAhmwNAAPQFACGkAwEA8gUAIaUDAQD_BQAhpgNAAPQFACEJDAAAsQYAIA0AAK0HACATAACyBgAgFgAAswYAIJgDAQDyBQAhmwNAAPQFACGkAwEA8gUAIaUDAQD_BQAhpgNAAPQFACEJDAAA5gYAIA0AAK8HACATAADnBgAgFgAA6AYAIJgDAQAAAAGbA0AAAAABpAMBAAAAAaUDAQAAAAGmA0AAAAABDAwAAIYGACANAACHBgAgmAMBAAAAAZsDQAAAAAGdAwIAAAABngMBAAAAAaADAAAAoAMCoQMBAAAAAaIDQAAAAAGkAwEAAAABpQMBAAAAAaYDQAAAAAECAAAAHQAgKwAAjwgAIAMAAAAdACArAACPCAAgLAAAjggAIAEkAADBCQAwAgAAAB0AICQAAI4IACACAAAAvgcAICQAAI0IACAKmAMBAPIFACGbA0AA9AUAIZ0DAgD-BQAhngMBAP8FACGgAwAAgAagAyKhAwEA_wUAIaIDQACBBgAhpAMBAPIFACGlAwEA_wUAIaYDQAD0BQAhDAwAAIMGACANAACEBgAgmAMBAPIFACGbA0AA9AUAIZ0DAgD-BQAhngMBAP8FACGgAwAAgAagAyKhAwEA_wUAIaIDQACBBgAhpAMBAPIFACGlAwEA_wUAIaYDQAD0BQAhDAwAAIYGACANAACHBgAgmAMBAAAAAZsDQAAAAAGdAwIAAAABngMBAAAAAaADAAAAoAMCoQMBAAAAAaIDQAAAAAGkAwEAAAABpQMBAAAAAaYDQAAAAAEODAAA-AYAIBcAAPcGACAaAADPBwAgGwAA9QYAIBwAAPYGACCYAwEAAAABmwNAAAAAAaADAAAA1gMCpAMBAAAAAaYDQAAAAAHUAwEAAAAB1gMAAACwAwLXA0AAAAAB2AMBAAAAAQIAAAAPACArAACYCAAgAwAAAA8AICsAAJgIACAsAACXCAAgASQAAMAJADACAAAADwAgJAAAlwgAIAIAAADKBwAgJAAAlggAIAmYAwEA8gUAIZsDQAD0BQAhoAMAAJ4G1gMipAMBAP8FACGmA0AA9AUAIdQDAQDyBQAh1gMAAJ8GsAMi1wNAAPQFACHYAwEA8gUAIQ4MAACkBgAgFwAAowYAIBoAAM0HACAbAAChBgAgHAAAogYAIJgDAQDyBQAhmwNAAPQFACGgAwAAngbWAyKkAwEA_wUAIaYDQAD0BQAh1AMBAPIFACHWAwAAnwawAyLXA0AA9AUAIdgDAQDyBQAhDgwAAPgGACAXAAD3BgAgGgAAzwcAIBsAAPUGACAcAAD2BgAgmAMBAAAAAZsDQAAAAAGgAwAAANYDAqQDAQAAAAGmA0AAAAAB1AMBAAAAAdYDAAAAsAMC1wNAAAAAAdgDAQAAAAEDKwAAvgkAIP4DAAC_CQAghAQAAIIBACAEKwAAkAgAMP4DAACRCAAwgAQAAJMIACCEBAAAxgcAMAQrAACHCAAw_gMAAIgIADCABAAAiggAIIQEAAC6BwAwBCsAAP4HADD-AwAA_wcAMIAEAACBCAAghAQAAKkGADAIBAAA_wgAIAUAAIAJACAGAACBCQAgDAAA6QcAIB0AAIIJACAeAACDCQAgqgMAAPgFACD0AwAA-AUAIAAAAAAAAAAAAAUrAAC5CQAgLAAAvAkAIP4DAAC6CQAg_wMAALsJACCEBAAALwAgAysAALkJACD-AwAAugkAIIQEAAAvACAAAAAFKwAAtAkAICwAALcJACD-AwAAtQkAIP8DAAC2CQAghAQAACQAIAMrAAC0CQAg_gMAALUJACCEBAAAJAAgAAAAAAAABSsAAK8JACAsAACyCQAg_gMAALAJACD_AwAAsQkAIIQEAACCAQAgAysAAK8JACD-AwAAsAkAIIQEAACCAQAgAAAABSsAAKoJACAsAACtCQAg_gMAAKsJACD_AwAArAkAIIQEAACCAQAgAysAAKoJACD-AwAAqwkAIIQEAACCAQAgAAAAAYEEAAAA8gMCAYEEAAAA8wMCCysAAO0IADAsAADyCAAw_gMAAO4IADD_AwAA7wgAMIAEAADwCAAggQQAAPEIADCCBAAA8QgAMIMEAADxCAAwhAQAAPEIADCFBAAA8wgAMIYEAAD0CAAwCysAAOEIADAsAADmCAAw_gMAAOIIADD_AwAA4wgAMIAEAADkCAAggQQAAOUIADCCBAAA5QgAMIMEAADlCAAwhAQAAOUIADCFBAAA5wgAMIYEAADoCAAwBysAANwIACAsAADfCAAg_gMAAN0IACD_AwAA3ggAIIIEAAALACCDBAAACwAghAQAAKQCACAHKwAA1wgAICwAANoIACD-AwAA2AgAIP8DAADZCAAgggQAABEAIIMEAAARACCEBAAAEwAgBysAANIIACAsAADVCAAg_gMAANMIACD_AwAA1AgAIIIEAABLACCDBAAASwAghAQAAAEAIAsrAADGCAAwLAAAywgAMP4DAADHCAAw_wMAAMgIADCABAAAyQgAIIEEAADKCAAwggQAAMoIADCDBAAAyggAMIQEAADKCAAwhQQAAMwIADCGBAAAzQgAMAURAQAAAAGYAwEAAAABpgNAAAAAAbkDAQAAAAG6AyAAAAABAgAAAE8AICsAANEIACADAAAATwAgKwAA0QgAICwAANAIACABJAAAqQkAMAoDAACqBQAgEQEA5AQAIYcDAADNBQAwiAMAAE0AEIkDAADNBQAwigMBAOQEACGYAwEAAAABpgNAAOYEACG5AwEA5AQAIboDIADlBAAhAgAAAE8AICQAANAIACACAAAAzggAICQAAM8IACAJEQEA5AQAIYcDAADNCAAwiAMAAM4IABCJAwAAzQgAMIoDAQDkBAAhmAMBAOQEACGmA0AA5gQAIbkDAQDkBAAhugMgAOUEACEJEQEA5AQAIYcDAADNCAAwiAMAAM4IABCJAwAAzQgAMIoDAQDkBAAhmAMBAOQEACGmA0AA5gQAIbkDAQDkBAAhugMgAOUEACEFEQEA8gUAIZgDAQDyBQAhpgNAAPQFACG5AwEA8gUAIboDIADzBQAhBREBAPIFACGYAwEA8gUAIaYDQAD0BQAhuQMBAPIFACG6AyAA8wUAIQURAQAAAAGYAwEAAAABpgNAAAAAAbkDAQAAAAG6AyAAAAABCZgDAQAAAAGbA0AAAAABpgNAAAAAAakDIAAAAAGqA0AAAAABwAMBAAAAAcsDAQAAAAHMAwEAAAAB-gMBAAAAAQIAAAABACArAADSCAAgAwAAAEsAICsAANIIACAsAADWCAAgCwAAAEsAICQAANYIACCYAwEA8gUAIZsDQAD0BQAhpgNAAPQFACGpAyAA8wUAIaoDQACBBgAhwAMBAPIFACHLAwEA8gUAIcwDAQD_BQAh-gMBAP8FACEJmAMBAPIFACGbA0AA9AUAIaYDQAD0BQAhqQMgAPMFACGqA0AAgQYAIcADAQDyBQAhywMBAPIFACHMAwEA_wUAIfoDAQD_BQAhFQkAAPMHACAKAADdBwAgCwAA3gcAIA4AAN8HACAPAADgBwAgFwAA4QcAIJgDAQAAAAGbA0AAAAABpgNAAAAAAakDIAAAAAGqA0AAAAABygMBAAAAAcsDAQAAAAHMAwEAAAABzQMBAAAAAc4DAQAAAAHPAwEAAAAB0AMCAAAAAdEDAgAAAAHSAyAAAAAB0wMBAAAAAQIAAAATACArAADXCAAgAwAAABEAICsAANcIACAsAADbCAAgFwAAABEAIAkAAPIHACAKAACgBwAgCwAAoQcAIA4AAKIHACAPAACjBwAgFwAApAcAICQAANsIACCYAwEA8gUAIZsDQAD0BQAhpgNAAPQFACGpAyAA8wUAIaoDQACBBgAhygMBAPIFACHLAwEA8gUAIcwDAQD_BQAhzQMBAP8FACHOAwEA_wUAIc8DAQD_BQAh0AMCAP4FACHRAwIA_gUAIdIDIADzBQAh0wMBAPIFACEVCQAA8gcAIAoAAKAHACALAAChBwAgDgAAogcAIA8AAKMHACAXAACkBwAgmAMBAPIFACGbA0AA9AUAIaYDQAD0BQAhqQMgAPMFACGqA0AAgQYAIcoDAQDyBQAhywMBAPIFACHMAwEA_wUAIc0DAQD_BQAhzgMBAP8FACHPAwEA_wUAIdADAgD-BQAh0QMCAP4FACHSAyAA8wUAIdMDAQDyBQAhDQsAAJoIACAOAACbCAAgFwAAnAgAIJgDAQAAAAGbA0AAAAABpgNAAAAAAakDIAAAAAGqA0AAAAABygMBAAAAAcsDAQAAAAHMAwEAAAABzQMBAAAAAdkDAQAAAAECAAAApAIAICsAANwIACADAAAACwAgKwAA3AgAICwAAOAIACAPAAAACwAgCwAA-wcAIA4AAPwHACAXAAD9BwAgJAAA4AgAIJgDAQDyBQAhmwNAAPQFACGmA0AA9AUAIakDIADzBQAhqgNAAIEGACHKAwEA8gUAIcsDAQDyBQAhzAMBAP8FACHNAwEA_wUAIdkDAQD_BQAhDQsAAPsHACAOAAD8BwAgFwAA_QcAIJgDAQDyBQAhmwNAAPQFACGmA0AA9AUAIakDIADzBQAhqgNAAIEGACHKAwEA8gUAIcsDAQDyBQAhzAMBAP8FACHNAwEA_wUAIdkDAQD_BQAhDJgDAQAAAAGbA0AAAAABpgNAAAAAAeQDAQAAAAHlAwEAAAAB5gMBAAAAAecDAQAAAAHoAwEAAAAB6QNAAAAAAeoDQAAAAAHrAwEAAAAB7AMBAAAAAQIAAAAJACArAADsCAAgAwAAAAkAICsAAOwIACAsAADrCAAgASQAAKgJADARAwAAqgUAIIcDAADtBQAwiAMAAAcAEIkDAADtBQAwigMBAOQEACGYAwEAAAABmwNAAOYEACGmA0AA5gQAIeQDAQDkBAAh5QMBAOQEACHmAwEAmQUAIecDAQCZBQAh6AMBAJkFACHpA0AA_wQAIeoDQAD_BAAh6wMBAJkFACHsAwEAmQUAIQIAAAAJACAkAADrCAAgAgAAAOkIACAkAADqCAAgEIcDAADoCAAwiAMAAOkIABCJAwAA6AgAMIoDAQDkBAAhmAMBAOQEACGbA0AA5gQAIaYDQADmBAAh5AMBAOQEACHlAwEA5AQAIeYDAQCZBQAh5wMBAJkFACHoAwEAmQUAIekDQAD_BAAh6gNAAP8EACHrAwEAmQUAIewDAQCZBQAhEIcDAADoCAAwiAMAAOkIABCJAwAA6AgAMIoDAQDkBAAhmAMBAOQEACGbA0AA5gQAIaYDQADmBAAh5AMBAOQEACHlAwEA5AQAIeYDAQCZBQAh5wMBAJkFACHoAwEAmQUAIekDQAD_BAAh6gNAAP8EACHrAwEAmQUAIewDAQCZBQAhDJgDAQDyBQAhmwNAAPQFACGmA0AA9AUAIeQDAQDyBQAh5QMBAPIFACHmAwEA_wUAIecDAQD_BQAh6AMBAP8FACHpA0AAgQYAIeoDQACBBgAh6wMBAP8FACHsAwEA_wUAIQyYAwEA8gUAIZsDQAD0BQAhpgNAAPQFACHkAwEA8gUAIeUDAQDyBQAh5gMBAP8FACHnAwEA_wUAIegDAQD_BQAh6QNAAIEGACHqA0AAgQYAIesDAQD_BQAh7AMBAP8FACEMmAMBAAAAAZsDQAAAAAGmA0AAAAAB5AMBAAAAAeUDAQAAAAHmAwEAAAAB5wMBAAAAAegDAQAAAAHpA0AAAAAB6gNAAAAAAesDAQAAAAHsAwEAAAABB5gDAQAAAAGbA0AAAAABpgNAAAAAAeMDQAAAAAHtAwEAAAAB7gMBAAAAAe8DAQAAAAECAAAABQAgKwAA-AgAIAMAAAAFACArAAD4CAAgLAAA9wgAIAEkAACnCQAwDAMAAKoFACCHAwAA7gUAMIgDAAADABCJAwAA7gUAMIoDAQDkBAAhmAMBAAAAAZsDQADmBAAhpgNAAOYEACHjA0AA5gQAIe0DAQAAAAHuAwEAmQUAIe8DAQCZBQAhAgAAAAUAICQAAPcIACACAAAA9QgAICQAAPYIACALhwMAAPQIADCIAwAA9QgAEIkDAAD0CAAwigMBAOQEACGYAwEA5AQAIZsDQADmBAAhpgNAAOYEACHjA0AA5gQAIe0DAQDkBAAh7gMBAJkFACHvAwEAmQUAIQuHAwAA9AgAMIgDAAD1CAAQiQMAAPQIADCKAwEA5AQAIZgDAQDkBAAhmwNAAOYEACGmA0AA5gQAIeMDQADmBAAh7QMBAOQEACHuAwEAmQUAIe8DAQCZBQAhB5gDAQDyBQAhmwNAAPQFACGmA0AA9AUAIeMDQAD0BQAh7QMBAPIFACHuAwEA_wUAIe8DAQD_BQAhB5gDAQDyBQAhmwNAAPQFACGmA0AA9AUAIeMDQAD0BQAh7QMBAPIFACHuAwEA_wUAIe8DAQD_BQAhB5gDAQAAAAGbA0AAAAABpgNAAAAAAeMDQAAAAAHtAwEAAAAB7gMBAAAAAe8DAQAAAAEEKwAA7QgAMP4DAADuCAAwgAQAAPAIACCEBAAA8QgAMAQrAADhCAAw_gMAAOIIADCABAAA5AgAIIQEAADlCAAwAysAANwIACD-AwAA3QgAIIQEAACkAgAgAysAANcIACD-AwAA2AgAIIQEAAATACADKwAA0ggAIP4DAADTCAAghAQAAAEAIAQrAADGCAAw_gMAAMcIADCABAAAyQgAIIQEAADKCAAwAAAIAwAAnQgAIAsAAJ4IACAOAACfCAAgFwAAoAgAIKoDAAD4BQAgzAMAAPgFACDNAwAA-AUAINkDAAD4BQAgBAMAAJ0IACCqAwAA-AUAIMwDAAD4BQAg-gMAAPgFACAAAAAAAAAFKwAAogkAICwAAKUJACD-AwAAowkAIP8DAACkCQAghAQAACkAIAMrAACiCQAg_gMAAKMJACCEBAAAKQAgAxAAAJIJACASAACUCQAgvwMAAPgFACAAAAAFKwAAnQkAICwAAKAJACD-AwAAngkAIP8DAACfCQAghAQAAIIBACADKwAAnQkAIP4DAACeCQAghAQAAIIBACAEEAAAkgkAIBUAAJMJACDfAwAA-AUAIOADAAD4BQAgBgYAAIEJACAMAADpBwAgDQAAhQcAIBMAAJUJACAWAACWCQAgpQMAAPgFACAAAREAAIsJACAAAAIYAAD9BgAgqgMAAPgFACAEBwAA4wcAIKoDAAD4BQAgwQMAAPgFACDCAwAA-AUAIAQMAADpBwAgxAMAAPgFACDFAwAA-AUAIMYDAAD4BQAgBQwAAOkHACANAACFBwAgGQAAlwkAIKUDAAD4BQAgqgMAAPgFACADDQAAhQcAILEDAAD4BQAgsgMAAPgFACAHBgAAgQkAIAwAAOkHACANAACFBwAgngMAAPgFACChAwAA-AUAIKIDAAD4BQAgpQMAAPgFACARBAAA-QgAIAUAAPoIACAGAAD7CAAgDAAA_AgAIB4AAP4IACCYAwEAAAABmwNAAAAAAaADAAAA8wMCpgNAAAAAAakDIAAAAAGqA0AAAAABwAMBAAAAAcsDAQAAAAHbAwAAAPIDAvADIAAAAAHzAyAAAAAB9AMBAAAAAQIAAACCAQAgKwAAnQkAIAMAAACFAQAgKwAAnQkAICwAAKEJACATAAAAhQEAIAQAAMAIACAFAADBCAAgBgAAwggAIAwAAMMIACAeAADFCAAgJAAAoQkAIJgDAQDyBQAhmwNAAPQFACGgAwAAvwjzAyKmA0AA9AUAIakDIADzBQAhqgNAAIEGACHAAwEA8gUAIcsDAQDyBQAh2wMAAL4I8gMi8AMgAPMFACHzAyAA8wUAIfQDAQD_BQAhEQQAAMAIACAFAADBCAAgBgAAwggAIAwAAMMIACAeAADFCAAgmAMBAPIFACGbA0AA9AUAIaADAAC_CPMDIqYDQAD0BQAhqQMgAPMFACGqA0AAgQYAIcADAQDyBQAhywMBAPIFACHbAwAAvgjyAyLwAyAA8wUAIfMDIADzBQAh9AMBAP8FACEIEAAAjwcAIJgDAQAAAAGZAwEAAAABpgNAAAAAAbkDAAAAvwMCuwMBAAAAAb0DAAAAvQMCvwMBAAAAAQIAAAApACArAACiCQAgAwAAACcAICsAAKIJACAsAACmCQAgCgAAACcAIBAAAI4HACAkAACmCQAgmAMBAPIFACGZAwEA8gUAIaYDQAD0BQAhuQMAANoGvwMiuwMBAPIFACG9AwAAywa9AyK_AwEA_wUAIQgQAACOBwAgmAMBAPIFACGZAwEA8gUAIaYDQAD0BQAhuQMAANoGvwMiuwMBAPIFACG9AwAAywa9AyK_AwEA_wUAIQeYAwEAAAABmwNAAAAAAaYDQAAAAAHjA0AAAAAB7QMBAAAAAe4DAQAAAAHvAwEAAAABDJgDAQAAAAGbA0AAAAABpgNAAAAAAeQDAQAAAAHlAwEAAAAB5gMBAAAAAecDAQAAAAHoAwEAAAAB6QNAAAAAAeoDQAAAAAHrAwEAAAAB7AMBAAAAAQURAQAAAAGYAwEAAAABpgNAAAAAAbkDAQAAAAG6AyAAAAABEQUAAPoIACAGAAD7CAAgDAAA_AgAIB0AAP0IACAeAAD-CAAgmAMBAAAAAZsDQAAAAAGgAwAAAPMDAqYDQAAAAAGpAyAAAAABqgNAAAAAAcADAQAAAAHLAwEAAAAB2wMAAADyAwLwAyAAAAAB8wMgAAAAAfQDAQAAAAECAAAAggEAICsAAKoJACADAAAAhQEAICsAAKoJACAsAACuCQAgEwAAAIUBACAFAADBCAAgBgAAwggAIAwAAMMIACAdAADECAAgHgAAxQgAICQAAK4JACCYAwEA8gUAIZsDQAD0BQAhoAMAAL8I8wMipgNAAPQFACGpAyAA8wUAIaoDQACBBgAhwAMBAPIFACHLAwEA8gUAIdsDAAC-CPIDIvADIADzBQAh8wMgAPMFACH0AwEA_wUAIREFAADBCAAgBgAAwggAIAwAAMMIACAdAADECAAgHgAAxQgAIJgDAQDyBQAhmwNAAPQFACGgAwAAvwjzAyKmA0AA9AUAIakDIADzBQAhqgNAAIEGACHAAwEA8gUAIcsDAQDyBQAh2wMAAL4I8gMi8AMgAPMFACHzAyAA8wUAIfQDAQD_BQAhEQQAAPkIACAGAAD7CAAgDAAA_AgAIB0AAP0IACAeAAD-CAAgmAMBAAAAAZsDQAAAAAGgAwAAAPMDAqYDQAAAAAGpAyAAAAABqgNAAAAAAcADAQAAAAHLAwEAAAAB2wMAAADyAwLwAyAAAAAB8wMgAAAAAfQDAQAAAAECAAAAggEAICsAAK8JACADAAAAhQEAICsAAK8JACAsAACzCQAgEwAAAIUBACAEAADACAAgBgAAwggAIAwAAMMIACAdAADECAAgHgAAxQgAICQAALMJACCYAwEA8gUAIZsDQAD0BQAhoAMAAL8I8wMipgNAAPQFACGpAyAA8wUAIaoDQACBBgAhwAMBAPIFACHLAwEA8gUAIdsDAAC-CPIDIvADIADzBQAh8wMgAPMFACH0AwEA_wUAIREEAADACAAgBgAAwggAIAwAAMMIACAdAADECAAgHgAAxQgAIJgDAQDyBQAhmwNAAPQFACGgAwAAvwjzAyKmA0AA9AUAIakDIADzBQAhqgNAAIEGACHAAwEA8gUAIcsDAQDyBQAh2wMAAL4I8gMi8AMgAPMFACHzAyAA8wUAIfQDAQD_BQAhCgYAAOUGACAMAADmBgAgDQAArwcAIBMAAOcGACCYAwEAAAABmwNAAAAAAaMDAQAAAAGkAwEAAAABpQMBAAAAAaYDQAAAAAECAAAAJAAgKwAAtAkAIAMAAAAiACArAAC0CQAgLAAAuAkAIAwAAAAiACAGAACwBgAgDAAAsQYAIA0AAK0HACATAACyBgAgJAAAuAkAIJgDAQDyBQAhmwNAAPQFACGjAwEA8gUAIaQDAQDyBQAhpQMBAP8FACGmA0AA9AUAIQoGAACwBgAgDAAAsQYAIA0AAK0HACATAACyBgAgmAMBAPIFACGbA0AA9AUAIaMDAQDyBQAhpAMBAPIFACGlAwEA_wUAIaYDQAD0BQAhBxAAAK0IACCYAwEAAAABmQMBAAAAAaADAAAA3wMCpgNAAAAAAd8DQAAAAAHgA0AAAAABAgAAAC8AICsAALkJACADAAAALQAgKwAAuQkAICwAAL0JACAJAAAALQAgEAAArAgAICQAAL0JACCYAwEA8gUAIZkDAQDyBQAhoAMAAL4G3wMipgNAAPQFACHfA0AAgQYAIeADQACBBgAhBxAAAKwIACCYAwEA8gUAIZkDAQDyBQAhoAMAAL4G3wMipgNAAPQFACHfA0AAgQYAIeADQACBBgAhEQQAAPkIACAFAAD6CAAgDAAA_AgAIB0AAP0IACAeAAD-CAAgmAMBAAAAAZsDQAAAAAGgAwAAAPMDAqYDQAAAAAGpAyAAAAABqgNAAAAAAcADAQAAAAHLAwEAAAAB2wMAAADyAwLwAyAAAAAB8wMgAAAAAfQDAQAAAAECAAAAggEAICsAAL4JACAJmAMBAAAAAZsDQAAAAAGgAwAAANYDAqQDAQAAAAGmA0AAAAAB1AMBAAAAAdYDAAAAsAMC1wNAAAAAAdgDAQAAAAEKmAMBAAAAAZsDQAAAAAGdAwIAAAABngMBAAAAAaADAAAAoAMCoQMBAAAAAaIDQAAAAAGkAwEAAAABpQMBAAAAAaYDQAAAAAEFmAMBAAAAAZsDQAAAAAGkAwEAAAABpQMBAAAAAaYDQAAAAAEDAAAAhQEAICsAAL4JACAsAADFCQAgEwAAAIUBACAEAADACAAgBQAAwQgAIAwAAMMIACAdAADECAAgHgAAxQgAICQAAMUJACCYAwEA8gUAIZsDQAD0BQAhoAMAAL8I8wMipgNAAPQFACGpAyAA8wUAIaoDQACBBgAhwAMBAPIFACHLAwEA8gUAIdsDAAC-CPIDIvADIADzBQAh8wMgAPMFACH0AwEA_wUAIREEAADACAAgBQAAwQgAIAwAAMMIACAdAADECAAgHgAAxQgAIJgDAQDyBQAhmwNAAPQFACGgAwAAvwjzAyKmA0AA9AUAIakDIADzBQAhqgNAAIEGACHAAwEA8gUAIcsDAQDyBQAh2wMAAL4I8gMi8AMgAPMFACHzAyAA8wUAIfQDAQD_BQAhCJgDAQAAAAGbA0AAAAABpgNAAAAAAakDIAAAAAGqA0AAAAABwAMBAAAAAcEDAQAAAAHCAwEAAAABAgAAAJgDACArAADGCQAgAwAAAJsDACArAADGCQAgLAAAygkAIAoAAACbAwAgJAAAygkAIJgDAQDyBQAhmwNAAPQFACGmA0AA9AUAIakDIADzBQAhqgNAAIEGACHAAwEA8gUAIcEDAQD_BQAhwgMBAP8FACEImAMBAPIFACGbA0AA9AUAIaYDQAD0BQAhqQMgAPMFACGqA0AAgQYAIcADAQDyBQAhwQMBAP8FACHCAwEA_wUAIRYDAADcBwAgCQAA8wcAIAoAAN0HACALAADeBwAgDgAA3wcAIBcAAOEHACCKAwEAAAABmAMBAAAAAZsDQAAAAAGmA0AAAAABqQMgAAAAAaoDQAAAAAHKAwEAAAABywMBAAAAAcwDAQAAAAHNAwEAAAABzgMBAAAAAc8DAQAAAAHQAwIAAAAB0QMCAAAAAdIDIAAAAAHTAwEAAAABAgAAABMAICsAAMsJACADAAAAEQAgKwAAywkAICwAAM8JACAYAAAAEQAgAwAAnwcAIAkAAPIHACAKAACgBwAgCwAAoQcAIA4AAKIHACAXAACkBwAgJAAAzwkAIIoDAQDyBQAhmAMBAPIFACGbA0AA9AUAIaYDQAD0BQAhqQMgAPMFACGqA0AAgQYAIcoDAQDyBQAhywMBAPIFACHMAwEA_wUAIc0DAQD_BQAhzgMBAP8FACHPAwEA_wUAIdADAgD-BQAh0QMCAP4FACHSAyAA8wUAIdMDAQDyBQAhFgMAAJ8HACAJAADyBwAgCgAAoAcAIAsAAKEHACAOAACiBwAgFwAApAcAIIoDAQDyBQAhmAMBAPIFACGbA0AA9AUAIaYDQAD0BQAhqQMgAPMFACGqA0AAgQYAIcoDAQDyBQAhywMBAPIFACHMAwEA_wUAIc0DAQD_BQAhzgMBAP8FACHPAwEA_wUAIdADAgD-BQAh0QMCAP4FACHSAyAA8wUAIdMDAQDyBQAhEQQAAPkIACAFAAD6CAAgBgAA-wgAIB0AAP0IACAeAAD-CAAgmAMBAAAAAZsDQAAAAAGgAwAAAPMDAqYDQAAAAAGpAyAAAAABqgNAAAAAAcADAQAAAAHLAwEAAAAB2wMAAADyAwLwAyAAAAAB8wMgAAAAAfQDAQAAAAECAAAAggEAICsAANAJACAHmAMBAAAAAZsDQAAAAAGmA0AAAAABpwNAAAAAAagDQAAAAAGpAyAAAAABqgNAAAAAAQIAAAD1AwAgKwAA0gkAIAMAAAD4AwAgKwAA0gkAICwAANYJACAJAAAA-AMAICQAANYJACCYAwEA8gUAIZsDQAD0BQAhpgNAAPQFACGnA0AA9AUAIagDQAD0BQAhqQMgAPMFACGqA0AAgQYAIQeYAwEA8gUAIZsDQAD0BQAhpgNAAPQFACGnA0AA9AUAIagDQAD0BQAhqQMgAPMFACGqA0AAgQYAIQmYAwEAAAABmwNAAAAAAaUDAQAAAAGmA0AAAAABqQMgAAAAAaoDQAAAAAHHAwEAAAAByAMgAAAAAckDIAAAAAEMDAAA-gYAIBkAANoHACCYAwEAAAABmwNAAAAAAaQDAQAAAAGlAwEAAAABpgNAAAAAAakDIAAAAAGqA0AAAAABxwMBAAAAAcgDIAAAAAHJAyAAAAABAgAAABgAICsAANgJACADAAAAFgAgKwAA2AkAICwAANwJACAOAAAAFgAgDAAAlwYAIBkAANgHACAkAADcCQAgmAMBAPIFACGbA0AA9AUAIaQDAQDyBQAhpQMBAP8FACGmA0AA9AUAIakDIADzBQAhqgNAAIEGACHHAwEA8gUAIcgDIADzBQAhyQMgAPMFACEMDAAAlwYAIBkAANgHACCYAwEA8gUAIZsDQAD0BQAhpAMBAPIFACGlAwEA_wUAIaYDQAD0BQAhqQMgAPMFACGqA0AAgQYAIccDAQDyBQAhyAMgAPMFACHJAyAA8wUAIQmYAwEAAAABmwNAAAAAAaADAAAA1gMCowMBAAAAAaYDQAAAAAHUAwEAAAAB1gMAAACwAwLXA0AAAAAB2AMBAAAAAQqYAwEAAAABmwNAAAAAAZ0DAgAAAAGeAwEAAAABoAMAAACgAwKhAwEAAAABogNAAAAAAaMDAQAAAAGlAwEAAAABpgNAAAAAAQ8GAAD0BgAgDAAA-AYAIBoAAM8HACAbAAD1BgAgHAAA9gYAIJgDAQAAAAGbA0AAAAABoAMAAADWAwKjAwEAAAABpAMBAAAAAaYDQAAAAAHUAwEAAAAB1gMAAACwAwLXA0AAAAAB2AMBAAAAAQIAAAAPACArAADfCQAgAwAAAA0AICsAAN8JACAsAADjCQAgEQAAAA0AIAYAAKAGACAMAACkBgAgGgAAzQcAIBsAAKEGACAcAACiBgAgJAAA4wkAIJgDAQDyBQAhmwNAAPQFACGgAwAAngbWAyKjAwEA8gUAIaQDAQD_BQAhpgNAAPQFACHUAwEA8gUAIdYDAACfBrADItcDQAD0BQAh2AMBAPIFACEPBgAAoAYAIAwAAKQGACAaAADNBwAgGwAAoQYAIBwAAKIGACCYAwEA8gUAIZsDQAD0BQAhoAMAAJ4G1gMiowMBAPIFACGkAwEA_wUAIaYDQAD0BQAh1AMBAPIFACHWAwAAnwawAyLXA0AA9AUAIdgDAQDyBQAhBZgDAQAAAAGbA0AAAAABowMBAAAAAaUDAQAAAAGmA0AAAAABAwAAAIUBACArAADQCQAgLAAA5wkAIBMAAACFAQAgBAAAwAgAIAUAAMEIACAGAADCCAAgHQAAxAgAIB4AAMUIACAkAADnCQAgmAMBAPIFACGbA0AA9AUAIaADAAC_CPMDIqYDQAD0BQAhqQMgAPMFACGqA0AAgQYAIcADAQDyBQAhywMBAPIFACHbAwAAvgjyAyLwAyAA8wUAIfMDIADzBQAh9AMBAP8FACERBAAAwAgAIAUAAMEIACAGAADCCAAgHQAAxAgAIB4AAMUIACCYAwEA8gUAIZsDQAD0BQAhoAMAAL8I8wMipgNAAPQFACGpAyAA8wUAIaoDQACBBgAhwAMBAPIFACHLAwEA8gUAIdsDAAC-CPIDIvADIADzBQAh8wMgAPMFACH0AwEA_wUAIQ-KAwEAAAABmAMBAAAAAZsDQAAAAAGmA0AAAAABqQMgAAAAAaoDQAAAAAHKAwEAAAABywMBAAAAAcwDAQAAAAHNAwEAAAABzgMBAAAAAc8DAQAAAAHQAwIAAAAB0QMCAAAAAdIDIAAAAAEKBgAA5QYAIAwAAOYGACANAACvBwAgFgAA6AYAIJgDAQAAAAGbA0AAAAABowMBAAAAAaQDAQAAAAGlAwEAAAABpgNAAAAAAQIAAAAkACArAADpCQAgAwAAACIAICsAAOkJACAsAADtCQAgDAAAACIAIAYAALAGACAMAACxBgAgDQAArQcAIBYAALMGACAkAADtCQAgmAMBAPIFACGbA0AA9AUAIaMDAQDyBQAhpAMBAPIFACGlAwEA_wUAIaYDQAD0BQAhCgYAALAGACAMAACxBgAgDQAArQcAIBYAALMGACCYAwEA8gUAIZsDQAD0BQAhowMBAPIFACGkAwEA8gUAIaUDAQD_BQAhpgNAAPQFACERBAAA-QgAIAUAAPoIACAGAAD7CAAgDAAA_AgAIB0AAP0IACCYAwEAAAABmwNAAAAAAaADAAAA8wMCpgNAAAAAAakDIAAAAAGqA0AAAAABwAMBAAAAAcsDAQAAAAHbAwAAAPIDAvADIAAAAAHzAyAAAAAB9AMBAAAAAQIAAACCAQAgKwAA7gkAIAMAAACFAQAgKwAA7gkAICwAAPIJACATAAAAhQEAIAQAAMAIACAFAADBCAAgBgAAwggAIAwAAMMIACAdAADECAAgJAAA8gkAIJgDAQDyBQAhmwNAAPQFACGgAwAAvwjzAyKmA0AA9AUAIakDIADzBQAhqgNAAIEGACHAAwEA8gUAIcsDAQDyBQAh2wMAAL4I8gMi8AMgAPMFACHzAyAA8wUAIfQDAQD_BQAhEQQAAMAIACAFAADBCAAgBgAAwggAIAwAAMMIACAdAADECAAgmAMBAPIFACGbA0AA9AUAIaADAAC_CPMDIqYDQAD0BQAhqQMgAPMFACGqA0AAgQYAIcADAQDyBQAhywMBAPIFACHbAwAAvgjyAyLwAyAA8wUAIfMDIADzBQAh9AMBAP8FACEPBgAA9AYAIAwAAPgGACAXAAD3BgAgGgAAzwcAIBwAAPYGACCYAwEAAAABmwNAAAAAAaADAAAA1gMCowMBAAAAAaQDAQAAAAGmA0AAAAAB1AMBAAAAAdYDAAAAsAMC1wNAAAAAAdgDAQAAAAECAAAADwAgKwAA8wkAIAMAAAANACArAADzCQAgLAAA9wkAIBEAAAANACAGAACgBgAgDAAApAYAIBcAAKMGACAaAADNBwAgHAAAogYAICQAAPcJACCYAwEA8gUAIZsDQAD0BQAhoAMAAJ4G1gMiowMBAPIFACGkAwEA_wUAIaYDQAD0BQAh1AMBAPIFACHWAwAAnwawAyLXA0AA9AUAIdgDAQDyBQAhDwYAAKAGACAMAACkBgAgFwAAowYAIBoAAM0HACAcAACiBgAgmAMBAPIFACGbA0AA9AUAIaADAACeBtYDIqMDAQDyBQAhpAMBAP8FACGmA0AA9AUAIdQDAQDyBQAh1gMAAJ8GsAMi1wNAAPQFACHYAwEA8gUAIRYDAADcBwAgCQAA8wcAIAsAAN4HACAOAADfBwAgDwAA4AcAIBcAAOEHACCKAwEAAAABmAMBAAAAAZsDQAAAAAGmA0AAAAABqQMgAAAAAaoDQAAAAAHKAwEAAAABywMBAAAAAcwDAQAAAAHNAwEAAAABzgMBAAAAAc8DAQAAAAHQAwIAAAAB0QMCAAAAAdIDIAAAAAHTAwEAAAABAgAAABMAICsAAPgJACAWAwAA3AcAIAkAAPMHACAKAADdBwAgDgAA3wcAIA8AAOAHACAXAADhBwAgigMBAAAAAZgDAQAAAAGbA0AAAAABpgNAAAAAAakDIAAAAAGqA0AAAAABygMBAAAAAcsDAQAAAAHMAwEAAAABzQMBAAAAAc4DAQAAAAHPAwEAAAAB0AMCAAAAAdEDAgAAAAHSAyAAAAAB0wMBAAAAAQIAAAATACArAAD6CQAgDgMAAJkIACAOAACbCAAgFwAAnAgAIIoDAQAAAAGYAwEAAAABmwNAAAAAAaYDQAAAAAGpAyAAAAABqgNAAAAAAcoDAQAAAAHLAwEAAAABzAMBAAAAAc0DAQAAAAHZAwEAAAABAgAAAKQCACArAAD8CQAgFgMAANwHACAJAADzBwAgCgAA3QcAIAsAAN4HACAOAADfBwAgDwAA4AcAIIoDAQAAAAGYAwEAAAABmwNAAAAAAaYDQAAAAAGpAyAAAAABqgNAAAAAAcoDAQAAAAHLAwEAAAABzAMBAAAAAc0DAQAAAAHOAwEAAAABzwMBAAAAAdADAgAAAAHRAwIAAAAB0gMgAAAAAdMDAQAAAAECAAAAEwAgKwAA_gkAIA4DAACZCAAgCwAAmggAIA4AAJsIACCKAwEAAAABmAMBAAAAAZsDQAAAAAGmA0AAAAABqQMgAAAAAaoDQAAAAAHKAwEAAAABywMBAAAAAcwDAQAAAAHNAwEAAAAB2QMBAAAAAQIAAACkAgAgKwAAgAoAIAaYAwEAAAABpgNAAAAAAbkDAAAAvwMCuwMBAAAAAb0DAAAAvQMCvwMBAAAAAQWKAwEAAAABmAMBAAAAAdsDAAAAvQMC3ANAAAAAAd0DQAAAAAEFmAMBAAAAAaADAAAA3wMCpgNAAAAAAd8DQAAAAAHgA0AAAAABAwAAABEAICsAAP4JACAsAACHCgAgGAAAABEAIAMAAJ8HACAJAADyBwAgCgAAoAcAIAsAAKEHACAOAACiBwAgDwAAowcAICQAAIcKACCKAwEA8gUAIZgDAQDyBQAhmwNAAPQFACGmA0AA9AUAIakDIADzBQAhqgNAAIEGACHKAwEA8gUAIcsDAQDyBQAhzAMBAP8FACHNAwEA_wUAIc4DAQD_BQAhzwMBAP8FACHQAwIA_gUAIdEDAgD-BQAh0gMgAPMFACHTAwEA8gUAIRYDAACfBwAgCQAA8gcAIAoAAKAHACALAAChBwAgDgAAogcAIA8AAKMHACCKAwEA8gUAIZgDAQDyBQAhmwNAAPQFACGmA0AA9AUAIakDIADzBQAhqgNAAIEGACHKAwEA8gUAIcsDAQDyBQAhzAMBAP8FACHNAwEA_wUAIc4DAQD_BQAhzwMBAP8FACHQAwIA_gUAIdEDAgD-BQAh0gMgAPMFACHTAwEA8gUAIQMAAAALACArAACACgAgLAAAigoAIBAAAAALACADAAD6BwAgCwAA-wcAIA4AAPwHACAkAACKCgAgigMBAPIFACGYAwEA8gUAIZsDQAD0BQAhpgNAAPQFACGpAyAA8wUAIaoDQACBBgAhygMBAPIFACHLAwEA8gUAIcwDAQD_BQAhzQMBAP8FACHZAwEA_wUAIQ4DAAD6BwAgCwAA-wcAIA4AAPwHACCKAwEA8gUAIZgDAQDyBQAhmwNAAPQFACGmA0AA9AUAIakDIADzBQAhqgNAAIEGACHKAwEA8gUAIcsDAQDyBQAhzAMBAP8FACHNAwEA_wUAIdkDAQD_BQAhBZgDAQAAAAGbA0AAAAABowMBAAAAAaQDAQAAAAGmA0AAAAABAwAAABEAICsAAPoJACAsAACOCgAgGAAAABEAIAMAAJ8HACAJAADyBwAgCgAAoAcAIA4AAKIHACAPAACjBwAgFwAApAcAICQAAI4KACCKAwEA8gUAIZgDAQDyBQAhmwNAAPQFACGmA0AA9AUAIakDIADzBQAhqgNAAIEGACHKAwEA8gUAIcsDAQDyBQAhzAMBAP8FACHNAwEA_wUAIc4DAQD_BQAhzwMBAP8FACHQAwIA_gUAIdEDAgD-BQAh0gMgAPMFACHTAwEA8gUAIRYDAACfBwAgCQAA8gcAIAoAAKAHACAOAACiBwAgDwAAowcAIBcAAKQHACCKAwEA8gUAIZgDAQDyBQAhmwNAAPQFACGmA0AA9AUAIakDIADzBQAhqgNAAIEGACHKAwEA8gUAIcsDAQDyBQAhzAMBAP8FACHNAwEA_wUAIc4DAQD_BQAhzwMBAP8FACHQAwIA_gUAIdEDAgD-BQAh0gMgAPMFACHTAwEA8gUAIQMAAAALACArAAD8CQAgLAAAkQoAIBAAAAALACADAAD6BwAgDgAA_AcAIBcAAP0HACAkAACRCgAgigMBAPIFACGYAwEA8gUAIZsDQAD0BQAhpgNAAPQFACGpAyAA8wUAIaoDQACBBgAhygMBAPIFACHLAwEA8gUAIcwDAQD_BQAhzQMBAP8FACHZAwEA_wUAIQ4DAAD6BwAgDgAA_AcAIBcAAP0HACCKAwEA8gUAIZgDAQDyBQAhmwNAAPQFACGmA0AA9AUAIakDIADzBQAhqgNAAIEGACHKAwEA8gUAIcsDAQDyBQAhzAMBAP8FACHNAwEA_wUAIdkDAQD_BQAhAwAAABEAICsAAPgJACAsAACUCgAgGAAAABEAIAMAAJ8HACAJAADyBwAgCwAAoQcAIA4AAKIHACAPAACjBwAgFwAApAcAICQAAJQKACCKAwEA8gUAIZgDAQDyBQAhmwNAAPQFACGmA0AA9AUAIakDIADzBQAhqgNAAIEGACHKAwEA8gUAIcsDAQDyBQAhzAMBAP8FACHNAwEA_wUAIc4DAQD_BQAhzwMBAP8FACHQAwIA_gUAIdEDAgD-BQAh0gMgAPMFACHTAwEA8gUAIRYDAACfBwAgCQAA8gcAIAsAAKEHACAOAACiBwAgDwAAowcAIBcAAKQHACCKAwEA8gUAIZgDAQDyBQAhmwNAAPQFACGmA0AA9AUAIakDIADzBQAhqgNAAIEGACHKAwEA8gUAIcsDAQDyBQAhzAMBAP8FACHNAwEA_wUAIc4DAQD_BQAhzwMBAP8FACHQAwIA_gUAIdEDAgD-BQAh0gMgAPMFACHTAwEA8gUAIQmYAwEAAAABmwNAAAAAAaQDAQAAAAGlAwEAAAABpgNAAAAAAakDIAAAAAGqA0AAAAAByAMgAAAAAckDIAAAAAEPBgAA9AYAIAwAAPgGACAXAAD3BgAgGgAAzwcAIBsAAPUGACCYAwEAAAABmwNAAAAAAaADAAAA1gMCowMBAAAAAaQDAQAAAAGmA0AAAAAB1AMBAAAAAdYDAAAAsAMC1wNAAAAAAdgDAQAAAAECAAAADwAgKwAAlgoAIBYDAADcBwAgCQAA8wcAIAoAAN0HACALAADeBwAgDwAA4AcAIBcAAOEHACCKAwEAAAABmAMBAAAAAZsDQAAAAAGmA0AAAAABqQMgAAAAAaoDQAAAAAHKAwEAAAABywMBAAAAAcwDAQAAAAHNAwEAAAABzgMBAAAAAc8DAQAAAAHQAwIAAAAB0QMCAAAAAdIDIAAAAAHTAwEAAAABAgAAABMAICsAAJgKACAOAwAAmQgAIAsAAJoIACAXAACcCAAgigMBAAAAAZgDAQAAAAGbA0AAAAABpgNAAAAAAakDIAAAAAGqA0AAAAABygMBAAAAAcsDAQAAAAHMAwEAAAABzQMBAAAAAdkDAQAAAAECAAAApAIAICsAAJoKACADAAAADQAgKwAAlgoAICwAAJ4KACARAAAADQAgBgAAoAYAIAwAAKQGACAXAACjBgAgGgAAzQcAIBsAAKEGACAkAACeCgAgmAMBAPIFACGbA0AA9AUAIaADAACeBtYDIqMDAQDyBQAhpAMBAP8FACGmA0AA9AUAIdQDAQDyBQAh1gMAAJ8GsAMi1wNAAPQFACHYAwEA8gUAIQ8GAACgBgAgDAAApAYAIBcAAKMGACAaAADNBwAgGwAAoQYAIJgDAQDyBQAhmwNAAPQFACGgAwAAngbWAyKjAwEA8gUAIaQDAQD_BQAhpgNAAPQFACHUAwEA8gUAIdYDAACfBrADItcDQAD0BQAh2AMBAPIFACEDAAAAEQAgKwAAmAoAICwAAKEKACAYAAAAEQAgAwAAnwcAIAkAAPIHACAKAACgBwAgCwAAoQcAIA8AAKMHACAXAACkBwAgJAAAoQoAIIoDAQDyBQAhmAMBAPIFACGbA0AA9AUAIaYDQAD0BQAhqQMgAPMFACGqA0AAgQYAIcoDAQDyBQAhywMBAPIFACHMAwEA_wUAIc0DAQD_BQAhzgMBAP8FACHPAwEA_wUAIdADAgD-BQAh0QMCAP4FACHSAyAA8wUAIdMDAQDyBQAhFgMAAJ8HACAJAADyBwAgCgAAoAcAIAsAAKEHACAPAACjBwAgFwAApAcAIIoDAQDyBQAhmAMBAPIFACGbA0AA9AUAIaYDQAD0BQAhqQMgAPMFACGqA0AAgQYAIcoDAQDyBQAhywMBAPIFACHMAwEA_wUAIc0DAQD_BQAhzgMBAP8FACHPAwEA_wUAIdADAgD-BQAh0QMCAP4FACHSAyAA8wUAIdMDAQDyBQAhAwAAAAsAICsAAJoKACAsAACkCgAgEAAAAAsAIAMAAPoHACALAAD7BwAgFwAA_QcAICQAAKQKACCKAwEA8gUAIZgDAQDyBQAhmwNAAPQFACGmA0AA9AUAIakDIADzBQAhqgNAAIEGACHKAwEA8gUAIcsDAQDyBQAhzAMBAP8FACHNAwEA_wUAIdkDAQD_BQAhDgMAAPoHACALAAD7BwAgFwAA_QcAIIoDAQDyBQAhmAMBAPIFACGbA0AA9AUAIaYDQAD0BQAhqQMgAPMFACGqA0AAgQYAIcoDAQDyBQAhywMBAPIFACHMAwEA_wUAIc0DAQD_BQAh2QMBAP8FACEBAwACBwQGAwUKBAYMBQgAGwxKCB1MAR5QGgEDAAIBAwACBQMAAggAGQsQBg5FCxdGDQcGAAUIABgMQwgXQg0aAAcbQBccQQsDDAAIDT4GGQAVCAMAAggAFAkACQoZBwsaBg4eCw8hDBclDQIHFAgIAAoBBxUAAwYABQwACA0fBgEMAAgGBgAFCAATDAAIDSYGEyoOFjAQAhAADRIsDwERAA4DCAASEAANFTQRARQAEAEVNQACEzYAFjcABAo4AAs5AA46ABc7AAIIABYYPAcBGD0AAQ0ABgEXRAADC0cADkgAF0kAAQMAAgMEUQAFUgAeUwAAAQMAAgEDAAIDCAAgMQAhMgAiAAAAAwgAIDEAITIAIgERAA4BEQAOBQgAJzEAKjIAK0MAKEQAKQAAAAAABQgAJzEAKjIAK0MAKEQAKQAAAwgAMDEAMTIAMgAAAAMIADAxADEyADIBAwACAQMAAgMIADcxADgyADkAAAADCAA3MQA4MgA5AQMAAgEDAAIDCAA-MQA_MgBAAAAAAwgAPjEAPzIAQAAAAAMIAEYxAEcyAEgAAAADCABGMQBHMgBIARAADQEQAA0DCABNMQBOMgBPAAAAAwgATTEATjIATwEUABABFAAQAwgAVDEAVTIAVgAAAAMIAFQxAFUyAFYDBgAFDAAIDZYCBgMGAAUMAAgNnAIGAwgAWzEAXDIAXQAAAAMIAFsxAFwyAF0BAwACAQMAAgMIAGIxAGMyAGQAAAADCABiMQBjMgBkAwYABQzGAggaAAcDBgAFDMwCCBoABwMIAGkxAGoyAGsAAAADCABpMQBqMgBrAgMAAgkACQIDAAIJAAkFCABwMQBzMgB0QwBxRAByAAAAAAAFCABwMQBzMgB0QwBxRAByAgwACBkAFQIMAAgZABUDCAB5MQB6MgB7AAAAAwgAeTEAejIAewEMAAgBDAAIAwgAgAExAIEBMgCCAQAAAAMIAIABMQCBATIAggEAAAMIAIcBMQCIATIAiQEAAAADCACHATEAiAEyAIkBARAADQEQAA0DCACOATEAjwEyAJABAAAAAwgAjgExAI8BMgCQAQEDAAIBAwACAwgAlQExAJYBMgCXAQAAAAMIAJUBMQCWATIAlwEBDQAGAQ0ABgUIAJwBMQCfATIAoAFDAJ0BRACeAQAAAAAABQgAnAExAJ8BMgCgAUMAnQFEAJ4BAAADCAClATEApgEyAKcBAAAAAwgApQExAKYBMgCnAQMGAAUMAAgNmAQGAwYABQwACA2eBAYFCACsATEArwEyALABQwCtAUQArgEAAAAAAAUIAKwBMQCvATIAsAFDAK0BRACuAQAAAAMIALYBMQC3ATIAuAEAAAADCAC2ATEAtwEyALgBAAAAAwgAvgExAL8BMgDAAQAAAAMIAL4BMQC_ATIAwAEfAgEgVAEhVgEiVwEjWAElWgEmXBwnXR0oXwEpYRwqYh4tYwEuZAEvZRwzaB80aSM1aw82bA83bg84bw85cA86cg87dBw8dSQ9dw8-eRw_eiVAew9BfA9CfRxFgAEmRoEBLEeDAQJIhAECSYcBAkqIAQJLiQECTIsBAk2NARxOjgEtT5ABAlCSARxRkwEuUpQBAlOVAQJUlgEcVZkBL1aaATNXmwEDWJwBA1mdAQNangEDW58BA1yhAQNdowEcXqQBNF-mAQNgqAEcYakBNWKqAQNjqwEDZKwBHGWvATZmsAE6Z7EBBGiyAQRpswEEarQBBGu1AQRstwEEbbkBHG66ATtvvAEEcL4BHHG_ATxywAEEc8EBBHTCARx1xQE9dsYBQXfIAUJ4yQFCecwBQnrNAUJ7zgFCfNABQn3SARx-0wFDf9UBQoAB1wEcgQHYAUSCAdkBQoMB2gFChAHbARyFAd4BRYYB3wFJhwHgARCIAeEBEIkB4gEQigHjARCLAeQBEIwB5gEQjQHoARyOAekBSo8B6wEQkAHtARyRAe4BS5IB7wEQkwHwARCUAfEBHJUB9AFMlgH1AVCXAfYBEZgB9wERmQH4ARGaAfkBEZsB-gERnAH8ARGdAf4BHJ4B_wFRnwGBAhGgAYMCHKEBhAJSogGFAhGjAYYCEaQBhwIcpQGKAlOmAYsCV6cBjAINqAGNAg2pAY4CDaoBjwINqwGQAg2sAZICDa0BlAIcrgGVAlivAZgCDbABmgIcsQGbAlmyAZ0CDbMBngINtAGfAhy1AaICWrYBowJetwGlAgW4AaYCBbkBqAIFugGpAgW7AaoCBbwBrAIFvQGuAhy-Aa8CX78BsQIFwAGzAhzBAbQCYMIBtQIFwwG2AgXEAbcCHMUBugJhxgG7AmXHAbwCBsgBvQIGyQG-AgbKAb8CBssBwAIGzAHCAgbNAcQCHM4BxQJmzwHIAgbQAcoCHNEBywJn0gHNAgbTAc4CBtQBzwIc1QHSAmjWAdMCbNcB1AII2AHVAgjZAdYCCNoB1wII2wHYAgjcAdoCCN0B3AIc3gHdAm3fAd8CCOAB4QIc4QHiAm7iAeMCCOMB5AII5AHlAhzlAegCb-YB6QJ15wHqAgfoAesCB-kB7AIH6gHtAgfrAe4CB-wB8AIH7QHyAhzuAfMCdu8B9QIH8AH3AhzxAfgCd_IB-QIH8wH6Agf0AfsCHPUB_gJ49gH_Anz3AYEDDPgBggMM-QGEAwz6AYUDDPsBhgMM_AGIAwz9AYoDHP4BiwN9_wGNAwyAAo8DHIECkAN-ggKRAwyDApIDDIQCkwMchQKWA3-GApcDgwGHApkDCYgCmgMJiQKdAwmKAp4DCYsCnwMJjAKhAwmNAqMDHI4CpAOEAY8CpgMJkAKoAxyRAqkDhQGSAqoDCZMCqwMJlAKsAxyVAq8DhgGWArADigGXArEDDpgCsgMOmQKzAw6aArQDDpsCtQMOnAK3Aw6dArkDHJ4CugOLAZ8CvAMOoAK-AxyhAr8DjAGiAsADDqMCwQMOpALCAxylAsUDjQGmAsYDkQGnAscDGqgCyAMaqQLJAxqqAsoDGqsCywMarALNAxqtAs8DHK4C0AOSAa8C0gMasALUAxyxAtUDkwGyAtYDGrMC1wMatALYAxy1AtsDlAG2AtwDmAG3At4DF7gC3wMXuQLhAxe6AuIDF7sC4wMXvALlAxe9AucDHL4C6AOZAb8C6gMXwALsAxzBAu0DmgHCAu4DF8MC7wMXxALwAxzFAvMDmwHGAvQDoQHHAvYDFcgC9wMVyQL6AxXKAvsDFcsC_AMVzAL-AxXNAoAEHM4CgQSiAc8CgwQV0AKFBBzRAoYEowHSAocEFdMCiAQV1AKJBBzVAowEpAHWAo0EqAHXAo4EC9gCjwQL2QKQBAvaApEEC9sCkgQL3AKUBAvdApYEHN4ClwSpAd8CmgQL4AKcBBzhAp0EqgHiAp8EC-MCoAQL5AKhBBzlAqQEqwHmAqUEsQHnAqcEsgHoAqgEsgHpAqsEsgHqAqwEsgHrAq0EsgHsAq8EsgHtArEEHO4CsgSzAe8CtASyAfACtgQc8QK3BLQB8gK4BLIB8wK5BLIB9AK6BBz1Ar0EtQH2Ar4EuQH3AsAEugH4AsEEugH5AsQEugH6AsUEugH7AsYEugH8AsgEugH9AsoEHP4CywS7Af8CzQS6AYADzwQcgQPQBLwBggPRBLoBgwPSBLoBhAPTBByFA9YEvQGGA9cEwQE"
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
  AttachmentScalarFieldEnum: () => AttachmentScalarFieldEnum,
  CallParticipantScalarFieldEnum: () => CallParticipantScalarFieldEnum,
  CallScalarFieldEnum: () => CallScalarFieldEnum,
  ChatRoomScalarFieldEnum: () => ChatRoomScalarFieldEnum,
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
  MessageScalarFieldEnum: () => MessageScalarFieldEnum,
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
  TypingStateScalarFieldEnum: () => TypingStateScalarFieldEnum,
  UserPresenceScalarFieldEnum: () => UserPresenceScalarFieldEnum,
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
  Attachment: "Attachment",
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  Call: "Call",
  CallParticipant: "CallParticipant",
  ChatRoom: "ChatRoom",
  Client: "Client",
  Consultation: "Consultation",
  Expert: "Expert",
  ExpertSchedule: "ExpertSchedule",
  ExpertVerification: "ExpertVerification",
  Industry: "Industry",
  Message: "Message",
  Notification: "Notification",
  Payment: "Payment",
  Schedule: "Schedule",
  Testimonial: "Testimonial",
  TypingState: "TypingState",
  UserPresence: "UserPresence"
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
var AttachmentScalarFieldEnum = {
  id: "id",
  messageId: "messageId",
  fileUrl: "fileUrl",
  fileName: "fileName",
  fileType: "fileType",
  fileSize: "fileSize",
  createdAt: "createdAt"
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
var CallScalarFieldEnum = {
  id: "id",
  roomId: "roomId",
  status: "status",
  startedAt: "startedAt",
  endedAt: "endedAt",
  createdAt: "createdAt"
};
var CallParticipantScalarFieldEnum = {
  id: "id",
  callId: "callId",
  userId: "userId",
  role: "role",
  joinedAt: "joinedAt",
  leftAt: "leftAt"
};
var ChatRoomScalarFieldEnum = {
  id: "id",
  consultationId: "consultationId",
  clientId: "clientId",
  expertId: "expertId",
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
  isPublished: "isPublished",
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
var MessageScalarFieldEnum = {
  id: "id",
  roomId: "roomId",
  senderId: "senderId",
  senderRole: "senderRole",
  type: "type",
  text: "text",
  createdAt: "createdAt"
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
var TypingStateScalarFieldEnum = {
  id: "id",
  roomId: "roomId",
  userId: "userId",
  isTyping: "isTyping",
  updatedAt: "updatedAt"
};
var UserPresenceScalarFieldEnum = {
  userId: "userId",
  isOnline: "isOnline",
  lastSeen: "lastSeen"
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
var MessageType = {
  TEXT: "TEXT",
  FILE: "FILE",
  SYSTEM: "SYSTEM"
};
var UserRole = {
  CLIENT: "CLIENT",
  EXPERT: "EXPERT",
  ADMIN: "ADMIN"
};
var CallStatus = {
  PENDING: "PENDING",
  ACTIVE: "ACTIVE",
  ENDED: "ENDED"
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
    const cookieToken = CookieUtils.getCookie(req, "accessToken");
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : void 0;
    const accessToken = cookieToken || bearerToken;
    if (!accessToken) {
      throw new AppError_default(
        status3.UNAUTHORIZED,
        "Unauthorized! No access token. Send cookie or Bearer token."
      );
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
      throw new AppError_default(
        status3.FORBIDDEN,
        `Forbidden! No permission. Current role: ${userRole}. Allowed roles: ${authRoles.join(", ")}. Route: ${req.method} ${req.originalUrl}`
      );
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
      const normalizedBody = req.body ?? {};
      const requestData = {
        body: normalizedBody,
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
      const bodyOnlyResult = zodSchema.safeParse(normalizedBody);
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
var isProduction = envVars.NODE_ENV === "production";
var getCookieBaseOptions = () => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/"
});
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
    ...getCookieBaseOptions(),
    //1 day
    maxAge: 60 * 60 * 24 * 1e3
  });
};
var setRefreshTokenCookie = (res, token) => {
  CookieUtils.setCookie(res, "refreshToken", token, {
    ...getCookieBaseOptions(),
    //7d
    maxAge: 60 * 60 * 24 * 1e3 * 7
  });
};
var setBetterAuthSessionCookie = (res, token) => {
  const options = {
    ...getCookieBaseOptions(),
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
        where: {
          isDeleted: false,
          isPublished: true,
          isBooked: false
        },
        include: { schedule: true },
        orderBy: { createdAt: "asc" }
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
  const clientProfile = await prisma.client.findUnique({
    where: { userId }
  });
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
  const expert = await prisma.$transaction(async (tx) => {
    const createdExpert = await tx.expert.create({
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
    await tx.user.update({
      where: { id: userId },
      data: { role: Role.EXPERT }
    });
    if (clientProfile && !clientProfile.isDeleted) {
      await tx.client.update({
        where: { id: clientProfile.id },
        data: {
          isDeleted: true,
          deletedAt: /* @__PURE__ */ new Date()
        }
      });
    }
    const admins = await tx.user.findMany({
      where: {
        role: Role.ADMIN,
        isDeleted: false,
        status: UserStatus.ACTIVE
      },
      select: { id: true }
    });
    if (admins.length > 0) {
      await tx.notification.createMany({
        data: admins.map((admin) => ({
          type: "EXPERT_APPLICATION",
          message: `${createdExpert.fullName} applied to become an expert`,
          userId: admin.id
        }))
      });
    }
    return createdExpert;
  });
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
router3.post(
  "/apply",
  multerUpload.single("profilePhoto"),
  checkAuth(Role.CLIENT, Role.EXPERT, Role.ADMIN),
  expertController.applyExpert
);
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
var publishExpertScheduleValidation = z5.object({
  body: z5.object({
    scheduleIds: z5.array(z5.string().uuid("Invalid schedule ID")).min(1),
    isPublished: z5.boolean()
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
  "isPublished",
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
var getActiveExpertByUserId = async (userId) => {
  const expert = await prisma.expert.findUnique({
    where: { userId }
  });
  if (expert && !expert.isDeleted) {
    return expert;
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  });
  if (user?.role === Role.EXPERT) {
    throw new AppError_default(
      httpStatus.BAD_REQUEST,
      "Your account role is EXPERT, but your expert profile is missing or inactive. Please complete expert profile setup first."
    );
  }
  throw new AppError_default(
    httpStatus.FORBIDDEN,
    "Only expert accounts can manage availability schedules"
  );
};
var assignExpertSchedules = async (userId, payload) => {
  const expert = await getActiveExpertByUserId(userId);
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
    if (exists?.isDeleted) {
      const restored = await prisma.expertSchedule.update({
        where: {
          expertId_scheduleId: {
            expertId: expert.id,
            scheduleId
          }
        },
        data: {
          isDeleted: false,
          deletedAt: null,
          isPublished: false
        }
      });
      created.push(restored);
      continue;
    }
    if (!exists) {
      const mapping = await prisma.expertSchedule.create({
        data: {
          expertId: expert.id,
          scheduleId,
          isPublished: false
        }
      });
      created.push(mapping);
    }
  }
  return created;
};
var getMyExpertSchedules = async (userId, query) => {
  const expert = await getActiveExpertByUserId(userId);
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
var getPublishedExpertSchedules = async (expertId) => {
  const expert = await prisma.expert.findUnique({
    where: { id: expertId, isDeleted: false },
    select: { id: true }
  });
  if (!expert) {
    throw new AppError_default(httpStatus.NOT_FOUND, "Expert not found");
  }
  return prisma.expertSchedule.findMany({
    where: {
      expertId,
      isDeleted: false,
      isBooked: false,
      isPublished: true
    },
    include: {
      schedule: true
    },
    orderBy: {
      createdAt: "asc"
    }
  });
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
  const expert = await getActiveExpertByUserId(userId);
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
      for (const scheduleId of createIds) {
        await tx.expertSchedule.upsert({
          where: {
            expertId_scheduleId: {
              expertId: expert.id,
              scheduleId
            }
          },
          update: {
            isDeleted: false,
            deletedAt: null
          },
          create: {
            expertId: expert.id,
            scheduleId,
            isPublished: false
          }
        });
      }
    }
  });
  return { success: true };
};
var publishMyExpertSchedules = async (userId, payload) => {
  const expert = await getActiveExpertByUserId(userId);
  const selectedIds = payload.scheduleIds;
  const result = await prisma.expertSchedule.updateMany({
    where: {
      expertId: expert.id,
      isDeleted: false,
      isBooked: false,
      OR: [
        {
          scheduleId: { in: selectedIds }
        },
        {
          id: { in: selectedIds }
        }
      ]
    },
    data: {
      isPublished: payload.isPublished
    }
  });
  const updatedSchedules = await prisma.expertSchedule.findMany({
    where: {
      expertId: expert.id,
      OR: [
        {
          scheduleId: { in: selectedIds }
        },
        {
          id: { in: selectedIds }
        }
      ],
      isDeleted: false
    },
    include: {
      schedule: true
    },
    orderBy: {
      createdAt: "asc"
    }
  });
  return {
    count: result.count,
    isPublished: payload.isPublished,
    schedules: updatedSchedules
  };
};
var deleteMyExpertSchedule = async (userId, scheduleId) => {
  const expert = await getActiveExpertByUserId(userId);
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
      isPublished: false,
      deletedAt: /* @__PURE__ */ new Date()
    }
  });
  return { success: true };
};
var expertScheduleService = {
  assignExpertSchedules,
  getMyExpertSchedules,
  getAllExpertSchedules,
  getPublishedExpertSchedules,
  getExpertScheduleById,
  updateMyExpertSchedules,
  publishMyExpertSchedules,
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
var getPublishedExpertSchedules2 = catchAsync(async (req, res) => {
  const { expertId } = req.params;
  const result = await expertScheduleService.getPublishedExpertSchedules(
    expertId
  );
  sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: "Published expert schedules fetched successfully",
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
var publishMyExpertSchedules2 = catchAsync(async (req, res) => {
  const result = await expertScheduleService.publishMyExpertSchedules(
    req.user.userId,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: req.body.isPublished ? "Schedules published successfully" : "Schedules unpublished successfully",
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
  getPublishedExpertSchedules: getPublishedExpertSchedules2,
  getExpertScheduleById: getExpertScheduleById2,
  updateMyExpertSchedules: updateMyExpertSchedules2,
  publishMyExpertSchedules: publishMyExpertSchedules2,
  deleteMyExpertSchedule: deleteMyExpertSchedule2
};

// src/modules/expertSchdules/expertSchdules.router.ts
var router5 = Router5();
router5.post(
  "/assign",
  validateRequest(assignExpertScheduleValidation),
  checkAuth(Role.EXPERT),
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
  "/published/:expertId",
  expertScheduleController.getPublishedExpertSchedules
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
router5.patch(
  "/my/publish",
  validateRequest(publishExpertScheduleValidation),
  checkAuth(Role.EXPERT),
  expertScheduleController.publishMyExpertSchedules
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
  body: z6.object({
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
  })
});
var updateScheduleZodSchema = z6.object({
  body: z6.object({
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
  })
});
var ScheduleValidation = {
  createScheduleZodSchema,
  updateScheduleZodSchema
};

// src/modules/schedules/schedules.router.ts
var router6 = Router6();
router6.post("/", checkAuth(Role.ADMIN, Role.EXPERT), validateRequest(ScheduleValidation.createScheduleZodSchema), ScheduleController.createSchedule);
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

// src/modules/chat/chat.routes.ts
import { Router as Router13 } from "express";

// src/modules/chat/chat.controller.ts
import httpStatus3 from "http-status";

// src/modules/chat/chat.service.ts
import httpStatus2 from "http-status";
var roomInclude = {
  client: {
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true
        }
      }
    }
  },
  expert: {
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true
        }
      }
    }
  },
  consultation: true,
  messages: {
    take: 1,
    orderBy: { createdAt: "desc" },
    include: { attachment: true }
  }
};
var mapRoleToUserRole = (role) => {
  if (role === Role.CLIENT) return UserRole.CLIENT;
  if (role === Role.EXPERT) return UserRole.EXPERT;
  return UserRole.ADMIN;
};
var getRoomWithParticipants = async (roomId) => {
  const room = await prisma.chatRoom.findUnique({
    where: { id: roomId },
    include: roomInclude
  });
  if (!room) {
    throw new AppError_default(httpStatus2.NOT_FOUND, "Chat room not found");
  }
  return room;
};
var getPresenceLookup = async (userIds) => {
  const presences = await prisma.userPresence.findMany({
    where: {
      userId: { in: userIds }
    }
  });
  return new Map(presences.map((presence) => [presence.userId, presence]));
};
var buildParticipants = async (room) => {
  const presenceLookup = await getPresenceLookup([room.client.userId, room.expert.userId]);
  return [
    {
      id: room.client.id,
      userId: room.client.userId,
      role: UserRole.CLIENT,
      fullName: room.client.fullName,
      name: room.client.user?.name ?? room.client.fullName,
      email: room.client.email ?? room.client.user?.email,
      profilePhoto: room.client.profilePhoto ?? room.client.user?.image ?? null,
      avatarUrl: room.client.profilePhoto ?? room.client.user?.image ?? null,
      isOnline: presenceLookup.get(room.client.userId)?.isOnline ?? false,
      lastSeen: presenceLookup.get(room.client.userId)?.lastSeen ?? null
    },
    {
      id: room.expert.id,
      userId: room.expert.userId,
      role: UserRole.EXPERT,
      fullName: room.expert.fullName,
      name: room.expert.user?.name ?? room.expert.fullName,
      title: room.expert.title,
      email: room.expert.email ?? room.expert.user?.email,
      profilePhoto: room.expert.profilePhoto ?? room.expert.user?.image ?? null,
      avatarUrl: room.expert.profilePhoto ?? room.expert.user?.image ?? null,
      isOnline: presenceLookup.get(room.expert.userId)?.isOnline ?? false,
      lastSeen: presenceLookup.get(room.expert.userId)?.lastSeen ?? null
    }
  ];
};
var formatAttachment = (attachment) => {
  if (!attachment) {
    return null;
  }
  return {
    ...attachment,
    url: attachment.fileUrl,
    mimeType: attachment.fileType,
    size: attachment.fileSize
  };
};
var formatMessage = (message, participants = []) => ({
  ...message,
  sender: participants.find(
    (participant) => participant.userId === message.senderId || participant.id === message.senderId
  ) ?? null,
  attachment: formatAttachment(message.attachment)
});
var formatRoom = async (room) => {
  const participants = await buildParticipants(room);
  const latestMessage = room.messages[0] ? formatMessage(room.messages[0], participants) : null;
  return {
    ...room,
    participants,
    lastMessage: latestMessage,
    unreadCount: 0
  };
};
var ensureRoomAccess = async (roomId, userId, role) => {
  const room = await getRoomWithParticipants(roomId);
  if (role === Role.ADMIN) return room;
  const allowedUserId = role === Role.CLIENT ? room.client.userId : room.expert.userId;
  if (allowedUserId !== userId) {
    throw new AppError_default(httpStatus2.FORBIDDEN, "Forbidden access to this chat room");
  }
  return room;
};
var notifyOfflineRecipient = async (roomId, senderId, senderRole, previewText) => {
  const room = await getRoomWithParticipants(roomId);
  const recipientUserId = senderRole === Role.CLIENT ? room.expert.userId : room.client.userId;
  if (!recipientUserId || recipientUserId === senderId) {
    return;
  }
  const recipientPresence = await prisma.userPresence.findUnique({
    where: { userId: recipientUserId }
  });
  if (recipientPresence?.isOnline) {
    return;
  }
  await prisma.notification.create({
    data: {
      type: "CHAT_MESSAGE",
      message: previewText,
      userId: recipientUserId
    }
  });
};
var getUserRooms = async (userId, role, expertId) => {
  if (role === Role.ADMIN) {
    const rooms2 = await prisma.chatRoom.findMany({
      where: expertId ? { expertId } : void 0,
      include: roomInclude,
      orderBy: { updatedAt: "desc" }
    });
    return Promise.all(rooms2.map((room) => formatRoom(room)));
  }
  if (role === Role.CLIENT) {
    const client = await prisma.client.findUnique({
      where: { userId },
      select: { id: true, isDeleted: true }
    });
    if (!client || client.isDeleted) {
      throw new AppError_default(httpStatus2.NOT_FOUND, "Client profile not found");
    }
    const rooms2 = await prisma.chatRoom.findMany({
      where: { clientId: client.id, ...expertId ? { expertId } : {} },
      include: roomInclude,
      orderBy: { updatedAt: "desc" }
    });
    return Promise.all(rooms2.map((room) => formatRoom(room)));
  }
  const expert = await prisma.expert.findUnique({
    where: { userId },
    select: { id: true, isDeleted: true }
  });
  if (!expert || expert.isDeleted) {
    throw new AppError_default(httpStatus2.NOT_FOUND, "Expert profile not found");
  }
  const rooms = await prisma.chatRoom.findMany({
    where: { expertId: expert.id },
    include: roomInclude,
    orderBy: { updatedAt: "desc" }
  });
  return Promise.all(rooms.map((room) => formatRoom(room)));
};
var createOrGetRoom = async (userId, role, expertId) => {
  if (!expertId) {
    throw new AppError_default(httpStatus2.BAD_REQUEST, "expertId is required");
  }
  const expert = await prisma.expert.findUnique({
    where: { id: expertId, isDeleted: false },
    select: { id: true }
  });
  if (!expert) {
    throw new AppError_default(httpStatus2.NOT_FOUND, "Expert not found");
  }
  if (role === Role.CLIENT) {
    const client = await prisma.client.findUnique({
      where: { userId, isDeleted: false },
      select: { id: true }
    });
    if (!client) {
      throw new AppError_default(httpStatus2.NOT_FOUND, "Client profile not found");
    }
    const existingRoom = await prisma.chatRoom.findFirst({
      where: {
        clientId: client.id,
        expertId
      },
      include: roomInclude,
      orderBy: { updatedAt: "desc" }
    });
    if (existingRoom) {
      return formatRoom(existingRoom);
    }
    const newRoom = await prisma.chatRoom.create({
      data: {
        clientId: client.id,
        expertId
      },
      include: roomInclude
    });
    return formatRoom(newRoom);
  }
  const rooms = await getUserRooms(userId, role, expertId);
  return rooms[0] ?? null;
};
var getRoomMessages = async (roomId, userId, role) => {
  const room = await ensureRoomAccess(roomId, userId, role);
  const participants = await buildParticipants(room);
  const messages = await prisma.message.findMany({
    where: { roomId },
    include: { attachment: true },
    orderBy: { createdAt: "asc" }
  });
  return messages.map((message) => formatMessage(message, participants));
};
var updateRoomTimestamp = async (roomId) => {
  return prisma.chatRoom.update({
    where: { id: roomId },
    data: { updatedAt: /* @__PURE__ */ new Date() }
  });
};
var createTextMessage = async (roomId, senderId, senderRole, text) => {
  if (!text?.trim()) {
    throw new AppError_default(httpStatus2.BAD_REQUEST, "Message text is required");
  }
  await ensureRoomAccess(roomId, senderId, senderRole);
  const message = await prisma.message.create({
    data: {
      roomId,
      senderId,
      senderRole: mapRoleToUserRole(senderRole),
      type: MessageType.TEXT,
      text: text.trim()
    },
    include: { attachment: true }
  });
  await updateRoomTimestamp(roomId);
  await notifyOfflineRecipient(roomId, senderId, senderRole, "You have a new chat message.");
  const room = await getRoomWithParticipants(roomId);
  const participants = await buildParticipants(room);
  return formatMessage(message, participants);
};
var createFileMessage = async (roomId, senderId, senderRole, attachmentData) => {
  await ensureRoomAccess(roomId, senderId, senderRole);
  const message = await prisma.message.create({
    data: {
      roomId,
      senderId,
      senderRole: mapRoleToUserRole(senderRole),
      type: MessageType.FILE,
      text: attachmentData.fileName,
      attachment: {
        create: {
          fileUrl: attachmentData.fileUrl,
          fileName: attachmentData.fileName,
          fileType: attachmentData.fileType,
          fileSize: attachmentData.fileSize
        }
      }
    },
    include: { attachment: true }
  });
  await updateRoomTimestamp(roomId);
  await notifyOfflineRecipient(roomId, senderId, senderRole, "You received a file in chat.");
  const room = await getRoomWithParticipants(roomId);
  const participants = await buildParticipants(room);
  return formatMessage(message, participants);
};
var createCall = async (roomId, userId, role) => {
  await ensureRoomAccess(roomId, userId, role);
  const call = await prisma.call.create({
    data: {
      roomId,
      status: CallStatus.ACTIVE,
      startedAt: /* @__PURE__ */ new Date(),
      participants: {
        create: {
          userId,
          role: mapRoleToUserRole(role),
          joinedAt: /* @__PURE__ */ new Date()
        }
      }
    },
    include: { participants: true }
  });
  return call;
};
var endCall = async (callId) => {
  const existing = await prisma.call.findUnique({ where: { id: callId } });
  if (!existing) {
    throw new AppError_default(httpStatus2.NOT_FOUND, "Call not found");
  }
  if (existing.status === CallStatus.ENDED) {
    return existing;
  }
  await prisma.callParticipant.updateMany({
    where: { callId, leftAt: null },
    data: { leftAt: /* @__PURE__ */ new Date() }
  });
  return prisma.call.update({
    where: { id: callId },
    data: {
      status: CallStatus.ENDED,
      endedAt: /* @__PURE__ */ new Date()
    },
    include: { participants: true }
  });
};
var updateCallStatus = async (callId, statusValue) => {
  if (statusValue === CallStatus.ENDED) {
    return endCall(callId);
  }
  return prisma.call.update({
    where: { id: callId },
    data: {
      status: statusValue,
      startedAt: statusValue === CallStatus.ACTIVE ? /* @__PURE__ */ new Date() : void 0
    },
    include: { participants: true }
  });
};
var chatService = {
  getUserRooms,
  createOrGetRoom,
  getRoomMessages,
  createTextMessage,
  createFileMessage,
  updateRoomTimestamp,
  createCall,
  endCall,
  updateCallStatus
};

// src/modules/chat/chat.upload.ts
import fs from "fs";
import path3 from "path";
import multer2 from "multer";
var uploadRoot = path3.join(process.cwd(), "uploads", "chat");
if (!fs.existsSync(uploadRoot)) {
  fs.mkdirSync(uploadRoot, { recursive: true });
}
var allowedMimeTypes = /* @__PURE__ */ new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]);
var storage2 = multer2.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadRoot);
  },
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9._-]/g, "");
    cb(null, `${Date.now()}-${safeName}`);
  }
});
var fileFilter = (_req, file, cb) => {
  if (!allowedMimeTypes.has(file.mimetype)) {
    cb(new Error("Invalid file type. Allowed: PDF, PNG, JPG, DOCX"));
    return;
  }
  cb(null, true);
};
var chatUpload = multer2({
  storage: storage2,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});
var mapUploadedFileToAttachmentData = (req, file) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const fileUrl = `${baseUrl}/uploads/chat/${file.filename}`;
  return {
    fileUrl,
    fileName: file.originalname,
    fileType: file.mimetype,
    fileSize: file.size
  };
};

// src/modules/chat/chat.controller.ts
var getRooms = catchAsync(async (req, res) => {
  const expertId = typeof req.query.expertId === "string" ? req.query.expertId : void 0;
  const rooms = await chatService.getUserRooms(
    req.user.userId,
    req.user.role,
    expertId
  );
  sendResponse(res, {
    httpStatusCode: httpStatus3.OK,
    success: true,
    message: "Chat rooms fetched successfully",
    data: rooms
  });
});
var createOrGetRoom2 = catchAsync(async (req, res) => {
  const expertId = String(req.body?.expertId ?? "");
  const room = await chatService.createOrGetRoom(
    req.user.userId,
    req.user.role,
    expertId
  );
  sendResponse(res, {
    httpStatusCode: httpStatus3.OK,
    success: true,
    message: "Chat room fetched successfully",
    data: room
  });
});
var getRoomMessages2 = catchAsync(async (req, res) => {
  const { roomId } = req.params;
  const messages = await chatService.getRoomMessages(
    roomId,
    req.user.userId,
    req.user.role
  );
  sendResponse(res, {
    httpStatusCode: httpStatus3.OK,
    success: true,
    message: "Room messages fetched successfully",
    data: messages
  });
});
var postTextMessage = catchAsync(async (req, res) => {
  const { roomId } = req.params;
  const text = String(req.body?.text ?? "");
  const message = await chatService.createTextMessage(
    roomId,
    req.user.userId,
    req.user.role,
    text
  );
  sendResponse(res, {
    httpStatusCode: httpStatus3.CREATED,
    success: true,
    message: "Message sent successfully",
    data: message
  });
});
var postAttachmentMessage = catchAsync(async (req, res) => {
  const { roomId } = req.params;
  if (!req.file) {
    return sendResponse(res, {
      httpStatusCode: httpStatus3.BAD_REQUEST,
      success: false,
      message: "Attachment file is required",
      data: null
    });
  }
  const attachment = mapUploadedFileToAttachmentData(req, req.file);
  const message = await chatService.createFileMessage(
    roomId,
    req.user.userId,
    req.user.role,
    attachment
  );
  sendResponse(res, {
    httpStatusCode: httpStatus3.CREATED,
    success: true,
    message: "Attachment message sent successfully",
    data: message
  });
});
var createCall2 = catchAsync(async (req, res) => {
  const { roomId } = req.params;
  const call = await chatService.createCall(roomId, req.user.userId, req.user.role);
  sendResponse(res, {
    httpStatusCode: httpStatus3.CREATED,
    success: true,
    message: "Call started successfully",
    data: call
  });
});
var updateCallStatus2 = catchAsync(async (req, res) => {
  const { callId } = req.params;
  const statusValue = req.body?.status;
  if (!Object.values(CallStatus).includes(statusValue)) {
    return sendResponse(res, {
      httpStatusCode: httpStatus3.BAD_REQUEST,
      success: false,
      message: "Invalid call status",
      data: null
    });
  }
  const call = await chatService.updateCallStatus(callId, statusValue);
  sendResponse(res, {
    httpStatusCode: httpStatus3.OK,
    success: true,
    message: "Call status updated successfully",
    data: call
  });
});
var chatController = {
  getRooms,
  createOrGetRoom: createOrGetRoom2,
  getRoomMessages: getRoomMessages2,
  postTextMessage,
  postAttachmentMessage,
  createCall: createCall2,
  updateCallStatus: updateCallStatus2
};

// src/modules/chat/chat.routes.ts
var router15 = Router13();
router15.get("/rooms", checkAuth(Role.CLIENT, Role.EXPERT, Role.ADMIN), chatController.getRooms);
router15.post("/rooms", checkAuth(Role.CLIENT, Role.EXPERT, Role.ADMIN), chatController.createOrGetRoom);
router15.get(
  "/rooms/:roomId/messages",
  checkAuth(Role.CLIENT, Role.EXPERT, Role.ADMIN),
  chatController.getRoomMessages
);
router15.post(
  "/rooms/:roomId/messages",
  checkAuth(Role.CLIENT, Role.EXPERT, Role.ADMIN),
  chatController.postTextMessage
);
router15.post(
  "/rooms/:roomId/attachments",
  checkAuth(Role.CLIENT, Role.EXPERT, Role.ADMIN),
  chatUpload.single("file"),
  chatController.postAttachmentMessage
);
router15.post(
  "/rooms/:roomId/calls",
  checkAuth(Role.CLIENT, Role.EXPERT, Role.ADMIN),
  chatController.createCall
);
router15.patch(
  "/calls/:callId/status",
  checkAuth(Role.CLIENT, Role.EXPERT, Role.ADMIN),
  chatController.updateCallStatus
);
var chatRoutes = router15;

// src/index.ts
var router16 = Router14();
router16.use("/auth", authRoutes);
router16.use("/users", userRouter);
router16.use("/experts", expertRouter);
router16.use("/clients", clientRouter);
router16.use("/schedules", scheduleRoutes);
router16.use("/expert-schedules", expertScheduleRouter);
router16.use("/consultations", consultationRouter);
router16.use("/admin", adminRouter);
router16.use("/stats", StatsRoutes);
router16.use("/payments", PaymentRoutes);
router16.use("/notifications", notificationRouter);
router16.use("/chat", chatRoutes);
router16.use("/industries", industryRouter);
router16.use("/expert-verification", expertVerificationRouter);
router16.use("/testimonial", testimonialRoutes);
var indexRoutes = router16;

export {
  AppError_default,
  envVars,
  prismaNamespace_exports,
  PaymentStatus,
  MessageType,
  Role,
  prisma,
  auth,
  catchAsync,
  sendResponse,
  stripe,
  chatService,
  indexRoutes
};
