export const sendResponse = (res, responseData) => {
    const { httpStatusCode, success, message, data } = responseData;
    res.status(httpStatusCode).json({
        success,
        message,
        data
    });
};
//# sourceMappingURL=sendResponsr.js.map