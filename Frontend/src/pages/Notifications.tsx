import Navbar from '../components/Navbar';
import { Bell } from 'lucide-react';

const Notifications = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Bell className="mx-auto text-gray-400 mb-4" size={64} />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Notifications</h1>
          <p className="text-gray-600 mb-6">
            This feature is coming soon! You'll receive notifications about price alerts, report
            verifications, and important updates.
          </p>
          <div className="inline-block bg-blue-50 text-blue-700 px-6 py-3 rounded-lg">
            🚧 Under Construction
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
