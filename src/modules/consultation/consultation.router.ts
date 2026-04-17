import { Router } from "express";

import { validateRequest } from "../../middleware/validateRequest";
import {
  bookConsultationValidation,
  cancelConsultationValidation,
  completeConsultationValidation,
  consultationSessionAccessValidation,
  initiateConsultationPaymentValidation,
  rescheduleConsultationValidation,
  startConsultationSessionValidation,
  updateConsultationStatusValidation,
} from "./consultation.validation";
import { checkAuth } from "../../middleware/cheackAuth";
import { Role } from "../../generated/enums";
import { consultationController } from "./consultation.controler";

const router = Router();

// Client: book consultation with immediate payment
router.post(
  "/book",
  checkAuth(Role.CLIENT),
  validateRequest(bookConsultationValidation),
  consultationController.bookConsultation
);

// Client: book consultation with pay later
router.post(
  "/book/pay-later",
  checkAuth(Role.CLIENT),
  validateRequest(bookConsultationValidation),
  consultationController.bookConsultationWithPayLater
);

// Client / Expert: see own bookings
router.get(
  "/my-bookings",
  checkAuth(Role.CLIENT, Role.EXPERT),
  consultationController.getMyBookings
);

// Frontend-compat aliases for own bookings
router.get("/me", checkAuth(Role.CLIENT, Role.EXPERT), consultationController.getMyBookings);
router.get(
  "/client/me",
  checkAuth(Role.CLIENT),
  consultationController.getMyBookings
);
router.get(
  "/expert/me",
  checkAuth(Role.EXPERT),
  consultationController.getMyBookings
);
router.get("/", checkAuth(Role.CLIENT, Role.EXPERT), consultationController.getMyBookings);

// Client: initiate payment for existing consultation
router.post(
  "/:consultationId/initiate-payment",
  checkAuth(Role.CLIENT),
  validateRequest(initiateConsultationPaymentValidation),
  consultationController.initiateConsultationPayment
);

// Client / Expert / Admin: session lifecycle
router.get(
  "/:consultationId/session-access",
  checkAuth(Role.CLIENT, Role.EXPERT, Role.ADMIN),
  validateRequest(consultationSessionAccessValidation),
  consultationController.getSessionAccess
);
router.patch(
  "/:consultationId/start",
  checkAuth(Role.CLIENT, Role.EXPERT, Role.ADMIN),
  validateRequest(startConsultationSessionValidation),
  consultationController.startSession
);
router.patch(
  "/:consultationId/complete",
  checkAuth(Role.CLIENT, Role.EXPERT, Role.ADMIN),
  validateRequest(completeConsultationValidation),
  consultationController.completeSession
);
router.patch(
  "/:consultationId/cancel",
  checkAuth(Role.CLIENT, Role.EXPERT, Role.ADMIN),
  validateRequest(cancelConsultationValidation),
  consultationController.cancelConsultation
);
router.patch(
  "/:consultationId/reschedule",
  checkAuth(Role.CLIENT, Role.EXPERT, Role.ADMIN),
  validateRequest(rescheduleConsultationValidation),
  consultationController.rescheduleConsultation
);
router.patch(
  "/:consultationId/status",
  checkAuth(Role.CLIENT, Role.EXPERT, Role.ADMIN),
  validateRequest(updateConsultationStatusValidation),
  consultationController.updateConsultationStatus
);

// Admin / Cron: cancel unpaid consultations
router.post(
  "/cancel-unpaid",
  checkAuth(Role.ADMIN),
  consultationController.cancelUnpaidConsultations
);

export const consultationRouter = router;