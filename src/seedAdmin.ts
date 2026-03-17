/*

we create function here . that function call 
and when we run this file then admin will be created  in database


*/














// import { prisma } from "./lib/prisma"
// import { userRole } from "./middlewares/auth"





// async function seedAdmin(){
//     try{
 
//         const adminData = {
//             name:process.env.ADMIN_NAME,
//             email:process.env.ADMIN_EMAIL ,
//             role:userRole.ADMIN,
//             password:process.env.ADMIN_PASSWORD,
            
//         }
//         // cheack user exists user in db 
       
//         const existingUser = await prisma.user.findUnique({
//             where:{
//                 email:adminData.email as string
//             }
//         })
 
//         if(existingUser){
//             throw new Error('User already exists in db')
//         }


//         const signUpAdmin = await fetch('http://localhost:5000/api/auth/sign-up/email',{
//             method:"POST",
//             headers:{
//                 "Content-Type" : "application/json",
//                 Origin:process.env.APP_URL as string
//             },
//             body:JSON.stringify(adminData)
//         } )
  
//         // update data in user table
//         if(signUpAdmin.ok){
//             await prisma.user.update({
//                 where:{
//                     email:adminData.email!
//                 },
//                 data:{
//                     emailVerified:true
//                 }

//             })
//         }

//     }
//     catch(err){
//         console.error(err);
//     }
// }

//  seedAdmin()




/*
  This script seeds an admin user into the database.
  It calls the BetterAuth signup endpoint and then updates the user in Prisma.
*/

import { prisma } from "./lib/prisma";
import { userRole } from "./middlewares/auth";

async function seedAdmin() {
  try {
    const adminData = {
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      role: userRole.ADMIN,
      password: process.env.ADMIN_PASSWORD,
    };

    // Check if admin already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: adminData.email as string },
    });

    if (existingUser) {
      console.log("Admin already exists. Skipping seeding.");
      return;
    }

    // ⭐ FIXED — DO NOT SET ORIGIN HEADER
    const signUpAdmin = await fetch(
      "http://localhost:5000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // ❌ NO Origin header
        // ❌ NO CORS headers
        // ✔ Node fetch will work normally
        body: JSON.stringify(adminData),
      }
    );

    if (!signUpAdmin.ok) {
      console.error("Admin signup failed:", await signUpAdmin.text());
      return;
    }

    // Update emailVerified in DB
    await prisma.user.update({
      where: { email: adminData.email! },
      data: { emailVerified: true },
    });

    console.log("Admin seeded successfully.");
  } catch (err) {
    console.error("Admin seeding error:", err);
  }
}

seedAdmin();