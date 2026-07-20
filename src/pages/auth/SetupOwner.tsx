import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../../components/common/GlassCard';
import { GlassInput } from '../../components/common/GlassInput';
import { GlassButton } from '../../components/common/GlassButton';
import { useToast } from '../../contexts/ToastContext';
import { api } from '../../services/apiClient';

export const SetupOwner = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await api.post('/auth/setup-owner', formData);
      if (response.success) {
        addToast('Owner account created successfully!', 'success');
        navigate('/login');
      } else {
        addToast(response.error || 'Failed to create owner', 'danger');
      }
    } catch (err) {
      addToast('Failed to create owner', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 p-4">
      <GlassCard className="p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Setup Owner Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <GlassInput label="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
          <GlassInput label="Email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
          <GlassInput label="Password" type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />
          <GlassButton type="submit" className="w-full" disabled={submitting}>{submitting ? 'Setting up...' : 'Create Owner'}</GlassButton>
        </form>
      </GlassCard>
    </div>
  );
};
