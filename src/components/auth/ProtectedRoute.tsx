import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingScreen } from '../common/LoadingScreen';

export const ProtectedRoute = ({ children, allowedRoles }: { children: ReactNode, allowedRoles?: string[] }) => {
  const { user, profile, loading } = useAuth();  
  const location = useLocation();

  if (loading) return <LoadingScreen />;
  if (!user) {return <Navigate to="/login" state={{ from: location }} replace />; }
  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
   return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
