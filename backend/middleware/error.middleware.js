import ApiError from "../utils/ApiError.js";

const notFound = (req, res, next) => {
    next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

const errorHandler = (err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            code: err.code || null,
            error: null,
        });
    }

    if (err.name === "ValidationError") {
        const message = Object.values(err.errors)
            .map((e) => e.message)
            .join(", ");
        return res.status(400).json({
            success: false,
            message,
            error: null,
        });
    }

    if (err.code === 11000) {
        return res.status(409).json({
            success: false,
            message: "Duplicate value. Resource already exists",
            error: null,
        });
    }

    if (err.type === "entity.parse.failed") {
        return res.status(400).json({
            success: false,
            message: "Invalid JSON payload",
            error: null,
        });
    }

    if (err.status && err.status >= 400 && err.status < 500) {
        return res.status(err.status).json({
            success: false,
            message: err.message,
            error: null,
        });
    }

    console.error("❌ Unhandled error:", err.message);
    return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? err.message : null,
    });
};

export { notFound, errorHandler };