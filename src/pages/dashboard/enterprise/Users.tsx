import { useState, useEffect } from 'react';
import { useToast } from '../../../contexts/ToastContext';
import { PageHeader } from '../../../components/common/PageHeader';
import { GlassCard } from '../../../components/common/GlassCard';
import { GlassTable } from '../../../components/common/GlassTable';
import { GlassBadge } from '../../../components/common/GlassBadge';
import { GlassButton } from '../../../components/common/GlassButton';
import { useAuth } from '../../../contexts/AuthContext';
import { UserRole, UserProfile } from '../../../types';
import { Users as UsersIcon, Shield, Edit, Trash2, Plus, RefreshCw, X, Check, Power, AlertTriangle } from 'lucide-react';
import { api } from '../../../services/apiClient';

export const Users = () => {
  const { addToast } = useToast();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('teacher');
  const [formStatus, setFormStatus] = useState<'active' | 'inactive' | 'suspended'>('active');

  const [lastVisible, setLastVisible] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchUsers = async (loadMore: boolean = false) => {
    if (!loadMore) setLoading(true);
    try {
      
      const profiles = await api.get('/collection/users');
      
      setUsers(profiles);
      setHasMore(false); // Simplified for now
      
      
    } catch (err: any) {
      console.error('Failed to fetch users:', err);
      addToast('Failed to load user list', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(false);
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!formName.trim() || !formEmail.trim() || !formPassword.trim()) {
      addToast('Please fill out all required fields', 'warning');
      return;
    }

    if (formPassword.length < 6) {
      addToast('Password must be at least 6 characters long', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/auth/admin/create-user', {
        name: formName,
        email: formEmail,
        password: formPassword,
        role: formRole,
        status: formStatus,
      });

      addToast('User account created successfully!', 'success');
      setShowAddModal(false);
      
      setFormName('');
      setFormEmail('');
      setFormPassword('');
      setFormRole('teacher');
      setFormStatus('active');

      await fetchUsers(false);
    } catch (err: any) {
      console.error('Failed to create user:', err);
      addToast('Failed to create user profile', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (uid: string, newStatus: 'active' | 'inactive' | 'suspended') => {
    if (uid === currentUser?.uid) {
      addToast('Safety Guard: You cannot deactivate or suspend your own admin account.', 'warning');
      return;
    }

    try {
      await api.post(`/collection/users/${uid}/update`, { status: newStatus });
      addToast(`Account status updated to ${newStatus}`, 'success');
      await fetchUsers(false);
    } catch (err) {
      console.error('Failed to update status:', err);
      addToast('Failed to update account status', 'danger');
    }
  };

  const handleDeleteUser = async (uid: string) => {
    if (uid === currentUser?.uid) {
      addToast('Safety Guard: You cannot delete your own admin account.', 'warning');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this user? They will no longer be able to log in.')) {
      return;
    }

    try {
      await api.post(`/collection/users/${uid}/delete`, {});
      addToast('User deleted successfully', 'success');
      await fetchUsers(false);
    } catch (err) {
      console.error('Failed to delete user:', err);
      addToast('Failed to delete user profile', 'danger');
    }
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'super_admin': return 'danger';
      case 'admin': return 'danger';
      case 'principal': return 'warning';
      case 'teacher': return 'primary';
      default: return 'default';
    }
  };

  const getStatusBadgeVariant = (status?: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'suspended': return 'danger';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <PageHeader title="User Management" subtitle="Manage system access, roles, and status." />
        <div className="flex gap-3">
          <GlassButton variant="ghost" onClick={fetchUsers} className="p-2 flex items-center justify-center">
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </GlassButton>
          <GlassButton variant="primary" className="flex items-center gap-2" onClick={() => setShowAddModal(true)}>
            <Plus size={18} /> Add User
          </GlassButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <GlassCard className="p-6 flex items-center gap-4">
          <div className="p-4 bg-primary-500/10 text-primary-500 rounded-2xl"><UsersIcon size={24} /></div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Total Active Profiles</p>
            <p className="text-2xl font-bold">{users.filter(u => u.status === 'active').length}</p>
          </div>
        </GlassCard>
        <GlassCard className="p-6 flex items-center gap-4">
          <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl"><Shield size={24} /></div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Teachers</p>
            <p className="text-2xl font-bold">{users.filter(u => u.role === 'teacher').length}</p>
          </div>
        </GlassCard>
        <GlassCard className="p-6 flex items-center gap-4">
          <div className="p-4 bg-danger-500/10 text-danger-500 rounded-2xl"><AlertTriangle size={24} /></div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Suspended / Inactive</p>
            <p className="text-2xl font-bold">{users.filter(u => u.status === 'suspended' || u.status === 'inactive').length}</p>
          </div>
        </GlassCard>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <GlassCard className="overflow-hidden">
          <GlassTable>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-muted-foreground">
                    No user accounts found. Add your first user!
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.uid}>
                    <td className="font-semibold text-primary-500">{u.displayName || 'Unnamed User'}</td>
                    <td>{u.email}</td>
                    <td>
                      <GlassBadge variant={getRoleBadgeVariant(u.role)}>
                        {u.role.toUpperCase()}
                      </GlassBadge>
                    </td>
                    <td>
                      <GlassBadge variant={getStatusBadgeVariant(u.status)}>
                        {(u.status || 'active').toUpperCase()}
                      </GlassBadge>
                    </td>
                    <td>
                      <div className="flex justify-end gap-2">
                        {u.status === 'active' ? (
                          <>
                            <button 
                              title="Deactivate Account"
                              onClick={() => handleUpdateStatus(u.uid, 'inactive')}
                              className="p-2 hover:bg-white/10 rounded-full text-amber-500 transition-colors"
                            >
                              <Power size={18} />
                            </button>
                            <button 
                              title="Suspend Account"
                              onClick={() => handleUpdateStatus(u.uid, 'suspended')}
                              className="p-2 hover:bg-white/10 rounded-full text-danger-500 transition-colors"
                            >
                              <AlertTriangle size={18} />
                            </button>
                          </>
                        ) : (
                          <button 
                            title="Activate Account"
                            onClick={() => handleUpdateStatus(u.uid, 'active')}
                            className="p-2 hover:bg-white/10 rounded-full text-emerald-500 transition-colors"
                          >
                            <Check size={18} />
                          </button>
                        )}
                        <button 
                          title="Delete Account"
                          onClick={() => handleDeleteUser(u.uid)}
                          className="p-2 hover:bg-white/10 rounded-full text-rose-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </GlassTable>
          {hasMore && (
            <div className="p-4 text-center">
              <GlassButton variant="ghost" onClick={() => fetchUsers(true)} disabled={loading}>
                {loading ? 'Loading...' : 'Load More Users'}
              </GlassButton>
            </div>
          )}
        </GlassCard>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md">
          <GlassCard className="w-full max-w-md p-6 border border-white/20 shadow-2xl relative">
            <button 
              onClick={() => !submitting && setShowAddModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              disabled={submitting}
            >
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
              <UsersIcon className="text-primary-500" /> Add New User
            </h2>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-muted-foreground">Name *</label>
                <input 
                  type="text" 
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/20 bg-white/5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="Enter user name"
                  required
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-muted-foreground">Email Address *</label>
                <input 
                  type="email" 
                  value={formEmail}
                  onChange={e => setFormEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/20 bg-white/5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="name@school.edu"
                  required
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-muted-foreground">Password * (Min 6 chars)</label>
                <input 
                  type="password" 
                  value={formPassword}
                  onChange={e => setFormPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/20 bg-white/5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                  disabled={submitting}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-muted-foreground">Role *</label>
                  <select 
                    value={formRole}
                    onChange={e => setFormRole(e.target.value as UserRole)}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/20 bg-slate-900 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    disabled={submitting}
                  >
                    <option value="teacher">Teacher</option>
                    <option value="principal">Principal</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-muted-foreground">Status *</label>
                  <select 
                    value={formStatus}
                    onChange={e => setFormStatus(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/20 bg-slate-900 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    disabled={submitting}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <GlassButton 
                  type="button" 
                  variant="ghost" 
                  className="w-1/2" 
                  onClick={() => setShowAddModal(false)}
                  disabled={submitting}
                >
                  Cancel
                </GlassButton>
                <GlassButton 
                  type="submit" 
                  variant="primary" 
                  className="w-1/2 flex justify-center items-center gap-2"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Creating...
                    </>
                  ) : 'Save User'}
                </GlassButton>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
