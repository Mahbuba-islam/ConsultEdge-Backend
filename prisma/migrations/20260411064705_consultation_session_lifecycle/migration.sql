-- AlterEnum
ALTER TYPE "ConsultationStatus" ADD VALUE 'ONGOING';

-- AlterTable
ALTER TABLE "consultations" ADD COLUMN     "cancelReason" TEXT,
ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "cancelledBy" "Role",
ADD COLUMN     "endedAt" TIMESTAMP(3),
ADD COLUMN     "rescheduleReason" TEXT,
ADD COLUMN     "rescheduledAt" TIMESTAMP(3),
ADD COLUMN     "rescheduledBy" "Role",
ADD COLUMN     "sessionSummary" TEXT,
ADD COLUMN     "startedAt" TIMESTAMP(3);
