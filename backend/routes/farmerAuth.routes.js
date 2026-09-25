import { Router } from "express";
import {
    registerFarmerController,
    login,
    forgotPasswordController,
    verifyOtpController,
    cancelOtpController,
    resetPasswordController,
} from "../controllers/auth.controller.js";
import {
    validateFarmerRegister,
    validateFarmerLogin,
    validateFarmerForgotPassword,
    validateFarmerVerifyOtp,
    validateFarmerCancelOtp,
    validateFarmerResetPassword,
} from "../validation/farmerAuth.validation.js";

const router = Router();

const setFarmerRole = (req, res, next) => {
    if (req.body && typeof req.body === "object") {
        req.body.role = "farmer";
    }
    next();
};

router.use(setFarmerRole);

router.post("/register", validateFarmerRegister, registerFarmerController);
router.post("/login", validateFarmerLogin, login);
router.post(
    "/forgot-password",
    validateFarmerForgotPassword,
    forgotPasswordController
);
router.post("/verify-otp", validateFarmerVerifyOtp, verifyOtpController);
router.post("/cancel-otp", validateFarmerCancelOtp, cancelOtpController);
router.post(
    "/reset-password",
    validateFarmerResetPassword,
    resetPasswordController
);

export default router;