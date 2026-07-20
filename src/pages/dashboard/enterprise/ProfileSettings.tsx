import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';
import { PageHeader } from '../../../components/common/PageHeader';
import { GlassCard } from '../../../components/common/GlassCard';
import { GlassInput } from '../../../components/common/GlassInput';
import { GlassButton } from '../../../components/common/GlassButton';
import { User, Lock, Save, Camera } from 'lucide-react';
import { api } from '../../../services/apiClient';

export const ProfileSettings = () => {
  const { profile, refreshProfile } = useAuth();
  const { addToast } = useToast();
  
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phone: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [saving, setSaving] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || profile.username || '',
        email: profile.email || '',
        phone: profile.phone || '',
      });
    }
  }, [profile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.uid) return;
    
    setSaving(true);
    try {
      await api.post(`/collection/users/${profile.uid}/update`, {
        displayName: formData.displayName,
        phone: formData.phone,
      });
      addToast('Profile updated successfully', 'success');
      refreshProfile();
    } catch (err) {
      addToast('Failed to update profile', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.uid) return;
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addToast('New passwords do not match', 'warning');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      addToast('Password must be at least 6 characters', 'warning');
      return;
    }

    setSavingPwd(true);
    try {
      await api.post(`/collection/users/${profile.uid}/update`, {
        password: passwordData.newPassword,
      });
      addToast('Password updated successfully', 'success');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      addToast('Failed to update password', 'danger');
    } finally {
      setSavingPwd(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Profile Settings" description="Manage your personal information and security." />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <GlassCard className="p-6 flex flex-col items-center justify-center text-center">
            <div className="relative group cursor-pointer mb-4">
              <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-primary-500 to-secondary-500 flex items-center justify-center text-4xl text-white font-bold shadow-xl overflow-hidden">
                {profile?.photoUrl ? (
                  <img src={profile.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  profile?.displayName?.charAt(0) || 'U'
                )}
              </div>
              <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Camera size={24} />
              </div>
            </div>
            <h3 className="text-xl font-bold text-foreground">{profile?.displayName || 'User'}</h3>
            <p className="text-sm text-muted-foreground capitalize mb-4">{profile?.role || 'Admin'}</p>
            <div className="w-full pt-4 border-t border-white/10 flex justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <span className="text-emerald-500 font-semibold capitalize">{profile?.status || 'Active'}</span>
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
              <User size={24} className="text-primary-500" /> Personal Information
            </h3>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GlassInput 
                  label="Full Name" 
                  value={formData.displayName} 
                  onChange={(e) => setFormData({...formData, displayName: e.target.value})} 
                  required 
                />
                <GlassInput 
                  label="Email Address" 
                  type="email" 
                  value={formData.email} 
                  disabled 
                  className="opacity-70 cursor-not-allowed" 
                />
                <GlassInput 
                  label="Phone Number" 
                  type="tel" 
                  value={formData.phone} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                />
              </div>
              <div className="flex justify-end pt-4">
                <GlassButton type="submit" variant="primary" disabled={saving} className="flex items-center gap-2">
                  <Save size={18} /> {saving ? 'Saving...' : 'Save Profile'}
                </GlassButton>
              </div>
            </form>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
              <Lock size={24} className="text-primary-500" /> Security
            </h3>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GlassInput 
                  label="New Password" 
                  type="password" 
                  value={passwordData.newPassword} 
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} 
                  required 
                />
                <GlassInput 
                  label="Confirm New Password" 
                  type="password" 
                  value={passwordData.confirmPassword} 
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} 
                  required 
                />
              </div>
              <div className="flex justify-end pt-4">
                <GlassButton type="submit" variant="glass" disabled={savingPwd} className="flex items-center gap-2">
                  <Lock size={18} /> {savingPwd ? 'Updating...' : 'Update Password'}
                </GlassButton>
              </div>
            </form>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
