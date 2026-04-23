import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { aiController } from "./ai.controller";
import { aiValidation } from "./ai.validation";
const router = Router();
router.post("/support", validateRequest(aiValidation.askSupport), aiController.askSupport);
router.post("/chat", validateRequest(aiValidation.askSupport), aiController.askSupport);
export const aiRoutes = router;
//# sourceMappingURL=ai.router.js.map