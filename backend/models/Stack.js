import mongoose from "mongoose";

const stackSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    title: { type: String, required: true },
    description: { type: String, required: true }, // "when you are hungry at night"

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: true,
      default: null, // fix
    },

    parentStackId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stack",
      default: null,
    },

    items: [
      {
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
        position: Number,
        default: [],
      },
    ],

    likeCount: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 },
    remixCount: { type: Number, default: 0 },

    swipeRight: { type: Number, default: 0 },
    swipeLeft: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Stack", stackSchema);
