import z from "zod";
// create admin zod schema
export const createAdminZodSchema = z.object({
    password: z.string("Password is required").min(8, "Password must be at least 8 characters long")
        .max(50, "Password must be less than 100 characters long"),
    admin: z.object({
        name: z.string("Name is required").min(5, "Name must be at least 5 characters long")
            .max(20, "Name must be less than 20 characters long"),
        email: z.email("Invalid email address"),
        contactNumber: z.string("Contact number is required")
            .min(11, "Contact number must be at least 10 characters long")
            .max(15, "Contact number must be less than 15 characters long").optional(),
        address: z.string("Address is required")
            .min(10, "Address must be at least 10 characters long")
            .max(100, "Address must be less than 100 characters long").optional(),
        profilePhoto: z.url({ message: "Profile photo must be a valid URL" })
            .optional(),
    })
});
//# sourceMappingURL=user.validation.js.map