/*
  Warnings:

  - You are about to drop the column `price` on the `expert` table. All the data in the column will be lost.
  - Added the required column `consultationFee` to the `expert` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "expert" DROP COLUMN "price",
ADD COLUMN     "consultationFee" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "expert_schedules" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;
