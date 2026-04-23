export const expertSearchableFields = [
    "fullName",
    "email",
    "title",
    "bio",
    "phone",
    "industry.name",
];
export const expertFilterableFields = [
    "isVerified",
    "industryId",
    "experience",
    "price",
    "isDeleted",
];
export const expertIncludeConfig = {
    user: true,
    industry: true,
    schedules: {
        include: { schedule: true },
    },
    consultations: {
        include: {
            client: true,
            expertSchedule: true,
        },
    },
    testimonials: true,
    verification: true,
};
//# sourceMappingURL=expert.constant.js.map