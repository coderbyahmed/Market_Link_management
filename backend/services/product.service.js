import mongoose from "mongoose";
import Product from "../models/Product.model.js";
import WeeklyStock from "../models/WeeklyStock.model.js";
import User from "../models/User.model.js";
import cloudinary from "../config/Cloudinary.js";
import ApiError from "../utils/ApiError.js";
import { createAdminNotification } from "./notification.service.js";

const PRODUCT_IMAGE_FOLDER = "Market Link Management/product images";
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const serializeProduct = (product) => ({
    id: product._id,
    name: product.name,
    description: product.description,
    category: product.category,
    price: product.price,
    unit: product.unit,
    quantity: product.quantity,
    availability: product.availability,
    status: product.status,
    adminRemark: product.adminRemark || "",
    image: product.image || "",
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
});

const assertProductAccess = async (farmerId, productId) => {
    if (!mongoose.isValidObjectId(productId)) {
        throw new ApiError(404, "Product not found");
    }

    const product = await Product.findOne({
        _id: productId,
        farmer: farmerId,
    });

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return product;
};

const getFarmerProducts = async (farmerId) => {
    const products = await Product.find({ farmer: farmerId }).sort({
        createdAt: -1,
    });

    return products.map(serializeProduct);
};

const getFarmerProductById = async (farmerId, productId) => {
    const product = await assertProductAccess(farmerId, productId);
    return serializeProduct(product);
};

const createProduct = async (farmerId, input) => {
    const product = await Product.create({
        farmer: farmerId,
        name: input.name.trim(),
        description: typeof input.description === "string"
            ? input.description.trim()
            : "",
        category: input.category,
        price: input.price,
        unit: input.unit,
        quantity: input.quantity,
        availability: input.availability,
        status: "pending",
        adminRemark: "",
        image: input.image || "",
        imagePublicId: input.imagePublicId || "",
    });

    try {
        const farmer = await User.findById(farmerId);

        await createAdminNotification({
            type: "product_submitted",
            title: "New Product Submitted",
            message: `${farmer ? farmer.name : "A farmer"} submitted a new product for review: ${product.name}.`,
            data: {
                productId: product._id,
                productName: product.name,
                farmerId,
                productStatus: product.status,
            },
        });
    } catch (notificationError) {
        console.error(
            "Admin product submission notification could not be created:",
            notificationError.message
        );
    }

    return serializeProduct(product);
};

const updateProduct = async (farmerId, productId, input) => {
    const product = await assertProductAccess(farmerId, productId);

    const previousPublicId = product.imagePublicId;
    const newPublicId =
        typeof input.imagePublicId === "string"
            ? input.imagePublicId.trim()
            : previousPublicId;
    const newImage =
        typeof input.image === "string"
            ? input.image.trim()
            : product.image;

    product.name = input.name.trim();
    product.description =
        typeof input.description === "string"
            ? input.description.trim()
            : product.description;
    product.category = input.category;
    product.price = input.price;
    product.unit = input.unit;
    product.quantity = input.quantity;
    product.availability = input.availability;

    if (newPublicId !== previousPublicId) {
        if (previousPublicId) {
            try {
                await cloudinary.uploader.destroy(previousPublicId, {
                    resource_type: "image",
                });
            } catch (deletionError) {
                console.error(
                    "Cloudinary old product image deletion failed:",
                    deletionError.message
                );
            }
        }

        product.imagePublicId = newPublicId;
        product.image = newPublicId ? newImage : "";
    } else if (newImage !== product.image) {
        product.image = newImage;
    }

    await product.save();

    return serializeProduct(product);
};

const deleteProduct = async (farmerId, productId) => {
    const product = await assertProductAccess(farmerId, productId);

    if (product.imagePublicId) {
        try {
            await cloudinary.uploader.destroy(product.imagePublicId, {
                resource_type: "image",
            });
        } catch (deletionError) {
            console.error(
                "Cloudinary product image deletion failed:",
                deletionError.message
            );
        }
    }

    await Product.deleteOne({ _id: product._id, farmer: farmerId });
    await WeeklyStock.deleteMany({ farmer: farmerId, product: product._id });

    return null;
};

const updateProductAvailability = async (farmerId, productId, availability) => {
    const product = await assertProductAccess(farmerId, productId);

    product.availability = availability;
    await product.save();

    return serializeProduct(product);
};

const resubmitProduct = async (farmerId, productId) => {
    const product = await assertProductAccess(farmerId, productId);

    if (product.status !== "rejected") {
        throw new ApiError(
            400,
            "Only rejected products can be resubmitted for review"
        );
    }

    product.status = "pending";
    product.adminRemark = "";
    await product.save();

    return serializeProduct(product);
};

const uploadProductImage = async (farmerId, file) => {
    if (!file || !file.buffer) {
        throw new ApiError(400, "No image file was provided");
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
        throw new ApiError(
            400,
            "Unsupported image type. Only JPG, PNG and WEBP images are allowed"
        );
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
        throw new ApiError(400, "Image must be smaller than 5MB");
    }

    let uploadResult;

    try {
        const dataUri = `data:${file.mimetype};base64,${file.buffer.toString(
            "base64"
        )}`;

        uploadResult = await cloudinary.uploader.upload(dataUri, {
            folder: PRODUCT_IMAGE_FOLDER,
            resource_type: "image",
        });
    } catch (uploadError) {
        console.error("Cloudinary upload failed:", uploadError.message);
        throw new ApiError(
            500,
            "Unable to upload product image. Please try again"
        );
    }

    return {
        image: uploadResult.secure_url,
        imagePublicId: uploadResult.public_id,
    };
};

export {
    getFarmerProducts,
    getFarmerProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    updateProductAvailability,
    resubmitProduct,
    uploadProductImage,
};