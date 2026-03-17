import { Router } from "express";

import { validateRequest } from "../../middleware/validateRequest";

import { checkAuth } from "../../middleware/cheackAuth";
import { Role } from "../../generated/enums";
import { assignExpertScheduleValidation } from "./expertSchdule.validation";
import { expertScheduleController } from "./expertSchdules.controler";

const router = Router();

// Assign schedules to expert
router.post(
  "/assign",
  validateRequest(assignExpertScheduleValidation),
  checkAuth(Role.EXPERT),
  expertScheduleController.assignExpertSchedules
);

// Get my schedules
router.get(
  "/my",
  checkAuth(Role.EXPERT),
  expertScheduleController.getMyExpertSchedules
);

// Admin: get all expert schedules
router.get(
  "/",
  checkAuth(Role.ADMIN),
  expertScheduleController.getAllExpertSchedules
);

// Get expert schedule by composite key
router.get(
  "/:expertId/:scheduleId",
  checkAuth(Role.ADMIN),
  expertScheduleController.getExpertScheduleById
);

// Update my schedules
router.put(
  "/my",
  validateRequest(updateExpertScheduleValidation),
  checkAuth(Role.EXPERT),
  expertScheduleController.updateMyExpertSchedules
);

// Delete my schedule
router.delete(
  "/my/:scheduleId",
  checkAuth(Role.EXPERT),
  expertScheduleController.deleteMyExpertSchedule
);

export const expertScheduleRouter = router;