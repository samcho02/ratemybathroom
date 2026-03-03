import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/user.routes.js";
import categoryRoutes from "./routes/category.routes.js";
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

app.use("/api/users", userRoutes);

/* ===========================
   CATEGORY
=========================== */

app.use("/api/categories", categoryRoutes);

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

// Get items by category (sorted by score with penalty)
app.get("/api/items/:categoryId", async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Aggregate raw score per item
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
          totalSwipes: { $sum: 1 },
        },
      },
    ]);

    // Build score map
    const scoreMap = {};
    ranking.forEach((r) => {
      scoreMap[r._id.toString()] = {
        rawScore: r.score,
        totalSwipes: r.totalSwipes,
      };
    });

    // Fetch ALL items in category
    const items = await Item.find({ categoryId });

    // Apply penalty / damping function
    const sorted = items
      .map((item) => {
        const stats = scoreMap[item._id.toString()] || {
          rawScore: 0,
          totalSwipes: 0,
        };

        // --- Penalty Formula ---
        // Idea: dampen high-confidence items slightly
        // Example: score / (1 + log(totalSwipes))
        const adjustedScore =
          stats.rawScore / (1 + Math.log(1 + stats.totalSwipes));

        return {
          ...item.toObject(),
          rawScore: stats.rawScore,
          adjustedScore,
        };
      })
      .sort((a, b) => b.adjustedScore - a.adjustedScore);

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
