import { Router } from "express";
import { userController } from "./user.controler";
import { validateRequest } from "../../middleware/validateRequest";
import { createAdminZodSchema } from "./user.validation";
import { checkAuth } from "../../middleware/cheackAuth";
import { Role } from "../../generated/enums";
const router = Router();
router.get("/clients", checkAuth(Role.ADMIN), userController.getAllClients);
router.post("/create-admin", validateRequest(createAdminZodSchema), checkAuth(Role.ADMIN), userController.createAdmin);
export const userRouter = router;
//# sourceMappingURL=user.router.js.map