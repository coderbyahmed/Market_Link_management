import mongoose from "mongoose";
import Product from "../models/Product.model.js";
import User from "../models/User.model.js";
import ApiError from "../utils/ApiError.js";
import { createUserNotification } from "./notification.service.js";

const PRODUCT_STATUSES = ["pending", "approved", "rejected"];

const serializeAdminProduct = (product) => ({
    id: product._id,
    name: product.name,
    description: product.description || "",
    category: product.category,
    price: product.price,
    unit: product.unit,
    quantity: product.quantity,
    availability: product.availability,
    status: product.status,
    adminRemark: product.adminRemark || "",
    image: product.image || "",
    farmerId: product.farmer?._id?.toString() || "",
    farmerName: product.farmer?.name || "",
    farmerEmail: product.farmer?.email || "",
    approvedAt: product.approvedAt || null,
    rejectedAt: product.rejectedAt || null,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
});

const assertProductExists = async (productId) => {
    if (!mongoose.isValidObjectId(productId)) {
        throw new ApiError(404, "Product not found");
    }

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return product;
};

const buildProductQuery = ({ status, category, availability }) => {
    const query = {};

    if (status && PRODUCT_STATUSES.includes(status)) {
        query.status = status;
    }

    if (category) {
        query.category = category;
    }

    if (availability) {
        query.availability = availability;
    }

    return query;
};

const listAllProducts = async (options = {}) => {
    const products = await Product.find(buildProductQuery(options))
        .populate("farmer", "name email")
        .sort({ createdAt: -1 });

    return products.map(serializeAdminProduct);
};

const listProductsByStatus = async (status, options = {}) => {
    const products = await Product.find({
        status,
        ...buildProductQuery(options),
    })
        .populate("farmer", "name email")
        .sort({ createdAt: -1 });

    return products.map(serializeAdminProduct);
};

const getProductDetails = async (productId) => {
    const product = await assertProductExists(productId);

    const populated = await Product.findById(product._id).populate(
        "farmer",
        "name email"
    );

    return serializeAdminProduct(populated);
};

const approveProduct = async (productId) => {
    const product = await assertProductExists(productId);

    if (product.status !== "pending") {
        throw new ApiError(
            400,
            "Only pending products can be approved for review"
        );
    }

    product.status = "approved";
    product.adminRemark = "";
    product.approvedAt = new Date();
    product.rejectedAt = null;
    await product.save();

    try {
        const farmer = await User.findById(product.farmer);
        const farmerName = farmer?.name || "A farmer";

        await createUserNotification({
            userId: product.farmer,
            type: "product_approved",
            title: "Product Approved",
            message: `Your product "${product.name}" has been approved and is now live.`,
            data: {
                productId: product._id,
                productName: product.name,
                productStatus: "approved",
                farmerName,
            },
        });
    } catch (notificationError) {
        console.error(
            "Product approval farmer notification could not be created:",
            notificationError.message
        );
    }

    const populated = await Product.findById(product._id).populate(
        "farmer",
        "name email"
    );

    return serializeAdminProduct(populated);
};

const rejectProduct = async (productId, reason) => {
    const product = await assertProductExists(productId);

    if (
        product.status !== "pending" &&
        product.status !== "approved"
    ) {
        throw new ApiError(
            400,
            "Only pending or approved products can be rejected"
        );
    }

    const trimmedReason = typeof reason === "string" ? reason.trim() : "";

    if (!trimmedReason) {
        throw new ApiError(400, "Rejection reason is required");
    }

    product.status = "rejected";
    product.adminRemark = trimmedReason;
    product.rejectedAt = new Date();
    product.approvedAt = null;
    await product.save();

    try {
        const farmer = await User.findById(product.farmer);
        const farmerName = farmer?.name || "A farmer";

        await createUserNotification({
            userId: product.farmer,
            type: "product_rejected",
            title: "Product Rejected",
            message: `Your product "${product.name}" was rejected. Reason: ${trimmedReason}`,
            data: {
                productId: product._id,
                productName: product.name,
                productStatus: "rejected",
                reason: trimmedReason,
                farmerName,
            },
        });
    } catch (notificationError) {
        console.error(
            "Product rejection farmer notification could not be created:",
            notificationError.message
        );
    }

    const populated = await Product.findById(product._id).populate(
        "farmer",
        "name email"
    );

    return serializeAdminProduct(populated);
};

export {
    listAllProducts,
    listProductsByStatus,
    getProductDetails,
    approveProduct,
    rejectProduct,
};