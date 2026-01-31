import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useReports } from '../api/reportApi';
import { History as HistoryIcon, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatCurrency, formatDateTime } from '../utils/formatters';

const History = () => {
  const { reports, loading, pagination, fetchReports, deleteReport } = useReports();
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchReports(currentPage, 10);
  }, [currentPage, fetchReports]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      setDeleteLoading(id);
      const success = await deleteReport(id);
      setDeleteLoading(null);

      if (success) {
        fetchReports(currentPage, 10);
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-6">
          <HistoryIcon className="text-blue-600 mr-3" size={32} />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Report History</h1>
            <p className="text-gray-600 text-sm mt-1">
              View your past price reports and AI predictions
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Loading reports...</p>
          </div>
        )}

        {/* Empty */}
        {!loading && reports.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <HistoryIcon className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Reports Found
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't submitted any reports yet.
            </p>
            <button
              onClick={() => (window.location.href = '/report-price')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Create Your First Report
            </button>
          </div>
        )}

        {/* Table */}
        {!loading && reports.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                      Your Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                      Market & Month
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                      AI Predicted Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {reports.map((report) => (
                    <tr key={report._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {report.productName}
                        </div>
                        <div className="text-sm text-gray-500">
                          per {report.unit}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-lg font-semibold text-gray-900">
                          {formatCurrency(report.price)}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {report.marketName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {report.month}
                        </div>
                      </td>

                      {/* 🔥 AI PREDICTED PRICE */}
                      <td className="px-6 py-4">
                        <div className="text-lg font-semibold text-blue-700">
                          {report.mlAnalysis?.expectedPrice
                            ? formatCurrency(report.mlAnalysis.expectedPrice)
                            : '—'}
                        </div>
                        <div className="text-xs text-gray-500">
                          AI estimated
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {formatDateTime(report.createdAt)}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDelete(report._id)}
                          disabled={deleteLoading === report._id}
                          className="text-red-600 hover:text-red-800 disabled:opacity-50"
                          title="Delete report"
                        >
                          {deleteLoading === report._id ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
                <div className="text-sm text-gray-700">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}{' '}
                  of {pagination.total}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border rounded-lg disabled:opacity-50"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.pages}
                    className="px-3 py-2 border rounded-lg disabled:opacity-50"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
