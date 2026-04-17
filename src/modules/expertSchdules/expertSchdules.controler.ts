import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponsr";
import { expertScheduleService } from "./expertSchdules.service";
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

const publishMyExpertSchedules = catchAsync(async (req, res) => {
  const result = await expertScheduleService.publishMyExpertSchedules(
    req.user.userId,
    req.body
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Expert schedules publish status updated successfully",
    data: result,
  });
});

const getPublishedExpertSchedules = catchAsync(async (req, res) => {
  const expertId = (req.params.expertId || req.query.expertId) as string | undefined;

  if (!expertId) {
    return sendResponse(res, {
      httpStatusCode: status.BAD_REQUEST,
      success: false,
      message: "expertId is required",
    });
  }

  const result = await expertScheduleService.getPublishedExpertSchedules(
    expertId
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Published expert schedules fetched successfully",
    data: result,
  });
});

export const expertScheduleController = {
  assignExpertSchedules,
  getMyExpertSchedules,
  updateMyExpertSchedules,
  deleteMyExpertSchedule,
  publishMyExpertSchedules,
  getPublishedExpertSchedules,
};