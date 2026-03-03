import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import User from "./models/User.js";
import Category from "./models/Category.js";
import Item from "./models/Item.js";
import Swipe from "./models/Swipe.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const app = express();
app.use(cors());
app.use(express.json());

/* ===========================
   MONGODB CONNECTION
=========================== */

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Mongo connected"))
  .catch((err) => console.error("Mongo connection error:", err));

/* ===========================
   USER
=========================== */

// Create user
app.post("/api/users", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user
app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===========================
   CATEGORY
=========================== */

// Get all categories
app.get("/api/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create category
app.post("/api/categories", async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===========================
   ITEM
=========================== */

// Create item
app.post("/api/items", async (req, res) => {
  try {
    const item = await Item.create(req.body);
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get items by category (with ranking)
app.get("/api/items/:categoryId", async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { userId } = req.query;

    // Exclude already swiped items
    const swiped = await Swipe.find({ userId, categoryId }).select("itemId");
    const swipedIds = swiped.map((s) => s.itemId);

    // Aggregate ranking score
    const ranking = await Swipe.aggregate([
      { $match: { categoryId: new mongoose.Types.ObjectId(categoryId) } },
      {
        $group: {
          _id: "$itemId",
          score: {
            $sum: {
              $cond: [{ $eq: ["$direction", "right"] }, 1, -1],
            },
          },
        },
      },
    ]);

    const scoreMap = {};
    ranking.forEach((r) => {
      scoreMap[r._id.toString()] = r.score;
    });

    // Fetch items not yet swiped
    const items = await Item.find({
      categoryId,
      _id: { $nin: swipedIds },
    });

    // Sort by score
    const sorted = items.sort((a, b) => {
      const scoreA = scoreMap[a._id.toString()] || 0;
      const scoreB = scoreMap[b._id.toString()] || 0;
      return scoreB - scoreA;
    });

    res.json(sorted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===========================
   SWIPE
=========================== */

app.post("/api/swipe", async (req, res) => {
  try {
    const { userId, itemId, categoryId, direction } = req.body;

    const swipe = await Swipe.create({
      userId,
      itemId,
      categoryId,
      direction,
    });

    res.json(swipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===========================
   HEALTH CHECK
=========================== */

app.get("/", (req, res) => {
  res.json({ message: "API running" });
});

/* ===========================
   START SERVER
=========================== */

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
