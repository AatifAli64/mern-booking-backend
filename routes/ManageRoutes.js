import express from "express";
import Contact from "../models/contact.js";
import { protect, restrictTo } from "../middlewares/auth.js"; // Import Auth Middleware

const router = express.Router();

// 1. PUBLIC: Send a message
router.post("/", async (req, res) => {
  try {
    const newContact = await Contact.create(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. ADMIN ONLY: Get All Messages
router.get("/", protect, restrictTo("admin"), async (req, res) => {
  try {
    // Sort by newest first (-1)
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. ADMIN ONLY: Delete a Message
router.delete("/:id", protect, restrictTo("admin"), async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;