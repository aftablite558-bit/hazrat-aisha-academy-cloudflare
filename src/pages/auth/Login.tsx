import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../../components/common/GlassCard';
import { GlassInput } from '../../components/common/GlassInput';
import { GlassButton } from '../../components/common/GlassButton';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { api } from '../../services/apiClient';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginInputs = z.infer<typeof loginSchema>;

export const Login = () => {
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { addToast } = useToast();
  const navigate = useNavigate();
  const { user, loginUser } = useAuth();
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (user) {
      const role = (user.role || 'user').toLowerCase();
      if (['admin', 'super_admin', 'principal', 'owner', 'staff'].includes(role)) {
        navigate('/dashboard', { replace: true });
      } else if (role === 'teacher') {
        navigate('/teacher', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [user, navigate]);

  const onSubmit = async (data: LoginInputs) => {
    if (submitting) return;
    setError('');
    setSubmitting(true);

    try {
      const response = await api.post('/auth/login', data);
      if (response.success) {
        if (response.user.status === 'inactive' || response.user.status === 'suspended' || response.user.status === 'blocked') {
          setError(`Access denied: User account is ${response.user.status}`);
          addToast(`Access denied: User account is ${response.user.status}`, 'danger');
          setSubmitting(false);
          return;
        }
        loginUser(response.user);
        addToast('Welcome back!', 'success');
        
      } else {
        setError(response.message || 'Login failed');
        addToast(response.message || 'Login failed', 'danger');
      }
    } catch (err: unknown) {
      setError('Login failed. Please try again.');
      addToast('Login failed. Please try again.', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-950 transition-colors p-4 relative overflow-hidden">
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
