import express from "express";
import mongoose from "mongoose";
import Item from "../models/Item.js";
import Swipe from "../models/Swipe.js";

const router = express.Router();

/* ===========================
   ITEM
=========================== */

// Create item
router.post("/", async (req, res) => {
  try {
    const item = await Item.create(req.body);
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get items by category (sorted by score with penalty)
router.get("/:categoryId", async (req, res) => {
  try {
    const { categoryId } = req.params;

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

    const scoreMap = {};
    ranking.forEach((r) => {
      scoreMap[r._id.toString()] = {
        rawScore: r.score,
        totalSwipes: r.totalSwipes,
      };
    });

    const items = await Item.find({ categoryId });

    const sorted = items
      .map((item) => {
        const stats = scoreMap[item._id.toString()] || {
          rawScore: 0,
          totalSwipes: 0,
        };

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

export default router;