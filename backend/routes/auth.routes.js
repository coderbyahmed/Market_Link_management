import { Router } from "express";
import {
    register,
    registerCustomerController,
    login,
    loginCustomerController,
    forgotPasswordController,
    verifyOtpController,
    cancelOtpController,
    resetPasswordController,
} from "../controllers/auth.controller.js";
import {
    validateRegister,
    validateCustomerRegister,
    validateLogin,
    validateForgotPassword,
    validateVerifyOtp,
    validateCancelOtp,
    validateResetPassword,
} from "../validation/auth.validation.js";

const router = Router();

router.post("/customer/register", validateCustomerRegister, registerCustomerController);
router.post("/customer/login", validateLogin, loginCustomerController);
router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/forgot-password", validateForgotPassword, forgotPasswordController);
router.post("/verify-otp", validateVerifyOtp, verifyOtpController);
router.post("/cancel-otp", validateCancelOtp, cancelOtpController);
router.post("/reset-password", validateResetPassword, resetPasswordController);

export default router;