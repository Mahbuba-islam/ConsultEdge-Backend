



 // support any zod schema

import { NextFunction, Request, Response } from "express"
import { ZodType } from "zod"

export const validateRequest = (zodSchema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (typeof req.body?.data === "string") {
        req.body = JSON.parse(req.body.data)
      }

      const requestData = {
        body: req.body,
        query: req.query,
        params: req.params,
      }

      const wrappedResult = zodSchema.safeParse(requestData)

      if (wrappedResult.success) {
        const parsedData = wrappedResult.data as {
          body?: unknown
          query?: unknown
          params?: unknown
        }

        if (parsedData.body !== undefined) {
          req.body = parsedData.body as Request["body"]
        }

        if (parsedData.query !== undefined) {
          req.query = parsedData.query as Request["query"]
        }

        if (parsedData.params !== undefined) {
          req.params = parsedData.params as Request["params"]
        }

        return next()
      }

      const bodyOnlyResult = zodSchema.safeParse(req.body)

      if (!bodyOnlyResult.success) {
        return next(bodyOnlyResult.error)
      }

      req.body = bodyOnlyResult.data
      next()
    } catch (error) {
      next(error)
    }
  }
}



// import { NextFunction, Request, Response } from "express";
// import { ZodObject } from "zod";

// export const validateRequest = (schema: ZodObject<any>) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     try {
//       // If frontend sends multipart/form-data with a "data" field (stringified JSON)
//       if (req.body && typeof req.body.data === "string") {
//         req.body = JSON.parse(req.body.data);
//       }

//       // Merge file if exists (multer)
//       const finalData = {
//         ...req.body,
//         ...(req.file && { file: req.file }),
//       };

//       const parsed = schema.parse(finalData);

//       req.body = parsed;
//       next();
//     } catch (error) {
//       next(error);
//     }
//   };
// };