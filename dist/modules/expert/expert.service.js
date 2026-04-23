import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utilis/queryBuilder";
import { expertFilterableFields, expertIncludeConfig, expertSearchableFields } from "./expert.constant";
import { Role, UserStatus } from "../../generated/client";
import { prisma } from "../../lib/prisma";
const getAllExperts = async (query) => {
    const qb = new QueryBuilder(prisma.expert, query, {
        searchableFields: expertSearchableFields,
        filterableFields: expertFilterableFields,
    });
    const result = await qb
        .search()
        .filter()
        .where({ isDeleted: false })
        .include({
        user: true,
        industry: true,
    })
        .dynamicInclude(expertIncludeConfig)
        .paginate()
        .sort()
        .fields()
        .excute();
    return result;
};
const getExpertById = async (id) => {
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
                },
                include: { schedule: true },
                orderBy: { createdAt: "asc" },
            },
            consultations: {
                include: {
                    client: true,
                    expertSchedule: true,
                },
            },
            testimonials: true,
            verification: true,
        },
    });
    if (!expert) {
        throw new AppError(status.NOT_FOUND, "Expert not found");
    }
    return expert;
};
const updateExpert = async (id, payload) => {
    const existingExpert = await prisma.expert.findUnique({
        where: { id, isDeleted: false },
    });
    if (!existingExpert) {
        throw new AppError(status.NOT_FOUND, "Expert not found");
    }
    const { expert: expertData } = payload;
    await prisma.expert.update({
        where: { id },
        data: {
            ...expertData,
        },
    });
    return await getExpertById(id);
};
const deleteExpert = async (id) => {
    const expert = await prisma.expert.findUnique({
        where: { id },
        include: { user: true },
    });
    if (!expert) {
        throw new AppError(status.NOT_FOUND, "Expert not found");
    }
    await prisma.$transaction(async (tx) => {
        await tx.expert.update({
            where: { id },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
            },
        });
        await tx.user.update({
            where: { id: expert.userId },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
                status: UserStatus.DELETED,
            },
        });
        await tx.session.deleteMany({
            where: { userId: expert.userId },
        });
    });
    return { message: "Expert deleted successfully" };
};
//apply expert
const applyExpert = async (userId, payload) => {
    // Check if already applied
    const existing = await prisma.expert.findUnique({
        where: { userId },
    });
    if (existing) {
        throw new AppError(status.BAD_REQUEST, "You have already applied to become an expert");
    }
    const clientProfile = await prisma.client.findUnique({
        where: { userId },
    });
    const parsedExperience = Number(payload.experience ?? 0);
    const parsedConsultationFee = Number(payload.consultationFee);
    if (!Number.isInteger(parsedExperience) || parsedExperience < 0) {
        throw new AppError(status.BAD_REQUEST, "Experience must be a non-negative integer");
    }
    if (!Number.isInteger(parsedConsultationFee) || parsedConsultationFee <= 0) {
        throw new AppError(status.BAD_REQUEST, "Consultation fee must be a positive integer");
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
                userId,
            },
        });
        // Convert the account from client to expert immediately
        await tx.user.update({
            where: { id: userId },
            data: { role: Role.EXPERT },
        });
        if (clientProfile && !clientProfile.isDeleted) {
            await tx.client.update({
                where: { id: clientProfile.id },
                data: {
                    isDeleted: true,
                    deletedAt: new Date(),
                },
            });
        }
        // Notify all active admins
        const admins = await tx.user.findMany({
            where: {
                role: Role.ADMIN,
                isDeleted: false,
                status: UserStatus.ACTIVE,
            },
            select: { id: true },
        });
        if (admins.length > 0) {
            await tx.notification.createMany({
                data: admins.map((admin) => ({
                    type: "EXPERT_APPLICATION",
                    message: `${createdExpert.fullName} applied to become an expert`,
                    userId: admin.id,
                })),
            });
        }
        return createdExpert;
    });
    return expert;
};
export const expertService = {
    getAllExperts,
    updateExpert,
    getExpertById,
    deleteExpert,
    applyExpert
};
//# sourceMappingURL=expert.service.js.map