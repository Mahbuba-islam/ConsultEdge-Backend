import express from "express";

import {
  createTestimonialSchema,
  updateTestimonialSchema,
} from "./testimonial.validation";
import { auth } from "../../lib/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { TestimonialController } from "./testimonial.controler";
import { checkAuth } from "../../middleware/cheackAuth";
import { Role } from "../../generated/enums";

const router = express.Router();

router.post(
  "/",
  checkAuth(Role.CLIENT),
  validateRequest(createTestimonialSchema),
  TestimonialController.createTestimonial)

router.get("/", TestimonialController.getAllTestimonials);

router.get("/expert/:expertId", TestimonialController.getTestimonialsByExpert);

router.put(
  "/:id",
  checkAuth(Role.CLIENT),
  validateRequest(updateTestimonialSchema),
  TestimonialController.updateTestimonial
);

router.delete("/:id", checkAuth(Role.CLIENT), TestimonialController.deleteTestimonial);

export const testimonialRoutes = router;