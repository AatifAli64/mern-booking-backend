import Booking from "../models/Booking.js";
import { catchAsync } from "../utils/catchAsync.js";

// 1. CREATE BOOKING
export const createBooking = catchAsync(async (req, res) => {
  // Debugging logs
  console.log("Incoming Body:", req.body);
  console.log("Incoming Files:", req.files);

  const bookingData = {
    ...req.body,
    user: req.user._id, // Securely attach logged-in user ID
    price: Number(req.body.price),
    guests: Number(req.body.guests || 1),
  };

  // Add images if uploaded
  if (req.files && req.files.length > 0) {
    bookingData.images = req.files.map((f) => `/uploads/${f.filename}`);
  }

  const booking = await Booking.create(bookingData);

  res.status(201).json({ booking });
});

export const getBookings = catchAsync(async (req, res) => {
  // A. Pagination & Sorting Inputs
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;
  const { search, sort } = req.query;

  // B. Build the Query
  const queryObj = {};

  if (req.user.role === "user") {
    queryObj.user = req.user._id;
  }

  if (search) {
    queryObj.$or = [
      { packageName: { $regex: search, $options: "i" } },
      { destination: { $regex: search, $options: "i" } } // Added destination search
    ];
  }

  // C. Execute Query
  let query = Booking.find(queryObj)
    .populate("user", "name email") // Show user details
    .skip(skip)
    .limit(limit);

  if (sort) {
    const sortBy = sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  const bookings = await query;
  const total = await Booking.countDocuments(queryObj); // Count for pagination UI

  res.json({
    status: "success",
    total,
    page,
    limit,
    bookings
  });
});

// 3. READ ONE
export const getBooking = catchAsync(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate("user", "name email");

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  // Ownership Check
  if (req.user.role !== "admin" && booking.user._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "You are not allowed to view this booking" });
  }

  res.json({ booking });
});

// 4. UPDATE BOOKING
export const updateBooking = catchAsync(async (req, res) => {
  let booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  // Ownership Check
  if (req.user.role !== "admin" && booking.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "You cannot edit this booking" });
  }

  if (req.body.user) delete req.body.user;

  // Handle Image Update
  if (req.files && req.files.length > 0) {
    req.body.images = req.files.map((f) => `/uploads/${f.filename}`);
  }

  // Update logic
  booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // Return the updated document
    runValidators: true // Ensure data is valid
  });

  res.json({ booking });
});

// 5. DELETE BOOKING
export const deleteBooking = catchAsync(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  // Ownership Check
  if (req.user.role !== "admin" && booking.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "You cannot delete this booking" });
  }

  await Booking.findByIdAndDelete(req.params.id);

  res.json({ message: "Booking deleted successfully" });
});