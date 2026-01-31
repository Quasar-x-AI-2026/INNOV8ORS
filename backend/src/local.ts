import dotenv from "dotenv";
dotenv.config();

import app from "./server";
import { connectDB } from "./config/db";
import { testGeminiConnection } from "./utils/gemini";

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB();
    app.listen(PORT, async () => {
        console.log(`Local server running on port ${PORT}`);
         console.log("Testing Gemini API connection...");
  const geminiWorks = await testGeminiConnection();
  if (geminiWorks) {
    console.log(" Gemini API connected successfully");
  } else {
    console.error(" Gemini API connection failed - AI explanations will not work");
  }
    });
  } catch (error) {
    console.error(" Failed to start server:", error);
    process.exit(1);
  }
})();