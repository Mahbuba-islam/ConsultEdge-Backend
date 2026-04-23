export const testimonialSearchableFields = ["comment", "expertReply"];
export const testimonialFilterableFields = [
    "rating",
    "expertId",
    "clientId",
    "status",
];
export const testimonialIncludeConfig = {
    client: {
        include: {
            user: true,
        },
    },
    expert: true,
    consultation: true,
};
//# sourceMappingURL=testimonial.constant.js.map