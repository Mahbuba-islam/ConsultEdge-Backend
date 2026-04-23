import status from "http-status";
import z from "zod";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { handlePrismaClientKnownRequestError, handlePrismaClientUnknownError, handlePrismaClientValidationError, handlerPrismaClientInitializationError, handlerPrismaClientRustPanicError } from "../errorHelpers/handlePrismaError";
import { handleZodError } from "../errorHelpers/handleZodError";
import { Prisma } from "../generated/client";
const isBetterAuthHandledError = (err) => {
    if (!err || typeof err !== "object") {
        return false;
    }
    const candidate = err;
    return (typeof candidate.statusCode === "number" ||
        typeof candidate.status === "string" ||
        typeof candidate.body?.message === "string");
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const globalErrorHandler = async (err, req, res, next) => {
    if (envVars.NODE_ENV === 'development') {
        if (err instanceof AppError && err.statusCode < 500) {
            console.warn(`[Handled AppError ${err.statusCode}] ${req.method} ${req.originalUrl} -> ${err.message}`);
        }
        else if (isBetterAuthHandledError(err) && ((err.statusCode ?? 500) < 500 || err.status === "UNAUTHORIZED" || err.status === "BAD_REQUEST" || err.status === "FORBIDDEN")) {
            console.warn(`[Handled Auth Error ${err.statusCode ?? err.status ?? 400}] ${req.method} ${req.originalUrl} -> ${err.body?.message ?? err.message ?? 'Authentication error'}`);
        }
        else {
            console.error("Error from Global Error Handler", err);
        }
    }
    // if(req.file){
    //     await deleteFileFromCloudinary(req.file.path)
    // }
    // if(req.files && Array.isArray(req.files) && req.files.length > 0){
    //     const imageUrls = req.files.map((file) => file.path);
    //     await Promise.all(imageUrls.map(url => deleteFileFromCloudinary(url))); 
    // }
    // await deleteUploadedFilesFromGlobalErrorHandler(req);
    let errorSources = [];
    let statusCode = status.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';
    let stack = undefined;
    //Zod Error Patttern
    /*
     error.issues;
    /* [
      {
        expected: 'string',
        code: 'invalid_type',
        path: [ 'username' , 'password' ], => username password
        message: 'Invalid input: expected string'
      },
      {
        expected: 'number',
        code: 'invalid_type',
        path: [ 'xp' ],
        message: 'Invalid input: expected number'
      }
    ]
    */
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        const simplifiedError = handlePrismaClientKnownRequestError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = [...simplifiedError.errorSources];
        stack = err.stack;
    }
    else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        const simplifiedError = handlePrismaClientUnknownError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = [...simplifiedError.errorSources];
        stack = err.stack;
    }
    else if (err instanceof Prisma.PrismaClientValidationError) {
        const simplifiedError = handlePrismaClientValidationError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = [...simplifiedError.errorSources];
        stack = err.stack;
    }
    else if (err instanceof Prisma.PrismaClientRustPanicError) {
        const simplifiedError = handlerPrismaClientRustPanicError();
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = [...simplifiedError.errorSources];
        stack = err.stack;
    }
    else if (err instanceof Prisma.PrismaClientInitializationError) {
        const simplifiedError = handlerPrismaClientInitializationError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = [...simplifiedError.errorSources];
        stack = err.stack;
    }
    else if (err instanceof z.ZodError) {
        const simplifiedError = handleZodError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = [...simplifiedError.errorSources];
        stack = err.stack;
    }
    else if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        stack = err.stack;
        errorSources = [
            {
                path: '',
                message: err.message
            }
        ];
    }
    else if (isBetterAuthHandledError(err)) {
        statusCode = typeof err.statusCode === 'number'
            ? err.statusCode
            : err.status === 'UNAUTHORIZED'
                ? status.UNAUTHORIZED
                : err.status === 'FORBIDDEN'
                    ? status.FORBIDDEN
                    : err.status === 'BAD_REQUEST'
                        ? status.BAD_REQUEST
                        : status.INTERNAL_SERVER_ERROR;
        message = err.body?.message || err.message || message;
        stack = err instanceof Error ? err.stack : undefined;
        errorSources = [
            {
                path: '',
                message
            }
        ];
    }
    else if (err instanceof Error) {
        statusCode = status.INTERNAL_SERVER_ERROR;
        message = err.message;
        stack = err.stack;
        errorSources = [
            {
                path: '',
                message: err.message
            }
        ];
    }
    const errorResponse = {
        success: false,
        message: message,
        errorSources,
        error: envVars.NODE_ENV === 'development' ? err : undefined,
        stack: envVars.NODE_ENV === 'development' ? stack : undefined,
    };
    res.status(statusCode).json(errorResponse);
};
//# sourceMappingURL=globalErrorHandler.js.map