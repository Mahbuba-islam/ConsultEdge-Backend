



 // support any zod schema

import { NextFunction, Request, Response } from "express"
import {  ZodType } from "zod"

export const validateRequest = (zodSchema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if(req.body.data){
      req.body = JSON.parse(req.body.data)
    }
    const parsedResult = zodSchema.safeParse(req.body)

    if (!parsedResult.success) {
      return next(parsedResult.error)
    }
   
    req.body = parsedResult.data
    next()
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