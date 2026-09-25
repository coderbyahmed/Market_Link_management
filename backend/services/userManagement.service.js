import mongoose from "mongoose";
import User from "../models/User.model.js";
import ApiError from "../utils/ApiError.js";
import { sendFarmerApprovalEmail } from "./email.service.js";

const serializeUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    role: user.role,
    profileImage: user.profileImage || "",
    isActive: user.isActive,
    isApproved: user.isApproved,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
});

const getAllUsers = async () => {
    const users = await User.find({ role: { $in: ["farmer", "customer"] } }).sort({
        createdAt: -1,
    });

    return users.map(serializeUser);
};

const getFarmers = async () => {
    const users = await User.find({ role: "farmer" }).sort({ createdAt: -1 });

    return users.map(serializeUser);
};

const getUserById = async (userId) => {
    if (!mongoose.isValidObjectId(userId)) {
        throw new ApiError(404, "User not found");
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return serializeUser(user);
};

const approveFarmer = async (farmerId) => {
    if (!mongoose.isValidObjectId(farmerId)) {
        throw new ApiError(404, "Farmer not found");
    }

    const user = await User.findById(farmerId);

    if (!user) {
        throw new ApiError(404, "Farmer not found");
    }

    if (user.role !== "farmer") {
        throw new ApiError(400, "Only farmer accounts can be approved");
    }

    if (user.isApproved) {
        throw new ApiError(400, "Farmer account is already approved");
    }

    user.isApproved = true;
    await user.save();

    let emailSent = false;

    try {
        await sendFarmerApprovalEmail({ to: user.email, name: user.name });
        emailSent = true;
    } catch (emailError) {
        console.error(
            "Farmer approval email could not be sent:",
            emailError.message
        );
    }

    return {
        user: serializeUser(user),
        emailSent,
    };
};

const assertFarmerAccount = async (userId) => {
    if (!mongoose.isValidObjectId(userId)) {
        throw new ApiError(404, "User not found");
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.role !== "farmer") {
        throw new ApiError(400, "Only farmer accounts can be modified here");
    }

    return user;
};

const deactivateUserAccount = async (userId) => {
    const user = await assertFarmerAccount(userId);

    if (!user.isActive) {
        throw new ApiError(400, "Account is already deactivated");
    }

    user.isActive = false;
    await user.save();

    return serializeUser(user);
};

const activateUserAccount = async (userId) => {
    const user = await assertFarmerAccount(userId);

    if (user.isActive) {
        throw new ApiError(400, "Account is already active");
    }

    user.isActive = true;
    await user.save();

    return serializeUser(user);
};

export {
    getAllUsers,
    getFarmers,
    getUserById,
    approveFarmer,
    deactivateUserAccount,
    activateUserAccount,
};