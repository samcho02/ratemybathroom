import express from "express";
import {
  createItem,
  getRankedItemsByCategory,
} from "../services/item.service.js";

const router = express.Router();

/* ===========================
   ITEM
=========================== */

// Create item
router.post("/", async (req, res) => {
  try {
    const item = await createItem(req.body);
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get items by category (sorted by score with penalty)
router.get("/:categoryId", async (req, res) => {
  try {
    const items = await getRankedItemsByCategory(req.params.categoryId);
    res.json(items);
  } catch (err) {
    if (err.message === "Invalid categoryId") {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
});

export default router;