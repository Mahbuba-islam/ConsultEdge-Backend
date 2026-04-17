import { Router } from "express";

import { validateRequest } from "../../middleware/validateRequest";

import { checkAuth } from "../../middleware/cheackAuth";
import { Role } from "../../generated/enums";
import {
  assignExpertScheduleValidation,
  publishExpertScheduleValidation,
  updateExpertScheduleValidation,
} from "./expertSchdule.validation";
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

// Public/client published schedules by expert
router.get(
  "/published",
  expertScheduleController.getPublishedExpertSchedules
);

router.get(
  "/published/:expertId",
  expertScheduleController.getPublishedExpertSchedules
);




// Update my schedules
router.put(
  "/my",
  validateRequest(updateExpertScheduleValidation),
  checkAuth(Role.EXPERT),
  expertScheduleController.updateMyExpertSchedules
);

// Publish / unpublish my schedules
router.patch(
  "/my/publish",
  validateRequest(publishExpertScheduleValidation),
  checkAuth(Role.EXPERT),
  expertScheduleController.publishMyExpertSchedules
);


// Delete my schedule
router.delete(
  "/my/:scheduleId",
  checkAuth(Role.EXPERT),
  expertScheduleController.deleteMyExpertSchedule
);

export const expertScheduleRouter = router;