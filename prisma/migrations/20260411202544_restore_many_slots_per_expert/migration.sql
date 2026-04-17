/*
  Restore many availability slots per expert by reintroducing the `schedules` table
  and reconnecting every existing `expert_schedules` row to its own slot.
*/
-- DropIndex
DROP INDEX "expert_schedules_expertId_key";

-- CreateTable
CREATE TABLE "schedules" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "startDateTime" TIMESTAMP(3) NOT NULL,
    "endDateTime" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "expert_schedules" ADD COLUMN "scheduleId" UUID;

WITH generated_slots AS (
    SELECT
        es.id AS expert_schedule_id,
        gen_random_uuid() AS schedule_id,
        COALESCE(c.date, es."createdAt", NOW()) AS start_time,
        COALESCE(
            c.date + INTERVAL '30 minutes',
            es."createdAt" + INTERVAL '30 minutes',
            NOW() + INTERVAL '30 minutes'
        ) AS end_time
    FROM "expert_schedules" es
    LEFT JOIN "consultations" c ON c."expertScheduleId" = es.id
),
inserted_slots AS (
    INSERT INTO "schedules" (
        "id",
        "startDateTime",
        "endDateTime",
        "isDeleted",
        "deletedAt",
        "createdAt",
        "updatedAt"
    )
    SELECT
        schedule_id,
        start_time,
        end_time,
        false,
        NULL,
        NOW(),
        NOW()
    FROM generated_slots
)
UPDATE "expert_schedules" es
SET "scheduleId" = gs.schedule_id
FROM generated_slots gs
WHERE es.id = gs.expert_schedule_id;

ALTER TABLE "expert_schedules" ALTER COLUMN "scheduleId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "expert_schedules_scheduleId_idx" ON "expert_schedules"("scheduleId");

-- CreateIndex
CREATE UNIQUE INDEX "expert_schedules_expertId_scheduleId_key" ON "expert_schedules"("expertId", "scheduleId");

-- AddForeignKey
ALTER TABLE "expert_schedules" ADD CONSTRAINT "expert_schedules_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
