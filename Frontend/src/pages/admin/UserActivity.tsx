import { useEffect, useState } from 'react';
import { Users, AlertTriangle } from 'lucide-react';
import { getUserActivity, type UserActivity } from '../../api/adminApi';
import { formatRelativeTime } from '../../utils/formatters';

const UserActivityPage = () => {
  const [users, setUsers] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserActivity();
  }, []);

  const loadUserActivity = async () => {
    try {
      setLoading(true);
      const data = await getUserActivity();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load user activity:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="text-center text-gray-500">Loading user activity...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-3">
          <Users className="text-purple-600" size={28} />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">User Activity</h2>
            <p className="text-sm text-gray-600">
              Monitor user behavior and identify suspicious patterns
            </p>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {users.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-600 font-medium">No user activity data</p>
            <p className="text-sm text-gray-500 mt-1">
              User statistics will appear here once reports are submitted
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    User ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total Reports
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Flagged Reports
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Flagged %
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Last Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Risk Level
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => {
                  const isLowRisk = user.flaggedPercentage < 20;
                  const isMediumRisk =
                    user.flaggedPercentage >= 20 && user.flaggedPercentage < 40;
                  const isHighRisk = user.flaggedPercentage >= 40;

                  return (
                    <tr key={user.userId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-mono text-sm text-gray-900">
                          {user.userId.substring(0, 16)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {user.totalReports}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {user.flaggedReports > 0 && (
                            <AlertTriangle
                              className="text-orange-500"
                              size={16}
                            />
                          )}
                          <span
                            className={`font-medium ${
                              user.flaggedReports > 0
                                ? 'text-orange-600'
                                : 'text-gray-900'
                            }`}
                          >
                            {user.flaggedReports}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                            <div
                              className={`h-2 rounded-full ${
                                isHighRisk
                                  ? 'bg-red-600'
                                  : isMediumRisk
                                  ? 'bg-yellow-500'
                                  : 'bg-green-500'
                              }`}
                              style={{
                                width: `${Math.min(user.flaggedPercentage, 100)}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {user.flaggedPercentage.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatRelativeTime(user.lastActivity)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isLowRisk && (
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                            Low
                          </span>
                        )}
                        {isMediumRisk && (
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full">
                            Medium
                          </span>
                        )}
                        {isHighRisk && (
                          <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                            High
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
      {users.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-sm text-gray-600 mb-1">Total Users</div>
            <div className="text-3xl font-bold text-gray-900">{users.length}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-sm text-gray-600 mb-1">Low Risk</div>
            <div className="text-3xl font-bold text-green-600">
              {users.filter((u) => u.flaggedPercentage < 20).length}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-sm text-gray-600 mb-1">Medium Risk</div>
            <div className="text-3xl font-bold text-yellow-600">
              {
                users.filter(
                  (u) => u.flaggedPercentage >= 20 && u.flaggedPercentage < 40
                ).length
              }
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-sm text-gray-600 mb-1">High Risk</div>
            <div className="text-3xl font-bold text-red-600">
              {users.filter((u) => u.flaggedPercentage >= 40).length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserActivityPage;