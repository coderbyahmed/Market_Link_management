import { Router } from "express";
import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";
import {
    getAllUsersList,
    getFarmersList,
    getUserDetails,
    approveFarmerProfile,
    deactivateAccount,
    activateAccount,
} from "../controllers/userManagement.controller.js";

const router = Router();

router.use(protect, authorize("admin"));

router.get("/users", getAllUsersList);
router.get("/users/farmers", getFarmersList);
router.patch("/users/:userId/approve", approveFarmerProfile);
router.patch("/users/:userId/deactivate", deactivateAccount);
router.patch("/users/:userId/activate", activateAccount);
router.get("/users/:id", getUserDetails);

export default router;