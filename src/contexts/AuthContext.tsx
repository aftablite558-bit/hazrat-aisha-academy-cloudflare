import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, UserRole } from '../types';
import { authService } from '../services/auth';
import { logAction } from '../services/auditService';

interface AuthContextType {
  user: (Record<string, unknown> & { id: string, email: string, username?: string, role?: string, displayName?: string, photoUrl?: string, phone?: string }) | null;
  profile: UserProfile | null;
  loading: boolean;
  loginUser: (userData: Record<string, unknown> & { id: string, email: string, username?: string, role?: string, displayName?: string, photoUrl?: string, phone?: string }) => void;
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
  const [user, setUser] = useState<(Record<string, unknown> & { id: string, email: string, username?: string, role?: string, displayName?: string, photoUrl?: string, phone?: string }) | null>(null);
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
          displayName: parsed.displayName || parsed.username || parsed.email,
          photoUrl: parsed.photoUrl,
          phone: parsed.phone,
          role: (parsed.role?.toLowerCase() as UserRole) || 'user',
          status: parsed.status || 'active',
        });
      } catch (e) {
        localStorage.removeItem('erp_user');
      }
    }
    setLoading(false);
  }, []);

  const loginUser = (userData: Record<string, unknown> & { id: string, email: string, username?: string, role?: string, displayName?: string, photoUrl?: string, phone?: string }) => {
    localStorage.setItem('erp_user', JSON.stringify(userData));
    setUser(userData);
    logAction('Login', 'Authentication', userData.username || userData.email, 'User logged in');
    setProfile({
      uid: userData.id,
      email: userData.email,
      displayName: userData.displayName || userData.username || userData.email,
      photoUrl: userData.photoUrl,
      phone: userData.phone,
      role: (userData.role?.toLowerCase() as UserRole) || 'user',
      status: (userData.status as any) || 'active',
    });
  };

  const logoutUser = async () => {
    if (user) {
      await logAction('Logout', 'Authentication', profile?.displayName || 'Unknown User', 'User logged out manually');
    
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

