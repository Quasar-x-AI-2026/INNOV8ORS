import { useState, useCallback } from 'react';
import api from './axios';

// TypeScript Interfaces
export interface UserStats {
  totalReports: number;
  verifiedReports: number;
  pendingReports: number;
  flaggedReports: number;
  recentActivity: number;
  topProducts: {
    name: string;
    count: number;
    avgPrice: number;
  }[];
}

export interface StatsResponse {
  success: boolean;
  data?: UserStats;
  message?: string;
}

// API Functions
export const statsApi = {
  // Get current user's statistics
  getMyStats: async (): Promise<StatsResponse> => {
    const response = await api.get('/stats/me');
    return response.data;
  },
};

// Custom Hook: useStats
export const useStats = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user statistics
  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await statsApi.getMyStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    stats,
    loading,
    error,
    fetchStats,
  };
};