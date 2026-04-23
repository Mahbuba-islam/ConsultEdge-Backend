import status from "http-status";
import { expertVerificationService } from "./expertVerification.service";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponsr";
const verifyExpert = catchAsync(async (req, res) => {
    const { id } = req.params; // expertId
    const adminId = req.user.userId; // from auth middleware
    const payload = req.body;
    const result = await expertVerificationService.verifyExpert(id, adminId, payload);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Expert verification updated successfully",
        data: result,
    });
});
export const expertVerificationController = {
    verifyExpert,
};
//# sourceMappingURL=expertVerification.controler.js.map