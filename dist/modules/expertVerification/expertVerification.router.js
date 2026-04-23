import { Router } from "express";
import { verifyExpertValidationSchema } from "./expertVerification.validation";
import { checkAuth } from "../../middleware/cheackAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { expertVerificationController } from "./expertVerification.controler";
import { Role } from "../../generated/enums";
const router = Router();
router.patch("/verify/:id", checkAuth(Role.ADMIN), validateRequest(verifyExpertValidationSchema), expertVerificationController.verifyExpert);
export const expertVerificationRouter = router;
//# sourceMappingURL=expertVerification.router.js.map