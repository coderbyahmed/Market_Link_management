import mongoose from "mongoose";

export const PRODUCT_CATEGORIES = [
    "vegetables",
    "fruits",
    "dairy",
    "herbs",
    "grains",
    "organic",
    "other",
];

export const PRODUCT_UNITS = [
    "kg",
    "g",
    "piece",
    "dozen",
    "liter",
    "bundle",
    "box",
];

export const PRODUCT_AVAILABILITIES = ["available", "sold_out", "unavailable"];

export const PRODUCT_STATUSES = ["pending", "approved", "rejected"];

const productSchema = new mongoose.Schema(
    {
        farmer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Farmer is required"],
            index: true,
        },
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
            maxlength: [80, "Product name cannot exceed 80 characters"],
        },
        description: {
            type: String,
            trim: true,
            default: "",
            maxlength: [500, "Description cannot exceed 500 characters"],
        },
        category: {
            type: String,
            enum: PRODUCT_CATEGORIES,
            required: [true, "Category is required"],
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0.01, "Price must be greater than 0"],
        },
        unit: {
            type: String,
            enum: PRODUCT_UNITS,
            required: [true, "Unit is required"],
        },
        quantity: {
            type: Number,
            required: [true, "Quantity is required"],
            min: [0, "Quantity cannot be negative"],
        },
        availability: {
            type: String,
            enum: PRODUCT_AVAILABILITIES,
            default: "available",
        },
        status: {
            type: String,
            enum: PRODUCT_STATUSES,
            default: "pending",
        },
        adminRemark: {
            type: String,
            trim: true,
            default: "",
        },
        image: {
            type: String,
            default: "",
        },
        imagePublicId: {
            type: String,
            default: "",
        },
        approvedAt: {
            type: Date,
            default: null,
        },
        rejectedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model("Product", productSchema);

export default Product;