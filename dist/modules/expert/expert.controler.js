import status from "http-status";
import { expertService } from "./expert.service";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponsr";
// ===============================
// GET ALL EXPERTS
// ===============================
const getAllExperts = catchAsync(async (req, res) => {
    const query = req.query;
    const result = await expertService.getAllExperts(query);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Experts fetched successfully",
        data: result.data,
        meta: result.meta,
    });
});
// ===============================
// GET EXPERT BY ID
// ===============================
const getExpertById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const expert = await expertService.getExpertById(id);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Expert retrieved successfully",
        data: expert,
    });
});
// ===============================
// UPDATE EXPERT
// ===============================
const updateExpert = catchAsync(async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    const updatedExpert = await expertService.updateExpert(id, payload);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Expert updated successfully",
        data: updatedExpert,
    });
});
// ===============================
// DELETE EXPERT (SOFT DELETE)
// ===============================
const deleteExpert = catchAsync(async (req, res) => {
    const { id } = req.params;
    const deletedExpert = await expertService.deleteExpert(id);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Expert deleted successfully",
        data: deletedExpert,
    });
});
// apply expert
const applyExpert = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const profilePicture = req.file ? req.file.path : null;
    const result = await expertService.applyExpert(userId, { ...req.body, profilePicture });
    sendResponse(res, {
        success: true,
        httpStatusCode: 201,
        message: "Expert application submitted successfully",
        data: result,
    });
});
// ===============================
// EXPORT CONTROLLER
// ===============================
export const expertController = {
    getAllExperts,
    getExpertById,
    updateExpert,
    deleteExpert,
    applyExpert
};
//# sourceMappingURL=expert.controler.js.map