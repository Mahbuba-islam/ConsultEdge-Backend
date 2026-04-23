export const scheduleFilterableFields = [
    "id",
    "startDateTime",
    "endDateTime",
    "isDeleted",
];
export const scheduleSearchableFields = [
    "id",
    "startDateTime",
    "endDateTime",
];
export const scheduleIncludeConfig = {
    expertSchedules: {
        include: {
            expert: {
                include: {
                    user: true,
                    industry: true,
                },
            },
            consultation: true,
        },
    },
};
//# sourceMappingURL=schdules.constant.js.map