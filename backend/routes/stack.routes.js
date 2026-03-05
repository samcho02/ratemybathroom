import express from "express";
import Stack from "../models/Stack.js";

const router = express.Router();

/* ===========================
   Stack
=========================== */

// POST created stack
router.post("/create", async (req, res) => {
  try {
    const stack = await Stack.create(req.body);
    res.json(stack);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// // POST created stack
// router.post("/create", authMiddleware, async (req, res) => {
//   const stack = new Stack({
//     ...req.body,
//     createdBy: req.user._id,
//   });

//   await stack.save();
//   res.json(stack);
// });

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
