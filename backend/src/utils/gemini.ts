import { GoogleGenerativeAI } from "@google/generative-ai";

console.log(" GEMINI_API_KEY exists:", !!process.env.GEMINI_API_KEY);
console.log(" GEMINI_API_KEY length:", process.env.GEMINI_API_KEY?.length || 0);

if (!process.env.GEMINI_API_KEY) {
  console.error(" CRITICAL: GEMINI_API_KEY is not set in environment variables!");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

interface PriceData {
  item: string;
  price: number;
  baselineAvg: number | null;
  area: string;
  zScore?: number | null;
  status: string;
  percentageDiff?: number;
}

/**
 * Generate AI explanation for ALL prices (normal, high, unusual)
 */
export async function generatePriceExplanation(
  priceData: PriceData
): Promise<string> {
  try {
    if (priceData.baselineAvg === null || priceData.baselineAvg === 0) {
      return `This is the first ${priceData.item} price submission in ${priceData.area}. As more data is collected, we'll be able to provide market comparisons and identify pricing trends.`;
    }

    const percentageDiff =
      priceData.percentageDiff ||
      Math.abs(
        ((priceData.price - priceData.baselineAvg) / priceData.baselineAvg) *
          100
      );

    let prompt = "";

    if (priceData.status === "normal") {
      prompt = `You are an economic analyst for a price monitoring system in Ranchi, India.

A price submission has been flagged as NORMAL (within expected range).

Details:
- Item: ${priceData.item}
- Submitted Price: ₹${priceData.price}
- Baseline Average: ₹${priceData.baselineAvg.toFixed(2)}
- Area: ${priceData.area}
- Price Difference: ${percentageDiff.toFixed(1)}% from baseline
${priceData.zScore ? `- Statistical Z-Score: ${priceData.zScore.toFixed(2)}` : ""}

Generate a brief 2 sentence explanation confirming this price is within normal market range.
- Acknowledge the price is fair/competitive
- Mention it aligns with area market conditions
- Keep tone positive and reassuring

Response should be in simple English, understandable to common citizens.
Do not use bullet points. Write in flowing sentences.`;
    } else if (priceData.status === "high") {
      prompt = `You are an economic analyst for a price monitoring system in Ranchi, India.

A price submission has been flagged as HIGH (moderately elevated).

Details:
- Item: ${priceData.item}
- Submitted Price: ₹${priceData.price}
- Baseline Average: ₹${priceData.baselineAvg.toFixed(2)}
- Area: ${priceData.area}
- Price Difference: ${percentageDiff.toFixed(1)}% above baseline
${priceData.zScore ? `- Statistical Z-Score: ${priceData.zScore.toFixed(2)}` : ""}

Generate a brief 2-3 sentence explanation for why this price is elevated.
Consider factors like:
- Moderate demand increase
- Minor supply chain adjustments
- Seasonal variations
- Local market conditions
- Vendor pricing strategies

Be factual but not alarmist. This is a moderate increase, not a crisis.
Response should be in simple English, understandable to common citizens.
Do not use bullet points. Write in flowing sentences.`;
    } else {
      prompt = `You are an economic analyst for a price monitoring system in Ranchi, India.

A price submission has been flagged as UNUSUAL (significantly elevated).

Details:
- Item: ${priceData.item}
- Submitted Price: ₹${priceData.price}
- Baseline Average: ₹${priceData.baselineAvg.toFixed(2)}
- Area: ${priceData.area}
- Price Difference: ${percentageDiff.toFixed(1)}% above baseline
${priceData.zScore ? `- Statistical Z-Score: ${priceData.zScore.toFixed(2)}` : ""}

Generate a brief 2-3 sentence explanation for why this price is significantly elevated.
Consider factors like:
- Supply chain disruptions
- Sudden demand spikes
- Transportation cost increases
- Weather-related shortages
- Market manipulation concerns
- Regional events or emergencies

Be factual and informative. Help users understand possible causes.
Response should be in simple English, understandable to common citizens.
Do not use bullet points. Write in flowing sentences.`;
    }

    // ✅ USE THE FULL MODEL NAME WITH "models/" PREFIX
    const model = genAI.getGenerativeModel({ 
      model: "models/gemini-2.5-flash" // FREE and FAST
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return text.trim();
  } catch (error: any) {
    console.error("Gemini API Error:", error.message);

    if (priceData.baselineAvg === null || priceData.baselineAvg === 0) {
      return `This is the first ${priceData.item} price submission in ${priceData.area}. As more data is collected, we'll be able to provide market comparisons and identify pricing trends.`;
    }

    const percentageDiff =
      priceData.percentageDiff ||
      Math.abs(
        ((priceData.price - priceData.baselineAvg) / priceData.baselineAvg) *
          100
      );

    if (priceData.status === "normal") {
      return `This ${priceData.item} price of ₹${priceData.price} is within the normal market range for ${priceData.area}. The price aligns well with the current baseline of ₹${priceData.baselineAvg.toFixed(2)}, indicating stable market conditions.`;
    } else if (priceData.status === "high") {
      return `This ${priceData.item} price is ${percentageDiff.toFixed(1)}% higher than the baseline of ₹${priceData.baselineAvg.toFixed(2)} in ${priceData.area}. This moderate increase may be due to seasonal demand, minor supply adjustments, or local market variations.`;
    } else {
      return `This ${priceData.item} price is significantly elevated at ${percentageDiff.toFixed(1)}% above the baseline of ₹${priceData.baselineAvg.toFixed(2)} in ${priceData.area}. This unusual increase may indicate supply chain issues, sudden demand spikes, or other market disruptions. Citizens are advised to verify prices with multiple vendors.`;
    }
  }
}

/**
 * Quick test function for Gemini integration
 */
export async function testGeminiConnection(): Promise<boolean> {
  try {
    // ✅ USE THE FULL MODEL NAME
    const model = genAI.getGenerativeModel({ 
      model: "models/gemini-2.5-flash" 
    });
    const result = await model.generateContent("Say 'Hello' in one word");
    const text = result.response.text();
    console.log("Gemini Connection Test:", text);
    return true;
  } catch (error: any) {
    console.error(" Gemini Connection Failed:", error.message);
    return false;
  }
}