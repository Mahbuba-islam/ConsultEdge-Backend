var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/index.ts
import { Router as Router17 } from "express";

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
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_MODEL: process.env.OPENAI_MODEL || "gpt-4o-mini",
    ABLY_API_KEY: process.env.ABLY_API_KEY,
    AI_PROVIDER: process.env.AI_PROVIDER || (process.env.NODE_ENV === "production" ? "openai" : "gemini"),
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-2.0-flash"
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
  "inlineSchema": 'model Admin {\n  id            String    @id @default(uuid())\n  userId        String    @unique\n  name          String\n  email         String    @unique\n  profilePhoto  String?\n  contactNumber String?\n  isDeleted     Boolean   @default(false)\n  deletedAt     DateTime?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  @@map("admin")\n}\n\nmodel AIConversation {\n  id        String          @id @default(uuid()) @db.Uuid\n  userId    String\n  user      User            @relation(fields: [userId], references: [id], onDelete: Cascade)\n  title     String          @db.VarChar(160)\n  messages  AIChatMessage[]\n  createdAt DateTime        @default(now())\n  updatedAt DateTime        @updatedAt\n\n  @@index([userId])\n  @@map("ai_conversations")\n}\n\nmodel AIChatMessage {\n  id             String             @id @default(uuid()) @db.Uuid\n  conversationId String             @db.Uuid\n  conversation   AIConversation     @relation(fields: [conversationId], references: [id], onDelete: Cascade)\n  role           AIChatMessageRole\n  content        String\n  model          String?            @db.VarChar(120)\n  provider       String?            @db.VarChar(40)\n  tokensUsed     Int?\n  latencyMs      Int?\n  feedback       AIMessageFeedback?\n  createdAt      DateTime           @default(now())\n\n  @@index([conversationId])\n  @@map("ai_chat_messages")\n}\n\nmodel Attachment {\n  id        String  @id @default(uuid())\n  messageId String  @unique\n  message   Message @relation(fields: [messageId], references: [id], onDelete: Cascade)\n\n  fileUrl  String\n  fileName String\n  fileType String\n  fileSize Int\n\n  createdAt DateTime @default(now())\n\n  @@map("attachments")\n}\n\nmodel User {\n  id                 String            @id\n  name               String\n  email              String\n  emailVerified      Boolean           @default(false)\n  role               Role              @default(CLIENT)\n  status             UserStatus        @default(ACTIVE)\n  needPasswordChange Boolean           @default(false)\n  isDeleted          Boolean           @default(false)\n  deletedAt          DateTime?\n  image              String?\n  createdAt          DateTime          @default(now())\n  updatedAt          DateTime          @updatedAt\n  sessions           Session[]\n  accounts           Account[]\n  client             Client?\n  expert             Expert?\n  admin              Admin?\n  notifications      Notification[]\n  messageReactions   MessageReaction[]\n  aiConversations    AIConversation[]\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel Call {\n  id     String   @id @default(uuid())\n  roomId String\n  room   ChatRoom @relation(fields: [roomId], references: [id], onDelete: Cascade)\n\n  status    CallStatus @default(PENDING)\n  startedAt DateTime?\n  endedAt   DateTime?\n  createdAt DateTime   @default(now())\n\n  participants CallParticipant[]\n\n  @@index([roomId])\n  @@map("calls")\n}\n\nmodel CallParticipant {\n  id     String @id @default(uuid())\n  callId String\n  call   Call   @relation(fields: [callId], references: [id], onDelete: Cascade)\n\n  userId String\n  role   UserRole\n\n  joinedAt DateTime?\n  leftAt   DateTime?\n\n  @@index([callId])\n  @@index([userId])\n  @@map("call_participants")\n}\n\nmodel ChatRoom {\n  id             String        @id @default(uuid())\n  consultationId String?       @db.Uuid\n  consultation   Consultation? @relation(fields: [consultationId], references: [id], onDelete: SetNull)\n\n  clientId String @db.Uuid\n  client   Client @relation("ClientChatRooms", fields: [clientId], references: [id], onDelete: Cascade)\n\n  expertId String @db.Uuid\n  expert   Expert @relation("ExpertChatRooms", fields: [expertId], references: [id], onDelete: Cascade)\n\n  messages Message[]\n  calls    Call[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([clientId, expertId])\n  @@index([consultationId])\n  @@index([clientId])\n  @@index([expertId])\n  @@map("chat_rooms")\n}\n\nmodel Client {\n  id           String  @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid\n  fullName     String\n  email        String  @unique\n  profilePhoto String?\n  phone        String?\n  address      String?\n\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n\n  // User Relation\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  // Relations\n  consultations Consultation[]\n  testimonials  Testimonial[]\n  chatRooms     ChatRoom[]     @relation("ClientChatRooms")\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([email], name: "idx_client_email")\n  @@index([isDeleted], name: "idx_client_isDeleted")\n  @@map("clients")\n}\n\nmodel Consultation {\n  id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid\n\n  videoCallId   String             @unique @db.Uuid()\n  status        ConsultationStatus @default(PENDING)\n  paymentStatus PaymentStatus      @default(UNPAID)\n\n  date DateTime\n\n  startedAt        DateTime?\n  endedAt          DateTime?\n  cancelledAt      DateTime?\n  cancelReason     String?\n  cancelledBy      Role?\n  rescheduledAt    DateTime?\n  rescheduleReason String?\n  rescheduledBy    Role?\n  sessionSummary   String?\n\n  // Relations\n  clientId String @db.Uuid\n  client   Client @relation(fields: [clientId], references: [id], onDelete: Cascade)\n\n  expertScheduleId String         @unique @db.Uuid\n  expertSchedule   ExpertSchedule @relation("ExpertScheduleToConsultation", fields: [expertScheduleId], references: [id])\n\n  payment     Payment?\n  testimonial Testimonial?\n  chatRooms   ChatRoom[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  expert    Expert?  @relation(fields: [expertId], references: [id])\n  expertId  String?  @db.Uuid\n\n  @@index([clientId])\n  @@index([expertScheduleId])\n  @@index([status])\n  @@map("consultations")\n}\n\nenum ConsultationStatus {\n  PENDING\n  CONFIRMED\n  ONGOING\n  COMPLETED\n  CANCELLED\n}\n\nenum PaymentStatus {\n  PAID\n  REFUNDED\n  FAILED\n  UNPAID\n}\n\nenum MessageType {\n  TEXT\n  FILE\n  SYSTEM\n}\n\nenum UserRole {\n  CLIENT\n  EXPERT\n  ADMIN\n}\n\nenum CallStatus {\n  PENDING\n  ACTIVE\n  ENDED\n}\n\nenum VerificationStatus {\n  PENDING\n  APPROVED\n  REJECTED\n}\n\nenum ReviewStatus {\n  PENDING\n  APPROVED\n  HIDDEN\n}\n\nenum Role {\n  ADMIN\n  EXPERT\n  CLIENT\n}\n\nenum UserStatus {\n  ACTIVE\n  BLOCKED\n  DELETED\n  SUSPENDED\n}\n\nenum AIChatMessageRole {\n  USER\n  ASSISTANT\n  SYSTEM\n}\n\nenum AIMessageFeedback {\n  LIKE\n  DISLIKE\n}\n\nmodel Expert {\n  id              String  @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid\n  fullName        String\n  email           String  @unique\n  profilePhoto    String?\n  phone           String?\n  bio             String?\n  title           String?\n  experience      Int     @default(0)\n  consultationFee Int\n  isVerified      Boolean @default(false)\n\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  industryId String   @db.Uuid\n  industry   Industry @relation(fields: [industryId], references: [id])\n\n  schedules     ExpertSchedule[]\n  consultations Consultation[]\n  testimonials  Testimonial[]\n  verification  ExpertVerification?\n  chatRooms     ChatRoom[]          @relation("ExpertChatRooms")\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("expert")\n}\n\nmodel ExpertSchedule {\n  id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid\n\n  expertId String @db.Uuid\n  expert   Expert @relation(fields: [expertId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  scheduleId String   @db.Uuid\n  schedule   Schedule @relation(fields: [scheduleId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  consultationId String?       @db.Uuid\n  consultation   Consultation? @relation("ExpertScheduleToConsultation")\n\n  isBooked    Boolean   @default(false)\n  isPublished Boolean   @default(false)\n  isDeleted   Boolean   @default(false)\n  deletedAt   DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([expertId, scheduleId])\n  @@index([expertId])\n  @@index([scheduleId])\n  @@map("expert_schedules")\n}\n\nmodel ExpertVerification {\n  id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid\n\n  expertId String @unique @db.Uuid\n  expert   Expert @relation(fields: [expertId], references: [id])\n\n  status     VerificationStatus @default(PENDING)\n  notes      String?\n  verifiedBy String?\n  verifiedAt DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("expert_verifications")\n}\n\n// model TeamMemberVerification {\n//     id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid\n\n//     teamMemberId String     @unique @db.Uuid\n//     teamMember   TeamMember @relation(fields: [teamMemberId], references: [id], onDelete: Cascade)\n\n//     status     VerificationStatus @default(PENDING)\n//     notes      String?\n//     verifiedBy String? // admin userId\n//     verifiedAt DateTime?\n\n//     createdAt DateTime @default(now())\n//     updatedAt DateTime @updatedAt\n\n//     @@map("team_member_verifications")\n// }\n\nmodel Industry {\n  id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid\n\n  name        String  @unique @db.VarChar(100)\n  description String? @db.Text\n  icon        String? @db.VarChar(255)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n\n  experts Expert[]\n\n  @@index([isDeleted], name: "idx_industry_isDeleted")\n  @@index([name], name: "idx_industry_name")\n  @@map("industries")\n}\n\nmodel Message {\n  id     String   @id @default(uuid())\n  roomId String\n  room   ChatRoom @relation(fields: [roomId], references: [id], onDelete: Cascade)\n\n  senderId   String\n  senderRole UserRole\n\n  type       MessageType       @default(TEXT)\n  text       String?\n  attachment Attachment?\n  reactions  MessageReaction[]\n\n  createdAt DateTime @default(now())\n\n  @@index([roomId])\n  @@index([senderId])\n  @@map("messages")\n}\n\nmodel MessageReaction {\n  id        String   @id @default(uuid())\n  messageId String\n  message   Message  @relation(fields: [messageId], references: [id], onDelete: Cascade)\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  emoji     String   @db.VarChar(32)\n  createdAt DateTime @default(now())\n\n  @@unique([messageId, userId, emoji])\n  @@index([messageId])\n  @@index([userId])\n  @@map("message_reactions")\n}\n\nmodel Notification {\n  id        String   @id @default(uuid())\n  type      String\n  message   String\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  createdAt DateTime @default(now())\n  read      Boolean  @default(false)\n}\n\nmodel Payment {\n  id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid\n\n  consultationId String       @unique @db.Uuid\n  consultation   Consultation @relation(fields: [consultationId], references: [id], onDelete: Cascade)\n\n  amount Float\n  status PaymentStatus @default(UNPAID)\n\n  transactionId      String  @unique\n  stripeEventId      String? @unique\n  paymentGatewayData Json?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([consultationId])\n  @@index([transactionId])\n  @@map("payments")\n}\n\n// model Payment {\n//     id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid\n\n//     projectId String\n//     project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)\n\n//     clientId String\n//     client   User   @relation(fields: [clientId], references: [id])\n\n//     amount Float\n//     status PaymentStatus @default(UNPAID)\n\n//     transactionId      String  @unique\n//     stripeEventId      String? @unique\n//     paymentGatewayData Json?\n\n//     createdAt DateTime @default(now())\n//     updatedAt DateTime @updatedAt\n\n//     @@index([projectId])\n//     @@index([transactionId])\n//     @@map("payments")\n// }\n\nmodel Schedule {\n  id            String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid\n  startDateTime DateTime\n  endDateTime   DateTime\n\n  expertSchedules ExpertSchedule[]\n\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("schedules")\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../src/generated"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Testimonial {\n  id      String       @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid\n  rating  Int\n  comment String?\n  status  ReviewStatus @default(PENDING)\n\n  expertReply     String?\n  expertRepliedAt DateTime?\n\n  clientId String @db.Uuid\n  client   Client @relation(fields: [clientId], references: [id])\n\n  expertId String @db.Uuid\n  expert   Expert @relation(fields: [expertId], references: [id])\n\n  consultationId String?       @unique @db.Uuid\n  consultation   Consultation? @relation(fields: [consultationId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("testimonials")\n}\n\nmodel TypingState {\n  id        String   @id @default(uuid())\n  roomId    String\n  userId    String\n  isTyping  Boolean  @default(false)\n  updatedAt DateTime @updatedAt\n\n  @@unique([roomId, userId])\n  @@index([roomId])\n  @@map("typing_states")\n}\n\nmodel UserPresence {\n  userId   String   @id\n  isOnline Boolean  @default(false)\n  lastSeen DateTime @default(now())\n\n  @@map("user_presence")\n}\n',
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
config.runtimeDataModel = JSON.parse('{"models":{"Admin":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"contactNumber","kind":"scalar","type":"String"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"AdminToUser"}],"dbName":"admin"},"AIConversation":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AIConversationToUser"},{"name":"title","kind":"scalar","type":"String"},{"name":"messages","kind":"object","type":"AIChatMessage","relationName":"AIChatMessageToAIConversation"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"ai_conversations"},"AIChatMessage":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"conversationId","kind":"scalar","type":"String"},{"name":"conversation","kind":"object","type":"AIConversation","relationName":"AIChatMessageToAIConversation"},{"name":"role","kind":"enum","type":"AIChatMessageRole"},{"name":"content","kind":"scalar","type":"String"},{"name":"model","kind":"scalar","type":"String"},{"name":"provider","kind":"scalar","type":"String"},{"name":"tokensUsed","kind":"scalar","type":"Int"},{"name":"latencyMs","kind":"scalar","type":"Int"},{"name":"feedback","kind":"enum","type":"AIMessageFeedback"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"ai_chat_messages"},"Attachment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"messageId","kind":"scalar","type":"String"},{"name":"message","kind":"object","type":"Message","relationName":"AttachmentToMessage"},{"name":"fileUrl","kind":"scalar","type":"String"},{"name":"fileName","kind":"scalar","type":"String"},{"name":"fileType","kind":"scalar","type":"String"},{"name":"fileSize","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"attachments"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"needPasswordChange","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"client","kind":"object","type":"Client","relationName":"ClientToUser"},{"name":"expert","kind":"object","type":"Expert","relationName":"ExpertToUser"},{"name":"admin","kind":"object","type":"Admin","relationName":"AdminToUser"},{"name":"notifications","kind":"object","type":"Notification","relationName":"NotificationToUser"},{"name":"messageReactions","kind":"object","type":"MessageReaction","relationName":"MessageReactionToUser"},{"name":"aiConversations","kind":"object","type":"AIConversation","relationName":"AIConversationToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Call":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"roomId","kind":"scalar","type":"String"},{"name":"room","kind":"object","type":"ChatRoom","relationName":"CallToChatRoom"},{"name":"status","kind":"enum","type":"CallStatus"},{"name":"startedAt","kind":"scalar","type":"DateTime"},{"name":"endedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"participants","kind":"object","type":"CallParticipant","relationName":"CallToCallParticipant"}],"dbName":"calls"},"CallParticipant":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"callId","kind":"scalar","type":"String"},{"name":"call","kind":"object","type":"Call","relationName":"CallToCallParticipant"},{"name":"userId","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"UserRole"},{"name":"joinedAt","kind":"scalar","type":"DateTime"},{"name":"leftAt","kind":"scalar","type":"DateTime"}],"dbName":"call_participants"},"ChatRoom":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"consultationId","kind":"scalar","type":"String"},{"name":"consultation","kind":"object","type":"Consultation","relationName":"ChatRoomToConsultation"},{"name":"clientId","kind":"scalar","type":"String"},{"name":"client","kind":"object","type":"Client","relationName":"ClientChatRooms"},{"name":"expertId","kind":"scalar","type":"String"},{"name":"expert","kind":"object","type":"Expert","relationName":"ExpertChatRooms"},{"name":"messages","kind":"object","type":"Message","relationName":"ChatRoomToMessage"},{"name":"calls","kind":"object","type":"Call","relationName":"CallToChatRoom"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"chat_rooms"},"Client":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"fullName","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"ClientToUser"},{"name":"consultations","kind":"object","type":"Consultation","relationName":"ClientToConsultation"},{"name":"testimonials","kind":"object","type":"Testimonial","relationName":"ClientToTestimonial"},{"name":"chatRooms","kind":"object","type":"ChatRoom","relationName":"ClientChatRooms"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"clients"},"Consultation":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"videoCallId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"ConsultationStatus"},{"name":"paymentStatus","kind":"enum","type":"PaymentStatus"},{"name":"date","kind":"scalar","type":"DateTime"},{"name":"startedAt","kind":"scalar","type":"DateTime"},{"name":"endedAt","kind":"scalar","type":"DateTime"},{"name":"cancelledAt","kind":"scalar","type":"DateTime"},{"name":"cancelReason","kind":"scalar","type":"String"},{"name":"cancelledBy","kind":"enum","type":"Role"},{"name":"rescheduledAt","kind":"scalar","type":"DateTime"},{"name":"rescheduleReason","kind":"scalar","type":"String"},{"name":"rescheduledBy","kind":"enum","type":"Role"},{"name":"sessionSummary","kind":"scalar","type":"String"},{"name":"clientId","kind":"scalar","type":"String"},{"name":"client","kind":"object","type":"Client","relationName":"ClientToConsultation"},{"name":"expertScheduleId","kind":"scalar","type":"String"},{"name":"expertSchedule","kind":"object","type":"ExpertSchedule","relationName":"ExpertScheduleToConsultation"},{"name":"payment","kind":"object","type":"Payment","relationName":"ConsultationToPayment"},{"name":"testimonial","kind":"object","type":"Testimonial","relationName":"ConsultationToTestimonial"},{"name":"chatRooms","kind":"object","type":"ChatRoom","relationName":"ChatRoomToConsultation"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"expert","kind":"object","type":"Expert","relationName":"ConsultationToExpert"},{"name":"expertId","kind":"scalar","type":"String"}],"dbName":"consultations"},"Expert":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"fullName","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"experience","kind":"scalar","type":"Int"},{"name":"consultationFee","kind":"scalar","type":"Int"},{"name":"isVerified","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"ExpertToUser"},{"name":"industryId","kind":"scalar","type":"String"},{"name":"industry","kind":"object","type":"Industry","relationName":"ExpertToIndustry"},{"name":"schedules","kind":"object","type":"ExpertSchedule","relationName":"ExpertToExpertSchedule"},{"name":"consultations","kind":"object","type":"Consultation","relationName":"ConsultationToExpert"},{"name":"testimonials","kind":"object","type":"Testimonial","relationName":"ExpertToTestimonial"},{"name":"verification","kind":"object","type":"ExpertVerification","relationName":"ExpertToExpertVerification"},{"name":"chatRooms","kind":"object","type":"ChatRoom","relationName":"ExpertChatRooms"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"expert"},"ExpertSchedule":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expertId","kind":"scalar","type":"String"},{"name":"expert","kind":"object","type":"Expert","relationName":"ExpertToExpertSchedule"},{"name":"scheduleId","kind":"scalar","type":"String"},{"name":"schedule","kind":"object","type":"Schedule","relationName":"ExpertScheduleToSchedule"},{"name":"consultationId","kind":"scalar","type":"String"},{"name":"consultation","kind":"object","type":"Consultation","relationName":"ExpertScheduleToConsultation"},{"name":"isBooked","kind":"scalar","type":"Boolean"},{"name":"isPublished","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"expert_schedules"},"ExpertVerification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expertId","kind":"scalar","type":"String"},{"name":"expert","kind":"object","type":"Expert","relationName":"ExpertToExpertVerification"},{"name":"status","kind":"enum","type":"VerificationStatus"},{"name":"notes","kind":"scalar","type":"String"},{"name":"verifiedBy","kind":"scalar","type":"String"},{"name":"verifiedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"expert_verifications"},"Industry":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"icon","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"experts","kind":"object","type":"Expert","relationName":"ExpertToIndustry"}],"dbName":"industries"},"Message":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"roomId","kind":"scalar","type":"String"},{"name":"room","kind":"object","type":"ChatRoom","relationName":"ChatRoomToMessage"},{"name":"senderId","kind":"scalar","type":"String"},{"name":"senderRole","kind":"enum","type":"UserRole"},{"name":"type","kind":"enum","type":"MessageType"},{"name":"text","kind":"scalar","type":"String"},{"name":"attachment","kind":"object","type":"Attachment","relationName":"AttachmentToMessage"},{"name":"reactions","kind":"object","type":"MessageReaction","relationName":"MessageToMessageReaction"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"messages"},"MessageReaction":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"messageId","kind":"scalar","type":"String"},{"name":"message","kind":"object","type":"Message","relationName":"MessageToMessageReaction"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"MessageReactionToUser"},{"name":"emoji","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"message_reactions"},"Notification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"type","kind":"scalar","type":"String"},{"name":"message","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"NotificationToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"read","kind":"scalar","type":"Boolean"}],"dbName":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"consultationId","kind":"scalar","type":"String"},{"name":"consultation","kind":"object","type":"Consultation","relationName":"ConsultationToPayment"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"stripeEventId","kind":"scalar","type":"String"},{"name":"paymentGatewayData","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"payments"},"Schedule":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"startDateTime","kind":"scalar","type":"DateTime"},{"name":"endDateTime","kind":"scalar","type":"DateTime"},{"name":"expertSchedules","kind":"object","type":"ExpertSchedule","relationName":"ExpertScheduleToSchedule"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"schedules"},"Testimonial":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"ReviewStatus"},{"name":"expertReply","kind":"scalar","type":"String"},{"name":"expertRepliedAt","kind":"scalar","type":"DateTime"},{"name":"clientId","kind":"scalar","type":"String"},{"name":"client","kind":"object","type":"Client","relationName":"ClientToTestimonial"},{"name":"expertId","kind":"scalar","type":"String"},{"name":"expert","kind":"object","type":"Expert","relationName":"ExpertToTestimonial"},{"name":"consultationId","kind":"scalar","type":"String"},{"name":"consultation","kind":"object","type":"Consultation","relationName":"ConsultationToTestimonial"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"testimonials"},"TypingState":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"roomId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"isTyping","kind":"scalar","type":"Boolean"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"typing_states"},"UserPresence":{"fields":[{"name":"userId","kind":"scalar","type":"String"},{"name":"isOnline","kind":"scalar","type":"Boolean"},{"name":"lastSeen","kind":"scalar","type":"DateTime"}],"dbName":"user_presence"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","client","experts","_count","industry","schedules","consultations","expert","consultation","testimonials","verification","room","message","attachment","reactions","messages","call","participants","calls","chatRooms","expertSchedules","schedule","expertSchedule","payment","testimonial","admin","notifications","messageReactions","conversation","aiConversations","Admin.findUnique","Admin.findUniqueOrThrow","Admin.findFirst","Admin.findFirstOrThrow","Admin.findMany","data","Admin.createOne","Admin.createMany","Admin.createManyAndReturn","Admin.updateOne","Admin.updateMany","Admin.updateManyAndReturn","create","update","Admin.upsertOne","Admin.deleteOne","Admin.deleteMany","having","_min","_max","Admin.groupBy","Admin.aggregate","AIConversation.findUnique","AIConversation.findUniqueOrThrow","AIConversation.findFirst","AIConversation.findFirstOrThrow","AIConversation.findMany","AIConversation.createOne","AIConversation.createMany","AIConversation.createManyAndReturn","AIConversation.updateOne","AIConversation.updateMany","AIConversation.updateManyAndReturn","AIConversation.upsertOne","AIConversation.deleteOne","AIConversation.deleteMany","AIConversation.groupBy","AIConversation.aggregate","AIChatMessage.findUnique","AIChatMessage.findUniqueOrThrow","AIChatMessage.findFirst","AIChatMessage.findFirstOrThrow","AIChatMessage.findMany","AIChatMessage.createOne","AIChatMessage.createMany","AIChatMessage.createManyAndReturn","AIChatMessage.updateOne","AIChatMessage.updateMany","AIChatMessage.updateManyAndReturn","AIChatMessage.upsertOne","AIChatMessage.deleteOne","AIChatMessage.deleteMany","_avg","_sum","AIChatMessage.groupBy","AIChatMessage.aggregate","Attachment.findUnique","Attachment.findUniqueOrThrow","Attachment.findFirst","Attachment.findFirstOrThrow","Attachment.findMany","Attachment.createOne","Attachment.createMany","Attachment.createManyAndReturn","Attachment.updateOne","Attachment.updateMany","Attachment.updateManyAndReturn","Attachment.upsertOne","Attachment.deleteOne","Attachment.deleteMany","Attachment.groupBy","Attachment.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Call.findUnique","Call.findUniqueOrThrow","Call.findFirst","Call.findFirstOrThrow","Call.findMany","Call.createOne","Call.createMany","Call.createManyAndReturn","Call.updateOne","Call.updateMany","Call.updateManyAndReturn","Call.upsertOne","Call.deleteOne","Call.deleteMany","Call.groupBy","Call.aggregate","CallParticipant.findUnique","CallParticipant.findUniqueOrThrow","CallParticipant.findFirst","CallParticipant.findFirstOrThrow","CallParticipant.findMany","CallParticipant.createOne","CallParticipant.createMany","CallParticipant.createManyAndReturn","CallParticipant.updateOne","CallParticipant.updateMany","CallParticipant.updateManyAndReturn","CallParticipant.upsertOne","CallParticipant.deleteOne","CallParticipant.deleteMany","CallParticipant.groupBy","CallParticipant.aggregate","ChatRoom.findUnique","ChatRoom.findUniqueOrThrow","ChatRoom.findFirst","ChatRoom.findFirstOrThrow","ChatRoom.findMany","ChatRoom.createOne","ChatRoom.createMany","ChatRoom.createManyAndReturn","ChatRoom.updateOne","ChatRoom.updateMany","ChatRoom.updateManyAndReturn","ChatRoom.upsertOne","ChatRoom.deleteOne","ChatRoom.deleteMany","ChatRoom.groupBy","ChatRoom.aggregate","Client.findUnique","Client.findUniqueOrThrow","Client.findFirst","Client.findFirstOrThrow","Client.findMany","Client.createOne","Client.createMany","Client.createManyAndReturn","Client.updateOne","Client.updateMany","Client.updateManyAndReturn","Client.upsertOne","Client.deleteOne","Client.deleteMany","Client.groupBy","Client.aggregate","Consultation.findUnique","Consultation.findUniqueOrThrow","Consultation.findFirst","Consultation.findFirstOrThrow","Consultation.findMany","Consultation.createOne","Consultation.createMany","Consultation.createManyAndReturn","Consultation.updateOne","Consultation.updateMany","Consultation.updateManyAndReturn","Consultation.upsertOne","Consultation.deleteOne","Consultation.deleteMany","Consultation.groupBy","Consultation.aggregate","Expert.findUnique","Expert.findUniqueOrThrow","Expert.findFirst","Expert.findFirstOrThrow","Expert.findMany","Expert.createOne","Expert.createMany","Expert.createManyAndReturn","Expert.updateOne","Expert.updateMany","Expert.updateManyAndReturn","Expert.upsertOne","Expert.deleteOne","Expert.deleteMany","Expert.groupBy","Expert.aggregate","ExpertSchedule.findUnique","ExpertSchedule.findUniqueOrThrow","ExpertSchedule.findFirst","ExpertSchedule.findFirstOrThrow","ExpertSchedule.findMany","ExpertSchedule.createOne","ExpertSchedule.createMany","ExpertSchedule.createManyAndReturn","ExpertSchedule.updateOne","ExpertSchedule.updateMany","ExpertSchedule.updateManyAndReturn","ExpertSchedule.upsertOne","ExpertSchedule.deleteOne","ExpertSchedule.deleteMany","ExpertSchedule.groupBy","ExpertSchedule.aggregate","ExpertVerification.findUnique","ExpertVerification.findUniqueOrThrow","ExpertVerification.findFirst","ExpertVerification.findFirstOrThrow","ExpertVerification.findMany","ExpertVerification.createOne","ExpertVerification.createMany","ExpertVerification.createManyAndReturn","ExpertVerification.updateOne","ExpertVerification.updateMany","ExpertVerification.updateManyAndReturn","ExpertVerification.upsertOne","ExpertVerification.deleteOne","ExpertVerification.deleteMany","ExpertVerification.groupBy","ExpertVerification.aggregate","Industry.findUnique","Industry.findUniqueOrThrow","Industry.findFirst","Industry.findFirstOrThrow","Industry.findMany","Industry.createOne","Industry.createMany","Industry.createManyAndReturn","Industry.updateOne","Industry.updateMany","Industry.updateManyAndReturn","Industry.upsertOne","Industry.deleteOne","Industry.deleteMany","Industry.groupBy","Industry.aggregate","Message.findUnique","Message.findUniqueOrThrow","Message.findFirst","Message.findFirstOrThrow","Message.findMany","Message.createOne","Message.createMany","Message.createManyAndReturn","Message.updateOne","Message.updateMany","Message.updateManyAndReturn","Message.upsertOne","Message.deleteOne","Message.deleteMany","Message.groupBy","Message.aggregate","MessageReaction.findUnique","MessageReaction.findUniqueOrThrow","MessageReaction.findFirst","MessageReaction.findFirstOrThrow","MessageReaction.findMany","MessageReaction.createOne","MessageReaction.createMany","MessageReaction.createManyAndReturn","MessageReaction.updateOne","MessageReaction.updateMany","MessageReaction.updateManyAndReturn","MessageReaction.upsertOne","MessageReaction.deleteOne","MessageReaction.deleteMany","MessageReaction.groupBy","MessageReaction.aggregate","Notification.findUnique","Notification.findUniqueOrThrow","Notification.findFirst","Notification.findFirstOrThrow","Notification.findMany","Notification.createOne","Notification.createMany","Notification.createManyAndReturn","Notification.updateOne","Notification.updateMany","Notification.updateManyAndReturn","Notification.upsertOne","Notification.deleteOne","Notification.deleteMany","Notification.groupBy","Notification.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","Schedule.findUnique","Schedule.findUniqueOrThrow","Schedule.findFirst","Schedule.findFirstOrThrow","Schedule.findMany","Schedule.createOne","Schedule.createMany","Schedule.createManyAndReturn","Schedule.updateOne","Schedule.updateMany","Schedule.updateManyAndReturn","Schedule.upsertOne","Schedule.deleteOne","Schedule.deleteMany","Schedule.groupBy","Schedule.aggregate","Testimonial.findUnique","Testimonial.findUniqueOrThrow","Testimonial.findFirst","Testimonial.findFirstOrThrow","Testimonial.findMany","Testimonial.createOne","Testimonial.createMany","Testimonial.createManyAndReturn","Testimonial.updateOne","Testimonial.updateMany","Testimonial.updateManyAndReturn","Testimonial.upsertOne","Testimonial.deleteOne","Testimonial.deleteMany","Testimonial.groupBy","Testimonial.aggregate","TypingState.findUnique","TypingState.findUniqueOrThrow","TypingState.findFirst","TypingState.findFirstOrThrow","TypingState.findMany","TypingState.createOne","TypingState.createMany","TypingState.createManyAndReturn","TypingState.updateOne","TypingState.updateMany","TypingState.updateManyAndReturn","TypingState.upsertOne","TypingState.deleteOne","TypingState.deleteMany","TypingState.groupBy","TypingState.aggregate","UserPresence.findUnique","UserPresence.findUniqueOrThrow","UserPresence.findFirst","UserPresence.findFirstOrThrow","UserPresence.findMany","UserPresence.createOne","UserPresence.createMany","UserPresence.createManyAndReturn","UserPresence.updateOne","UserPresence.updateMany","UserPresence.updateManyAndReturn","UserPresence.upsertOne","UserPresence.deleteOne","UserPresence.deleteMany","UserPresence.groupBy","UserPresence.aggregate","AND","OR","NOT","userId","isOnline","lastSeen","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","id","roomId","isTyping","updatedAt","roomId_userId","rating","comment","ReviewStatus","status","expertReply","expertRepliedAt","clientId","expertId","consultationId","createdAt","startDateTime","endDateTime","isDeleted","deletedAt","every","some","none","amount","PaymentStatus","transactionId","stripeEventId","paymentGatewayData","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","type","read","messageId","emoji","senderId","UserRole","senderRole","MessageType","text","name","description","icon","VerificationStatus","notes","verifiedBy","verifiedAt","scheduleId","isBooked","isPublished","fullName","email","profilePhoto","phone","bio","title","experience","consultationFee","isVerified","industryId","videoCallId","ConsultationStatus","paymentStatus","date","startedAt","endedAt","cancelledAt","cancelReason","Role","cancelledBy","rescheduledAt","rescheduleReason","rescheduledBy","sessionSummary","expertScheduleId","address","callId","role","joinedAt","leftAt","CallStatus","identifier","value","expiresAt","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","emailVerified","UserStatus","needPasswordChange","image","fileUrl","fileName","fileType","fileSize","conversationId","AIChatMessageRole","content","model","provider","tokensUsed","latencyMs","AIMessageFeedback","feedback","contactNumber","messageId_userId_emoji","clientId_expertId","expertId_scheduleId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "-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_QcAIAsAAKMJACAOAACkCQAgDwAA2AoAIBgAAKUJACDeAwAA5wYAIIIEAADnBgAggwQAAOcGACCEBAAA5wYAIIUEAADnBgAgGgMAAIEGACAJAADUBgAgCgAA0wUAIAsAAIIGACAOAACDBgAgDwAA1QYAIBgAAIQGACC7AwAA0wYAMLwDAAARABC9AwAA0wYAML4DAQAAAAHMAwEAAAABzwNAALkFACHaA0AAuQUAId0DIAC4BQAh3gNAANIFACGABAEAtwUAIYEEAQAAAAGCBAEA7QUAIYMEAQDtBQAhhAQBAO0FACGFBAEA7QUAIYYEAgCjBgAhhwQCAKMGACGIBCAAuAUAIYkEAQDRBQAhAwAAABEAIAEAABIAMAIAABMAIAEAAAARACAQDAAA9QUAIA0AAMkGACAaAADSBgAguwMAANEGADC8AwAAFgAQvQMAANEGADDMAwEA0QUAIc8DQAC5BQAh2AMBANEFACHZAwEAyAYAIdoDQAC5BQAh3QMgALgFACHeA0AA0gUAIf0DAQDRBQAh_gMgALgFACH_AyAAuAUAIQUMAADuCAAgDQAAhQgAIBoAANYKACDZAwAA5wYAIN4DAADnBgAgEQwAAPUFACANAADJBgAgGgAA0gYAILsDAADRBgAwvAMAABYAEL0DAADRBgAwzAMBAAAAAc8DQAC5BQAh2AMBANEFACHZAwEAyAYAIdoDQAC5BQAh3QMgALgFACHeA0AA0gUAIf0DAQDRBQAh_gMgALgFACH_AyAAuAUAIcIEAADQBgAgAwAAABYAIAEAABcAMAIAABgAIAMAAAANACABAAAOADACAAAPACARBgAAygYAIAwAAPUFACANAADJBgAguwMAAM4GADC8AwAAGwAQvQMAAM4GADDMAwEA0QUAIc8DQAC5BQAh0QMCAKMGACHSAwEA7QUAIdQDAADPBtQDItUDAQDtBQAh1gNAANIFACHXAwEA0QUAIdgDAQDRBQAh2QMBAMgGACHaA0AAuQUAIQcGAACwCgAgDAAA7ggAIA0AAIUIACDSAwAA5wYAINUDAADnBgAg1gMAAOcGACDZAwAA5wYAIBEGAADKBgAgDAAA9QUAIA0AAMkGACC7AwAAzgYAMLwDAAAbABC9AwAAzgYAMMwDAQAAAAHPA0AAuQUAIdEDAgCjBgAh0gMBAO0FACHUAwAAzwbUAyLVAwEA7QUAIdYDQADSBQAh1wMBANEFACHYAwEA0QUAIdkDAQAAAAHaA0AAuQUAIQMAAAAbACABAAAcADACAAAdACABAAAADQAgDAwAAPUFACC7AwAA8wUAMLwDAAAgABC9AwAA8wUAMMwDAQDRBQAhzwNAALkFACHUAwAA9AX6AyLYAwEA0QUAIdoDQAC5BQAh-gMBAO0FACH7AwEA7QUAIfwDQADSBQAhAQAAACAAIA4GAADKBgAgDAAA9QUAIA0AAMkGACAUAADLBgAgFwAAzAYAILsDAADHBgAwvAMAACIAEL0DAADHBgAwzAMBALcFACHPA0AAuQUAIdcDAQDRBQAh2AMBANEFACHZAwEAyAYAIdoDQAC5BQAhBgYAALAKACAMAADuCAAgDQAAhQgAIBQAANQKACAXAADVCgAg2QMAAOcGACAPBgAAygYAIAwAAPUFACANAADJBgAgFAAAywYAIBcAAMwGACC7AwAAxwYAMLwDAAAiABC9AwAAxwYAMMwDAQAAAAHPA0AAuQUAIdcDAQDRBQAh2AMBANEFACHZAwEAyAYAIdoDQAC5BQAhwQQAAMYGACADAAAAIgAgAQAAIwAwAgAAJAAgAQAAAA0AIA0QAAC_BgAgEgAAxQYAIBMAAJ8GACC7AwAAwwYAMLwDAAAnABC9AwAAwwYAMMwDAQC3BQAhzQMBALcFACHaA0AAuQUAIe0DAADEBvUDIvEDAQC3BQAh8wMAALsG8wMi9QMBAO0FACEEEAAA0QoAIBIAANMKACATAACzCgAg9QMAAOcGACANEAAAvwYAIBIAAMUGACATAACfBgAguwMAAMMGADC8AwAAJwAQvQMAAMMGADDMAwEAAAABzQMBALcFACHaA0AAuQUAIe0DAADEBvUDIvEDAQC3BQAh8wMAALsG8wMi9QMBAO0FACEDAAAAJwAgAQAAKAAwAgAAKQAgCxEAAKQGACC7AwAAogYAMLwDAAArABC9AwAAogYAMMwDAQC3BQAh2gNAALkFACHvAwEAtwUAIbIEAQC3BQAhswQBALcFACG0BAEAtwUAIbUEAgCjBgAhAQAAACsAIAoDAACBBgAgEQAApAYAILsDAADCBgAwvAMAAC0AEL0DAADCBgAwvgMBALcFACHMAwEAtwUAIdoDQAC5BQAh7wMBALcFACHwAwEAtwUAIQIDAACiCQAgEQAAvAoAIAsDAACBBgAgEQAApAYAILsDAADCBgAwvAMAAC0AEL0DAADCBgAwvgMBALcFACHMAwEAAAAB2gNAALkFACHvAwEAtwUAIfADAQC3BQAhwAQAAMEGACADAAAALQAgAQAALgAwAgAALwAgAQAAAC0AIAsQAAC_BgAgFgAAwAYAILsDAAC9BgAwvAMAADIAEL0DAAC9BgAwzAMBALcFACHNAwEAtwUAIdQDAAC-Bp8EItoDQAC5BQAhjgRAANIFACGPBEAA0gUAIQQQAADRCgAgFgAA0goAII4EAADnBgAgjwQAAOcGACALEAAAvwYAIBYAAMAGACC7AwAAvQYAMLwDAAAyABC9AwAAvQYAMMwDAQAAAAHNAwEAtwUAIdQDAAC-Bp8EItoDQAC5BQAhjgRAANIFACGPBEAA0gUAIQMAAAAyACABAAAzADACAAA0ACAKFQAAvAYAILsDAAC6BgAwvAMAADYAEL0DAAC6BgAwvgMBALcFACHMAwEAtwUAIZoEAQC3BQAhmwQAALsG8wMinARAANIFACGdBEAA0gUAIQMVAADQCgAgnAQAAOcGACCdBAAA5wYAIAoVAAC8BgAguwMAALoGADC8AwAANgAQvQMAALoGADC-AwEAtwUAIcwDAQAAAAGaBAEAtwUAIZsEAAC7BvMDIpwEQADSBQAhnQRAANIFACEDAAAANgAgAQAANwAwAgAAOAAgAQAAADYAIAEAAAAnACABAAAAMgAgAQAAABYAIAEAAAANACABAAAAGwAgAQAAACIAIAMAAAAWACABAAAXADACAAAYACABAAAAFgAgAQAAAA0AIA0NAADhBQAguwMAAN0FADC8AwAARAAQvQMAAN0FADDMAwEA0QUAIc8DQAC5BQAh1AMAAN8F5AMi2QMBANEFACHaA0AAuQUAIeIDCADeBQAh5AMBALcFACHlAwEA7QUAIeYDAADgBQAgAQAAAEQAIAEAAAAbACADAAAAIgAgAQAAIwAwAgAAJAAgAQAAABEAIAEAAAAiACADAAAAGwAgAQAAHAAwAgAAHQAgAwAAACIAIAEAACMAMAIAACQAIAEAAAANACABAAAAGwAgAQAAACIAIAEAAAARACAOAwAAgQYAILsDAAC5BgAwvAMAAFAAEL0DAAC5BgAwvgMBALcFACHMAwEAtwUAIc8DQAC5BQAh2gNAALkFACHdAyAAuAUAId4DQADSBQAh9gMBALcFACGBBAEAtwUAIYIEAQDtBQAhvwQBAO0FACEBAAAAUAAgCgMAAIEGACARAQC3BQAhuwMAALgGADC8AwAAUgAQvQMAALgGADC-AwEAtwUAIcwDAQC3BQAh2gNAALkFACHtAwEAtwUAIe4DIAC4BQAhAQMAAKIJACAKAwAAgQYAIBEBALcFACG7AwAAuAYAMLwDAABSABC9AwAAuAYAML4DAQC3BQAhzAMBAAAAAdoDQAC5BQAh7QMBALcFACHuAyAAuAUAIQMAAABSACABAABTADACAABUACADAAAALQAgAQAALgAwAgAALwAgCgMAAIEGACAUAAC3BgAguwMAALYGADC8AwAAVwAQvQMAALYGADC-AwEAtwUAIcwDAQDRBQAhzwNAALkFACHaA0AAuQUAIYUEAQC3BQAhAgMAAKIJACAUAADPCgAgCgMAAIEGACAUAAC3BgAguwMAALYGADC8AwAAVwAQvQMAALYGADC-AwEAtwUAIcwDAQAAAAHPA0AAuQUAIdoDQAC5BQAhhQQBALcFACEDAAAAVwAgAQAAWAAwAgAAWQAgDiEAALUGACC7AwAAsQYAMLwDAABbABC9AwAAsQYAMMwDAQDRBQAh2gNAALkFACGbBAAAsga4BCK2BAEA0QUAIbgEAQC3BQAhuQQBAO0FACG6BAEA7QUAIbsEAgCzBgAhvAQCALMGACG-BAAAtAa-BCMGIQAAzgoAILkEAADnBgAgugQAAOcGACC7BAAA5wYAILwEAADnBgAgvgQAAOcGACAOIQAAtQYAILsDAACxBgAwvAMAAFsAEL0DAACxBgAwzAMBAAAAAdoDQAC5BQAhmwQAALIGuAQitgQBANEFACG4BAEAtwUAIbkEAQDtBQAhugQBAO0FACG7BAIAswYAIbwEAgCzBgAhvgQAALQGvgQjAwAAAFsAIAEAAFwAMAIAAF0AIAEAAABbACABAAAAAwAgAQAAAAcAIAEAAABSACABAAAALQAgAQAAAFcAIAEAAAABACAEAwAAogkAIN4DAADnBgAgggQAAOcGACC_BAAA5wYAIAMAAABQACABAABmADACAAABACADAAAAUAAgAQAAZgAwAgAAAQAgAwAAAFAAIAEAAGYAMAIAAAEAIAsDAADNCgAgvgMBAAAAAcwDAQAAAAHPA0AAAAAB2gNAAAAAAd0DIAAAAAHeA0AAAAAB9gMBAAAAAYEEAQAAAAGCBAEAAAABvwQBAAAAAQEoAABqACAKvgMBAAAAAcwDAQAAAAHPA0AAAAAB2gNAAAAAAd0DIAAAAAHeA0AAAAAB9gMBAAAAAYEEAQAAAAGCBAEAAAABvwQBAAAAAQEoAABsADABKAAAbAAwCwMAAMwKACC-AwEA4QYAIcwDAQDhBgAhzwNAAOMGACHaA0AA4wYAId0DIADiBgAh3gNAAPAGACH2AwEA4QYAIYEEAQDhBgAhggQBAO4GACG_BAEA7gYAIQIAAAABACAoAABvACAKvgMBAOEGACHMAwEA4QYAIc8DQADjBgAh2gNAAOMGACHdAyAA4gYAId4DQADwBgAh9gMBAOEGACGBBAEA4QYAIYIEAQDuBgAhvwQBAO4GACECAAAAUAAgKAAAcQAgAgAAAFAAICgAAHEAIAMAAAABACAvAABqACAwAABvACABAAAAAQAgAQAAAFAAIAYIAADJCgAgNQAAywoAIDYAAMoKACDeAwAA5wYAIIIEAADnBgAgvwQAAOcGACANuwMAALAGADC8AwAAeAAQvQMAALAGADC-AwEArAUAIcwDAQCsBQAhzwNAAK4FACHaA0AArgUAId0DIACtBQAh3gNAAMIFACH2AwEArAUAIYEEAQCsBQAhggQBAMAFACG_BAEAwAUAIQMAAABQACABAAB3ADA0AAB4ACADAAAAUAAgAQAAZgAwAgAAAQAgAQAAAFkAIAEAAABZACADAAAAVwAgAQAAWAAwAgAAWQAgAwAAAFcAIAEAAFgAMAIAAFkAIAMAAABXACABAABYADACAABZACAHAwAAyAoAIBQAAOkJACC-AwEAAAABzAMBAAAAAc8DQAAAAAHaA0AAAAABhQQBAAAAAQEoAACAAQAgBb4DAQAAAAHMAwEAAAABzwNAAAAAAdoDQAAAAAGFBAEAAAABASgAAIIBADABKAAAggEAMAcDAADHCgAgFAAA2AkAIL4DAQDhBgAhzAMBAOEGACHPA0AA4wYAIdoDQADjBgAhhQQBAOEGACECAAAAWQAgKAAAhQEAIAW-AwEA4QYAIcwDAQDhBgAhzwNAAOMGACHaA0AA4wYAIYUEAQDhBgAhAgAAAFcAICgAAIcBACACAAAAVwAgKAAAhwEAIAMAAABZACAvAACAAQAgMAAAhQEAIAEAAABZACABAAAAVwAgAwgAAMQKACA1AADGCgAgNgAAxQoAIAi7AwAArwYAMLwDAACOAQAQvQMAAK8GADC-AwEArAUAIcwDAQC-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_AQAgFwQAAJkGACAFAACaBgAgBgAAmwYAIAwAAJwGACAeAACdBgAgHwAAngYAICAAAJ8GACAiAACgBgAguwMAAJYGADC8AwAAwgEAEL0DAACWBgAwzAMBALcFACHPA0AAuQUAIdQDAACYBrAEItoDQAC5BQAh3QMgALgFACHeA0AA0gUAIfYDAQC3BQAhgQQBALcFACGbBAAAlwaTBCKuBCAAuAUAIbAEIAC4BQAhsQQBAO0FACEKBAAArgoAIAUAAK8KACAGAACwCgAgDAAA7ggAIB4AALEKACAfAACyCgAgIAAAswoAICIAALQKACDeAwAA5wYAILEEAADnBgAgAwAAAMIBACABAADDAQAwAgAAvwEAIAMAAADCAQAgAQAAwwEAMAIAAL8BACADAAAAwgEAIAEAAMMBADACAAC_AQAgFAQAAKYKACAFAACnCgAgBgAAqAoAIAwAAKkKACAeAACqCgAgHwAAqwoAICAAAKwKACAiAACtCgAgzAMBAAAAAc8DQAAAAAHUAwAAALAEAtoDQAAAAAHdAyAAAAAB3gNAAAAAAfYDAQAAAAGBBAEAAAABmwQAAACTBAKuBCAAAAABsAQgAAAAAbEEAQAAAAEBKAAAxwEAIAzMAwEAAAABzwNAAAAAAdQDAAAAsAQC2gNAAAAAAd0DIAAAAAHeA0AAAAAB9gMBAAAAAYEEAQAAAAGbBAAAAJMEAq4EIAAAAAGwBCAAAAABsQQBAAAAAQEoAADJAQAwASgAAMkBADAUBAAAxQkAIAUAAMYJACAGAADHCQAgDAAAyAkAIB4AAMkJACAfAADKCQAgIAAAywkAICIAAMwJACDMAwEA4QYAIc8DQADjBgAh1AMAAMQJsAQi2gNAAOMGACHdAyAA4gYAId4DQADwBgAh9gMBAOEGACGBBAEA4QYAIZsEAADDCZMEIq4EIADiBgAhsAQgAOIGACGxBAEA7gYAIQIAAAC_AQAgKAAAzAEAIAzMAwEA4QYAIc8DQADjBgAh1AMAAMQJsAQi2gNAAOMGACHdAyAA4gYAId4DQADwBgAh9gMBAOEGACGBBAEA4QYAIZsEAADDCZMEIq4EIADiBgAhsAQgAOIGACGxBAEA7gYAIQIAAADCAQAgKAAAzgEAIAIAAADCAQAgKAAAzgEAIAMAAAC_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_BwAgzAMBAAAAAc0DAQAAAAHUAwAAAJ8EAtoDQAAAAAGOBEAAAAABjwRAAAAAAQEoAACiAgAgBswDAQAAAAHNAwEAAAAB1AMAAACfBALaA0AAAAABjgRAAAAAAY8EQAAAAAEBKAAApAIAMAEoAACkAgAwCBAAALEJACAWAACwBwAgzAMBAOEGACHNAwEA4QYAIdQDAACuB58EItoDQADjBgAhjgRAAPAGACGPBEAA8AYAIQIAAAA0ACAoAACnAgAgBswDAQDhBgAhzQMBAOEGACHUAwAArgefBCLaA0AA4wYAIY4EQADwBgAhjwRAAPAGACECAAAAMgAgKAAAqQIAIAIAAAAyACAoAACpAgAgAwAAADQAIC8AAKICACAwAACnAgAgAQAAADQAIAEAAAAyACAFCAAArgkAIDUAALAJACA2AACvCQAgjgQAAOcGACCPBAAA5wYAIAm7AwAAhwYAMLwDAACwAgAQvQMAAIcGADDMAwEArAUAIc0DAQCsBQAh1AMAAIgGnwQi2gNAAK4FACGOBEAAwgUAIY8EQADCBQAhAwAAADIAIAEAAK8CADA0AACwAgAgAwAAADIAIAEAADMAMAIAADQAIAEAAAA4ACABAAAAOAAgAwAAADYAIAEAADcAMAIAADgAIAMAAAA2ACABAAA3ADACAAA4ACADAAAANgAgAQAANwAwAgAAOAAgBxUAAK0JACC-AwEAAAABzAMBAAAAAZoEAQAAAAGbBAAAAPMDApwEQAAAAAGdBEAAAAABASgAALgCACAGvgMBAAAAAcwDAQAAAAGaBAEAAAABmwQAAADzAwKcBEAAAAABnQRAAAAAAQEoAAC6AgAwASgAALoCADAHFQAArAkAIL4DAQDhBgAhzAMBAOEGACGaBAEA4QYAIZsEAAC7B_MDIpwEQADwBgAhnQRAAPAGACECAAAAOAAgKAAAvQIAIAa-AwEA4QYAIcwDAQDhBgAhmgQBAOEGACGbBAAAuwfzAyKcBEAA8AYAIZ0EQADwBgAhAgAAADYAICgAAL8CACACAAAANgAgKAAAvwIAIAMAAAA4ACAvAAC4AgAgMAAAvQIAIAEAAAA4ACABAAAANgAgBQgAAKkJACA1AACrCQAgNgAAqgkAIJwEAADnBgAgnQQAAOcGACAJuwMAAIYGADC8AwAAxgIAEL0DAACGBgAwvgMBAKwFACHMAwEArAUAIZoEAQCsBQAhmwQAAOUF8wMinARAAMIFACGdBEAAwgUAIQMAAAA2ACABAADFAgAwNAAAxgIAIAMAAAA2ACABAAA3ADACAAA4ACABAAAAJAAgAQAAACQAIAMAAAAiACABAAAjADACAAAkACADAAAAIgAgAQAAIwAwAgAAJAAgAwAAACIAIAEAACMAMAIAACQAIAsGAADlBwAgDAAA5gcAIA0AALQIACAUAADnBwAgFwAA6AcAIMwDAQAAAAHPA0AAAAAB1wMBAAAAAdgDAQAAAAHZAwEAAAAB2gNAAAAAAQEoAADOAgAgBswDAQAAAAHPA0AAAAAB1wMBAAAAAdgDAQAAAAHZAwEAAAAB2gNAAAAAAQEoAADQAgAwASgAANACADABAAAADQAgCwYAAKAHACAMAAChBwAgDQAAsggAIBQAAKIHACAXAACjBwAgzAMBAOEGACHPA0AA4wYAIdcDAQDhBgAh2AMBAOEGACHZAwEA7gYAIdoDQADjBgAhAgAAACQAICgAANQCACAGzAMBAOEGACHPA0AA4wYAIdcDAQDhBgAh2AMBAOEGACHZAwEA7gYAIdoDQADjBgAhAgAAACIAICgAANYCACACAAAAIgAgKAAA1gIAIAEAAAANACADAAAAJAAgLwAAzgIAIDAAANQCACABAAAAJAAgAQAAACIAIAQIAACmCQAgNQAAqAkAIDYAAKcJACDZAwAA5wYAIAm7AwAAhQYAMLwDAADeAgAQvQMAAIUGADDMAwEArAUAIc8DQACuBQAh1wMBAL4FACHYAwEAvgUAIdkDAQDDBQAh2gNAAK4FACEDAAAAIgAgAQAA3QIAMDQAAN4CACADAAAAIgAgAQAAIwAwAgAAJAAgEgMAAIEGACALAACCBgAgDgAAgwYAIBgAAIQGACC7AwAAgAYAMLwDAAALABC9AwAAgAYAML4DAQAAAAHMAwEAAAABzwNAALkFACHaA0AAuQUAId0DIAC4BQAh3gNAANIFACGABAEAtwUAIYEEAQAAAAGCBAEA7QUAIYMEAQDtBQAhmQQBAO0FACEBAAAA4QIAIAEAAADhAgAgCAMAAKIJACALAACjCQAgDgAApAkAIBgAAKUJACDeAwAA5wYAIIIEAADnBgAggwQAAOcGACCZBAAA5wYAIAMAAAALACABAADkAgAwAgAA4QIAIAMAAAALACABAADkAgAwAgAA4QIAIAMAAAALACABAADkAgAwAgAA4QIAIA8DAACeCQAgCwAAnwkAIA4AAKAJACAYAAChCQAgvgMBAAAAAcwDAQAAAAHPA0AAAAAB2gNAAAAAAd0DIAAAAAHeA0AAAAABgAQBAAAAAYEEAQAAAAGCBAEAAAABgwQBAAAAAZkEAQAAAAEBKAAA6AIAIAu-AwEAAAABzAMBAAAAAc8DQAAAAAHaA0AAAAAB3QMgAAAAAd4DQAAAAAGABAEAAAABgQQBAAAAAYIEAQAAAAGDBAEAAAABmQQBAAAAAQEoAADqAgAwASgAAOoCADAPAwAA_wgAIAsAAIAJACAOAACBCQAgGAAAggkAIL4DAQDhBgAhzAMBAOEGACHPA0AA4wYAIdoDQADjBgAh3QMgAOIGACHeA0AA8AYAIYAEAQDhBgAhgQQBAOEGACGCBAEA7gYAIYMEAQDuBgAhmQQBAO4GACECAAAA4QIAICgAAO0CACALvgMBAOEGACHMAwEA4QYAIc8DQADjBgAh2gNAAOMGACHdAyAA4gYAId4DQADwBgAhgAQBAOEGACGBBAEA4QYAIYIEAQDuBgAhgwQBAO4GACGZBAEA7gYAIQIAAAALACAoAADvAgAgAgAAAAsAICgAAO8CACADAAAA4QIAIC8AAOgCACAwAADtAgAgAQAAAOECACABAAAACwAgBwgAAPwIACA1AAD-CAAgNgAA_QgAIN4DAADnBgAgggQAAOcGACCDBAAA5wYAIJkEAADnBgAgDrsDAAD_BQAwvAMAAPYCABC9AwAA_wUAML4DAQCsBQAhzAMBAL4FACHPA0AArgUAIdoDQACuBQAh3QMgAK0FACHeA0AAwgUAIYAEAQCsBQAhgQQBAKwFACGCBAEAwAUAIYMEAQDABQAhmQQBAMAFACEDAAAACwAgAQAA9QIAMDQAAPYCACADAAAACwAgAQAA5AIAMAIAAOECACABAAAADwAgAQAAAA8AIAMAAAANACABAAAOADACAAAPACADAAAADQAgAQAADgAwAgAADwAgAwAAAA0AIAEAAA4AMAIAAA8AIBkGAAD0BwAgDAAA-AcAIBgAAPcHACAbAADUCAAgHAAA9QcAIB0AAPYHACDMAwEAAAABzwNAAAAAAdQDAAAAjAQC1wMBAAAAAdgDAQAAAAHaA0AAAAABigQBAAAAAYwEAAAA5AMCjQRAAAAAAY4EQAAAAAGPBEAAAAABkARAAAAAAZEEAQAAAAGTBAAAAJMEA5QEQAAAAAGVBAEAAAABlgQAAACTBAOXBAEAAAABmAQBAAAAAQEoAAD-AgAgE8wDAQAAAAHPA0AAAAAB1AMAAACMBALXAwEAAAAB2AMBAAAAAdoDQAAAAAGKBAEAAAABjAQAAADkAwKNBEAAAAABjgRAAAAAAY8EQAAAAAGQBEAAAAABkQQBAAAAAZMEAAAAkwQDlARAAAAAAZUEAQAAAAGWBAAAAJMEA5cEAQAAAAGYBAEAAAABASgAAIADADABKAAAgAMAMAEAAAARACAZBgAAkAcAIAwAAJQHACAYAACTBwAgGwAA0ggAIBwAAJEHACAdAACSBwAgzAMBAOEGACHPA0AA4wYAIdQDAACNB4wEItcDAQDhBgAh2AMBAO4GACHaA0AA4wYAIYoEAQDhBgAhjAQAAI4H5AMijQRAAOMGACGOBEAA8AYAIY8EQADwBgAhkARAAPAGACGRBAEA7gYAIZMEAACPB5MEI5QEQADwBgAhlQQBAO4GACGWBAAAjweTBCOXBAEA7gYAIZgEAQDhBgAhAgAAAA8AICgAAIQDACATzAMBAOEGACHPA0AA4wYAIdQDAACNB4wEItcDAQDhBgAh2AMBAO4GACHaA0AA4wYAIYoEAQDhBgAhjAQAAI4H5AMijQRAAOMGACGOBEAA8AYAIY8EQADwBgAhkARAAPAGACGRBAEA7gYAIZMEAACPB5MEI5QEQADwBgAhlQQBAO4GACGWBAAAjweTBCOXBAEA7gYAIZgEAQDhBgAhAgAAAA0AICgAAIYDACACAAAADQAgKAAAhgMAIAEAAAARACADAAAADwAgLwAA_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-AyAAAAAB_wMgAAAAAQEoAACsAwAgCswDAQAAAAHPA0AAAAAB2AMBAAAAAdkDAQAAAAHaA0AAAAAB3QMgAAAAAd4DQAAAAAH9AwEAAAAB_gMgAAAAAf8DIAAAAAEBKAAArgMAMAEoAACuAwAwDQwAAIYHACANAACHBwAgGgAA3QgAIMwDAQDhBgAhzwNAAOMGACHYAwEA4QYAIdkDAQDuBgAh2gNAAOMGACHdAyAA4gYAId4DQADwBgAh_QMBAOEGACH-AyAA4gYAIf8DIADiBgAhAgAAABgAICgAALEDACAKzAMBAOEGACHPA0AA4wYAIdgDAQDhBgAh2QMBAO4GACHaA0AA4wYAId0DIADiBgAh3gNAAPAGACH9AwEA4QYAIf4DIADiBgAh_wMgAOIGACECAAAAFgAgKAAAswMAIAIAAAAWACAoAACzAwAgAwAAABgAIC8AAKwDACAwAACxAwAgAQAAABgAIAEAAAAWACAFCAAA7wgAIDUAAPEIACA2AADwCAAg2QMAAOcGACDeAwAA5wYAIA27AwAA9gUAMLwDAAC6AwAQvQMAAPYFADDMAwEAvgUAIc8DQACuBQAh2AMBAL4FACHZAwEAwwUAIdoDQACuBQAh3QMgAK0FACHeA0AAwgUAIf0DAQC-BQAh_gMgAK0FACH_AyAArQUAIQMAAAAWACABAAC5AwAwNAAAugMAIAMAAAAWACABAAAXADACAAAYACAMDAAA9QUAILsDAADzBQAwvAMAACAAEL0DAADzBQAwzAMBAAAAAc8DQAC5BQAh1AMAAPQF-gMi2AMBAAAAAdoDQAC5BQAh-gMBAO0FACH7AwEA7QUAIfwDQADSBQAhAQAAAL0DACABAAAAvQMAIAQMAADuCAAg-gMAAOcGACD7AwAA5wYAIPwDAADnBgAgAwAAACAAIAEAAMADADACAAC9AwAgAwAAACAAIAEAAMADADACAAC9AwAgAwAAACAAIAEAAMADADACAAC9AwAgCQwAAO0IACDMAwEAAAABzwNAAAAAAdQDAAAA-gMC2AMBAAAAAdoDQAAAAAH6AwEAAAAB-wMBAAAAAfwDQAAAAAEBKAAAxAMAIAjMAwEAAAABzwNAAAAAAdQDAAAA-gMC2AMBAAAAAdoDQAAAAAH6AwEAAAAB-wMBAAAAAfwDQAAAAAEBKAAAxgMAMAEoAADGAwAwCQwAAOwIACDMAwEA4QYAIc8DQADjBgAh1AMAALoI-gMi2AMBAOEGACHaA0AA4wYAIfoDAQDuBgAh-wMBAO4GACH8A0AA8AYAIQIAAAC9AwAgKAAAyQMAIAjMAwEA4QYAIc8DQADjBgAh1AMAALoI-gMi2AMBAOEGACHaA0AA4wYAIfoDAQDuBgAh-wMBAO4GACH8A0AA8AYAIQIAAAAgACAoAADLAwAgAgAAACAAICgAAMsDACADAAAAvQMAIC8AAMQDACAwAADJAwAgAQAAAL0DACABAAAAIAAgBggAAOkIACA1AADrCAAgNgAA6ggAIPoDAADnBgAg-wMAAOcGACD8AwAA5wYAIAu7AwAA7wUAMLwDAADSAwAQvQMAAO8FADDMAwEAvgUAIc8DQACuBQAh1AMAAPAF-gMi2AMBAL4FACHaA0AArgUAIfoDAQDABQAh-wMBAMAFACH8A0AAwgUAIQMAAAAgACABAADRAwAwNAAA0gMAIAMAAAAgACABAADAAwAwAgAAvQMAIAwHAADuBQAguwMAAOwFADC8AwAA2AMAEL0DAADsBQAwzAMBAAAAAc8DQAC5BQAh2gNAALkFACHdAyAAuAUAId4DQADSBQAh9gMBAAAAAfcDAQDtBQAh-AMBAO0FACEBAAAA1QMAIAEAAADVAwAgDAcAAO4FACC7AwAA7AUAMLwDAADYAwAQvQMAAOwFADDMAwEA0QUAIc8DQAC5BQAh2gNAALkFACHdAyAAuAUAId4DQADSBQAh9gMBALcFACH3AwEA7QUAIfgDAQDtBQAhBAcAAOgIACDeAwAA5wYAIPcDAADnBgAg-AMAAOcGACADAAAA2AMAIAEAANkDADACAADVAwAgAwAAANgDACABAADZAwAwAgAA1QMAIAMAAADYAwAgAQAA2QMAMAIAANUDACAJBwAA5wgAIMwDAQAAAAHPA0AAAAAB2gNAAAAAAd0DIAAAAAHeA0AAAAAB9gMBAAAAAfcDAQAAAAH4AwEAAAABASgAAN0DACAIzAMBAAAAAc8DQAAAAAHaA0AAAAAB3QMgAAAAAd4DQAAAAAH2AwEAAAAB9wMBAAAAAfgDAQAAAAEBKAAA3wMAMAEoAADfAwAwCQcAAJgIACDMAwEA4QYAIc8DQADjBgAh2gNAAOMGACHdAyAA4gYAId4DQADwBgAh9gMBAOEGACH3AwEA7gYAIfgDAQDuBgAhAgAAANUDACAoAADiAwAgCMwDAQDhBgAhzwNAAOMGACHaA0AA4wYAId0DIADiBgAh3gNAAPAGACH2AwEA4QYAIfcDAQDuBgAh-AMBAO4GACECAAAA2AMAICgAAOQDACACAAAA2AMAICgAAOQDACADAAAA1QMAIC8AAN0DACAwAADiAwAgAQAAANUDACABAAAA2AMAIAYIAACVCAAgNQAAlwgAIDYAAJYIACDeAwAA5wYAIPcDAADnBgAg-AMAAOcGACALuwMAAOsFADC8AwAA6wMAEL0DAADrBQAwzAMBAL4FACHPA0AArgUAIdoDQACuBQAh3QMgAK0FACHeA0AAwgUAIfYDAQCsBQAh9wMBAMAFACH4AwEAwAUAIQMAAADYAwAgAQAA6gMAMDQAAOsDACADAAAA2AMAIAEAANkDADACAADVAwAgAQAAACkAIAEAAAApACADAAAAJwAgAQAAKAAwAgAAKQAgAwAAACcAIAEAACgAMAIAACkAIAMAAAAnACABAAAoADACAAApACAKEAAAlAgAIBIAAOIHACATAADjBwAgzAMBAAAAAc0DAQAAAAHaA0AAAAAB7QMAAAD1AwLxAwEAAAAB8wMAAADzAwL1AwEAAAABASgAAPMDACAHzAMBAAAAAc0DAQAAAAHaA0AAAAAB7QMAAAD1AwLxAwEAAAAB8wMAAADzAwL1AwEAAAABASgAAPUDADABKAAA9QMAMAoQAACTCAAgEgAAzAcAIBMAAM0HACDMAwEA4QYAIc0DAQDhBgAh2gNAAOMGACHtAwAAygf1AyLxAwEA4QYAIfMDAAC7B_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-BwAgNQAAgQgAIDYAAIAIACBXAAD_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_AQAEL0DAAC7BQAwvgMBALcFACHMAwEAtwUAIc0DAQC3BQAhzgMgALgFACHPA0AAuQUAIQADAAAA_AQAIAEAAP0EADACAAD5BAAgAwAAAPwEACABAAD9BAAwAgAA-QQAIAMAAAD8BAAgAQAA_QQAMAIAAPkEACAFvgMBAAAAAcwDAQAAAAHNAwEAAAABzgMgAAAAAc8DQAAAAAEBKAAAgQUAIAW-AwEAAAABzAMBAAAAAc0DAQAAAAHOAyAAAAABzwNAAAAAAQEoAACDBQAwASgAAIMFADAFvgMBAOEGACHMAwEA4QYAIc0DAQDhBgAhzgMgAOIGACHPA0AA4wYAIQIAAAD5BAAgKAAAhgUAIAW-AwEA4QYAIcwDAQDhBgAhzQMBAOEGACHOAyAA4gYAIc8DQADjBgAhAgAAAPwEACAoAACIBQAgAgAAAPwEACAoAACIBQAgAwAAAPkEACAvAACBBQAgMAAAhgUAIAEAAAD5BAAgAQAAAPwEACADCAAA5AYAIDUAAOYGACA2AADlBgAgCLsDAAC6BQAwvAMAAI8FABC9AwAAugUAML4DAQCsBQAhzAMBAKwFACHNAwEArAUAIc4DIACtBQAhzwNAAK4FACEDAAAA_AQAIAEAAI4FADA0AACPBQAgAwAAAPwEACABAAD9BAAwAgAA-QQAIAa7AwAAtgUAMLwDAACVBQAQvQMAALYFADC-AwEAAAABvwMgALgFACHAA0AAuQUAIQEAAACSBQAgAQAAAJIFACAGuwMAALYFADC8AwAAlQUAEL0DAAC2BQAwvgMBALcFACG_AyAAuAUAIcADQAC5BQAhAAMAAACVBQAgAQAAlgUAMAIAAJIFACADAAAAlQUAIAEAAJYFADACAACSBQAgAwAAAJUFACABAACWBQAwAgAAkgUAIAO-AwEAAAABvwMgAAAAAcADQAAAAAEBKAAAmgUAIAO-AwEAAAABvwMgAAAAAcADQAAAAAEBKAAAnAUAMAEoAACcBQAwA74DAQDhBgAhvwMgAOIGACHAA0AA4wYAIQIAAACSBQAgKAAAnwUAIAO-AwEA4QYAIb8DIADiBgAhwANAAOMGACECAAAAlQUAICgAAKEFACACAAAAlQUAICgAAKEFACADAAAAkgUAIC8AAJoFACAwAACfBQAgAQAAAJIFACABAAAAlQUAIAMIAADeBgAgNQAA4AYAIDYAAN8GACAGuwMAAKsFADC8AwAAqAUAEL0DAACrBQAwvgMBAKwFACG_AyAArQUAIcADQACuBQAhAwAAAJUFACABAACnBQAwNAAAqAUAIAMAAACVBQAgAQAAlgUAMAIAAJIFACAGuwMAAKsFADC8AwAAqAUAEL0DAACrBQAwvgMBAKwFACG_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-gMIyAMAAPIF-gMiDAwAAPUFACC7AwAA8wUAMLwDAAAgABC9AwAA8wUAMMwDAQDRBQAhzwNAALkFACHUAwAA9AX6AyLYAwEA0QUAIdoDQAC5BQAh-gMBAO0FACH7AwEA7QUAIfwDQADSBQAhBMEDAAAA-gMCwgMAAAD6AwjDAwAAAPoDCMgDAADyBfoDIhwDAACBBgAgCQAA1AYAIAoAANMFACALAACCBgAgDgAAgwYAIA8AANUGACAYAACEBgAguwMAANMGADC8AwAAEQAQvQMAANMGADC-AwEAtwUAIcwDAQDRBQAhzwNAALkFACHaA0AAuQUAId0DIAC4BQAh3gNAANIFACGABAEAtwUAIYEEAQC3BQAhggQBAO0FACGDBAEA7QUAIYQEAQDtBQAhhQQBAO0FACGGBAIAowYAIYcEAgCjBgAhiAQgALgFACGJBAEA0QUAIcMEAAARACDEBAAAEQAgDbsDAAD2BQAwvAMAALoDABC9AwAA9gUAMMwDAQC-BQAhzwNAAK4FACHYAwEAvgUAIdkDAQDDBQAh2gNAAK4FACHdAyAArQUAId4DQADCBQAh_QMBAL4FACH-AyAArQUAIf8DIACtBQAhE7sDAAD3BQAwvAMAAKQDABC9AwAA9wUAML4DAQCsBQAhzAMBAL4FACHPA0AArgUAIdoDQACuBQAh3QMgAK0FACHeA0AAwgUAIYAEAQCsBQAhgQQBAKwFACGCBAEAwAUAIYMEAQDABQAhhAQBAMAFACGFBAEAwAUAIYYEAgC_BQAhhwQCAL8FACGIBCAArQUAIYkEAQC-BQAhFrsDAAD4BQAwvAMAAI4DABC9AwAA-AUAMMwDAQC-BQAhzwNAAK4FACHUAwAA-QWMBCLXAwEAvgUAIdgDAQDDBQAh2gNAAK4FACGKBAEAvgUAIYwEAADXBeQDIo0EQACuBQAhjgRAAMIFACGPBEAAwgUAIZAEQADCBQAhkQQBAMAFACGTBAAA-gWTBCOUBEAAwgUAIZUEAQDABQAhlgQAAPoFkwQjlwQBAMAFACGYBAEAvgUAIQcIAACwBQAgNQAA_gUAIDYAAP4FACDBAwAAAIwEAsIDAAAAjAQIwwMAAACMBAjIAwAA_QWMBCIHCAAAxQUAIDUAAPwFACA2AAD8BQAgwQMAAACTBAPCAwAAAJMECcMDAAAAkwQJyAMAAPsFkwQjBwgAAMUFACA1AAD8BQAgNgAA_AUAIMEDAAAAkwQDwgMAAACTBAnDAwAAAJMECcgDAAD7BZMEIwTBAwAAAJMEA8IDAAAAkwQJwwMAAACTBAnIAwAA_AWTBCMHCAAAsAUAIDUAAP4FACA2AAD-BQAgwQMAAACMBALCAwAAAIwECMMDAAAAjAQIyAMAAP0FjAQiBMEDAAAAjAQCwgMAAACMBAjDAwAAAIwECMgDAAD-BYwEIg67AwAA_wUAMLwDAAD2AgAQvQMAAP8FADC-AwEArAUAIcwDAQC-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-BAnIAwAAqga-BCMNCAAAxQUAIDUAAMUFACA2AADFBQAgVwAArAYAIFgAAMUFACDBAwIAAAABwgMCAAAABcMDAgAAAAXEAwIAAAABxQMCAAAAAcYDAgAAAAHHAwIAAAAByAMCAKsGACEIwQMIAAAAAcIDCAAAAAXDAwgAAAAFxAMIAAAAAcUDCAAAAAHGAwgAAAABxwMIAAAAAcgDCACsBgAhBwgAALAFACA1AACuBgAgNgAArgYAIMEDAAAAuAQCwgMAAAC4BAjDAwAAALgECMgDAACtBrgEIgTBAwAAALgEAsIDAAAAuAQIwwMAAAC4BAjIAwAArga4BCIIuwMAAK8GADC8AwAAjgEAEL0DAACvBgAwvgMBAKwFACHMAwEAvgUAIc8DQACuBQAh2gNAAK4FACGFBAEArAUAIQ27AwAAsAYAMLwDAAB4ABC9AwAAsAYAML4DAQCsBQAhzAMBAKwFACHPA0AArgUAIdoDQACuBQAh3QMgAK0FACHeA0AAwgUAIfYDAQCsBQAhgQQBAKwFACGCBAEAwAUAIb8EAQDABQAhDiEAALUGACC7AwAAsQYAMLwDAABbABC9AwAAsQYAMMwDAQDRBQAh2gNAALkFACGbBAAAsga4BCK2BAEA0QUAIbgEAQC3BQAhuQQBAO0FACG6BAEA7QUAIbsEAgCzBgAhvAQCALMGACG-BAAAtAa-BCMEwQMAAAC4BALCAwAAALgECMMDAAAAuAQIyAMAAK4GuAQiCMEDAgAAAAHCAwIAAAAFwwMCAAAABcQDAgAAAAHFAwIAAAABxgMCAAAAAccDAgAAAAHIAwIAxQUAIQTBAwAAAL4EA8IDAAAAvgQJwwMAAAC-BAnIAwAAqga-BCMMAwAAgQYAIBQAALcGACC7AwAAtgYAMLwDAABXABC9AwAAtgYAML4DAQC3BQAhzAMBANEFACHPA0AAuQUAIdoDQAC5BQAhhQQBALcFACHDBAAAVwAgxAQAAFcAIAoDAACBBgAgFAAAtwYAILsDAAC2BgAwvAMAAFcAEL0DAAC2BgAwvgMBALcFACHMAwEA0QUAIc8DQAC5BQAh2gNAALkFACGFBAEAtwUAIQPfAwAAWwAg4AMAAFsAIOEDAABbACAKAwAAgQYAIBEBALcFACG7AwAAuAYAMLwDAABSABC9AwAAuAYAML4DAQC3BQAhzAMBALcFACHaA0AAuQUAIe0DAQC3BQAh7gMgALgFACEOAwAAgQYAILsDAAC5BgAwvAMAAFAAEL0DAAC5BgAwvgMBALcFACHMAwEAtwUAIc8DQAC5BQAh2gNAALkFACHdAyAAuAUAId4DQADSBQAh9gMBALcFACGBBAEAtwUAIYIEAQDtBQAhvwQBAO0FACEKFQAAvAYAILsDAAC6BgAwvAMAADYAEL0DAAC6BgAwvgMBALcFACHMAwEAtwUAIZoEAQC3BQAhmwQAALsG8wMinARAANIFACGdBEAA0gUAIQTBAwAAAPMDAsIDAAAA8wMIwwMAAADzAwjIAwAA6gXzAyINEAAAvwYAIBYAAMAGACC7AwAAvQYAMLwDAAAyABC9AwAAvQYAMMwDAQC3BQAhzQMBALcFACHUAwAAvgafBCLaA0AAuQUAIY4EQADSBQAhjwRAANIFACHDBAAAMgAgxAQAADIAIAsQAAC_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_wMgALgFACENGQAA0wUAILsDAADQBQAwvAMAAMsEABC9AwAA0AUAMMwDAQDRBQAhzwNAALkFACHaA0AAuQUAIdsDQAC5BQAh3ANAALkFACHdAyAAuAUAId4DQADSBQAhwwQAAMsEACDEBAAAywQAIBoDAACBBgAgCQAA1AYAIAoAANMFACALAACCBgAgDgAAgwYAIA8AANUGACAYAACEBgAguwMAANMGADC8AwAAEQAQvQMAANMGADC-AwEAtwUAIcwDAQDRBQAhzwNAALkFACHaA0AAuQUAId0DIAC4BQAh3gNAANIFACGABAEAtwUAIYEEAQC3BQAhggQBAO0FACGDBAEA7QUAIYQEAQDtBQAhhQQBAO0FACGGBAIAowYAIYcEAgCjBgAhiAQgALgFACGJBAEA0QUAIQ4HAADuBQAguwMAAOwFADC8AwAA2AMAEL0DAADsBQAwzAMBANEFACHPA0AAuQUAIdoDQAC5BQAh3QMgALgFACHeA0AA0gUAIfYDAQC3BQAh9wMBAO0FACH4AwEA7QUAIcMEAADYAwAgxAQAANgDACAODAAA9QUAILsDAADzBQAwvAMAACAAEL0DAADzBQAwzAMBANEFACHPA0AAuQUAIdQDAAD0BfoDItgDAQDRBQAh2gNAALkFACH6AwEA7QUAIfsDAQDtBQAh_ANAANIFACHDBAAAIAAgxAQAACAAIBwGAADKBgAgDAAAnAYAIBgAAIQGACAbAADZBgAgHAAA2gYAIB0AANsGACC7AwAA1gYAMLwDAAANABC9AwAA1gYAMMwDAQDRBQAhzwNAALkFACHUAwAA1waMBCLXAwEA0QUAIdgDAQDIBgAh2gNAALkFACGKBAEA0QUAIYwEAADfBeQDIo0EQAC5BQAhjgRAANIFACGPBEAA0gUAIZAEQADSBQAhkQQBAO0FACGTBAAA2AaTBCOUBEAA0gUAIZUEAQDtBQAhlgQAANgGkwQjlwQBAO0FACGYBAEA0QUAIQTBAwAAAIwEAsIDAAAAjAQIwwMAAACMBAjIAwAA_gWMBCIEwQMAAACTBAPCAwAAAJMECcMDAAAAkwQJyAMAAPwFkwQjEgwAAPUFACANAADJBgAgGgAA0gYAILsDAADRBgAwvAMAABYAEL0DAADRBgAwzAMBANEFACHPA0AAuQUAIdgDAQDRBQAh2QMBAMgGACHaA0AAuQUAId0DIAC4BQAh3gNAANIFACH9AwEA0QUAIf4DIAC4BQAh_wMgALgFACHDBAAAFgAgxAQAABYAIA8NAADhBQAguwMAAN0FADC8AwAARAAQvQMAAN0FADDMAwEA0QUAIc8DQAC5BQAh1AMAAN8F5AMi2QMBANEFACHaA0AAuQUAIeIDCADeBQAh5AMBALcFACHlAwEA7QUAIeYDAADgBQAgwwQAAEQAIMQEAABEACATBgAAygYAIAwAAPUFACANAADJBgAguwMAAM4GADC8AwAAGwAQvQMAAM4GADDMAwEA0QUAIc8DQAC5BQAh0QMCAKMGACHSAwEA7QUAIdQDAADPBtQDItUDAQDtBQAh1gNAANIFACHXAwEA0QUAIdgDAQDRBQAh2QMBAMgGACHaA0AAuQUAIcMEAAAbACDEBAAAGwAgEQMAAIEGACC7AwAA3AYAMLwDAAAHABC9AwAA3AYAML4DAQC3BQAhzAMBALcFACHPA0AAuQUAIdoDQAC5BQAhogQBALcFACGjBAEAtwUAIaQEAQDtBQAhpQQBAO0FACGmBAEA7QUAIacEQADSBQAhqARAANIFACGpBAEA7QUAIaoEAQDtBQAhDAMAAIEGACC7AwAA3QYAMLwDAAADABC9AwAA3QYAML4DAQC3BQAhzAMBALcFACHPA0AAuQUAIdoDQAC5BQAhoQRAALkFACGrBAEAtwUAIawEAQDtBQAhrQQBAO0FACEAAAAByAQBAAAAAQHIBCAAAAABAcgEQAAAAAEAAAAAAAAAAAAFyAQCAAAAAc4EAgAAAAHPBAIAAAAB0AQCAAAAAdEEAgAAAAEByAQBAAAAAQHIBAAAANQDAgHIBEAAAAABBS8AAPELACAwAAD6CwAgxQQAAPILACDGBAAA-QsAIMsEAADhAgAgBS8AAO8LACAwAAD3CwAgxQQAAPALACDGBAAA9gsAIMsEAAATACAHLwAA7QsAIDAAAPQLACDFBAAA7gsAIMYEAADzCwAgyQQAAA0AIMoEAAANACDLBAAADwAgAy8AAPELACDFBAAA8gsAIMsEAADhAgAgAy8AAO8LACDFBAAA8AsAIMsEAAATACADLwAA7QsAIMUEAADuCwAgywQAAA8AIAAAAAsvAAD7BgAwMAAAgAcAMMUEAAD8BgAwxgQAAP0GADDHBAAA_gYAIMgEAAD_BgAwyQQAAP8GADDKBAAA_wYAMMsEAAD_BgAwzAQAAIEHADDNBAAAggcAMAsMAAD6BwAgDQAA-wcAIMwDAQAAAAHPA0AAAAAB2AMBAAAAAdkDAQAAAAHaA0AAAAAB3QMgAAAAAd4DQAAAAAH-AyAAAAAB_wMgAAAAAQIAAAAYACAvAAD5BwAgAwAAABgAIC8AAPkHACAwAACFBwAgASgAAOwLADARDAAA9QUAIA0AAMkGACAaAADSBgAguwMAANEGADC8AwAAFgAQvQMAANEGADDMAwEAAAABzwNAALkFACHYAwEA0QUAIdkDAQDIBgAh2gNAALkFACHdAyAAuAUAId4DQADSBQAh_QMBANEFACH-AyAAuAUAIf8DIAC4BQAhwgQAANAGACACAAAAGAAgKAAAhQcAIAIAAACDBwAgKAAAhAcAIA27AwAAggcAMLwDAACDBwAQvQMAAIIHADDMAwEA0QUAIc8DQAC5BQAh2AMBANEFACHZAwEAyAYAIdoDQAC5BQAh3QMgALgFACHeA0AA0gUAIf0DAQDRBQAh_gMgALgFACH_AyAAuAUAIQ27AwAAggcAMLwDAACDBwAQvQMAAIIHADDMAwEA0QUAIc8DQAC5BQAh2AMBANEFACHZAwEAyAYAIdoDQAC5BQAh3QMgALgFACHeA0AA0gUAIf0DAQDRBQAh_gMgALgFACH_AyAAuAUAIQnMAwEA4QYAIc8DQADjBgAh2AMBAOEGACHZAwEA7gYAIdoDQADjBgAh3QMgAOIGACHeA0AA8AYAIf4DIADiBgAh_wMgAOIGACELDAAAhgcAIA0AAIcHACDMAwEA4QYAIc8DQADjBgAh2AMBAOEGACHZAwEA7gYAIdoDQADjBgAh3QMgAOIGACHeA0AA8AYAIf4DIADiBgAh_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_BwAgzAMBAAAAAdQDAAAAnwQC2gNAAAAAAY4EQAAAAAGPBEAAAAABAgAAADQAIC8AAL4HACADAAAANAAgLwAAvgcAIDAAAK8HACABKAAA2wsAMAsQAAC_BgAgFgAAwAYAILsDAAC9BgAwvAMAADIAEL0DAAC9BgAwzAMBAAAAAc0DAQC3BQAh1AMAAL4GnwQi2gNAALkFACGOBEAA0gUAIY8EQADSBQAhAgAAADQAICgAAK8HACACAAAArAcAICgAAK0HACAJuwMAAKsHADC8AwAArAcAEL0DAACrBwAwzAMBALcFACHNAwEAtwUAIdQDAAC-Bp8EItoDQAC5BQAhjgRAANIFACGPBEAA0gUAIQm7AwAAqwcAMLwDAACsBwAQvQMAAKsHADDMAwEAtwUAIc0DAQC3BQAh1AMAAL4GnwQi2gNAALkFACGOBEAA0gUAIY8EQADSBQAhBcwDAQDhBgAh1AMAAK4HnwQi2gNAAOMGACGOBEAA8AYAIY8EQADwBgAhAcgEAAAAnwQCBhYAALAHACDMAwEA4QYAIdQDAACuB58EItoDQADjBgAhjgRAAPAGACGPBEAA8AYAIQsvAACxBwAwMAAAtgcAMMUEAACyBwAwxgQAALMHADDHBAAAtAcAIMgEAAC1BwAwyQQAALUHADDKBAAAtQcAMMsEAAC1BwAwzAQAALcHADDNBAAAuAcAMAW-AwEAAAABzAMBAAAAAZsEAAAA8wMCnARAAAAAAZ0EQAAAAAECAAAAOAAgLwAAvQcAIAMAAAA4ACAvAAC9BwAgMAAAvAcAIAEoAADaCwAwChUAALwGACC7AwAAugYAMLwDAAA2ABC9AwAAugYAML4DAQC3BQAhzAMBAAAAAZoEAQC3BQAhmwQAALsG8wMinARAANIFACGdBEAA0gUAIQIAAAA4ACAoAAC8BwAgAgAAALkHACAoAAC6BwAgCbsDAAC4BwAwvAMAALkHABC9AwAAuAcAML4DAQC3BQAhzAMBALcFACGaBAEAtwUAIZsEAAC7BvMDIpwEQADSBQAhnQRAANIFACEJuwMAALgHADC8AwAAuQcAEL0DAAC4BwAwvgMBALcFACHMAwEAtwUAIZoEAQC3BQAhmwQAALsG8wMinARAANIFACGdBEAA0gUAIQW-AwEA4QYAIcwDAQDhBgAhmwQAALsH8wMinARAAPAGACGdBEAA8AYAIQHIBAAAAPMDAgW-AwEA4QYAIcwDAQDhBgAhmwQAALsH8wMinARAAPAGACGdBEAA8AYAIQW-AwEAAAABzAMBAAAAAZsEAAAA8wMCnARAAAAAAZ0EQAAAAAEGFgAAvwcAIMwDAQAAAAHUAwAAAJ8EAtoDQAAAAAGOBEAAAAABjwRAAAAAAQQvAACxBwAwxQQAALIHADDHBAAAtAcAIMsEAAC1BwAwCBIAAOIHACATAADjBwAgzAMBAAAAAdoDQAAAAAHtAwAAAPUDAvEDAQAAAAHzAwAAAPMDAvUDAQAAAAECAAAAKQAgLwAA4QcAIAMAAAApACAvAADhBwAgMAAAywcAIAEoAADZCwAwDRAAAL8GACASAADFBgAgEwAAnwYAILsDAADDBgAwvAMAACcAEL0DAADDBgAwzAMBAAAAAc0DAQC3BQAh2gNAALkFACHtAwAAxAb1AyLxAwEAtwUAIfMDAAC7BvMDIvUDAQDtBQAhAgAAACkAICgAAMsHACACAAAAyAcAICgAAMkHACAKuwMAAMcHADC8AwAAyAcAEL0DAADHBwAwzAMBALcFACHNAwEAtwUAIdoDQAC5BQAh7QMAAMQG9QMi8QMBALcFACHzAwAAuwbzAyL1AwEA7QUAIQq7AwAAxwcAMLwDAADIBwAQvQMAAMcHADDMAwEAtwUAIc0DAQC3BQAh2gNAALkFACHtAwAAxAb1AyLxAwEAtwUAIfMDAAC7BvMDIvUDAQDtBQAhBswDAQDhBgAh2gNAAOMGACHtAwAAygf1AyLxAwEA4QYAIfMDAAC7B_MDIvUDAQDuBgAhAcgEAAAA9QMCCBIAAMwHACATAADNBwAgzAMBAOEGACHaA0AA4wYAIe0DAADKB_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_AyAAAAABAy8AAMkLACDFBAAAygsAIMsEAAATACADLwAAiAcAIMUEAACJBwAgywQAAA8AIAQvAAD7BgAwxQQAAPwGADDHBAAA_gYAIMsEAAD_BgAwAAAAAAAABS8AAMQLACAwAADHCwAgxQQAAMULACDGBAAAxgsAIMsEAAAPACADLwAAxAsAIMUEAADFCwAgywQAAA8AIBAGAACwCgAgDAAA7ggAIBgAAKUJACAbAADZCgAgHAAA2goAIB0AANsKACDYAwAA5wYAII4EAADnBgAgjwQAAOcGACCQBAAA5wYAIJEEAADnBgAgkwQAAOcGACCUBAAA5wYAIJUEAADnBgAglgQAAOcGACCXBAAA5wYAIAAAAAUvAAC_CwAgMAAAwgsAIMUEAADACwAgxgQAAMELACDLBAAAvwEAIAMvAAC_CwAgxQQAAMALACDLBAAAvwEAIAAAAAUvAAC6CwAgMAAAvQsAIMUEAAC7CwAgxgQAALwLACDLBAAAKQAgAy8AALoLACDFBAAAuwsAIMsEAAApACAAAAAFLwAAtQsAIDAAALgLACDFBAAAtgsAIMYEAAC3CwAgywQAACQAIAMvAAC1CwAgxQQAALYLACDLBAAAJAAgAAAACy8AAJkIADAwAACeCAAwxQQAAJoIADDGBAAAmwgAMMcEAACcCAAgyAQAAJ0IADDJBAAAnQgAMMoEAACdCAAwywQAAJ0IADDMBAAAnwgAMM0EAACgCAAwFQMAAOEIACAKAADiCAAgCwAA4wgAIA4AAOQIACAPAADlCAAgGAAA5ggAIL4DAQAAAAHMAwEAAAABzwNAAAAAAdoDQAAAAAHdAyAAAAAB3gNAAAAAAYAEAQAAAAGBBAEAAAABggQBAAAAAYMEAQAAAAGEBAEAAAABhQQBAAAAAYYEAgAAAAGHBAIAAAABiAQgAAAAAQIAAAATACAvAADgCAAgAwAAABMAIC8AAOAIACAwAACjCAAgASgAALQLADAaAwAAgQYAIAkAANQGACAKAADTBQAgCwAAggYAIA4AAIMGACAPAADVBgAgGAAAhAYAILsDAADTBgAwvAMAABEAEL0DAADTBgAwvgMBAAAAAcwDAQAAAAHPA0AAuQUAIdoDQAC5BQAh3QMgALgFACHeA0AA0gUAIYAEAQC3BQAhgQQBAAAAAYIEAQDtBQAhgwQBAO0FACGEBAEA7QUAIYUEAQDtBQAhhgQCAKMGACGHBAIAowYAIYgEIAC4BQAhiQQBANEFACECAAAAEwAgKAAAowgAIAIAAAChCAAgKAAAoggAIBO7AwAAoAgAMLwDAAChCAAQvQMAAKAIADC-AwEAtwUAIcwDAQDRBQAhzwNAALkFACHaA0AAuQUAId0DIAC4BQAh3gNAANIFACGABAEAtwUAIYEEAQC3BQAhggQBAO0FACGDBAEA7QUAIYQEAQDtBQAhhQQBAO0FACGGBAIAowYAIYcEAgCjBgAhiAQgALgFACGJBAEA0QUAIRO7AwAAoAgAMLwDAAChCAAQvQMAAKAIADC-AwEAtwUAIcwDAQDRBQAhzwNAALkFACHaA0AAuQUAId0DIAC4BQAh3gNAANIFACGABAEAtwUAIYEEAQC3BQAhggQBAO0FACGDBAEA7QUAIYQEAQDtBQAhhQQBAO0FACGGBAIAowYAIYcEAgCjBgAhiAQgALgFACGJBAEA0QUAIQ--AwEA4QYAIcwDAQDhBgAhzwNAAOMGACHaA0AA4wYAId0DIADiBgAh3gNAAPAGACGABAEA4QYAIYEEAQDhBgAhggQBAO4GACGDBAEA7gYAIYQEAQDuBgAhhQQBAO4GACGGBAIA7QYAIYcEAgDtBgAhiAQgAOIGACEVAwAApAgAIAoAAKUIACALAACmCAAgDgAApwgAIA8AAKgIACAYAACpCAAgvgMBAOEGACHMAwEA4QYAIc8DQADjBgAh2gNAAOMGACHdAyAA4gYAId4DQADwBgAhgAQBAOEGACGBBAEA4QYAIYIEAQDuBgAhgwQBAO4GACGEBAEA7gYAIYUEAQDuBgAhhgQCAO0GACGHBAIA7QYAIYgEIADiBgAhBS8AAJwLACAwAACyCwAgxQQAAJ0LACDGBAAAsQsAIMsEAAC_AQAgCy8AANUIADAwAADZCAAwxQQAANYIADDGBAAA1wgAMMcEAADYCAAgyAQAAP8GADDJBAAA_wYAMMoEAAD_BgAwywQAAP8GADDMBAAA2ggAMM0EAACCBwAwCy8AAMcIADAwAADMCAAwxQQAAMgIADDGBAAAyQgAMMcEAADKCAAgyAQAAMsIADDJBAAAywgAMMoEAADLCAAwywQAAMsIADDMBAAAzQgAMM0EAADOCAAwCy8AALsIADAwAADACAAwxQQAALwIADDGBAAAvQgAMMcEAAC-CAAgyAQAAL8IADDJBAAAvwgAMMoEAAC_CAAwywQAAL8IADDMBAAAwQgAMM0EAADCCAAwBy8AALUIACAwAAC4CAAgxQQAALYIACDGBAAAtwgAIMkEAAAgACDKBAAAIAAgywQAAL0DACALLwAAqggAMDAAAK4IADDFBAAAqwgAMMYEAACsCAAwxwQAAK0IACDIBAAAmQcAMMkEAACZBwAwygQAAJkHADDLBAAAmQcAMMwEAACvCAAwzQQAAJwHADAJBgAA5QcAIA0AALQIACAUAADnBwAgFwAA6AcAIMwDAQAAAAHPA0AAAAAB1wMBAAAAAdkDAQAAAAHaA0AAAAABAgAAACQAIC8AALMIACADAAAAJAAgLwAAswgAIDAAALEIACABKAAAsAsAMAIAAAAkACAoAACxCAAgAgAAAJ0HACAoAACwCAAgBcwDAQDhBgAhzwNAAOMGACHXAwEA4QYAIdkDAQDuBgAh2gNAAOMGACEJBgAAoAcAIA0AALIIACAUAACiBwAgFwAAowcAIMwDAQDhBgAhzwNAAOMGACHXAwEA4QYAIdkDAQDuBgAh2gNAAOMGACEHLwAAqwsAIDAAAK4LACDFBAAArAsAIMYEAACtCwAgyQQAAA0AIMoEAAANACDLBAAADwAgCQYAAOUHACANAAC0CAAgFAAA5wcAIBcAAOgHACDMAwEAAAABzwNAAAAAAdcDAQAAAAHZAwEAAAAB2gNAAAAAAQMvAACrCwAgxQQAAKwLACDLBAAADwAgB8wDAQAAAAHPA0AAAAAB1AMAAAD6AwLaA0AAAAAB-gMBAAAAAfsDAQAAAAH8A0AAAAABAgAAAL0DACAvAAC1CAAgAwAAACAAIC8AALUIACAwAAC5CAAgCQAAACAAICgAALkIACDMAwEA4QYAIc8DQADjBgAh1AMAALoI-gMi2gNAAOMGACH6AwEA7gYAIfsDAQDuBgAh_ANAAPAGACEHzAMBAOEGACHPA0AA4wYAIdQDAAC6CPoDItoDQADjBgAh-gMBAO4GACH7AwEA7gYAIfwDQADwBgAhAcgEAAAA-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-AyAAAAAB_wMgAAAAAQIAAAAYACAvAADeCAAgAwAAABgAIC8AAN4IACAwAADcCAAgASgAAKMLADACAAAAGAAgKAAA3AgAIAIAAACDBwAgKAAA2wgAIAnMAwEA4QYAIc8DQADjBgAh2QMBAO4GACHaA0AA4wYAId0DIADiBgAh3gNAAPAGACH9AwEA4QYAIf4DIADiBgAh_wMgAOIGACELDQAAhwcAIBoAAN0IACDMAwEA4QYAIc8DQADjBgAh2QMBAO4GACHaA0AA4wYAId0DIADiBgAh3gNAAPAGACH9AwEA4QYAIf4DIADiBgAh_wMgAOIGACEFLwAAngsAIDAAAKELACDFBAAAnwsAIMYEAACgCwAgywQAAMgEACALDQAA-wcAIBoAAN8IACDMAwEAAAABzwNAAAAAAdkDAQAAAAHaA0AAAAAB3QMgAAAAAd4DQAAAAAH9AwEAAAAB_gMgAAAAAf8DIAAAAAEDLwAAngsAIMUEAACfCwAgywQAAMgEACAVAwAA4QgAIAoAAOIIACALAADjCAAgDgAA5AgAIA8AAOUIACAYAADmCAAgvgMBAAAAAcwDAQAAAAHPA0AAAAAB2gNAAAAAAd0DIAAAAAHeA0AAAAABgAQBAAAAAYEEAQAAAAGCBAEAAAABgwQBAAAAAYQEAQAAAAGFBAEAAAABhgQCAAAAAYcEAgAAAAGIBCAAAAABAy8AAJwLACDFBAAAnQsAIMsEAAC_AQAgBC8AANUIADDFBAAA1ggAMMcEAADYCAAgywQAAP8GADAELwAAxwgAMMUEAADICAAwxwQAAMoIACDLBAAAywgAMAQvAAC7CAAwxQQAALwIADDHBAAAvggAIMsEAAC_CAAwAy8AALUIACDFBAAAtggAIMsEAAC9AwAgBC8AAKoIADDFBAAAqwgAMMcEAACtCAAgywQAAJkHADAELwAAmQgAMMUEAACaCAAwxwQAAJwIACDLBAAAnQgAMAAAAAAFLwAAlwsAIDAAAJoLACDFBAAAmAsAIMYEAACZCwAgywQAABMAIAMvAACXCwAgxQQAAJgLACDLBAAAEwAgDAMAAKIJACAJAADXCgAgCgAA_QcAIAsAAKMJACAOAACkCQAgDwAA2AoAIBgAAKUJACDeAwAA5wYAIIIEAADnBgAggwQAAOcGACCEBAAA5wYAIIUEAADnBgAgAAAAAAAAAAAFLwAAkgsAIDAAAJULACDFBAAAkwsAIMYEAACUCwAgywQAANUDACADLwAAkgsAIMUEAACTCwAgywQAANUDACAAAAAAAAAFLwAAigsAIDAAAJALACDFBAAAiwsAIMYEAACPCwAgywQAAL8BACALLwAAlQkAMDAAAJkJADDFBAAAlgkAMMYEAACXCQAwxwQAAJgJACDIBAAAywgAMMkEAADLCAAwygQAAMsIADDLBAAAywgAMMwEAACaCQAwzQQAAM4IADALLwAAjAkAMDAAAJAJADDFBAAAjQkAMMYEAACOCQAwxwQAAI8JACDIBAAAvwgAMMkEAAC_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_goAIMUEAAD8CgAgxgQAAP0KACDLBAAAvwEAIAMvAAD7CgAgxQQAAPwKACDLBAAAvwEAIAAAAAUvAAD2CgAgMAAA-QoAIMUEAAD3CgAgxgQAAPgKACDLBAAAvwEAIAMvAAD2CgAgxQQAAPcKACDLBAAAvwEAIAAAAAHIBAAAAJMEAgHIBAAAALAEAgsvAACaCgAwMAAAnwoAMMUEAACbCgAwxgQAAJwKADDHBAAAnQoAIMgEAACeCgAwyQQAAJ4KADDKBAAAngoAMMsEAACeCgAwzAQAAKAKADDNBAAAoQoAMAsvAACOCgAwMAAAkwoAMMUEAACPCgAwxgQAAJAKADDHBAAAkQoAIMgEAACSCgAwyQQAAJIKADDKBAAAkgoAMMsEAACSCgAwzAQAAJQKADDNBAAAlQoAMAcvAACJCgAgMAAAjAoAIMUEAACKCgAgxgQAAIsKACDJBAAACwAgygQAAAsAIMsEAADhAgAgBy8AAIQKACAwAACHCgAgxQQAAIUKACDGBAAAhgoAIMkEAAARACDKBAAAEQAgywQAABMAIAcvAAD_CQAgMAAAggoAIMUEAACACgAgxgQAAIEKACDJBAAAUAAgygQAAFAAIMsEAAABACALLwAA8wkAMDAAAPgJADDFBAAA9AkAMMYEAAD1CQAwxwQAAPYJACDIBAAA9wkAMMkEAAD3CQAwygQAAPcJADDLBAAA9wkAMMwEAAD5CQAwzQQAAPoJADALLwAA6gkAMDAAAO4JADDFBAAA6wkAMMYEAADsCQAwxwQAAO0JACDIBAAA0gcAMMkEAADSBwAwygQAANIHADDLBAAA0gcAMMwEAADvCQAwzQQAANUHADALLwAAzQkAMDAAANIJADDFBAAAzgkAMMYEAADPCQAwxwQAANAJACDIBAAA0QkAMMkEAADRCQAwygQAANEJADDLBAAA0QkAMMwEAADTCQAwzQQAANQJADAFFAAA6QkAIMwDAQAAAAHPA0AAAAAB2gNAAAAAAYUEAQAAAAECAAAAWQAgLwAA6AkAIAMAAABZACAvAADoCQAgMAAA1wkAIAEoAAD1CgAwCgMAAIEGACAUAAC3BgAguwMAALYGADC8AwAAVwAQvQMAALYGADC-AwEAtwUAIcwDAQAAAAHPA0AAuQUAIdoDQAC5BQAhhQQBALcFACECAAAAWQAgKAAA1wkAIAIAAADVCQAgKAAA1gkAIAi7AwAA1AkAMLwDAADVCQAQvQMAANQJADC-AwEAtwUAIcwDAQDRBQAhzwNAALkFACHaA0AAuQUAIYUEAQC3BQAhCLsDAADUCQAwvAMAANUJABC9AwAA1AkAML4DAQC3BQAhzAMBANEFACHPA0AAuQUAIdoDQAC5BQAhhQQBALcFACEEzAMBAOEGACHPA0AA4wYAIdoDQADjBgAhhQQBAOEGACEFFAAA2AkAIMwDAQDhBgAhzwNAAOMGACHaA0AA4wYAIYUEAQDhBgAhCy8AANkJADAwAADeCQAwxQQAANoJADDGBAAA2wkAMMcEAADcCQAgyAQAAN0JADDJBAAA3QkAMMoEAADdCQAwywQAAN0JADDMBAAA3wkAMM0EAADgCQAwCcwDAQAAAAHaA0AAAAABmwQAAAC4BAK4BAEAAAABuQQBAAAAAboEAQAAAAG7BAIAAAABvAQCAAAAAb4EAAAAvgQDAgAAAF0AIC8AAOcJACADAAAAXQAgLwAA5wkAIDAAAOYJACABKAAA9AoAMA4hAAC1BgAguwMAALEGADC8AwAAWwAQvQMAALEGADDMAwEAAAAB2gNAALkFACGbBAAAsga4BCK2BAEA0QUAIbgEAQC3BQAhuQQBAO0FACG6BAEA7QUAIbsEAgCzBgAhvAQCALMGACG-BAAAtAa-BCMCAAAAXQAgKAAA5gkAIAIAAADhCQAgKAAA4gkAIA27AwAA4AkAMLwDAADhCQAQvQMAAOAJADDMAwEA0QUAIdoDQAC5BQAhmwQAALIGuAQitgQBANEFACG4BAEAtwUAIbkEAQDtBQAhugQBAO0FACG7BAIAswYAIbwEAgCzBgAhvgQAALQGvgQjDbsDAADgCQAwvAMAAOEJABC9AwAA4AkAMMwDAQDRBQAh2gNAALkFACGbBAAAsga4BCK2BAEA0QUAIbgEAQC3BQAhuQQBAO0FACG6BAEA7QUAIbsEAgCzBgAhvAQCALMGACG-BAAAtAa-BCMJzAMBAOEGACHaA0AA4wYAIZsEAADjCbgEIrgEAQDhBgAhuQQBAO4GACG6BAEA7gYAIbsEAgDkCQAhvAQCAOQJACG-BAAA5Qm-BCMByAQAAAC4BAIFyAQCAAAAAc4EAgAAAAHPBAIAAAAB0AQCAAAAAdEEAgAAAAEByAQAAAC-BAMJzAMBAOEGACHaA0AA4wYAIZsEAADjCbgEIrgEAQDhBgAhuQQBAO4GACG6BAEA7gYAIbsEAgDkCQAhvAQCAOQJACG-BAAA5Qm-BCMJzAMBAAAAAdoDQAAAAAGbBAAAALgEArgEAQAAAAG5BAEAAAABugQBAAAAAbsEAgAAAAG8BAIAAAABvgQAAAC-BAMFFAAA6QkAIMwDAQAAAAHPA0AAAAAB2gNAAAAAAYUEAQAAAAEELwAA2QkAMMUEAADaCQAwxwQAANwJACDLBAAA3QkAMAURAACPCAAgzAMBAAAAAdoDQAAAAAHvAwEAAAAB8AMBAAAAAQIAAAAvACAvAADyCQAgAwAAAC8AIC8AAPIJACAwAADxCQAgASgAAPMKADACAAAALwAgKAAA8QkAIAIAAADWBwAgKAAA8AkAIATMAwEA4QYAIdoDQADjBgAh7wMBAOEGACHwAwEA4QYAIQURAACOCAAgzAMBAOEGACHaA0AA4wYAIe8DAQDhBgAh8AMBAOEGACEFEQAAjwgAIMwDAQAAAAHaA0AAAAAB7wMBAAAAAfADAQAAAAEFEQEAAAABzAMBAAAAAdoDQAAAAAHtAwEAAAAB7gMgAAAAAQIAAABUACAvAAD-CQAgAwAAAFQAIC8AAP4JACAwAAD9CQAgASgAAPIKADAKAwAAgQYAIBEBALcFACG7AwAAuAYAMLwDAABSABC9AwAAuAYAML4DAQC3BQAhzAMBAAAAAdoDQAC5BQAh7QMBALcFACHuAyAAuAUAIQIAAABUACAoAAD9CQAgAgAAAPsJACAoAAD8CQAgCREBALcFACG7AwAA-gkAMLwDAAD7CQAQvQMAAPoJADC-AwEAtwUAIcwDAQC3BQAh2gNAALkFACHtAwEAtwUAIe4DIAC4BQAhCREBALcFACG7AwAA-gkAMLwDAAD7CQAQvQMAAPoJADC-AwEAtwUAIcwDAQC3BQAh2gNAALkFACHtAwEAtwUAIe4DIAC4BQAhBREBAOEGACHMAwEA4QYAIdoDQADjBgAh7QMBAOEGACHuAyAA4gYAIQURAQDhBgAhzAMBAOEGACHaA0AA4wYAIe0DAQDhBgAh7gMgAOIGACEFEQEAAAABzAMBAAAAAdoDQAAAAAHtAwEAAAAB7gMgAAAAAQnMAwEAAAABzwNAAAAAAdoDQAAAAAHdAyAAAAAB3gNAAAAAAfYDAQAAAAGBBAEAAAABggQBAAAAAb8EAQAAAAECAAAAAQAgLwAA_wkAIAMAAABQACAvAAD_CQAgMAAAgwoAIAsAAABQACAoAACDCgAgzAMBAOEGACHPA0AA4wYAIdoDQADjBgAh3QMgAOIGACHeA0AA8AYAIfYDAQDhBgAhgQQBAOEGACGCBAEA7gYAIb8EAQDuBgAhCcwDAQDhBgAhzwNAAOMGACHaA0AA4wYAId0DIADiBgAh3gNAAPAGACH2AwEA4QYAIYEEAQDhBgAhggQBAO4GACG_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_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_UDIvEDAQDhBgAh8wMAALsH8wMi9QMBAO4GACEHzAMBAAAAAc8DQAAAAAHaA0AAAAABoQRAAAAAAasEAQAAAAGsBAEAAAABrQQBAAAAAQzMAwEAAAABzwNAAAAAAdoDQAAAAAGiBAEAAAABowQBAAAAAaQEAQAAAAGlBAEAAAABpgQBAAAAAacEQAAAAAGoBEAAAAABqQQBAAAAAaoEAQAAAAEFEQEAAAABzAMBAAAAAdoDQAAAAAHtAwEAAAAB7gMgAAAAAQTMAwEAAAAB2gNAAAAAAe8DAQAAAAHwAwEAAAABCcwDAQAAAAHaA0AAAAABmwQAAAC4BAK4BAEAAAABuQQBAAAAAboEAQAAAAG7BAIAAAABvAQCAAAAAb4EAAAAvgQDBMwDAQAAAAHPA0AAAAAB2gNAAAAAAYUEAQAAAAETBQAApwoAIAYAAKgKACAMAACpCgAgHgAAqgoAIB8AAKsKACAgAACsCgAgIgAArQoAIMwDAQAAAAHPA0AAAAAB1AMAAACwBALaA0AAAAAB3QMgAAAAAd4DQAAAAAH2AwEAAAABgQQBAAAAAZsEAAAAkwQCrgQgAAAAAbAEIAAAAAGxBAEAAAABAgAAAL8BACAvAAD2CgAgAwAAAMIBACAvAAD2CgAgMAAA-goAIBUAAADCAQAgBQAAxgkAIAYAAMcJACAMAADICQAgHgAAyQkAIB8AAMoJACAgAADLCQAgIgAAzAkAICgAAPoKACDMAwEA4QYAIc8DQADjBgAh1AMAAMQJsAQi2gNAAOMGACHdAyAA4gYAId4DQADwBgAh9gMBAOEGACGBBAEA4QYAIZsEAADDCZMEIq4EIADiBgAhsAQgAOIGACGxBAEA7gYAIRMFAADGCQAgBgAAxwkAIAwAAMgJACAeAADJCQAgHwAAygkAICAAAMsJACAiAADMCQAgzAMBAOEGACHPA0AA4wYAIdQDAADECbAEItoDQADjBgAh3QMgAOIGACHeA0AA8AYAIfYDAQDhBgAhgQQBAOEGACGbBAAAwwmTBCKuBCAA4gYAIbAEIADiBgAhsQQBAO4GACETBAAApgoAIAYAAKgKACAMAACpCgAgHgAAqgoAIB8AAKsKACAgAACsCgAgIgAArQoAIMwDAQAAAAHPA0AAAAAB1AMAAACwBALaA0AAAAAB3QMgAAAAAd4DQAAAAAH2AwEAAAABgQQBAAAAAZsEAAAAkwQCrgQgAAAAAbAEIAAAAAGxBAEAAAABAgAAAL8BACAvAAD7CgAgAwAAAMIBACAvAAD7CgAgMAAA_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_gMgAAAAAf8DIAAAAAEMDAAA-gcAIBoAAN8IACDMAwEAAAABzwNAAAAAAdgDAQAAAAHZAwEAAAAB2gNAAAAAAd0DIAAAAAHeA0AAAAAB_QMBAAAAAf4DIAAAAAH_AyAAAAABAgAAABgAIC8AAKQLACADAAAAFgAgLwAApAsAIDAAAKgLACAOAAAAFgAgDAAAhgcAIBoAAN0IACAoAACoCwAgzAMBAOEGACHPA0AA4wYAIdgDAQDhBgAh2QMBAO4GACHaA0AA4wYAId0DIADiBgAh3gNAAPAGACH9AwEA4QYAIf4DIADiBgAh_wMgAOIGACEMDAAAhgcAIBoAAN0IACDMAwEA4QYAIc8DQADjBgAh2AMBAOEGACHZAwEA7gYAIdoDQADjBgAh3QMgAOIGACHeA0AA8AYAIf0DAQDhBgAh_gMgAOIGACH_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_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_AQAgLwAA0wsAIAMAAADCAQAgLwAA0wsAIDAAANcLACAVAAAAwgEAIAQAAMUJACAFAADGCQAgBgAAxwkAIAwAAMgJACAeAADJCQAgHwAAygkAICIAAMwJACAoAADXCwAgzAMBAOEGACHPA0AA4wYAIdQDAADECbAEItoDQADjBgAh3QMgAOIGACHeA0AA8AYAIfYDAQDhBgAhgQQBAOEGACGbBAAAwwmTBCKuBCAA4gYAIbAEIADiBgAhsQQBAO4GACETBAAAxQkAIAUAAMYJACAGAADHCQAgDAAAyAkAIB4AAMkJACAfAADKCQAgIgAAzAkAIMwDAQDhBgAhzwNAAOMGACHUAwAAxAmwBCLaA0AA4wYAId0DIADiBgAh3gNAAPAGACH2AwEA4QYAIYEEAQDhBgAhmwQAAMMJkwQirgQgAOIGACGwBCAA4gYAIbEEAQDuBgAhBL4DAQAAAAHMAwEAAAAB2gNAAAAAAfADAQAAAAEGzAMBAAAAAdoDQAAAAAHtAwAAAPUDAvEDAQAAAAHzAwAAAPMDAvUDAQAAAAEFvgMBAAAAAcwDAQAAAAGbBAAAAPMDApwEQAAAAAGdBEAAAAABBcwDAQAAAAHUAwAAAJ8EAtoDQAAAAAGOBEAAAAABjwRAAAAAAQMAAAARACAvAADPCwAgMAAA3gsAIBgAAAARACADAACkCAAgCQAA9wgAIAoAAKUIACALAACmCAAgDgAApwgAIA8AAKgIACAoAADeCwAgvgMBAOEGACHMAwEA4QYAIc8DQADjBgAh2gNAAOMGACHdAyAA4gYAId4DQADwBgAhgAQBAOEGACGBBAEA4QYAIYIEAQDuBgAhgwQBAO4GACGEBAEA7gYAIYUEAQDuBgAhhgQCAO0GACGHBAIA7QYAIYgEIADiBgAhiQQBAOEGACEWAwAApAgAIAkAAPcIACAKAAClCAAgCwAApggAIA4AAKcIACAPAACoCAAgvgMBAOEGACHMAwEA4QYAIc8DQADjBgAh2gNAAOMGACHdAyAA4gYAId4DQADwBgAhgAQBAOEGACGBBAEA4QYAIYIEAQDuBgAhgwQBAO4GACGEBAEA7gYAIYUEAQDuBgAhhgQCAO0GACGHBAIA7QYAIYgEIADiBgAhiQQBAOEGACEDAAAACwAgLwAA0QsAIDAAAOELACAQAAAACwAgAwAA_wgAIAsAAIAJACAOAACBCQAgKAAA4QsAIL4DAQDhBgAhzAMBAOEGACHPA0AA4wYAIdoDQADjBgAh3QMgAOIGACHeA0AA8AYAIYAEAQDhBgAhgQQBAOEGACGCBAEA7gYAIYMEAQDuBgAhmQQBAO4GACEOAwAA_wgAIAsAAIAJACAOAACBCQAgvgMBAOEGACHMAwEA4QYAIc8DQADjBgAh2gNAAOMGACHdAyAA4gYAId4DQADwBgAhgAQBAOEGACGBBAEA4QYAIYIEAQDuBgAhgwQBAO4GACGZBAEA7gYAIQXMAwEAAAABzwNAAAAAAdcDAQAAAAHYAwEAAAAB2gNAAAAAAQMAAAARACAvAADLCwAgMAAA5QsAIBgAAAARACADAACkCAAgCQAA9wgAIAoAAKUIACAOAACnCAAgDwAAqAgAIBgAAKkIACAoAADlCwAgvgMBAOEGACHMAwEA4QYAIc8DQADjBgAh2gNAAOMGACHdAyAA4gYAId4DQADwBgAhgAQBAOEGACGBBAEA4QYAIYIEAQDuBgAhgwQBAO4GACGEBAEA7gYAIYUEAQDuBgAhhgQCAO0GACGHBAIA7QYAIYgEIADiBgAhiQQBAOEGACEWAwAApAgAIAkAAPcIACAKAAClCAAgDgAApwgAIA8AAKgIACAYAACpCAAgvgMBAOEGACHMAwEA4QYAIc8DQADjBgAh2gNAAOMGACHdAyAA4gYAId4DQADwBgAhgAQBAOEGACGBBAEA4QYAIYIEAQDuBgAhgwQBAO4GACGEBAEA7gYAIYUEAQDuBgAhhgQCAO0GACGHBAIA7QYAIYgEIADiBgAhiQQBAOEGACEDAAAACwAgLwAAzQsAIDAAAOgLACAQAAAACwAgAwAA_wgAIA4AAIEJACAYAACCCQAgKAAA6AsAIL4DAQDhBgAhzAMBAOEGACHPA0AA4wYAIdoDQADjBgAh3QMgAOIGACHeA0AA8AYAIYAEAQDhBgAhgQQBAOEGACGCBAEA7gYAIYMEAQDuBgAhmQQBAO4GACEOAwAA_wgAIA4AAIEJACAYAACCCQAgvgMBAOEGACHMAwEA4QYAIc8DQADjBgAh2gNAAOMGACHdAyAA4gYAId4DQADwBgAhgAQBAOEGACGBBAEA4QYAIYIEAQDuBgAhgwQBAO4GACGZBAEA7gYAIQMAAAARACAvAADJCwAgMAAA6wsAIBgAAAARACADAACkCAAgCQAA9wgAIAsAAKYIACAOAACnCAAgDwAAqAgAIBgAAKkIACAoAADrCwAgvgMBAOEGACHMAwEA4QYAIc8DQADjBgAh2gNAAOMGACHdAyAA4gYAId4DQADwBgAhgAQBAOEGACGBBAEA4QYAIYIEAQDuBgAhgwQBAO4GACGEBAEA7gYAIYUEAQDuBgAhhgQCAO0GACGHBAIA7QYAIYgEIADiBgAhiQQBAOEGACEWAwAApAgAIAkAAPcIACALAACmCAAgDgAApwgAIA8AAKgIACAYAACpCAAgvgMBAOEGACHMAwEA4QYAIc8DQADjBgAh2gNAAOMGACHdAyAA4gYAId4DQADwBgAhgAQBAOEGACGBBAEA4QYAIYIEAQDuBgAhgwQBAO4GACGEBAEA7gYAIYUEAQDuBgAhhgQCAO0GACGHBAIA7QYAIYgEIADiBgAhiQQBAOEGACEJzAMBAAAAAc8DQAAAAAHYAwEAAAAB2QMBAAAAAdoDQAAAAAHdAyAAAAAB3gNAAAAAAf4DIAAAAAH_AyAAAAABGAYAAPQHACAMAAD4BwAgGAAA9wcAIBsAANQIACAcAAD1BwAgzAMBAAAAAc8DQAAAAAHUAwAAAIwEAtcDAQAAAAHYAwEAAAAB2gNAAAAAAYoEAQAAAAGMBAAAAOQDAo0EQAAAAAGOBEAAAAABjwRAAAAAAZAEQAAAAAGRBAEAAAABkwQAAACTBAOUBEAAAAABlQQBAAAAAZYEAAAAkwQDlwQBAAAAAZgEAQAAAAECAAAADwAgLwAA7QsAIBYDAADhCAAgCQAA-AgAIAoAAOIIACALAADjCAAgDwAA5QgAIBgAAOYIACC-AwEAAAABzAMBAAAAAc8DQAAAAAHaA0AAAAAB3QMgAAAAAd4DQAAAAAGABAEAAAABgQQBAAAAAYIEAQAAAAGDBAEAAAABhAQBAAAAAYUEAQAAAAGGBAIAAAABhwQCAAAAAYgEIAAAAAGJBAEAAAABAgAAABMAIC8AAO8LACAOAwAAngkAIAsAAJ8JACAYAAChCQAgvgMBAAAAAcwDAQAAAAHPA0AAAAAB2gNAAAAAAd0DIAAAAAHeA0AAAAABgAQBAAAAAYEEAQAAAAGCBAEAAAABgwQBAAAAAZkEAQAAAAECAAAA4QIAIC8AAPELACADAAAADQAgLwAA7QsAIDAAAPULACAaAAAADQAgBgAAkAcAIAwAAJQHACAYAACTBwAgGwAA0ggAIBwAAJEHACAoAAD1CwAgzAMBAOEGACHPA0AA4wYAIdQDAACNB4wEItcDAQDhBgAh2AMBAO4GACHaA0AA4wYAIYoEAQDhBgAhjAQAAI4H5AMijQRAAOMGACGOBEAA8AYAIY8EQADwBgAhkARAAPAGACGRBAEA7gYAIZMEAACPB5MEI5QEQADwBgAhlQQBAO4GACGWBAAAjweTBCOXBAEA7gYAIZgEAQDhBgAhGAYAAJAHACAMAACUBwAgGAAAkwcAIBsAANIIACAcAACRBwAgzAMBAOEGACHPA0AA4wYAIdQDAACNB4wEItcDAQDhBgAh2AMBAO4GACHaA0AA4wYAIYoEAQDhBgAhjAQAAI4H5AMijQRAAOMGACGOBEAA8AYAIY8EQADwBgAhkARAAPAGACGRBAEA7gYAIZMEAACPB5MEI5QEQADwBgAhlQQBAO4GACGWBAAAjweTBCOXBAEA7gYAIZgEAQDhBgAhAwAAABEAIC8AAO8LACAwAAD4CwAgGAAAABEAIAMAAKQIACAJAAD3CAAgCgAApQgAIAsAAKYIACAPAACoCAAgGAAAqQgAICgAAPgLACC-AwEA4QYAIcwDAQDhBgAhzwNAAOMGACHaA0AA4wYAId0DIADiBgAh3gNAAPAGACGABAEA4QYAIYEEAQDhBgAhggQBAO4GACGDBAEA7gYAIYQEAQDuBgAhhQQBAO4GACGGBAIA7QYAIYcEAgDtBgAhiAQgAOIGACGJBAEA4QYAIRYDAACkCAAgCQAA9wgAIAoAAKUIACALAACmCAAgDwAAqAgAIBgAAKkIACC-AwEA4QYAIcwDAQDhBgAhzwNAAOMGACHaA0AA4wYAId0DIADiBgAh3gNAAPAGACGABAEA4QYAIYEEAQDhBgAhggQBAO4GACGDBAEA7gYAIYQEAQDuBgAhhQQBAO4GACGGBAIA7QYAIYcEAgDtBgAhiAQgAOIGACGJBAEA4QYAIQMAAAALACAvAADxCwAgMAAA-wsAIBAAAAALACADAAD_CAAgCwAAgAkAIBgAAIIJACAoAAD7CwAgvgMBAOEGACHMAwEA4QYAIc8DQADjBgAh2gNAAOMGACHdAyAA4gYAId4DQADwBgAhgAQBAOEGACGBBAEA4QYAIYIEAQDuBgAhgwQBAO4GACGZBAEA7gYAIQ4DAAD_CAAgCwAAgAkAIBgAAIIJACC-AwEA4QYAIcwDAQDhBgAhzwNAAOMGACHaA0AA4wYAId0DIADiBgAh3gNAAPAGACGABAEA4QYAIYEEAQDhBgAhggQBAO4GACGDBAEA7gYAIZkEAQDuBgAhAQMAAgkEBgMFCgQGDAUIACAMTwgeUQEfVRwgVhAiWh0BAwACAQMAAgUDAAIIABsLEAYOSgsYSw0HBgAFCAAaDEgIGEcNGwAHHEUZHUYLAwwACA1DBhoAFwgDAAIIABYJAAkKGQcLGgYOHgsPIQwYJQ0CBxQICAAKAQcVAAMGAAUMAAgNHwYBDAAIBgYABQgAFQwACA0mBhQqDhc1EgQIABEQAA0SLA8TMBABEQAOAgMAAhEADgETMQADCAAUEAANFjkTARUAEgEWOgACFDsAFzwABAo9AAs-AA4_ABhAAAIIABgZQQcBGUIAAQ0ABgEYSQADC0wADk0AGE4AAQMAAgMDAAIIAB8UXh4BIQAdARRfAAUEYAAFYQAfYgAgYwAiZAAAAQMAAgEDAAIDCAAlNQAmNgAnAAAAAwgAJTUAJjYAJwEDAAIBAwACAwgALDUALTYALgAAAAMIACw1AC02AC4BIQAdASEAHQUIADM1ADY2ADdXADRYADUAAAAAAAUIADM1ADY2ADdXADRYADUBEQAOAREADgUIADw1AD82AEBXAD1YAD4AAAAAAAUIADw1AD82AEBXAD1YAD4AAAMIAEU1AEY2AEcAAAADCABFNQBGNgBHAQMAAgEDAAIDCABMNQBNNgBOAAAAAwgATDUATTYATgEDAAIBAwACAwgAUzUAVDYAVQAAAAMIAFM1AFQ2AFUAAAADCABbNQBcNgBdAAAAAwgAWzUAXDYAXQEQAA0BEAANAwgAYjUAYzYAZAAAAAMIAGI1AGM2AGQBFQASARUAEgMIAGk1AGo2AGsAAAADCABpNQBqNgBrAwYABQwACA3TAgYDBgAFDAAIDdkCBgMIAHA1AHE2AHIAAAADCABwNQBxNgByAQMAAgEDAAIDCAB3NQB4NgB5AAAAAwgAdzUAeDYAeQMGAAUMgwMIGwAHAwYABQyJAwgbAAcDCAB-NQB_NgCAAQAAAAMIAH41AH82AIABAgMAAgkACQIDAAIJAAkFCACFATUAiAE2AIkBVwCGAVgAhwEAAAAAAAUIAIUBNQCIATYAiQFXAIYBWACHAQIMAAgaABcCDAAIGgAXAwgAjgE1AI8BNgCQAQAAAAMIAI4BNQCPATYAkAEBDAAIAQwACAMIAJUBNQCWATYAlwEAAAADCACVATUAlgE2AJcBAAADCACcATUAnQE2AJ4BAAAAAwgAnAE1AJ0BNgCeAQEQAA0BEAANAwgAowE1AKQBNgClAQAAAAMIAKMBNQCkATYApQECAwACEQAOAgMAAhEADgMIAKoBNQCrATYArAEAAAADCACqATUAqwE2AKwBAQMAAgEDAAIDCACxATUAsgE2ALMBAAAAAwgAsQE1ALIBNgCzAQENAAYBDQAGBQgAuAE1ALsBNgC8AVcAuQFYALoBAAAAAAAFCAC4ATUAuwE2ALwBVwC5AVgAugEAAAMIAMEBNQDCATYAwwEAAAADCADBATUAwgE2AMMBAwYABQwACA3rBAYDBgAFDAAIDfEEBgUIAMgBNQDLATYAzAFXAMkBWADKAQAAAAAABQgAyAE1AMsBNgDMAVcAyQFYAMoBAAAAAwgA0gE1ANMBNgDUAQAAAAMIANIBNQDTATYA1AEAAAADCADaATUA2wE2ANwBAAAAAwgA2gE1ANsBNgDcASMCASRlASVnASZoASdpASlrASptIStuIixwAS1yIS5zIzF0ATJ1ATN2ITd5JDh6KDl7HTp8HTt9HTx-HT1_HT6BAR0_gwEhQIQBKUGGAR1CiAEhQ4kBKkSKAR1FiwEdRowBIUePAStIkAEvSZEBHkqSAR5LkwEeTJQBHk2VAR5OlwEeT5kBIVCaATBRnAEeUp4BIVOfATFUoAEeVaEBHlaiASFZpQEyWqYBOFuoAQ9cqQEPXasBD16sAQ9frQEPYK8BD2GxASFisgE5Y7QBD2S2ASFltwE6ZrgBD2e5AQ9ougEhab0BO2q-AUFrwAECbMEBAm3EAQJuxQECb8YBAnDIAQJxygEhcssBQnPNAQJ0zwEhddABQ3bRAQJ30gECeNMBIXnWAUR61wFIe9gBA3zZAQN92gEDftsBA3_cAQOAAd4BA4EB4AEhggHhAUmDAeMBA4QB5QEhhQHmAUqGAecBA4cB6AEDiAHpASGJAewBS4oB7QFPiwHuAQSMAe8BBI0B8AEEjgHxAQSPAfIBBJAB9AEEkQH2ASGSAfcBUJMB-QEElAH7ASGVAfwBUZYB_QEElwH-AQSYAf8BIZkBggJSmgGDAlabAYUCV5wBhgJXnQGJAleeAYoCV58BiwJXoAGNAlehAY8CIaIBkAJYowGSAlekAZQCIaUBlQJZpgGWAlenAZcCV6gBmAIhqQGbAlqqAZwCXqsBnQISrAGeAhKtAZ8CEq4BoAISrwGhAhKwAaMCErEBpQIhsgGmAl-zAagCErQBqgIhtQGrAmC2AawCErcBrQISuAGuAiG5AbECYboBsgJluwGzAhO8AbQCE70BtQITvgG2AhO_AbcCE8ABuQITwQG7AiHCAbwCZsMBvgITxAHAAiHFAcECZ8YBwgITxwHDAhPIAcQCIckBxwJoygHIAmzLAckCDcwBygINzQHLAg3OAcwCDc8BzQIN0AHPAg3RAdECIdIB0gJt0wHVAg3UAdcCIdUB2AJu1gHaAg3XAdsCDdgB3AIh2QHfAm_aAeACc9sB4gIF3AHjAgXdAeUCBd4B5gIF3wHnAgXgAekCBeEB6wIh4gHsAnTjAe4CBeQB8AIh5QHxAnXmAfICBecB8wIF6AH0AiHpAfcCduoB-AJ66wH5AgbsAfoCBu0B-wIG7gH8AgbvAf0CBvAB_wIG8QGBAyHyAYIDe_MBhQMG9AGHAyH1AYgDfPYBigMG9wGLAwb4AYwDIfkBjwN9-gGQA4EB-wGRAwj8AZIDCP0BkwMI_gGUAwj_AZUDCIAClwMIgQKZAyGCApoDggGDApwDCIQCngMhhQKfA4MBhgKgAwiHAqEDCIgCogMhiQKlA4QBigKmA4oBiwKnAweMAqgDB40CqQMHjgKqAwePAqsDB5ACrQMHkQKvAyGSArADiwGTArIDB5QCtAMhlQK1A4wBlgK2AweXArcDB5gCuAMhmQK7A40BmgK8A5EBmwK-AwycAr8DDJ0CwQMMngLCAwyfAsMDDKACxQMMoQLHAyGiAsgDkgGjAsoDDKQCzAMhpQLNA5MBpgLOAwynAs8DDKgC0AMhqQLTA5QBqgLUA5gBqwLWAwmsAtcDCa0C2gMJrgLbAwmvAtwDCbAC3gMJsQLgAyGyAuEDmQGzAuMDCbQC5QMhtQLmA5oBtgLnAwm3AugDCbgC6QMhuQLsA5sBugLtA58BuwLuAw68Au8DDr0C8AMOvgLxAw6_AvIDDsAC9AMOwQL2AyHCAvcDoAHDAvkDDsQC-wMhxQL8A6EBxgL9Aw7HAv4DDsgC_wMhyQKCBKIBygKDBKYBywKEBBDMAoUEEM0ChgQQzgKHBBDPAogEENACigQQ0QKMBCHSAo0EpwHTAo8EENQCkQQh1QKSBKgB1gKTBBDXApQEENgClQQh2QKYBKkB2gKZBK0B2wKaBBzcApsEHN0CnAQc3gKdBBzfAp4EHOACoAQc4QKiBCHiAqMErgHjAqUEHOQCpwQh5QKoBK8B5gKpBBznAqoEHOgCqwQh6QKuBLAB6gKvBLQB6wKxBBnsArIEGe0CtAQZ7gK1BBnvArYEGfACuAQZ8QK6BCHyArsEtQHzAr0EGfQCvwQh9QLABLYB9gLBBBn3AsIEGfgCwwQh-QLGBLcB-gLHBL0B-wLJBBf8AsoEF_0CzQQX_gLOBBf_As8EF4AD0QQXgQPTBCGCA9QEvgGDA9YEF4QD2AQhhQPZBL8BhgPaBBeHA9sEF4gD3AQhiQPfBMABigPgBMQBiwPhBAuMA-IEC40D4wQLjgPkBAuPA-UEC5AD5wQLkQPpBCGSA-oExQGTA-0EC5QD7wQhlQPwBMYBlgPyBAuXA_MEC5gD9AQhmQP3BMcBmgP4BM0BmwP6BM4BnAP7BM4BnQP-BM4BngP_BM4BnwOABc4BoAOCBc4BoQOEBSGiA4UFzwGjA4cFzgGkA4kFIaUDigXQAaYDiwXOAacDjAXOAagDjQUhqQOQBdEBqgORBdUBqwOTBdYBrAOUBdYBrQOXBdYBrgOYBdYBrwOZBdYBsAObBdYBsQOdBSGyA54F1wGzA6AF1gG0A6IFIbUDowXYAbYDpAXWAbcDpQXWAbgDpgUhuQOpBdkBugOqBd0B"
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
  AIChatMessageScalarFieldEnum: () => AIChatMessageScalarFieldEnum,
  AIConversationScalarFieldEnum: () => AIConversationScalarFieldEnum,
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
  MessageReactionScalarFieldEnum: () => MessageReactionScalarFieldEnum,
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
  AIConversation: "AIConversation",
  AIChatMessage: "AIChatMessage",
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
  MessageReaction: "MessageReaction",
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
var AIConversationScalarFieldEnum = {
  id: "id",
  userId: "userId",
  title: "title",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var AIChatMessageScalarFieldEnum = {
  id: "id",
  conversationId: "conversationId",
  role: "role",
  content: "content",
  model: "model",
  provider: "provider",
  tokensUsed: "tokensUsed",
  latencyMs: "latencyMs",
  feedback: "feedback",
  createdAt: "createdAt"
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
  startedAt: "startedAt",
  endedAt: "endedAt",
  cancelledAt: "cancelledAt",
  cancelReason: "cancelReason",
  cancelledBy: "cancelledBy",
  rescheduledAt: "rescheduledAt",
  rescheduleReason: "rescheduleReason",
  rescheduledBy: "rescheduledBy",
  sessionSummary: "sessionSummary",
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
var MessageReactionScalarFieldEnum = {
  id: "id",
  messageId: "messageId",
  userId: "userId",
  emoji: "emoji",
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
  ONGOING: "ONGOING",
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
var AIChatMessageRole = {
  USER: "USER",
  ASSISTANT: "ASSISTANT",
  SYSTEM: "SYSTEM"
};

// src/generated/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = envVars.DATABASE_URL;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });
var sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
var formatConnectionError = (error) => {
  if (error instanceof Error) {
    return error.message;
  }
  return "Unknown database connection error";
};
var connectPrismaWithRetry = async ({
  retries = 3,
  retryDelayMs = 1500
} = {}) => {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      await prisma.$connect();
      return;
    } catch (error) {
      lastError = error;
      const isLastAttempt = attempt === retries;
      const errorMessage = formatConnectionError(error);
      console.error(
        `Prisma connection attempt ${attempt}/${retries} failed: ${errorMessage}`
      );
      if (isLastAttempt) {
        break;
      }
      await sleep(retryDelayMs);
    }
  }
  throw lastError;
};

// src/utilis/email.ts
import nodemailer from "nodemailer";
import status2 from "http-status";
var transporter = nodemailer.createTransport({
  host: envVars.EMAIL_SENDER.SMTP_HOST,
  secure: true,
  auth: {
    user: envVars.EMAIL_SENDER.SMTP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASSWORD
  },
  port: parseInt(envVars.EMAIL_SENDER.SMTP_PORT)
});
var escapeHtml = (value) => String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
var renderOtpTemplate = (data) => {
  const name = escapeHtml(data.name ?? "User");
  const otp = escapeHtml(data.otp ?? "");
  return `<!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif; background:#f6f8fb; padding:24px;">
    <div style="max-width:480px;margin:auto;background:#ffffff;border-radius:8px;padding:24px;">
      <h2 style="margin:0 0 16px;color:#111;">Hello ${name},</h2>
      <p style="color:#333;">Use the verification code below. It expires in 2 minutes.</p>
      <div style="font-size:28px;font-weight:bold;letter-spacing:6px;background:#f1f5f9;padding:16px;border-radius:6px;text-align:center;color:#0f172a;">${otp}</div>
      <p style="color:#666;font-size:13px;margin-top:16px;">If you didn't request this, you can ignore this email.</p>
    </div>
  </body>
</html>`;
};
var templateRegistry = {
  otp: renderOtpTemplate
};
var sendEmail = async ({
  subject,
  templateData,
  templateName,
  to,
  attachments
}) => {
  try {
    const renderer = templateRegistry[templateName];
    if (!renderer) {
      throw new AppError_default(
        status2.INTERNAL_SERVER_ERROR,
        `Unknown email template: ${templateName}`
      );
    }
    const html = renderer(templateData);
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
var ignoredBetterAuthMessages = /* @__PURE__ */ new Set([
  "User not found",
  "Invalid password",
  "Credential account not found",
  "Password not found"
]);
var shouldIgnoreBetterAuthLog = (level, message) => {
  return level === "error" && ignoredBetterAuthMessages.has(message);
};
var auth = betterAuth({
  baseURL: envVars.BETTER_AUTH_URL,
  secret: envVars.BETTER_AUTH_SECRET,
  logger: {
    level: "warn",
    log(level, message, ...args) {
      if (shouldIgnoreBetterAuthLog(level, message)) {
        return;
      }
      if (level === "error") {
        console.error(message, ...args);
        return;
      }
      if (level === "warn") {
        console.warn(message, ...args);
        return;
      }
      console.log(message, ...args);
    }
  },
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
    // Backend routes call Better Auth APIs server-to-server (no browser Origin header).
    // Keep CORS as the browser boundary and bypass Better Auth's Origin-based CSRF check.
    disableCSRFCheck: true,
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

// src/middleware/cheackAuth.ts
var checkAuth = (...authRoles) => async (req, res, next) => {
  console.log("Cookies:", req.headers.cookie);
  try {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : void 0;
    const cookieToken = CookieUtils.getCookie(req, "accessToken");
    const accessToken = bearerToken || cookieToken;
    const betterAuthSessionToken = CookieUtils.getCookie(req, "better-auth.session_token") || CookieUtils.getCookie(req, "__Secure-better-auth.session_token");
    let userId = null;
    let betterAuthSession = null;
    if (accessToken) {
      const verified = jwtUtils.verifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET);
      if (verified.success && verified.data?.userId) {
        userId = String(verified.data.userId);
      }
    }
    if (!userId && (betterAuthSessionToken || authHeader)) {
      const fallbackCookieHeader = req.headers.cookie || [
        betterAuthSessionToken ? `better-auth.session_token=${betterAuthSessionToken}` : "",
        betterAuthSessionToken ? `__Secure-better-auth.session_token=${betterAuthSessionToken}` : ""
      ].filter(Boolean).join("; ");
      betterAuthSession = await auth.api.getSession({
        headers: {
          ...fallbackCookieHeader ? { cookie: fallbackCookieHeader } : {},
          ...authHeader ? { authorization: authHeader } : {}
        }
      }).catch(() => null);
      if (betterAuthSession?.user?.id) {
        userId = betterAuthSession.user.id;
      }
    }
    if (!userId) {
      throw new AppError_default(
        status3.UNAUTHORIZED,
        `Unauthorized! No access token. Route: ${req.method} ${req.originalUrl}. Send cookie or Bearer token.`
      );
    }
    const user = await prisma.user.findUnique({
      where: { id: userId }
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
    if (!cookieToken && betterAuthSession?.user?.id === user.id) {
      const refreshedAccessToken = tokenUtils.getAccessToken({
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
        isDeleted: user.isDeleted,
        emailVerified: user.emailVerified
      });
      tokenUtils.setAccessTokenCookie(res, refreshedAccessToken);
    }
    req.user = {
      userId: user.id,
      role: userRole,
      email: user.email
    };
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
    console.log("Authorization:", req.headers.authorization);
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

// src/utilis/seed.ts
var DEMO_CLIENT_EMAIL = process.env.DEMO_CLIENT_EMAIL || "client@consultedge.demo";
var DEMO_CLIENT_PASSWORD = process.env.DEMO_CLIENT_PASSWORD || "Demo@12345";
var DEMO_CLIENT_NAME = process.env.DEMO_CLIENT_NAME || "Demo Client";
var getDemoClientCredentials = () => ({
  email: DEMO_CLIENT_EMAIL,
  password: DEMO_CLIENT_PASSWORD,
  name: DEMO_CLIENT_NAME
});
var seedDemoClient = async () => {
  const credentials = getDemoClientCredentials();
  const existingUser = await prisma.user.findUnique({
    where: {
      email: credentials.email
    },
    select: {
      id: true
    }
  });
  let userId = existingUser?.id;
  if (!userId) {
    const created = await auth.api.signUpEmail({
      body: {
        email: credentials.email,
        password: credentials.password,
        name: credentials.name,
        role: Role.CLIENT,
        rememberMe: false
      }
    });
    userId = created.user.id;
  }
  await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      name: credentials.name,
      role: Role.CLIENT,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      needPasswordChange: false,
      isDeleted: false,
      deletedAt: null
    }
  });
  await prisma.client.upsert({
    where: {
      userId
    },
    create: {
      userId,
      fullName: credentials.name,
      email: credentials.email,
      isDeleted: false
    },
    update: {
      fullName: credentials.name,
      email: credentials.email,
      isDeleted: false,
      deletedAt: null
    }
  });
  return credentials;
};
var seedAdmin = async () => {
  try {
    const isAdminExists = await prisma.user.findFirst({
      where: {
        role: Role.ADMIN
      }
    });
    if (isAdminExists) {
      console.log(" admin already exists");
      return;
    }
    const adminUser = await auth.api.signUpEmail({
      body: {
        email: envVars.ADMIN_EMAIL,
        password: envVars.ADMIN_PASSWORD,
        name: "Admin Saheb",
        role: Role.ADMIN,
        rememberMe: false
      }
    });
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: {
          id: adminUser.user.id
        },
        data: {
          emailVerified: true
        }
      });
      await tx.admin.create({
        data: {
          userId: adminUser.user.id,
          name: " Admin Saheb",
          email: envVars.ADMIN_EMAIL
        }
      });
    });
    const admin = await prisma.admin.findFirst({
      where: {
        email: envVars.ADMIN_EMAIL
      },
      include: {
        user: true
      }
    });
    console.log(" admin created", admin);
  } catch (error) {
    console.error("Error sending  admin", error);
    await prisma.user.delete({
      where: {
        email: envVars.ADMIN_EMAIL
      }
    });
  }
};

// src/modules/auth/auth.service.ts
var isBetterAuthLikeError = (error) => {
  if (!error || typeof error !== "object") {
    return false;
  }
  const candidate = error;
  return typeof candidate.statusCode === "number" || typeof candidate.status === "string" || typeof candidate.body?.message === "string";
};
var mapBetterAuthError = (error, fallbackMessage) => {
  if (!isBetterAuthLikeError(error)) {
    return null;
  }
  const message = error.body?.message || error.message || fallbackMessage;
  const statusCode = typeof error.statusCode === "number" ? error.statusCode : error.status === "UNAUTHORIZED" ? status6.UNAUTHORIZED : status6.BAD_REQUEST;
  return new AppError_default(statusCode, message);
};
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
  }).catch((error) => {
    const mappedError = mapBetterAuthError(
      error,
      "Invalid email or password"
    );
    if (mappedError) {
      throw mappedError;
    }
    throw error;
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
var loginDemoClient = async () => {
  await seedDemoClient();
  const credentials = getDemoClientCredentials();
  const data = await auth.api.signInEmail({
    body: {
      email: credentials.email,
      password: credentials.password
    }
  }).catch((error) => {
    const mappedError = mapBetterAuthError(
      error,
      "Client demo login failed"
    );
    if (mappedError) {
      throw mappedError;
    }
    throw error;
  });
  if (data.user.role !== Role.CLIENT) {
    throw new AppError_default(status6.FORBIDDEN, "Demo account role is invalid");
  }
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
var changePassword = async (payload, authContext) => {
  const { sessionToken, authorizationHeader, cookieHeader, userId } = authContext;
  const buildHeaders = (token) => {
    const headerInit = {};
    if (authorizationHeader) {
      headerInit.Authorization = authorizationHeader;
    } else if (token) {
      headerInit.Authorization = `Bearer ${token}`;
    }
    if (cookieHeader) {
      headerInit.Cookie = cookieHeader;
    } else if (token) {
      headerInit.Cookie = `better-auth.session_token=${token}; __Secure-better-auth.session_token=${token}`;
    }
    return new Headers(headerInit);
  };
  if (!sessionToken && !authorizationHeader && !cookieHeader && !userId) {
    throw new AppError_default(status6.UNAUTHORIZED, "Session expired. Please login again.");
  }
  let authHeaders = buildHeaders(sessionToken);
  let session = await auth.api.getSession({
    headers: authHeaders
  }).catch(() => null);
  if (!session?.user && userId) {
    const activeSession = await prisma.session.findFirst({
      where: {
        userId,
        expiresAt: {
          gt: /* @__PURE__ */ new Date()
        }
      },
      orderBy: {
        updatedAt: "desc"
      }
    });
    if (activeSession?.token) {
      authHeaders = buildHeaders(activeSession.token);
      session = await auth.api.getSession({
        headers: authHeaders
      }).catch(() => null);
    }
  }
  if (!session?.user) {
    throw new AppError_default(status6.UNAUTHORIZED, "Invalid session token. Please login again.");
  }
  const { currentPassword, newPassword } = payload;
  if (currentPassword && currentPassword === newPassword) {
    throw new AppError_default(
      status6.BAD_REQUEST,
      "New password must be different from current password"
    );
  }
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
  const operationStatus = "status" in result ? result.status : true;
  if (!operationStatus) {
    const errorMessage = typeof result?.message === "string" ? result.message : "Password change failed. Please verify your current password and try again.";
    throw new AppError_default(status6.BAD_REQUEST, errorMessage);
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
  const previousCredentialAccount = await prisma.account.findFirst({
    where: {
      userId: isUserExists.id,
      providerId: "credential"
    },
    select: {
      password: true,
      updatedAt: true
    }
  });
  const result = await auth.api.resetPasswordEmailOTP({
    body: {
      email,
      otp,
      password: newPassword
    }
  });
  if (!result?.success) {
    throw new AppError_default(status6.BAD_REQUEST, "Password reset failed");
  }
  const updatedCredentialAccount = await prisma.account.findFirst({
    where: {
      userId: isUserExists.id,
      providerId: "credential"
    },
    select: {
      password: true,
      updatedAt: true
    }
  });
  if (!updatedCredentialAccount?.password) {
    throw new AppError_default(status6.BAD_REQUEST, "New password was not saved");
  }
  if (previousCredentialAccount && previousCredentialAccount.password === updatedCredentialAccount.password && previousCredentialAccount.updatedAt.getTime() === updatedCredentialAccount.updatedAt.getTime()) {
    throw new AppError_default(status6.BAD_REQUEST, "New password was not saved");
  }
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
  loginDemoClient,
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
var clientDemoLogin = catchAsync(async (_req, res) => {
  const result = await authService.loginDemoClient();
  const {
    accessToken,
    refreshToken,
    token,
    user,
    ...rest
  } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    httpStatusCode: status7.OK,
    success: true,
    message: "demo login successfully",
    data: {
      accessToken,
      refreshToken,
      token,
      user,
      ...rest
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
    {
      sessionToken: betterAuthSessionToken,
      authorizationHeader: req.headers.authorization,
      cookieHeader: req.headers.cookie,
      userId: req.user?.userId
    }
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
  const cookieNames = [
    "accessToken",
    "refreshToken",
    "better-auth.session_token",
    "__Secure-better-auth.session_token"
  ];
  const clearOptionVariants = [
    { httpOnly: true, secure: true, sameSite: "none", path: "/" },
    { httpOnly: true, secure: false, sameSite: "lax", path: "/" },
    { httpOnly: true, secure: true, sameSite: "lax", path: "/" },
    { path: "/" },
    {}
  ];
  for (const name of cookieNames) {
    for (const opts of clearOptionVariants) {
      CookieUtils.clearCookie(res, name, opts);
    }
  }
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
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Google Login</title>
</head>
<body>
    <div><p>Redirecting to Google...</p></div>
    <script>
    (async () => {
        try {
            // Use a relative URL so the request always targets this same backend
            // origin, regardless of how BETTER_AUTH_URL is configured. Avoids
            // mixed-content / cross-origin failures behind a proxy.
            const response = await fetch("/api/auth/sign-in/social", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ provider: "google", callbackURL: ${JSON.stringify(callbackURL)} })
            });
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                document.body.innerHTML = '<div><p>Error redirecting to Google. Please try again later.</p></div>';
            }
        } catch (error) {
            document.body.innerHTML = '<div><p>Error redirecting to Google: ' + (error && error.message ? error.message : 'Unknown error') + '</p></div>';
        }
    })();
    </script>
</body>
</html>`;
  res.set("Content-Type", "text/html").send(html);
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
  const callbackParams = new URLSearchParams({
    accessToken,
    refreshToken,
    sessionToken,
    redirect: finalRedirectPath
  }).toString();
  res.redirect(`${envVars.FRONTEND_URL}/auth/oauth-callback?${callbackParams}`);
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
  clientDemoLogin,
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
var clientDemoLoginZodSchema = z2.object({
  mode: z2.literal("client").optional()
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
router2.post("/demo-login", validateRequest(clientDemoLoginZodSchema), authControler.clientDemoLogin);
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
          isBooked: false,
          schedule: {
            isDeleted: false,
            // Only return future / currently-active slots so that the
            // "next available time" reflects upcoming availability rather
            // than slots created earlier in time.
            endDateTime: { gt: /* @__PURE__ */ new Date() }
          }
        },
        include: { schedule: true },
        // Order by the actual slot start time so that the nearest upcoming
        // slot appears first, regardless of when it was created.
        orderBy: { schedule: { startDateTime: "asc" } }
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
var findActiveAdminById = async (id) => {
  const admin = await prisma.admin.findFirst({
    where: { id, isDeleted: false },
    include: { user: true }
  });
  if (!admin) {
    throw new AppError_default(status11.NOT_FOUND, "Admin not found");
  }
  return admin;
};
var buildAdminUpdatePayload = (payload) => {
  const data = {};
  if (payload.contactNumber !== void 0) {
    data.contactNumber = payload.contactNumber.trim();
  }
  if (payload.profilePhoto !== void 0) {
    data.profilePhoto = payload.profilePhoto.trim();
  }
  return data;
};
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
  return findActiveAdminById(id);
};
var updateAdmin = async (id, payload) => {
  const admin = await findActiveAdminById(id);
  const updatePayload = buildAdminUpdatePayload(payload);
  if (Object.keys(updatePayload).length === 0) {
    throw new AppError_default(status11.BAD_REQUEST, "No valid admin fields provided for update");
  }
  const updatedAdmin = await prisma.admin.update({
    where: { id },
    data: updatePayload,
    include: {
      user: true
    }
  });
  return updatedAdmin;
};
var markDeleteAdmin = async (id, user) => {
  const admin = await findActiveAdminById(id);
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
var adminIdParamsSchema = z4.object({
  id: z4.string().uuid("Invalid admin id")
});
var updateAdminValidationSchema = z4.object({
  params: adminIdParamsSchema,
  body: z4.object({
    contactNumber: z4.string().trim().min(1, "Contact number cannot be empty").optional(),
    profilePhoto: z4.string().trim().min(1, "Profile photo cannot be empty").optional()
  }).refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required for update"
  })
});
var adminIdValidationSchema = z4.object({
  params: adminIdParamsSchema
});

// src/modules/admin/admin.router.ts
var router4 = Router4();
router4.get("/", checkAuth(Role.ADMIN), adminController.getAllAdmin);
router4.get("/:id", checkAuth(Role.ADMIN), validateRequest(adminIdValidationSchema), adminController.getAdminById);
router4.put("/:id", checkAuth(Role.ADMIN), validateRequest(updateAdminValidationSchema), adminController.updateAdmin);
router4.delete("/:id", checkAuth(Role.ADMIN), validateRequest(adminIdValidationSchema), adminController.deleteAdmin);
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
          isPublished: true
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
          isPublished: true
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
            isPublished: true
          }
        });
      }
    }
  });
  return { success: true };
};
var publishMyExpertSchedules = async (userId, payload) => {
  const expert = await getActiveExpertByUserId(userId);
  const schedules = await prisma.expertSchedule.findMany({
    where: {
      expertId: expert.id,
      scheduleId: { in: payload.scheduleIds },
      isDeleted: false
    },
    select: { id: true, scheduleId: true }
  });
  if (schedules.length !== payload.scheduleIds.length) {
    throw new AppError_default(
      httpStatus.NOT_FOUND,
      "One or more schedule mappings were not found for this expert"
    );
  }
  const result = await prisma.expertSchedule.updateMany({
    where: {
      expertId: expert.id,
      scheduleId: { in: payload.scheduleIds },
      isDeleted: false
    },
    data: {
      isPublished: payload.isPublished
    }
  });
  return {
    success: true,
    updatedCount: result.count,
    isPublished: payload.isPublished
  };
};
var getPublishedExpertSchedules = async (expertId) => {
  const expert = await prisma.expert.findFirst({
    where: {
      id: expertId,
      isDeleted: false
    },
    select: { id: true }
  });
  if (!expert) {
    throw new AppError_default(httpStatus.NOT_FOUND, "Expert not found");
  }
  const now = /* @__PURE__ */ new Date();
  const schedules = await prisma.expertSchedule.findMany({
    where: {
      expertId,
      isDeleted: false,
      isBooked: false,
      isPublished: true,
      schedule: {
        isDeleted: false,
        startDateTime: { gt: now }
      }
    },
    include: {
      schedule: true,
      expert: {
        include: {
          user: true,
          industry: true
        }
      }
    },
    orderBy: {
      schedule: {
        startDateTime: "asc"
      }
    }
  });
  return schedules;
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
  updateMyExpertSchedules,
  deleteMyExpertSchedule,
  publishMyExpertSchedules,
  getPublishedExpertSchedules
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
var publishMyExpertSchedules2 = catchAsync(async (req, res) => {
  const result = await expertScheduleService.publishMyExpertSchedules(
    req.user.userId,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: "Expert schedules publish status updated successfully",
    data: result
  });
});
var getPublishedExpertSchedules2 = catchAsync(async (req, res) => {
  const expertId = req.params.expertId || req.query.expertId;
  if (!expertId) {
    return sendResponse(res, {
      httpStatusCode: status13.BAD_REQUEST,
      success: false,
      message: "expertId is required"
    });
  }
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
var expertScheduleController = {
  assignExpertSchedules: assignExpertSchedules2,
  getMyExpertSchedules: getMyExpertSchedules2,
  updateMyExpertSchedules: updateMyExpertSchedules2,
  deleteMyExpertSchedule: deleteMyExpertSchedule2,
  publishMyExpertSchedules: publishMyExpertSchedules2,
  getPublishedExpertSchedules: getPublishedExpertSchedules2
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
  "/published",
  expertScheduleController.getPublishedExpertSchedules
);
router5.get(
  "/published/:expertId",
  expertScheduleController.getPublishedExpertSchedules
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
var getActiveExpertByUserId2 = async (userId) => {
  const expert = await prisma.expert.findUnique({
    where: { userId }
  });
  if (expert && !expert.isDeleted) {
    return expert;
  }
  throw new AppError_default(
    status14.FORBIDDEN,
    "Only expert accounts can manage their own schedule catalog"
  );
};
var createSchedules = async (payload, user) => {
  const { startDate, endDate, startTime, endTime } = payload;
  const interval = 30;
  const schedules = [];
  const parseLocalDate = (dateStr) => {
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
      const next = new Date(cursor.getTime() + interval * 60 * 1e3);
      const s = cursor;
      const e = next;
      const existing = await prisma.schedule.findFirst({
        where: {
          startDateTime: s,
          endDateTime: e
        }
      });
      const schedule = existing ?? await prisma.schedule.create({
        data: {
          startDateTime: s,
          endDateTime: e
        }
      });
      schedules.push(schedule);
      cursor = next;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  if (user?.role === Role.EXPERT && user.userId && schedules.length) {
    const expert = await getActiveExpertByUserId2(user.userId);
    await prisma.$transaction(
      schedules.map(
        (schedule) => prisma.expertSchedule.upsert({
          where: {
            expertId_scheduleId: {
              expertId: expert.id,
              scheduleId: schedule.id
            }
          },
          update: {
            isDeleted: false,
            deletedAt: null
          },
          create: {
            expertId: expert.id,
            scheduleId: schedule.id,
            isPublished: true
          }
        })
      )
    );
  }
  return schedules;
};
var getAllSchedules = async (query, user) => {
  let baseQuery = {
    isDeleted: false
  };
  if (user?.role === Role.EXPERT && user.userId) {
    const expert = await getActiveExpertByUserId2(user.userId);
    baseQuery = {
      ...baseQuery,
      expertSchedules: {
        some: {
          expertId: expert.id,
          isDeleted: false
        }
      }
    };
  }
  if (user?.role === Role.CLIENT) {
    baseQuery = {
      ...baseQuery,
      startDateTime: {
        gt: /* @__PURE__ */ new Date()
      },
      expertSchedules: {
        some: {
          isDeleted: false,
          isBooked: false,
          isPublished: true,
          expert: {
            isDeleted: false
          }
        }
      }
    };
  }
  const qb = new QueryBuilder(
    prisma.schedule,
    query,
    {
      searchableFields: scheduleSearchableFields,
      filterableFields: scheduleFilterableFields
    }
  );
  const result = await qb.search().filter().where(baseQuery).paginate().dynamicInclude(scheduleIncludeConfig).sort().fields().excute();
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
var getPublishedSchedulesByExpertId = async (expertId) => {
  const expert = await prisma.expert.findFirst({
    where: {
      id: expertId,
      isDeleted: false
    },
    select: { id: true }
  });
  if (!expert) {
    throw new AppError_default(status14.NOT_FOUND, "Expert not found");
  }
  const now = /* @__PURE__ */ new Date();
  const schedules = await prisma.expertSchedule.findMany({
    where: {
      expertId,
      isDeleted: false,
      isBooked: false,
      isPublished: true,
      schedule: {
        isDeleted: false,
        startDateTime: { gt: now }
      }
    },
    include: {
      schedule: true,
      expert: {
        include: {
          user: true,
          industry: true
        }
      }
    },
    orderBy: {
      schedule: {
        startDateTime: "asc"
      }
    }
  });
  return schedules;
};
var updateSchedule = async (id, payload) => {
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
  getPublishedSchedulesByExpertId,
  updateSchedule,
  deleteSchedule
};

// src/modules/schedules/schedules.controler.ts
var createSchedule = catchAsync(async (req, res) => {
  const payload = req.body;
  const schedule = await schedulesService.createSchedules(payload, req.user);
  sendResponse(res, {
    success: true,
    httpStatusCode: status15.CREATED,
    message: "Schedule created successfully",
    data: schedule
  });
});
var getAllSchedules2 = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await schedulesService.getAllSchedules(query, req.user);
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
var getPublishedSchedulesByExpertId2 = catchAsync(async (req, res) => {
  const expertId = req.params.expertId || req.query.expertId;
  if (!expertId) {
    return sendResponse(res, {
      success: false,
      httpStatusCode: status15.BAD_REQUEST,
      message: "expertId is required"
    });
  }
  const result = await schedulesService.getPublishedSchedulesByExpertId(expertId);
  sendResponse(res, {
    success: true,
    httpStatusCode: status15.OK,
    message: "Published schedules retrieved successfully",
    data: result
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
  getPublishedSchedulesByExpertId: getPublishedSchedulesByExpertId2,
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
router6.get("/", checkAuth(Role.ADMIN, Role.EXPERT, Role.CLIENT), ScheduleController.getAllSchedules);
router6.get("/published", ScheduleController.getPublishedSchedulesByExpertId);
router6.get("/published/:expertId", ScheduleController.getPublishedSchedulesByExpertId);
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
var consultationIdParamsSchema = z8.object({
  consultationId: z8.string().uuid("Invalid consultation id")
});
var bookConsultationValidation = z8.object({
  body: z8.object({
    expertId: z8.string().uuid("Invalid expert id"),
    expertScheduleId: z8.string().uuid("Invalid expert schedule id")
  })
});
var initiateConsultationPaymentValidation = z8.object({
  params: consultationIdParamsSchema
});
var consultationSessionAccessValidation = z8.object({
  params: consultationIdParamsSchema
});
var startConsultationSessionValidation = z8.object({
  params: consultationIdParamsSchema
});
var completeConsultationValidation = z8.object({
  params: consultationIdParamsSchema,
  body: z8.object({
    sessionSummary: z8.string().trim().max(2e3).optional()
  }).default({})
});
var cancelConsultationValidation = z8.object({
  params: consultationIdParamsSchema,
  body: z8.object({
    reason: z8.string().trim().min(3, "Cancellation reason is required").max(500)
  })
});
var rescheduleConsultationValidation = z8.object({
  params: consultationIdParamsSchema,
  body: z8.object({
    newExpertScheduleId: z8.string().uuid("Invalid expert schedule id"),
    reason: z8.string().trim().max(500).optional()
  })
});
var updateConsultationStatusValidation = z8.object({
  params: consultationIdParamsSchema,
  body: z8.object({
    status: z8.nativeEnum(ConsultationStatus),
    reason: z8.string().trim().min(3).max(500).optional(),
    sessionSummary: z8.string().trim().max(2e3).optional()
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

// src/modules/consultation/consultation.constant.ts
var bookingSearchableFields = [
  "client.user.name",
  "client.user.email",
  "expert.user.name",
  "expert.user.email",
  "videoCallId",
  "payment.transactionId"
];
var bookingFilterableFields = [
  "status",
  "paymentStatus",
  "clientId",
  "expertId",
  "date",
  "createdAt"
];
var bookingIncludeConfig = {
  client: {
    include: {
      user: true
    }
  },
  expert: {
    include: {
      user: true
    }
  },
  payment: true,
  expertSchedule: {
    include: {
      schedule: true
    }
  },
  testimonial: true
};

// src/modules/consultation/consultation.service.ts
var SESSION_JOIN_LEAD_MINUTES = 15;
var SESSION_JOIN_GRACE_MINUTES = 30;
var consultationInclude = {
  client: {
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
  },
  expert: {
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
  },
  payment: true,
  expertSchedule: {
    include: {
      schedule: true
    }
  },
  testimonial: true
};
var sendConsultationNotifications = async ({
  type,
  clientUserId,
  expertUserId,
  clientMessage,
  expertMessage
}) => {
  const notifications = [
    clientUserId && clientMessage ? {
      type,
      message: clientMessage,
      userId: clientUserId
    } : null,
    expertUserId && expertMessage ? {
      type,
      message: expertMessage,
      userId: expertUserId
    } : null
  ].filter(
    (item) => Boolean(item)
  );
  if (notifications.length) {
    await prisma.notification.createMany({
      data: notifications
    });
  }
};
var getSessionMeta = (consultation) => {
  const scheduledStart = consultation.expertSchedule?.schedule?.startDateTime ?? consultation.date;
  const scheduledEnd = consultation.expertSchedule?.schedule?.endDateTime ?? new Date(scheduledStart.getTime() + 60 * 60 * 1e3);
  const joinAvailableFrom = new Date(
    scheduledStart.getTime() - SESSION_JOIN_LEAD_MINUTES * 60 * 1e3
  );
  const joinAvailableUntil = new Date(
    scheduledEnd.getTime() + SESSION_JOIN_GRACE_MINUTES * 60 * 1e3
  );
  const now = /* @__PURE__ */ new Date();
  let canJoinNow = false;
  let joinMessage = "Session is ready to start.";
  if (consultation.status === ConsultationStatus.CANCELLED) {
    joinMessage = "This consultation has been cancelled.";
  } else if (consultation.status === ConsultationStatus.COMPLETED) {
    joinMessage = "This consultation has already been completed.";
  } else if (consultation.paymentStatus !== PaymentStatus.PAID) {
    joinMessage = "Payment must be completed before the session can start.";
  } else if (now < joinAvailableFrom) {
    joinMessage = `Session can be joined ${SESSION_JOIN_LEAD_MINUTES} minutes before the scheduled start time.`;
  } else if (now > joinAvailableUntil && consultation.status !== ConsultationStatus.ONGOING) {
    joinMessage = "The join window for this session has passed.";
  } else {
    canJoinNow = true;
    if (consultation.status === ConsultationStatus.ONGOING) {
      joinMessage = "Session is currently ongoing.";
    }
  }
  return {
    canJoinNow,
    scheduledStart,
    scheduledEnd,
    joinAvailableFrom,
    joinAvailableUntil,
    joinMessage
  };
};
var enrichConsultation = (consultation) => ({
  ...consultation,
  sessionMeta: getSessionMeta(consultation)
});
var getConsultationWithAccess = async (consultationId, user) => {
  if (user.role === Role.ADMIN) {
    return prisma.consultation.findUniqueOrThrow({
      where: { id: consultationId },
      include: consultationInclude
    });
  }
  if (user.role === Role.CLIENT) {
    const client = await prisma.client.findUnique({
      where: { userId: user.userId },
      select: { id: true }
    });
    if (!client) {
      throw new AppError_default(status18.NOT_FOUND, "Client profile not found");
    }
    const consultation = await prisma.consultation.findFirst({
      where: {
        id: consultationId,
        clientId: client.id
      },
      include: consultationInclude
    });
    if (!consultation) {
      throw new AppError_default(status18.NOT_FOUND, "Consultation not found");
    }
    return consultation;
  }
  if (user.role === Role.EXPERT) {
    const expert = await prisma.expert.findUnique({
      where: { userId: user.userId },
      select: { id: true }
    });
    if (!expert) {
      throw new AppError_default(status18.NOT_FOUND, "Expert profile not found");
    }
    const consultation = await prisma.consultation.findFirst({
      where: {
        id: consultationId,
        expertId: expert.id
      },
      include: consultationInclude
    });
    if (!consultation) {
      throw new AppError_default(status18.NOT_FOUND, "Consultation not found");
    }
    return consultation;
  }
  throw new AppError_default(status18.FORBIDDEN, "Only clients, experts, or admins can access consultations");
};
var validateBookableExpertSchedule = async (expertId, expertScheduleId) => {
  const expertSchedule = await prisma.expertSchedule.findFirst({
    where: {
      id: expertScheduleId,
      expertId,
      isDeleted: false
    },
    include: {
      schedule: true
    }
  });
  if (!expertSchedule) {
    throw new AppError_default(
      status18.NOT_FOUND,
      "The selected availability slot was not found for this expert"
    );
  }
  if (!expertSchedule.isPublished) {
    throw new AppError_default(status18.BAD_REQUEST, "This schedule is not published for booking yet");
  }
  if (expertSchedule.isBooked) {
    throw new AppError_default(
      status18.BAD_REQUEST,
      "This schedule is already booked for another consultation"
    );
  }
  return expertSchedule;
};
var syncUnpaidConsultationsWithStripe = async (where) => {
  const unpaidConsultations = await prisma.consultation.findMany({
    where: {
      ...where,
      paymentStatus: PaymentStatus.UNPAID,
      status: {
        in: [ConsultationStatus.PENDING, ConsultationStatus.CONFIRMED]
      },
      payment: {
        is: {
          status: PaymentStatus.UNPAID
        }
      }
    },
    select: {
      id: true,
      status: true,
      client: {
        select: {
          userId: true
        }
      },
      expert: {
        select: {
          userId: true
        }
      },
      payment: {
        select: {
          id: true,
          transactionId: true
        }
      }
    }
  });
  if (!unpaidConsultations.length) {
    return;
  }
  const consultationMap = new Map(
    unpaidConsultations.filter((item) => Boolean(item.payment?.id && item.payment?.transactionId)).map((item) => [
      item.id,
      {
        paymentId: item.payment.id,
        transactionId: item.payment.transactionId
      }
    ])
  );
  if (!consultationMap.size) {
    return;
  }
  const paidMatches = /* @__PURE__ */ new Map();
  let startingAfter;
  for (let page = 0; page < 5; page += 1) {
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      ...startingAfter ? { starting_after: startingAfter } : {}
    });
    for (const session of sessions.data) {
      if (session.payment_status !== "paid" || session.status !== "complete") {
        continue;
      }
      const consultationId = session.metadata?.consultationId;
      const paymentId = session.metadata?.paymentId;
      const transactionId = session.metadata?.transactionId;
      if (!consultationId || !paymentId || !transactionId) {
        continue;
      }
      const local = consultationMap.get(consultationId);
      if (!local) {
        continue;
      }
      if (local.paymentId !== paymentId || local.transactionId !== transactionId) {
        continue;
      }
      paidMatches.set(consultationId, {
        paymentId,
        transactionId,
        gatewayData: session
      });
    }
    if (!sessions.has_more || sessions.data.length === 0) {
      break;
    }
    startingAfter = sessions.data[sessions.data.length - 1]?.id;
  }
  if (!paidMatches.size) {
    return;
  }
  await prisma.$transaction(async (tx) => {
    for (const [consultationId, match] of paidMatches) {
      await tx.payment.update({
        where: { id: match.paymentId },
        data: {
          status: PaymentStatus.PAID,
          paymentGatewayData: match.gatewayData
        }
      });
      await tx.consultation.update({
        where: { id: consultationId },
        data: {
          paymentStatus: PaymentStatus.PAID,
          status: ConsultationStatus.CONFIRMED
        }
      });
    }
  });
};
var bookConsultation = async (payload, user) => {
  const client = await prisma.client.findUniqueOrThrow({
    where: { userId: user.userId }
  });
  const expert = await prisma.expert.findUniqueOrThrow({
    where: {
      id: payload.expertId,
      isDeleted: false
    }
  });
  const expertSchedule = await validateBookableExpertSchedule(
    expert.id,
    payload.expertScheduleId
  );
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
        transactionId,
        status: PaymentStatus.UNPAID
      }
    });
    const isPaid = payment.status === PaymentStatus.PAID;
    await tx.notification.createMany({
      data: [
        {
          type: "CONSULTATION_BOOKED",
          message: isPaid ? `Your consultation with ${expert.fullName} has been booked and paid successfully.` : `Your consultation with ${expert.fullName} has been booked successfully. Please complete the payment to confirm it.`,
          userId: client.userId
        },
        {
          type: "CONSULTATION_BOOKED",
          message: isPaid ? `${client.fullName} booked and paid for a consultation with you for ${expertSchedule.schedule.startDateTime.toLocaleString()}.` : `${client.fullName} booked a consultation with you for ${expertSchedule.schedule.startDateTime.toLocaleString()}. Payment confirmation is pending.`,
          userId: expert.userId
        }
      ]
    });
    const successParams = new URLSearchParams({
      consultationId: consultation.id,
      paymentId: payment.id,
      transactionId,
      status: "success",
      amount: String(expert.consultationFee)
    });
    const cancelParams = new URLSearchParams({
      consultationId: consultation.id,
      paymentId: payment.id,
      transactionId,
      status: "cancelled",
      amount: String(expert.consultationFee)
    });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Consultation with ${expert.fullName}`
            },
            unit_amount: expert.consultationFee * 100
          },
          quantity: 1
        }
      ],
      metadata: {
        consultationId: consultation.id,
        paymentId: payment.id,
        transactionId,
        amount: String(expert.consultationFee)
      },
      success_url: `${envVars.FRONTEND_URL}/dashboard/payment/consultation-success?${successParams.toString()}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${envVars.FRONTEND_URL}/dashboard/consultations?${cancelParams.toString()}`
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
    where: { userId: user.userId }
  });
  const expert = await prisma.expert.findUniqueOrThrow({
    where: {
      id: payload.expertId,
      isDeleted: false
    }
  });
  const expertSchedule = await validateBookableExpertSchedule(
    expert.id,
    payload.expertScheduleId
  );
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
    const isPaid = payment.status === PaymentStatus.PAID;
    await tx.notification.createMany({
      data: [
        {
          type: "CONSULTATION_BOOKED",
          message: isPaid ? `Your consultation with ${expert.fullName} has been booked and paid successfully.` : `Your consultation with ${expert.fullName} has been booked successfully. Please complete payment before the session starts.`,
          userId: client.userId
        },
        {
          type: "CONSULTATION_BOOKED",
          message: isPaid ? `${client.fullName} booked and paid for a consultation with you for ${expertSchedule.schedule.startDateTime.toLocaleString()}.` : `${client.fullName} booked a consultation with you for ${expertSchedule.schedule.startDateTime.toLocaleString()}.`,
          userId: expert.userId
        }
      ]
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
    try {
      await syncUnpaidConsultationsWithStripe({ clientId: client.id });
    } catch (error) {
      console.error("Failed to sync unpaid consultations for client:", error);
    }
    const consultations = await prisma.consultation.findMany({
      where: { clientId: client.id },
      include: consultationInclude,
      orderBy: { createdAt: "desc" }
    });
    return consultations.map((consultation) => enrichConsultation(consultation));
  }
  if (user.role === Role.EXPERT) {
    const expert = await prisma.expert.findUniqueOrThrow({
      where: { userId: user.userId }
    });
    try {
      await syncUnpaidConsultationsWithStripe({ expertId: expert.id });
    } catch (error) {
      console.error("Failed to sync unpaid consultations for expert:", error);
    }
    const consultations = await prisma.consultation.findMany({
      where: { expertId: expert.id },
      include: consultationInclude,
      orderBy: { createdAt: "desc" }
    });
    return consultations.map((consultation) => enrichConsultation(consultation));
  }
  throw new AppError_default(status18.FORBIDDEN, "Only clients and experts can view their bookings");
};
var initiateConsultationPayment = async (consultationId, user) => {
  const client = await prisma.client.findUniqueOrThrow({
    where: { userId: user.userId }
  });
  const consultation = await prisma.consultation.findFirst({
    where: {
      id: consultationId,
      clientId: client.id
    },
    include: {
      expert: true,
      payment: true
    }
  });
  if (!consultation) {
    throw new AppError_default(status18.NOT_FOUND, "Consultation not found");
  }
  if (!consultation.payment) {
    throw new AppError_default(status18.BAD_REQUEST, "Payment not found for this consultation");
  }
  if (consultation.payment.status === PaymentStatus.PAID) {
    throw new AppError_default(
      status18.BAD_REQUEST,
      "Payment already completed for this consultation"
    );
  }
  if (consultation.status === ConsultationStatus.CANCELLED || consultation.status === ConsultationStatus.COMPLETED || consultation.status === ConsultationStatus.ONGOING) {
    throw new AppError_default(
      status18.BAD_REQUEST,
      "Payment cannot be initiated for a cancelled, completed, or ongoing consultation."
    );
  }
  const successParams = new URLSearchParams({
    consultationId: consultation.id,
    paymentId: consultation.payment.id,
    transactionId: consultation.payment.transactionId,
    status: "success",
    amount: String(consultation.payment.amount)
  });
  const cancelParams = new URLSearchParams({
    consultationId: consultation.id,
    paymentId: consultation.payment.id,
    transactionId: consultation.payment.transactionId,
    status: "cancelled",
    amount: String(consultation.payment.amount)
  });
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
      paymentId: consultation.payment.id,
      transactionId: consultation.payment.transactionId,
      amount: String(consultation.payment.amount)
    },
    success_url: `${envVars.FRONTEND_URL}/dashboard/payment/consultation-success?${successParams.toString()}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${envVars.FRONTEND_URL}/dashboard/consultations?${cancelParams.toString()}`
  });
  return {
    paymentUrl: session.url
  };
};
var getSessionAccess = async (consultationId, user) => {
  const consultation = await getConsultationWithAccess(consultationId, user);
  const sessionMeta = getSessionMeta(consultation);
  return {
    consultation: enrichConsultation(consultation),
    videoCallId: consultation.videoCallId,
    ...sessionMeta
  };
};
var startSession = async (consultationId, user) => {
  const consultation = await getConsultationWithAccess(consultationId, user);
  if (consultation.status === ConsultationStatus.CANCELLED) {
    throw new AppError_default(status18.BAD_REQUEST, "This consultation has been cancelled.");
  }
  if (consultation.status === ConsultationStatus.COMPLETED) {
    throw new AppError_default(status18.BAD_REQUEST, "This consultation is already completed.");
  }
  const sessionMeta = getSessionMeta(consultation);
  if (!sessionMeta.canJoinNow && consultation.status !== ConsultationStatus.ONGOING) {
    throw new AppError_default(status18.BAD_REQUEST, sessionMeta.joinMessage);
  }
  if (consultation.status === ConsultationStatus.ONGOING) {
    return enrichConsultation(consultation);
  }
  const updatedConsultation = await prisma.consultation.update({
    where: { id: consultation.id },
    data: {
      status: ConsultationStatus.ONGOING,
      startedAt: consultation.startedAt ?? /* @__PURE__ */ new Date()
    },
    include: consultationInclude
  });
  await sendConsultationNotifications({
    type: "CONSULTATION_STARTED",
    clientUserId: updatedConsultation.client.userId,
    expertUserId: updatedConsultation.expert?.userId,
    clientMessage: `Your session with ${updatedConsultation.expert?.fullName ?? "your expert"} is now live.`,
    expertMessage: `Your session with ${updatedConsultation.client.fullName} is now live.`
  });
  return enrichConsultation(updatedConsultation);
};
var completeSession = async (consultationId, user, payload) => {
  const consultation = await getConsultationWithAccess(consultationId, user);
  if (consultation.status === ConsultationStatus.CANCELLED) {
    throw new AppError_default(status18.BAD_REQUEST, "Cancelled consultations cannot be completed.");
  }
  if (consultation.status === ConsultationStatus.COMPLETED) {
    return enrichConsultation(consultation);
  }
  if (consultation.status !== ConsultationStatus.ONGOING && consultation.paymentStatus !== PaymentStatus.PAID) {
    throw new AppError_default(
      status18.BAD_REQUEST,
      "Only paid or ongoing consultations can be completed."
    );
  }
  const updatedConsultation = await prisma.consultation.update({
    where: { id: consultation.id },
    data: {
      status: ConsultationStatus.COMPLETED,
      endedAt: /* @__PURE__ */ new Date(),
      sessionSummary: payload.sessionSummary?.trim() || consultation.sessionSummary
    },
    include: consultationInclude
  });
  await sendConsultationNotifications({
    type: "CONSULTATION_COMPLETED",
    clientUserId: updatedConsultation.client.userId,
    expertUserId: updatedConsultation.expert?.userId,
    clientMessage: `Your consultation with ${updatedConsultation.expert?.fullName ?? "your expert"} has been completed. You can now leave a review.`,
    expertMessage: `Your consultation with ${updatedConsultation.client.fullName} has been marked as completed.`
  });
  return enrichConsultation(updatedConsultation);
};
var cancelConsultation = async (consultationId, user, payload) => {
  const consultation = await getConsultationWithAccess(consultationId, user);
  if (consultation.status === ConsultationStatus.CANCELLED) {
    return enrichConsultation(consultation);
  }
  if (consultation.status === ConsultationStatus.COMPLETED) {
    throw new AppError_default(status18.BAD_REQUEST, "Completed consultations cannot be cancelled.");
  }
  if (consultation.status === ConsultationStatus.ONGOING && user.role !== Role.ADMIN) {
    throw new AppError_default(
      status18.BAD_REQUEST,
      "An ongoing session cannot be cancelled. Please complete it instead."
    );
  }
  const reason = payload.reason.trim();
  const updatedConsultation = await prisma.$transaction(async (tx) => {
    await tx.expertSchedule.update({
      where: { id: consultation.expertScheduleId },
      data: {
        isBooked: false,
        consultationId: null
      }
    });
    return tx.consultation.update({
      where: { id: consultation.id },
      data: {
        status: ConsultationStatus.CANCELLED,
        cancelledAt: /* @__PURE__ */ new Date(),
        cancelReason: reason,
        cancelledBy: user.role
      },
      include: consultationInclude
    });
  });
  await sendConsultationNotifications({
    type: "CONSULTATION_CANCELLED",
    clientUserId: updatedConsultation.client.userId,
    expertUserId: updatedConsultation.expert?.userId,
    clientMessage: `Your consultation with ${updatedConsultation.expert?.fullName ?? "your expert"} has been cancelled. Reason: ${reason}`,
    expertMessage: `Your consultation with ${updatedConsultation.client.fullName} has been cancelled. Reason: ${reason}`
  });
  if (updatedConsultation.paymentStatus === PaymentStatus.PAID) {
    const admins = await prisma.user.findMany({
      where: {
        role: Role.ADMIN,
        isDeleted: false
      },
      select: { id: true }
    });
    if (admins.length) {
      await prisma.notification.createMany({
        data: admins.map((admin) => ({
          type: "CONSULTATION_REFUND_REVIEW",
          message: `A paid consultation cancellation may need refund review. Consultation ID: ${updatedConsultation.id}`,
          userId: admin.id
        }))
      });
    }
  }
  return enrichConsultation(updatedConsultation);
};
var rescheduleConsultation = async (consultationId, user, payload) => {
  const consultation = await getConsultationWithAccess(consultationId, user);
  if (consultation.status === ConsultationStatus.CANCELLED) {
    throw new AppError_default(status18.BAD_REQUEST, "Cancelled consultations cannot be rescheduled.");
  }
  if (consultation.status === ConsultationStatus.COMPLETED) {
    throw new AppError_default(status18.BAD_REQUEST, "Completed consultations cannot be rescheduled.");
  }
  if (consultation.status === ConsultationStatus.ONGOING) {
    throw new AppError_default(status18.BAD_REQUEST, "An ongoing consultation cannot be rescheduled.");
  }
  if (consultation.expertScheduleId === payload.newExpertScheduleId) {
    throw new AppError_default(
      status18.BAD_REQUEST,
      "Please choose a different schedule for rescheduling."
    );
  }
  const newExpertSchedule = await prisma.expertSchedule.findFirst({
    where: {
      id: payload.newExpertScheduleId,
      expertId: consultation.expertId ?? void 0,
      isDeleted: false
    },
    include: {
      schedule: true
    }
  });
  if (!newExpertSchedule) {
    throw new AppError_default(status18.NOT_FOUND, "The new schedule slot was not found.");
  }
  if (!newExpertSchedule.isPublished) {
    throw new AppError_default(status18.BAD_REQUEST, "The selected schedule is not published.");
  }
  if (newExpertSchedule.isBooked) {
    throw new AppError_default(status18.BAD_REQUEST, "The selected schedule is already booked.");
  }
  if (newExpertSchedule.schedule.startDateTime <= /* @__PURE__ */ new Date()) {
    throw new AppError_default(
      status18.BAD_REQUEST,
      "Please choose a future schedule slot for rescheduling."
    );
  }
  const updatedConsultation = await prisma.$transaction(async (tx) => {
    await tx.expertSchedule.update({
      where: { id: consultation.expertScheduleId },
      data: {
        isBooked: false,
        consultationId: null
      }
    });
    await tx.expertSchedule.update({
      where: { id: newExpertSchedule.id },
      data: {
        isBooked: true,
        consultationId: consultation.id
      }
    });
    return tx.consultation.update({
      where: { id: consultation.id },
      data: {
        expertScheduleId: newExpertSchedule.id,
        date: newExpertSchedule.schedule.startDateTime,
        status: consultation.paymentStatus === PaymentStatus.PAID ? ConsultationStatus.CONFIRMED : ConsultationStatus.PENDING,
        rescheduledAt: /* @__PURE__ */ new Date(),
        rescheduleReason: payload.reason?.trim() || null,
        rescheduledBy: user.role,
        startedAt: null,
        endedAt: null
      },
      include: consultationInclude
    });
  });
  const reasonSuffix = payload.reason?.trim() ? ` Reason: ${payload.reason.trim()}` : "";
  await sendConsultationNotifications({
    type: "CONSULTATION_RESCHEDULED",
    clientUserId: updatedConsultation.client.userId,
    expertUserId: updatedConsultation.expert?.userId,
    clientMessage: `Your consultation with ${updatedConsultation.expert?.fullName ?? "your expert"} has been rescheduled to ${updatedConsultation.date.toLocaleString()}.${reasonSuffix}`,
    expertMessage: `Your consultation with ${updatedConsultation.client.fullName} has been rescheduled to ${updatedConsultation.date.toLocaleString()}.${reasonSuffix}`
  });
  return enrichConsultation(updatedConsultation);
};
var updateConsultationStatus = async (consultationId, user, payload) => {
  const nextStatus = payload.status;
  if (nextStatus === ConsultationStatus.ONGOING) {
    return startSession(consultationId, user);
  }
  if (nextStatus === ConsultationStatus.COMPLETED) {
    return completeSession(consultationId, user, {
      sessionSummary: payload.sessionSummary
    });
  }
  if (nextStatus === ConsultationStatus.CANCELLED) {
    return cancelConsultation(consultationId, user, {
      reason: payload.reason?.trim() || "Cancelled via consultation status update."
    });
  }
  const consultation = await getConsultationWithAccess(consultationId, user);
  if (consultation.status === ConsultationStatus.CANCELLED) {
    throw new AppError_default(
      status18.BAD_REQUEST,
      "Cancelled consultations cannot be updated to another status."
    );
  }
  if (consultation.status === ConsultationStatus.COMPLETED) {
    throw new AppError_default(
      status18.BAD_REQUEST,
      "Completed consultations cannot be updated to another status."
    );
  }
  if (consultation.status === nextStatus) {
    return enrichConsultation(consultation);
  }
  if (nextStatus === ConsultationStatus.CONFIRMED) {
    if (consultation.paymentStatus !== PaymentStatus.PAID) {
      throw new AppError_default(
        status18.BAD_REQUEST,
        "Only paid consultations can be confirmed."
      );
    }
    const updatedConsultation = await prisma.consultation.update({
      where: { id: consultation.id },
      data: {
        status: ConsultationStatus.CONFIRMED
      },
      include: consultationInclude
    });
    await sendConsultationNotifications({
      type: "CONSULTATION_CONFIRMED",
      clientUserId: updatedConsultation.client.userId,
      expertUserId: updatedConsultation.expert?.userId,
      clientMessage: `Your consultation with ${updatedConsultation.expert?.fullName ?? "your expert"} is now confirmed.`,
      expertMessage: `Your consultation with ${updatedConsultation.client.fullName} is now confirmed.`
    });
    return enrichConsultation(updatedConsultation);
  }
  if (nextStatus === ConsultationStatus.PENDING) {
    if (user.role !== Role.ADMIN) {
      throw new AppError_default(
        status18.FORBIDDEN,
        "Only admins can set consultation status to pending."
      );
    }
    const updatedConsultation = await prisma.consultation.update({
      where: { id: consultation.id },
      data: {
        status: ConsultationStatus.PENDING,
        startedAt: null,
        endedAt: null
      },
      include: consultationInclude
    });
    return enrichConsultation(updatedConsultation);
  }
  throw new AppError_default(status18.BAD_REQUEST, "Unsupported consultation status transition.");
};
var cancelUnpaidConsultations = async () => {
  const now = /* @__PURE__ */ new Date();
  const cutoffTime = new Date(now.getTime() + 30 * 60 * 1e3);
  const unpaidConsultations = await prisma.consultation.findMany({
    where: {
      date: { lte: cutoffTime },
      paymentStatus: PaymentStatus.UNPAID,
      status: ConsultationStatus.PENDING
    },
    select: {
      id: true,
      expertScheduleId: true,
      client: {
        select: {
          userId: true
        }
      },
      expert: {
        select: {
          userId: true,
          fullName: true
        }
      }
    }
  });
  if (!unpaidConsultations.length) {
    return { count: 0 };
  }
  const consultationIds = unpaidConsultations.map((item) => item.id);
  const scheduleIds = unpaidConsultations.map((item) => item.expertScheduleId);
  await prisma.$transaction(async (tx) => {
    await tx.consultation.updateMany({
      where: { id: { in: consultationIds } },
      data: {
        status: ConsultationStatus.CANCELLED,
        cancelledAt: /* @__PURE__ */ new Date(),
        cancelReason: "Automatically cancelled because payment was not completed in time."
      }
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
  await prisma.notification.createMany({
    data: unpaidConsultations.flatMap((consultation) => {
      const notifications = [];
      if (consultation.client.userId) {
        notifications.push({
          type: "CONSULTATION_CANCELLED",
          message: `Your consultation${consultation.expert?.fullName ? ` with ${consultation.expert.fullName}` : ""} was cancelled because payment was not completed in time.`,
          userId: consultation.client.userId
        });
      }
      if (consultation.expert?.userId) {
        notifications.push({
          type: "CONSULTATION_CANCELLED",
          message: "A scheduled consultation was automatically cancelled because the client did not complete payment in time.",
          userId: consultation.expert.userId
        });
      }
      return notifications;
    })
  });
  return { count: consultationIds.length };
};
var getAllConsultationsAdmin = async (query) => {
  const queryBuilder = new QueryBuilder(prisma.consultation, query, {
    searchableFields: bookingSearchableFields,
    filterableFields: bookingFilterableFields
  });
  const result = await queryBuilder.search().filter().include(bookingIncludeConfig).paginate().sort().fields().excute();
  return result;
};
var consultationService = {
  bookConsultation,
  bookConsultationWithPayLater,
  getMyBookings,
  initiateConsultationPayment,
  getSessionAccess,
  startSession,
  completeSession,
  cancelConsultation,
  rescheduleConsultation,
  updateConsultationStatus,
  cancelUnpaidConsultations,
  getAllConsultationsAdmin
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
var getSessionAccess2 = catchAsync(async (req, res) => {
  const { consultationId } = req.params;
  const result = await consultationService.getSessionAccess(
    consultationId,
    req.user
  );
  sendResponse(res, {
    httpStatusCode: status19.OK,
    success: true,
    message: "Session access details retrieved successfully",
    data: result
  });
});
var startSession2 = catchAsync(async (req, res) => {
  const { consultationId } = req.params;
  const result = await consultationService.startSession(
    consultationId,
    req.user
  );
  sendResponse(res, {
    httpStatusCode: status19.OK,
    success: true,
    message: "Session started successfully",
    data: result
  });
});
var completeSession2 = catchAsync(async (req, res) => {
  const { consultationId } = req.params;
  const result = await consultationService.completeSession(
    consultationId,
    req.user,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: status19.OK,
    success: true,
    message: "Session completed successfully",
    data: result
  });
});
var cancelConsultation2 = catchAsync(async (req, res) => {
  const { consultationId } = req.params;
  const result = await consultationService.cancelConsultation(
    consultationId,
    req.user,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: status19.OK,
    success: true,
    message: "Consultation cancelled successfully",
    data: result
  });
});
var rescheduleConsultation2 = catchAsync(async (req, res) => {
  const { consultationId } = req.params;
  const result = await consultationService.rescheduleConsultation(
    consultationId,
    req.user,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: status19.OK,
    success: true,
    message: "Consultation rescheduled successfully",
    data: result
  });
});
var updateConsultationStatus2 = catchAsync(async (req, res) => {
  const { consultationId } = req.params;
  const result = await consultationService.updateConsultationStatus(
    consultationId,
    req.user,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: status19.OK,
    success: true,
    message: "Consultation status updated successfully",
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
var getAllConsultationsAdmin2 = catchAsync(async (req, res) => {
  const result = await consultationService.getAllConsultationsAdmin(req.query);
  sendResponse(res, {
    httpStatusCode: status19.OK,
    success: true,
    message: "All consultations retrieved successfully",
    data: result
  });
});
var consultationController = {
  bookConsultation: bookConsultation2,
  bookConsultationWithPayLater: bookConsultationWithPayLater2,
  getMyBookings: getMyBookings2,
  initiateConsultationPayment: initiateConsultationPayment2,
  getSessionAccess: getSessionAccess2,
  startSession: startSession2,
  completeSession: completeSession2,
  cancelConsultation: cancelConsultation2,
  rescheduleConsultation: rescheduleConsultation2,
  updateConsultationStatus: updateConsultationStatus2,
  cancelUnpaidConsultations: cancelUnpaidConsultations2,
  getAllConsultationsAdmin: getAllConsultationsAdmin2
};

// src/modules/consultation/consultation.router.ts
var router8 = Router8();
router8.get(
  "/admin/bookings",
  checkAuth(Role.ADMIN),
  consultationController.getAllConsultationsAdmin
);
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
router8.get("/me", checkAuth(Role.CLIENT, Role.EXPERT), consultationController.getMyBookings);
router8.get(
  "/client/me",
  checkAuth(Role.CLIENT),
  consultationController.getMyBookings
);
router8.get(
  "/expert/me",
  checkAuth(Role.EXPERT),
  consultationController.getMyBookings
);
router8.get("/", checkAuth(Role.CLIENT, Role.EXPERT), consultationController.getMyBookings);
router8.post(
  "/:consultationId/initiate-payment",
  checkAuth(Role.CLIENT),
  validateRequest(initiateConsultationPaymentValidation),
  consultationController.initiateConsultationPayment
);
router8.get(
  "/:consultationId/session-access",
  checkAuth(Role.CLIENT, Role.EXPERT, Role.ADMIN),
  validateRequest(consultationSessionAccessValidation),
  consultationController.getSessionAccess
);
router8.patch(
  "/:consultationId/start",
  checkAuth(Role.CLIENT, Role.EXPERT, Role.ADMIN),
  validateRequest(startConsultationSessionValidation),
  consultationController.startSession
);
router8.patch(
  "/:consultationId/complete",
  checkAuth(Role.CLIENT, Role.EXPERT, Role.ADMIN),
  validateRequest(completeConsultationValidation),
  consultationController.completeSession
);
router8.patch(
  "/:consultationId/cancel",
  checkAuth(Role.CLIENT, Role.EXPERT, Role.ADMIN),
  validateRequest(cancelConsultationValidation),
  consultationController.cancelConsultation
);
router8.patch(
  "/reschedule/:consultationId",
  checkAuth(Role.CLIENT, Role.EXPERT, Role.ADMIN),
  validateRequest(rescheduleConsultationValidation),
  consultationController.rescheduleConsultation
);
router8.patch(
  "/:consultationId/status",
  checkAuth(Role.CLIENT, Role.EXPERT, Role.ADMIN),
  validateRequest(updateConsultationStatusValidation),
  consultationController.updateConsultationStatus
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
var industryBodySchema = z9.object({
  name: z9.string().trim().min(2, "Industry name is too short"),
  description: z9.string().trim().optional(),
  icon: z9.string().trim().url("Invalid icon URL").optional()
});
var industryIdParamsSchema = z9.object({
  id: z9.string().uuid("Invalid industry id")
});
var createIndustryValidation = z9.object({
  body: industryBodySchema
});
var updateIndustryValidation = z9.object({
  params: industryIdParamsSchema,
  body: industryBodySchema.partial()
});
var industryIdValidation = z9.object({
  params: industryIdParamsSchema
});

// src/modules/industry/industry.controler.ts
import status21 from "http-status";

// src/modules/industry/industry.service.ts
import status20 from "http-status";
var findActiveIndustryById = async (id) => {
  const industry = await prisma.industry.findFirst({
    where: { id, isDeleted: false }
  });
  if (!industry) {
    throw new AppError_default(status20.NOT_FOUND, "Industry not found");
  }
  return industry;
};
var ensureIndustryNameAvailable = async (name, excludeIndustryId) => {
  const existingIndustry = await prisma.industry.findUnique({
    where: { name }
  });
  if (existingIndustry && existingIndustry.id !== excludeIndustryId) {
    throw new AppError_default(status20.CONFLICT, "Industry already exists");
  }
};
var buildIndustryPayload = (payload) => {
  const data = {};
  if (payload.name !== void 0) {
    data.name = payload.name.trim();
  }
  if (payload.description !== void 0) {
    data.description = payload.description.trim();
  }
  if (payload.icon !== void 0) {
    data.icon = payload.icon.trim();
  }
  return data;
};
var createIndustry = async (payload) => {
  const data = buildIndustryPayload(payload);
  await ensureIndustryNameAvailable(data.name);
  const industry = await prisma.industry.create({
    data: {
      name: data.name,
      description: data.description,
      icon: data.icon
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
  const industry = await prisma.industry.findFirst({
    where: { id, isDeleted: false },
    include: { experts: true }
  });
  if (!industry) {
    throw new AppError_default(status20.NOT_FOUND, "Industry not found");
  }
  return industry;
};
var updateIndustry = async (id, data) => {
  const existingIndustry = await findActiveIndustryById(id);
  const updateData = buildIndustryPayload(data);
  if (Object.keys(updateData).length === 0) {
    throw new AppError_default(status20.BAD_REQUEST, "No valid industry fields provided for update");
  }
  if (updateData.name !== void 0 && updateData.name !== existingIndustry.name) {
    await ensureIndustryNameAvailable(updateData.name, id);
  }
  const updated = await prisma.industry.update({
    where: { id },
    data: updateData
  });
  return updated;
};
var deleteIndustry = async (id) => {
  await findActiveIndustryById(id);
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
  const { name, description, icon: iconUrl } = req.body;
  const icon = req.file?.path ?? iconUrl;
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
  const { name, description, icon: iconUrl } = req.body;
  const icon = req.file?.path ?? iconUrl;
  const payload = {
    ...name !== void 0 ? { name } : {},
    ...description !== void 0 ? { description } : {},
    ...icon !== void 0 ? { icon } : {}
  };
  const result = await industryService.updateIndustry(
    req.params.id,
    payload
  );
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
router9.post(
  "/",
  checkAuth(Role.ADMIN),
  multerUpload.single("file"),
  validateRequest(createIndustryValidation),
  industryController.createIndustry
);
router9.get("/", industryController.getAllIndustries);
router9.get("/:id", validateRequest(industryIdValidation), industryController.getIndustryById);
router9.delete(
  "/:id",
  checkAuth(Role.ADMIN),
  validateRequest(industryIdValidation),
  industryController.deleteIndustry
);
router9.put(
  "/:id",
  checkAuth(Role.ADMIN),
  multerUpload.single("file"),
  validateRequest(updateIndustryValidation),
  industryController.updateIndustry
);
var industryRouter = router9;

// src/modules/testimonial/testimonial.router.ts
import express from "express";

// src/modules/testimonial/testimonial.validation.ts
import { z as z10 } from "zod";
var createTestimonialSchema = z10.object({
  rating: z10.number().min(1).max(5),
  comment: z10.string().optional(),
  consultationId: z10.string().uuid()
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
  client: {
    include: {
      user: true
    }
  },
  expert: true,
  consultation: true
};

// src/modules/testimonial/testimonial.service.ts
var createTestimonial = async (userId, payload) => {
  const { rating, comment, consultationId } = payload;
  console.log("AUTH USER ID:", userId);
  console.log("PAYLOAD:", payload);
  const client = await prisma.client.findUnique({
    where: { userId }
  });
  if (!client) {
    throw new AppError_default(status22.NOT_FOUND, "Client not found");
  }
  console.log("CLIENT ID:", client.id);
  const consultation = await prisma.consultation.findUnique({
    where: { id: consultationId }
  });
  console.log("CONSULTATION CLIENT ID:", consultation?.clientId);
  if (!consultation) {
    throw new AppError_default(status22.NOT_FOUND, "Consultation not found");
  }
  if (consultation.clientId !== client.id) {
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
        clientId: client.id,
        // ✅ FIXED
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
  const effectiveQuery = { ...query };
  if (!includeAll) {
    effectiveQuery.status = ReviewStatus.APPROVED;
  }
  const qb = new QueryBuilder(prisma.testimonial, effectiveQuery, {
    searchableFields: testimonialSearchableFields,
    filterableFields: testimonialFilterableFields
  });
  const result = await qb.search().filter().paginate().dynamicInclude(testimonialIncludeConfig).sort().fields().excute();
  return result;
};
var getAllTestimonialsForAdmin = async (query, includeAll = true) => {
  return getAllTestimonials(query, includeAll);
};
var getTestimonialsByExpert = async (expertId) => {
  const expert = await prisma.expert.findUnique({
    where: { id: expertId }
  });
  if (!expert) {
    throw new AppError_default(status22.NOT_FOUND, "Expert not found");
  }
  const result = await prisma.testimonial.findMany({
    where: {
      expertId
    },
    include: testimonialIncludeConfig
  });
  return result;
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
var updateTestimonial = async (id, userId, payload) => {
  const client = await prisma.client.findUnique({
    where: { userId }
  });
  if (!client) {
    throw new AppError_default(status22.NOT_FOUND, "Client not found");
  }
  const testimonial = await prisma.testimonial.findUnique({
    where: { id }
  });
  if (!testimonial) {
    throw new AppError_default(status22.NOT_FOUND, "Testimonial not found");
  }
  if (testimonial.clientId !== client.id) {
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
var updateReviewStatus = async (id, payload) => {
  const testimonial = await prisma.testimonial.findUnique({
    where: { id }
  });
  if (!testimonial) {
    throw new AppError_default(status22.NOT_FOUND, "Testimonial not found");
  }
  return prisma.testimonial.update({
    where: { id },
    data: {
      status: payload.status
    },
    include: testimonialIncludeConfig
  });
};
var testimonialService = {
  createTestimonial,
  getAllTestimonials,
  getAllTestimonialsForAdmin,
  getTestimonialsByExpert,
  updateTestimonial,
  updateReviewStatus,
  replyToTestimonial
};

// src/modules/testimonial/testimonial.controler.ts
var createTestimonial2 = catchAsync(async (req, res) => {
  console.log("USER:", req.user);
  console.log("PAYLOAD:", req.body);
  const user = req.user;
  const payload = req.body;
  const testimonial = await testimonialService.createTestimonial(
    user.userId,
    payload
  );
  console.log("USER:", req.user);
  console.log("PAYLOAD:", req.body);
  console.log("PAYLOAD:", payload);
  console.log("USER:", user.userId);
  console.log("CONSULTATION:", payload.consultationId);
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
var getAllTestimonialsForAdmin2 = catchAsync(
  async (req, res) => {
    const query = req.query;
    const result = await testimonialService.getAllTestimonialsForAdmin(
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
  const result = await testimonialService.updateReviewStatus(id, req.body);
  sendResponse(res, {
    success: true,
    httpStatusCode: status23.OK,
    message: "Review status updated successfully",
    data: result
  });
});
var TestimonialController = {
  createTestimonial: createTestimonial2,
  getAllTestimonials: getAllTestimonials2,
  getAllTestimonialsForAdmin: getAllTestimonialsForAdmin2,
  getTestimonialsByExpert: getTestimonialsByExpert2,
  updateTestimonial: updateTestimonial2,
  replyToTestimonial: replyToTestimonial2,
  updateReviewStatus: updateReviewStatus2
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
  const formattedStatus = consultationStatusDistribution.map(({ status: status36, _count }) => ({
    status: status36,
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
  const formattedStatus = consultationStatusDistribution.map(({ status: status36, _count }) => ({
    status: status36,
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
  const formattedStatus = consultationStatusDistribution.map(({ status: status36, _count }) => ({
    status: status36,
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

// src/modules/payment/payment.controler.ts
import status27 from "http-status";

// src/modules/payment/payment.service.ts
import status26 from "http-status";
var findPaidCheckoutSessionByMetadata = async (payload) => {
  let startingAfter;
  for (let page = 0; page < 5; page += 1) {
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      ...startingAfter ? { starting_after: startingAfter } : {}
    });
    const match = sessions.data.find((session) => {
      return session.payment_status === "paid" && session.status === "complete" && session.metadata?.consultationId === payload.consultationId && session.metadata?.paymentId === payload.paymentId && session.metadata?.transactionId === payload.transactionId;
    });
    if (match) {
      return match;
    }
    if (!sessions.has_more || sessions.data.length === 0) {
      break;
    }
    startingAfter = sessions.data[sessions.data.length - 1]?.id;
  }
  return null;
};
var confirmConsultationPaymentSuccess = async (payload, user) => {
  if (!payload.consultationId || !payload.paymentId || !payload.transactionId) {
    throw new AppError_default(status26.BAD_REQUEST, "consultationId, paymentId and transactionId are required");
  }
  const consultation = await prisma.consultation.findUnique({
    where: { id: payload.consultationId },
    include: {
      payment: true,
      client: {
        select: {
          userId: true,
          fullName: true
        }
      },
      expert: {
        select: {
          userId: true,
          fullName: true
        }
      }
    }
  });
  if (!consultation || !consultation.payment) {
    throw new AppError_default(status26.NOT_FOUND, "Consultation payment not found");
  }
  if (user.role !== Role.ADMIN && consultation.client.userId !== user.userId) {
    throw new AppError_default(status26.FORBIDDEN, "You are not allowed to sync this payment");
  }
  if (consultation.payment.id !== payload.paymentId || consultation.payment.transactionId !== payload.transactionId) {
    throw new AppError_default(status26.BAD_REQUEST, "Provided payment identifiers do not match consultation records");
  }
  if (consultation.payment.status === PaymentStatus.PAID && consultation.paymentStatus === PaymentStatus.PAID) {
    return {
      consultationId: consultation.id,
      paymentId: consultation.payment.id,
      synced: true,
      alreadyPaid: true
    };
  }
  let paidSession = null;
  if (payload.sessionId) {
    const session = await stripe.checkout.sessions.retrieve(payload.sessionId);
    const metadataMatches = session.metadata?.consultationId === payload.consultationId && session.metadata?.paymentId === payload.paymentId && session.metadata?.transactionId === payload.transactionId;
    if (session.payment_status === "paid" && metadataMatches) {
      paidSession = session;
    }
  }
  if (!paidSession) {
    paidSession = await findPaidCheckoutSessionByMetadata(payload);
  }
  if (!paidSession) {
    throw new AppError_default(
      status26.BAD_REQUEST,
      "Stripe has not confirmed this payment yet. Please retry shortly."
    );
  }
  const updated = await prisma.$transaction(async (tx) => {
    const updatedConsultation = await tx.consultation.update({
      where: { id: consultation.id },
      data: {
        paymentStatus: PaymentStatus.PAID,
        status: consultation.status !== ConsultationStatus.CANCELLED && consultation.status !== ConsultationStatus.COMPLETED && consultation.status !== ConsultationStatus.ONGOING ? ConsultationStatus.CONFIRMED : consultation.status
      }
    });
    const updatedPayment = await tx.payment.update({
      where: { id: consultation.payment.id },
      data: {
        status: PaymentStatus.PAID,
        paymentGatewayData: paidSession
      }
    });
    await tx.notification.createMany({
      data: [
        {
          type: "CONSULTATION_CONFIRMED",
          message: `Your payment for the consultation with ${consultation.expert?.fullName ?? "your expert"} was successful. The session is now confirmed.`,
          userId: consultation.client.userId
        },
        {
          type: "CONSULTATION_CONFIRMED",
          message: `${consultation.client.fullName} completed payment. Your consultation is now confirmed.`,
          userId: consultation.expert?.userId ?? ""
        }
      ].filter((item) => Boolean(item.userId))
    });
    return { updatedConsultation, updatedPayment };
  });
  return {
    consultationId: updated.updatedConsultation.id,
    paymentId: updated.updatedPayment.id,
    synced: true,
    alreadyPaid: false
  };
};
var handleStripeWebhookEvent = async (event) => {
  const existingPayment = await prisma.payment.findFirst({
    where: { stripeEventId: event.id }
  });
  if (existingPayment) {
    console.log(`Event ${event.id} already processed. Skipping.`);
    return { message: `Event ${event.id} already processed. Skipping.` };
  }
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const consultationId = session.metadata?.consultationId;
      const paymentId = session.metadata?.paymentId;
      if (!consultationId || !paymentId) {
        console.error("Missing metadata in Stripe session");
        return { message: "Missing metadata" };
      }
      const consultation = await prisma.consultation.findUnique({
        where: { id: consultationId },
        include: {
          payment: true,
          client: {
            select: {
              userId: true,
              fullName: true
            }
          },
          expert: {
            select: {
              userId: true,
              fullName: true
            }
          }
        }
      });
      if (!consultation) {
        console.error(`Consultation ${consultationId} not found`);
        return { message: "Consultation not found" };
      }
      if (consultation.payment?.status === PaymentStatus.PAID && consultation.paymentStatus === PaymentStatus.PAID) {
        await prisma.payment.update({
          where: { id: paymentId },
          data: {
            paymentGatewayData: session,
            stripeEventId: event.id
          }
        });
        return {
          message: `Consultation ${consultationId} is already paid. Stripe event recorded.`
        };
      }
      const result = await prisma.$transaction(async (tx) => {
        const isPaid = session.payment_status === "paid";
        const updatedConsultation = await tx.consultation.update({
          where: { id: consultationId },
          data: {
            paymentStatus: isPaid ? PaymentStatus.PAID : PaymentStatus.UNPAID,
            status: isPaid && consultation.status !== ConsultationStatus.CANCELLED && consultation.status !== ConsultationStatus.COMPLETED && consultation.status !== ConsultationStatus.ONGOING ? ConsultationStatus.CONFIRMED : consultation.status
          }
        });
        const updatedPayment = await tx.payment.update({
          where: { id: paymentId },
          data: {
            status: isPaid ? PaymentStatus.PAID : PaymentStatus.UNPAID,
            paymentGatewayData: session,
            stripeEventId: event.id
          }
        });
        if (isPaid) {
          await tx.notification.createMany({
            data: [
              {
                type: "CONSULTATION_CONFIRMED",
                message: `Your payment for the consultation with ${consultation.expert?.fullName ?? "your expert"} was successful. The session is now confirmed.`,
                userId: consultation.client.userId
              },
              {
                type: "CONSULTATION_CONFIRMED",
                message: `${consultation.client.fullName} completed payment. Your consultation is now confirmed.`,
                userId: consultation.expert?.userId ?? ""
              }
            ].filter((item) => Boolean(item.userId))
          });
        }
        return { updatedConsultation, updatedPayment };
      });
      console.log(
        `Payment ${session.payment_status} for consultation ${consultationId}`
      );
      return result;
    }
    case "checkout.session.expired": {
      const session = event.data.object;
      console.log(`Checkout session ${session.id} expired.`);
      break;
    }
    case "payment_intent.payment_failed": {
      const session = event.data.object;
      console.log(`Payment intent ${session.id} failed.`);
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  return { message: `Webhook event ${event.id} processed successfully` };
};
var PaymentService = {
  handleStripeWebhookEvent,
  confirmConsultationPaymentSuccess
};

// src/modules/payment/payment.controler.ts
var handleStripeWebhookEvent2 = catchAsync(async (req, res) => {
  const signature = req.headers["stripe-signature"];
  const webhookSecret = envVars.STRIPE.STRIPE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) {
    console.error("Missing Stripe signature or webhook secret");
    return res.status(status27.BAD_REQUEST).json({ message: "Missing Stripe signature or webhook secret" });
  }
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (error) {
    console.error("Error verifying Stripe webhook:", error);
    return res.status(status27.BAD_REQUEST).json({ message: "Invalid Stripe webhook signature" });
  }
  try {
    const result = await PaymentService.handleStripeWebhookEvent(event);
    return sendResponse(res, {
      httpStatusCode: status27.OK,
      success: true,
      message: "Stripe webhook processed successfully",
      data: result
    });
  } catch (error) {
    console.error("Error handling Stripe webhook event:", error);
    return sendResponse(res, {
      httpStatusCode: status27.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Error handling Stripe webhook event"
    });
  }
});
var confirmConsultationPaymentSuccess2 = catchAsync(
  async (req, res) => {
    const source = req.method === "GET" ? req.query : req.body;
    const consultationId = String(source?.consultationId ?? "").trim();
    const paymentId = String(source?.paymentId ?? "").trim();
    const transactionId = String(source?.transactionId ?? "").trim();
    const sessionId = String(source?.sessionId ?? source?.session_id ?? "").trim();
    const result = await PaymentService.confirmConsultationPaymentSuccess(
      {
        consultationId,
        paymentId,
        transactionId,
        sessionId: sessionId || void 0
      },
      req.user
    );
    return sendResponse(res, {
      httpStatusCode: status27.OK,
      success: true,
      message: "Consultation payment synced successfully",
      data: result
    });
  }
);
var PaymentController = {
  handleStripeWebhookEvent: handleStripeWebhookEvent2,
  confirmConsultationPaymentSuccess: confirmConsultationPaymentSuccess2
};

// src/modules/payment/payment.router.ts
var router12 = Router10();
router12.post(
  "/consultation/confirm-success",
  checkAuth(Role.CLIENT, Role.ADMIN),
  PaymentController.confirmConsultationPaymentSuccess
);
router12.post(
  "/consultation/confirm",
  checkAuth(Role.CLIENT, Role.ADMIN),
  PaymentController.confirmConsultationPaymentSuccess
);
router12.get(
  "/consultation/confirm-success",
  checkAuth(Role.CLIENT, Role.ADMIN),
  PaymentController.confirmConsultationPaymentSuccess
);
router12.get(
  "/consultation/confirm",
  checkAuth(Role.CLIENT, Role.ADMIN),
  PaymentController.confirmConsultationPaymentSuccess
);
var PaymentRoutes = router12;

// src/modules/notification/notification.route.ts
import { Router as Router11 } from "express";

// src/modules/notification/notification.controler.ts
import status29 from "http-status";

// src/modules/notification/notification.service.ts
import status28 from "http-status";
var getNotificationById = async (id) => {
  const notification = await prisma.notification.findUnique({
    where: { id }
  });
  if (!notification) {
    throw new AppError_default(status28.NOT_FOUND, "Notification not found");
  }
  return notification;
};
var normalizeNotificationPayload = (payload) => ({
  type: payload.type.trim(),
  message: payload.message.trim(),
  userId: payload.userId,
  role: payload.role
});
var createNotification = async (payload) => {
  const { type, message, userId, role } = normalizeNotificationPayload(payload);
  if (!type || !message) {
    throw new AppError_default(status28.BAD_REQUEST, "Type and message are required");
  }
  if (userId && role || !userId && !role) {
    throw new AppError_default(status28.BAD_REQUEST, "Provide exactly one target: userId or role");
  }
  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    if (!user) {
      throw new AppError_default(status28.NOT_FOUND, "Target user not found");
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
      throw new AppError_default(status28.BAD_REQUEST, "Invalid role provided");
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
  throw new AppError_default(status28.BAD_REQUEST, "Either userId or role is required");
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
  const notification = await getNotificationById(id);
  if (user.role !== Role.ADMIN && notification.userId !== user.userId) {
    throw new AppError_default(status28.FORBIDDEN, "Forbidden access to this notification");
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
  const notification = await getNotificationById(id);
  if (user.role !== Role.ADMIN && notification.userId !== user.userId) {
    throw new AppError_default(status28.FORBIDDEN, "Forbidden access to this notification");
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
    httpStatusCode: status29.CREATED,
    success: true,
    message: "Notification created successfully",
    data: result
  });
});
var getAllNotifications2 = catchAsync(async (_req, res) => {
  const result = await notificationService.getAllNotifications();
  sendResponse(res, {
    httpStatusCode: status29.OK,
    success: true,
    message: "Notifications retrieved successfully",
    data: result
  });
});
var getMyNotifications2 = catchAsync(async (req, res) => {
  const result = await notificationService.getMyNotifications(req.user);
  sendResponse(res, {
    httpStatusCode: status29.OK,
    success: true,
    message: "My notifications retrieved successfully",
    data: result
  });
});
var getUnreadCount2 = catchAsync(async (req, res) => {
  const result = await notificationService.getUnreadCount(req.user);
  sendResponse(res, {
    httpStatusCode: status29.OK,
    success: true,
    message: "Unread notification count retrieved successfully",
    data: result
  });
});
var markAsRead2 = catchAsync(async (req, res) => {
  const result = await notificationService.markAsRead(String(req.params.id), req.user);
  sendResponse(res, {
    httpStatusCode: status29.OK,
    success: true,
    message: "Notification marked as read",
    data: result
  });
});
var markAllAsRead2 = catchAsync(async (req, res) => {
  const result = await notificationService.markAllAsRead(req.user);
  sendResponse(res, {
    httpStatusCode: status29.OK,
    success: true,
    message: "All notifications marked as read",
    data: result
  });
});
var deleteNotification2 = catchAsync(async (req, res) => {
  await notificationService.deleteNotification(String(req.params.id), req.user);
  sendResponse(res, {
    httpStatusCode: status29.OK,
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

// src/modules/notification/notification.validation.ts
import z11 from "zod";
var notificationIdParamsSchema = z11.object({
  id: z11.string().uuid("Invalid notification id")
});
var createNotificationValidation = z11.object({
  body: z11.object({
    type: z11.string().trim().min(1, "Type is required"),
    message: z11.string().trim().min(1, "Message is required"),
    userId: z11.string().uuid("Invalid user id").optional(),
    role: z11.nativeEnum(Role).optional()
  }).superRefine((value, ctx) => {
    if (value.userId && value.role || !value.userId && !value.role) {
      ctx.addIssue({
        code: z11.ZodIssueCode.custom,
        message: "Provide exactly one target: userId or role"
      });
    }
  })
});
var notificationIdValidation = z11.object({
  params: notificationIdParamsSchema
});

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
  validateRequest(notificationIdValidation),
  notificationController.markAsRead
);
router13.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.EXPERT, Role.CLIENT),
  validateRequest(notificationIdValidation),
  notificationController.deleteNotification
);
router13.post("/", checkAuth(Role.ADMIN), validateRequest(createNotificationValidation), notificationController.createNotification);
router13.get("/", checkAuth(Role.ADMIN), notificationController.getAllNotifications);
var notificationRouter = router13;

// src/modules/client/client.router.ts
import { Router as Router12 } from "express";

// src/modules/client/client.controler.ts
import status31 from "http-status";

// src/modules/client/client.service.ts
import status30 from "http-status";
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
    throw new AppError_default(status30.NOT_FOUND, "Client not found");
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
    throw new AppError_default(status30.NOT_FOUND, "Client profile not found");
  }
  return client;
};
var updateClient = async (id, payload, user) => {
  const existingClient = await prisma.client.findUnique({
    where: { id, isDeleted: false },
    include: { user: true }
  });
  if (!existingClient) {
    throw new AppError_default(status30.NOT_FOUND, "Client not found");
  }
  if (user.role !== Role.ADMIN && existingClient.userId !== user.userId) {
    throw new AppError_default(status30.FORBIDDEN, "Forbidden access to update this client");
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
        throw new AppError_default(status30.BAD_REQUEST, "User with same email already exists");
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
    throw new AppError_default(status30.NOT_FOUND, "Client not found");
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
    httpStatusCode: status31.OK,
    success: true,
    message: "Clients fetched successfully",
    data: result.data,
    meta: result.meta
  });
});
var getClientById2 = catchAsync(async (req, res) => {
  const result = await clientService.getClientById(String(req.params.id));
  sendResponse(res, {
    httpStatusCode: status31.OK,
    success: true,
    message: "Client retrieved successfully",
    data: result
  });
});
var getMyProfile2 = catchAsync(async (req, res) => {
  const result = await clientService.getMyProfile(req.user.userId);
  sendResponse(res, {
    httpStatusCode: status31.OK,
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
    httpStatusCode: status31.OK,
    success: true,
    message: "Client updated successfully",
    data: result
  });
});
var deleteClient2 = catchAsync(async (req, res) => {
  const result = await clientService.deleteClient(String(req.params.id));
  sendResponse(res, {
    httpStatusCode: status31.OK,
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
var reactionUserSelect = {
  id: true,
  name: true,
  email: true,
  image: true
};
var messageReactionInclude = {
  user: {
    select: reactionUserSelect
  }
};
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
    include: {
      attachment: true,
      reactions: {
        include: messageReactionInclude
      }
    }
  }
};
var messageInclude = {
  attachment: true,
  reactions: {
    include: messageReactionInclude
  }
};
var mapRoleToUserRole = (role) => {
  if (role === Role.CLIENT) return UserRole.CLIENT;
  if (role === Role.EXPERT) return UserRole.EXPERT;
  return UserRole.ADMIN;
};
var getCurrentClientByUserId = async (userId) => {
  const client = await prisma.client.findUnique({
    where: { userId },
    select: { id: true, userId: true, isDeleted: true }
  });
  if (!client || client.isDeleted) {
    throw new AppError_default(httpStatus2.NOT_FOUND, "Client profile not found");
  }
  return client;
};
var getCurrentExpertByUserId = async (userId) => {
  const expert = await prisma.expert.findUnique({
    where: { userId },
    select: { id: true, userId: true, isDeleted: true }
  });
  if (!expert || expert.isDeleted) {
    throw new AppError_default(httpStatus2.NOT_FOUND, "Expert profile not found");
  }
  return expert;
};
var upsertRoomForParticipants = async (clientId, expertId, consultationId) => {
  return prisma.chatRoom.upsert({
    where: {
      clientId_expertId: {
        clientId,
        expertId
      }
    },
    update: consultationId ? { consultationId } : {},
    create: {
      clientId,
      expertId,
      ...consultationId ? { consultationId } : {}
    },
    include: roomInclude
  });
};
var resolveRoomFromConsultation = async (roomIdentifier, userId, role) => {
  const consultation = await prisma.consultation.findFirst({
    where: {
      id: roomIdentifier,
      ...role === Role.CLIENT ? { client: { userId } } : {},
      ...role === Role.EXPERT ? { expert: { userId } } : {}
    },
    select: {
      id: true,
      clientId: true,
      expertId: true
    }
  });
  if (!consultation?.expertId) {
    return null;
  }
  return upsertRoomForParticipants(
    consultation.clientId,
    consultation.expertId,
    consultation.id
  );
};
var resolveRoomByIdentifier = async (roomIdentifier, userId, role) => {
  const consultationRoom = await resolveRoomFromConsultation(
    roomIdentifier,
    userId,
    role
  );
  if (consultationRoom) {
    return consultationRoom;
  }
  if (role === Role.ADMIN) {
    return null;
  }
  if (role === Role.CLIENT) {
    const client2 = await getCurrentClientByUserId(userId);
    const expert2 = await prisma.expert.findFirst({
      where: {
        isDeleted: false,
        OR: [{ id: roomIdentifier }, { userId: roomIdentifier }]
      },
      select: { id: true }
    });
    if (!expert2) {
      return null;
    }
    return upsertRoomForParticipants(client2.id, expert2.id);
  }
  const expert = await getCurrentExpertByUserId(userId);
  const client = await prisma.client.findFirst({
    where: {
      isDeleted: false,
      OR: [{ id: roomIdentifier }, { userId: roomIdentifier }]
    },
    select: { id: true }
  });
  if (!client) {
    return null;
  }
  return upsertRoomForParticipants(client.id, expert.id);
};
var getLatestRoomForUser = async (userId, role) => {
  if (role === Role.ADMIN) {
    return null;
  }
  if (role === Role.CLIENT) {
    const client = await getCurrentClientByUserId(userId);
    return prisma.chatRoom.findFirst({
      where: { clientId: client.id },
      include: roomInclude,
      orderBy: { updatedAt: "desc" }
    });
  }
  const expert = await getCurrentExpertByUserId(userId);
  return prisma.chatRoom.findFirst({
    where: { expertId: expert.id },
    include: roomInclude,
    orderBy: { updatedAt: "desc" }
  });
};
var getRoomWithParticipants = async (roomId, userId, role) => {
  let room = await prisma.chatRoom.findUnique({
    where: { id: roomId },
    include: roomInclude
  });
  if (!room) {
    room = await prisma.chatRoom.findFirst({
      where: { consultationId: roomId },
      include: roomInclude,
      orderBy: { updatedAt: "desc" }
    });
  }
  if (!room && userId && role) {
    room = await resolveRoomByIdentifier(roomId, userId, role);
  }
  if (!room && userId && role) {
    room = await getLatestRoomForUser(userId, role);
  }
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
var formatReactions = (reactions, currentUserId) => {
  const grouped = /* @__PURE__ */ new Map();
  for (const reaction of reactions) {
    const existing = grouped.get(reaction.emoji);
    if (existing) {
      existing.count += 1;
      existing.reactedByCurrentUser ||= reaction.userId === currentUserId;
      existing.users.push({
        userId: reaction.userId,
        name: reaction.user.name,
        email: reaction.user.email,
        image: reaction.user.image
      });
      continue;
    }
    grouped.set(reaction.emoji, {
      emoji: reaction.emoji,
      count: 1,
      reactedByCurrentUser: reaction.userId === currentUserId,
      users: [
        {
          userId: reaction.userId,
          name: reaction.user.name,
          email: reaction.user.email,
          image: reaction.user.image
        }
      ]
    });
  }
  return Array.from(grouped.values());
};
var formatMessage = (message, participants = [], currentUserId) => ({
  ...message,
  sender: participants.find(
    (participant) => participant.userId === message.senderId || participant.id === message.senderId
  ) ?? null,
  attachment: formatAttachment(message.attachment),
  reactions: formatReactions(message.reactions, currentUserId)
});
var formatRoom = async (room, currentUserId) => {
  const participants = await buildParticipants(room);
  const latestMessage = room.messages[0] ? formatMessage(room.messages[0], participants, currentUserId) : null;
  return {
    ...room,
    participants,
    lastMessage: latestMessage,
    unreadCount: 0
  };
};
var ensureRoomAccess = async (roomId, userId, role) => {
  const room = await getRoomWithParticipants(roomId, userId, role);
  if (role === Role.ADMIN) return room;
  const allowedUserId = role === Role.CLIENT ? room.client.userId : room.expert.userId;
  if (allowedUserId !== userId) {
    throw new AppError_default(httpStatus2.FORBIDDEN, "Forbidden access to this chat room");
  }
  return room;
};
var getRecipientUserIdForRoom = (room, senderRole) => senderRole === Role.CLIENT ? room.expert.userId : room.client.userId;
var getRoomRealtimeTargets = async (roomId, senderRole, userId) => {
  const room = await getRoomWithParticipants(roomId, userId, senderRole);
  return {
    roomId: room.id,
    clientUserId: room.client.userId,
    expertUserId: room.expert.userId,
    recipientUserId: senderRole ? getRecipientUserIdForRoom(room, senderRole) : null
  };
};
var getMessageForRoom = async (roomId, messageId) => {
  const message = await prisma.message.findFirst({
    where: { id: messageId, roomId },
    include: messageInclude
  });
  if (!message) {
    throw new AppError_default(httpStatus2.NOT_FOUND, "Message not found");
  }
  return message;
};
var notifyRecipient = async (roomId, senderId, senderRole, previewText, options) => {
  const room = await getRoomWithParticipants(roomId);
  const recipientUserId = getRecipientUserIdForRoom(room, senderRole);
  if (!recipientUserId || recipientUserId === senderId) {
    return;
  }
  const recipientPresence = await prisma.userPresence.findUnique({
    where: { userId: recipientUserId }
  });
  if (!options?.always && recipientPresence?.isOnline) {
    return;
  }
  await prisma.notification.create({
    data: {
      type: options?.type ?? "CHAT_MESSAGE",
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
    return Promise.all(rooms2.map((room) => formatRoom(room, userId)));
  }
  if (role === Role.CLIENT) {
    const client = await getCurrentClientByUserId(userId);
    const rooms2 = await prisma.chatRoom.findMany({
      where: { clientId: client.id, ...expertId ? { expertId } : {} },
      include: roomInclude,
      orderBy: { updatedAt: "desc" }
    });
    return Promise.all(rooms2.map((room) => formatRoom(room, userId)));
  }
  const expert = await getCurrentExpertByUserId(userId);
  const rooms = await prisma.chatRoom.findMany({
    where: { expertId: expert.id },
    include: roomInclude,
    orderBy: { updatedAt: "desc" }
  });
  return Promise.all(rooms.map((room) => formatRoom(room, userId)));
};
var createOrGetRoom = async (userId, role, participantIdentifier) => {
  if (!participantIdentifier) {
    throw new AppError_default(httpStatus2.BAD_REQUEST, "Participant identifier is required");
  }
  if (role === Role.ADMIN) {
    throw new AppError_default(httpStatus2.FORBIDDEN, "Admins cannot create chat rooms directly");
  }
  const room = await resolveRoomByIdentifier(participantIdentifier, userId, role);
  if (!room) {
    throw new AppError_default(
      httpStatus2.NOT_FOUND,
      role === Role.CLIENT ? "Expert not found" : "Client not found"
    );
  }
  return formatRoom(room, userId);
};
var getRoomMessages = async (roomId, userId, role) => {
  const room = await ensureRoomAccess(roomId, userId, role);
  const participants = await buildParticipants(room);
  const messages = await prisma.message.findMany({
    where: { roomId: room.id },
    include: messageInclude,
    orderBy: { createdAt: "asc" }
  });
  return {
    roomId: room.id,
    resolvedFromStaleId: room.id !== roomId,
    messages: messages.map((message) => formatMessage(message, participants, userId))
  };
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
  const room = await ensureRoomAccess(roomId, senderId, senderRole);
  const message = await prisma.message.create({
    data: {
      roomId: room.id,
      senderId,
      senderRole: mapRoleToUserRole(senderRole),
      type: MessageType.TEXT,
      text: text.trim()
    },
    include: messageInclude
  });
  await updateRoomTimestamp(room.id);
  await notifyRecipient(room.id, senderId, senderRole, "You have a new chat message.");
  const participants = await buildParticipants(room);
  return {
    roomId: room.id,
    resolvedFromStaleId: room.id !== roomId,
    message: formatMessage(message, participants, senderId)
  };
};
var createFileMessage = async (roomId, senderId, senderRole, attachmentData) => {
  const room = await ensureRoomAccess(roomId, senderId, senderRole);
  const message = await prisma.message.create({
    data: {
      roomId: room.id,
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
    include: messageInclude
  });
  await updateRoomTimestamp(room.id);
  await notifyRecipient(room.id, senderId, senderRole, "You received a file in chat.");
  const participants = await buildParticipants(room);
  return {
    roomId: room.id,
    resolvedFromStaleId: room.id !== roomId,
    message: formatMessage(message, participants, senderId)
  };
};
var toggleMessageReaction = async (roomId, messageId, userId, role, emoji) => {
  const normalizedEmoji = emoji.trim();
  if (!normalizedEmoji) {
    throw new AppError_default(httpStatus2.BAD_REQUEST, "Emoji is required");
  }
  if (normalizedEmoji.length > 32) {
    throw new AppError_default(httpStatus2.BAD_REQUEST, "Emoji is too long");
  }
  const room = await ensureRoomAccess(roomId, userId, role);
  const message = await getMessageForRoom(room.id, messageId);
  const existingReaction = await prisma.messageReaction.findUnique({
    where: {
      messageId_userId_emoji: {
        messageId: message.id,
        userId,
        emoji: normalizedEmoji
      }
    }
  });
  if (existingReaction) {
    await prisma.messageReaction.delete({
      where: { id: existingReaction.id }
    });
  } else {
    await prisma.messageReaction.create({
      data: {
        messageId: message.id,
        userId,
        emoji: normalizedEmoji
      }
    });
  }
  const updatedMessage = await getMessageForRoom(room.id, message.id);
  const participants = await buildParticipants(room);
  return {
    roomId: room.id,
    resolvedFromStaleId: room.id !== roomId,
    messageId: message.id,
    emoji: normalizedEmoji,
    action: existingReaction ? "removed" : "added",
    reactions: formatReactions(updatedMessage.reactions, userId),
    message: formatMessage(updatedMessage, participants, userId)
  };
};
var createCall = async (roomId, userId, role) => {
  const room = await ensureRoomAccess(roomId, userId, role);
  const call = await prisma.call.create({
    data: {
      roomId: room.id,
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
  await updateRoomTimestamp(room.id);
  await notifyRecipient(room.id, userId, role, "You have an incoming chat call.", {
    type: "CHAT_CALL",
    always: true
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
var deleteMessage = async (roomId, messageId, userId, role) => {
  await ensureRoomAccess(roomId, userId, role);
  const deleted = await prisma.message.delete({
    where: { id: messageId }
  });
  return deleted;
};
var chatService = {
  getUserRooms,
  createOrGetRoom,
  getRoomMessages,
  createTextMessage,
  createFileMessage,
  toggleMessageReaction,
  updateRoomTimestamp,
  createCall,
  endCall,
  updateCallStatus,
  getRoomRealtimeTargets,
  deleteMessage
};

// src/modules/chat/chat.upload.ts
import multer2 from "multer";
import { CloudinaryStorage as CloudinaryStorage2 } from "multer-storage-cloudinary";
var allowedMimeTypes = /* @__PURE__ */ new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]);
var storage2 = new CloudinaryStorage2({
  cloudinary: cloudinaryUpload,
  params: async (_req, file) => {
    const originalName = file.originalname;
    const extension = originalName.split(".").pop()?.toLowerCase();
    const fileNameWithoutExtension = originalName.split(".").slice(0, -1).join(".").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9/-]/g, "");
    const uniqueName = `${Math.random().toString(36).substring(2)}-${Date.now()}-${fileNameWithoutExtension}`;
    const folder = extension === "pdf" ? "pdfs" : "chat";
    return {
      folder: `consultedge/${folder}`,
      public_id: uniqueName,
      resource_type: "auto"
    };
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
var mapUploadedFileToAttachmentData = (file) => {
  const cloudinaryFile = file;
  const fileUrl = cloudinaryFile.path ?? cloudinaryFile.secure_url;
  if (!fileUrl) {
    throw new Error("Failed to resolve uploaded file URL from Cloudinary");
  }
  return {
    fileUrl,
    fileName: file.originalname,
    fileType: file.mimetype,
    fileSize: file.size
  };
};

// src/lib/ably.ts
import Ably from "ably";
var ablyClient = null;
var getAblyClient = () => {
  if (!envVars.ABLY_API_KEY) {
    return null;
  }
  if (!ablyClient) {
    ablyClient = new Ably.Rest({ key: envVars.ABLY_API_KEY });
  }
  return ablyClient;
};
var roomChannel = (roomId) => `private-room-${roomId}`;
var userChannel = (userId) => `private-user-${userId}`;
var publishToRoom = async (roomId, eventName, payload) => {
  const client = getAblyClient();
  if (!client) return;
  try {
    await client.channels.get(roomChannel(roomId)).publish(eventName, payload);
  } catch (error) {
    console.error("Ably publishToRoom failed:", error);
  }
};
var publishToUser = async (userId, eventName, payload) => {
  const client = getAblyClient();
  if (!client) return;
  try {
    await client.channels.get(userChannel(userId)).publish(eventName, payload);
  } catch (error) {
    console.error("Ably publishToUser failed:", error);
  }
};
var createAblyTokenRequest = async (clientId, capability) => {
  const client = getAblyClient();
  if (!client) {
    throw new Error("Ably is not configured. Set ABLY_API_KEY.");
  }
  return client.auth.createTokenRequest({
    clientId,
    ttl: 60 * 60 * 1e3
  });
};

// src/modules/chat/chat.controller.ts
var emitChatEvent = async (roomId, eventName, payload, senderRole, senderUserId) => {
  const targets = await chatService.getRoomRealtimeTargets(
    roomId,
    senderRole,
    senderUserId
  );
  await publishToRoom(targets.roomId, eventName, payload);
  if (senderRole && targets.recipientUserId) {
    await publishToUser(targets.recipientUserId, eventName, payload);
    return;
  }
  await publishToUser(targets.clientUserId, eventName, payload);
  await publishToUser(targets.expertUserId, eventName, payload);
};
var getSingleString = (value) => {
  if (Array.isArray(value)) {
    return typeof value[0] === "string" ? value[0] : "";
  }
  return typeof value === "string" ? value : "";
};
var getRooms = catchAsync(async (req, res) => {
  const expertId = getSingleString(req.query.expertId) || void 0;
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
  const participantIdentifier = getSingleString(
    req.body?.expertId ?? req.body?.participantId ?? req.body?.userId
  );
  const room = await chatService.createOrGetRoom(
    req.user.userId,
    req.user.role,
    participantIdentifier
  );
  sendResponse(res, {
    httpStatusCode: httpStatus3.OK,
    success: true,
    message: "Chat room fetched successfully",
    data: room
  });
});
var getRoomMessages2 = catchAsync(async (req, res) => {
  const roomId = getSingleString(req.params.roomId);
  if (!roomId) {
    throw new AppError_default(httpStatus3.BAD_REQUEST, "roomId is required");
  }
  const result = await chatService.getRoomMessages(
    roomId,
    req.user.userId,
    req.user.role
  );
  sendResponse(res, {
    httpStatusCode: httpStatus3.OK,
    success: true,
    message: "Room messages fetched successfully",
    data: result
  });
});
var postTextMessage = catchAsync(async (req, res) => {
  const roomId = getSingleString(req.params.roomId);
  const text = String(req.body?.text ?? "");
  if (!roomId) {
    throw new AppError_default(httpStatus3.BAD_REQUEST, "roomId is required");
  }
  const result = await chatService.createTextMessage(
    roomId,
    req.user.userId,
    req.user.role,
    text
  );
  await emitChatEvent(
    result.roomId,
    "receive_message",
    result.message,
    req.user.role,
    req.user.userId
  );
  sendResponse(res, {
    httpStatusCode: httpStatus3.CREATED,
    success: true,
    message: "Message sent successfully",
    data: result
  });
});
var postAttachmentMessage = catchAsync(async (req, res) => {
  const roomId = getSingleString(req.params.roomId);
  if (!roomId) {
    throw new AppError_default(httpStatus3.BAD_REQUEST, "roomId is required");
  }
  if (!req.file) {
    return sendResponse(res, {
      httpStatusCode: httpStatus3.BAD_REQUEST,
      success: false,
      message: "Attachment file is required",
      data: null
    });
  }
  const attachment = mapUploadedFileToAttachmentData(req.file);
  const result = await chatService.createFileMessage(
    roomId,
    req.user.userId,
    req.user.role,
    attachment
  );
  await emitChatEvent(
    result.roomId,
    "receive_message",
    result.message,
    req.user.role,
    req.user.userId
  );
  sendResponse(res, {
    httpStatusCode: httpStatus3.CREATED,
    success: true,
    message: "Attachment message sent successfully",
    data: result
  });
});
var toggleMessageReaction2 = catchAsync(async (req, res) => {
  const roomId = getSingleString(req.params.roomId);
  const messageId = getSingleString(req.params.messageId);
  const emoji = getSingleString(req.body?.emoji);
  if (!roomId || !messageId) {
    throw new AppError_default(httpStatus3.BAD_REQUEST, "roomId and messageId are required");
  }
  const result = await chatService.toggleMessageReaction(
    roomId,
    messageId,
    req.user.userId,
    req.user.role,
    emoji
  );
  await emitChatEvent(
    result.roomId,
    "message_reaction_updated",
    result,
    req.user.role,
    req.user.userId
  );
  sendResponse(res, {
    httpStatusCode: httpStatus3.OK,
    success: true,
    message: `Message reaction ${result.action} successfully`,
    data: result
  });
});
var createCall2 = catchAsync(async (req, res) => {
  const roomId = getSingleString(req.params.roomId);
  if (!roomId) {
    throw new AppError_default(httpStatus3.BAD_REQUEST, "roomId is required");
  }
  const call = await chatService.createCall(roomId, req.user.userId, req.user.role);
  await emitChatEvent(
    roomId,
    "call_started",
    call,
    req.user.role,
    req.user.userId
  );
  sendResponse(res, {
    httpStatusCode: httpStatus3.CREATED,
    success: true,
    message: "Call started successfully",
    data: call
  });
});
var updateCallStatus2 = catchAsync(async (req, res) => {
  const callId = getSingleString(req.params.callId);
  const statusValue = req.body?.status;
  if (!callId) {
    throw new AppError_default(httpStatus3.BAD_REQUEST, "callId is required");
  }
  if (!Object.values(CallStatus).includes(statusValue)) {
    return sendResponse(res, {
      httpStatusCode: httpStatus3.BAD_REQUEST,
      success: false,
      message: "Invalid call status",
      data: null
    });
  }
  const call = await chatService.updateCallStatus(callId, statusValue);
  await emitChatEvent(
    call.roomId,
    statusValue === CallStatus.ENDED ? "call_ended" : "call_updated",
    call
  );
  sendResponse(res, {
    httpStatusCode: httpStatus3.OK,
    success: true,
    message: "Call status updated successfully",
    data: call
  });
});
var deleteMessage2 = catchAsync(async (req, res) => {
  const roomId = getSingleString(req.params.roomId);
  const messageId = getSingleString(req.params.messageId);
  if (!roomId || !messageId) {
    throw new AppError_default(httpStatus3.BAD_REQUEST, "roomId and messageId are required");
  }
  await chatService.deleteMessage(roomId, messageId, req.user.userId, req.user.role);
  sendResponse(res, {
    httpStatusCode: httpStatus3.OK,
    success: true,
    message: "Message deleted successfully",
    data: { messageId }
  });
});
var chatController = {
  getRooms,
  createOrGetRoom: createOrGetRoom2,
  getRoomMessages: getRoomMessages2,
  postTextMessage,
  postAttachmentMessage,
  toggleMessageReaction: toggleMessageReaction2,
  createCall: createCall2,
  updateCallStatus: updateCallStatus2,
  deleteMessage: deleteMessage2
};

// src/modules/chat/chat.validation.ts
import z12 from "zod";
var toggleMessageReactionValidation = z12.object({
  params: z12.object({
    roomId: z12.string().min(1, "roomId is required"),
    messageId: z12.string().min(1, "messageId is required")
  }),
  body: z12.object({
    emoji: z12.string().trim().min(1, "Emoji is required").max(32, "Emoji is too long")
  })
});

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
  "/rooms/:roomId/messages/:messageId/reactions",
  checkAuth(Role.CLIENT, Role.EXPERT, Role.ADMIN),
  validateRequest(toggleMessageReactionValidation),
  chatController.toggleMessageReaction
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
router15.delete(
  "/rooms/:roomId/messages/:messageId",
  checkAuth(Role.CLIENT, Role.EXPERT, Role.ADMIN),
  chatController.deleteMessage
);
var chatRoutes = router15;

// src/modules/ai/ai.router.ts
import { Router as Router14 } from "express";

// src/modules/ai/ai.controller.ts
import httpStatus4 from "http-status";

// src/modules/ai/ai.service.ts
import status32 from "http-status";
var SYSTEM_PROMPT = `You are ConsultEdge AI Support for a consultation booking platform.
Your job is to help website visitors with expert discovery, consultation booking, schedules, payments, and account guidance.
Rules:
- Be concise, clear, and friendly.
- Prefer practical next steps.
- If the issue involves refunds, billing disputes, legal issues, or account security, recommend admin/human support.
- Do not invent pricing, policies, or expert availability.
- Keep responses short enough for a homepage support widget.`;
var bookingKeywords = ["book", "booking", "appointment", "consultation", "schedule", "slot"];
var paymentKeywords = ["pay", "payment", "checkout", "card", "refund", "invoice", "billing"];
var expertKeywords = ["expert", "mentor", "consultant", "specialist", "advisor"];
var technicalKeywords = ["bug", "error", "issue", "login", "otp", "password", "not working"];
var escalationKeywords = [
  "human",
  "admin",
  "agent",
  "refund",
  "charged twice",
  "billing issue",
  "legal",
  "complaint",
  "security",
  "hack",
  "urgent"
];
var includesAny = (text, keywords) => keywords.some((keyword) => text.includes(keyword));
var buildSuggestedActions = (message, context) => {
  const normalized = message.toLowerCase();
  if (context === "payment" || includesAny(normalized, paymentKeywords)) {
    return [
      "Check your payment or booking status in the dashboard",
      "Retry with a valid payment method if checkout failed",
      "Contact admin support for refund or billing review"
    ];
  }
  if (context === "expert" || includesAny(normalized, expertKeywords)) {
    return [
      "Browse verified experts by industry or skill",
      "Open an expert profile to review experience and availability",
      "Start a chat or book a consultation slot"
    ];
  }
  if (context === "technical" || includesAny(normalized, technicalKeywords)) {
    return [
      "Refresh the page and sign in again",
      "Make sure your browser allows cookies for authentication",
      "If the issue continues, contact admin support"
    ];
  }
  return [
    "Browse experts from the homepage",
    "Select a suitable slot and book a consultation",
    "Use dashboard chat for direct communication after booking"
  ];
};
var buildFallbackReply = (message, context) => {
  const normalized = message.toLowerCase();
  if (context === "payment" || includesAny(normalized, paymentKeywords)) {
    return "I can help with payment guidance. Please confirm whether your issue is checkout failure, booking not appearing, or a refund request. For billing disputes or refunds, admin support should review it directly.";
  }
  if (context === "expert" || includesAny(normalized, expertKeywords)) {
    return "You can explore verified experts, compare their profiles, and choose a matching consultation slot. If you want, ask me what kind of expert you need and I\u2019ll guide you.";
  }
  if (context === "technical" || includesAny(normalized, technicalKeywords)) {
    return "It looks like a technical or account issue. Try signing in again, refreshing the page, and checking your connection. If it still fails, please contact admin support for manual help.";
  }
  if (context === "booking" || includesAny(normalized, bookingKeywords)) {
    return "To book a consultation, choose an expert, review the available schedule, and confirm the booking from the platform. If a slot is missing, it may not be published or available yet.";
  }
  return "Hi \u2014 I can help with finding experts, booking consultations, schedules, payments, and general platform guidance. Tell me what you need, and I\u2019ll guide you step by step.";
};
var shouldEscalateToHuman = (message) => {
  const normalized = message.toLowerCase();
  return includesAny(normalized, escalationKeywords);
};
var buildMessages = (payload) => {
  const history = (payload.history ?? []).map((item) => ({
    role: item.role,
    content: item.content
  }));
  return [
    { role: "system", content: SYSTEM_PROMPT },
    ...history,
    {
      role: "user",
      content: payload.context ? `Context: ${payload.context}
User message: ${payload.message}` : payload.message
    }
  ];
};
var generateOpenAIReply = async (payload) => {
  if (!envVars.OPENAI_API_KEY) {
    return null;
  }
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${envVars.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: envVars.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.4,
      max_tokens: 300,
      messages: buildMessages(payload)
    })
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI request failed: ${response.status} ${errorText}`);
  }
  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || null;
};
var askSupport = async (payload) => {
  const message = payload.message?.trim();
  if (!message) {
    throw new AppError_default(status32.BAD_REQUEST, "Message is required");
  }
  const suggestedActions = buildSuggestedActions(message, payload.context);
  const escalatedToHuman = shouldEscalateToHuman(message);
  try {
    const aiReply = await generateOpenAIReply({ ...payload, message });
    const reply = aiReply || buildFallbackReply(message, payload.context);
    return {
      reply,
      suggestedActions,
      escalatedToHuman,
      provider: aiReply ? "openai" : "fallback",
      model: aiReply ? envVars.OPENAI_MODEL || "gpt-4o-mini" : "rule-based-support",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  } catch (error) {
    console.error("AI support error:", error);
    return {
      reply: buildFallbackReply(message, payload.context),
      suggestedActions,
      escalatedToHuman,
      provider: "fallback",
      model: "rule-based-support",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
};
var aiService = {
  askSupport
};

// src/modules/ai/ai.controller.ts
var askSupport2 = catchAsync(async (req, res) => {
  const result = await aiService.askSupport(req.body);
  sendResponse(res, {
    httpStatusCode: httpStatus4.OK,
    success: true,
    message: "AI support response generated successfully",
    data: result
  });
});
var aiController = {
  askSupport: askSupport2
};

// src/modules/ai/utils/aiProvider.ts
import status33 from "http-status";
var resolveProvider = () => {
  const explicit = envVars.AI_PROVIDER;
  if (explicit === "openai" && envVars.OPENAI_API_KEY) return "openai";
  if (explicit === "gemini" && envVars.GEMINI_API_KEY) return "gemini";
  if (envVars.OPENAI_API_KEY) return "openai";
  if (envVars.GEMINI_API_KEY) return "gemini";
  throw new AppError_default(
    status33.SERVICE_UNAVAILABLE,
    "No AI provider configured. Set AI_PROVIDER and the corresponding API key."
  );
};
var callOpenAI = async (opts) => {
  if (!envVars.OPENAI_API_KEY) {
    throw new AppError_default(status33.SERVICE_UNAVAILABLE, "OPENAI_API_KEY missing");
  }
  const model = envVars.OPENAI_MODEL || "gpt-4o-mini";
  const startedAt2 = Date.now();
  const body = {
    model,
    temperature: opts.temperature ?? 0.4,
    max_tokens: opts.maxTokens ?? 600,
    messages: opts.messages.map((m) => ({ role: m.role, content: m.content }))
  };
  if (opts.jsonMode) {
    body.response_format = { type: "json_object" };
  }
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${envVars.OPENAI_API_KEY}`
    },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    const errText = await response.text();
    throw new AppError_default(
      status33.BAD_GATEWAY,
      `OpenAI request failed: ${response.status} ${errText.slice(0, 300)}`
    );
  }
  const data = await response.json();
  const text = data.choices?.[0]?.message?.content?.trim() ?? "";
  return {
    text,
    model,
    provider: "openai",
    tokensUsed: data.usage?.total_tokens ?? 0,
    latencyMs: Date.now() - startedAt2,
    raw: data
  };
};
var callGemini = async (opts) => {
  if (!envVars.GEMINI_API_KEY) {
    throw new AppError_default(status33.SERVICE_UNAVAILABLE, "GEMINI_API_KEY missing");
  }
  const model = envVars.GEMINI_MODEL || "gemini-2.0-flash";
  const startedAt2 = Date.now();
  const systemMessages = opts.messages.filter((m) => m.role === "system");
  const turnMessages = opts.messages.filter((m) => m.role !== "system");
  const body = {
    contents: turnMessages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    })),
    generationConfig: {
      temperature: opts.temperature ?? 0.4,
      maxOutputTokens: opts.maxTokens ?? 600,
      ...opts.jsonMode ? { responseMimeType: "application/json" } : {}
    }
  };
  if (systemMessages.length > 0) {
    body.systemInstruction = {
      role: "system",
      parts: [{ text: systemMessages.map((m) => m.content).join("\n\n") }]
    };
  }
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent?key=${encodeURIComponent(envVars.GEMINI_API_KEY)}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    const errText = await response.text();
    throw new AppError_default(
      status33.BAD_GATEWAY,
      `Gemini request failed: ${response.status} ${errText.slice(0, 300)}`
    );
  }
  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("").trim() ?? "";
  return {
    text,
    model,
    provider: "gemini",
    tokensUsed: data.usageMetadata?.totalTokenCount ?? 0,
    latencyMs: Date.now() - startedAt2,
    raw: data
  };
};
var aiProvider = {
  /** Generate a chat completion using the configured provider, with one fallback. */
  async generate(opts) {
    const primary = resolveProvider();
    const hasOpenAI = !!envVars.OPENAI_API_KEY;
    const hasGemini = !!envVars.GEMINI_API_KEY;
    const fallback = primary === "gemini" && hasOpenAI ? "openai" : primary === "openai" && hasGemini ? "gemini" : null;
    try {
      return primary === "openai" ? await callOpenAI(opts) : await callGemini(opts);
    } catch (err) {
      if (!fallback) throw err;
      console.warn(
        `[ai] primary provider "${primary}" failed; retrying with "${fallback}"`,
        err instanceof Error ? err.message : err
      );
      return fallback === "openai" ? callOpenAI(opts) : callGemini(opts);
    }
  },
  /**
   * Generate and parse JSON output. Falls back to wrapping plain text if the
   * provider returns a non-JSON response.
   */
  async generateJSON(opts) {
    const result = await this.generate({ ...opts, jsonMode: true });
    let parsed = null;
    try {
      const cleaned = result.text.replace(/^```(?:json)?\s*/i, "").replace(/```$/i, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = null;
    }
    return { data: parsed, meta: result };
  },
  getActiveProvider: resolveProvider,
  /** Non-throwing introspection of which providers have keys configured. */
  getConfiguredProviders() {
    const list = [];
    if (envVars.OPENAI_API_KEY) list.push("openai");
    if (envVars.GEMINI_API_KEY) list.push("gemini");
    return list;
  },
  /** Lightweight reachability probe used by GET /ai/health. */
  async ping() {
    const configured = this.getConfiguredProviders();
    if (configured.length === 0) {
      return { provider: "none", status: "unconfigured", latencyMs: 0 };
    }
    const startedAt2 = Date.now();
    try {
      const result = await this.generate({
        messages: [
          { role: "system", content: "You are a health probe. Reply with the single word: ok." },
          { role: "user", content: "ping" }
        ],
        temperature: 0,
        maxTokens: 5
      });
      return {
        provider: result.provider,
        status: "ok",
        latencyMs: Date.now() - startedAt2,
        model: result.model
      };
    } catch (err) {
      return {
        provider: configured[0],
        status: "down",
        latencyMs: Date.now() - startedAt2,
        error: err instanceof Error ? err.message : "unknown error"
      };
    }
  }
};

// src/modules/ai/prompts/summaryPrompt.ts
var summaryPrompt = (input) => `
You are a professional consulting analyst at ConsultEdge.
Summarize the following text for a ${input.audience || "business"} audience.
Return JSON with this exact shape:
{
  "summary": string,        // 3-5 sentence executive summary
  "keyPoints": string[],    // 3-7 bullet points
  "actionItems": string[]   // 2-5 concrete next steps
}
Text:
"""${input.text}"""
`.trim();

// src/modules/ai/prompts/chatPrompt.ts
var CHAT_SYSTEM_PROMPT = `You are ConsultEdge AI Assistant.
You help users discover experts, plan consultations, and understand the platform.
Rules:
- Be concise, friendly, and practical.
- Never invent expert names, prices, or availability.
- For refunds, billing disputes, or account security, recommend admin/human support.
- Keep replies suitable for a chat widget (1-4 short paragraphs).`;
var buildChatMessages = (input) => {
  const history = (input.history ?? []).map((h) => ({ role: h.role, content: h.content }));
  return [
    { role: "system", content: CHAT_SYSTEM_PROMPT },
    ...history,
    {
      role: "user",
      content: input.context ? `Context: ${input.context}
User message: ${input.message}` : input.message
    }
  ];
};

// src/modules/ai/prompts/documentAnalysisPrompt.ts
var documentAnalysisPrompt = (input) => `
You are a senior consulting analyst.
Analyze the following document${input.objective ? ` with this objective: ${input.objective}` : ""}.

Document:
"""${input.text}"""

Return JSON with this exact shape:
{
  "summary": string,
  "topics": string[],
  "entities": { "people": string[], "organizations": string[], "locations": string[] },
  "risks": string[],
  "opportunities": string[],
  "recommendedExperts": string[]   // industry/expertise tags only, not names
}
Rules:
- Be factual; do not invent entities not present in the document.
- Each list has 0-7 items.
`.trim();

// src/modules/ai/utils/sanitize.ts
var CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
var INJECTION_PATTERNS = [
  /ignore (all|previous|above) (instructions|prompts)/gi,
  /you are now/gi,
  /system prompt:/gi
];
var sanitizeText = (input, maxLength = 8e3) => {
  if (typeof input !== "string") return "";
  let text = input.replace(CONTROL_CHARS, " ").replace(/\s+/g, " ").trim();
  for (const pattern of INJECTION_PATTERNS) {
    text = text.replace(pattern, "[filtered]");
  }
  if (text.length > maxLength) text = text.slice(0, maxLength);
  return text;
};
var sanitizeObject = (obj) => {
  const out = {};
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (typeof value === "string") {
      out[key] = sanitizeText(value);
    } else if (Array.isArray(value)) {
      out[key] = value.map(
        (v) => typeof v === "string" ? sanitizeText(v) : v && typeof v === "object" ? sanitizeObject(v) : v
      );
    } else if (value && typeof value === "object") {
      out[key] = sanitizeObject(value);
    } else {
      out[key] = value;
    }
  }
  return out;
};

// src/modules/ai/services/aiAdvanced.service.ts
var normalizeList = (items) => {
  if (!Array.isArray(items)) return [];
  return Array.from(
    new Set(
      items.map((item) => sanitizeText(item, 140).trim()).filter((item) => item.length > 0)
    )
  );
};
var normalizeTerm = (value) => value.trim().toLowerCase();
var getWeekStartUtc = () => {
  const now = /* @__PURE__ */ new Date();
  const day = now.getUTCDay();
  const diff = day === 0 ? 6 : day - 1;
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - diff));
};
var roundScore = (value) => Math.round(Math.max(0, Math.min(100, value)) * 100) / 100;
var buildEmptyStateFallback = (mode, context) => {
  const personalizedReason = context.exploredIndustries[0] ? `Why: Because you explored ${context.exploredIndustries[0]}` : context.viewedExperts[0] ? `Why: Because you viewed ${context.viewedExperts[0]}` : context.searchHistory[0] ? `Why: Because you searched "${context.searchHistory[0]}"` : context.clickedCategories[0] ? `Why: Because you clicked on ${context.clickedCategories[0]}` : "Why: Because you interacted with similar experts";
  return [
    {
      name: "ConsultEdge Growth Advisor",
      title: "Startup Growth Consultant",
      specialization: "Go-to-market and growth strategy",
      description: "Helps early-stage teams shape positioning, channel strategy, and execution plans.",
      experienceYears: 10,
      fee: 120,
      whyReason: mode === "cold-start" ? "Why: Popular among new users" : personalizedReason,
      rankingScore: 86
    },
    {
      name: "ConsultEdge Finance Mentor",
      title: "Finance and Fundraising Specialist",
      specialization: "Fundraising readiness and financial planning",
      description: "Supports founders with investor narratives, runway planning, and capital strategy.",
      experienceYears: 12,
      fee: 140,
      whyReason: mode === "cold-start" ? "Why: Verified specialist" : personalizedReason,
      rankingScore: 82
    },
    {
      name: "ConsultEdge Product Strategist",
      title: "Product and Customer Strategy Expert",
      specialization: "Product-market fit and retention",
      description: "Works with teams to improve customer journeys, retention, and product prioritization.",
      experienceYears: 9,
      fee: 110,
      whyReason: mode === "cold-start" ? "Why: Trending this week" : personalizedReason,
      rankingScore: 79
    }
  ];
};
var buildColdStartReason = (expert) => {
  if (expert.weeklyBookings >= 2) return "Why: Frequently booked by founders";
  if (expert.averageRating >= 4.5) return "Why: High success rate";
  if (expert.isVerified) return "Why: Verified specialist";
  if (expert.totalBookings >= 5) return "Why: Trending this week";
  return "Why: Popular among new users";
};
var buildPersonalizedReason = (expert, context) => {
  const normalizedIndustry = normalizeTerm(expert.industry);
  const explored = context.exploredIndustries.find(
    (industry) => normalizeTerm(industry) === normalizedIndustry
  );
  if (explored) return `Why: Because you explored ${explored}`;
  const viewed = context.viewedExperts.find((item) => {
    const token = normalizeTerm(item);
    return token === normalizeTerm(expert.id) || token === normalizeTerm(expert.name);
  });
  if (viewed) return `Why: Because you viewed ${viewed}`;
  const haystack = `${expert.title} ${expert.description} ${expert.industry}`.toLowerCase();
  const searchedKeyword = context.searchHistory.find(
    (keyword) => haystack.includes(normalizeTerm(keyword))
  );
  if (searchedKeyword) return `Why: Because you searched "${searchedKeyword}"`;
  const clickedCategory = context.clickedCategories.find(
    (category) => haystack.includes(normalizeTerm(category))
  );
  if (clickedCategory) return `Why: Because you clicked on ${clickedCategory}`;
  if (context.viewedIndustrySet.has(normalizedIndustry)) {
    return "Why: Because you interacted with similar experts";
  }
  return "Why: Because you interacted with similar experts";
};
var fetchExpertCandidates = async () => {
  const weekStart = getWeekStartUtc();
  const [experts, ratings, weeklyBookings, totalBookings] = await Promise.all([
    prisma.expert.findMany({
      where: { isDeleted: false },
      select: {
        id: true,
        fullName: true,
        title: true,
        bio: true,
        experience: true,
        consultationFee: true,
        isVerified: true,
        industry: { select: { name: true } }
      },
      orderBy: [{ isVerified: "desc" }, { updatedAt: "desc" }],
      take: 120
    }),
    prisma.testimonial.groupBy({
      by: ["expertId"],
      where: { status: ReviewStatus.APPROVED },
      _avg: { rating: true },
      _count: { _all: true }
    }),
    prisma.consultation.groupBy({
      by: ["expertId"],
      where: {
        expertId: { not: null },
        createdAt: { gte: weekStart }
      },
      _count: { _all: true }
    }),
    prisma.consultation.groupBy({
      by: ["expertId"],
      where: { expertId: { not: null } },
      _count: { _all: true }
    })
  ]);
  const ratingMap = new Map(
    ratings.map((item) => [
      item.expertId,
      {
        avg: item._avg.rating ?? 0,
        count: item._count._all
      }
    ])
  );
  const weeklyBookingMap = new Map(
    weeklyBookings.filter((item) => !!item.expertId).map((item) => [item.expertId, item._count._all])
  );
  const totalBookingMap = new Map(
    totalBookings.filter((item) => !!item.expertId).map((item) => [item.expertId, item._count._all])
  );
  return experts.map((expert) => {
    const ratingStats = ratingMap.get(expert.id);
    return {
      id: expert.id,
      name: expert.fullName,
      title: expert.title?.trim() || "Business Consultant",
      industry: expert.industry.name,
      description: expert.bio?.trim() || `${expert.fullName} advises teams on ${expert.industry.name.toLowerCase()} priorities.`,
      experienceYears: Math.max(0, expert.experience ?? 0),
      fee: Math.max(0, expert.consultationFee ?? 0),
      isVerified: expert.isVerified,
      averageRating: ratingStats?.avg ?? 0,
      reviewCount: ratingStats?.count ?? 0,
      weeklyBookings: weeklyBookingMap.get(expert.id) ?? 0,
      totalBookings: totalBookingMap.get(expert.id) ?? 0
    };
  });
};
var recommendations = async (input) => {
  try {
    const viewedExperts = normalizeList(input.viewedExperts);
    const exploredIndustries = normalizeList(input.exploredIndustries);
    const searchHistory = normalizeList(input.searchHistory);
    const clickedCategories = normalizeList(input.clickedCategories);
    const activityCount = viewedExperts.length + exploredIndustries.length + searchHistory.length + clickedCategories.length;
    const mode = activityCount === 0 ? "cold-start" : "personalized";
    const candidates = await fetchExpertCandidates();
    if (candidates.length === 0) {
      return {
        data: {
          mode,
          activityCount,
          experts: buildEmptyStateFallback(mode, {
            exploredIndustries,
            viewedExperts,
            searchHistory,
            clickedCategories
          })
        },
        meta: {
          model: "heuristic",
          provider: "fallback",
          tokensUsed: 0,
          latencyMs: 0
        }
      };
    }
    const viewedTokenSet = new Set(viewedExperts.map(normalizeTerm));
    const exploredIndustrySet = new Set(exploredIndustries.map(normalizeTerm));
    const searchTokens = new Set(
      searchHistory.flatMap((query) => query.split(/\s+/)).map(normalizeTerm).filter((token) => token.length > 1)
    );
    const clickedCategorySet = new Set(clickedCategories.map(normalizeTerm));
    const viewedMatches = candidates.filter((candidate) => {
      const byId = viewedTokenSet.has(normalizeTerm(candidate.id));
      const byName = viewedTokenSet.has(normalizeTerm(candidate.name));
      return byId || byName;
    });
    const viewedIndustrySet = new Set(viewedMatches.map((item) => normalizeTerm(item.industry)));
    const scored = candidates.map((candidate) => {
      let score = 35;
      if (candidate.isVerified) score += 10;
      if (candidate.averageRating >= 4.7) score += 8;
      else if (candidate.averageRating >= 4.3) score += 5;
      if (candidate.weeklyBookings >= 4) score += 12;
      else if (candidate.weeklyBookings >= 2) score += 8;
      else if (candidate.weeklyBookings >= 1) score += 4;
      score += Math.min(10, candidate.totalBookings * 0.6);
      if (mode === "personalized") {
        const candidateIndustry = normalizeTerm(candidate.industry);
        const haystack = `${candidate.name} ${candidate.title} ${candidate.description} ${candidate.industry}`.toLowerCase();
        const sameIndustry = exploredIndustrySet.has(candidateIndustry);
        if (sameIndustry) score += 24;
        const viewedThisExpert = viewedTokenSet.has(normalizeTerm(candidate.id)) || viewedTokenSet.has(normalizeTerm(candidate.name));
        if (viewedThisExpert) score += 18;
        else if (viewedIndustrySet.has(candidateIndustry)) score += 14;
        const matchedSearch = Array.from(searchTokens).some(
          (token) => token.length > 1 && haystack.includes(token)
        );
        if (matchedSearch) score += 14;
        const matchedCategory = Array.from(clickedCategorySet).some(
          (category) => category.length > 1 && haystack.includes(category)
        );
        if (matchedCategory) score += 12;
      }
      const whyReason = mode === "cold-start" ? buildColdStartReason(candidate) : buildPersonalizedReason(candidate, {
        exploredIndustries,
        viewedExperts,
        searchHistory,
        clickedCategories,
        viewedIndustrySet
      });
      return {
        name: candidate.name,
        title: candidate.title,
        specialization: candidate.industry,
        description: candidate.description,
        experienceYears: candidate.experienceYears,
        fee: candidate.fee,
        whyReason,
        rankingScore: roundScore(score)
      };
    }).sort((a, b) => b.rankingScore - a.rankingScore).slice(0, 8);
    return {
      data: {
        mode,
        activityCount,
        experts: scored.length > 0 ? scored : buildEmptyStateFallback(mode, {
          exploredIndustries,
          viewedExperts,
          searchHistory,
          clickedCategories
        })
      },
      meta: {
        model: "heuristic",
        provider: "fallback",
        tokensUsed: 0,
        latencyMs: 0
      }
    };
  } catch {
    const viewedExperts = normalizeList(input.viewedExperts);
    const exploredIndustries = normalizeList(input.exploredIndustries);
    const searchHistory = normalizeList(input.searchHistory);
    const clickedCategories = normalizeList(input.clickedCategories);
    const activityCount = viewedExperts.length + exploredIndustries.length + searchHistory.length + clickedCategories.length;
    const mode = activityCount === 0 ? "cold-start" : "personalized";
    return {
      data: {
        mode,
        activityCount,
        experts: buildEmptyStateFallback(mode, {
          exploredIndustries,
          viewedExperts,
          searchHistory,
          clickedCategories
        })
      },
      meta: { model: "heuristic", provider: "fallback", tokensUsed: 0, latencyMs: 0 }
    };
  }
};
var ensureIndustryArray = (value) => {
  if (!Array.isArray(value)) return [];
  return value.map((item) => sanitizeText(item, 80)).map((item) => item.trim()).filter((item) => item.length > 0).slice(0, 8);
};
var ensureTaglineLength = (value) => {
  const cleaned = sanitizeText(value, 120);
  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length >= 5 && words.length <= 7) return words.join(" ");
  return words.slice(0, 7).join(" ") || "Optimize every customer moment better";
};
var buildIndustryFallback = (industryName) => ({
  industryName,
  industryDescription: `${industryName} focuses on designing, measuring, and continuously improving the end-to-end customer journey across channels. It blends service operations, experience strategy, and performance analytics to raise satisfaction, loyalty, and growth.`,
  idealExpertTypes: [
    "Customer experience strategists",
    "Service design and operations consultants",
    "Contact center transformation leaders",
    "Customer success and retention specialists"
  ],
  commonUseCases: [
    "Improve customer satisfaction and retention",
    "Redesign support workflows and SLAs",
    "Scale omnichannel service operations",
    "Reduce churn through journey optimization"
  ],
  shortTagline: "Elevate service quality at scale"
});
var industryCreation = async (input) => {
  const industryName = sanitizeText(input.industryName, 100).trim() || "General Industry";
  try {
    const { data, meta } = await aiProvider.generateJSON({
      messages: [
        {
          role: "system",
          content: "You are the ConsultEdge admin industry content generator. Return strict JSON only."
        },
        {
          role: "user",
          content: [
            "Generate a premium SaaS-grade industry profile.",
            "Output JSON shape:",
            '{ "industryName": string, "industryDescription": string, "idealExpertTypes": string[], "commonUseCases": string[], "shortTagline": string }',
            "Rules:",
            "- industryDescription must be 2-3 concise lines.",
            "- idealExpertTypes and commonUseCases must never be empty.",
            "- shortTagline must be 5-7 words.",
            `Industry name: ${industryName}`
          ].join("\n")
        }
      ],
      temperature: 0.4,
      maxTokens: 550
    });
    if (!data) {
      return {
        data: buildIndustryFallback(industryName),
        meta: {
          model: meta.model,
          provider: meta.provider,
          tokensUsed: meta.tokensUsed,
          latencyMs: meta.latencyMs
        }
      };
    }
    const safe = {
      industryName: sanitizeText(data.industryName, 100).trim() || industryName,
      industryDescription: sanitizeText(data.industryDescription, 500).trim() || buildIndustryFallback(industryName).industryDescription,
      idealExpertTypes: ensureIndustryArray(data.idealExpertTypes),
      commonUseCases: ensureIndustryArray(data.commonUseCases),
      shortTagline: ensureTaglineLength(data.shortTagline || "")
    };
    if (safe.idealExpertTypes.length === 0 || safe.commonUseCases.length === 0) {
      const fallback = buildIndustryFallback(industryName);
      safe.idealExpertTypes = fallback.idealExpertTypes;
      safe.commonUseCases = fallback.commonUseCases;
    }
    return {
      data: safe,
      meta: {
        model: meta.model,
        provider: meta.provider,
        tokensUsed: meta.tokensUsed,
        latencyMs: meta.latencyMs
      }
    };
  } catch {
    return {
      data: buildIndustryFallback(industryName),
      meta: {
        model: "heuristic",
        provider: "fallback",
        tokensUsed: 0,
        latencyMs: 0
      }
    };
  }
};
var tokenize = (text) => sanitizeText(text, 500).toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length > 1);
var uniqueStrings = (items, max = 100) => Array.from(new Set(items.map((item) => sanitizeText(item, 160).trim()).filter(Boolean))).slice(0, max);
var clamp01 = (value) => Math.max(0, Math.min(1, value));
var countTokenMatches = (tokens, haystack) => tokens.reduce((sum, token) => haystack.includes(token) ? sum + 1 : sum, 0);
var mapPopularityBoost = (popularity) => Math.min(0.2, popularity * 0.02);
var buildRecentSearches = (query, history) => {
  const cleanedQuery = sanitizeText(query, 200).trim();
  const deduped = [cleanedQuery, ...history.filter((item) => item.toLowerCase() !== cleanedQuery.toLowerCase())];
  return uniqueStrings(deduped, 5);
};
var snippet = (text, max = 160) => {
  const clean = sanitizeText(text, 1e3).trim();
  return clean.length <= max ? clean : `${clean.slice(0, max - 3)}...`;
};
var normalizeActivity = (activity) => ({
  viewedExperts: uniqueStrings(activity?.viewedExperts ?? [], 100),
  exploredIndustries: uniqueStrings(activity?.exploredIndustries ?? [], 100),
  searchHistory: uniqueStrings(activity?.searchHistory ?? [], 100),
  clickedCategories: uniqueStrings(activity?.clickedCategories ?? [], 100)
});
var aggregateFrequency = (items) => {
  const map = /* @__PURE__ */ new Map();
  for (const item of items) {
    const key = item.toLowerCase();
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return map;
};
var fetchUniversalSearchData = async (input) => {
  const [bookingCounts, dbExperts, dbIndustries, dbTestimonials] = await Promise.all([
    prisma.consultation.groupBy({
      by: ["expertId"],
      where: { expertId: { not: null } },
      _count: { _all: true }
    }),
    prisma.expert.findMany({
      where: { isDeleted: false },
      select: {
        id: true,
        fullName: true,
        title: true,
        bio: true,
        industry: { select: { name: true } }
      },
      take: 300
    }),
    prisma.industry.findMany({
      where: { isDeleted: false },
      select: { id: true, name: true, description: true },
      take: 300
    }),
    prisma.testimonial.findMany({
      where: { status: ReviewStatus.APPROVED, comment: { not: null } },
      select: {
        id: true,
        comment: true,
        expert: { select: { fullName: true } }
      },
      orderBy: { createdAt: "desc" },
      take: 500
    })
  ]);
  const bookingMap = new Map(
    bookingCounts.filter((item) => !!item.expertId).map((item) => [item.expertId, item._count._all])
  );
  const sourceExperts = [
    ...dbExperts.map((expert) => ({
      id: expert.id,
      name: expert.fullName,
      title: expert.title?.trim() || "Consulting Expert",
      specialization: expert.industry.name,
      industry: expert.industry.name,
      tags: uniqueStrings([expert.title ?? "", expert.industry.name]),
      description: expert.bio?.trim() || `${expert.fullName} advises teams in ${expert.industry.name.toLowerCase()}.`,
      popularity: bookingMap.get(expert.id) ?? 0
    })),
    ...(input.db?.experts ?? []).map((expert) => ({
      id: sanitizeText(expert.id, 80).trim(),
      name: sanitizeText(expert.name, 200).trim(),
      title: sanitizeText(expert.title ?? "Consulting Expert", 120).trim() || "Consulting Expert",
      specialization: sanitizeText(expert.specialization ?? expert.industry ?? "General Consulting", 120).trim() || "General Consulting",
      industry: sanitizeText(expert.industry ?? "General", 120).trim() || "General",
      tags: uniqueStrings([...expert.tags ?? [], ...expert.expertise ?? []], 12),
      description: sanitizeText(expert.description ?? expert.bio ?? "", 600).trim(),
      popularity: 0
    })) ?? []
  ].filter((expert) => expert.id && expert.name);
  const sourceIndustries = [
    ...dbIndustries.map((industry) => ({
      id: industry.id,
      industryName: industry.name,
      description: industry.description?.trim() || `${industry.name} consulting and strategic advisory.`,
      keywords: uniqueStrings([industry.name, ...industry.description ? tokenize(industry.description).slice(0, 8) : []])
    })),
    ...(input.db?.industries ?? []).map((industry) => ({
      id: sanitizeText(industry.id ?? industry.name ?? industry.industryName ?? "", 80).trim(),
      industryName: sanitizeText(industry.industryName ?? industry.name ?? "", 120).trim() || "General",
      description: sanitizeText(industry.description ?? "", 600).trim(),
      keywords: uniqueStrings(industry.keywords ?? [], 20)
    })) ?? []
  ].filter((industry) => industry.id && industry.industryName);
  const sourceTestimonials = [
    ...dbTestimonials.map((testimonial) => ({
      id: testimonial.id,
      expertName: testimonial.expert.fullName,
      content: testimonial.comment?.trim() ?? "",
      popularity: 1
    })),
    ...(input.db?.testimonials ?? []).map((testimonial) => ({
      id: sanitizeText(testimonial.id ?? "", 80).trim(),
      expertName: sanitizeText(testimonial.expertName ?? "", 200).trim(),
      content: sanitizeText(testimonial.content ?? testimonial.comment ?? "", 1200).trim(),
      popularity: 0
    })) ?? []
  ].filter((testimonial) => testimonial.id && testimonial.expertName && testimonial.content);
  return {
    experts: sourceExperts,
    industries: sourceIndustries,
    testimonials: sourceTestimonials,
    bookingMap
  };
};
var generateAISuggestions = (input) => {
  const intent = sanitizeText(input.query, 120).trim();
  const pool = uniqueStrings(
    [
      `${intent} strategy for founders`,
      input.topIndustries[0] ? `${intent} in ${input.topIndustries[0]}` : "",
      input.topExpertSkills[0] ? `${intent} with ${input.topExpertSkills[0]} experts` : "",
      input.trendingTitles[0] ? `${input.trendingTitles[0]} playbook` : "",
      input.topIndustries[1] ? `${intent} roadmap for ${input.topIndustries[1]}` : "",
      input.topExpertSkills[1] ? `How to execute ${intent} with ${input.topExpertSkills[1]}` : ""
    ],
    5
  );
  return pool.slice(0, 5);
};
var search = async (input) => {
  try {
    const query = sanitizeText(input.query, 500).trim();
    const queryTokens = tokenize(query);
    const activity = normalizeActivity(input.userActivity);
    const viewedFreq = aggregateFrequency(activity.viewedExperts);
    const exploredIndustryFreq = aggregateFrequency(activity.exploredIndustries);
    const clickedCategoryFreq = aggregateFrequency(activity.clickedCategories);
    const sources = await fetchUniversalSearchData(input);
    const experts = sources.experts.map((expert) => {
      const haystack = [
        expert.name,
        expert.title,
        expert.specialization,
        expert.industry,
        expert.tags.join(" "),
        expert.description
      ].join(" ").toLowerCase();
      const textScore = queryTokens.length === 0 ? 0 : countTokenMatches(queryTokens, haystack) / queryTokens.length;
      const viewedBoost = (viewedFreq.get(expert.name.toLowerCase()) ?? 0) > 0 || (viewedFreq.get(expert.id.toLowerCase()) ?? 0) > 0 ? 0.12 : 0;
      const industryBoost = (exploredIndustryFreq.get(expert.industry.toLowerCase()) ?? 0) > 0 ? 0.1 : 0;
      const categoryBoost = (clickedCategoryFreq.get(expert.specialization.toLowerCase()) ?? 0) > 0 ? 0.08 : 0;
      const popularityBoost = mapPopularityBoost(expert.popularity);
      const finalScore = clamp01(textScore * 0.65 + viewedBoost + industryBoost + categoryBoost + popularityBoost);
      return {
        type: "expert",
        id: expert.id,
        name: expert.name,
        title: expert.title,
        specialization: expert.specialization,
        industry: expert.industry,
        matchScore: Math.round(finalScore * 1e3) / 1e3
      };
    }).filter((item) => item.matchScore > 0).sort((a, b) => b.matchScore - a.matchScore).slice(0, 12);
    const industries = sources.industries.map((industry) => {
      const haystack = `${industry.industryName} ${industry.description} ${industry.keywords.join(" ")}`.toLowerCase();
      const textScore = queryTokens.length === 0 ? 0 : countTokenMatches(queryTokens, haystack) / queryTokens.length;
      const activityBoost = (exploredIndustryFreq.get(industry.industryName.toLowerCase()) ?? 0) > 0 ? 0.15 : 0;
      const finalScore = clamp01(textScore * 0.8 + activityBoost);
      return {
        type: "industry",
        id: industry.id,
        industryName: industry.industryName,
        description: snippet(industry.description, 180),
        matchScore: Math.round(finalScore * 1e3) / 1e3
      };
    }).filter((item) => item.matchScore > 0).sort((a, b) => b.matchScore - a.matchScore).slice(0, 8);
    const testimonials = sources.testimonials.map((testimonial) => {
      const haystack = `${testimonial.expertName} ${testimonial.content}`.toLowerCase();
      const textScore = queryTokens.length === 0 ? 0 : countTokenMatches(queryTokens, haystack) / queryTokens.length;
      const finalScore = clamp01(textScore * 0.9 + mapPopularityBoost(testimonial.popularity));
      return {
        type: "testimonial",
        id: testimonial.id,
        expertName: testimonial.expertName,
        contentSnippet: snippet(testimonial.content),
        matchScore: Math.round(finalScore * 1e3) / 1e3
      };
    }).filter((item) => item.matchScore > 0).sort((a, b) => b.matchScore - a.matchScore).slice(0, 8);
    const mostBookedExperts = sources.experts.map((expert) => ({
      title: expert.name,
      category: "most-booked-experts",
      reason: `Booked ${expert.popularity} consultations`,
      score: expert.popularity
    })).filter((item) => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 3);
    const mostSearched = Array.from(aggregateFrequency(activity.searchHistory).entries()).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([title, count]) => ({
      title,
      category: "most-searched-queries",
      reason: `Searched ${count} time${count > 1 ? "s" : ""}`,
      score: count
    }));
    const mostViewed = Array.from(viewedFreq.entries()).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([title, count]) => ({
      title,
      category: "most-viewed-experts",
      reason: `Viewed ${count} time${count > 1 ? "s" : ""}`,
      score: count
    }));
    const mostExploredIndustries = Array.from(exploredIndustryFreq.entries()).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([title, count]) => ({
      title,
      category: "most-explored-industries",
      reason: `Explored ${count} time${count > 1 ? "s" : ""}`,
      score: count
    }));
    const incomingTrending = (input.db?.trending ?? []).map((item) => ({
      title: sanitizeText(item.title ?? "", 120).trim(),
      category: sanitizeText(item.category ?? "trending", 80).trim() || "trending",
      reason: sanitizeText(item.reason ?? "Popular this week", 200).trim() || "Popular this week",
      score: 1
    })).filter((item) => item.title);
    const trending = [
      ...incomingTrending,
      ...mostSearched,
      ...mostViewed,
      ...mostExploredIndustries,
      ...mostBookedExperts
    ].sort((a, b) => b.score - a.score).slice(0, 8).map((item) => ({
      type: "trending",
      title: item.title,
      category: item.category,
      reason: item.reason
    }));
    const topExpertScore = experts[0]?.matchScore ?? 0;
    const topIndustryScore = industries[0]?.matchScore ?? 0;
    const weakResults = experts.length + industries.length + testimonials.length < 4 || Math.max(topExpertScore, topIndustryScore) < 0.45;
    const aiSuggestions = weakResults ? generateAISuggestions({
      query,
      topIndustries: industries.map((item) => item.industryName),
      topExpertSkills: experts.map((item) => item.specialization),
      trendingTitles: trending.map((item) => item.title)
    }) : [];
    const recentSearches = buildRecentSearches(query, activity.searchHistory);
    return {
      data: {
        experts,
        industries,
        testimonials,
        trending,
        aiSuggestions,
        recentSearches
      },
      meta: {
        model: "heuristic",
        provider: "fallback",
        tokensUsed: 0,
        latencyMs: 0
      }
    };
  } catch {
    const activity = normalizeActivity(input.userActivity);
    const query = sanitizeText(input.query, 500).trim();
    const fallbackExperts = (input.db?.experts ?? []).map((expert) => ({
      type: "expert",
      id: sanitizeText(expert.id, 80).trim(),
      name: sanitizeText(expert.name, 200).trim(),
      title: sanitizeText(expert.title ?? "Consulting Expert", 120).trim() || "Consulting Expert",
      specialization: sanitizeText(expert.specialization ?? expert.industry ?? "General Consulting", 120).trim() || "General Consulting",
      industry: sanitizeText(expert.industry ?? "General", 120).trim() || "General",
      matchScore: 0.3
    })).filter((item) => item.id && item.name).slice(0, 5);
    const fallbackIndustries = (input.db?.industries ?? []).map((industry) => ({
      type: "industry",
      id: sanitizeText(industry.id ?? industry.name ?? industry.industryName ?? "", 80).trim(),
      industryName: sanitizeText(industry.industryName ?? industry.name ?? "", 120).trim() || "General",
      description: snippet(industry.description ?? "", 180),
      matchScore: 0.3
    })).filter((item) => item.id && item.industryName).slice(0, 5);
    const fallbackTestimonials = (input.db?.testimonials ?? []).map((testimonial) => ({
      type: "testimonial",
      id: sanitizeText(testimonial.id ?? "", 80).trim(),
      expertName: sanitizeText(testimonial.expertName ?? "", 200).trim(),
      contentSnippet: snippet(testimonial.content ?? testimonial.comment ?? ""),
      matchScore: 0.25
    })).filter((item) => item.id && item.expertName && item.contentSnippet).slice(0, 5);
    const fallbackTrending = (input.db?.trending ?? []).map((item) => ({
      type: "trending",
      title: sanitizeText(item.title ?? "", 120).trim(),
      category: sanitizeText(item.category ?? "trending", 80).trim() || "trending",
      reason: sanitizeText(item.reason ?? "Popular this week", 200).trim() || "Popular this week"
    })).filter((item) => item.title).slice(0, 5);
    return {
      data: {
        experts: fallbackExperts,
        industries: fallbackIndustries,
        testimonials: fallbackTestimonials,
        trending: fallbackTrending,
        aiSuggestions: generateAISuggestions({
          query,
          topIndustries: fallbackIndustries.map((item) => item.industryName),
          topExpertSkills: fallbackExperts.map((item) => item.specialization),
          trendingTitles: fallbackTrending.map((item) => item.title)
        }),
        recentSearches: buildRecentSearches(query, activity.searchHistory)
      },
      meta: { model: "heuristic", provider: "fallback", tokensUsed: 0, latencyMs: 0 }
    };
  }
};
var summary = async (input) => {
  const { data, meta } = await aiProvider.generateJSON({
    messages: [
      { role: "system", content: "You are a consulting analyst. Always return strict JSON." },
      { role: "user", content: summaryPrompt(input) }
    ],
    temperature: 0.3,
    maxTokens: 700
  });
  const safe = {
    summary: data?.summary ?? input.text.slice(0, 280),
    keyPoints: data?.keyPoints ?? [],
    actionItems: data?.actionItems ?? []
  };
  return {
    data: safe,
    meta: {
      model: meta.model,
      provider: meta.provider,
      tokensUsed: meta.tokensUsed,
      latencyMs: meta.latencyMs
    }
  };
};
var chat = async (input) => {
  const messages = buildChatMessages(input);
  const result = await aiProvider.generate({
    messages,
    temperature: 0.5,
    maxTokens: 500
  });
  return {
    data: { reply: result.text || "I'm here to help. Could you share a bit more detail?" },
    meta: {
      model: result.model,
      provider: result.provider,
      tokensUsed: result.tokensUsed,
      latencyMs: result.latencyMs
    }
  };
};
var documentAnalysis = async (input) => {
  const cleanText = sanitizeText(input.text, 16e3);
  const { data, meta } = await aiProvider.generateJSON({
    messages: [
      { role: "system", content: "You are a consulting document analyst. Always return strict JSON." },
      {
        role: "user",
        content: documentAnalysisPrompt({ text: cleanText, objective: input.objective })
      }
    ],
    temperature: 0.2,
    maxTokens: 1200
  });
  const safe = {
    summary: data?.summary ?? "",
    topics: data?.topics ?? [],
    entities: {
      people: data?.entities?.people ?? [],
      organizations: data?.entities?.organizations ?? [],
      locations: data?.entities?.locations ?? []
    },
    risks: data?.risks ?? [],
    opportunities: data?.opportunities ?? [],
    recommendedExperts: data?.recommendedExperts ?? []
  };
  return {
    data: safe,
    meta: {
      model: meta.model,
      provider: meta.provider,
      tokensUsed: meta.tokensUsed,
      latencyMs: meta.latencyMs
    }
  };
};
var aiAdvancedService = {
  recommendations,
  industryCreation,
  search,
  summary,
  chat,
  documentAnalysis
};

// src/modules/ai/utils/response.ts
var sendAIResponse = (res, data, meta, statusCode = 200) => {
  res.locals.aiMeta = meta;
  return res.status(statusCode).json({ success: true, data, meta });
};

// src/modules/ai/controllers/aiAdvanced.controller.ts
var recommendations2 = catchAsync(async (req, res) => {
  const payload = sanitizeObject(req.body);
  const { data, meta } = await aiAdvancedService.recommendations(payload);
  sendAIResponse(res, data, meta);
});
var industryCreation2 = catchAsync(async (req, res) => {
  const payload = sanitizeObject(req.body);
  payload.industryName = sanitizeText(payload.industryName, 100);
  const { data, meta } = await aiAdvancedService.industryCreation(payload);
  sendAIResponse(res, data, meta);
});
var search2 = catchAsync(async (req, res) => {
  const payload = sanitizeObject(req.body);
  payload.query = sanitizeText(payload.query, 500);
  const { data, meta } = await aiAdvancedService.search(payload);
  sendAIResponse(res, data, meta);
});
var summary2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const { data, meta } = await aiAdvancedService.summary({
    text: sanitizeText(payload.text, 16e3),
    audience: payload.audience ? sanitizeText(payload.audience, 100) : void 0
  });
  sendAIResponse(res, data, meta);
});
var chat2 = catchAsync(async (req, res) => {
  const payload = sanitizeObject(req.body);
  payload.message = sanitizeText(payload.message, 4e3);
  const { data, meta } = await aiAdvancedService.chat(payload);
  sendAIResponse(res, data, meta);
});
var documentAnalysis2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const { data, meta } = await aiAdvancedService.documentAnalysis({
    text: sanitizeText(payload.text, 32e3),
    objective: payload.objective ? sanitizeText(payload.objective, 500) : void 0
  });
  sendAIResponse(res, data, meta);
});
var aiAdvancedController = {
  recommendations: recommendations2,
  industryCreation: industryCreation2,
  search: search2,
  summary: summary2,
  chat: chat2,
  documentAnalysis: documentAnalysis2
};

// src/modules/ai/controllers/aiChat.controller.ts
import httpStatus6 from "http-status";

// src/modules/ai/services/aiChat.service.ts
import httpStatus5 from "http-status";
var MAX_HISTORY_MESSAGES = 20;
var aiMessageSelect = {
  id: true,
  role: true,
  content: true,
  model: true,
  provider: true,
  tokensUsed: true,
  latencyMs: true,
  feedback: true,
  createdAt: true
};
var formatRole = (role) => {
  if (role === AIChatMessageRole.USER) return "user";
  if (role === AIChatMessageRole.ASSISTANT) return "assistant";
  return "system";
};
var formatMessage2 = (message) => ({
  id: message.id,
  role: formatRole(message.role),
  content: message.content,
  feedback: message.feedback,
  model: message.model ?? null,
  provider: message.provider ?? null,
  tokensUsed: message.tokensUsed ?? 0,
  latencyMs: message.latencyMs ?? 0,
  createdAt: message.createdAt
});
var buildConversationTitle = (message) => {
  const compact = sanitizeText(message, 160).replace(/\s+/g, " ").trim();
  if (compact.length <= 60) return compact;
  return `${compact.slice(0, 57).trimEnd()}...`;
};
var ensureConversationOwner = async (conversationId, userId) => {
  const conversation = await prisma.aIConversation.findUnique({
    where: { id: conversationId },
    select: { id: true, userId: true, title: true, createdAt: true, updatedAt: true }
  });
  if (!conversation || conversation.userId !== userId) {
    throw new AppError_default(httpStatus5.NOT_FOUND, "AI conversation not found");
  }
  return conversation;
};
var getOrCreateConversation = async (userId, conversationId, message) => {
  if (conversationId) {
    return ensureConversationOwner(conversationId, userId);
  }
  return prisma.aIConversation.create({
    data: {
      userId,
      title: buildConversationTitle(message) || "New chat"
    },
    select: { id: true, userId: true, title: true, createdAt: true, updatedAt: true }
  });
};
var sendMessage = async (userId, input) => {
  const cleanMessage = sanitizeText(input.message, 4e3).trim();
  const cleanContext = input.context ? sanitizeText(input.context, 500).trim() : void 0;
  if (!cleanMessage) {
    throw new AppError_default(httpStatus5.BAD_REQUEST, "Message is required");
  }
  const conversation = await getOrCreateConversation(userId, input.conversationId, cleanMessage);
  const historyRows = await prisma.aIChatMessage.findMany({
    where: { conversationId: conversation.id },
    orderBy: { createdAt: "desc" },
    take: MAX_HISTORY_MESSAGES,
    select: aiMessageSelect
  });
  const history = historyRows.reverse().filter((item) => item.role !== AIChatMessageRole.SYSTEM).map((item) => ({ role: formatRole(item.role), content: item.content })).filter(
    (item) => item.role === "user" || item.role === "assistant"
  );
  const providerResult = await aiProvider.generate({
    messages: buildChatMessages({
      message: cleanMessage,
      context: cleanContext || void 0,
      history
    }),
    temperature: 0.5,
    maxTokens: 500
  });
  const safeReply = providerResult.text?.trim() || "I'm here to help. Could you share a bit more detail?";
  const { userMessage, assistantMessage, updatedConversation } = await prisma.$transaction(
    async (tx) => {
      const createdUserMessage = await tx.aIChatMessage.create({
        data: {
          conversationId: conversation.id,
          role: AIChatMessageRole.USER,
          content: cleanMessage
        },
        select: aiMessageSelect
      });
      const createdAssistantMessage = await tx.aIChatMessage.create({
        data: {
          conversationId: conversation.id,
          role: AIChatMessageRole.ASSISTANT,
          content: safeReply,
          model: providerResult.model,
          provider: providerResult.provider,
          tokensUsed: providerResult.tokensUsed,
          latencyMs: providerResult.latencyMs
        },
        select: aiMessageSelect
      });
      const refreshedConversation = await tx.aIConversation.update({
        where: { id: conversation.id },
        data: {
          title: conversation.title === "New chat" || !input.conversationId ? buildConversationTitle(cleanMessage) || conversation.title : void 0
        },
        select: { id: true, title: true, createdAt: true, updatedAt: true }
      });
      return {
        userMessage: createdUserMessage,
        assistantMessage: createdAssistantMessage,
        updatedConversation: refreshedConversation
      };
    }
  );
  return {
    data: {
      conversation: updatedConversation,
      userMessage: formatMessage2(userMessage),
      assistantMessage: formatMessage2(assistantMessage)
    },
    meta: {
      model: providerResult.model,
      provider: providerResult.provider,
      tokensUsed: providerResult.tokensUsed,
      latencyMs: providerResult.latencyMs
    }
  };
};
var listConversations = async (userId) => {
  const conversations = await prisma.aIConversation.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { messages: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          id: true,
          content: true,
          role: true,
          createdAt: true
        }
      }
    }
  });
  return conversations.map((conversation) => ({
    id: conversation.id,
    title: conversation.title,
    preview: conversation.messages[0]?.content ?? "",
    lastMessageRole: conversation.messages[0] ? formatRole(conversation.messages[0].role) : null,
    lastMessageAt: conversation.messages[0]?.createdAt ?? conversation.updatedAt,
    messageCount: conversation._count.messages,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt
  }));
};
var getConversation = async (userId, conversationId) => {
  const conversation = await ensureConversationOwner(conversationId, userId);
  const messages = await prisma.aIChatMessage.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    select: aiMessageSelect
  });
  return {
    id: conversation.id,
    title: conversation.title,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
    messages: messages.map(formatMessage2)
  };
};
var updateMessageFeedback = async (userId, conversationId, messageId, feedback) => {
  await ensureConversationOwner(conversationId, userId);
  const message = await prisma.aIChatMessage.findFirst({
    where: {
      id: messageId,
      conversationId
    },
    select: aiMessageSelect
  });
  if (!message) {
    throw new AppError_default(httpStatus5.NOT_FOUND, "AI message not found");
  }
  if (message.role !== AIChatMessageRole.ASSISTANT) {
    throw new AppError_default(httpStatus5.BAD_REQUEST, "Only assistant messages can be rated");
  }
  const updated = await prisma.aIChatMessage.update({
    where: { id: messageId },
    data: { feedback },
    select: aiMessageSelect
  });
  return formatMessage2(updated);
};
var aiChatService = {
  sendMessage,
  listConversations,
  getConversation,
  updateMessageFeedback
};

// src/modules/ai/controllers/aiChat.controller.ts
var sendMessage2 = catchAsync(async (req, res) => {
  const payload = sanitizeObject(req.body);
  const { data, meta } = await aiChatService.sendMessage(req.user.userId, {
    message: sanitizeText(payload.message, 4e3),
    context: payload.context ? sanitizeText(payload.context, 500) : void 0,
    conversationId: payload.conversationId
  });
  sendAIResponse(res, data, meta, httpStatus6.CREATED);
});
var listConversations2 = catchAsync(async (req, res) => {
  const data = await aiChatService.listConversations(req.user.userId);
  sendResponse(res, {
    httpStatusCode: httpStatus6.OK,
    success: true,
    message: "AI conversations fetched successfully",
    data
  });
});
var getConversation2 = catchAsync(async (req, res) => {
  const data = await aiChatService.getConversation(
    req.user.userId,
    String(req.params.conversationId)
  );
  sendResponse(res, {
    httpStatusCode: httpStatus6.OK,
    success: true,
    message: "AI conversation fetched successfully",
    data
  });
});
var updateMessageFeedback2 = catchAsync(async (req, res) => {
  const payload = sanitizeObject(req.body);
  const data = await aiChatService.updateMessageFeedback(
    req.user.userId,
    String(req.params.conversationId),
    String(req.params.messageId),
    payload.feedback ?? null
  );
  sendResponse(res, {
    httpStatusCode: httpStatus6.OK,
    success: true,
    message: "AI message feedback updated successfully",
    data
  });
});
var aiChatController = {
  sendMessage: sendMessage2,
  listConversations: listConversations2,
  getConversation: getConversation2,
  updateMessageFeedback: updateMessageFeedback2
};

// src/modules/ai/utils/metrics.ts
var stats = /* @__PURE__ */ new Map();
var startedAt = Date.now();
var getOrCreate = (endpoint) => {
  let s = stats.get(endpoint);
  if (!s) {
    s = {
      count: 0,
      errorCount: 0,
      totalLatencyMs: 0,
      totalTokens: 0,
      lastError: null,
      lastCallAt: null
    };
    stats.set(endpoint, s);
  }
  return s;
};
var aiMetrics = {
  recordSuccess(endpoint, latencyMs, tokensUsed = 0) {
    const s = getOrCreate(endpoint);
    s.count += 1;
    s.totalLatencyMs += latencyMs;
    s.totalTokens += tokensUsed;
    s.lastCallAt = (/* @__PURE__ */ new Date()).toISOString();
  },
  recordError(endpoint, latencyMs, message) {
    const s = getOrCreate(endpoint);
    s.count += 1;
    s.errorCount += 1;
    s.totalLatencyMs += latencyMs;
    s.lastError = { message, at: (/* @__PURE__ */ new Date()).toISOString() };
    s.lastCallAt = (/* @__PURE__ */ new Date()).toISOString();
  },
  snapshot() {
    const endpoints = {};
    for (const [key, s] of stats) {
      endpoints[key] = {
        count: s.count,
        errorCount: s.errorCount,
        avgLatencyMs: s.count > 0 ? Math.round(s.totalLatencyMs / s.count) : 0,
        totalTokens: s.totalTokens,
        lastError: s.lastError,
        lastCallAt: s.lastCallAt
      };
    }
    return {
      uptimeSeconds: Math.floor((Date.now() - startedAt) / 1e3),
      endpoints
    };
  }
};

// src/modules/ai/controllers/aiOps.controller.ts
var health = catchAsync(async (_req, res) => {
  const probe = await aiProvider.ping();
  const httpStatus8 = probe.status === "ok" ? 200 : probe.status === "unconfigured" ? 503 : 503;
  res.status(httpStatus8).json({
    success: probe.status === "ok",
    data: probe
  });
});
var metrics = catchAsync(async (_req, res) => {
  res.status(200).json({
    success: true,
    data: aiMetrics.snapshot()
  });
});
var aiOpsController = { health, metrics };

// src/modules/ai/ai.validation.ts
import { z as z13 } from "zod";
var historyItemSchema = z13.object({
  role: z13.enum(["user", "assistant"]),
  content: z13.string().trim().min(1).max(4e3)
});
var askSupport3 = z13.object({
  body: z13.object({
    message: z13.string().trim().min(1, "Message is required").max(4e3),
    context: z13.enum(["general", "homepage", "booking", "expert", "payment", "technical"]).optional(),
    history: z13.array(historyItemSchema).max(12).optional()
  })
});
var expertItem = z13.object({
  id: z13.string().min(1),
  name: z13.string().min(1).max(200),
  industry: z13.string().max(120).optional(),
  expertise: z13.array(z13.string().max(80)).max(20).optional(),
  bio: z13.string().max(2e3).optional(),
  rating: z13.number().min(0).max(5).optional()
});
var recommendations3 = z13.object({
  body: z13.object({
    viewedExperts: z13.array(z13.string().max(200)).max(100).optional(),
    exploredIndustries: z13.array(z13.string().max(120)).max(100).optional(),
    searchHistory: z13.array(z13.string().max(200)).max(100).optional(),
    clickedCategories: z13.array(z13.string().max(120)).max(100).optional()
  })
});
var industryCreation3 = z13.object({
  body: z13.object({
    industryName: z13.string().trim().min(2).max(100)
  })
});
var search3 = z13.object({
  body: z13.object({
    query: z13.string().trim().min(1).max(500),
    userActivity: z13.object({
      viewedExperts: z13.array(z13.string().max(200)).max(100).optional(),
      exploredIndustries: z13.array(z13.string().max(120)).max(100).optional(),
      searchHistory: z13.array(z13.string().max(200)).max(100).optional(),
      clickedCategories: z13.array(z13.string().max(120)).max(100).optional()
    }).optional(),
    db: z13.object({
      experts: z13.array(expertItem).max(300).optional(),
      industries: z13.array(z13.record(z13.string(), z13.unknown())).max(300).optional(),
      testimonials: z13.array(z13.record(z13.string(), z13.unknown())).max(500).optional(),
      trending: z13.array(z13.record(z13.string(), z13.unknown())).max(200).optional()
    }).optional()
  })
});
var summary3 = z13.object({
  body: z13.object({
    text: z13.string().trim().min(20).max(2e4),
    audience: z13.string().max(100).optional()
  })
});
var chat3 = z13.object({
  body: z13.object({
    message: z13.string().trim().min(1).max(4e3),
    context: z13.string().max(500).optional(),
    history: z13.array(historyItemSchema).max(20).optional()
  })
});
var persistedChatMessage = z13.object({
  body: z13.object({
    message: z13.string().trim().min(1).max(4e3),
    context: z13.string().max(500).optional(),
    conversationId: z13.string().uuid().optional()
  })
});
var conversationParams = z13.object({
  params: z13.object({
    conversationId: z13.string().uuid()
  })
});
var messageFeedback = z13.object({
  params: z13.object({
    conversationId: z13.string().uuid(),
    messageId: z13.string().uuid()
  }),
  body: z13.object({
    feedback: z13.enum(["LIKE", "DISLIKE"]).nullable()
  })
});
var documentAnalysis3 = z13.object({
  body: z13.object({
    text: z13.string().trim().min(50).max(4e4),
    objective: z13.string().max(500).optional()
  })
});
var aiValidation = {
  askSupport: askSupport3,
  recommendations: recommendations3,
  industryCreation: industryCreation3,
  search: search3,
  summary: summary3,
  chat: chat3,
  persistedChatMessage,
  conversationParams,
  messageFeedback,
  documentAnalysis: documentAnalysis3
};

// src/modules/ai/utils/aiLogger.ts
var aiLogger = (req, res, next) => {
  const startedAt2 = Date.now();
  const endpoint = req.path || req.originalUrl;
  res.on("finish", () => {
    const durationMs = Date.now() - startedAt2;
    const meta = res.locals.aiMeta ?? null;
    const ok = res.statusCode < 400;
    if (ok) {
      aiMetrics.recordSuccess(endpoint, durationMs, meta?.tokensUsed ?? 0);
    } else {
      aiMetrics.recordError(endpoint, durationMs, `HTTP ${res.statusCode}`);
    }
    console.log(
      JSON.stringify({
        scope: "ai",
        endpoint,
        method: req.method,
        status: res.statusCode,
        durationMs,
        provider: meta?.provider ?? null,
        model: meta?.model ?? null,
        tokensUsed: meta?.tokensUsed ?? 0,
        modelLatencyMs: meta?.latencyMs ?? null,
        at: (/* @__PURE__ */ new Date()).toISOString()
      })
    );
  });
  next();
};

// src/modules/ai/utils/rateLimiter.ts
var buckets = /* @__PURE__ */ new Map();
var getClientKey = (req) => {
  const userId = req.user?.id;
  if (userId) return `u:${userId}`;
  const xff = req.headers["x-forwarded-for"];
  const ip = (Array.isArray(xff) ? xff[0] : xff?.split(",")[0]?.trim()) || req.ip || "unknown";
  return `ip:${ip}`;
};
var rateLimit = (options) => {
  const { windowMs, max, keyPrefix = "ai" } = options;
  return (req, res, next) => {
    const key = `${keyPrefix}:${getClientKey(req)}`;
    const now = Date.now();
    const bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      res.setHeader("X-RateLimit-Limit", String(max));
      res.setHeader("X-RateLimit-Remaining", String(max - 1));
      return next();
    }
    if (bucket.count >= max) {
      const retryAfterSec = Math.max(1, Math.ceil((bucket.resetAt - now) / 1e3));
      res.setHeader("Retry-After", String(retryAfterSec));
      res.setHeader("X-RateLimit-Limit", String(max));
      res.setHeader("X-RateLimit-Remaining", "0");
      return res.status(429).json({
        success: false,
        message: "Rate limit exceeded",
        retryAfter: retryAfterSec
      });
    }
    bucket.count += 1;
    res.setHeader("X-RateLimit-Limit", String(max));
    res.setHeader("X-RateLimit-Remaining", String(max - bucket.count));
    next();
  };
};
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of buckets) {
    if (v.resetAt <= now) buckets.delete(k);
  }
}, 6e4).unref?.();

// src/modules/ai/utils/aiErrorHandler.ts
import status34 from "http-status";
var aiErrorHandler = (err, _req, res, next) => {
  if (err instanceof AppError_default && err.statusCode === status34.SERVICE_UNAVAILABLE) {
    return res.status(503).json({
      success: false,
      message: "AI provider unavailable",
      detail: err.message
    });
  }
  if (err instanceof AppError_default && err.statusCode === status34.BAD_GATEWAY) {
    return res.status(503).json({
      success: false,
      message: "AI provider unavailable",
      detail: err.message
    });
  }
  return next(err);
};

// src/modules/ai/ai.router.ts
var router16 = Router14();
router16.use(aiLogger);
var recommendationsLimiter = rateLimit({ windowMs: 6e4, max: 10, keyPrefix: "ai-rec" });
var industryCreationLimiter = rateLimit({ windowMs: 6e4, max: 10, keyPrefix: "ai-industry" });
var searchLimiter = rateLimit({ windowMs: 6e4, max: 15, keyPrefix: "ai-search" });
var summaryLimiter = rateLimit({ windowMs: 6e4, max: 5, keyPrefix: "ai-summary" });
var chatLimiter = rateLimit({ windowMs: 6e4, max: 20, keyPrefix: "ai-chat" });
var docLimiter = rateLimit({ windowMs: 6e4, max: 3, keyPrefix: "ai-doc" });
var supportLimiter = rateLimit({ windowMs: 6e4, max: 30, keyPrefix: "ai-support" });
router16.get("/health", aiOpsController.health);
router16.get("/metrics", aiOpsController.metrics);
router16.post(
  "/support",
  supportLimiter,
  validateRequest(aiValidation.askSupport),
  aiController.askSupport
);
router16.post(
  "/recommendations",
  recommendationsLimiter,
  validateRequest(aiValidation.recommendations),
  aiAdvancedController.recommendations
);
router16.post(
  "/industry-creation",
  industryCreationLimiter,
  validateRequest(aiValidation.industryCreation),
  aiAdvancedController.industryCreation
);
router16.post(
  "/search",
  searchLimiter,
  validateRequest(aiValidation.search),
  aiAdvancedController.search
);
router16.post(
  "/summary",
  summaryLimiter,
  validateRequest(aiValidation.summary),
  aiAdvancedController.summary
);
router16.post(
  "/chat",
  chatLimiter,
  validateRequest(aiValidation.chat),
  aiAdvancedController.chat
);
router16.post(
  "/chat/messages",
  chatLimiter,
  checkAuth(Role.CLIENT, Role.EXPERT, Role.ADMIN),
  validateRequest(aiValidation.persistedChatMessage),
  aiChatController.sendMessage
);
router16.get(
  "/chat/conversations",
  checkAuth(Role.CLIENT, Role.EXPERT, Role.ADMIN),
  aiChatController.listConversations
);
router16.get(
  "/chat/conversations/:conversationId",
  checkAuth(Role.CLIENT, Role.EXPERT, Role.ADMIN),
  validateRequest(aiValidation.conversationParams),
  aiChatController.getConversation
);
router16.patch(
  "/chat/conversations/:conversationId/messages/:messageId/feedback",
  checkAuth(Role.CLIENT, Role.EXPERT, Role.ADMIN),
  validateRequest(aiValidation.messageFeedback),
  aiChatController.updateMessageFeedback
);
router16.post(
  "/document-analysis",
  docLimiter,
  validateRequest(aiValidation.documentAnalysis),
  aiAdvancedController.documentAnalysis
);
router16.use(aiErrorHandler);
var aiRoutes = router16;

// src/modules/conversations/conservations.router.ts
import { Router as Router15 } from "express";

// src/modules/conversations/conversations.controler.ts
import httpStatus7 from "http-status";

// src/modules/conversations/conversations.service.ts
var getAllConversationsForAdmin = async (expertId) => {
  return chatService.getUserRooms("", Role.ADMIN, expertId);
};
var conversationsService = {
  getAllConversationsForAdmin
};

// src/modules/conversations/conversations.controler.ts
var getSingleString2 = (value) => {
  if (Array.isArray(value)) {
    return typeof value[0] === "string" ? value[0] : "";
  }
  return typeof value === "string" ? value : "";
};
var getAllConversationsForAdmin2 = catchAsync(
  async (req, res) => {
    const expertId = getSingleString2(req.query.expertId) || void 0;
    const conversations = await conversationsService.getAllConversationsForAdmin(
      expertId
    );
    sendResponse(res, {
      httpStatusCode: httpStatus7.OK,
      success: true,
      message: "Conversations fetched successfully",
      data: conversations
    });
  }
);
var conversationsController = {
  getAllConversationsForAdmin: getAllConversationsForAdmin2
};

// src/modules/conversations/conservations.router.ts
var router17 = Router15();
router17.get(
  "/admin",
  checkAuth(Role.ADMIN),
  conversationsController.getAllConversationsForAdmin
);
var conversationsRoutes = router17;

// src/modules/realtime/realtime.routes.ts
import { Router as Router16 } from "express";
import status35 from "http-status";
var router18 = Router16();
router18.get(
  "/token",
  checkAuth(Role.CLIENT, Role.EXPERT, Role.ADMIN),
  catchAsync(async (req, res) => {
    if (!envVars.ABLY_API_KEY) {
      throw new AppError_default(
        status35.SERVICE_UNAVAILABLE,
        "Realtime service is not configured. Set ABLY_API_KEY on the server."
      );
    }
    const userId = req.user.userId;
    const capability = {
      "private-room-*": ["subscribe", "publish", "presence", "history"],
      [userChannel(userId)]: ["subscribe"]
    };
    const tokenRequest = await createAblyTokenRequest(userId, capability);
    sendResponse(res, {
      httpStatusCode: status35.OK,
      success: true,
      message: "Ably token issued",
      data: tokenRequest
    });
  })
);
var realtimeRoutes = router18;

// src/index.ts
var router19 = Router17();
router19.use("/auth", authRoutes);
router19.use("/users", userRouter);
router19.use("/experts", expertRouter);
router19.use("/clients", clientRouter);
router19.use("/schedules", scheduleRoutes);
router19.use("/expert-schedules", expertScheduleRouter);
router19.use("/consultations", consultationRouter);
router19.use("/admin", adminRouter);
router19.use("/stats", StatsRoutes);
router19.use("/payments", PaymentRoutes);
router19.use("/notifications", notificationRouter);
router19.use("/chat", chatRoutes);
router19.use("/conversations", conversationsRoutes);
router19.use("/ai", aiRoutes);
router19.use("/realtime", realtimeRoutes);
router19.use("/industries", industryRouter);
router19.use("/expert-verification", expertVerificationRouter);
router19.use("/testimonials", testimonialRoutes);
var indexRoutes = router19;

export {
  AppError_default,
  envVars,
  prismaNamespace_exports,
  prisma,
  connectPrismaWithRetry,
  auth,
  seedDemoClient,
  seedAdmin,
  authRoutes,
  PaymentController,
  indexRoutes
};
