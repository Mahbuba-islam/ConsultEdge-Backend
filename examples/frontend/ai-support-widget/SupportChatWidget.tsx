"use client";

import { useEffect, useRef } from "react";
import { useAiSupportChat } from "./useAiSupportChat";
import type { SupportContext } from "./types";

type SupportChatWidgetProps = {
  apiBaseUrl?: string;
  title?: string;
};

const quickActions: Array<{ label: string; message: string; context: SupportContext }> = [
  {
    label: "Find expert",
    message: "Help me find the right expert for my problem",
    context: "expert",
  },
  {
    label: "Book session",
    message: "How do I book a consultation?",
    context: "booking",
  },
  {
    label: "Payment help",
    message: "I need help with payment or refund",
    context: "payment",
  },
  {
    label: "Technical issue",
    message: "I have a login or technical problem",
    context: "technical",
  },
];

export default function SupportChatWidget({
  apiBaseUrl,
  title = "ConsultEdge AI Support",
}: SupportChatWidgetProps) {
  const {
    isOpen,
    setIsOpen,
    isLoading,
    input,
    setInput,
    messages,
    sendMessage,
  } = useAiSupportChat({ apiBaseUrl });

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <>
      <button
        type="button"
        aria-label="Open AI support"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 z-[1000] flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-2xl text-white shadow-2xl ring-4 ring-blue-400/30 transition hover:scale-105"
      >
        💬
      </button>

      {isOpen ? (
        <div className="fixed bottom-24 right-5 z-[1000] flex h-[38rem] w-[24rem] max-w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-3xl border border-slate-200/10 bg-slate-950/95 text-slate-50 shadow-2xl backdrop-blur-xl">
          <div className="border-b border-white/10 bg-gradient-to-r from-blue-600/20 to-violet-600/20 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold">{title}</h3>
                <p className="mt-1 text-xs text-slate-300">
                  Ask about experts, booking, payment, or account help
                </p>
              </div>
              <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2 py-1 text-[11px] text-emerald-200">
                Online
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 border-b border-white/10 p-3">
            {quickActions.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => sendMessage(item.message, item.context)}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-100 transition hover:bg-white/10"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[86%] rounded-2xl px-3 py-2 text-sm leading-6 ${
                  message.role === "user"
                    ? "ml-auto bg-blue-600 text-white"
                    : message.role === "system"
                    ? "mx-auto max-w-full border border-emerald-400/20 bg-emerald-500/10 text-emerald-100"
                    : "bg-white/8 text-slate-100"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>

                {message.suggestedActions?.length ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {message.suggestedActions.map((action) => (
                      <button
                        key={action}
                        type="button"
                        onClick={() => sendMessage(action)}
                        className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-100 hover:bg-white/10"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}

            {isLoading ? (
              <div className="max-w-[86%] rounded-2xl bg-white/8 px-3 py-2 text-sm text-slate-200">
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-300 [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-300 [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-300" />
                </div>
              </div>
            ) : null}
          </div>

          <div className="border-t border-white/10 p-3">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void sendMessage();
                }
              }}
              placeholder="Type your question..."
              className="min-h-[84px] w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-400 focus:border-blue-400"
            />

            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="text-[11px] text-slate-400">Press Enter to send</p>
              <button
                type="button"
                disabled={isLoading || !input.trim()}
                onClick={() => void sendMessage()}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
