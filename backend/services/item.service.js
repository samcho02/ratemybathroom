import mongoose from "mongoose";
import Item from "../models/Item.js";
import Swipe from "../models/Swipe.js";
import { computeAdjustedScore } from "../utils/ranking.js";

export async function createItem(data) {
  return Item.create(data);
}

export async function getRankedItemsByCategory(categoryId) {
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new Error("Invalid categoryId");
  }

  const objectId = new mongoose.Types.ObjectId(categoryId);

  const ranking = await Swipe.aggregate([
    { $match: { categoryId: objectId } },
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

  return items
    .map((item) => {
      const stats = scoreMap[item._id.toString()] || {
        rawScore: 0,
        totalSwipes: 0,
      };

      const adjustedScore = computeAdjustedScore(
        stats.rawScore,
        stats.totalSwipes
      );

      return {
        ...item.toObject(),
        rawScore: stats.rawScore,
        adjustedScore,
      };
    })
    .sort((a, b) => b.adjustedScore - a.adjustedScore);
}