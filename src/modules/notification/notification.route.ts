import { Router } from "express";
import { checkAuth } from "../../middleware/cheackAuth";
import { Role } from "../../generated/enums";
import { notificationController } from "./notification.controler";

const router = Router();

router.get(
  "/my",
  checkAuth(Role.ADMIN, Role.EXPERT, Role.CLIENT),
  notificationController.getMyNotifications
);

router.get(
  "/unread-count",
  checkAuth(Role.ADMIN, Role.EXPERT, Role.CLIENT),
  notificationController.getUnreadCount
);

router.patch(
  "/read-all",
  checkAuth(Role.ADMIN, Role.EXPERT, Role.CLIENT),
  notificationController.markAllAsRead
);

router.patch(
  "/:id/read",
  checkAuth(Role.ADMIN, Role.EXPERT, Role.CLIENT),
  notificationController.markAsRead
);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.EXPERT, Role.CLIENT),
  notificationController.deleteNotification
);

router.post("/", checkAuth(Role.ADMIN), notificationController.createNotification);
router.get("/", checkAuth(Role.ADMIN), notificationController.getAllNotifications);

export const notificationRouter = router;
