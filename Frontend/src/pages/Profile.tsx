import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import Navbar from '../components/Navbar';
import { useStats } from '../api/statsApi';
import { User as UserIcon, Mail, Calendar, Award, TrendingUp } from 'lucide-react';
import { formatDate } from '../utils/formatters';

const Profile = () => {
  const { user } = useUser();
  const { stats, loading, fetchStats } = useStats();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="bg-linear-to-r from-blue-600 to-blue-700 h-32"></div>
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 md:-mt-12">
              <img
                src={user?.imageUrl}
                alt={user?.firstName || 'User'}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
              />
              <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </h1>
                <p className="text-gray-600 mt-1">{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <UserIcon className="mr-2 text-blue-600" size={24} />
              Account Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className="text-gray-400 mr-3 mt-1" size={20} />
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="text-gray-900">
                    {user?.primaryEmailAddress?.emailAddress}
                  </div>
                </div>
              </div>
              <div className="flex items-start">
                <Calendar className="text-gray-400 mr-3 mt-1" size={20} />
                <div>
                  <div className="text-sm text-gray-500">Member Since</div>
                  <div className="text-gray-900">
                    {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>

       
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="mr-2 text-blue-600" size={24} />
              Your Statistics
            </h2>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading statistics...</div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Reports</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {stats?.totalReports || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Verified Reports</span>
                  <span className="text-2xl font-bold text-green-600">
                    {stats?.verifiedReports || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pending Reports</span>
                  <span className="text-2xl font-bold text-yellow-600">
                    {stats?.pendingReports || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">This Week</span>
                  <span className="text-2xl font-bold text-purple-600">
                    {stats?.recentActivity || 0}
                  </span>
                </div>
              </div>
            )}
          </div>

         
          <div className="bg-white rounded-xl shadow-sm p-6 md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="mr-2 text-blue-600" size={24} />
              Achievements
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <AchievementBadge
                title="First Report"
                icon="🎯"
                unlocked={(stats?.totalReports || 0) >= 1}
              />
              <AchievementBadge
                title="10 Reports"
                icon="📊"
                unlocked={(stats?.totalReports || 0) >= 10}
              />
              <AchievementBadge
                title="Verified Pro"
                icon="✅"
                unlocked={(stats?.verifiedReports || 0) >= 5}
              />
              <AchievementBadge
                title="Active Reporter"
                icon="🔥"
                unlocked={(stats?.recentActivity || 0) >= 5}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


interface AchievementBadgeProps {
  title: string;
  icon: string;
  unlocked: boolean;
}

const AchievementBadge = ({ title, icon, unlocked }: AchievementBadgeProps) => {
  return (
    <div
      className={`p-4 rounded-lg border-2 text-center transition-all ${
        unlocked
          ? 'border-blue-600 bg-blue-50'
          : 'border-gray-200 bg-gray-50 opacity-50 grayscale'
      }`}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-sm font-medium text-gray-900">{title}</div>
      {!unlocked && <div className="text-xs text-gray-500 mt-1">Locked</div>}
    </div>
  );
};

export default Profile;