import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponsr";
import { conversationsService } from "./conversations.service";
const getSingleString = (value) => {
    if (Array.isArray(value)) {
        return typeof value[0] === "string" ? value[0] : "";
    }
    return typeof value === "string" ? value : "";
};
const getAllConversationsForAdmin = catchAsync(async (req, res) => {
    const expertId = getSingleString(req.query.expertId) || undefined;
    const conversations = await conversationsService.getAllConversationsForAdmin(expertId);
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: "Conversations fetched successfully",
        data: conversations,
    });
});
export const conversationsController = {
    getAllConversationsForAdmin,
};
//# sourceMappingURL=conversations.controler.js.map