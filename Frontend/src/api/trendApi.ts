import { useState, useCallback } from 'react';
import api from './axios';

// TypeScript Interfaces
export interface PriceAlert {
  product: string;
  area: string;
  oldPrice: number;
  newPrice: number;
  change: number;
  type: 'increase' | 'decrease';
  severity: 'high' | 'medium';
}

export interface ProductTrend {
  date: string;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  reportCount: number;
}

export interface AlertResponse {
  success: boolean;
  data?: PriceAlert[];
  message?: string;
}

export interface TrendResponse {
  success: boolean;
  data?: ProductTrend[];
  message?: string;
}

// API Functions
export const trendApi = {
  // Get price alerts
  getAlerts: async (): Promise<AlertResponse> => {
    const response = await api.get('/trends/alerts');
    return response.data;
  },

  // Get product trends
  getProductTrends: async (product: string, area?: string): Promise<TrendResponse> => {
    const query = area ? `?product=${product}&area=${area}` : `?product=${product}`;
    const response = await api.get(`/trends/product${query}`);
    return response.data;
  },
};

// Custom Hook: useTrends
export const useTrends = () => {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [trends, setTrends] = useState<ProductTrend[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch price alerts
  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await trendApi.getAlerts();
      if (response.success && response.data) {
        setAlerts(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch alerts');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch product trends
  const fetchProductTrends = useCallback(async (product: string, area?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await trendApi.getProductTrends(product, area);
      if (response.success && response.data) {
        setTrends(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch trends');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    alerts,
    trends,
    loading,
    error,
    fetchAlerts,
    fetchProductTrends,
  };
};