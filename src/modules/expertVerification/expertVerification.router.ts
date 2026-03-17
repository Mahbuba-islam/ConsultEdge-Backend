import { Router } from "express";

import { verifyExpertValidationSchema } from "./expertVerification.validation";
import { checkAuth } from "../../middleware/cheackAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { expertVerificationController } from "./expertVerification.controler";

const router = Router();

router.patch(
  "/verify/:id",
checkAuth("ADMIN"),
  validateRequest(verifyExpertValidationSchema),
  expertVerificationController.verifyExpert
);

export const expertVerificationRouter = router;
