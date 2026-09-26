import { Router } from "express";
import multer from "multer";
import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";
import {
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
} from "../controllers/product.controller.js";
import {
    validateProductPayload,
    validateAvailabilityUpdate,
    validateStockItem,
    validateStockToggle,
    validateStockBulk,
} from "../validation/product.validation.js";

const router = Router();

const IMAGE_MAX_SIZE_BYTES = 5 * 1024 * 1024;

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: IMAGE_MAX_SIZE_BYTES },
});

const parseSingleImage = (req, res, next) => {
    upload.single("image")(req, res, (err) => {
        if (err) {
            const message =
                err?.code === "LIMIT_FILE_SIZE"
                    ? "Image must be smaller than 5MB"
                    : "Unable to process the uploaded image";
            return res.status(400).json({
                success: false,
                message,
                error: null,
            });
        }
        next();
    });
};

router.use(protect, authorize("farmer"));

router.get("/products/weekly-stock", getWeeklyStockList);
router.post("/products/weekly-stock", validateStockItem, createWeeklyStockEntry);
router.put(
    "/products/weekly-stock",
    validateStockBulk,
    saveWeeklyStockTemplate
);
router.patch(
    "/products/weekly-stock/:id/toggle",
    validateStockToggle,
    toggleWeeklyStockEntry
);
router.put(
    "/products/weekly-stock/:id",
    validateStockItem,
    updateWeeklyStockEntry
);
router.delete("/products/weekly-stock/:id", removeWeeklyStockEntry);

router.get("/products", listProducts);
router.get("/products/requests", listProductRequests);
router.post("/products/image", parseSingleImage, uploadImage);
router.post("/products", validateProductPayload, createNewProduct);
router.get("/products/:id", getProduct);
router.put("/products/:id", validateProductPayload, updateExistingProduct);
router.delete("/products/:id", removeProduct);
router.patch(
    "/products/:id/availability",
    validateAvailabilityUpdate,
    changeAvailability
);
router.patch("/products/:id/resubmit", resubmitRejectedProduct);

export default router;