const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const PHONE_REGEX = /^[0-9+\-()\s.]{6,20}$/;
const MIN_PASSWORD_LENGTH = 6;

const sendValidationError = (res, message) => {
    return res.status(400).json({
        success: false,
        message,
        error: null,
    });
};

const validateAdminProfileUpdate = (req, res, next) => {
    const { name, email, phone } = req.body;

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

    if (typeof email !== "string" || !email.trim()) {
        return sendValidationError(res, "Email address is required");
    }

    if (!EMAIL_REGEX.test(email.trim().toLowerCase())) {
        return sendValidationError(res, "Please enter a valid email address");
    }

    if (typeof phone === "string" && phone.trim()) {
        if (!PHONE_REGEX.test(phone.trim())) {
            return sendValidationError(
                res,
                "Phone number must contain only digits, spaces, and + - ( ) characters"
            );
        }
    } else if (phone !== undefined && phone !== null && phone !== "") {
        return sendValidationError(res, "Phone number is not valid");
    }

    next();
};

const validateChangePassword = (req, res, next) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (
        typeof currentPassword !== "string" ||
        !currentPassword.trim()
    ) {
        return sendValidationError(res, "Current password is required");
    }

    if (
        typeof newPassword !== "string" ||
        !newPassword.trim()
    ) {
        return sendValidationError(res, "New password is required");
    }

    if (newPassword.length < MIN_PASSWORD_LENGTH || /\s/.test(newPassword)) {
        return sendValidationError(
            res,
            `Password must be at least ${MIN_PASSWORD_LENGTH} characters long and must not contain spaces`
        );
    }

    if (
        typeof confirmPassword !== "string" ||
        confirmPassword !== newPassword
    ) {
        return sendValidationError(res, "Passwords do not match");
    }

    next();
};

export { validateAdminProfileUpdate, validateChangePassword };