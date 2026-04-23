import { userService } from "./user.service";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponsr";
//create admin controler
const createAdmin = catchAsync(async (req, res) => {
    const payload = req.body;
    const result = await userService.createAdmin(payload);
    sendResponse(res, {
        success: true,
        httpStatusCode: status.CREATED,
        message: "Admin created successfully",
        data: result
    });
});
const getAllClients = catchAsync(async (req, res) => {
    const result = await userService.getAllClients(req.query);
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: "Clients retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});
export const userController = {
    createAdmin,
    getAllClients,
};
//# sourceMappingURL=user.controler.js.map