import {
    getNotifications,
    getUnreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    deleteAllNotifications,
} from "../services/notification.service.js";

const getNotificationsList = async (req, res) => {
    const data = await getNotifications(req.user.id);

    return res.status(200).json({
        success: true,
        message: "Notifications fetched successfully",
        data,
    });
};

const getUnreadCount = async (req, res) => {
    const data = await getUnreadNotificationCount(req.user.id);

    return res.status(200).json({
        success: true,
        message: "Unread notification count fetched successfully",
        data,
    });
};

const markAsRead = async (req, res) => {
    const data = await markNotificationAsRead(req.user.id, req.params.id);

    return res.status(200).json({
        success: true,
        message: "Notification marked as read",
        data,
    });
};

const markAllAsRead = async (req, res) => {
    await markAllNotificationsAsRead(req.user.id);

    return res.status(200).json({
        success: true,
        message: "All notifications marked as read",
    });
};

const removeOne = async (req, res) => {
    await deleteNotification(req.user.id, req.params.id);

    return res.status(200).json({
        success: true,
        message: "Notification deleted successfully",
    });
};

const removeAll = async (req, res) => {
    await deleteAllNotifications(req.user.id);

    return res.status(200).json({
        success: true,
        message: "All notifications deleted successfully",
    });
};

export {
    getNotificationsList,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    removeOne,
    removeAll,
};