import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Trash2, Eye } from 'lucide-react';
import {
  getFlaggedReports,
  deleteReport,
  type FlaggedReport,
} from '../../api/adminApi';
import { formatCurrency, formatRelativeTime } from '../../utils/formatters';

const FlaggedReports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<FlaggedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await getFlaggedReports();
      setReports(data);
    } catch (error) {
      console.error('Failed to load flagged reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(id);
      await deleteReport(id);
      setReports((prev) => prev.filter((r) => r._id !== id));
    } catch (error) {
      console.error('Failed to delete report:', error);
      alert('Failed to delete report');
    } finally {
      setDeleting(null);
    }
  };

  const handleInspect = (id: string) => {
    navigate(`/admin/inspect/${id}`);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="text-center text-gray-500">Loading flagged reports...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="text-orange-500" size={28} />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Flagged Reports</h2>
              <p className="text-sm text-gray-600">
                AI-detected anomalies requiring manual review
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-orange-600">{reports.length}</div>
            <div className="text-sm text-gray-600">Total Flagged</div>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {reports.length === 0 ? (
          <div className="text-center py-12">
            <AlertTriangle className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-600 font-medium">No flagged reports</p>
            <p className="text-sm text-gray-500 mt-1">
              All reports are within normal range
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Market
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actual Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Expected Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Deviation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Time
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr key={report._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {report.productName}
                      </div>
                      <div className="text-sm text-gray-500">{report.month}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {report.marketName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-gray-900">
                        {formatCurrency(report.price)}
                      </div>
                      <div className="text-xs text-gray-500">per {report.unit}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-blue-700">
                        {formatCurrency(report.mlAnalysis.expectedPrice)}
                      </div>
                      <div className="text-xs text-gray-500">AI predicted</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-sm font-semibold bg-red-100 text-red-700 rounded">
                        {report.mlAnalysis.deviation}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 max-w-xs">
                        {report.mlAnalysis.reason}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatRelativeTime(report.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleInspect(report._id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Inspect"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(report._id)}
                          disabled={deleting === report._id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlaggedReports;