import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.model.js";

console.log("🚀 Admin seeder starting...");

dotenv.config();

const run = async () => {
    const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!ADMIN_EMAIL) {
        console.log("❌ ADMIN_EMAIL is missing from .env");
        process.exit(1);
    }

    if (!ADMIN_PASSWORD) {
        console.log("❌ ADMIN_PASSWORD is missing from .env");
        process.exit(1);
    }

    await connectDB();

    const email = ADMIN_EMAIL.toLowerCase();
    console.log("👤 Checking default Admin...");

    const existing = await User.findOne({ email });

    if (existing) {
        console.log("⚠️ Admin already exists.");
    } else {
        console.log("👤 Creating default Admin...");
        console.log(`📧 Admin email: ${email}`);

        await User.create({
            name: "MarketLink Admin",
            email,
            password: ADMIN_PASSWORD,
            role: "admin",
        });

        console.log("✅ Default Admin created successfully.");
    }

    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
    process.exit(0);
};

run().catch(async (error) => {
    console.log(`❌ Admin seeding failed: ${error.message}`);
    try {
        await mongoose.connection.close();
    } catch {
        // ignore close errors during cleanup
    }
    process.exit(1);
});