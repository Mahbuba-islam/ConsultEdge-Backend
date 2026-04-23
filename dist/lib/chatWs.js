import { WebSocketServer, WebSocket } from "ws";
import { UserStatus } from "../generated/client";
import { prisma } from "./prisma";
import { jwtUtils } from "../utilis/jwt";
import { envVars } from "../config/env";
import { auth } from "./auth";
const safeSend = (ws, payload) => {
    if (ws.readyState !== WebSocket.OPEN) {
        return;
    }
    ws.send(JSON.stringify(payload));
};
const parseCookies = (cookieHeader) => {
    if (!cookieHeader) {
        return {};
    }
    return cookieHeader
        .split(";")
        .map((item) => item.trim())
        .filter(Boolean)
        .reduce((acc, item) => {
        const separatorIndex = item.indexOf("=");
        if (separatorIndex <= 0) {
            return acc;
        }
        const key = item.slice(0, separatorIndex).trim();
        const value = item.slice(separatorIndex + 1).trim();
        if (key) {
            acc[key] = decodeURIComponent(value);
        }
        return acc;
    }, {});
};
const getBearerToken = (authorizationHeader) => {
    if (!authorizationHeader?.startsWith("Bearer ")) {
        return null;
    }
    const token = authorizationHeader.slice(7).trim();
    return token || null;
};
const resolveSocketIdentity = async (req) => {
    const url = new URL(req.url ?? "", "http://localhost");
    const cookies = parseCookies(req.headers.cookie);
    const authorization = Array.isArray(req.headers.authorization)
        ? req.headers.authorization[0]
        : req.headers.authorization;
    const tokenFromQuery = url.searchParams.get("token")?.trim() ||
        url.searchParams.get("accessToken")?.trim() ||
        null;
    const tokenFromCookie = cookies.accessToken || null;
    const tokenFromBearer = getBearerToken(authorization);
    const accessToken = tokenFromCookie || tokenFromBearer || tokenFromQuery;
    if (accessToken) {
        const verified = jwtUtils.verifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET);
        if (verified.success && verified.data?.userId) {
            const user = await prisma.user.findUnique({
                where: { id: String(verified.data.userId) },
            });
            if (user &&
                !user.isDeleted &&
                user.status !== UserStatus.BLOCKED &&
                user.status !== UserStatus.DELETED) {
                return {
                    userId: user.id,
                    role: user.role,
                };
            }
        }
    }
    const sessionCookie = cookies["better-auth.session_token"] ||
        cookies["__Secure-better-auth.session_token"] ||
        null;
    if (!sessionCookie && !authorization) {
        return null;
    }
    const fallbackCookieHeader = [
        sessionCookie ? `better-auth.session_token=${sessionCookie}` : "",
        sessionCookie ? `__Secure-better-auth.session_token=${sessionCookie}` : "",
    ]
        .filter(Boolean)
        .join("; ");
    const session = await auth.api
        .getSession({
        headers: {
            ...(fallbackCookieHeader ? { cookie: fallbackCookieHeader } : {}),
            ...(authorization ? { authorization } : {}),
        },
    })
        .catch(() => null);
    const sessionUserId = session?.user?.id;
    if (!sessionUserId) {
        return null;
    }
    const user = await prisma.user.findUnique({
        where: { id: sessionUserId },
    });
    if (!user ||
        user.isDeleted ||
        user.status === UserStatus.BLOCKED ||
        user.status === UserStatus.DELETED) {
        return null;
    }
    return {
        userId: user.id,
        role: user.role,
    };
};
const upsertPresence = async (userId, isOnline) => {
    await prisma.userPresence.upsert({
        where: { userId },
        create: {
            userId,
            isOnline,
            lastSeen: new Date(),
        },
        update: {
            isOnline,
            lastSeen: new Date(),
        },
    });
};
export class ChatWsHub {
    constructor(httpServer) {
        this.socketsByUser = new Map();
        this.wss = new WebSocketServer({ server: httpServer, path: "/ws/chat" });
        this.register();
    }
    register() {
        this.wss.on("connection", async (socket, req) => {
            const identity = await resolveSocketIdentity(req);
            const userId = identity?.userId;
            const role = identity?.role;
            if (!userId || !role) {
                safeSend(socket, {
                    type: "error",
                    message: "Unauthorized websocket connection",
                });
                socket.close();
                return;
            }
            socket.userId = userId;
            socket.role = role;
            socket.rooms = new Set();
            const userSockets = this.socketsByUser.get(userId) ?? new Set();
            userSockets.add(socket);
            this.socketsByUser.set(userId, userSockets);
            await upsertPresence(userId, true);
            safeSend(socket, {
                type: "connected",
                userId,
            });
            socket.on("message", (raw) => {
                try {
                    const event = JSON.parse(raw.toString());
                    if (event.type === "subscribe" && event.roomId?.trim()) {
                        socket.rooms?.add(event.roomId.trim());
                        safeSend(socket, { type: "subscribed", roomId: event.roomId.trim() });
                        return;
                    }
                    if (event.type === "unsubscribe" && event.roomId?.trim()) {
                        socket.rooms?.delete(event.roomId.trim());
                        safeSend(socket, { type: "unsubscribed", roomId: event.roomId.trim() });
                        return;
                    }
                    if (event.type === "ping") {
                        safeSend(socket, { type: "pong" });
                    }
                }
                catch {
                    safeSend(socket, {
                        type: "error",
                        message: "Invalid websocket message",
                    });
                }
            });
            socket.on("close", async () => {
                const userSocketsSet = this.socketsByUser.get(userId);
                if (userSocketsSet) {
                    userSocketsSet.delete(socket);
                    if (!userSocketsSet.size) {
                        this.socketsByUser.delete(userId);
                        await upsertPresence(userId, false);
                    }
                }
            });
        });
    }
    emitToRoom(roomId, eventName, payload) {
        for (const userSockets of this.socketsByUser.values()) {
            for (const socket of userSockets) {
                if (!socket.rooms?.has(roomId)) {
                    continue;
                }
                safeSend(socket, {
                    type: "event",
                    event: eventName,
                    roomId,
                    payload,
                });
            }
        }
    }
    emitToUser(userId, eventName, payload) {
        const userSockets = this.socketsByUser.get(userId);
        if (!userSockets?.size) {
            return;
        }
        for (const socket of userSockets) {
            safeSend(socket, {
                type: "event",
                event: eventName,
                payload,
            });
        }
    }
}
//# sourceMappingURL=chatWs.js.map