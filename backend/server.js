import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";

import userRoutes from "./routes/user.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import itemRoutes from "./routes/item.routes.js";
import swipeRoutes from "./routes/swipe.routes.js";
import stackRoutes from "./routes/stack.routes.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Routes
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/stacks", stackRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/swipe", swipeRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "API running" });
});

// MongoDB Connection
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Mongo connected");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("Mongo connection error:", err));