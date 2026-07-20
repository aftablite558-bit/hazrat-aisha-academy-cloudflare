import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '../types';
import { authService } from '../services/auth';
import { logAction } from '../services/auditService';

interface AuthContextType {
  user: any | null;
  profile: UserProfile | null;
  loading: boolean;
  loginUser: (userData: any) => void;
  logoutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  loginUser: () => {},
  logoutUser: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage on mount
    const storedUser = localStorage.getItem('erp_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setProfile({
          uid: parsed.id,
          email: parsed.email,
          displayName: parsed.username || parsed.email,
          role: parsed.role || 'user',
        });
      } catch (e) {
        localStorage.removeItem('erp_user');
      }
    }
    setLoading(false);
  }, []);

  const loginUser = (userData: any) => {
    localStorage.setItem('erp_user', JSON.stringify(userData));
    setUser(userData);
    setProfile({
      uid: userData.id,
      email: userData.email,
      displayName: userData.username || userData.email,
      role: userData.role || 'user',
    });
  };

  const logoutUser = async () => {
    if (user) {
      await logAction({
        uid: user.id || user.uid,
        name: profile?.displayName,
        role: profile?.role || 'unknown',
        action: 'LOGOUT',
        status: 'SUCCESS',
        device: navigator.platform,
        browser: navigator.userAgent
      });
    }
    localStorage.removeItem('erp_user');
    await authService.logout();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

