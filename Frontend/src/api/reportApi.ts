import { useState, useCallback } from 'react';
import api from './axios';

// =======================
// TypeScript Interfaces
// =======================

// Used for list / fetch APIs
export interface Report {
  _id: string;
  userId: string;
  productName: string;
  price: number;
  unit: string;
  marketName: string;
  month: string;
  verificationMethod: string;
  status: 'pending' | 'verified' | 'flagged';
  verifiedBy?: string;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  // ML stored but not necessarily shown everywhere
  mlAnalysis?: {
    mandiBenchmark: number;
    expectedPrice: number;
    deviation: string;
    anomaly: boolean;
    reason: string;
  };
}

// Payload sent from frontend
export interface CreateReportData {
  productName: string;
  price: number;
  unit: string;
  marketName: string;
  month: string;
}

// 🔥 RESPONSE FROM CREATE REPORT API (IMPORTANT)
export interface CreateReportResponseData {
  _id: string;
  predictedPrice: number;
}

// Generic API response
export interface ReportResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// =======================
// API Functions
// =======================
export const reportApi = {
  // Create a new report (returns ONLY predictedPrice)
  createReport: async (
    data: CreateReportData
  ): Promise<ReportResponse<CreateReportResponseData>> => {
    const response = await api.post('/reports/create', data);
    return response.data;
  },

  // Get user's reports
  getMyReports: async (
    page = 1,
    limit = 10
  ): Promise<ReportResponse<Report[]>> => {
    const response = await api.get(
      `/reports/my-reports?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Get recent 5 reports
  getRecentReports: async (): Promise<ReportResponse<Report[]>> => {
    const response = await api.get('/reports/recent');
    return response.data;
  },

  // Delete a report
  deleteReport: async (id: string): Promise<ReportResponse> => {
    const response = await api.delete(`/reports/${id}`);
    return response.data;
  },

  // Get all reports (Admin)
  getAllReports: async (
    page = 1,
    limit = 10,
    status?: string
  ): Promise<ReportResponse<Report[]>> => {
    const query = status
      ? `?page=${page}&limit=${limit}&status=${status}`
      : `?page=${page}&limit=${limit}`;
    const response = await api.get(`/reports/all${query}`);
    return response.data;
  },

  // Verify report
  verifyReport: async (
    id: string,
    status: 'verified' | 'flagged'
  ): Promise<ReportResponse<Report>> => {
    const response = await api.patch(`/reports/verify/${id}`, { status });
    return response.data;
  },
};

// =======================
// Custom Hook: useReports
// =======================
export const useReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  // Fetch user's reports
  const fetchReports = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await reportApi.getMyReports(page, limit);
      if (response.success && response.data) {
        setReports(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch recent reports
  const fetchRecentReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await reportApi.getRecentReports();
      if (response.success && response.data) {
        setReports(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch recent reports');
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔥 Create report (returns predictedPrice only)
  const createReport = useCallback(async (data: CreateReportData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await reportApi.createReport(data);
      if (response.success && response.data) {
        return {
          success: true,
          predictedPrice: response.data.predictedPrice,
        };
      }
      return { success: false, errors: response.errors };
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create report');
      return { success: false, errors: err.response?.data?.errors };
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete report
  const deleteReport = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await reportApi.deleteReport(id);
      if (response.success) {
        setReports((prev) => prev.filter((r) => r._id !== id));
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete report');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    reports,
    loading,
    error,
    pagination,
    fetchReports,
    fetchRecentReports,
    createReport,
    deleteReport,
  };
};
