import express from "express";
import Swipe from "../models/Swipe.js";

const router = express.Router();

/* ===========================
   SWIPE
=========================== */

router.post("/", async (req, res) => {
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

export default router;