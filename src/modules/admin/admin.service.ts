import status from "http-status"

import AppError from "../../errorHelpers/AppError"
import { IupdateAdmin } from "./admin.interface"
import { IRequestUser } from "../../interfaces/requestUser.interface"
import { prisma } from "../../lib/prisma"
import { QueryBuilder } from "../../utilis/queryBuilder"
import { adminFilterableFields, adminIncludeConfig, adminSearchableFields } from "./admin.constant"
import { Admin, Prisma } from "../../generated/client"

///get all admin service

const getAllAdmin = async (query: any) => {
  const queryBuilder = new QueryBuilder<
    Admin,
    Prisma.AdminWhereInput,
    Prisma.AdminInclude
  >(prisma.admin, query, {
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


const getAdminById = async (id: string) => {
  const admin = await prisma.admin.findUnique({
    where: { id, isDeleted: false },
    include: { user: true },
  });

  if (!admin) {
    throw new AppError(status.NOT_FOUND, "Admin not found");
  }

  return admin;
};




//update admin by id

const updateAdmin = async(id:string, payload:IupdateAdmin)=>{
    //cheack if admin exists
    const admin = await prisma.admin.findUnique({
    where:{
        id,
        isDeleted:false
    }
 })

 if(!admin){
    throw new AppError(status.NOT_FOUND, "admin in this id not found")
 }

 //update admin
    const updatedAdmin = await prisma.admin.update({
        where:{id},
          data:payload,
         
         include:{
          user:true
         }
    })
    return updatedAdmin
}





//soft delete admin 
const markDeleteAdmin = async (id: string, user: IRequestUser) => {
  const admin = await prisma.admin.findUnique({
    where: { id, isDeleted: false },
  });

  if (!admin) {
    throw new AppError(status.NOT_FOUND, "Admin not found");
  }

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
}