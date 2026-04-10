import { Router } from "express";
import { clientController } from "./client.controler";
import { checkAuth } from "../../middleware/cheackAuth";
import { Role } from "../../generated/enums";

const router = Router();

router.get("/", checkAuth(Role.ADMIN), clientController.getAllClients);
router.get("/me", checkAuth(Role.CLIENT, Role.ADMIN), clientController.getMyProfile);
router.get("/:id", checkAuth(Role.ADMIN), clientController.getClientById);
router.put("/:id", checkAuth(Role.ADMIN, Role.CLIENT), clientController.updateClient);
router.delete("/:id", checkAuth(Role.ADMIN), clientController.deleteClient);

export const clientRouter = router;
