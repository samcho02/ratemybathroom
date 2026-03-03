import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";

import userRoutes from "./routes/user.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import itemRoutes from "./routes/item.routes.js";
import swipeRoutes from "./routes/swipe.routes.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Mongodb Connection
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Mongo connected");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("Mongo connection error:", err));

// User Route
app.use("/api/users", userRoutes);

// Category Route
app.use("/api/categories", categoryRoutes);

// Item Route
app.use("/api/items", itemRoutes);

// Swipe Route
app.use("/api/swipe", swipeRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "API running" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
