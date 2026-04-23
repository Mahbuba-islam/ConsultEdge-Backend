import express from "express";
import { createTestimonialSchema, replyToTestimonialSchema, updateReviewStatusSchema, updateTestimonialSchema, } from "./testimonial.validation";
import { validateRequest } from "../../middleware/validateRequest";
import { TestimonialController } from "./testimonial.controler";
import { checkAuth } from "../../middleware/cheackAuth";
import { Role } from "../../generated/enums";
const router = express.Router();
router.post("/", checkAuth(Role.CLIENT), validateRequest(createTestimonialSchema), TestimonialController.createTestimonial);
router.get("/", TestimonialController.getAllTestimonials);
router.get("/admin", checkAuth(Role.ADMIN), TestimonialController.getAllTestimonialsForAdmin);
router.get("/expert/:expertId", TestimonialController.getTestimonialsByExpert);
router.patch("/:id/reply", checkAuth(Role.EXPERT), validateRequest(replyToTestimonialSchema), TestimonialController.replyToTestimonial);
router.patch("/:id/status", checkAuth(Role.ADMIN), validateRequest(updateReviewStatusSchema), TestimonialController.updateReviewStatus);
router.put("/:id", checkAuth(Role.CLIENT), validateRequest(updateTestimonialSchema), TestimonialController.updateTestimonial);
export const testimonialRoutes = router;
//# sourceMappingURL=testimonial.router.js.map