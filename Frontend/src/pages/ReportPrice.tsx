import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useReports } from '../api/reportApi';
import { FileText } from 'lucide-react';

const PRODUCTS = [
  { name: 'Milk', unit: 'liter' },
  { name: 'Onion', unit: 'kg' },
  { name: 'Potato', unit: 'kg' },
  { name: 'Sugar', unit: 'kg' },
  { name: 'Tomato', unit: 'kg' },
];

const MARKETS = [
  'Azadpur',
  'Daryaganj',
  'Ghazipur',
  'INA Market',
  'Keshopur',
  'Okhla',
  'Rohini',
];

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const ReportPrice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { createReport, loading } = useReports();

  const prefilledProduct = location.state?.prefilledProduct || '';

  const [formData, setFormData] = useState({
    productName: prefilledProduct,
    price: '',
    unit: '',
    marketName: '',
    month: '',
  });

  const [errors, setErrors] = useState<any>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [predictedPrice, setPredictedPrice] = useState<number | null>(null);

  useEffect(() => {
    if (prefilledProduct) {
      const product = PRODUCTS.find((p) => p.name === prefilledProduct);
      if (product) {
        setFormData((prev) => ({
          ...prev,
          productName: prefilledProduct,
          unit: product.unit,
        }));
      }
    }
  }, [prefilledProduct]);

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const productName = e.target.value;
    const product = PRODUCTS.find((p) => p.name === productName);

    setFormData((prev) => ({
      ...prev,
      productName,
      unit: product ? product.unit : '',
    }));

    if (errors.productName) {
      setErrors((prev: any) => ({ ...prev, productName: '' }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setPredictedPrice(null);
    setShowSuccess(false);

    const result = await createReport({
      productName: formData.productName,
      price: parseFloat(formData.price),
      unit: formData.unit,
      marketName: formData.marketName,
      month: formData.month,
    });

    if (result.success && typeof result.predictedPrice === 'number') {
      setPredictedPrice(result.predictedPrice);
      setShowSuccess(true);

      setFormData({
        productName: '',
        price: '',
        unit: '',
        marketName: '',
        month: '',
      });
    } else if (result.errors) {
      setErrors(result.errors);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex items-center mb-6">
            <FileText className="text-blue-600 mr-3" size={32} />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Report a Price
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Help your community by reporting current prices
              </p>
            </div>
          </div>

          {showSuccess && predictedPrice !== null && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-900 font-semibold text-lg">
                AI Predicted Fair Price: ₹{predictedPrice}
              </p>
              <p className="text-blue-700 text-sm mt-1">
                This price is estimated using AI and historical market data.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <select
                name="productName"
                value={formData.productName}
                onChange={handleProductChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.productName ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              >
                <option value="">Select a product</option>
                {PRODUCTS.map((product) => (
                  <option key={product.name} value={product.name}>
                    {product.name}
                  </option>
                ))}
              </select>
              {errors.productName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.productName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Market Name *
              </label>
              <select
                name="marketName"
                value={formData.marketName}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg border-gray-300"
                required
              >
                <option value="">Select a market</option>
                {MARKETS.map((market) => (
                  <option key={market} value={market}>
                    {market}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Month *
              </label>
              <select
                name="month"
                value={formData.month}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg border-gray-300"
                required
              >
                <option value="">Select a month</option>
                {MONTHS.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportPrice;