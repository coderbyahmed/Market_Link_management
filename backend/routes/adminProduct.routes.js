import { Router } from "express";
import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";
import {
    getAllProducts,
    getPendingProducts,
    getApprovedProducts,
    getProduct,
    approveProductRequest,
    rejectProductRequest,
} from "../controllers/adminProduct.controller.js";

const router = Router();

router.use(protect, authorize("admin"));

router.get("/products/approved", getApprovedProducts);
router.get("/products/pending", getPendingProducts);
router.get("/products", getAllProducts);
router.get("/products/:id", getProduct);
router.patch("/products/:id/approve", approveProductRequest);
router.patch("/products/:id/reject", rejectProductRequest);

export default router;