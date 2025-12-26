import express from "express";
import { 
    getAdminStats, 
    getAllUsers, 
    deleteUser,
    updateAdminProfile 
} from "../controllers/adminController.js";
import { protect, restrictTo } from "../middlewares/auth.js"; // Import restrictTo

const router = express.Router();

// protect = Must be logged in
// restrictTo('admin') = Must be an admin
router.get("/stats", protect, restrictTo("admin"), getAdminStats);
router.get("/users", protect, restrictTo("admin"), getAllUsers);
router.delete("/users/:id", protect, restrictTo("admin"), deleteUser);
router.put("/profile", protect, restrictTo("admin"), updateAdminProfile);

export default router;

