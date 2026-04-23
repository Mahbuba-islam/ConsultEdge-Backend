import { Router } from "express";
import { Role } from "../../generated/enums";
import { checkAuth } from "../../middleware/cheackAuth";
import { conversationsController } from "./conversations.controler";
const router = Router();
router.get("/admin", checkAuth(Role.ADMIN), conversationsController.getAllConversationsForAdmin);
export const conversationsRoutes = router;
//# sourceMappingURL=conservations.router.js.map