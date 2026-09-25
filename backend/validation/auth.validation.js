const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const OTP_REGEX = /^\d{6}$/;
const PHONE_REGEX = /^[0-9+\-()\s.]{6,20}$/;
const MIN_PASSWORD_LENGTH = 6;
const ALLOWED_REGISTER_ROLES = ["farmer", "customer"];

const sendValidationError = (res, message) => {
    return res.status(400).json({
        success: false,
        message,
        error: null,
    });
};

const validateRegister = (req, res, next) => {
    if (req.body?.role === "customer") {
        return validateCustomerRegister(req, res, next);
    }

    const { name, email, password, role, confirmPassword } = req.body;

    if (!name || !email || !password || !role) {
        return sendValidationError(res, "All fields are required");
    }

    if (!EMAIL_REGEX.test(email)) {
        return sendValidationError(res, "Please enter a valid email");
    }

    if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
        return sendValidationError(
            res,
            `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
        );
    }

    if (confirmPassword && confirmPassword !== password) {
        return sendValidationError(res, "Passwords do not match");
    }

    if (!ALLOWED_REGISTER_ROLES.includes(role)) {
        return sendValidationError(
            res,
            "Invalid role. Only farmer and customer can register"
        );
    }

    next();
};

const validateCustomerRegister = (req, res, next) => {
    const { name, email, phone, password, confirmPassword } = req.body;

    if (!name || !email || !phone || !password || !confirmPassword) {
        return sendValidationError(
            res,
            "Full name, email address, phone number, password, and confirm password are required"
        );
    }

    if (typeof name !== "string" || !name.trim()) {
        return sendValidationError(res, "Full name is required");
    }

    const trimmedName = name.trim();

    if (trimmedName.length < 2 || trimmedName.length > 60) {
        return sendValidationError(
            res,
            "Full name must be between 2 and 60 characters"
        );
    }

    if (typeof email !== "string") {
        return sendValidationError(res, "Please enter a valid email address");
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(normalizedEmail)) {
        return sendValidationError(res, "Please enter a valid email address");
    }

    if (typeof phone !== "string" || !PHONE_REGEX.test(phone.trim())) {
        return sendValidationError(
            res,
            "Please enter a valid phone number"
        );
    }

    if (
        typeof password !== "string" ||
        password.length < MIN_PASSWORD_LENGTH
    ) {
        return sendValidationError(
            res,
            `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
        );
    }

    if (/\s/.test(password)) {
        return sendValidationError(res, "Password must not contain spaces");
    }

    if (typeof confirmPassword !== "string") {
        return sendValidationError(res, "Please confirm your password");
    }

    if (confirmPassword !== password) {
        return sendValidationError(res, "Passwords do not match");
    }

    req.body.name = trimmedName;
    req.body.email = normalizedEmail;
    req.body.phone = phone.trim();

    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return sendValidationError(res, "Email and password are required");
    }

    if (!EMAIL_REGEX.test(email)) {
        return sendValidationError(res, "Please enter a valid email");
    }

    next();
};

const validateForgotPassword = (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return sendValidationError(res, "Email is required");
    }

    if (!EMAIL_REGEX.test(email)) {
        return sendValidationError(res, "Please enter a valid email");
    }

    next();
};

const validateVerifyOtp = (req, res, next) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return sendValidationError(res, "Email and OTP are required");
    }

    if (!EMAIL_REGEX.test(email)) {
        return sendValidationError(res, "Please enter a valid email");
    }

    if (!OTP_REGEX.test(typeof otp === "string" ? otp : "")) {
        return sendValidationError(res, "OTP must be a 6-digit code");
    }

    next();
};

const validateCancelOtp = (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return sendValidationError(res, "Email is required");
    }

    if (!EMAIL_REGEX.test(email)) {
        return sendValidationError(res, "Please enter a valid email");
    }

    next();
};

const validateResetPassword = (req, res, next) => {
    const { email, resetToken, newPassword } = req.body;

    if (!email || !resetToken || !newPassword) {
        return sendValidationError(
            res,
            "Email, reset token, and new password are required"
        );
    }

    if (!EMAIL_REGEX.test(email)) {
        return sendValidationError(res, "Please enter a valid email");
    }

    if (
        typeof newPassword !== "string" ||
        newPassword.length < MIN_PASSWORD_LENGTH
    ) {
        return sendValidationError(
            res,
            `Password must be at least ${MIN_PASSWORD_LENGTH} characters long and must not contain spaces`
        );
    }

    if (/\s/.test(newPassword)) {
        return sendValidationError(
            res,
            "Password must not contain spaces"
        );
    }

    next();
};

export {
    validateRegister,
    validateCustomerRegister,
    validateLogin,
    validateForgotPassword,
    validateVerifyOtp,
    validateCancelOtp,
    validateResetPassword,
};