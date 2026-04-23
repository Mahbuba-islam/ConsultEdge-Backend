import { Router } from "express";
import { checkAuth } from "../../middleware/cheackAuth";
import { Role } from "../../generated/enums";
import { PaymentController } from "./payment.controler";
const router = Router();
router.post("/consultation/confirm-success", checkAuth(Role.CLIENT, Role.ADMIN), PaymentController.confirmConsultationPaymentSuccess);
router.post("/consultation/confirm", checkAuth(Role.CLIENT, Role.ADMIN), PaymentController.confirmConsultationPaymentSuccess);
router.get("/consultation/confirm-success", checkAuth(Role.CLIENT, Role.ADMIN), PaymentController.confirmConsultationPaymentSuccess);
router.get("/consultation/confirm", checkAuth(Role.CLIENT, Role.ADMIN), PaymentController.confirmConsultationPaymentSuccess);
export const PaymentRoutes = router;
//# sourceMappingURL=payment.router.js.map