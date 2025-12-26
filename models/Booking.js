import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  packageName: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  guests: { type: Number, default: 1 },
  price: { type: Number, required: true },
  images: [{ type: String }], // file paths in uploads/
  status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Booking", bookingSchema);
