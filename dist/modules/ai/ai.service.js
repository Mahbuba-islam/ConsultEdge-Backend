import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";
const SYSTEM_PROMPT = `You are ConsultEdge AI Support for a consultation booking platform.
Your job is to help website visitors with expert discovery, consultation booking, schedules, payments, and account guidance.
Rules:
- Be concise, clear, and friendly.
- Prefer practical next steps.
- If the issue involves refunds, billing disputes, legal issues, or account security, recommend admin/human support.
- Do not invent pricing, policies, or expert availability.
- Keep responses short enough for a homepage support widget.`;
const bookingKeywords = ["book", "booking", "appointment", "consultation", "schedule", "slot"];
const paymentKeywords = ["pay", "payment", "checkout", "card", "refund", "invoice", "billing"];
const expertKeywords = ["expert", "mentor", "consultant", "specialist", "advisor"];
const technicalKeywords = ["bug", "error", "issue", "login", "otp", "password", "not working"];
const escalationKeywords = [
    "human",
    "admin",
    "agent",
    "refund",
    "charged twice",
    "billing issue",
    "legal",
    "complaint",
    "security",
    "hack",
    "urgent",
];
const includesAny = (text, keywords) => keywords.some((keyword) => text.includes(keyword));
const buildSuggestedActions = (message, context) => {
    const normalized = message.toLowerCase();
    if (context === "payment" || includesAny(normalized, paymentKeywords)) {
        return [
            "Check your payment or booking status in the dashboard",
            "Retry with a valid payment method if checkout failed",
            "Contact admin support for refund or billing review",
        ];
    }
    if (context === "expert" || includesAny(normalized, expertKeywords)) {
        return [
            "Browse verified experts by industry or skill",
            "Open an expert profile to review experience and availability",
            "Start a chat or book a consultation slot",
        ];
    }
    if (context === "technical" || includesAny(normalized, technicalKeywords)) {
        return [
            "Refresh the page and sign in again",
            "Make sure your browser allows cookies for authentication",
            "If the issue continues, contact admin support",
        ];
    }
    return [
        "Browse experts from the homepage",
        "Select a suitable slot and book a consultation",
        "Use dashboard chat for direct communication after booking",
    ];
};
const buildFallbackReply = (message, context) => {
    const normalized = message.toLowerCase();
    if (context === "payment" || includesAny(normalized, paymentKeywords)) {
        return "I can help with payment guidance. Please confirm whether your issue is checkout failure, booking not appearing, or a refund request. For billing disputes or refunds, admin support should review it directly.";
    }
    if (context === "expert" || includesAny(normalized, expertKeywords)) {
        return "You can explore verified experts, compare their profiles, and choose a matching consultation slot. If you want, ask me what kind of expert you need and I’ll guide you.";
    }
    if (context === "technical" || includesAny(normalized, technicalKeywords)) {
        return "It looks like a technical or account issue. Try signing in again, refreshing the page, and checking your connection. If it still fails, please contact admin support for manual help.";
    }
    if (context === "booking" || includesAny(normalized, bookingKeywords)) {
        return "To book a consultation, choose an expert, review the available schedule, and confirm the booking from the platform. If a slot is missing, it may not be published or available yet.";
    }
    return "Hi — I can help with finding experts, booking consultations, schedules, payments, and general platform guidance. Tell me what you need, and I’ll guide you step by step.";
};
const shouldEscalateToHuman = (message) => {
    const normalized = message.toLowerCase();
    return includesAny(normalized, escalationKeywords);
};
const buildMessages = (payload) => {
    const history = (payload.history ?? []).map((item) => ({
        role: item.role,
        content: item.content,
    }));
    return [
        { role: "system", content: SYSTEM_PROMPT },
        ...history,
        {
            role: "user",
            content: payload.context
                ? `Context: ${payload.context}\nUser message: ${payload.message}`
                : payload.message,
        },
    ];
};
const generateOpenAIReply = async (payload) => {
    if (!envVars.OPENAI_API_KEY) {
        return null;
    }
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${envVars.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: envVars.OPENAI_MODEL || "gpt-4o-mini",
            temperature: 0.4,
            max_tokens: 300,
            messages: buildMessages(payload),
        }),
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI request failed: ${response.status} ${errorText}`);
    }
    const data = (await response.json());
    return data.choices?.[0]?.message?.content?.trim() || null;
};
const askSupport = async (payload) => {
    const message = payload.message?.trim();
    if (!message) {
        throw new AppError(status.BAD_REQUEST, "Message is required");
    }
    const suggestedActions = buildSuggestedActions(message, payload.context);
    const escalatedToHuman = shouldEscalateToHuman(message);
    try {
        const aiReply = await generateOpenAIReply({ ...payload, message });
        const reply = aiReply || buildFallbackReply(message, payload.context);
        return {
            reply,
            suggestedActions,
            escalatedToHuman,
            provider: aiReply ? "openai" : "fallback",
            model: aiReply ? envVars.OPENAI_MODEL || "gpt-4o-mini" : "rule-based-support",
            timestamp: new Date().toISOString(),
        };
    }
    catch (error) {
        console.error("AI support error:", error);
        return {
            reply: buildFallbackReply(message, payload.context),
            suggestedActions,
            escalatedToHuman,
            provider: "fallback",
            model: "rule-based-support",
            timestamp: new Date().toISOString(),
        };
    }
};
export const aiService = {
    askSupport,
};
//# sourceMappingURL=ai.service.js.map