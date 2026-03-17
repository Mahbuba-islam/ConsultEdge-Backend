import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponsr";
import { expertScheduleService } from "./expertSchdules.service";
import { boolean } from "zod";
import { IqueryParams } from "../../interfaces/query.interface";

const assignExpertSchedules = catchAsync(async (req, res) => {
  const result = await expertScheduleService.assignExpertSchedules(
    req.user.userId,
    req.body
  );

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Schedules assigned successfully",
    data: result,
  });
});

const getMyExpertSchedules = catchAsync(async (req, res) => {
  const result = await expertScheduleService.getMyExpertSchedules(
    req.user.userId,
    req.query as IqueryParams
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Expert schedules fetched successfully",
    data: result,
  });
});

const getAllExpertSchedules = catchAsync(async (req, res) => {
    const result = await expertScheduleService.getAllExpertSchedules(req.query as IqueryParams);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "All expert schedules fetched successfully",
    data: result,
  });
});

const getExpertScheduleById = catchAsync(async (req, res) => {
  const { expertId, scheduleId } = req.params;

  const result = await expertScheduleService.getExpertScheduleById(
    expertId as string,
    scheduleId as string
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Expert schedule retrieved successfully",
    data: result,
  });
});

const updateMyExpertSchedules = catchAsync(async (req, res) => {
  const result = await expertScheduleService.updateMyExpertSchedules(
    req.user.userId,
    req.body
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Expert schedules updated successfully",
    data: result,
  });
});

const deleteMyExpertSchedule = catchAsync(async (req, res) => {
  const result = await expertScheduleService.deleteMyExpertSchedule(
    req.user.userId,
    req.params.scheduleId as string
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Expert schedule deleted successfully",
    data: result,
  });
});

export const expertScheduleController = {
  assignExpertSchedules,
  getMyExpertSchedules,
  getAllExpertSchedules,
  getExpertScheduleById,
  updateMyExpertSchedules,
  deleteMyExpertSchedule,
};