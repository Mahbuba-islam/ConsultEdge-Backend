// // /* eslint-disable @typescript-eslint/no-explicit-any */
// import { NextFunction, Request, Response } from "express";
// import status from "http-status";
import status from "http-status";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";
import AppError from "../errorHelpers/AppError";
import { UserStatus } from "../generated/enums";
import { envVars } from "../config/env";
import { CookieUtils } from "../utilis/cookie";
import { jwtUtils } from "../utilis/jwt";
import { tokenUtils } from "../utilis/token";
export const checkAuth = (...authRoles) => async (req, res, next) => {
    console.log('Cookies:', req.headers.cookie);
    try {
        const authHeader = req.headers.authorization;
        const bearerToken = authHeader?.startsWith("Bearer ")
            ? authHeader.slice(7).trim()
            : undefined;
        const cookieToken = CookieUtils.getCookie(req, "accessToken");
        const accessToken = cookieToken || bearerToken;
        const betterAuthSessionToken = CookieUtils.getCookie(req, "better-auth.session_token") ||
            CookieUtils.getCookie(req, "__Secure-better-auth.session_token");
        let userId = null;
        let betterAuthSession = null;
        if (accessToken) {
            const verified = jwtUtils.verifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET);
            if (verified.success && verified.data?.userId) {
                userId = String(verified.data.userId);
            }
        }
        if (!userId && (betterAuthSessionToken || authHeader)) {
            const fallbackCookieHeader = req.headers.cookie || [
                betterAuthSessionToken
                    ? `better-auth.session_token=${betterAuthSessionToken}`
                    : "",
                betterAuthSessionToken
                    ? `__Secure-better-auth.session_token=${betterAuthSessionToken}`
                    : "",
            ]
                .filter(Boolean)
                .join("; ");
            betterAuthSession = await auth.api
                .getSession({
                headers: {
                    ...(fallbackCookieHeader ? { cookie: fallbackCookieHeader } : {}),
                    ...(authHeader ? { authorization: authHeader } : {}),
                },
            })
                .catch(() => null);
            if (betterAuthSession?.user?.id) {
                userId = betterAuthSession.user.id;
            }
        }
        if (!userId) {
            throw new AppError(status.UNAUTHORIZED, `Unauthorized! No access token. Route: ${req.method} ${req.originalUrl}. Send cookie or Bearer token.`);
        }
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new AppError(status.UNAUTHORIZED, "Unauthorized! User not found.");
        }
        const userRole = user.role;
        if (user.status === UserStatus.BLOCKED ||
            user.status === UserStatus.DELETED ||
            user.isDeleted) {
            throw new AppError(status.UNAUTHORIZED, "Unauthorized! User inactive.");
        }
        if (authRoles.length > 0 && !authRoles.includes(userRole)) {
            throw new AppError(status.FORBIDDEN, `Forbidden! No permission. Current role: ${userRole}. Allowed roles: ${authRoles.join(", ")}. Route: ${req.method} ${req.originalUrl}`);
        }
        if (!cookieToken && betterAuthSession?.user?.id === user.id) {
            const refreshedAccessToken = tokenUtils.getAccessToken({
                userId: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                status: user.status,
                isDeleted: user.isDeleted,
                emailVerified: user.emailVerified,
            });
            tokenUtils.setAccessTokenCookie(res, refreshedAccessToken);
        }
        req.user = {
            userId: user.id,
            role: userRole,
            email: user.email,
        };
        if (betterAuthSession?.session && betterAuthSession.user?.id === user.id) {
            const now = new Date();
            const expiresAt = new Date(betterAuthSession.session.expiresAt);
            const createdAt = new Date(betterAuthSession.session.createdAt);
            const sessionLifetime = expiresAt.getTime() - createdAt.getTime();
            const timeRemaining = expiresAt.getTime() - now.getTime();
            if (sessionLifetime > 0) {
                const percentRemaining = (timeRemaining / sessionLifetime) * 100;
                if (percentRemaining < 20) {
                    res.setHeader("X-Session-Refresh", "true");
                    res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
                    res.setHeader("X-Time-Remaining", timeRemaining.toString());
                }
            }
        }
        console.log('Authorization:', req.headers.authorization);
        next();
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=cheackAuth.js.map