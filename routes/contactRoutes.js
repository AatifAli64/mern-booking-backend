import express from "express";
import Contact from "../models/contact.js"; // Ensure casing matches your file
import { protect, restrictTo } from "../middlewares/auth.js"; // Import Auth Middleware

const router = express.Router();

// @desc    Create a new contact message (Public)
// @route   POST /api/contact
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    const newContact = await Contact.create({
      name,
      email,
      phone,
      message
    });

    res.status(201).json({ success: true, data: newContact });
  } catch (error) {
    console.error("Error saving contact message:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
});

// @desc    Get All Messages (Admin Only) --- THIS WAS MISSING
// @route   GET /api/contact
router.get("/", protect, restrictTo("admin"), async (req, res) => {
  try {
    // Sort by newest first
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @desc    Delete a Message (Admin Only) --- THIS WAS MISSING
// @route   DELETE /api/contact/:id
router.delete("/:id", protect, restrictTo("admin"), async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;