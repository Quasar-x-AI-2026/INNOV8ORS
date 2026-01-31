import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

interface MarketData {
  marketName: string;
  actualAvgPrice: number;
  predictedAvgPrice: number;
  deviation: number;
  isAnomaly: boolean;
}

interface MarketMapResponse {
  success: boolean;
  data: MarketData[];
  message?: string;
}

export const useMarketMap = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMarketMapData = async (product: string, month: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<MarketMapResponse>(
        `${API_URL}/markets/map-view`,  // ✅ REMOVED /api prefix
        {
          params: {
            product,
            month,
          },
        }
      );

      if (response.data.success) {
        setMarketData(response.data.data);
        return response.data.data;
      } else {
        setError(response.data.message || 'Failed to fetch market data');
        setMarketData([]);
        return [];
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch market data';
      setError(errorMessage);
      setMarketData([]);
      console.error('Market map fetch error:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const clearData = () => {
    setMarketData([]);
    setError(null);
  };

  return {
    marketData,
    loading,
    error,
    fetchMarketMapData,
    clearData,
  };
};