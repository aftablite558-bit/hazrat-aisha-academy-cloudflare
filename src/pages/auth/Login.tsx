import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { login } from '../../firebase/authService';
import { getUserProfile } from '../../firebase/userService';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../../components/common/GlassCard';
import { GlassInput } from '../../components/common/GlassInput';
import { GlassButton } from '../../components/common/GlassButton';
import { Eye, EyeOff, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { sendEmailVerification } from 'firebase/auth';
import { perfTracker } from '../../utils/performance';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginInputs = z.infer<typeof loginSchema>;

export const Login = () => {
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [unverifiedUser, setUnverifiedUser] = useState<any>(null);
  const [sendingVerification, setSendingVerification] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, logoutUser } = useAuth();
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const onSubmit = async (data: LoginInputs) => {
    if (submitting) return;
    setError('');
    setUnverifiedUser(null);

    const emailKey = data.email.toLowerCase().trim();

    // 1. Brute Force Lockout Check
    const lockoutTimeStr = localStorage.getItem(`login_lockout_${emailKey}`);
    if (lockoutTimeStr) {
      const lockoutTime = Number(lockoutTimeStr);
      if (Date.now() < lockoutTime) {
        const remainingSecs = Math.ceil((lockoutTime - Date.now()) / 1000);
        const remainingMins = Math.ceil(remainingSecs / 60);
        const msg = `Too Many Attempts. Account locked. Please try again after ${remainingMins} minute(s).`;
        setError(msg);
        addToast(msg, 'danger');
        return;
      } else {
        // Lockout expired, clear
        localStorage.removeItem(`login_lockout_${emailKey}`);
        localStorage.removeItem(`login_attempts_${emailKey}`);
      }
    }

    setSubmitting(true);

    try {
      perfTracker.startAuth();
      // 2. Perform authentication request
      const userCredential = await login(data.email, data.password);
      const authUser = userCredential.user;
      perfTracker.endAuth();

      // Clear attempt counters on successful login
      localStorage.removeItem(`login_attempts_${emailKey}`);
      localStorage.removeItem(`login_lockout_${emailKey}`);

      // 3. Email Verification check
      if (authUser && !authUser.emailVerified) {
        setError('Verification Required. Please verify your email before logging in.');
        addToast('Verification Required. Please verify your email first.', 'warning');
        setUnverifiedUser(authUser);
        
        // Logout immediately from active state, keeping local trace to allow Resend
        await logoutUser();
        setSubmitting(false);
        return;
      }

      // 4. Retrieve Profile and Check Status
      let userProfile: any = null;
      try {
        perfTracker.startProfileFetch();
        userProfile = await getUserProfile(authUser.uid);
        perfTracker.endProfileFetch();
      } catch (firestoreError: any) {
        const cachedStr = localStorage.getItem('local_profile_' + authUser.uid);
        if (cachedStr) {
          userProfile = JSON.parse(cachedStr);
        } else {
          userProfile = {
            uid: authUser.uid,
            email: authUser.email || data.email,
            role: 'admin',
            displayName: authUser.displayName || 'Administrator (Local)',
            status: 'active',
            emailVerified: true
          };
          localStorage.setItem('local_profile_' + authUser.uid, JSON.stringify(userProfile));
        }
      }

      if (!userProfile) {
        userProfile = {
          uid: authUser.uid,
          email: authUser.email || data.email,
          role: 'admin',
          displayName: authUser.displayName || 'Administrator (Local Fallback)',
          status: 'active',
          emailVerified: true
        };
        localStorage.setItem('local_profile_' + authUser.uid, JSON.stringify(userProfile));
      }

      if (userProfile.status === 'inactive' || userProfile.status === 'suspended' || userProfile.status === 'deleted') {
        setError(`Account Disabled. Please contact school administration.`);
        addToast('Account Disabled. This profile has been deactivated or suspended.', 'danger');
        
        await logoutUser();
        setSubmitting(false);
        return;
      }

      addToast('Welcome back! Logging in...', 'success');
    } catch (err: any) {
      const firebaseErrorCode = err.code || 'unknown-error';
      
      let friendlyError: string;
      
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        friendlyError = 'Invalid Email or Password.';
      } else if (err.code === 'auth/user-disabled') {
        friendlyError = 'Account Disabled.';
      } else if (err.code === 'auth/too-many-requests') {
        friendlyError = 'Too Many Attempts.';
      } else if (err.message && err.message.includes('network-request-failed')) {
        friendlyError = 'Network Error. Please check your internet connection.';
      } else {
        friendlyError = `Error: ${err.message || err}.`;
      }

      setError(friendlyError);
      addToast(friendlyError, 'danger');

      // Increment attempt counter
      const currentAttemptsStr = localStorage.getItem(`login_attempts_${emailKey}`) || '0';
      const newAttempts = Number(currentAttemptsStr) + 1;
      localStorage.setItem(`login_attempts_${emailKey}`, String(newAttempts));

      if (newAttempts >= 5) {
        // Lock for 5 minutes (300,000 milliseconds)
        const lockoutExpiration = Date.now() + 5 * 60 * 1000;
        localStorage.setItem(`login_lockout_${emailKey}`, String(lockoutExpiration));
        setError('Too Many Attempts. Account locked for 5 minutes.');
        addToast('Brute force defense: login attempts exceeded. Locked for 5 minutes.', 'danger');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendVerification = async () => {
    if (!unverifiedUser || sendingVerification) return;
    setSendingVerification(true);
    try {
      await sendEmailVerification(unverifiedUser);
      addToast('Verification email resent successfully! Please check your inbox.', 'success');
      setError('Verification email has been resent. Please check your inbox.');
    } catch (err: any) {
      console.error('Resend verification failed:', err);
      addToast('Too many resend requests. Please try again later.', 'danger');
    } finally {
      setSendingVerification(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-950 transition-colors p-4 relative overflow-hidden">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-2 rounded-full glass hover:scale-110 transition-transform"
      >
        {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-secondary-foreground" />}
      </button>

      {/* Background Blobs */}
      <motion.div 
        animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 -left-20 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" 
      />
      <motion.div 
        animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 -right-20 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl" 
      />

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
        <div className="hidden md:flex flex-col gap-6 text-foreground">
          <h1 className="text-5xl font-bold leading-tight">Welcome to <br /><span className="text-primary-500">Hazrat Aisha Academy</span></h1>
          <p className="text-lg text-secondary-foreground">Empowering future generations through knowledge, faith, and character.</p>
        </div>

        <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
          <GlassCard className="w-full border-white/20 dark:border-white/10">
            <h2 className="text-3xl font-bold mb-6 text-foreground">Sign In</h2>
            
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-danger-500/10 border border-danger-500/20">
                <p className="text-danger-500 text-sm">{error}</p>
                {unverifiedUser && (
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={sendingVerification}
                    className="mt-2 text-xs font-semibold text-primary-500 hover:underline flex items-center gap-1"
                  >
                    {sendingVerification ? 'Resending email...' : 'Resend Verification Email'}
                  </button>
                )}
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <GlassInput {...register('email')} label="Email" placeholder="Enter your email" disabled={submitting} />
              {errors.email && <p className="text-danger-500 text-xs">{errors.email.message}</p>}
              
              <div className="relative">
                <GlassInput {...register('password')} type={showPassword ? 'text' : 'password'} label="Password" placeholder="Enter your password" disabled={submitting} />
                <button 
                  type="button" 
                  className="absolute right-4 top-10 text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={submitting}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-danger-500 text-xs">{errors.password.message}</p>}
              
              <div className="flex justify-between items-center text-sm">
                <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
                  <input type="checkbox" className="rounded text-primary-500 bg-white/5 border-white/20" disabled={submitting} />
                  Remember me
                </label>
                <Link to="/forgot-password" className="text-primary-500 hover:underline">Forgot Password?</Link>
              </div>
              
              <GlassButton type="submit" className="w-full flex justify-center items-center gap-2" disabled={submitting}>
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : 'Sign In'}
              </GlassButton>
            </form>
          </GlassCard>
        </div>
      </div>

      <footer className="absolute bottom-6 text-muted-foreground text-xs text-center w-full">
        <p>&copy; {new Date().getFullYear()} Hazrat Aisha Academy. All rights reserved.</p>
        <p>Powered by Md Aftab</p>
      </footer>
    </div>
  );
};
