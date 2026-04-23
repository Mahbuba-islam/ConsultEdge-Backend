import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { VerificationStatus } from "../../generated/enums";
import { prisma } from "../../lib/prisma";
const verifyExpert = async (expertId, adminId, payload) => {
    const expert = await prisma.expert.findUnique({
        where: { id: expertId, isDeleted: false },
    });
    if (!expert) {
        throw new AppError(status.NOT_FOUND, "Expert not found");
    }
    const verificationMessage = payload.status === VerificationStatus.APPROVED
        ? "Your expert profile has been approved by the admin."
        : payload.status === VerificationStatus.REJECTED
            ? `Your expert verification request has been rejected${payload.notes ? `: ${payload.notes}` : "."}`
            : "Your expert verification status is now pending review.";
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
                isVerified: payload.status === VerificationStatus.APPROVED,
            },
        });
        await tx.notification.create({
            data: {
                type: "EXPERT_VERIFICATION_UPDATE",
                message: verificationMessage,
                userId: expert.userId,
            },
        });
        return record;
    });
    return verification;
};
export const expertVerificationService = {
    verifyExpert,
};
//# sourceMappingURL=expertVerification.service.js.map