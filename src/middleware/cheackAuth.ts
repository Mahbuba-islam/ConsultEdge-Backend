// // /* eslint-disable @typescript-eslint/no-explicit-any */
// import { NextFunction, Request, Response } from "express";
// import status from "http-status";




// import { prisma } from "../lib/prisma";
// import AppError from "../errorHelpers/AppError";
// import { Role, UserStatus } from "../generated/enums";
// import { envVars } from "../config/env";
// import { CookieUtils } from "../utilis/cookie";
// import { jwtUtils } from "../utilis/jwt";

// export const checkAuth = (...authRoles: Role[]) => async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         //Session Token Verification
//         const sessionToken = CookieUtils.getCookie(req, "better-auth.session_token");
//          console.log(sessionToken);
//         if (!sessionToken) {
//             throw new Error('Unauthorized access! No session token provided.');
//         }

//         if (sessionToken) {
//             const sessionExists = await prisma.session.findFirst({
//                 where: {
//                     token: sessionToken,
//                     expiresAt: {
//                         gt: new Date(),
//                     }
//                 },
//                 include: {
//                     user: true,
//                 }
//             })

//             if (sessionExists && sessionExists.user) {
//                 const user = sessionExists.user;

//                 const now = new Date();
//                 const expiresAt = new Date(sessionExists.expiresAt)
//                 const createdAt = new Date(sessionExists.createdAt)

//                 const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
//                 const timeRemaining = expiresAt.getTime() - now.getTime();
//                 const percentRemaining = (timeRemaining / sessionLifeTime) * 100;

//                 if (percentRemaining < 20) {
//                     res.setHeader('X-Session-Refresh', 'true');
//                     res.setHeader('X-Session-Expires-At', expiresAt.toISOString());
//                     res.setHeader('X-Time-Remaining', timeRemaining.toString());

//                     console.log("Session Expiring Soon!!");
//                 }

//                 if (user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED) {
//                     throw new AppError(status.UNAUTHORIZED, 'Unauthorized access! User is not active.');
//                 }

//                 if (user.isDeleted) {
//                     throw new AppError(status.UNAUTHORIZED, 'Unauthorized access! User is deleted.');
//                 }

//                 if (authRoles.length > 0 && !authRoles.includes(user.role)) {
//                     throw new AppError(status.FORBIDDEN, 'Forbidden access! You do not have permission to access this resource.');
//                 }

//                 req.user = {
//                     userId : user.id,
//                     role : user.role,
//                     email : user.email,
//                 }
//             }

//             const accessToken = CookieUtils.getCookie(req, 'accessToken');

//             if (!accessToken) {
//                 throw new AppError(status.UNAUTHORIZED, 'Unauthorized access! No access token provided.');
//             }


//         }

//         //Access Token Verification
//         const accessToken = CookieUtils.getCookie(req, 'accessToken');

//         if (!accessToken) {
//             throw new AppError(status.UNAUTHORIZED, 'Unauthorized access! No access token provided.');
//         }

//         const verifiedToken = jwtUtils.verifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET);

//         if (!verifiedToken.success) {
//             throw new AppError(status.UNAUTHORIZED, 'Unauthorized access! Invalid access token.');
//         }

//         if (authRoles.length > 0 && !authRoles.includes(verifiedToken.data!.role as Role)) {
//             throw new AppError(status.FORBIDDEN, 'Forbidden access! You do not have permission to access this resource.');
//         }

//         next()
//     } catch (error: any) {
//         next(error);
//     }
// };



import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { prisma } from "../lib/prisma";
import AppError from "../errorHelpers/AppError";
import { Role, UserStatus } from "../generated/enums";
import { envVars } from "../config/env";
import { CookieUtils } from "../utilis/cookie";
import { jwtUtils } from "../utilis/jwt";

export const checkAuth =
  (...authRoles: Role[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // DEBUG: See what cookies server actually receives
      console.log("COOKIES RECEIVED:", req.cookies);

      // 1️⃣ Read session token
      const sessionToken = CookieUtils.getCookie(req, "better-auth.session_token");
     console.log(sessionToken, 'session token');
      if (!sessionToken) {
        throw new AppError(status.UNAUTHORIZED, "Unauthorized! No session token.");
      }

      // 2️⃣ Validate session
      const session = await prisma.session.findFirst({
        where: {
          token: sessionToken,
          expiresAt: { gt: new Date() },
        },
        include: { user: true },
      });

      if (!session || !session.user) {
        throw new AppError(status.UNAUTHORIZED, "Unauthorized! Invalid session.");
      }

      const user = session.user;

      // 3️⃣ Check user status
      if (
        user.status === UserStatus.BLOCKED ||
        user.status === UserStatus.DELETED ||
        user.isDeleted
      ) {
        throw new AppError(status.UNAUTHORIZED, "Unauthorized! User inactive.");
      }

      // 4️⃣ Role check (if required)
      if (authRoles.length > 0 && !authRoles.includes(user.role)) {
        throw new AppError(status.FORBIDDEN, "Forbidden! No permission.");
      }

      // 5️⃣ Attach user to req
      req.user = {
        userId: user.id,
        role: user.role,
        email: user.email,
      };

      // 6️⃣ Access token verification
      const accessToken = CookieUtils.getCookie(req, "accessToken");

      if (!accessToken) {
        throw new AppError(status.UNAUTHORIZED, "Unauthorized! No access token.");
      }

      const verified = jwtUtils.verifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET);

      if (!verified.success) {
        throw new AppError(status.UNAUTHORIZED, "Unauthorized! Invalid token.");
      }

      // 7️⃣ Role check again (token-based)
      if (authRoles.length > 0 && !authRoles.includes(verified.data!.role as Role)) {
        throw new AppError(status.FORBIDDEN, "Forbidden! No permission.");
      }

      next();
    } catch (error) {
      next(error);
    }
  };