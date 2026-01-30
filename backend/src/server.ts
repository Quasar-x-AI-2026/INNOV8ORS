import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";

const app = express();

app.use(cors());
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
  res.send("FairPrice AI Server is running ");
});

export default app;

