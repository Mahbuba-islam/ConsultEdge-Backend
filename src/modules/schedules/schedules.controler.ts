import { Request, Response } from "express";
import status from "http-status";

import { IqueryParams } from "../../interfaces/query.interface";
import { schedulesService } from "./schedules.service";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponsr";



const createSchedule = catchAsync( async (req : Request, res : Response) => {
    const payload = req.body;
    const schedule = await schedulesService.createSchedules(payload, req.user);
    sendResponse(res, {
        success: true,
        httpStatusCode: status.CREATED,
        message: 'Schedule created successfully',
        data: schedule
    });
});


const getAllSchedules = catchAsync( async (req : Request, res : Response) => {
    const query = req.query;
    const result = await schedulesService.getAllSchedules(query as IqueryParams, req.user);
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: 'Schedules retrieved successfully',
        data: result.data,
        meta: result.meta
    });
});



const getScheduleById = catchAsync( async (req : Request, res : Response) => {
    const { id } = req.params;
    const schedule = await schedulesService.getScheduleById(id as string);
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: 'Schedule retrieved successfully',
        data: schedule
    });
});

const getPublishedSchedulesByExpertId = catchAsync(async (req: Request, res: Response) => {
    const expertId = (req.params.expertId || req.query.expertId) as string | undefined;

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



const updateSchedule = catchAsync( async (req : Request, res : Response) => {
    const { id } = req.params;
    const payload = req.body;
    const updatedSchedule = await schedulesService.updateSchedule(id as string, payload);
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: 'Schedule updated successfully',
        data: updatedSchedule
    });
});



const deleteSchedule = catchAsync( async (req : Request, res : Response) => {
    const { id } = req.params;
    await schedulesService.deleteSchedule(id as string);
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: 'Schedule deleted successfully',
    });
}
);




export const ScheduleController = {
    createSchedule,
    getAllSchedules,
    getScheduleById,
    getPublishedSchedulesByExpertId,
    updateSchedule,
    deleteSchedule
}