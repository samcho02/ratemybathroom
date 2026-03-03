import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  name: String,
  description: String,
  imageUrl: String,
  metadata: Object,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Item", itemSchema);
