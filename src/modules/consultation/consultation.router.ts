import { Router } from "express";

import { validateRequest } from "../../middleware/validateRequest";
import {
  bookConsultationValidation,
  initiateConsultationPaymentValidation,
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

// Client: initiate payment for existing consultation
router.post(
  "/:consultationId/initiate-payment",
  checkAuth(Role.CLIENT),
  validateRequest(initiateConsultationPaymentValidation),
  consultationController.initiateConsultationPayment
);

// Admin / Cron: cancel unpaid consultations
router.post(
  "/cancel-unpaid",
  checkAuth(Role.ADMIN),
  consultationController.cancelUnpaidConsultations
);

export const consultationRouter = router;