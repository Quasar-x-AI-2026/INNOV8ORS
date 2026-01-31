import axios from "axios";

const ML_BASE_URL = process.env.ML_URL as string;

if (!ML_BASE_URL) {
  throw new Error("ML_URL not defined in environment variables");
}

export interface MLResponse {
  mandi_benchmark: number;
  expected_price: number;
  is_anomaly: boolean;
  reason: string;
  deviation: string;
}

export const checkPriceWithML = async (payload: {
  month: number;
  commodity_name: string;
  market_name: string;
  actual_price: number;
}): Promise<MLResponse> => {
  const response = await axios.post(
    `${ML_BASE_URL}/api/v1/check-price`,
    payload,
    { timeout: 5000 }
  );

  return response.data;
};
