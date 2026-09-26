import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import farmerAuthRoutes from "./routes/farmerAuth.routes.js";
import adminProfileRoutes from "./routes/adminProfile.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import userManagementRoutes from "./routes/userManagement.routes.js";
import productRoutes from "./routes/product.routes.js";
import adminProductRoutes from "./routes/adminProduct.routes.js";
import farmerNotificationRoutes from "./routes/farmerNotification.routes.js";
import { notFound, errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth/farmer", farmerAuthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminProfileRoutes);
app.use("/api/admin", notificationRoutes);
app.use("/api/admin", userManagementRoutes);
app.use("/api/admin", adminProductRoutes);
app.use("/api/farmer", productRoutes);
app.use("/api/farmer", farmerNotificationRoutes);

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is running",
    });
});

app.use(notFound);
app.use(errorHandler);

export default app;