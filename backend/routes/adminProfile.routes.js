import { Router } from "express";
import multer from "multer";
import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";
import {
    getProfile,
    updateProfile,
    uploadImage,
    removeImage,
    updatePassword,
} from "../controllers/adminProfile.controller.js";
import {
    validateAdminProfileUpdate,
    validateChangePassword,
} from "../validation/adminProfile.validation.js";

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

router.get("/profile", protect, authorize("admin"), getProfile);
router.put(
    "/profile",
    protect,
    authorize("admin"),
    validateAdminProfileUpdate,
    updateProfile
);
router.post(
    "/profile/image",
    protect,
    authorize("admin"),
    parseSingleImage,
    uploadImage
);
router.delete(
    "/profile/image",
    protect,
    authorize("admin"),
    removeImage
);
router.put(
    "/profile/password",
    protect,
    authorize("admin"),
    validateChangePassword,
    updatePassword
);

export default router;