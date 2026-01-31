import api from './axios';

// ==========================================
// TYPES
// ==========================================

export interface FlaggedReport {
  _id: string;
  productName: string;
  marketName: string;
  price: number;
  unit: string;
  month: string;
  userId: string;
  mlAnalysis: {
    mandiBenchmark: number;
    expectedPrice: number;
    deviation: string;
    anomaly: boolean;
    reason: string;
  };
  createdAt: string;
}

export interface ReportDetail extends FlaggedReport {
  status: string;
  verificationMethod: string;
  verifiedBy?: string;
  verifiedAt?: string;
  updatedAt: string;
}

export interface MarketHealth {
  market: string;
  avgActualPrice: number;
  avgPredictedPrice: number;
  avgDeviation: number;
  totalReports: number;
  flaggedReports: number;
}

export interface UserActivity {
  userId: string;
  totalReports: number;
  flaggedReports: number;
  flaggedPercentage: number;
  lastActivity: string;
}

// ==========================================
// API FUNCTIONS
// ==========================================

/**
 * 1️⃣ Get all flagged reports
 */
export const getFlaggedReports = async (): Promise<FlaggedReport[]> => {
  const response = await api.get<{
    success: boolean;
    count: number;
    data: FlaggedReport[];
  }>('/admin/flagged-reports');
  return response.data.data;
};

/**
 * 2️⃣ Inspect single report
 */
export const inspectReport = async (id: string): Promise<ReportDetail> => {
  const response = await api.get<{
    success: boolean;
    data: ReportDetail;
  }>(`/admin/reports/${id}`);
  return response.data.data;
};

/**
 * 3️⃣ Mark report as valid
 */
export const markReportValid = async (id: string): Promise<void> => {
  await api.patch(`/admin/reports/${id}/mark-valid`);
};

/**
 * 4️⃣ Delete report
 */
export const deleteReport = async (id: string): Promise<void> => {
  await api.delete(`/admin/reports/${id}`);
};

/**
 * 5️⃣ Get market health overview
 */
export const getMarketHealth = async (): Promise<MarketHealth[]> => {
  const response = await api.get<{
    success: boolean;
    count: number;
    data: MarketHealth[];
  }>('/admin/markets');
  return response.data.data;
};

/**
 * 6️⃣ Get user activity overview
 */
export const getUserActivity = async (): Promise<UserActivity[]> => {
  const response = await api.get<{
    success: boolean;
    count: number;
    data: UserActivity[];
  }>('/admin/users');
  return response.data.data;
};