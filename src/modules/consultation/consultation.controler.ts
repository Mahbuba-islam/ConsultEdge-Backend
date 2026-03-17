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

export const consultationController = {
  bookConsultation,
  bookConsultationWithPayLater,
  initiateConsultationPayment,
  cancelUnpaidConsultations,
};