import { Router } from "express";

import { validateRequest } from "../../middleware/validateRequest";
import { checkAuth } from "../../middleware/cheackAuth";
import { ScheduleController } from "./schedules.controler";
import { ScheduleValidation } from "./schedule.validation";
import { Role } from "../../generated/enums";

const router = Router();

router.post('/', checkAuth(Role.ADMIN), validateRequest(ScheduleValidation.createScheduleZodSchema) , ScheduleController.createSchedule);
router.get('/', checkAuth(Role.ADMIN, Role.EXPERT), ScheduleController.getAllSchedules);
router.get('/:id', checkAuth(Role.ADMIN, Role.EXPERT), ScheduleController.getScheduleById);
router.patch('/:id', checkAuth(Role.ADMIN),validateRequest(ScheduleValidation.updateScheduleZodSchema), ScheduleController.updateSchedule);
router.delete('/:id', checkAuth(Role.ADMIN), ScheduleController.deleteSchedule);

export const scheduleRoutes = router;