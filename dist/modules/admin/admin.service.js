import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utilis/queryBuilder";
import { adminFilterableFields, adminIncludeConfig, adminSearchableFields } from "./admin.constant";
const findActiveAdminById = async (id) => {
    const admin = await prisma.admin.findFirst({
        where: { id, isDeleted: false },
        include: { user: true },
    });
    if (!admin) {
        throw new AppError(status.NOT_FOUND, "Admin not found");
    }
    return admin;
};
const buildAdminUpdatePayload = (payload) => {
    const data = {};
    if (payload.contactNumber !== undefined) {
        data.contactNumber = payload.contactNumber.trim();
    }
    if (payload.profilePhoto !== undefined) {
        data.profilePhoto = payload.profilePhoto.trim();
    }
    return data;
};
///get all admin service
const getAllAdmin = async (query) => {
    const queryBuilder = new QueryBuilder(prisma.admin, query, {
        searchableFields: adminSearchableFields,
        filterableFields: adminFilterableFields,
    });
    const result = await queryBuilder
        .search()
        .filter()
        .where({
        isDeleted: false,
    })
        .include({
        user: true,
    })
        .dynamicInclude(adminIncludeConfig)
        .paginate()
        .sort()
        .fields()
        .excute();
    return result;
};
const getAdminById = async (id) => {
    return findActiveAdminById(id);
};
//update admin by id
const updateAdmin = async (id, payload) => {
    const admin = await findActiveAdminById(id);
    const updatePayload = buildAdminUpdatePayload(payload);
    if (Object.keys(updatePayload).length === 0) {
        throw new AppError(status.BAD_REQUEST, "No valid admin fields provided for update");
    }
    //update admin
    const updatedAdmin = await prisma.admin.update({
        where: { id },
        data: updatePayload,
        include: {
            user: true
        }
    });
    return updatedAdmin;
};
//soft delete admin 
const markDeleteAdmin = async (id, user) => {
    const admin = await findActiveAdminById(id);
    if (admin.userId === user.userId) {
        throw new AppError(status.BAD_REQUEST, "You cannot delete yourself");
    }
    const result = await prisma.$transaction(async (tx) => {
        await tx.admin.update({
            where: { id },
            data: { isDeleted: true, deletedAt: new Date() },
        });
        await tx.user.update({
            where: { id: admin.userId },
            data: { isDeleted: true, status: "DELETED" },
        });
        return true;
    });
    return result;
};
export const adminService = {
    getAllAdmin,
    updateAdmin,
    getAdminById,
    markDeleteAdmin
};
//# sourceMappingURL=admin.service.js.map