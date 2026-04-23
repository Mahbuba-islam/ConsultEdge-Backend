import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { createIndustryValidation, industryIdValidation, updateIndustryValidation, } from "./industry.validation";
import { industryController } from "./industry.controler";
import { multerUpload } from "../../config/multer.config";
import { checkAuth } from "../../middleware/cheackAuth";
import { Role } from "../../generated/enums";
const router = Router();
router.post("/", checkAuth(Role.ADMIN), multerUpload.single("file"), validateRequest(createIndustryValidation), industryController.createIndustry);
router.get("/", industryController.getAllIndustries);
router.get("/:id", validateRequest(industryIdValidation), industryController.getIndustryById);
router.delete("/:id", checkAuth(Role.ADMIN), validateRequest(industryIdValidation), industryController.deleteIndustry);
router.put("/:id", checkAuth(Role.ADMIN), multerUpload.single("file"), validateRequest(updateIndustryValidation), industryController.updateIndustry);
export const industryRouter = router;
//# sourceMappingURL=industry.router.js.map