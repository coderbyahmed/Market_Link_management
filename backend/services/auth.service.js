import crypto from "crypto";
import User from "../models/User.model.js";
import { sendOtpEmail } from "./email.service.js";
import generateOtp from "../utils/otp.util.js";
import { generateToken } from "../utils/jwt.util.js";
import { hashValue, compareValues } from "../utils/hash.util.js";
import ApiError from "../utils/ApiError.js";

const OTP_EXPIRY_MINUTES = 5;
const RESET_TOKEN_EXPIRY_MINUTES = 15;

const PUBLIC_SAFE_ROLES = ["farmer", "customer"];

const registerUser = async ({ name, email, password, role }) => {
    if (!PUBLIC_SAFE_ROLES.includes(role)) {
        throw new ApiError(400, "Invalid role. Only farmer and customer can register");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(409, "Email already exists");
    }

    const user = await User.create({ name, email, password, role });

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
    };
};

const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    if (!user.isActive) {
        throw new ApiError(403, "Account is deactivated. Please contact support");
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid email or password");
    }

    const token = generateToken(user);

    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
        },
    };
};

const forgotPassword = async ({ email, role }) => {
    const user = await User.findOne({ email }).select("+otp +otpExpiry");

    if (role === "admin") {
        if (!user || user.role !== "admin") {
            throw new ApiError(
                400,
                "The email address you entered is not registered with an admin account"
            );
        }

        if (!user.isActive) {
            throw new ApiError(403, "Account is deactivated. Please contact support");
        }
    } else if (!user || !user.isActive) {
        return null;
    }

    if (user.otp && user.otpExpiry && user.otpExpiry > new Date()) {
        throw new ApiError(
            429,
            "An OTP has already been sent to your email. Please check your email or try again later"
        );
    }

    const generatedOtp = generateOtp();

    const otpHash = await hashValue(generatedOtp);
    const otpExpiry = new Date(
        Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
    );

    user.otp = otpHash;
    user.otpExpiry = otpExpiry;
    user.resetPasswordToken = null;
    user.resetPasswordExpiry = null;

    await user.save();

    try {
        await sendOtpEmail({
            to: user.email,
            name: user.name,
            otp: generatedOtp,
            expiryMinutes: OTP_EXPIRY_MINUTES,
        });
    } catch (emailError) {
        console.error("📧 OTP email could not be sent:", emailError.message);
    }

    return null;
};

const verifyOtp = async ({ email, otp }) => {
    const user = await User.findOne({ email }).select(
        "+otp +otpExpiry +resetPasswordToken +resetPasswordExpiry"
    );

    if (!user || !user.otp || !user.otpExpiry) {
        throw new ApiError(400, "Invalid OTP");
    }

    if (user.otpExpiry < new Date()) {
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        throw new ApiError(400, "This OTP has expired. Please request a new OTP");
    }

    const isOtpValid = await compareValues(otp, user.otp);

    if (!isOtpValid) {
        throw new ApiError(400, "Invalid OTP");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = await hashValue(resetToken);
    const resetTokenExpiry = new Date(
        Date.now() + RESET_TOKEN_EXPIRY_MINUTES * 60 * 1000
    );

    user.otp = null;
    user.otpExpiry = null;
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpiry = resetTokenExpiry;

    await user.save();

    return { resetToken };
};

const cancelPasswordReset = async ({ email }) => {
    const user = await User.findOne({ email });

    if (!user) return null;

    user.otp = null;
    user.otpExpiry = null;
    user.resetPasswordToken = null;
    user.resetPasswordExpiry = null;

    await user.save();

    return null;
};

const resetPassword = async ({ email, resetToken, newPassword }) => {
    const user = await User.findOne({ email }).select(
        "+resetPasswordToken +resetPasswordExpiry"
    );

    if (!user || !user.resetPasswordToken || !user.resetPasswordExpiry) {
        throw new ApiError(400, "Invalid or expired reset token");
    }

    if (user.resetPasswordExpiry < new Date()) {
        user.resetPasswordToken = null;
        user.resetPasswordExpiry = null;
        await user.save();

        throw new ApiError(400, "Reset token has expired. Please request a new one");
    }

    const isTokenValid = await compareValues(
        resetToken,
        user.resetPasswordToken
    );

    if (!isTokenValid) {
        throw new ApiError(400, "Invalid or expired reset token");
    }

    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpiry = null;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    return null;
};

export {
    registerUser,
    loginUser,
    forgotPassword,
    verifyOtp,
    cancelPasswordReset,
    resetPassword,
};