import { Request, Response } from "express";
import { userService } from "./user.service";

import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponsr";






//create admin controler

const createAdmin = catchAsync(async(req: Request, res: Response) => {
    const payload = req.body
    const result = await userService.createAdmin(payload)
   sendResponse(res, {
    success: true,
    httpStatusCode:status.CREATED,
    message: "Admin created successfully",
    data: result
   })
})





export const userController = {
   createAdmin,
    
}

