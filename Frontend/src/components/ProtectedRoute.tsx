import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { checkOnboardingStatus } from '../api/authApi';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await checkOnboardingStatus();
        setNeedsOnboarding(status.needsOnboarding);
      } catch (error) {
        console.error('Error checking onboarding:', error);
        setNeedsOnboarding(true);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (needsOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}