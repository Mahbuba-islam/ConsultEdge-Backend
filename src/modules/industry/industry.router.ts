import { Router } from "express";


import { validateRequest } from "../../middleware/validateRequest";

import { createIndustryValidation } from "./industry.validation";
import { industryController } from "./industry.controler";
import { multerUpload } from "../../config/multer.config";
import { checkAuth } from "../../middleware/cheackAuth";
import { Role } from "../../generated/enums";

const router = Router()

 router.post("/", multerUpload.single("file"), validateRequest(createIndustryValidation), checkAuth(Role.ADMIN), industryController.createIndustry)

router.get("/", industryController.getAllIndustries)
router.get("/:id", industryController.getIndustryById);

router.delete("/:id", checkAuth(Role.ADMIN), industryController.deleteIndustry)
router.put("/:id", checkAuth(Role.ADMIN), industryController.updateIndustry)


export const industryRouter = router