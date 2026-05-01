/* eslint-disable @typescript-eslint/no-explicit-any */


import { prisma } from "../lib/prisma";
import { envVars } from "../config/env";
import { auth } from "../lib/auth";
import { Role, UserStatus } from "../generated/enums";

const DEMO_CLIENT_EMAIL = process.env.DEMO_CLIENT_EMAIL || "client@consultedge.demo";
const DEMO_CLIENT_PASSWORD = process.env.DEMO_CLIENT_PASSWORD || "Demo@12345";
const DEMO_CLIENT_NAME = process.env.DEMO_CLIENT_NAME || "Demo Client";

export const getDemoClientCredentials = () => ({
    email: DEMO_CLIENT_EMAIL,
    password: DEMO_CLIENT_PASSWORD,
    name: DEMO_CLIENT_NAME,
});

export const seedDemoClient = async () => {
    const credentials = getDemoClientCredentials();

    const existingUser = await prisma.user.findUnique({
        where: {
            email: credentials.email,
        },
        select: {
            id: true,
        },
    });

    let userId = existingUser?.id;

    if (!userId) {
        const created = await auth.api.signUpEmail({
            body: {
                email: credentials.email,
                password: credentials.password,
                name: credentials.name,
                role: Role.CLIENT,
                rememberMe: false,
            },
        });

        userId = created.user.id;
    }

    await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            name: credentials.name,
            role: Role.CLIENT,
            status: UserStatus.ACTIVE,
            emailVerified: true,
            needPasswordChange: false,
            isDeleted: false,
            deletedAt: null,
        },
    });

    await prisma.client.upsert({
        where: {
            userId,
        },
        create: {
            userId,
            fullName: credentials.name,
            email: credentials.email,
            isDeleted: false,
        },
        update: {
            fullName: credentials.name,
            email: credentials.email,
            isDeleted: false,
            deletedAt: null,
        },
    });

    return credentials;
};


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