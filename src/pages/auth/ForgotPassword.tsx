import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GlassCard } from '../../components/common/GlassCard';
import { GlassInput } from '../../components/common/GlassInput';
import { GlassButton } from '../../components/common/GlassButton';
import { motion } from 'motion/react';
import { useToast } from '../../contexts/ToastContext';
import { Mail, CheckCircle, ArrowLeft, AlertCircle } from 'lucide-react';
import { api } from '../../services/apiClient';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { addToast } = useToast();

  const validateEmail = (val: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(val).toLowerCase());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setError('');

    const targetEmail = email.trim();
    if (!targetEmail) {
      setError('Please enter your email address.');
      addToast('Email address is required.', 'warning');
      return;
    }

    if (!validateEmail(targetEmail)) {
      setError('Please enter a valid email address.');
      addToast('Invalid email address format.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post('/auth/forgot-password', { email: targetEmail });
      if (response.success) {
        setSuccess(true);
        addToast('Password reset email sent successfully!', 'success');
      } else {
        throw new Error(response.message || 'Failed to process request');
      }
    } catch (err: any) {
      console.error('Password reset failed:', err);
      const friendlyError = 'Failed to process request. Please try again later or contact support.';
      setError(friendlyError);
      addToast(friendlyError, 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 transition-colors p-4 relative overflow-hidden">
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

      <GlassCard className="w-full max-w-md mx-auto border-white/20 dark:border-white/10 relative z-10 p-6 md:p-8">
        {!success ? (
          <div>
            <h2 className="text-3xl font-bold mb-3 text-foreground flex items-center gap-2">
              <Mail className="text-primary-500" /> Reset Password
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Enter your email address below. If an account is associated with this email, we will send you a password recovery link.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-danger-500/10 border border-danger-500/20 flex items-start gap-2">
                <AlertCircle size={18} className="text-danger-500 shrink-0 mt-0.5" />
                <p className="text-danger-500 text-sm leading-tight">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <GlassInput 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                label="Email Address" 
                placeholder="name@school.edu" 
                disabled={submitting}
                required
              />
              
              <GlassButton 
                type="submit" 
                className="w-full flex justify-center items-center gap-2"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Sending...
                  </>
                ) : 'Send Recovery Email'}
              </GlassButton>
              
              <div className="text-center mt-6">
                <Link to="/login" className="text-sm text-primary-500 hover:underline flex items-center justify-center gap-1.5 font-medium">
                  <ArrowLeft size={16} /> Back to Sign In
                </Link>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="flex justify-center mb-4">
              <CheckCircle size={60} className="text-emerald-500 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-foreground">Email Sent!</h2>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              A secure password reset link has been dispatched to <span className="font-semibold text-foreground">{email}</span>. 
              Please verify your inbox and check your spam folder if the email does not arrive shortly.
            </p>
            
            <div className="border-t border-white/10 pt-4 text-left text-xs text-muted-foreground space-y-2 mb-6">
              <p className="font-semibold text-foreground">Expired Link Troubleshooting:</p>
              <p>• Reset links expire automatically after 1 hour for your account's security.</p>
              <p>• If you get an expired link error, return here and trigger a fresh password reset.</p>
            </div>

            <Link to="/login">
              <GlassButton variant="primary" className="w-full">
                Return to Login
              </GlassButton>
            </Link>
          </div>
        )}
      </GlassCard>
    </div>
  );
};
