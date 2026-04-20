import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { checkAuth } from "../../middleware/cheackAuth";

import { adminController } from "./admin.controler";
import { adminIdValidationSchema, updateAdminValidationSchema } from "./admin.validation";
import { Role } from "../../generated/enums";

const router = Router();

router.get("/", checkAuth(Role.ADMIN), adminController.getAllAdmin);
router.get("/:id", checkAuth(Role.ADMIN), validateRequest(adminIdValidationSchema), adminController.getAdminById);
router.put("/:id", checkAuth(Role.ADMIN), validateRequest(updateAdminValidationSchema), adminController.updateAdmin);

router.delete("/:id", checkAuth(Role.ADMIN), validateRequest(adminIdValidationSchema), adminController.deleteAdmin);
export const adminRouter = router;