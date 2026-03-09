import express from "express";
import Swipe from "../models/Swipe.js";

const router = express.Router();

/* ===========================
   SWIPE
=========================== */

router.post("/", async (req, res) => {
  try {
    if (direction === "right") {
      await Stack.findByIdAndUpdate(stackId, { $inc: { swipeRight: 1 } });
    } else {
      await Stack.findByIdAndUpdate(stackId, { $inc: { swipeLeft: 1 } });
    }

    const { userId, itemId, stackId, direction } = req.body;

    const swipe = await Swipe.create({
      userId,
      itemId,
      stackId,
      direction,
    });

    res.json(swipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
