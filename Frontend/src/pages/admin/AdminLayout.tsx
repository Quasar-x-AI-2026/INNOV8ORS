import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Flag, BarChart3, Users, LogOut } from 'lucide-react';
import { useClerk } from '@clerk/clerk-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useClerk();

  const menuItems = [
    {
      icon: Flag,
      label: 'Flagged Reports',
      path: '/admin/flagged-reports',
    },
    {
      icon: BarChart3,
      label: 'Market Health',
      path: '/admin/markets',
    },
    {
      icon: Users,
      label: 'User Activity',
      path: '/admin/users',
    },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Shield className="text-red-600" size={28} />
              <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Back to App
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-sm text-red-600 hover:text-red-700"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Side Menu */}
          <div className="w-64 shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-8">
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-red-50 text-red-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;