import express from "express";
import Stack from "../models/Stack.js";

const router = express.Router();

/* ===========================
   Stack
=========================== */

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
router.post("/:stackId/remix", async (req, res) => {
  const original = await Stack.findById(req.params.stackId);

  const newStack = new Stack({
    categoryId: original.categoryId,
    title: original.title + " (Remix)",
    description: original.description,
    createdBy: req.body.userId,
    parentStackId: original._id,
    items: original.items,
  });

  await newStack.save();

  original.remixCount += 1;
  await original.save();

  res.json(newStack);
});

export default router;
