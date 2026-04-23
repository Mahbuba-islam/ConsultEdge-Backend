import z from "zod";
import { Role } from "../../generated/enums";
const notificationIdParamsSchema = z.object({
    id: z.string().uuid("Invalid notification id"),
});
export const createNotificationValidation = z.object({
    body: z
        .object({
        type: z.string().trim().min(1, "Type is required"),
        message: z.string().trim().min(1, "Message is required"),
        userId: z.string().uuid("Invalid user id").optional(),
        role: z.nativeEnum(Role).optional(),
    })
        .superRefine((value, ctx) => {
        if ((value.userId && value.role) || (!value.userId && !value.role)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Provide exactly one target: userId or role",
            });
        }
    }),
});
export const notificationIdValidation = z.object({
    params: notificationIdParamsSchema,
});
//# sourceMappingURL=notification.validation.js.map