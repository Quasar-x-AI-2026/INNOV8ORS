import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle,
  Trash2,
  User,
  Calendar,
  MapPin,
  Package,
  AlertTriangle,
} from 'lucide-react';
import {
  inspectReport,
  markReportValid,
  deleteReport,
  type ReportDetail,
} from '../../api/adminApi';
import { formatCurrency, formatRelativeTime } from '../../utils/formatters';

const InspectReport = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<ReportDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (id) {
      loadReport(id);
    }
  }, [id]);

  const loadReport = async (reportId: string) => {
    try {
      setLoading(true);
      const data = await inspectReport(reportId);
      setReport(data);
    } catch (error) {
      console.error('Failed to load report:', error);
      alert('Failed to load report');
      navigate('/admin/flagged-reports');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkValid = async () => {
    if (!id || !confirm('Mark this report as valid and clear the anomaly flag?')) {
      return;
    }

    try {
      setProcessing(true);
      await markReportValid(id);
      alert('Report marked as valid');
      navigate('/admin/flagged-reports');
    } catch (error) {
      console.error('Failed to mark report as valid:', error);
      alert('Failed to mark report as valid');
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !confirm('Permanently delete this report? This action cannot be undone.')) {
      return;
    }

    try {
      setProcessing(true);
      await deleteReport(id);
      alert('Report deleted');
      navigate('/admin/flagged-reports');
    } catch (error) {
      console.error('Failed to delete report:', error);
      alert('Failed to delete report');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="text-center text-gray-500">Loading report...</div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="text-center text-gray-500">Report not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <button
          onClick={() => navigate('/admin/flagged-reports')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={20} />
          <span>Back to Flagged Reports</span>
        </button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Report Inspection
            </h1>
            <p className="text-sm text-gray-600">
              Review and take action on this flagged report
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleMarkValid}
              disabled={processing}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              <CheckCircle size={18} />
              <span>Mark as Valid</span>
            </button>
            <button
              onClick={handleDelete}
              disabled={processing}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              <Trash2 size={18} />
              <span>Delete Report</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Report Details */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Report Details
            </h2>
            <div className="space-y-4">
              <InfoRow
                icon={Package}
                label="Product"
                value={report.productName}
              />
              <InfoRow icon={MapPin} label="Market" value={report.marketName} />
              <InfoRow icon={Calendar} label="Month" value={report.month} />
              <InfoRow icon={User} label="User ID" value={report.userId} />
              <InfoRow
                icon={Calendar}
                label="Reported"
                value={formatRelativeTime(report.createdAt)}
              />
            </div>
          </div>

          {/* Price Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Price Information
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Reported Price</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(report.price)} / {report.unit}
                </span>
              </div>
              <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-blue-700">AI Expected Price</span>
                <span className="font-semibold text-blue-900">
                  {formatCurrency(report.mlAnalysis.expectedPrice)} / {report.unit}
                </span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Mandi Benchmark</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(report.mlAnalysis.mandiBenchmark)} / {report.unit}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - ML Analysis */}
        <div className="space-y-6">
          {/* Anomaly Alert */}
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="text-red-600 shrink-0" size={24} />
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-red-900 mb-2">
                  AI Anomaly Detected
                </h2>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-red-700 font-medium mb-1">
                      Deviation
                    </div>
                    <div className="text-2xl font-bold text-red-900">
                      {report.mlAnalysis.deviation}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-red-700 font-medium mb-1">
                      Reason
                    </div>
                    <div className="text-sm text-red-900 bg-white p-3 rounded-lg">
                      {report.mlAnalysis.reason}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Status Information
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-700">Current Status</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    report.status === 'verified'
                      ? 'bg-green-100 text-green-700'
                      : report.status === 'flagged'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {report.status.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Verification Method</span>
                <span className="text-gray-900 font-medium">
                  {report.verificationMethod.toUpperCase()}
                </span>
              </div>
              {report.verifiedBy && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Verified By</span>
                    <span className="text-gray-900 font-medium">
                      {report.verifiedBy}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Verified At</span>
                    <span className="text-gray-900 font-medium">
                      {report.verifiedAt
                        ? formatRelativeTime(report.verifiedAt)
                        : '—'}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface InfoRowProps {
  icon: any;
  label: string;
  value: string;
}

const InfoRow = ({ icon: Icon, label, value }: InfoRowProps) => (
  <div className="flex items-center space-x-3">
    <Icon className="text-gray-400" size={20} />
    <div className="flex-1">
      <div className="text-sm text-gray-600">{label}</div>
      <div className="font-medium text-gray-900">{value}</div>
    </div>
  </div>
);

export default InspectReport;