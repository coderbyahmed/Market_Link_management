import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

console.log("🚀 Server starting...");

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log("✅ Server running");
            console.log(`🌐 URL: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Server crash/error:", error.message);
        process.exit(1);
    }
};

startServer();

const shutdown = (signal) => {
    console.log(`🛑 Server is shutting down (${signal})...`);
    process.exit(0);
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("unhandledRejection", (error) => {
    console.error("❌ Unhandled rejection:", error.message || error);
});