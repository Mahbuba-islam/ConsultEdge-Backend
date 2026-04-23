import status from "http-status";
export const handleZodError = (err) => {
    const statusCode = status.BAD_REQUEST;
    const message = 'Zod Validation error';
    const errorSource = [];
    err.issues.forEach(issue => {
        errorSource.push({
            path: issue.path.join('.') || "unknown",
            message: issue.message
        });
    });
    return {
        success: false,
        message,
        errorSources: errorSource,
        statusCode
    };
};
//# sourceMappingURL=handleZodError.js.map