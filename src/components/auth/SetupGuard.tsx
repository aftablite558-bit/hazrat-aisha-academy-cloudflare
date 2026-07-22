import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../../services/apiClient';

export const SetupGuard = ({ children }: { children: React.ReactNode }) => {
  const [needsSetup, setNeedsSetup] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkSetup = async () => {
      try {
        const response = await api.get('/auth/check-setup');
        const count = typeof response.count === 'number' ? response.count : 0;
        if (count === 0 && location.pathname !== '/setup') {
          setNeedsSetup(true);
          navigate('/setup');
        } else {
          setNeedsSetup(false);
        }
      } catch (err) {
        console.error('[SetupGuard] Setup check failed:', err);
        setNeedsSetup(false);
      }
    };
    checkSetup();
  }, [navigate, location.pathname]);

  if (needsSetup === null) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return <>{children}</>;
};
