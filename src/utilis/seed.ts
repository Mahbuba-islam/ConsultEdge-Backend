/* eslint-disable @typescript-eslint/no-explicit-any */


import { prisma } from "../lib/prisma";
import { envVars } from "../config/env";
import { auth } from "../lib/auth";
import { Role } from "../generated/enums";


export const seedAdmin = async()=>{
    try{
    const isAdminExists = await prisma.user.findFirst({
        where:{
            role:Role.ADMIN
        }
    })
    if(isAdminExists){
        console.log(" admin already exists");
        return;
    }


    const adminUser = await auth.api.signUpEmail({
        body:{
            email:envVars.ADMIN_EMAIL,
            password:envVars.ADMIN_PASSWORD,
            name:"Admin Saheb",
            role:Role.ADMIN,
            rememberMe:false
        }
    })



 await prisma.$transaction(async(tx)=>{
        await tx.user.update({
            where:{
                id:adminUser.user.id
            },
            data:{
                emailVerified:true
            }
        })



        await tx.admin.create({
            data:{
                userId:adminUser.user.id,
                name:' Admin Saheb',
                email:envVars.ADMIN_EMAIL,
               
            }
        })



    })

    const admin = await prisma.admin.findFirst({
        where:{
            email:envVars.ADMIN_EMAIL
        },
        include:{
            user:true
        }
    })
  console.log(' admin created', admin);
    }

    catch(error:any){
     console.error("Error sending  admin", error)
   
     await prisma.user.delete({
        where:{
            email:envVars.ADMIN_EMAIL
        }
     })

    }
}