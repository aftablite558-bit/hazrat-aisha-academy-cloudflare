import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '../types';
import { authService } from '../services/auth';
import { GlassModal } from '../components/common/GlassModal';
import { logAction } from '../services/auditService';

interface AuthContextType {
  user: any | null; // Placeholder
  profile: UserProfile | null;
  loading: boolean;
  logoutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  logoutUser: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const logoutUser = async () => {
    if (user) {
      await logAction({
        uid: user.uid,
        name: profile?.displayName,
        role: profile?.role || 'unknown',
        action: 'LOGOUT',
        status: 'SUCCESS',
        device: navigator.platform,
        browser: navigator.userAgent
      });
    }
    await authService.logout();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

