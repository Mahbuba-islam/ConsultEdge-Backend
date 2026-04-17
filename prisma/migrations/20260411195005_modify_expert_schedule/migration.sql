/*
  Warnings:

  - You are about to drop the column `scheduleId` on the `expert_schedules` table. All the data in the column will be lost.
  - You are about to drop the `schedules` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[expertId]` on the table `expert_schedules` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "expert_schedules" DROP CONSTRAINT "expert_schedules_scheduleId_fkey";

-- Consolidate legacy duplicate schedule rows so one record remains per expert
WITH ranked_schedules AS (
    SELECT
        id,
        "expertId",
        "consultationId",
        "isBooked",
        "isPublished",
        "isDeleted",
        "deletedAt",
        "updatedAt",
        "createdAt",
        ROW_NUMBER() OVER (
            PARTITION BY "expertId"
            ORDER BY
                CASE WHEN "consultationId" IS NOT NULL THEN 0 ELSE 1 END,
                CASE WHEN "isBooked" THEN 0 ELSE 1 END,
                CASE WHEN "isPublished" THEN 0 ELSE 1 END,
                CASE WHEN NOT "isDeleted" THEN 0 ELSE 1 END,
                "updatedAt" DESC,
                "createdAt" DESC,
                id DESC
        ) AS row_num,
        FIRST_VALUE(id) OVER (
            PARTITION BY "expertId"
            ORDER BY
                CASE WHEN "consultationId" IS NOT NULL THEN 0 ELSE 1 END,
                CASE WHEN "isBooked" THEN 0 ELSE 1 END,
                CASE WHEN "isPublished" THEN 0 ELSE 1 END,
                CASE WHEN NOT "isDeleted" THEN 0 ELSE 1 END,
                "updatedAt" DESC,
                "createdAt" DESC,
                id DESC
        ) AS keeper_id
    FROM "expert_schedules"
),
merged_values AS (
    SELECT
        keeper_id,
        BOOL_OR("isBooked") AS "isBooked",
        BOOL_OR("isPublished") AS "isPublished",
        BOOL_AND("isDeleted") AS "isDeleted",
        MAX("deletedAt") AS "deletedAt",
        (MAX("consultationId"::text) FILTER (WHERE "consultationId" IS NOT NULL))::uuid AS "consultationId"
    FROM ranked_schedules
    GROUP BY keeper_id
),
duplicate_rows AS (
    SELECT id, keeper_id
    FROM ranked_schedules
    WHERE row_num > 1
)
UPDATE "consultations" AS c
SET "expertScheduleId" = d.keeper_id
FROM duplicate_rows AS d
WHERE c."expertScheduleId" = d.id;

WITH merged_values AS (
    SELECT
        keeper_id,
        BOOL_OR("isBooked") AS "isBooked",
        BOOL_OR("isPublished") AS "isPublished",
        BOOL_AND("isDeleted") AS "isDeleted",
        MAX("deletedAt") AS "deletedAt",
        (MAX("consultationId"::text) FILTER (WHERE "consultationId" IS NOT NULL))::uuid AS "consultationId"
    FROM (
        SELECT
            id,
            "consultationId",
            "isBooked",
            "isPublished",
            "isDeleted",
            "deletedAt",
            FIRST_VALUE(id) OVER (
                PARTITION BY "expertId"
                ORDER BY
                    CASE WHEN "consultationId" IS NOT NULL THEN 0 ELSE 1 END,
                    CASE WHEN "isBooked" THEN 0 ELSE 1 END,
                    CASE WHEN "isPublished" THEN 0 ELSE 1 END,
                    CASE WHEN NOT "isDeleted" THEN 0 ELSE 1 END,
                    "updatedAt" DESC,
                    "createdAt" DESC,
                    id DESC
            ) AS keeper_id
        FROM "expert_schedules"
    ) grouped
    GROUP BY keeper_id
)
UPDATE "expert_schedules" AS es
SET
    "consultationId" = COALESCE(es."consultationId", mv."consultationId"),
    "isBooked" = mv."isBooked",
    "isPublished" = mv."isPublished",
    "isDeleted" = mv."isDeleted",
    "deletedAt" = mv."deletedAt"
FROM merged_values AS mv
WHERE es.id = mv.keeper_id;

DELETE FROM "expert_schedules"
WHERE id IN (
    SELECT id
    FROM (
        SELECT
            id,
            ROW_NUMBER() OVER (
                PARTITION BY "expertId"
                ORDER BY
                    CASE WHEN "consultationId" IS NOT NULL THEN 0 ELSE 1 END,
                    CASE WHEN "isBooked" THEN 0 ELSE 1 END,
                    CASE WHEN "isPublished" THEN 0 ELSE 1 END,
                    CASE WHEN NOT "isDeleted" THEN 0 ELSE 1 END,
                    "updatedAt" DESC,
                    "createdAt" DESC,
                    id DESC
            ) AS row_num
        FROM "expert_schedules"
    ) ranked_for_delete
    WHERE row_num > 1
);

-- DropIndex
DROP INDEX "expert_schedules_expertId_scheduleId_key";

-- DropIndex
DROP INDEX "expert_schedules_scheduleId_idx";

-- AlterTable
ALTER TABLE "expert_schedules" DROP COLUMN "scheduleId";

-- DropTable
DROP TABLE "schedules";

-- CreateIndex
CREATE UNIQUE INDEX "expert_schedules_expertId_key" ON "expert_schedules"("expertId");
