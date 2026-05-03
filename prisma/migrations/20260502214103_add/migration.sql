-- CreateEnum
CREATE TYPE "ExpertApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "expert_applications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" TEXT NOT NULL,
    "industryId" UUID NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "bio" TEXT,
    "title" TEXT,
    "experience" INTEGER NOT NULL DEFAULT 0,
    "consultationFee" INTEGER NOT NULL,
    "profilePhoto" TEXT,
    "resumeUrl" TEXT NOT NULL,
    "resumeFileName" TEXT NOT NULL,
    "resumeFileType" TEXT NOT NULL,
    "resumeFileSize" INTEGER NOT NULL,
    "status" "ExpertApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "reviewNotes" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expert_applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "expert_applications_userId_idx" ON "expert_applications"("userId");

-- CreateIndex
CREATE INDEX "expert_applications_industryId_idx" ON "expert_applications"("industryId");

-- CreateIndex
CREATE INDEX "expert_applications_status_idx" ON "expert_applications"("status");

-- AddForeignKey
ALTER TABLE "expert_applications" ADD CONSTRAINT "expert_applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_applications" ADD CONSTRAINT "expert_applications_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "industries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
