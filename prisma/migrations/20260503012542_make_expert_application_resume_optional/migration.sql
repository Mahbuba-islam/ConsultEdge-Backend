-- AlterTable
ALTER TABLE "expert_applications" ALTER COLUMN "resumeUrl" DROP NOT NULL,
ALTER COLUMN "resumeFileName" DROP NOT NULL,
ALTER COLUMN "resumeFileType" DROP NOT NULL,
ALTER COLUMN "resumeFileSize" DROP NOT NULL;
