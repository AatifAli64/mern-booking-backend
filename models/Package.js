import mongoose from "mongoose";

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: String, required: true }, // e.g., "3 Days / 2 Nights"
  
  // Type handles your logic (Private, Public, Honeymoon)
  type: { 
    type: String, 
    enum: ['public', 'private', 'honeymoon'], 
    required: true 
  },
  
  startLocation: { type: String, required: true },
  stopLocation: { type: String, required: true },
  transport: { type: String, default: "Standard" }, // e.g., "Luxury Bus", "Car"
  
  // We store the PATH to the image (e.g., "uploads/image-123.jpg")
  image: { type: String, required: true }, 
  
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Package", packageSchema);