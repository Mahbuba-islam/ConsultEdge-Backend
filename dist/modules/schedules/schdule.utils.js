export const convertDateTime = async (date) => {
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + offset);
};
//# sourceMappingURL=schdule.utils.js.map