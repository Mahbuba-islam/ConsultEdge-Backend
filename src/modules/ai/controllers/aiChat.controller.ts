import type { Request, Response } from "express";
import httpStatus from "http-status";

import { AIMessageFeedback } from "../../../generated/client";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponsr";
import { sendAIResponse } from "../utils/response";
import { sanitizeObject, sanitizeText } from "../utils/sanitize";
import { aiChatService } from "../services/aiChat.service";

const sendMessage = catchAsync(async (req: Request, res: Response) => {
  const payload = sanitizeObject(req.body) as {
    message: string;
    context?: string;
    conversationId?: string;
  };

  const { data, meta } = await aiChatService.sendMessage(req.user.userId, {
    message: sanitizeText(payload.message, 4000),
    context: payload.context ? sanitizeText(payload.context, 500) : undefined,
    conversationId: payload.conversationId,
  });

  sendAIResponse(res, data, meta, httpStatus.CREATED);
});

const listConversations = catchAsync(async (req: Request, res: Response) => {
  const data = await aiChatService.listConversations(req.user.userId);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "AI conversations fetched successfully",
    data,
  });
});

const getConversation = catchAsync(async (req: Request, res: Response) => {
  const data = await aiChatService.getConversation(
    req.user.userId,
    String(req.params.conversationId)
  );

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "AI conversation fetched successfully",
    data,
  });
});

const updateMessageFeedback = catchAsync(async (req: Request, res: Response) => {
  const payload = sanitizeObject(req.body) as { feedback: AIMessageFeedback | null };
  const data = await aiChatService.updateMessageFeedback(
    req.user.userId,
    String(req.params.conversationId),
    String(req.params.messageId),
    payload.feedback ?? null
  );

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "AI message feedback updated successfully",
    data,
  });
});

export const aiChatController = {
  sendMessage,
  listConversations,
  getConversation,
  updateMessageFeedback,
};