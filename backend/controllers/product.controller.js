import {
    getFarmerProducts,
    getFarmerProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    updateProductAvailability,
    resubmitProduct,
    uploadProductImage,
} from "../services/product.service.js";
import {
    listWeeklyStock,
    createStockItem,
    updateStockItem,
    toggleStockItem,
    deleteStockItem,
    replaceWeeklyStock,
} from "../services/weeklyStock.service.js";

const listProducts = async (req, res) => {
    const data = await getFarmerProducts(req.user.id);

    return res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        data,
    });
};

const listProductRequests = async (req, res) => {
    const products = await getFarmerProducts(req.user.id);

    const data = products.map((product) => ({
        id: product.id,
        productId: product.id,
        productName: product.name,
        description: product.description,
        image: product.image,
        category: product.category,
        price: product.price,
        unit: product.unit,
        quantity: product.quantity,
        type: "New Listing",
        status: product.status,
        remark: product.adminRemark || "",
        submittedAt: product.createdAt,
        updatedAt: product.updatedAt,
    }));

    return res.status(200).json({
        success: true,
        message: "Product requests fetched successfully",
        data,
    });
};

const getProduct = async (req, res) => {
    const data = await getFarmerProductById(req.user.id, req.params.id);

    return res.status(200).json({
        success: true,
        message: "Product fetched successfully",
        data,
    });
};

const createNewProduct = async (req, res) => {
    const data = await createProduct(req.user.id, req.body);

    return res.status(201).json({
        success: true,
        message: "Product created successfully. It is now pending admin review.",
        data,
    });
};

const updateExistingProduct = async (req, res) => {
    const data = await updateProduct(req.user.id, req.params.id, req.body);

    return res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data,
    });
};

const removeProduct = async (req, res) => {
    await deleteProduct(req.user.id, req.params.id);

    return res.status(200).json({
        success: true,
        message: "Product deleted successfully",
    });
};

const changeAvailability = async (req, res) => {
    const data = await updateProductAvailability(
        req.user.id,
        req.params.id,
        req.body.availability
    );

    return res.status(200).json({
        success: true,
        message: "Availability updated successfully",
        data,
    });
};

const resubmitRejectedProduct = async (req, res) => {
    const data = await resubmitProduct(req.user.id, req.params.id);

    return res.status(200).json({
        success: true,
        message: "Product resubmitted for review successfully",
        data,
    });
};

const uploadImage = async (req, res) => {
    const data = await uploadProductImage(req.user.id, req.file);

    return res.status(200).json({
        success: true,
        message: "Product image uploaded successfully",
        data,
    });
};

const getWeeklyStockList = async (req, res) => {
    const data = await listWeeklyStock(req.user.id);

    return res.status(200).json({
        success: true,
        message: "Weekly stock fetched successfully",
        data,
    });
};

const createWeeklyStockEntry = async (req, res) => {
    const data = await createStockItem(req.user.id, req.body);

    return res.status(201).json({
        success: true,
        message: "Product added to weekly stock",
        data,
    });
};

const updateWeeklyStockEntry = async (req, res) => {
    const data = await updateStockItem(req.user.id, req.params.id, req.body);

    return res.status(200).json({
        success: true,
        message: "Weekly stock updated successfully",
        data,
    });
};

const toggleWeeklyStockEntry = async (req, res) => {
    const data = await toggleStockItem(req.user.id, req.params.id, req.body.enabled);

    return res.status(200).json({
        success: true,
        message: "Weekly stock availability updated successfully",
        data,
    });
};

const removeWeeklyStockEntry = async (req, res) => {
    const data = await deleteStockItem(req.user.id, req.params.id);

    return res.status(200).json({
        success: true,
        message: "Weekly stock item removed successfully",
        data,
    });
};

const saveWeeklyStockTemplate = async (req, res) => {
    const data = await replaceWeeklyStock(req.user.id, req.body.items);

    return res.status(200).json({
        success: true,
        message: "Weekly stock updated successfully.",
        data,
    });
};

export {
    listProducts,
    listProductRequests,
    getProduct,
    createNewProduct,
    updateExistingProduct,
    removeProduct,
    changeAvailability,
    resubmitRejectedProduct,
    uploadImage,
    getWeeklyStockList,
    createWeeklyStockEntry,
    updateWeeklyStockEntry,
    toggleWeeklyStockEntry,
    removeWeeklyStockEntry,
    saveWeeklyStockTemplate,
};