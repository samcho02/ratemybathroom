import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/user.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import itemRoutes from "./routes/item.routes.js";
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

app.use("/api/items", itemRoutes);

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
