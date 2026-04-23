import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponsr";
import { notificationService } from "./notification.service";
const createNotification = catchAsync(async (req, res) => {
    const result = await notificationService.createNotification(req.body);
    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "Notification created successfully",
        data: result,
    });
});
const getAllNotifications = catchAsync(async (_req, res) => {
    const result = await notificationService.getAllNotifications();
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Notifications retrieved successfully",
        data: result,
    });
});
const getMyNotifications = catchAsync(async (req, res) => {
    const result = await notificationService.getMyNotifications(req.user);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "My notifications retrieved successfully",
        data: result,
    });
});
const getUnreadCount = catchAsync(async (req, res) => {
    const result = await notificationService.getUnreadCount(req.user);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Unread notification count retrieved successfully",
        data: result,
    });
});
const markAsRead = catchAsync(async (req, res) => {
    const result = await notificationService.markAsRead(String(req.params.id), req.user);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Notification marked as read",
        data: result,
    });
});
const markAllAsRead = catchAsync(async (req, res) => {
    const result = await notificationService.markAllAsRead(req.user);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "All notifications marked as read",
        data: result,
    });
});
const deleteNotification = catchAsync(async (req, res) => {
    await notificationService.deleteNotification(String(req.params.id), req.user);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Notification deleted successfully",
        data: null,
    });
});
export const notificationController = {
    createNotification,
    getAllNotifications,
    getMyNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
};
//# sourceMappingURL=notification.controler.js.map