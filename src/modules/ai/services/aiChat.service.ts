import httpStatus from "http-status";

import {
  AIChatMessageRole,
  AIMessageFeedback,
  type Prisma,
} from "../../../generated/client";
import { prisma } from "../../../lib/prisma";
import AppError from "../../../errorHelpers/AppError";
import { buildChatMessages } from "../prompts";
import { sanitizeText } from "../utils/sanitize";
import { aiProvider } from "../utils/aiProvider";
import type { AIMeta } from "./aiAdvanced.service";

const MAX_HISTORY_MESSAGES = 20;

const aiMessageSelect = {
  id: true,
  role: true,
  content: true,
  model: true,
  provider: true,
  tokensUsed: true,
  latencyMs: true,
  feedback: true,
  createdAt: true,
} satisfies Prisma.AIChatMessageSelect;

type PersistedAIMessage = Prisma.AIChatMessageGetPayload<{
  select: typeof aiMessageSelect;
}>;

const formatRole = (role: AIChatMessageRole): "user" | "assistant" | "system" => {
  if (role === AIChatMessageRole.USER) return "user";
  if (role === AIChatMessageRole.ASSISTANT) return "assistant";
  return "system";
};

const formatMessage = (message: PersistedAIMessage) => ({
  id: message.id,
  role: formatRole(message.role),
  content: message.content,
  feedback: message.feedback,
  model: message.model ?? null,
  provider: message.provider ?? null,
  tokensUsed: message.tokensUsed ?? 0,
  latencyMs: message.latencyMs ?? 0,
  createdAt: message.createdAt,
});

const buildConversationTitle = (message: string) => {
  const compact = sanitizeText(message, 160).replace(/\s+/g, " ").trim();
  if (compact.length <= 60) return compact;
  return `${compact.slice(0, 57).trimEnd()}...`;
};

const ensureConversationOwner = async (conversationId: string, userId: string) => {
  const conversation = await prisma.aIConversation.findUnique({
    where: { id: conversationId },
    select: { id: true, userId: true, title: true, createdAt: true, updatedAt: true },
  });

  if (!conversation || conversation.userId !== userId) {
    throw new AppError(httpStatus.NOT_FOUND, "AI conversation not found");
  }

  return conversation;
};

const getOrCreateConversation = async (userId: string, conversationId: string | undefined, message: string) => {
  if (conversationId) {
    return ensureConversationOwner(conversationId, userId);
  }

  return prisma.aIConversation.create({
    data: {
      userId,
      title: buildConversationTitle(message) || "New chat",
    },
    select: { id: true, userId: true, title: true, createdAt: true, updatedAt: true },
  });
};

const sendMessage = async (
  userId: string,
  input: { message: string; context?: string; conversationId?: string }
): Promise<{
  data: {
    conversation: {
      id: string;
      title: string;
      createdAt: Date;
      updatedAt: Date;
    };
    userMessage: ReturnType<typeof formatMessage>;
    assistantMessage: ReturnType<typeof formatMessage>;
  };
  meta: AIMeta;
}> => {
  const cleanMessage = sanitizeText(input.message, 4000).trim();
  const cleanContext = input.context ? sanitizeText(input.context, 500).trim() : undefined;

  if (!cleanMessage) {
    throw new AppError(httpStatus.BAD_REQUEST, "Message is required");
  }

  const conversation = await getOrCreateConversation(userId, input.conversationId, cleanMessage);
  const historyRows = await prisma.aIChatMessage.findMany({
    where: { conversationId: conversation.id },
    orderBy: { createdAt: "desc" },
    take: MAX_HISTORY_MESSAGES,
    select: aiMessageSelect,
  });

  const history = historyRows
    .reverse()
    .filter((item) => item.role !== AIChatMessageRole.SYSTEM)
    .map((item) => ({ role: formatRole(item.role), content: item.content }))
    .filter(
      (item): item is { role: "user" | "assistant"; content: string } =>
        item.role === "user" || item.role === "assistant"
    );

  const providerResult = await aiProvider.generate({
    messages: buildChatMessages({
      message: cleanMessage,
      context: cleanContext || undefined,
      history,
    }),
    temperature: 0.5,
    maxTokens: 500,
  });

  const safeReply = providerResult.text?.trim() || "I'm here to help. Could you share a bit more detail?";

  const { userMessage, assistantMessage, updatedConversation } = await prisma.$transaction(
    async (tx) => {
      const createdUserMessage = await tx.aIChatMessage.create({
        data: {
          conversationId: conversation.id,
          role: AIChatMessageRole.USER,
          content: cleanMessage,
        },
        select: aiMessageSelect,
      });

      const createdAssistantMessage = await tx.aIChatMessage.create({
        data: {
          conversationId: conversation.id,
          role: AIChatMessageRole.ASSISTANT,
          content: safeReply,
          model: providerResult.model,
          provider: providerResult.provider,
          tokensUsed: providerResult.tokensUsed,
          latencyMs: providerResult.latencyMs,
        },
        select: aiMessageSelect,
      });

      const refreshedConversation = await tx.aIConversation.update({
        where: { id: conversation.id },
        data: {
          title:
            conversation.title === "New chat" || !input.conversationId
              ? buildConversationTitle(cleanMessage) || conversation.title
              : undefined,
        },
        select: { id: true, title: true, createdAt: true, updatedAt: true },
      });

      return {
        userMessage: createdUserMessage,
        assistantMessage: createdAssistantMessage,
        updatedConversation: refreshedConversation,
      };
    }
  );

  return {
    data: {
      conversation: updatedConversation,
      userMessage: formatMessage(userMessage),
      assistantMessage: formatMessage(assistantMessage),
    },
    meta: {
      model: providerResult.model,
      provider: providerResult.provider,
      tokensUsed: providerResult.tokensUsed,
      latencyMs: providerResult.latencyMs,
    },
  };
};

const listConversations = async (userId: string) => {
  const conversations = await prisma.aIConversation.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { messages: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          id: true,
          content: true,
          role: true,
          createdAt: true,
        },
      },
    },
  });

  return conversations.map((conversation) => ({
    id: conversation.id,
    title: conversation.title,
    preview: conversation.messages[0]?.content ?? "",
    lastMessageRole: conversation.messages[0] ? formatRole(conversation.messages[0].role) : null,
    lastMessageAt: conversation.messages[0]?.createdAt ?? conversation.updatedAt,
    messageCount: conversation._count.messages,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
  }));
};

const getConversation = async (userId: string, conversationId: string) => {
  const conversation = await ensureConversationOwner(conversationId, userId);
  const messages = await prisma.aIChatMessage.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    select: aiMessageSelect,
  });

  return {
    id: conversation.id,
    title: conversation.title,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
    messages: messages.map(formatMessage),
  };
};

const updateMessageFeedback = async (
  userId: string,
  conversationId: string,
  messageId: string,
  feedback: AIMessageFeedback | null
) => {
  await ensureConversationOwner(conversationId, userId);

  const message = await prisma.aIChatMessage.findFirst({
    where: {
      id: messageId,
      conversationId,
    },
    select: aiMessageSelect,
  });

  if (!message) {
    throw new AppError(httpStatus.NOT_FOUND, "AI message not found");
  }

  if (message.role !== AIChatMessageRole.ASSISTANT) {
    throw new AppError(httpStatus.BAD_REQUEST, "Only assistant messages can be rated");
  }

  const updated = await prisma.aIChatMessage.update({
    where: { id: messageId },
    data: { feedback },
    select: aiMessageSelect,
  });

  return formatMessage(updated);
};

export const aiChatService = {
  sendMessage,
  listConversations,
  getConversation,
  updateMessageFeedback,
};