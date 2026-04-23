import { z } from "zod";
const historyItemSchema = z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string().trim().min(1).max(4000),
});
const askSupport = z.object({
    body: z.object({
        message: z.string().trim().min(1, "Message is required").max(4000),
        context: z
            .enum(["general", "homepage", "booking", "expert", "payment", "technical"])
            .optional(),
        history: z.array(historyItemSchema).max(12).optional(),
    }),
});
export const aiValidation = {
    askSupport,
};
//# sourceMappingURL=ai.validation.js.map