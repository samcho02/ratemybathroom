import mongoose from "mongoose";

const swipeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  direction: { type: String, enum: ["left", "right"] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Swipe", swipeSchema);
