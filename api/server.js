import {
  AppError_default,
  MessageType,
  PaymentController,
  Role,
  UserStatus,
  auth,
  authRoutes,
  chatService,
  consultationService,
  envVars,
  indexRoutes,
  jwtUtils,
  prisma,
  prismaNamespace_exports,
  setChatWsHub,
  setSocketIO
} from "./chunk-NVDDLXFU.js";

// src/app.ts
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import cron from "node-cron";
import { toNodeHandler } from "better-auth/node";

// src/middleware/globalErrorHandler.ts
import status3 from "http-status";
import z from "zod";

// src/errorHelpers/handlePrismaError.ts
import status from "http-status";
var getStatusCodeFromPrismaError = (errorCode) => {
  if (errorCode === "P2002") {
    return status.CONFLICT;
  }
  if (["P2025", "P2001", "P2015", "P2018"].includes(errorCode)) {
    return status.NOT_FOUND;
  }
  if (["P1000", "P6002"].includes(errorCode)) {
    return status.UNAUTHORIZED;
  }
  if (["P1010", "P6010"].includes(errorCode)) {
    return status.FORBIDDEN;
  }
  if (errorCode === "P6003") {
    return status.PAYMENT_REQUIRED;
  }
  if (["P1008", "P2004", "P6004"].includes(errorCode)) {
    return status.GATEWAY_TIMEOUT;
  }
  if (errorCode === "P5011") {
    return status.TOO_MANY_REQUESTS;
  }
  if (errorCode === "P6009") {
    return 413;
  }
  if (errorCode.startsWith("P1") || ["P2024", "P2037", "P6008"].includes(errorCode)) {
    return status.SERVICE_UNAVAILABLE;
  }
  if (errorCode.startsWith("P2")) {
    return status.BAD_REQUEST;
  }
  if (errorCode.startsWith("P3") || errorCode.startsWith("P4")) {
    return status.INTERNAL_SERVER_ERROR;
  }
  return status.INTERNAL_SERVER_ERROR;
};
var formatErrorMeta = (meta) => {
  if (!meta) return "";
  const parts = [];
  if (meta.target) {
    parts.push(`Field(s): ${String(meta.target)}`);
  }
  if (meta.field_name) {
    parts.push(`Field: ${String(meta.field_name)}`);
  }
  if (meta.column_name) {
    parts.push(`Column: ${String(meta.column_name)}`);
  }
  if (meta.table) {
    parts.push(`Table: ${String(meta.table)}`);
  }
  if (meta.model_name) {
    parts.push(`Model: ${String(meta.model_name)}`);
  }
  if (meta.relation_name) {
    parts.push(`Relation: ${String(meta.relation_name)}`);
  }
  if (meta.constraint) {
    parts.push(`Constraint: ${String(meta.constraint)}`);
  }
  if (meta.database_error) {
    parts.push(`Database Error: ${String(meta.database_error)}`);
  }
  return parts.length > 0 ? parts.join(" |") : "";
};
var handlePrismaClientKnownRequestError = (error) => {
  const statusCode = getStatusCodeFromPrismaError(error.code);
  const metaInfo = formatErrorMeta(error.meta);
  let cleanMessage = error.message;
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const mainMessage = lines[0] || "An error occurred with the database operation.";
  const errorSources = [
    {
      path: error.code,
      message: metaInfo ? `${mainMessage} | ${metaInfo}` : mainMessage
    }
  ];
  if (error.meta?.cause) {
    errorSources.push({
      path: "cause",
      message: String(error.meta.cause)
    });
  }
  return {
    success: false,
    statusCode,
    message: `Prisma Client Known Request Error: ${mainMessage}`,
    errorSources
  };
};
var handlePrismaClientUnknownError = (error) => {
  let cleanMessage = error.message;
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const mainMessage = lines[0] || "An unknown error occurred with the database operation.";
  const errorSources = [
    {
      path: "Unknown Prisma Error",
      message: mainMessage
    }
  ];
  return {
    success: false,
    statusCode: status.INTERNAL_SERVER_ERROR,
    message: `Prisma Client Unknown Request Error: ${mainMessage}`,
    errorSources
  };
};
var handlePrismaClientValidationError = (error) => {
  let cleanMessage = error.message;
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const errorSources = [];
  const fieldMatch = cleanMessage.match(/Argument `(\w+)`/i);
  const fieldName = fieldMatch ? fieldMatch[1] : "Unknown Field";
  const mainMessage = lines.find(
    (line) => !line.includes("Argument") && !line.includes("\u2192") && line.length > 10
  ) || lines[0] || "Invalid query parameters provided to the database operation.";
  errorSources.push({
    path: fieldName,
    message: mainMessage
  });
  return {
    success: false,
    statusCode: status.BAD_REQUEST,
    message: `Prisma Client Validation Error: ${mainMessage}`,
    errorSources
  };
};
var handlerPrismaClientInitializationError = (error) => {
  const statusCode = error.errorCode ? getStatusCodeFromPrismaError(error.errorCode) : status.SERVICE_UNAVAILABLE;
  const cleanMessage = error.message;
  cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const mainMessage = lines[0] || "An error occurred while initializing the Prisma Client.";
  const errorSources = [
    {
      path: error.errorCode || "Initialization Error",
      message: mainMessage
    }
  ];
  return {
    success: false,
    statusCode,
    message: `Prisma Client Initialization Error: ${mainMessage}`,
    errorSources
  };
};
var handlerPrismaClientRustPanicError = () => {
  const errorSources = [{
    path: "Rust Engine Crashed",
    message: "The database engine encountered a fatal error and crashed. This is usually due to an internal bug in the Prisma engine or an unexpected edge case in the database operation. Please check the Prisma logs for more details and consider reporting this issue to the Prisma team if it persists."
  }];
  return {
    success: false,
    statusCode: status.INTERNAL_SERVER_ERROR,
    message: "Prisma Client Rust Panic Error: The database engine crashed due to a fatal error.",
    errorSources
  };
};

// src/errorHelpers/handleZodError.ts
import status2 from "http-status";
var handleZodError = (err) => {
  const statusCode = status2.BAD_REQUEST;
  const message = "Zod Validation error";
  const errorSource = [];
  err.issues.forEach((issue) => {
    errorSource.push({
      path: issue.path.join(".") || "unknown",
      message: issue.message
    });
  });
  return {
    success: false,
    message,
    errorSources: errorSource,
    statusCode
  };
};

// src/middleware/globalErrorHandler.ts
var globalErrorHandler = async (err, req, res, next) => {
  if (envVars.NODE_ENV === "development") {
    if (err instanceof AppError_default && err.statusCode < 500) {
      console.warn(`[Handled AppError ${err.statusCode}] ${req.method} ${req.originalUrl} -> ${err.message}`);
    } else {
      console.error("Error from Global Error Handler", err);
    }
  }
  let errorSources = [];
  let statusCode = status3.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  let stack = void 0;
  if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    const simplifiedError = handlePrismaClientKnownRequestError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    const simplifiedError = handlePrismaClientUnknownError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    const simplifiedError = handlePrismaClientValidationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientRustPanicError) {
    const simplifiedError = handlerPrismaClientRustPanicError();
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    const simplifiedError = handlerPrismaClientInitializationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof z.ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof AppError_default) {
    statusCode = err.statusCode;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: "",
        message: err.message
      }
    ];
  } else if (err instanceof Error) {
    statusCode = status3.INTERNAL_SERVER_ERROR;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: "",
        message: err.message
      }
    ];
  }
  const errorResponse = {
    success: false,
    message,
    errorSources,
    error: envVars.NODE_ENV === "development" ? err : void 0,
    stack: envVars.NODE_ENV === "development" ? stack : void 0
  };
  res.status(statusCode).json(errorResponse);
};

// src/middleware/notFound.ts
import status4 from "http-status";
var notFound = (req, res) => {
  res.status(status4.NOT_FOUND).json({
    success: false,
    message: `Route ${req.originalUrl} Not Found `
  });
};

// src/app.ts
var app = express();
app.set("views", path.join(process.cwd(), "src", "templates"));
app.set("view engine", "ejs");
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/demo", express.static(path.join(process.cwd(), "public")));
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  PaymentController.handleStripeWebhookEvent
);
app.use(
  cors({
    origin: [envVars.FRONTEND_URL, envVars.BETTER_AUTH_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", toNodeHandler(auth));
app.get("/", (req, res) => {
  res.send("ConsultEdge Backend Running Successfully!");
});
if (envVars.NODE_ENV === "production") {
  cron.schedule("*/25 * * * *", async () => {
    try {
      console.log("Running cron job: cancel unpaid consultations");
      await consultationService.cancelUnpaidConsultations();
    } catch (error) {
      console.error(
        "Error occurred while canceling unpaid consultations:",
        error.message
      );
    }
  });
}
app.use("/auth", authRoutes);
app.use("/api/v1", indexRoutes);
app.use(globalErrorHandler);
app.use(notFound);
var app_default = app;

// src/server.ts
import { createServer } from "http";
import { Server } from "socket.io";

// src/utilis/seed.ts
var seedAdmin = async () => {
  try {
    const isAdminExists = await prisma.user.findFirst({
      where: {
        role: Role.ADMIN
      }
    });
    if (isAdminExists) {
      console.log(" admin already exists");
      return;
    }
    const adminUser = await auth.api.signUpEmail({
      body: {
        email: envVars.ADMIN_EMAIL,
        password: envVars.ADMIN_PASSWORD,
        name: "Admin Saheb",
        role: Role.ADMIN,
        rememberMe: false
      }
    });
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: {
          id: adminUser.user.id
        },
        data: {
          emailVerified: true
        }
      });
      await tx.admin.create({
        data: {
          userId: adminUser.user.id,
          name: " Admin Saheb",
          email: envVars.ADMIN_EMAIL
        }
      });
    });
    const admin = await prisma.admin.findFirst({
      where: {
        email: envVars.ADMIN_EMAIL
      },
      include: {
        user: true
      }
    });
    console.log(" admin created", admin);
  } catch (error) {
    console.error("Error sending  admin", error);
    await prisma.user.delete({
      where: {
        email: envVars.ADMIN_EMAIL
      }
    });
  }
};

// src/modules/chat/chat.socket.ts
var upsertPresence = async (userId, isOnline) => {
  await prisma.userPresence.upsert({
    where: { userId },
    create: {
      userId,
      isOnline,
      lastSeen: /* @__PURE__ */ new Date()
    },
    update: {
      isOnline,
      lastSeen: /* @__PURE__ */ new Date()
    }
  });
};
var registerChatSocket = (io) => {
  io.on("connection", async (socket) => {
    const auth2 = socket.handshake.auth ?? {};
    const userId = auth2.userId;
    const role = auth2.role;
    if (!userId || !role) {
      socket.disconnect(true);
      return;
    }
    socket.join(`user:${userId}`);
    await upsertPresence(userId, true);
    io.emit("presence_update", { userId, isOnline: true });
    socket.on("join_room", async (roomId) => {
      socket.join(roomId);
    });
    socket.on("send_message", async (payload) => {
      try {
        let message;
        if (payload.type === MessageType.FILE) {
          if (!payload.attachment) return;
          message = await chatService.createFileMessage(
            payload.roomId,
            userId,
            role,
            payload.attachment
          );
        } else {
          message = await chatService.createTextMessage(
            payload.roomId,
            userId,
            role,
            payload.text ?? ""
          );
        }
        const targets = await chatService.getRoomRealtimeTargets(payload.roomId, role);
        io.to(payload.roomId).emit("receive_message", message);
        if (targets.recipientUserId) {
          io.to(`user:${targets.recipientUserId}`).emit("receive_message", message);
        }
      } catch (error) {
        socket.emit("chat_error", {
          message: error instanceof Error ? error.message : "Failed to send message"
        });
      }
    });
    socket.on("typing", async (payload) => {
      await prisma.typingState.upsert({
        where: {
          roomId_userId: {
            roomId: payload.roomId,
            userId
          }
        },
        create: {
          roomId: payload.roomId,
          userId,
          isTyping: payload.isTyping
        },
        update: {
          isTyping: payload.isTyping
        }
      });
      socket.to(payload.roomId).emit("typing", {
        roomId: payload.roomId,
        userId,
        isTyping: payload.isTyping
      });
    });
    socket.on("start_call", async (payload) => {
      try {
        const call = await chatService.createCall(payload.roomId, userId, role);
        const targets = await chatService.getRoomRealtimeTargets(payload.roomId, role);
        io.to(payload.roomId).emit("call_started", call);
        if (targets.recipientUserId) {
          io.to(`user:${targets.recipientUserId}`).emit("call_started", call);
        }
      } catch (error) {
        socket.emit("chat_error", {
          message: error instanceof Error ? error.message : "Failed to start call"
        });
      }
    });
    socket.on("signal", (payload) => {
      socket.to(payload.roomId).emit("signal", {
        userId,
        signalData: payload.signalData
      });
    });
    socket.on("end_call", async (payload) => {
      try {
        const call = await chatService.endCall(payload.callId);
        const targets = await chatService.getRoomRealtimeTargets(payload.roomId);
        io.to(payload.roomId).emit("call_ended", call);
        io.to(`user:${targets.clientUserId}`).emit("call_ended", call);
        io.to(`user:${targets.expertUserId}`).emit("call_ended", call);
      } catch (error) {
        socket.emit("chat_error", {
          message: error instanceof Error ? error.message : "Failed to end call"
        });
      }
    });
    socket.on("disconnect", async () => {
      await upsertPresence(userId, false);
      io.emit("presence_update", { userId, isOnline: false });
    });
  });
};

// src/lib/chatWs.ts
import { WebSocketServer, WebSocket } from "ws";
var safeSend = (ws, payload) => {
  if (ws.readyState !== WebSocket.OPEN) {
    return;
  }
  ws.send(JSON.stringify(payload));
};
var parseCookies = (cookieHeader) => {
  if (!cookieHeader) {
    return {};
  }
  return cookieHeader.split(";").map((item) => item.trim()).filter(Boolean).reduce((acc, item) => {
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
var getBearerToken = (authorizationHeader) => {
  if (!authorizationHeader?.startsWith("Bearer ")) {
    return null;
  }
  const token = authorizationHeader.slice(7).trim();
  return token || null;
};
var resolveSocketIdentity = async (req) => {
  const url = new URL(req.url ?? "", "http://localhost");
  const cookies = parseCookies(req.headers.cookie);
  const authorization = Array.isArray(req.headers.authorization) ? req.headers.authorization[0] : req.headers.authorization;
  const tokenFromQuery = url.searchParams.get("token")?.trim() || url.searchParams.get("accessToken")?.trim() || null;
  const tokenFromCookie = cookies.accessToken || null;
  const tokenFromBearer = getBearerToken(authorization);
  const accessToken = tokenFromCookie || tokenFromBearer || tokenFromQuery;
  if (accessToken) {
    const verified = jwtUtils.verifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET);
    if (verified.success && verified.data?.userId) {
      const user2 = await prisma.user.findUnique({
        where: { id: String(verified.data.userId) }
      });
      if (user2 && !user2.isDeleted && user2.status !== UserStatus.BLOCKED && user2.status !== UserStatus.DELETED) {
        return {
          userId: user2.id,
          role: user2.role
        };
      }
    }
  }
  const sessionCookie = cookies["better-auth.session_token"] || cookies["__Secure-better-auth.session_token"] || null;
  if (!sessionCookie && !authorization) {
    return null;
  }
  const fallbackCookieHeader = [
    sessionCookie ? `better-auth.session_token=${sessionCookie}` : "",
    sessionCookie ? `__Secure-better-auth.session_token=${sessionCookie}` : ""
  ].filter(Boolean).join("; ");
  const session = await auth.api.getSession({
    headers: {
      ...fallbackCookieHeader ? { cookie: fallbackCookieHeader } : {},
      ...authorization ? { authorization } : {}
    }
  }).catch(() => null);
  const sessionUserId = session?.user?.id;
  if (!sessionUserId) {
    return null;
  }
  const user = await prisma.user.findUnique({
    where: { id: sessionUserId }
  });
  if (!user || user.isDeleted || user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED) {
    return null;
  }
  return {
    userId: user.id,
    role: user.role
  };
};
var upsertPresence2 = async (userId, isOnline) => {
  await prisma.userPresence.upsert({
    where: { userId },
    create: {
      userId,
      isOnline,
      lastSeen: /* @__PURE__ */ new Date()
    },
    update: {
      isOnline,
      lastSeen: /* @__PURE__ */ new Date()
    }
  });
};
var ChatWsHub = class {
  constructor(httpServer) {
    this.socketsByUser = /* @__PURE__ */ new Map();
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
          message: "Unauthorized websocket connection"
        });
        socket.close();
        return;
      }
      socket.userId = userId;
      socket.role = role;
      socket.rooms = /* @__PURE__ */ new Set();
      const userSockets = this.socketsByUser.get(userId) ?? /* @__PURE__ */ new Set();
      userSockets.add(socket);
      this.socketsByUser.set(userId, userSockets);
      await upsertPresence2(userId, true);
      safeSend(socket, {
        type: "connected",
        userId
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
        } catch {
          safeSend(socket, {
            type: "error",
            message: "Invalid websocket message"
          });
        }
      });
      socket.on("close", async () => {
        const userSocketsSet = this.socketsByUser.get(userId);
        if (userSocketsSet) {
          userSocketsSet.delete(socket);
          if (!userSocketsSet.size) {
            this.socketsByUser.delete(userId);
            await upsertPresence2(userId, false);
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
          payload
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
        payload
      });
    }
  }
};

// src/server.ts
var bootstrap = async () => {
  try {
    await seedAdmin();
    const httpServer = createServer(app_default);
    const io = new Server(httpServer, {
      cors: {
        origin: [envVars.FRONTEND_URL, envVars.BETTER_AUTH_URL],
        credentials: true
      }
    });
    setSocketIO(io);
    const wsHub = new ChatWsHub(httpServer);
    setChatWsHub(wsHub);
    registerChatSocket(io);
    httpServer.listen(envVars.PORT, () => {
      console.log(`Server is running on http://localhost:${envVars.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};
bootstrap();
