import express from "express";
import cors from "cors";

import userRoutes from "./routes/user.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import itemRoutes from "./routes/item.routes.js";
import swipeRoutes from "./routes/swipe.routes.js";
import stackRoutes from "./routes/stack.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/swipe", swipeRoutes);
app.use("/api/stacks", stackRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API running" });
});

export default app;
