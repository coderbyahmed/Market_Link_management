import mongoose from "mongoose";
import { PRODUCT_UNITS, PRODUCT_AVAILABILITIES } from "./Product.model.js";

export const WEEK_DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

const weeklyStockSchema = new mongoose.Schema(
    {
        farmer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Farmer is required"],
            index: true,
        },
        day: {
            type: String,
            enum: WEEK_DAYS,
            required: [true, "Day is required"],
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: [true, "Product is required"],
        },
        quantity: {
            type: Number,
            required: [true, "Quantity is required"],
            min: [0, "Quantity cannot be negative"],
        },
        unit: {
            type: String,
            enum: PRODUCT_UNITS,
            required: [true, "Unit is required"],
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0.01, "Price must be greater than 0"],
        },
        availability: {
            type: String,
            enum: PRODUCT_AVAILABILITIES,
            default: "available",
        },
        enabled: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

weeklyStockSchema.index(
    { farmer: 1, day: 1, product: 1 },
    { unique: true }
);

const WeeklyStock = mongoose.model("WeeklyStock", weeklyStockSchema);

export default WeeklyStock;