import express from "express";
import { getPackages, createPackage, deletePackage, updatePackage } from "../controllers/packageController.js";
import { protect, restrictTo } from "../middlewares/auth.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Public Route
router.get("/", getPackages);

// Admin Routes
router.post("/", protect, restrictTo("admin"), upload.single("image"), createPackage);
router.put("/:id", protect, restrictTo("admin"), upload.single("image"), updatePackage);
router.delete("/:id", protect, restrictTo("admin"), deletePackage);

export default router;