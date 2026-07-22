cat << 'INNER_EOF' > src/pages/dashboard/enterprise/Users.tsx
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '../../../contexts/ToastContext';
import { PageHeader } from '../../../components/common/PageHeader';
import { GlassCard } from '../../../components/common/GlassCard';
import { GlassTable } from '../../../components/common/GlassTable';
import { GlassBadge } from '../../../components/common/GlassBadge';
import { GlassButton } from '../../../components/common/GlassButton';
import { GlassInput } from '../../../components/common/GlassInput';
import { GlassSelect } from '../../../components/common/GlassSelect';
import { useAuth } from '../../../contexts/AuthContext';
import { UserRole, UserProfile } from '../../../types';
import { Users as UsersIcon, Shield, Edit, Trash2, Plus, RefreshCw, X, Check, Power, AlertTriangle, Key } from 'lucide-react';
import { api } from '../../../services/apiClient';
import { logAction } from '../../../services/auditService';

export const Users = () => {
  const { addToast } = useToast();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('teacher');
  const [formStatus, setFormStatus] = useState<'active' | 'inactive' | 'suspended'>('active');
  const [hasMore, setHasMore] = useState(true);

  const fetchUsers = useCallback(async (loadMore: boolean = false) => {
    if (!loadMore) setLoading(true);
    try {
      const profiles = await api.get('/collection/users');
      setUsers(profiles);
      setHasMore(false);
    } catch (err: any) {
      console.error('Failed to fetch users:', err);
      addToast('Failed to load user list', 'danger');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchUsers(false);
  }, [fetchUsers]);

  const handleOpenAdd = () => {
    setEditingUserId(null);
    setFormName('');
    setFormEmail('');
    setFormPassword('');
    setFormRole('teacher');
    setFormStatus('active');
    setShowModal(true);
  };

  const handleOpenEdit = (user: any) => {
    setEditingUserId(user.id || user.uid);
    setFormName(user.displayName || user.username || '');
    setFormEmail(user.email || '');
    setFormRole(user.role as UserRole || 'teacher');
    setFormStatus(user.status || 'active');
    setShowModal(true);
  };

  const handleOpenPasswordReset = (user: any) => {
    setEditingUserId(user.id || user.uid);
    setFormPassword('');
    setShowPasswordModal(true);
  };

  const handleSubmitUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!formName.trim() || !formEmail.trim() || (!editingUserId && !formPassword.trim())) {
      addToast('Please fill out all required fields', 'warning');
      return;
    }

    if (!editingUserId && formPassword.length < 6) {
      addToast('Password must be at least 6 characters long', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      if (editingUserId) {
        // Edit User
        await api.post(`/collection/users/${editingUserId}/update`, {
          displayName: formName,
          email: formEmail,
          role: formRole,
          status: formStatus,
        });
        addToast('User account updated successfully!', 'success');
        logAction('Edit', 'Users', currentUser?.displayName || 'Admin', `Updated user ${formName}`);
      } else {
        // Create User
        await api.post('/admin/create-user', {
          username: formName, 
          displayName: formName,
          email: formEmail,
          password: formPassword,
          role: formRole,
          status: formStatus,
        });
        addToast('User account created successfully!', 'success');
        logAction('Create', 'Users', currentUser?.displayName || 'Admin', `Created user ${formName}`);
      }

      setShowModal(false);
      await fetchUsers(false);
    } catch (err: any) {
      console.error('Failed to save user:', err);
      addToast('Failed to save user profile', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || !editingUserId) return;
    
    if (formPassword.length < 6) {
      addToast('Password must be at least 6 characters long', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/collection/users/${editingUserId}/update`, {
        password: formPassword
      });
      addToast('Password reset successfully!', 'success');
      logAction('Edit', 'Users', currentUser?.displayName || 'Admin', `Reset password for user ${editingUserId}`);
      setShowPasswordModal(false);
    } catch (err) {
      addToast('Failed to reset password', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (uid: string, newStatus: 'active' | 'inactive' | 'suspended') => {
    if (uid === currentUser?.uid || uid === currentUser?.id) {
      addToast('Safety Guard: You cannot deactivate or suspend your own admin account.', 'warning');
      return;
    }
    try {
      await api.post(`/collection/users/${uid}/update`, { status: newStatus });
      addToast(`Account status updated to ${newStatus}`, 'success');
      logAction('Edit', 'Users', currentUser?.displayName || 'Admin', `Updated user ${uid} status to ${newStatus}`);
      await fetchUsers(false);
    } catch (err) {
      console.error('Failed to update status:', err);
      addToast('Failed to update account status', 'danger');
    }
  };

  const handleDeleteUser = async (uid: string) => {
    if (uid === currentUser?.uid || uid === currentUser?.id) {
      addToast('Safety Guard: You cannot delete your own admin account.', 'warning');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this user? They will no longer be able to log in.')) {
      return;
    }
    try {
      await api.post(`/collection/users/${uid}/delete`, {});
      addToast('User deleted successfully', 'success');
      logAction('Delete', 'Users', currentUser?.displayName || 'Admin', `Deleted user ${uid}`);
      await fetchUsers(false);
    } catch (err) {
      console.error('Failed to delete user:', err);
      addToast('Failed to delete user profile', 'danger');
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role?.toLowerCase()) {
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader 
          title="User Management" 
          description="Manage system access, roles, and user accounts."
        />
        <div className="flex gap-2">
          <GlassButton variant="ghost" onClick={() => fetchUsers(false)} disabled={loading}>
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </GlassButton>
          <GlassButton variant="primary" className="flex items-center gap-2" onClick={handleOpenAdd}>
            <Plus size={18} /> Add User
          </GlassButton>
        </div>
      </div>

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
            {loading && users.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-muted-foreground">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <RefreshCw className="animate-spin" size={24} />
                    <p>Loading users...</p>
                  </div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-muted-foreground">
                  No users found. Create one to get started.
                </td>
              </tr>
            ) : (
              users.map((u: any) => (
                <tr key={u.id || u.uid}>
                  <td className="font-semibold text-primary-500">{u.displayName || u.username || 'Unnamed User'}</td>
                  <td>{u.email}</td>
                  <td>
                    <GlassBadge variant={getRoleBadgeVariant(u.role)}>
                      {(u.role || 'user').toUpperCase()}
                    </GlassBadge>
                  </td>
                  <td>
                    <GlassBadge variant={getStatusBadgeVariant(u.status)}>
                      {(u.status || 'active').toUpperCase()}
                    </GlassBadge>
                  </td>
                  <td>
                    <div className="flex justify-end gap-1">
                      <button 
                        title="Edit User"
                        onClick={() => handleOpenEdit(u)}
                        className="p-2 hover:bg-white/10 rounded-full text-secondary-500 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        title="Reset Password"
                        onClick={() => handleOpenPasswordReset(u)}
                        className="p-2 hover:bg-white/10 rounded-full text-primary-500 transition-colors"
                      >
                        <Key size={16} />
                      </button>
                      
                      {u.status === 'active' ? (
                        <>
                          <button 
                            title="Deactivate Account"
                            onClick={() => handleUpdateStatus(u.id || u.uid, 'inactive')}
                            className="p-2 hover:bg-white/10 rounded-full text-amber-500 transition-colors"
                          >
                            <Power size={16} />
                          </button>
                          <button 
                            title="Suspend Account"
                            onClick={() => handleUpdateStatus(u.id || u.uid, 'suspended')}
                            className="p-2 hover:bg-white/10 rounded-full text-danger-500 transition-colors"
                          >
                            <AlertTriangle size={16} />
                          </button>
                        </>
                      ) : (
                        <button 
                          title="Activate Account"
                          onClick={() => handleUpdateStatus(u.id || u.uid, 'active')}
                          className="p-2 hover:bg-white/10 rounded-full text-emerald-500 transition-colors"
                        >
                          <Check size={16} />
                        </button>
                      )}
                      
                      <button 
                        title="Delete Account"
                        onClick={() => handleDeleteUser(u.id || u.uid)}
                        className="p-2 hover:bg-white/10 rounded-full text-rose-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </GlassTable>
      </GlassCard>

      {/* Add/Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md">
          <GlassCard className="w-full max-w-md p-6 border border-white/20 shadow-2xl relative">
            <button 
              onClick={() => !submitting && setShowModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              disabled={submitting}
            >
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
              <UsersIcon className="text-primary-500" /> {editingUserId ? 'Edit User' : 'Add New User'}
            </h2>

            <form onSubmit={handleSubmitUser} className="space-y-4">
              <GlassInput 
                label="Name *" 
                value={formName} 
                onChange={(e) => setFormName(e.target.value)} 
                required 
                disabled={submitting} 
              />
              <GlassInput 
                label="Email Address *" 
                type="email" 
                value={formEmail} 
                onChange={(e) => setFormEmail(e.target.value)} 
                required 
                disabled={submitting || !!editingUserId} 
              />
              
              {!editingUserId && (
                <GlassInput 
                  label="Password * (Min 6 chars)" 
                  type="password" 
                  value={formPassword} 
                  onChange={(e) => setFormPassword(e.target.value)} 
                  required 
                  disabled={submitting} 
                />
              )}

              <div className="grid grid-cols-2 gap-4">
                <GlassSelect 
                  label="Role *" 
                  value={formRole} 
                  onChange={(e) => setFormRole(e.target.value as UserRole)} 
                  disabled={submitting}
                >
                  <option value="teacher" className="bg-slate-50 dark:bg-slate-900">Teacher</option>
                  <option value="principal" className="bg-slate-50 dark:bg-slate-900">Principal</option>
                  <option value="admin" className="bg-slate-50 dark:bg-slate-900">Admin</option>
                </GlassSelect>
                
                <GlassSelect 
                  label="Status *" 
                  value={formStatus} 
                  onChange={(e) => setFormStatus(e.target.value as any)} 
                  disabled={submitting}
                >
                  <option value="active" className="bg-slate-50 dark:bg-slate-900">Active</option>
                  <option value="inactive" className="bg-slate-50 dark:bg-slate-900">Inactive</option>
                  <option value="suspended" className="bg-slate-50 dark:bg-slate-900">Suspended</option>
                </GlassSelect>
              </div>

              <div className="flex gap-3 pt-4">
                <GlassButton type="button" variant="ghost" className="w-1/2" onClick={() => setShowModal(false)} disabled={submitting}>
                  Cancel
                </GlassButton>
                <GlassButton type="submit" variant="primary" className="w-1/2 flex justify-center items-center gap-2" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save User'}
                </GlassButton>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      {/* Reset Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md">
          <GlassCard className="w-full max-w-md p-6 border border-white/20 shadow-2xl relative">
            <button 
              onClick={() => !submitting && setShowPasswordModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              disabled={submitting}
            >
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
              <Key className="text-primary-500" /> Reset Password
            </h2>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <GlassInput 
                label="New Password *" 
                type="password" 
                value={formPassword} 
                onChange={(e) => setFormPassword(e.target.value)} 
                required 
                disabled={submitting} 
              />
              
              <div className="flex gap-3 pt-4">
                <GlassButton type="button" variant="ghost" className="w-1/2" onClick={() => setShowPasswordModal(false)} disabled={submitting}>
                  Cancel
                </GlassButton>
                <GlassButton type="submit" variant="primary" className="w-1/2 flex justify-center items-center gap-2" disabled={submitting}>
                  {submitting ? 'Resetting...' : 'Reset Password'}
                </GlassButton>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
INNER_EOF
