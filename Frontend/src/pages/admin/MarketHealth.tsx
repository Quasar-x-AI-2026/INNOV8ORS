import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import { getMarketHealth, type MarketHealth } from '../../api/adminApi';
import { formatCurrency } from '../../utils/formatters';

const MarketHealthPage = () => {
  const [markets, setMarkets] = useState<MarketHealth[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMarketHealth();
  }, []);

  const loadMarketHealth = async () => {
    try {
      setLoading(true);
      const data = await getMarketHealth();
      setMarkets(data);
    } catch (error) {
      console.error('Failed to load market health:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="text-center text-gray-500">Loading market health...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-3">
          <BarChart3 className="text-blue-600" size={28} />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Market Health</h2>
            <p className="text-sm text-gray-600">
              Overview of price trends across all markets
            </p>
          </div>
        </div>
      </div>

      {/* Markets Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {markets.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-600 font-medium">No market data available</p>
            <p className="text-sm text-gray-500 mt-1">
              Market statistics will appear here once reports are submitted
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Market
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Avg Actual Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Avg Predicted Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Avg Deviation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total Reports
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Flagged Reports
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Health Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {markets.map((market) => {
                  const flaggedPercentage =
                    (market.flaggedReports / market.totalReports) * 100;
                  const isHealthy = flaggedPercentage < 10;
                  const isWarning = flaggedPercentage >= 10 && flaggedPercentage < 20;
                  const isCritical = flaggedPercentage >= 20;

                  return (
                    <tr key={market.market} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {market.market}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold text-gray-900">
                          {formatCurrency(market.avgActualPrice ?? 0)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold text-blue-700">
                          {formatCurrency(market.avgPredictedPrice ?? 0)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {(market.avgDeviation ?? 0) > 0 ? (
                            <TrendingUp className="text-red-500" size={18} />
                          ) : (
                            <TrendingDown className="text-green-500" size={18} />
                          )}
                          <span
                            className={`font-semibold ${
                              (market.avgDeviation ?? 0) > 0
                                ? 'text-red-600'
                                : 'text-green-600'
                            }`}
                          >
                            {(market.avgDeviation ?? 0) > 0 ? '+' : ''}
                            {(market.avgDeviation ?? 0).toFixed(2)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {market.totalReports}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-orange-600">
                            {market.flaggedReports}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({flaggedPercentage.toFixed(1)}%)
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isHealthy && (
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                            Healthy
                          </span>
                        )}
                        {isWarning && (
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full">
                            Warning
                          </span>
                        )}
                        {isCritical && (
                          <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                            Critical
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      {markets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-sm text-gray-600 mb-1">Total Markets</div>
            <div className="text-3xl font-bold text-gray-900">
              {markets.length}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-sm text-gray-600 mb-1">Total Reports</div>
            <div className="text-3xl font-bold text-gray-900">
              {markets.reduce((sum, m) => sum + m.totalReports, 0)}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-sm text-gray-600 mb-1">Total Flagged</div>
            <div className="text-3xl font-bold text-orange-600">
              {markets.reduce((sum, m) => sum + m.flaggedReports, 0)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketHealthPage;