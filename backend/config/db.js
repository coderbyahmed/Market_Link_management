import mongoose from "mongoose";

const connectDB = async () => {
    try {
        console.log("🔌 Connecting to MongoDB...");

        const connection = await mongoose.connect(process.env.MONGO_DB_URI);

        console.log("🟢 MongoDB connected");
        console.log(`🗄️ Database: ${connection.connection.name}`);

        return connection;
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
        throw error;
    }
};

export default connectDB;