import crypto from "crypto";
import User from "../models/User.model.js";
import { sendCustomerWelcomeEmail, sendOtpEmail } from "./email.service.js";
import { createAdminNotification } from "./notification.service.js";
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

    const user = await User.create({
        name,
        email,
        password,
        role,
        isApproved: role === "farmer" ? false : true,
    });

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
    };
};

const registerCustomer = async ({
    name,
    email,
    phone,
    password,
}) => {
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
        throw new ApiError(409, "An account with this email already exists");
    }

    const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        phone: phone.trim(),
        password,
        role: "customer",
        isApproved: true,
    });

    try {
        await createAdminNotification({
            type: "customer_registered",
            title: "New Customer Registered",
            message: `A new customer account has been registered: ${user.name}.`,
            data: {
                customerId: user._id,
                customerName: user.name,
                customerEmail: user.email,
                customerPhone: user.phone,
                registeredAt: user.createdAt,
            },
        });
    } catch (notificationError) {
        console.error(
            "Admin customer registration notification could not be created:",
            notificationError.message
        );
    }

    let emailSent = true;

    try {
        await sendCustomerWelcomeEmail({
            to: user.email,
            name: user.name,
        });
    } catch (emailError) {
        emailSent = false;
        console.error(
            "Customer registration email could not be sent:",
            emailError.message
        );
    }

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        emailSent,
        createdAt: user.createdAt,
    };
};

const registerFarmer = async ({
    name,
    email,
    phone,
    farmSpecialization,
    password,
}) => {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(409, "An account with this email already exists");
    }

    const user = await User.create({
        name,
        email,
        phone,
        farmSpecialization,
        password,
        role: "farmer",
        isApproved: false,
    });

    try {
        await createAdminNotification({
            type: "farmer_registered",
            title: "New Farmer Registered",
            message: `${user.name} has registered as a new farmer and is awaiting admin approval.`,
            data: {
                farmerId: user._id,
                farmerName: user.name,
                farmerEmail: user.email,
                farmerPhone: user.phone,
                farmSpecialization: user.farmSpecialization,
            },
        });
    } catch (notificationError) {
        console.error(
            "Admin notification could not be created:",
            notificationError.message
        );
    }

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        farmSpecialization: user.farmSpecialization,
        role: user.role,
        isApproved: user.isApproved,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
    };
};

const loginUser = async ({ email, password, role }) => {
    const requestedRole = role === "farmer" ? "farmer" : null;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    if (requestedRole && user.role !== requestedRole) {
        throw new ApiError(401, "Invalid email or password");
    }

    if (user.role === "farmer" && !user.isApproved) {
        throw new ApiError(403, "Your account is awaiting admin approval");
    }

    if (!user.isActive) {
        throw new ApiError(
            403,
            "Your account has been deactivated by the administrator. You cannot log in while your account is inactive. Please contact the administrator for further assistance.",
            "ACCOUNT_DEACTIVATED"
        );
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

const loginCustomer = async ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select(
        "+password"
    );

    if (!user) {
        throw new ApiError(
            404,
            "No customer account found with this email address."
        );
    }

    if (user.role !== "customer") {
        throw new ApiError(
            403,
            "This account is not registered as a customer."
        );
    }

    if (!user.isActive) {
        throw new ApiError(
            403,
            "Your account has been deactivated by the administrator. You cannot log in while your account is inactive. Please contact the administrator for further assistance.",
            "ACCOUNT_DEACTIVATED"
        );
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Incorrect password. Please try again.");
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
    } else if (role === "farmer") {
        if (!user || user.role !== "farmer") {
            throw new ApiError(400, "Farmer account not found");
        }

        if (!user.isActive) {
            throw new ApiError(403, "Account is deactivated. Please contact support");
        }
    } else if (role === "customer") {
        if (!user || user.role !== "customer") {
            throw new ApiError(
                400,
                "No customer account found with this email address"
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

const verifyOtp = async ({ email, otp, role }) => {
    const user = await User.findOne({ email }).select(
        "+otp +otpExpiry +resetPasswordToken +resetPasswordExpiry"
    );

    if (!user || !user.otp || !user.otpExpiry) {
        throw new ApiError(400, "Invalid OTP");
    }

    if (role && user.role !== role) {
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

const cancelPasswordReset = async ({ email, role }) => {
    const user = await User.findOne({ email });

    if (!user) return null;

    if (role && user.role !== role) return null;

    user.otp = null;
    user.otpExpiry = null;
    user.resetPasswordToken = null;
    user.resetPasswordExpiry = null;

    await user.save();

    return null;
};

const resetPassword = async ({ email, resetToken, newPassword, role }) => {
    const user = await User.findOne({ email }).select(
        "+resetPasswordToken +resetPasswordExpiry"
    );

    if (!user || !user.resetPasswordToken || !user.resetPasswordExpiry) {
        throw new ApiError(400, "Invalid or expired reset token");
    }

    if (role && user.role !== role) {
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
    registerCustomer,
    registerFarmer,
    loginUser,
    loginCustomer,
    forgotPassword,
    verifyOtp,
    cancelPasswordReset,
    resetPassword,
};