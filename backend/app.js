import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/user.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import itemRoutes from "./routes/item.routes.js";
import swipeRoutes from "./routes/swipe.routes.js";
import stackRoutes from "./routes/stack.routes.js";

dotenv.config();
const VITE_PORT = process.env.VITE_PORT;
const app = express();

app.use(express.json());

app.use(
  cors({
    origin: `http://localhost:${VITE_PORT}`,
  })
);

app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/stacks", stackRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/swipe", swipeRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API running" });
});

export default app;
