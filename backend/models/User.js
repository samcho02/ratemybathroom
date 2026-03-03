// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
