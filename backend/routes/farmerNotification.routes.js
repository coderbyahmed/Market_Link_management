import { Router } from "express";
import protect from "../middleware/auth.middleware.js";
import {
    getNotificationsList,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    removeOne,
    removeAll,
} from "../controllers/notification.controller.js";

const router = Router();

router.use(protect);

router.get("/notifications", getNotificationsList);
router.get("/notifications/unread-count", getUnreadCount);
router.patch("/notifications/read-all", markAllAsRead);
router.patch("/notifications/:id/read", markAsRead);
router.delete("/notifications/:id", removeOne);
router.delete("/notifications", removeAll);

export default router;