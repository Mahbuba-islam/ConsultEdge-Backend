import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { VerificationStatus } from "../../generated/enums";
import { prisma } from "../../lib/prisma";

const verifyExpert = async (
  expertId: string,
  adminId: string,
  payload: { status: VerificationStatus; notes?: string }
) => {
  const expert = await prisma.expert.findUnique({
    where: { id: expertId, isDeleted: false },
  });

  if (!expert) {
    throw new AppError(status.NOT_FOUND, "Expert not found");
  }

  // Create or update verification record
  const verification = await prisma.$transaction(async (tx) => {
    const record = await tx.expertVerification.upsert({
      where: { expertId },
      create: {
        expertId,
        status: payload.status,
        notes: payload.notes,
        verifiedBy: adminId,
        verifiedAt: new Date(),
      },
      update: {
        status: payload.status,
        notes: payload.notes,
        verifiedBy: adminId,
        verifiedAt: new Date(),
      },
    });

    // Update expert isVerified field
    await tx.expert.update({
      where: { id: expertId },
      data: {
        isVerified: payload.status === "APPROVED",
      },
    });

    return record;
  });

  return verification;
};

export const expertVerificationService = {
  verifyExpert,
};