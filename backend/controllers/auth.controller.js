import {
    registerUser,
    registerCustomer,
    registerFarmer,
    loginUser,
    loginCustomer,
    forgotPassword,
    verifyOtp,
    cancelPasswordReset,
    resetPassword,
} from "../services/auth.service.js";

const register = async (req, res) => {
    if (req.body?.role === "customer") {
        return registerCustomerController(req, res);
    }

    const data = await registerUser(req.body);

    return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data,
    });
};

const registerCustomerController = async (req, res) => {
    const data = await registerCustomer(req.body);

    return res.status(201).json({
        success: true,
        message: "Account created successfully.",
        data,
    });
};

const registerFarmerController = async (req, res) => {
    const data = await registerFarmer(req.body);

    return res.status(201).json({
        success: true,
        message: "Farmer account created successfully",
        data,
    });
};

const login = async (req, res) => {
    const data = await loginUser(req.body);

    return res.status(200).json({
        success: true,
        message: "Login successful",
        data,
    });
};

const loginCustomerController = async (req, res) => {
    const data = await loginCustomer(req.body);

    return res.status(200).json({
        success: true,
        message: "Login successful.",
        data,
    });
};

const forgotPasswordController = async (req, res) => {
    await forgotPassword(req.body);

    return res.status(200).json({
        success: true,
        message: "If an account exists with this email, an OTP has been sent",
    });
};

const verifyOtpController = async (req, res) => {
    const data = await verifyOtp(req.body);

    return res.status(200).json({
        success: true,
        message: "OTP verified successfully",
        data,
    });
};

const cancelOtpController = async (req, res) => {
    await cancelPasswordReset(req.body);

    return res.status(200).json({
        success: true,
        message: "Password reset attempt has been cancelled",
    });
};

const resetPasswordController = async (req, res) => {
    await resetPassword(req.body);

    return res.status(200).json({
        success: true,
        message: "Password reset successfully. You can now login",
    });
};

export {
    register,
    registerCustomerController,
    registerFarmerController,
    login,
    loginCustomerController,
    forgotPasswordController,
    verifyOtpController,
    cancelOtpController,
    resetPasswordController,
};