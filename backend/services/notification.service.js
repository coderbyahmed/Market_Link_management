import mongoose from "mongoose";
import Notification from "../models/Notification.model.js";
import User from "../models/User.model.js";
import ApiError from "../utils/ApiError.js";

const serializeNotification = (notification) => ({
    id: notification._id,
    type: notification.type,
    title: notification.title,
    message: notification.message,
    data: notification.data || {},
    isRead: notification.isRead,
    createdAt: notification.createdAt,
    updatedAt: notification.updatedAt,
});

const getAdminRecipientForNotification = async () => {
    const defaultEmail = process.env.ADMIN_EMAIL
        ? process.env.ADMIN_EMAIL.toLowerCase()
        : null;

    const defaultAdmin = defaultEmail
        ? await User.findOne({
              role: "admin",
              email: defaultEmail,
              isActive: true,
          })
        : null;

    if (defaultAdmin) {
        return defaultAdmin._id;
    }

    const fallbackAdmin = await User.findOne({
        role: "admin",
        isActive: true,
    }).sort({ createdAt: 1 });

    return fallbackAdmin ? fallbackAdmin._id : null;
};

const createAdminNotification = async ({
    type = "farmer_registered",
    title,
    message,
    data = {},
}) => {
    const recipient = await getAdminRecipientForNotification();

    if (!recipient) {
        console.error("No active admin recipient found for notification");
        return null;
    }

    const notification = await Notification.create({
        recipient,
        type,
        title,
        message,
        data,
    });

    return serializeNotification(notification);
};

const getNotifications = async (userId) => {
    const notifications = await Notification.find({ recipient: userId }).sort({
        createdAt: -1,
    });

    return notifications.map(serializeNotification);
};

const getUnreadNotificationCount = async (userId) => {
    return Notification.countDocuments({
        recipient: userId,
        isRead: false,
    });
};

const assertValidNotificationId = (notificationId) => {
    if (
        !mongoose.isValidObjectId(notificationId)
    ) {
        throw new ApiError(404, "Notification not found");
    }
};

const markNotificationAsRead = async (userId, notificationId) => {
    assertValidNotificationId(notificationId);

    const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, recipient: userId },
        { isRead: true },
        { new: true }
    );

    if (!notification) {
        throw new ApiError(404, "Notification not found");
    }

    return serializeNotification(notification);
};

const markAllNotificationsAsRead = async (userId) => {
    await Notification.updateMany(
        { recipient: userId, isRead: false },
        { isRead: true }
    );

    return null;
};

const deleteNotification = async (userId, notificationId) => {
    assertValidNotificationId(notificationId);

    const notification = await Notification.findOneAndDelete({
        _id: notificationId,
        recipient: userId,
    });

    if (!notification) {
        throw new ApiError(404, "Notification not found");
    }

    return null;
};

const deleteAllNotifications = async (userId) => {
    await Notification.deleteMany({ recipient: userId });

    return null;
};

export {
    createAdminNotification,
    getNotifications,
    getUnreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    deleteAllNotifications,
};