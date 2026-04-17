export type SupportContext =
  | "general"
  | "homepage"
  | "booking"
  | "expert"
  | "payment"
  | "technical";

export type ChatRole = "user" | "assistant" | "system";

export interface HistoryItem {
  role: "user" | "assistant";
  content: string;
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  suggestedActions?: string[];
}

export interface AiSupportResult {
  reply: string;
  suggestedActions: string[];
  escalatedToHuman: boolean;
  provider: string;
  model: string;
  timestamp: string;
}
