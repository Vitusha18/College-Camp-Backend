// import express from "express";
// import dotenv from "dotenv";
// import connectDB from "./src/db/db.js";

// dotenv.config();

// connectDB();

// const app = express();

// app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("CampusConnect API Running...");
// });

// const PORT = process.env.PORT || 8080;

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./src/db/db.js";
import userRoutes from "./src/routes/user.routes.js"
import taskRoutes from "./src/routes/task.routes.js"

dotenv.config();

connectDB();

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  app.use("/api/users", userRoutes);
  app.use("/api/tasks", taskRoutes);

    console.log(`Server running on http://localhost:${PORT}`);
});