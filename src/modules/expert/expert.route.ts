import { Router } from "express";
import { expertController } from "./expert.controler";
import { validateRequest } from "../../middleware/validateRequest";

import { checkAuth } from "../../middleware/cheackAuth";
import { Role } from "../../generated/enums";
import { updateExpertValidationSchema } from "./expert.validationSchema";
import { multerUpload } from "../../config/multer.config";

const router = Router()

router.get("/", expertController.getAllExperts)
router.get("/:id", expertController.getExpertById)
router.post(
	"/apply",
	multerUpload.single("profilePhoto"),
	checkAuth(Role.CLIENT, Role.EXPERT, Role.ADMIN),
	expertController.applyExpert
)

router.put("/:id", validateRequest(updateExpertValidationSchema), 
checkAuth(Role.ADMIN, Role.EXPERT), expertController.updateExpert)

router.delete("/:id", checkAuth(Role.ADMIN, Role.EXPERT ), expertController.deleteExpert)
export const expertRouter = router