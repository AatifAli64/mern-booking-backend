import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { catchAsync } from "../utils/catchAsync.js";
import { sendEmail } from "../utils/email.js"; 

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

export const register = catchAsync(async (req, res) => {
  const { name, email, password, photo } = req.body;

  // 1. Check if user already exists
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: "Email already in use" });

  // 2. Create the user
  const user = await User.create({ name, email, password, photo });
  
  // 3. Generate Token
  const token = signToken(user._id);

  // 4. Send Welcome Email (Wrapped in try/catch so it doesn't crash registration if it fails)
  try {
    await sendEmail({
      to: user.email,
      subject: "Welcome to Booking App!",
      text: `Hi ${user.name},\n\nWelcome to our platform! We are excited to have you.\n\nBest,\nThe Team`,
      html: `<h1>Welcome ${user.name}!</h1><p>We are excited to have you on board.</p>`
    });
    console.log(`Email sent successfully to ${user.email}`);
  } catch (e) {
    console.warn("Email send failed:", e.message);
  }

  // 5. Send Response
  res.status(201).json({ 
    token, 
    user: { id: user._id, name: user.name, email: user.email, role: user.role } 
  });
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
  }

  const user = await User.findOne({ email }).select("+password");
  
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  
  const token = signToken(user._id);
  
  res.json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email, role: user.role } 
  });
});

export const getMe = catchAsync(async (req, res) => {
  res.json({ user: req.user });
});