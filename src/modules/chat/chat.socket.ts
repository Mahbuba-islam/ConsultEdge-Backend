import { Server, type Socket } from "socket.io";

import { Role, MessageType, type CallStatus } from "../../generated/client";
import { prisma } from "../../lib/prisma";
import { chatService } from "./chat.service";

type SocketAuth = {
  userId?: string;
  role?: Role;
};

type SendMessagePayload = {
  roomId: string;
  text?: string;
  type?: MessageType;
  attachment?: {
    fileUrl: string;
    fileName: string;
    fileType: string;
    fileSize: number;
  };
};

type ToggleReactionPayload = {
  roomId: string;
  messageId: string;
  emoji: string;
};

const upsertPresence = async (userId: string, isOnline: boolean) => {
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

export const registerChatSocket = (io: Server) => {
  io.on("connection", async (socket: Socket) => {
    const auth = (socket.handshake.auth ?? {}) as SocketAuth;
    const userId = auth.userId;
    const role = auth.role;

    if (!userId || !role) {
      socket.disconnect(true);
      return;
    }

    socket.join(`user:${userId}`);

    await upsertPresence(userId, true);
    io.emit("presence_update", { userId, isOnline: true });

    socket.on("join_room", async (roomId: string) => {
      socket.join(roomId);
    });

    socket.on("send_message", async (payload: SendMessagePayload) => {
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
          message: error instanceof Error ? error.message : "Failed to send message",
        });
      }
    });

    socket.on("typing", async (payload: { roomId: string; isTyping: boolean }) => {
      await prisma.typingState.upsert({
        where: {
          roomId_userId: {
            roomId: payload.roomId,
            userId,
          },
        },
        create: {
          roomId: payload.roomId,
          userId,
          isTyping: payload.isTyping,
        },
        update: {
          isTyping: payload.isTyping,
        },
      });

      socket.to(payload.roomId).emit("typing", {
        roomId: payload.roomId,
        userId,
        isTyping: payload.isTyping,
      });
    });

    socket.on("toggle_reaction", async (payload: ToggleReactionPayload) => {
      try {
        const reactionUpdate = await chatService.toggleMessageReaction(
          payload.roomId,
          payload.messageId,
          userId,
          role,
          payload.emoji
        );

        const targets = await chatService.getRoomRealtimeTargets(
          reactionUpdate.roomId,
          role,
          userId
        );

        io.to(reactionUpdate.roomId).emit(
          "message_reaction_updated",
          reactionUpdate
        );

        if (targets.recipientUserId) {
          io.to(`user:${targets.recipientUserId}`).emit(
            "message_reaction_updated",
            reactionUpdate
          );
        }
      } catch (error) {
        socket.emit("chat_error", {
          message: error instanceof Error ? error.message : "Failed to update reaction",
        });
      }
    });

    socket.on("start_call", async (payload: { roomId: string }) => {
      try {
        const call = await chatService.createCall(payload.roomId, userId, role);
        const targets = await chatService.getRoomRealtimeTargets(payload.roomId, role);
        io.to(payload.roomId).emit("call_started", call);
        if (targets.recipientUserId) {
          io.to(`user:${targets.recipientUserId}`).emit("call_started", call);
        }
      } catch (error) {
        socket.emit("chat_error", {
          message: error instanceof Error ? error.message : "Failed to start call",
        });
      }
    });

    socket.on("signal", (payload: { roomId: string; signalData: unknown }) => {
      socket.to(payload.roomId).emit("signal", {
        userId,
        signalData: payload.signalData,
      });
    });

    socket.on("end_call", async (payload: { callId: string; roomId: string }) => {
      try {
        const call = await chatService.endCall(payload.callId);
        const targets = await chatService.getRoomRealtimeTargets(payload.roomId);
        io.to(payload.roomId).emit("call_ended", call);
        io.to(`user:${targets.clientUserId}`).emit("call_ended", call);
        io.to(`user:${targets.expertUserId}`).emit("call_ended", call);
      } catch (error) {
        socket.emit("chat_error", {
          message: error instanceof Error ? error.message : "Failed to end call",
        });
      }
    });

    socket.on("disconnect", async () => {
      await upsertPresence(userId, false);
      io.emit("presence_update", { userId, isOnline: false });
    });
  });
};
