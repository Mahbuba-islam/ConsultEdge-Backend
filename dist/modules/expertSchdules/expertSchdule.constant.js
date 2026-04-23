export const expertScheduleFilterableFields = [
    "expertId",
    "scheduleId",
    "isBooked",
    "isPublished",
    "isDeleted",
];
export const expertScheduleSearchableFields = ["expertId", "scheduleId"];
export const expertScheduleIncludeConfig = {
    schedule: true,
    expert: {
        include: {
            user: true,
            industry: true,
        },
    },
    consultation: true,
};
//# sourceMappingURL=expertSchdule.constant.js.map