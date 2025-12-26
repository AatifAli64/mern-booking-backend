import User from "../models/User.js";
import Booking from "../models/Booking.js"; // We need this for stats

// @desc    Get Admin Stats (Users & Revenue)
// @route   GET /api/admin/stats
export const getAdminStats = async (req, res) => {
  try {
    // 1. Count Total Users
    const totalUsers = await User.countDocuments();

    // 2. Calculate Total Revenue (Assuming Booking model has a 'price' field)
    // We only sum up bookings that are NOT cancelled
    const bookings = await Booking.find({ status: { $ne: "cancelled" } });
    const totalRevenue = bookings.reduce((acc, item) => acc + (item.price || 0), 0);
    
    // 3. Total Bookings Count
    const totalBookings = bookings.length;

    res.json({
      totalUsers,
      totalRevenue,
      totalBookings
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Get All Users
// @route   GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password"); // Don't send passwords
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete User
// @route   DELETE /api/admin/users/:id
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await User.deleteOne({ _id: req.params.id }); // Use deleteOne instead of remove
      res.json({ message: "User removed" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAdminProfile = async (req, res) => {
  try {
    // req.user.id comes from the 'protect' middleware
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update name if provided
    if (req.body.name) {
      user.name = req.body.name;
    }

    // Update password if provided
    if (req.body.password) {
      user.password = req.body.password; 
      // NOTE: This assumes your User model has a "pre-save" hook 
      // to hash the password automatically (like bcrypt). 
      // If not, you must hash it here manually before saving.
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};