import express from 'express';
import { checkAuth } from '../../middleware/cheackAuth';
import { Role } from '../../generated/enums';
import { StatsController } from './stats.controler';
const router = express.Router();
router.get('/', checkAuth(Role.ADMIN, Role.EXPERT, Role.CLIENT), // Only allow authenticated users with these roles
StatsController.getDashboardStatsData);
export const StatsRoutes = router;
//# sourceMappingURL=stats.router.js.map