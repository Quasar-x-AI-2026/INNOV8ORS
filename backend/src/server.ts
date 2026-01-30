import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import userRoutes from "./routes/userRoute"; 
import reportRoute from "./routes/reportRoute";
import trendRoute from "./routes/trendRoute";
import statsRoute from "./routes/statsRoute";
import marketmapRoute from "./routes/marketmapRoute";
import productRoute from "./routes/productRoute";
import adminRoutes from "./routes/adminRoute"; // 🔥 NEW IMPORT

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

app.use(express.json());


let isConnected = false;
app.use(async (_req, _res, next) => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
  next();
});


app.get("/", (_req, res) => {
  res.send("FairPrice AI Server is running");
});

app.use("/api/users", userRoutes); 
app.use('/api/reports', reportRoute);
app.use('/api/stats', statsRoute);
app.use('/api/trends', trendRoute);
app.use('/api/markets', marketmapRoute);
app.use('/api/products', productRoute);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

export default app;