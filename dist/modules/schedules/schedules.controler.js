import status from "http-status";
import { schedulesService } from "./schedules.service";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponsr";
const createSchedule = catchAsync(async (req, res) => {
    const payload = req.body;
    const schedule = await schedulesService.createSchedules(payload, req.user);
    sendResponse(res, {
        success: true,
        httpStatusCode: status.CREATED,
        message: 'Schedule created successfully',
        data: schedule
    });
});
const getAllSchedules = catchAsync(async (req, res) => {
    const query = req.query;
    const result = await schedulesService.getAllSchedules(query, req.user);
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: 'Schedules retrieved successfully',
        data: result.data,
        meta: result.meta
    });
});
const getScheduleById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const schedule = await schedulesService.getScheduleById(id);
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: 'Schedule retrieved successfully',
        data: schedule
    });
});
const getPublishedSchedulesByExpertId = catchAsync(async (req, res) => {
    const expertId = (req.params.expertId || req.query.expertId);
    if (!expertId) {
        return sendResponse(res, {
            success: false,
            httpStatusCode: status.BAD_REQUEST,
            message: "expertId is required",
        });
    }
    const result = await schedulesService.getPublishedSchedulesByExpertId(expertId);
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: "Published schedules retrieved successfully",
        data: result,
    });
});
const updateSchedule = catchAsync(async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    const updatedSchedule = await schedulesService.updateSchedule(id, payload);
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: 'Schedule updated successfully',
        data: updatedSchedule
    });
});
const deleteSchedule = catchAsync(async (req, res) => {
    const { id } = req.params;
    await schedulesService.deleteSchedule(id);
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: 'Schedule deleted successfully',
    });
});
export const ScheduleController = {
    createSchedule,
    getAllSchedules,
    getScheduleById,
    getPublishedSchedulesByExpertId,
    updateSchedule,
    deleteSchedule
};
//# sourceMappingURL=schedules.controler.js.map