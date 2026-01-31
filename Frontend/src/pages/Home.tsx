import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import Navbar from '../components/Navbar';
import { useStats } from '../api/statsApi';
import { useReports } from '../api/reportApi';
import { useTrends } from '../api/trendApi';
import {
  TrendingUp,
  TrendingDown,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Activity,
  ArrowRight,
} from 'lucide-react';
import {
  formatCurrency,
  formatRelativeTime,
  formatPriceChange,
} from '../utils/formatters';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { stats, loading: statsLoading, fetchStats } = useStats();
  const { reports, loading: reportsLoading, fetchRecentReports } = useReports();
  const { alerts, loading: alertsLoading, fetchAlerts } = useTrends();

  useEffect(() => {
    fetchStats();
    fetchRecentReports();
    fetchAlerts();
  }, [fetchStats, fetchRecentReports, fetchAlerts]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with prices in your area today
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard icon={FileText} label="Total Reports" value={stats?.totalReports || 0} color="bg-blue-500" loading={statsLoading} />
          <StatsCard icon={CheckCircle} label="Verified" value={stats?.verifiedReports || 0} color="bg-green-500" loading={statsLoading} />
          <StatsCard icon={Clock} label="Pending" value={stats?.pendingReports || 0} color="bg-yellow-500" loading={statsLoading} />
          <StatsCard icon={Activity} label="This Week" value={stats?.recentActivity || 0} color="bg-purple-500" loading={statsLoading} />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            {/* Price Alerts */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="mr-2 text-orange-500" size={24} />
                Price Alerts
              </h2>

              {alertsLoading ? (
                <div className="text-center py-8 text-gray-500">Loading alerts...</div>
              ) : alerts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No significant price changes detected
                </div>
              ) : (
                alerts.slice(0, 3).map((alert, index) => (
                  <div
                    key={index}
                    className="flex justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      {alert.type === 'increase' ? (
                        <TrendingUp className="text-red-500" size={22} />
                      ) : (
                        <TrendingDown className="text-green-500" size={22} />
                      )}
                      <div>
                        <div className="font-medium text-gray-900">
                          {alert.product} - {alert.area}
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatCurrency(alert.oldPrice)} → {formatCurrency(alert.newPrice)}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`font-semibold ${
                        alert.type === 'increase'
                          ? 'text-red-600'
                          : 'text-green-600'
                      }`}
                    >
                      {formatPriceChange(alert.change)}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* 🔥 Recent Reports (ACTUAL + AI PRICE) */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Reports
                </h2>
                <button
                  onClick={() => navigate('/history')}
                  className="text-blue-600 text-sm flex items-center"
                >
                  View All <ArrowRight size={16} className="ml-1" />
                </button>
              </div>

              {reportsLoading ? (
                <div className="text-center py-8 text-gray-500">Loading reports...</div>
              ) : reports.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No reports yet</p>
                  <button
                    onClick={() => navigate('/report-price')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg"
                  >
                    Create Your First Report
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {reports.map((report) => (
                    <div
                      key={report._id}
                      className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                    >
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium text-gray-900">
                            {report.productName}
                          </div>
                          <div className="text-sm text-gray-600">
                            {report.marketName} • {report.month}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatRelativeTime(report.createdAt)}
                          </div>
                        </div>

                        <div className="text-right space-y-1">
                          <div className="text-sm text-gray-700">
                            Actual:{' '}
                            <span className="font-semibold">
                              {formatCurrency(report.price)}
                            </span>
                          </div>
                          <div className="text-sm text-blue-700">
                            AI:{' '}
                            <span className="font-semibold">
                              {report.mlAnalysis?.expectedPrice
                                ? formatCurrency(report.mlAnalysis.expectedPrice)
                                : '—'}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            per {report.unit}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          
          <div className="space-y-6">
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/report-price')}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
                >
                  📝 Report a Price
                </button>
                <button
                  onClick={() => navigate('/history')}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 font-medium"
                >
                  📊 View History
                </button>
              </div>
            </div>

            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Your Top Products
              </h2>

              {statsLoading ? (
                <div className="text-center py-4 text-gray-500">Loading...</div>
              ) : !stats?.topProducts || stats.topProducts.length === 0 ? (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No data yet. Start reporting prices!
                </div>
              ) : (
                <div className="space-y-3">
                  {stats.topProducts.map((product, index) => (
                    <div
                      key={index}
                      className="flex justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {product.count} reports
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-blue-600">
                        {formatCurrency(product.avgPrice)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatsCardProps {
  icon: any;
  label: string;
  value: number;
  color: string;
  loading: boolean;
}

const StatsCard = ({ icon: Icon, label, value, color, loading }: StatsCardProps) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <div className="flex justify-between">
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        {loading ? (
          <div className="h-8 w-16 bg-gray-200 animate-pulse" />
        ) : (
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        )}
      </div>
      <div className={`${color} p-3 rounded-lg`}>
        <Icon className="text-white" size={24} />
      </div>
    </div>
  </div>
);

export default Home;
