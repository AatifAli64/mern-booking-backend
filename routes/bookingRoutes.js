import express from "express";
import multer from "multer";
import path from "path";
import { protect, restrictTo } from "../middlewares/auth.js";
import {
  createBooking,
  getBookings,
  getBooking,
  updateBooking,
  deleteBooking
} from "../controllers/bookingController.js";

const router = express.Router();

// multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random()*1E9)}${ext}`);
  }
});
const upload = multer({ storage });

// public read: list public bookings (for demo, restrict later)
router.get("/", protect, getBookings);
router.post("/", protect, upload.array("images", 5), createBooking);
router.get("/:id", protect, getBooking);
router.patch("/:id", protect, upload.array("images", 5), updateBooking);
router.delete("/:id", protect, deleteBooking);
router.patch("/:id", protect, updateBooking);

export default router;
