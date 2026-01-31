import { useState } from 'react';
import Navbar from '../components/Navbar';
import MapView from '../components/MapView';
import { useMarketMap } from '../api/marketApi';

const PRODUCTS = ['Milk', 'Onion', 'Potato', 'Sugar', 'Tomato'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const MarketMap = () => {
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [hasSearched, setHasSearched] = useState(false);

  const { marketData, loading, error, fetchMarketMapData } = useMarketMap();

  const handleSearch = async () => {
    if (!selectedProduct || !selectedMonth) {
      return;
    }

    setHasSearched(true);
    await fetchMarketMapData(selectedProduct, selectedMonth);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Delhi Market Map</h1>
          <p className="text-gray-600 mt-2">
            Visualize price anomalies across 7 Delhi markets for selected commodity and month
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Product
              </label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a product</option>
                {PRODUCTS.map((product) => (
                  <option key={product} value={product}>
                    {product}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Month
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a month</option>
                {MONTHS.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleSearch}
                disabled={!selectedProduct || !selectedMonth || loading}
                className="w-full bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
              >
                {loading ? 'Loading...' : 'Show Map'}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </div>

        {hasSearched && marketData.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Legend:</h3>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm text-gray-600">Normal (≤ 5% deviation)</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-yellow-500 mr-2"></div>
                <span className="text-sm text-gray-600">Slight Anomaly (5-15%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-red-500 mr-2"></div>
                <span className="text-sm text-gray-600">Major Anomaly (&gt; 15%)</span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-6">
          {loading && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading market data...</p>
              </div>
            </div>
          )}

          {!loading && !hasSearched && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <p className="text-gray-500 text-lg mb-2">
                  Select a product and month to view Delhi map
                </p>
                <p className="text-gray-400 text-sm">
                  Only 7 Delhi markets will be displayed
                </p>
              </div>
            </div>
          )}

          {!loading && hasSearched && marketData.length === 0 && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <p className="text-gray-500 text-lg mb-2">
                  No data available for selected filters
                </p>
                <p className="text-gray-400 text-sm">
                  Try selecting a different product or month
                </p>
              </div>
            </div>
          )}

          {!loading && hasSearched && marketData.length > 0 && (
            <MapView data={marketData} />
          )}
        </div>

        {!loading && hasSearched && marketData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <p className="text-sm text-gray-600">Total Markets</p>
              <p className="text-2xl font-bold text-gray-900">{marketData.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4">
              <p className="text-sm text-gray-600">Anomalous Markets</p>
              <p className="text-2xl font-bold text-red-600">
                {marketData.filter((m) => m.isAnomaly).length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4">
              <p className="text-sm text-gray-600">Normal Markets</p>
              <p className="text-2xl font-bold text-green-600">
                {marketData.filter((m) => !m.isAnomaly).length}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketMap;