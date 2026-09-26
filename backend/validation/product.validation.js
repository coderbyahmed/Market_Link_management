import mongoose from "mongoose";
import {
    PRODUCT_CATEGORIES,
    PRODUCT_UNITS,
    PRODUCT_AVAILABILITIES,
} from "../models/Product.model.js";
import { WEEK_DAYS } from "../models/WeeklyStock.model.js";

const sendValidationError = (res, message) => {
    return res.status(400).json({
        success: false,
        message,
        error: null,
    });
};

const isPositiveNumber = (value) =>
    typeof value === "number" && Number.isFinite(value) && value > 0;

const isNonNegativeNumber = (value) =>
    typeof value === "number" && Number.isFinite(value) && value >= 0;

const isPlainObject = (value) =>
    value !== null && typeof value === "object" && !Array.isArray(value);

const validateProductPayload = (req, res, next) => {
    const {
        name,
        description,
        category,
        price,
        unit,
        quantity,
        availability,
    } = req.body;

    if (
        !name ||
        !category ||
        price === undefined ||
        price === null ||
        !unit ||
        quantity === undefined ||
        quantity === null ||
        !availability
    ) {
        return sendValidationError(res, "All product fields are required");
    }

    if (typeof name !== "string" || !name.trim()) {
        return sendValidationError(res, "Product name is required");
    }

    if (name.trim().length < 2 || name.trim().length > 80) {
        return sendValidationError(
            res,
            "Product name must be between 2 and 80 characters"
        );
    }

    if (description !== undefined && description !== null && description !== "") {
        if (typeof description !== "string") {
            return sendValidationError(
                res,
                "Description must be a valid string"
            );
        }

        if (description.trim().length > 500) {
            return sendValidationError(
                res,
                "Description cannot exceed 500 characters"
            );
        }
    }

    if (!PRODUCT_CATEGORIES.includes(category)) {
        return sendValidationError(res, "Please choose a valid category");
    }

    if (!isPositiveNumber(price)) {
        return sendValidationError(res, "Price must be greater than 0");
    }

    if (!PRODUCT_UNITS.includes(unit)) {
        return sendValidationError(res, "Please choose a valid unit");
    }

    if (!isNonNegativeNumber(quantity)) {
        return sendValidationError(res, "Quantity cannot be negative");
    }

    if (!PRODUCT_AVAILABILITIES.includes(availability)) {
        return sendValidationError(res, "Please choose a valid availability");
    }

    next();
};

const validateAvailabilityUpdate = (req, res, next) => {
    const { availability } = req.body;

    if (!PRODUCT_AVAILABILITIES.includes(availability)) {
        return sendValidationError(res, "Please choose a valid availability");
    }

    next();
};

const validateStockItemData = ({
    productId,
    day,
    quantity,
    unit,
    price,
    availability,
}) => {
    if (
        !productId ||
        !day ||
        quantity === undefined ||
        quantity === null ||
        !unit ||
        price === undefined ||
        price === null ||
        !availability
    ) {
        return "All stock fields are required";
    }

    if (!mongoose.isValidObjectId(productId)) {
        return "Please select a valid product";
    }

    if (!WEEK_DAYS.includes(day)) {
        return "Please choose a valid day";
    }

    if (!isNonNegativeNumber(quantity)) {
        return "Quantity cannot be negative";
    }

    if (!PRODUCT_UNITS.includes(unit)) {
        return "Please choose a valid unit";
    }

    if (!isPositiveNumber(price)) {
        return "Price must be greater than 0";
    }

    if (!PRODUCT_AVAILABILITIES.includes(availability)) {
        return "Please choose a valid availability";
    }

    return null;
};

const validateStockItem = (req, res, next) => {
    const { productId, day, quantity, unit, price, availability } = req.body;
    const errorMessage = validateStockItemData({
        productId,
        day,
        quantity,
        unit,
        price,
        availability,
    });

    if (errorMessage) {
        return sendValidationError(res, errorMessage);
    }

    next();
};

const validateStockToggle = (req, res, next) => {
    const { enabled } = req.body;

    if (typeof enabled !== "boolean") {
        return sendValidationError(res, "Enabled state must be a boolean");
    }

    next();
};

const validateStockBulk = (req, res, next) => {
    const { items } = req.body;

    if (!Array.isArray(items)) {
        return sendValidationError(
            res,
            "Weekly stock template must be an array of items"
        );
    }

    for (const item of items) {
        if (!isPlainObject(item)) {
            return sendValidationError(
                res,
                "Every stock item must be an object"
            );
        }

        const errorMessage = validateStockItemData(item);

        if (errorMessage) {
            return sendValidationError(res, errorMessage);
        }
    }

    next();
};

export {
    validateProductPayload,
    validateAvailabilityUpdate,
    validateStockItem,
    validateStockToggle,
    validateStockBulk,
};