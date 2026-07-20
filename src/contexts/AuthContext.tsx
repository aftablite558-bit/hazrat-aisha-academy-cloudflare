import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { UserProfile } from '../types';
import { getUserProfile } from '../firebase/userService';
import { perfTracker } from '../utils/performance';
import { useInactivityLogout } from '../hooks/useInactivityLogout';
import { GlassModal } from '../components/common/GlassModal';
import { logAction } from '../services/auditService';

interface AuthContextType {
  user: User | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

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
    await signOut(auth);
    setUser(null);
    setProfile(null);
  };

  const { showWarning, setShowWarning, resetTimer } = useInactivityLogout();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false); 

        // Background profile fetch with caching
        const fetchProfile = async () => {
          try {
            const cachedStr = localStorage.getItem('local_profile_' + currentUser.uid);
            if (cachedStr) {
              const { profile: cachedProfile, timestamp } = JSON.parse(cachedStr);
              if (Date.now() - timestamp < 5 * 60 * 1000) {
                setProfile(cachedProfile);
                return;
              }
            }

            const profilePromise = getUserProfile(currentUser.uid);
            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
            );
            
            const userProfile = await Promise.race([profilePromise, timeoutPromise]);
            
            if (userProfile) {
              console.log('Profile fetched successfully:', userProfile);
              setProfile(userProfile as UserProfile);
              localStorage.setItem('local_profile_' + currentUser.uid, JSON.stringify({ profile: userProfile, timestamp: Date.now() }));
            } else {
              console.log('Profile fetch returned null for UID:', currentUser.uid);
            }
          } catch (error) {
            console.error('Error loading user profile:', error);
          }
        };

        fetchProfile();
      } else {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, logoutUser }}>
      {children}
      <GlassModal 
        isOpen={showWarning} 
        onClose={() => {
          resetTimer();
          setShowWarning(false);
        }} 
        title="Session Timeout Warning"
      >
        <p className="text-secondary-foreground mb-4">You have been inactive for a while. You will be logged out soon for security reasons.</p>
        <button 
          onClick={() => {
            resetTimer();
            setShowWarning(false);
          }}
          className="w-full glass py-2 rounded-full font-medium"
        >
          Stay Logged In
        </button>
      </GlassModal>
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

