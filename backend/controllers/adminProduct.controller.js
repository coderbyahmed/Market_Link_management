import {
    listAllProducts,
    listProductsByStatus,
    getProductDetails,
    approveProduct,
    rejectProduct,
} from "../services/adminProduct.service.js";

const getAllProducts = async (req, res) => {
    const data = await listAllProducts({
        category: req.query.category,
        availability: req.query.availability,
    });

    return res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        data,
    });
};

const getPendingProducts = async (req, res) => {
    const data = await listProductsByStatus("pending", {
        category: req.query.category,
        availability: req.query.availability,
    });

    return res.status(200).json({
        success: true,
        message: "Pending products fetched successfully",
        data,
    });
};

const getApprovedProducts = async (req, res) => {
    const data = await listProductsByStatus("approved", {
        category: req.query.category,
        availability: req.query.availability,
    });

    return res.status(200).json({
        success: true,
        message: "Approved products fetched successfully",
        data,
    });
};

const getProduct = async (req, res) => {
    const data = await getProductDetails(req.params.id);

    return res.status(200).json({
        success: true,
        message: "Product fetched successfully",
        data,
    });
};

const approveProductRequest = async (req, res) => {
    const data = await approveProduct(req.params.id);

    return res.status(200).json({
        success: true,
        message: "Product approved successfully",
        data,
    });
};

const rejectProductRequest = async (req, res) => {
    const data = await rejectProduct(req.params.id, req.body?.reason);

    return res.status(200).json({
        success: true,
        message: "Product rejected successfully",
        data,
    });
};

export {
    getAllProducts,
    getPendingProducts,
    getApprovedProducts,
    getProduct,
    approveProductRequest,
    rejectProductRequest,
};