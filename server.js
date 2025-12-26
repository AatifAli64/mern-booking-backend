import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import path from "path"; 
import User from "./models/User.js"; 
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import packageRoutes from "./routes/packageRoutes.js"; 
import adminRoutes from "./routes/adminRoutes.js";     

import { errorHandler } from "./middlewares/errorHandler.js";
import contactRoutes from "./routes/contactRoutes.js";


dotenv.config();
const app = express();

// Connects to DB
connectDB();

// --- CREATED DEFAULT ADMIN ---
const createDefaultAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ role: "admin" });
    if (!existingAdmin) {
      console.log("No admin found. Creating default admin...");
      await User.create({
        name: "Super Admin",
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD, 
        role: "admin"
      });
      console.log("Admin account created successfully!");
    } else {
      console.log("Admin account already exists.");
    }
  } catch (error) {
    console.error("Error checking/creating admin:", error);
  }
};
createDefaultAdmin();
// ----------------------------

// Allowed cross-origin resource sharing so the frontend can display images
app.use(helmet({
  crossOriginResourcePolicy: false,
}));  
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(morgan("dev"));
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// --- STATIC FILES (For Images) ---
// This is allowing the frontend to access http://localhost:5000/uploads/image.jpg
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// --- ROUTES ---
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/packages", packageRoutes); 
app.use("/api/admin", adminRoutes);      
app.use("/api/contact", contactRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;