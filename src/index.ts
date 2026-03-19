
import { Router } from "express";



import { expertVerificationRouter } from "./modules/expertVerification/expertVerification.router";
import { authRoutes } from "./modules/auth/auth.router";
import { expertRouter } from "./modules/expert/expert.route";
import { adminRouter } from "./modules/admin/admin.router";
import { expertScheduleRouter } from "./modules/expertSchdules/expertSchdules.router";
import { scheduleRoutes } from "./modules/schedules/schedules.router";
import { userRouter } from "./modules/user/user.router";
import { consultationRouter } from "./modules/consultation/consultation.router";
import { industryRouter } from "./modules/industry/industry.router";
import { testimonialRoutes } from "./modules/testimonial/testimonial.router";


const router = Router();

// Auth
router.use("/auth", authRoutes);

// Users
router.use("/users", userRouter);

// Core business modules
router.use("/experts", expertRouter);

// Scheduling
router.use("/schedules", scheduleRoutes);
router.use("/expert-schedules", expertScheduleRouter);

// Consultation + Payment
router.use("/consultations", consultationRouter);

// Admin roles
router.use("/admin", adminRouter);

// Industry / Category
router.use("/industries", industryRouter);
router.use("/expert-verification", expertVerificationRouter)
router.use("/testimonial", testimonialRoutes)
export const indexRoutes = router;