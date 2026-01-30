import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import userRoutes from "./routes/userRoute"; // Add this import

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

// Database connection middleware
let isConnected = false;
app.use(async (_req, _res, next) => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
  next();
});

// Health check route
app.get("/", (_req, res) => {
  res.send("FairPrice AI Server is running");
});

// API Routes
app.use("/api/users", userRoutes); // Add this line

// Start server (if not using a separate index.ts)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

export default app;