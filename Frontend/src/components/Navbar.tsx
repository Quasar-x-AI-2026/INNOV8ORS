import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';
import { Home, FileText, History, Bell, User } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();

  const navItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/report', icon: FileText, label: 'Report' },
    { path: '/history', icon: History, label: 'History' },
    { path: '/notifications', icon: Bell, label: 'Alerts' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => navigate('/home')}
          >
            <div className="text-2xl font-bold text-blue-600">FairPrice</div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

         
          <div className="flex items-center space-x-4">
            <div className="hidden md:block text-right">
              <div className="text-sm font-medium text-gray-900">
                {user?.firstName || 'User'}
              </div>
              <div className="text-xs text-gray-500">
                {user?.primaryEmailAddress?.emailAddress}
              </div>
            </div>
            <UserButton afterSignOutUrl="/login" />
          </div>
        </div>
      </div>

      <div className="md:hidden border-t border-gray-200">
        <div className="flex justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center px-3 py-2 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon size={24} />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;