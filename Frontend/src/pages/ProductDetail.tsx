import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { productApi } from '../api/productApi';
import PriceTrendLineChart from '../components/charts/PriceTrendLineChart';
import MarketComparisonBarChart from '../components/charts/MarketComparisonBarChart';
import { ArrowLeft, Plus, TrendingUp, BarChart3 } from 'lucide-react';

const ProductDetail = () => {
  const { productName } = useParams();
  const navigate = useNavigate();

  const [marketData, setMarketData] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!productName) return;

      setLoading(true);
      setError(null);

      try {
        const marketResponse = await productApi.getMarketSnapshot(productName);
        if (marketResponse.success) {
          setMarketData(marketResponse.data || []);
        }

        const trendResponse = await productApi.getPriceTrend(productName);
        if (trendResponse.success) {
          setTrendData(trendResponse.data || []);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productName]);

  const handleReportPrice = () => {
    navigate('/report-price', { state: { prefilledProduct: productName } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => navigate('/products')}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-3 sm:mb-4 text-sm sm:text-base"
          >
            <ArrowLeft className="mr-2" size={18} />
            Back to Products
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{productName} Analytics</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
                Market insights and price predictions
              </p>
            </div>

            <button
              onClick={handleReportPrice}
              className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center text-sm sm:text-base whitespace-nowrap"
            >
              <Plus className="mr-2" size={18} />
              Report {productName} Price
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 sm:mb-6 text-sm sm:text-base">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex items-center mb-3 sm:mb-4">
            <BarChart3 className="text-blue-600 mr-2" size={20} />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Market Snapshot</h2>
          </div>

          {marketData.length === 0 ? (
            <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
              Not enough data available. Be the first to report a price!
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-600 font-medium text-xs sm:text-sm">
                        Market
                      </th>
                      <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-gray-600 font-medium text-xs sm:text-sm">
                        Avg Actual
                      </th>
                      <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-gray-600 font-medium text-xs sm:text-sm">
                        AI Predicted
                      </th>
                      <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-gray-600 font-medium text-xs sm:text-sm">
                        Deviation
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {marketData.map((market, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-900 text-xs sm:text-sm">
                          {market.marketName}
                        </td>
                        <td className="text-right py-2 sm:py-3 px-2 sm:px-4 text-gray-900 text-xs sm:text-sm">
                          ₹{market.avgActualPrice}
                        </td>
                        <td className="text-right py-2 sm:py-3 px-2 sm:px-4 text-gray-900 text-xs sm:text-sm">
                          ₹{market.avgPredictedPrice}
                        </td>
                        <td
                          className={`text-right py-2 sm:py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm ${
                            market.deviation > 0
                              ? 'text-red-600'
                              : market.deviation < 0
                              ? 'text-green-600'
                              : 'text-gray-600'
                          }`}
                        >
                          {market.deviation > 0 ? '+' : ''}
                          {market.deviation}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex items-center mb-3 sm:mb-4">
            <TrendingUp className="text-blue-600 mr-2" size={20} />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Price Trend Over Time</h2>
          </div>

          {trendData.length === 0 ? (
            <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
              Not enough data available for trend analysis.
            </div>
          ) : (
            <div className="w-full">
              <PriceTrendLineChart data={trendData} />
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <div className="flex items-center mb-3 sm:mb-4">
            <BarChart3 className="text-blue-600 mr-2" size={20} />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Market Comparison</h2>
          </div>

          {marketData.length === 0 ? (
            <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
              Not enough data available for market comparison.
            </div>
          ) : (
            <div className="w-full">
              <MarketComparisonBarChart data={marketData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;