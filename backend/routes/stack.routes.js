import express from "express";
import Stack from "../models/Stack.js";
import { authMiddleware } from "./auth.routes.js";

const router = express.Router();

/* ===========================
   Stack
=========================== */

// POST created stack
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const stack = await Stack.create({
      ...req.body,
      createdBy: req.user._id, // Use ID from authenticated user
    });
    res.json(stack);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET Stack, stack selected by user, populate items
router.get("/:stackId", async (req, res) => {
  const stack = await Stack.findById(req.params.stackId).populate(
    "items.itemId"
  );

  res.json(stack);
});

// GET stacks by category
router.get("/category/:categoryId", async (req, res) => {
  const stacks = await Stack.find({
    categoryId: req.params.categoryId,
  }).sort({ createdAt: -1 });

  res.json(stacks);
});

// POST stack remix
router.post("/:stackId/remix", authMiddleware, async (req, res) => {
  try {
    const original = await Stack.findById(req.params.stackId);
    if (!original) return res.status(404).json({ error: "Stack not found" });

    const newStack = new Stack({
      categoryId: original.categoryId,
      title: `${original.title} (Remix)`,
      description: original.description,
      createdBy: req.user._id, // Set to current authenticated user
      parentStackId: original._id,
      items: original.items,
    });

    await newStack.save();

    // Increment remix count on original
    original.remixCount += 1;
    await original.save();

    res.json(newStack);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
