"use client";

import { useMemo, useState } from "react";
import type { AiSupportResult, ChatMessage, HistoryItem, SupportContext } from "./types";

type UseAiSupportChatOptions = {
  apiBaseUrl?: string;
  initialOpen?: boolean;
};

const initialAssistantMessage: ChatMessage = {
  id: "welcome-message",
  role: "assistant",
  content:
    "Hi! I’m your ConsultEdge AI assistant. I can help with finding experts, booking consultations, payments, and platform questions.",
};

const normalizeBaseUrl = (baseUrl?: string) => {
  if (!baseUrl) return "";
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
};

export const useAiSupportChat = (options: UseAiSupportChatOptions = {}) => {
  const [isOpen, setIsOpen] = useState(Boolean(options.initialOpen));
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [context, setContext] = useState<SupportContext>("homepage");
  const [messages, setMessages] = useState<ChatMessage[]>([initialAssistantMessage]);

  const endpoint = useMemo(() => {
    const baseUrl = normalizeBaseUrl(options.apiBaseUrl || process.env.NEXT_PUBLIC_API_BASE_URL);
    return `${baseUrl}/api/v1/ai/chat`;
  }, [options.apiBaseUrl]);

  const sendMessage = async (message?: string, nextContext?: SupportContext) => {
    const text = (message ?? input).trim();
    if (!text || isLoading) return;

    const activeContext = nextContext ?? context;
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
    };

    setContext(activeContext);
    setInput("");
    setIsOpen(true);
    setIsLoading(true);
    setMessages((current) => [...current, userMessage]);

    try {
      const history: HistoryItem[] = [...messages, userMessage]
        .filter((item) => item.role === "user" || item.role === "assistant")
        .slice(-8)
        .map((item) => ({
          role: item.role as "user" | "assistant",
          content: item.content,
        }));

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          context: activeContext,
          history,
        }),
      });

      const payload = await response.json();

      if (!response.ok || !payload?.data?.reply) {
        throw new Error(payload?.message || "AI support request failed");
      }

      const result = payload.data as AiSupportResult;

      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: result.reply,
          suggestedActions: result.suggestedActions || [],
        },
        ...(result.escalatedToHuman
          ? [
              {
                id: `system-${Date.now()}`,
                role: "system" as const,
                content: "This issue may need human or admin support for a full resolution.",
              },
            ]
          : []),
      ]);
    } catch (error) {
      console.error(error);
      setMessages((current) => [
        ...current,
        {
          id: `assistant-error-${Date.now()}`,
          role: "assistant",
          content:
            "Sorry — the support assistant is temporarily unavailable. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isOpen,
    setIsOpen,
    isLoading,
    input,
    setInput,
    context,
    setContext,
    messages,
    sendMessage,
  };
};
