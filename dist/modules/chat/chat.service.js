import httpStatus from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { CallStatus, MessageType, Role, UserRole, } from "../../generated/client";
const reactionUserSelect = {
    id: true,
    name: true,
    email: true,
    image: true,
};
const messageReactionInclude = {
    user: {
        select: reactionUserSelect,
    },
};
const roomInclude = {
    client: {
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    image: true,
                },
            },
        },
    },
    expert: {
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    image: true,
                },
            },
        },
    },
    consultation: true,
    messages: {
        take: 1,
        orderBy: { createdAt: "desc" },
        include: {
            attachment: true,
            reactions: {
                include: messageReactionInclude,
            },
        },
    },
};
const messageInclude = {
    attachment: true,
    reactions: {
        include: messageReactionInclude,
    },
};
const mapRoleToUserRole = (role) => {
    if (role === Role.CLIENT)
        return UserRole.CLIENT;
    if (role === Role.EXPERT)
        return UserRole.EXPERT;
    return UserRole.ADMIN;
};
const getCurrentClientByUserId = async (userId) => {
    const client = await prisma.client.findUnique({
        where: { userId },
        select: { id: true, userId: true, isDeleted: true },
    });
    if (!client || client.isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, "Client profile not found");
    }
    return client;
};
const getCurrentExpertByUserId = async (userId) => {
    const expert = await prisma.expert.findUnique({
        where: { userId },
        select: { id: true, userId: true, isDeleted: true },
    });
    if (!expert || expert.isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, "Expert profile not found");
    }
    return expert;
};
const upsertRoomForParticipants = async (clientId, expertId, consultationId) => {
    return prisma.chatRoom.upsert({
        where: {
            clientId_expertId: {
                clientId,
                expertId,
            },
        },
        update: consultationId ? { consultationId } : {},
        create: {
            clientId,
            expertId,
            ...(consultationId ? { consultationId } : {}),
        },
        include: roomInclude,
    });
};
const resolveRoomFromConsultation = async (roomIdentifier, userId, role) => {
    const consultation = await prisma.consultation.findFirst({
        where: {
            id: roomIdentifier,
            ...(role === Role.CLIENT ? { client: { userId } } : {}),
            ...(role === Role.EXPERT ? { expert: { userId } } : {}),
        },
        select: {
            id: true,
            clientId: true,
            expertId: true,
        },
    });
    if (!consultation?.expertId) {
        return null;
    }
    return upsertRoomForParticipants(consultation.clientId, consultation.expertId, consultation.id);
};
const resolveRoomByIdentifier = async (roomIdentifier, userId, role) => {
    const consultationRoom = await resolveRoomFromConsultation(roomIdentifier, userId, role);
    if (consultationRoom) {
        return consultationRoom;
    }
    if (role === Role.ADMIN) {
        return null;
    }
    if (role === Role.CLIENT) {
        const client = await getCurrentClientByUserId(userId);
        const expert = await prisma.expert.findFirst({
            where: {
                isDeleted: false,
                OR: [{ id: roomIdentifier }, { userId: roomIdentifier }],
            },
            select: { id: true },
        });
        if (!expert) {
            return null;
        }
        return upsertRoomForParticipants(client.id, expert.id);
    }
    const expert = await getCurrentExpertByUserId(userId);
    const client = await prisma.client.findFirst({
        where: {
            isDeleted: false,
            OR: [{ id: roomIdentifier }, { userId: roomIdentifier }],
        },
        select: { id: true },
    });
    if (!client) {
        return null;
    }
    return upsertRoomForParticipants(client.id, expert.id);
};
const getLatestRoomForUser = async (userId, role) => {
    if (role === Role.ADMIN) {
        return null;
    }
    if (role === Role.CLIENT) {
        const client = await getCurrentClientByUserId(userId);
        return prisma.chatRoom.findFirst({
            where: { clientId: client.id },
            include: roomInclude,
            orderBy: { updatedAt: "desc" },
        });
    }
    const expert = await getCurrentExpertByUserId(userId);
    return prisma.chatRoom.findFirst({
        where: { expertId: expert.id },
        include: roomInclude,
        orderBy: { updatedAt: "desc" },
    });
};
const getRoomWithParticipants = async (roomId, userId, role) => {
    let room = await prisma.chatRoom.findUnique({
        where: { id: roomId },
        include: roomInclude,
    });
    if (!room) {
        room = await prisma.chatRoom.findFirst({
            where: { consultationId: roomId },
            include: roomInclude,
            orderBy: { updatedAt: "desc" },
        });
    }
    if (!room && userId && role) {
        room = await resolveRoomByIdentifier(roomId, userId, role);
    }
    if (!room && userId && role) {
        // Handle stale room identifiers by falling back to the latest room
        // accessible by the current user.
        room = await getLatestRoomForUser(userId, role);
    }
    if (!room) {
        throw new AppError(httpStatus.NOT_FOUND, "Chat room not found");
    }
    return room;
};
const getPresenceLookup = async (userIds) => {
    const presences = await prisma.userPresence.findMany({
        where: {
            userId: { in: userIds },
        },
    });
    return new Map(presences.map((presence) => [presence.userId, presence]));
};
const buildParticipants = async (room) => {
    const presenceLookup = await getPresenceLookup([room.client.userId, room.expert.userId]);
    return [
        {
            id: room.client.id,
            userId: room.client.userId,
            role: UserRole.CLIENT,
            fullName: room.client.fullName,
            name: room.client.user?.name ?? room.client.fullName,
            email: room.client.email ?? room.client.user?.email,
            profilePhoto: room.client.profilePhoto ?? room.client.user?.image ?? null,
            avatarUrl: room.client.profilePhoto ?? room.client.user?.image ?? null,
            isOnline: presenceLookup.get(room.client.userId)?.isOnline ?? false,
            lastSeen: presenceLookup.get(room.client.userId)?.lastSeen ?? null,
        },
        {
            id: room.expert.id,
            userId: room.expert.userId,
            role: UserRole.EXPERT,
            fullName: room.expert.fullName,
            name: room.expert.user?.name ?? room.expert.fullName,
            title: room.expert.title,
            email: room.expert.email ?? room.expert.user?.email,
            profilePhoto: room.expert.profilePhoto ?? room.expert.user?.image ?? null,
            avatarUrl: room.expert.profilePhoto ?? room.expert.user?.image ?? null,
            isOnline: presenceLookup.get(room.expert.userId)?.isOnline ?? false,
            lastSeen: presenceLookup.get(room.expert.userId)?.lastSeen ?? null,
        },
    ];
};
const formatAttachment = (attachment) => {
    if (!attachment) {
        return null;
    }
    return {
        ...attachment,
        url: attachment.fileUrl,
        mimeType: attachment.fileType,
        size: attachment.fileSize,
    };
};
const formatReactions = (reactions, currentUserId) => {
    const grouped = new Map();
    for (const reaction of reactions) {
        const existing = grouped.get(reaction.emoji);
        if (existing) {
            existing.count += 1;
            existing.reactedByCurrentUser || (existing.reactedByCurrentUser = reaction.userId === currentUserId);
            existing.users.push({
                userId: reaction.userId,
                name: reaction.user.name,
                email: reaction.user.email,
                image: reaction.user.image,
            });
            continue;
        }
        grouped.set(reaction.emoji, {
            emoji: reaction.emoji,
            count: 1,
            reactedByCurrentUser: reaction.userId === currentUserId,
            users: [
                {
                    userId: reaction.userId,
                    name: reaction.user.name,
                    email: reaction.user.email,
                    image: reaction.user.image,
                },
            ],
        });
    }
    return Array.from(grouped.values());
};
const formatMessage = (message, participants = [], currentUserId) => ({
    ...message,
    sender: participants.find((participant) => participant.userId === message.senderId || participant.id === message.senderId) ?? null,
    attachment: formatAttachment(message.attachment),
    reactions: formatReactions(message.reactions, currentUserId),
});
const formatRoom = async (room, currentUserId) => {
    const participants = await buildParticipants(room);
    const latestMessage = room.messages[0]
        ? formatMessage(room.messages[0], participants, currentUserId)
        : null;
    return {
        ...room,
        participants,
        lastMessage: latestMessage,
        unreadCount: 0,
    };
};
const ensureRoomAccess = async (roomId, userId, role) => {
    const room = await getRoomWithParticipants(roomId, userId, role);
    if (role === Role.ADMIN)
        return room;
    const allowedUserId = role === Role.CLIENT ? room.client.userId : room.expert.userId;
    if (allowedUserId !== userId) {
        throw new AppError(httpStatus.FORBIDDEN, "Forbidden access to this chat room");
    }
    return room;
};
const getRecipientUserIdForRoom = (room, senderRole) => (senderRole === Role.CLIENT ? room.expert.userId : room.client.userId);
const getRoomRealtimeTargets = async (roomId, senderRole, userId) => {
    const room = await getRoomWithParticipants(roomId, userId, senderRole);
    return {
        roomId: room.id,
        clientUserId: room.client.userId,
        expertUserId: room.expert.userId,
        recipientUserId: senderRole ? getRecipientUserIdForRoom(room, senderRole) : null,
    };
};
const getMessageForRoom = async (roomId, messageId) => {
    const message = await prisma.message.findFirst({
        where: { id: messageId, roomId },
        include: messageInclude,
    });
    if (!message) {
        throw new AppError(httpStatus.NOT_FOUND, "Message not found");
    }
    return message;
};
const notifyRecipient = async (roomId, senderId, senderRole, previewText, options) => {
    const room = await getRoomWithParticipants(roomId);
    const recipientUserId = getRecipientUserIdForRoom(room, senderRole);
    if (!recipientUserId || recipientUserId === senderId) {
        return;
    }
    const recipientPresence = await prisma.userPresence.findUnique({
        where: { userId: recipientUserId },
    });
    if (!options?.always && recipientPresence?.isOnline) {
        return;
    }
    await prisma.notification.create({
        data: {
            type: options?.type ?? "CHAT_MESSAGE",
            message: previewText,
            userId: recipientUserId,
        },
    });
};
const getUserRooms = async (userId, role, expertId) => {
    if (role === Role.ADMIN) {
        const rooms = await prisma.chatRoom.findMany({
            where: expertId ? { expertId } : undefined,
            include: roomInclude,
            orderBy: { updatedAt: "desc" },
        });
        return Promise.all(rooms.map((room) => formatRoom(room, userId)));
    }
    if (role === Role.CLIENT) {
        const client = await getCurrentClientByUserId(userId);
        const rooms = await prisma.chatRoom.findMany({
            where: { clientId: client.id, ...(expertId ? { expertId } : {}) },
            include: roomInclude,
            orderBy: { updatedAt: "desc" },
        });
        return Promise.all(rooms.map((room) => formatRoom(room, userId)));
    }
    const expert = await getCurrentExpertByUserId(userId);
    const rooms = await prisma.chatRoom.findMany({
        where: { expertId: expert.id },
        include: roomInclude,
        orderBy: { updatedAt: "desc" },
    });
    return Promise.all(rooms.map((room) => formatRoom(room, userId)));
};
const createOrGetRoom = async (userId, role, participantIdentifier) => {
    if (!participantIdentifier) {
        throw new AppError(httpStatus.BAD_REQUEST, "Participant identifier is required");
    }
    if (role === Role.ADMIN) {
        throw new AppError(httpStatus.FORBIDDEN, "Admins cannot create chat rooms directly");
    }
    const room = await resolveRoomByIdentifier(participantIdentifier, userId, role);
    if (!room) {
        throw new AppError(httpStatus.NOT_FOUND, role === Role.CLIENT ? "Expert not found" : "Client not found");
    }
    return formatRoom(room, userId);
};
const getRoomMessages = async (roomId, userId, role) => {
    const room = await ensureRoomAccess(roomId, userId, role);
    const participants = await buildParticipants(room);
    const messages = await prisma.message.findMany({
        where: { roomId: room.id },
        include: messageInclude,
        orderBy: { createdAt: "asc" },
    });
    return {
        roomId: room.id,
        resolvedFromStaleId: room.id !== roomId,
        messages: messages.map((message) => formatMessage(message, participants, userId)),
    };
};
const updateRoomTimestamp = async (roomId) => {
    return prisma.chatRoom.update({
        where: { id: roomId },
        data: { updatedAt: new Date() },
    });
};
const createTextMessage = async (roomId, senderId, senderRole, text) => {
    if (!text?.trim()) {
        throw new AppError(httpStatus.BAD_REQUEST, "Message text is required");
    }
    const room = await ensureRoomAccess(roomId, senderId, senderRole);
    const message = await prisma.message.create({
        data: {
            roomId: room.id,
            senderId,
            senderRole: mapRoleToUserRole(senderRole),
            type: MessageType.TEXT,
            text: text.trim(),
        },
        include: messageInclude,
    });
    await updateRoomTimestamp(room.id);
    await notifyRecipient(room.id, senderId, senderRole, "You have a new chat message.");
    const participants = await buildParticipants(room);
    return {
        roomId: room.id,
        resolvedFromStaleId: room.id !== roomId,
        message: formatMessage(message, participants, senderId),
    };
};
const createFileMessage = async (roomId, senderId, senderRole, attachmentData) => {
    const room = await ensureRoomAccess(roomId, senderId, senderRole);
    const message = await prisma.message.create({
        data: {
            roomId: room.id,
            senderId,
            senderRole: mapRoleToUserRole(senderRole),
            type: MessageType.FILE,
            text: attachmentData.fileName,
            attachment: {
                create: {
                    fileUrl: attachmentData.fileUrl,
                    fileName: attachmentData.fileName,
                    fileType: attachmentData.fileType,
                    fileSize: attachmentData.fileSize,
                },
            },
        },
        include: messageInclude,
    });
    await updateRoomTimestamp(room.id);
    await notifyRecipient(room.id, senderId, senderRole, "You received a file in chat.");
    const participants = await buildParticipants(room);
    return {
        roomId: room.id,
        resolvedFromStaleId: room.id !== roomId,
        message: formatMessage(message, participants, senderId),
    };
};
const toggleMessageReaction = async (roomId, messageId, userId, role, emoji) => {
    const normalizedEmoji = emoji.trim();
    if (!normalizedEmoji) {
        throw new AppError(httpStatus.BAD_REQUEST, "Emoji is required");
    }
    if (normalizedEmoji.length > 32) {
        throw new AppError(httpStatus.BAD_REQUEST, "Emoji is too long");
    }
    const room = await ensureRoomAccess(roomId, userId, role);
    const message = await getMessageForRoom(room.id, messageId);
    const existingReaction = await prisma.messageReaction.findUnique({
        where: {
            messageId_userId_emoji: {
                messageId: message.id,
                userId,
                emoji: normalizedEmoji,
            },
        },
    });
    if (existingReaction) {
        await prisma.messageReaction.delete({
            where: { id: existingReaction.id },
        });
    }
    else {
        await prisma.messageReaction.create({
            data: {
                messageId: message.id,
                userId,
                emoji: normalizedEmoji,
            },
        });
    }
    const updatedMessage = await getMessageForRoom(room.id, message.id);
    const participants = await buildParticipants(room);
    return {
        roomId: room.id,
        resolvedFromStaleId: room.id !== roomId,
        messageId: message.id,
        emoji: normalizedEmoji,
        action: existingReaction ? "removed" : "added",
        reactions: formatReactions(updatedMessage.reactions, userId),
        message: formatMessage(updatedMessage, participants, userId),
    };
};
const createCall = async (roomId, userId, role) => {
    const room = await ensureRoomAccess(roomId, userId, role);
    const call = await prisma.call.create({
        data: {
            roomId: room.id,
            status: CallStatus.ACTIVE,
            startedAt: new Date(),
            participants: {
                create: {
                    userId,
                    role: mapRoleToUserRole(role),
                    joinedAt: new Date(),
                },
            },
        },
        include: { participants: true },
    });
    await updateRoomTimestamp(room.id);
    await notifyRecipient(room.id, userId, role, "You have an incoming chat call.", {
        type: "CHAT_CALL",
        always: true,
    });
    return call;
};
const endCall = async (callId) => {
    const existing = await prisma.call.findUnique({ where: { id: callId } });
    if (!existing) {
        throw new AppError(httpStatus.NOT_FOUND, "Call not found");
    }
    if (existing.status === CallStatus.ENDED) {
        return existing;
    }
    await prisma.callParticipant.updateMany({
        where: { callId, leftAt: null },
        data: { leftAt: new Date() },
    });
    return prisma.call.update({
        where: { id: callId },
        data: {
            status: CallStatus.ENDED,
            endedAt: new Date(),
        },
        include: { participants: true },
    });
};
const updateCallStatus = async (callId, statusValue) => {
    if (statusValue === CallStatus.ENDED) {
        return endCall(callId);
    }
    return prisma.call.update({
        where: { id: callId },
        data: {
            status: statusValue,
            startedAt: statusValue === CallStatus.ACTIVE ? new Date() : undefined,
        },
        include: { participants: true },
    });
};
const deleteMessage = async (roomId, messageId, userId, role) => {
    // Ensure user has access to the room
    await ensureRoomAccess(roomId, userId, role);
    // Delete the message
    const deleted = await prisma.message.delete({
        where: { id: messageId },
    });
    return deleted;
};
export const chatService = {
    getUserRooms,
    createOrGetRoom,
    getRoomMessages,
    createTextMessage,
    createFileMessage,
    toggleMessageReaction,
    updateRoomTimestamp,
    createCall,
    endCall,
    updateCallStatus,
    getRoomRealtimeTargets,
    deleteMessage,
};
//# sourceMappingURL=chat.service.js.map