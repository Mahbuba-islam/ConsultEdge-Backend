import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponsr";
import { consultationService } from "./consultation.service";

const bookConsultation = catchAsync(async (req, res) => {
  const result = await consultationService.bookConsultation(req.body, req.user);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Consultation booked successfully",
    data: result,
  });
});

const bookConsultationWithPayLater = catchAsync(async (req, res) => {
  const result = await consultationService.bookConsultationWithPayLater(
    req.body,
    req.user
  );

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Consultation booked with pay later successfully",
    data: result,
  });
});

const getMyBookings = catchAsync(async (req, res) => {
  const result = await consultationService.getMyBookings(req.user);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "My bookings retrieved successfully",
    data: result,
  });
});

const initiateConsultationPayment = catchAsync(async (req, res) => {
  const { consultationId } = req.params;

  const result = await consultationService.initiateConsultationPayment(
    consultationId as string,
    req.user
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Payment session created successfully",
    data: result,
  });
});

const getSessionAccess = catchAsync(async (req, res) => {
  const { consultationId } = req.params;

  const result = await consultationService.getSessionAccess(
    consultationId as string,
    req.user
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Session access details retrieved successfully",
    data: result,
  });
});

const startSession = catchAsync(async (req, res) => {
  const { consultationId } = req.params;

  const result = await consultationService.startSession(
    consultationId as string,
    req.user
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Session started successfully",
    data: result,
  });
});

const completeSession = catchAsync(async (req, res) => {
  const { consultationId } = req.params;

  const result = await consultationService.completeSession(
    consultationId as string,
    req.user,
    req.body
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Session completed successfully",
    data: result,
  });
});

const cancelConsultation = catchAsync(async (req, res) => {
  const { consultationId } = req.params;

  const result = await consultationService.cancelConsultation(
    consultationId as string,
    req.user,
    req.body
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Consultation cancelled successfully",
    data: result,
  });
});

const rescheduleConsultation = catchAsync(async (req, res) => {
  const { consultationId } = req.params;

  const result = await consultationService.rescheduleConsultation(
    consultationId as string,
    req.user,
    req.body
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Consultation rescheduled successfully",
    data: result,
  });
});

const updateConsultationStatus = catchAsync(async (req, res) => {
  const { consultationId } = req.params;

  const result = await consultationService.updateConsultationStatus(
    consultationId as string,
    req.user,
    req.body
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Consultation status updated successfully",
    data: result,
  });
});

// For cron / admin trigger
const cancelUnpaidConsultations = catchAsync(async (_req, res) => {
  await consultationService.cancelUnpaidConsultations();

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Unpaid consultations canceled successfully",
    data: null,
  });
});



const getAllConsultationsAdmin = catchAsync(async (req, res) => {
  const result = await consultationService.getAllConsultationsAdmin(req.query);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "All consultations retrieved successfully",
    data: result,
  });
});





export const consultationController = {
  bookConsultation,
  bookConsultationWithPayLater,
  getMyBookings,
  initiateConsultationPayment,
  getSessionAccess,
  startSession,
  completeSession,
  cancelConsultation,
  rescheduleConsultation,
  updateConsultationStatus,
  cancelUnpaidConsultations,
  getAllConsultationsAdmin,
};