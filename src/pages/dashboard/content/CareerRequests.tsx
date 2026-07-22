import { useState, useMemo } from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { GlassCard } from '../../../components/common/GlassCard';
import { GlassTable } from '../../../components/common/GlassTable';
import { GlassBadge } from '../../../components/common/GlassBadge';
import { GlassButton } from '../../../components/common/GlassButton';
import { GlassModal } from '../../../components/common/GlassModal';
import { GlassInput } from '../../../components/common/GlassInput';
import { GlassTextarea } from '../../../components/common/GlassTextarea';
import { useMasterData } from '../../../hooks/useMasterData';
import { CareerApplication } from '../../../types/content';
import { Briefcase, Calendar, Check, Download, Eye, Mail, Phone, Search, X, Trash2 } from 'lucide-react';
import { useToast } from '../../../contexts/ToastContext';
import { motion } from 'motion/react';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { useAuth } from '../../../contexts/AuthContext';

export const CareerRequests = () => {
  const { data: applications, loading, updateRecord, deleteRecord } = useMasterData<CareerApplication>('career_applications');
  const { addToast } = useToast();
  const { profile } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedApp, setSelectedApp] = useState<CareerApplication | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const filteredApps = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch = app.applicantName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           app.appliedPosition?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    }).sort((a, b) => new Date(b.appliedDate || 0).getTime() - new Date(a.appliedDate || 0).getTime());
  }, [applications, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const total = applications.length;
    const pending = applications.filter(a => a.status === 'Pending').length;
    const review = applications.filter(a => a.status === 'Under Review').length;
    const accepted = applications.filter(a => a.status === 'Accepted').length;
    const rejected = applications.filter(a => a.status === 'Rejected').length;
    return { total, pending, review, accepted, rejected };
  }, [applications]);

  const handleUpdateStatus = async (appId: string, newStatus: CareerApplication['status'], notes?: string) => {
    try {
      await updateRecord(appId, { 
        status: newStatus,
        notes: notes !== undefined ? notes : selectedApp?.notes,
        decisionDate: (newStatus === 'Accepted' || newStatus === 'Rejected') ? new Date().toISOString() : undefined,
        decisionBy: (newStatus === 'Accepted' || newStatus === 'Rejected') ? profile?.displayName : undefined
      });
      addToast(`Application status updated to ${newStatus}`, 'success');
      if (selectedApp && selectedApp.id === appId) {
        setSelectedApp(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (error) {
      console.error(error);
      addToast('Failed to update status', 'error');
    }
  };

  const handleDelete = async () => {
    if (!selectedApp) return;
    try {
      await deleteRecord(selectedApp.id);
      addToast('Application deleted successfully', 'success');
      setSelectedApp(null);
      setShowConfirm(false);
    } catch (error) {
      console.error(error);
      addToast('Failed to delete application', 'error');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Accepted': return <GlassBadge variant="success">Accepted</GlassBadge>;
      case 'Rejected': return <GlassBadge variant="danger">Rejected</GlassBadge>;
      case 'Shortlisted': return <GlassBadge variant="primary">Shortlisted</GlassBadge>;
      case 'Under Review': return <GlassBadge variant="warning">Under Review</GlassBadge>;
      default: return <GlassBadge variant="default">Pending</GlassBadge>;
    }
  };

  

  return (
    <div className="space-y-6">
      <PageHeader
        title="Career Requests"
        description="Manage job applications submitted through the careers page."
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'text-primary-500' },
          { label: 'Pending', value: stats.pending, color: 'text-secondary-500' },
          { label: 'Reviewing', value: stats.review, color: 'text-yellow-500' },
          { label: 'Accepted', value: stats.accepted, color: 'text-emerald-500' },
          { label: 'Rejected', value: stats.rejected, color: 'text-rose-500' }
        ].map(stat => (
          <GlassCard key={stat.label} className="p-4 text-center">
            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 max-w-md w-full">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Search by name, email or position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-foreground"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {['All', 'Pending', 'Under Review', 'Shortlisted', 'Accepted', 'Rejected'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  statusFilter === status 
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-md' 
                    : 'bg-white/5 text-muted-foreground hover:bg-white/10'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <GlassTable>
          <thead>
            <tr>
              <th className="px-6 py-4 font-semibold text-secondary-foreground border-b border-white/10">Applicant</th>
              <th className="px-6 py-4 font-semibold text-secondary-foreground border-b border-white/10">Position</th>
              <th className="px-6 py-4 font-semibold text-secondary-foreground border-b border-white/10">Experience</th>
              <th className="px-6 py-4 font-semibold text-secondary-foreground border-b border-white/10">Date</th>
              <th className="px-6 py-4 font-semibold text-secondary-foreground border-b border-white/10">Status</th>
              <th className="px-6 py-4 font-semibold text-secondary-foreground border-b border-white/10">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">Loading...</td></tr>
            ) : filteredApps.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">No applications found matching your criteria.</td></tr>
            ) : (
              filteredApps.map(app => (
                <tr key={app.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-foreground">{app.applicantName}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail size={12}/> {app.email}</p>
                  </td>
                  <td className="px-6 py-4 font-medium text-primary-600 dark:text-primary-400">{app.appliedPosition}</td>
                  <td className="px-6 py-4">{app.experience}</td>
                  <td className="px-6 py-4">{app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : '-'}</td>
                  <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedApp(app)} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-secondary-foreground transition-colors">
                        <Eye size={16} />
                      </button>
                      {app.resumeUrl && (
                        <button onClick={() => window.open(app.resumeUrl, '_blank')} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-primary-500 transition-colors">
                          <Download size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </GlassTable>
      </GlassCard>

            <GlassModal 
        isOpen={!!selectedApp} 
        onClose={() => setSelectedApp(null)} 
        title="Application Details" 
        className="max-w-2xl"
      >
        {selectedApp && (
          <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{selectedApp.applicantName}</h3>
                  <p className="text-lg font-medium text-primary-500">Applied for: {selectedApp.appliedPosition}</p>
                </div>
                {getStatusBadge(selectedApp.status)}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium flex items-center gap-2"><Mail size={16} className="text-primary-400"/> {selectedApp.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium flex items-center gap-2"><Phone size={16} className="text-primary-400"/> {selectedApp.phone}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Qualification</p>
                  <p className="font-medium">{selectedApp.qualification}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Experience</p>
                  <p className="font-medium">{selectedApp.experience}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Applied On</p>
                  <p className="font-medium flex items-center gap-2"><Calendar size={16} className="text-primary-400"/> {selectedApp.appliedDate ? new Date(selectedApp.appliedDate).toLocaleDateString() : '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Resume</p>
                  {selectedApp.resumeUrl ? (
                    <a href={selectedApp.resumeUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-primary-500 hover:underline flex items-center gap-1">
                      <Download size={16}/> View Resume
                    </a>
                  ) : (
                    <p className="text-muted-foreground">Not provided</p>
                  )}
                </div>
              </div>

              {(selectedApp.status === 'Accepted' || selectedApp.status === 'Rejected') && (
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-sm text-muted-foreground mb-1">Decision Info</p>
                  <p className="font-medium">
                    {selectedApp.status} by {selectedApp.decisionBy || 'Admin'} on {selectedApp.decisionDate ? new Date(selectedApp.decisionDate).toLocaleDateString() : 'Unknown date'}
                  </p>
                </div>
              )}

              <div className="space-y-3 pt-6 border-t border-white/10">
                <h4 className="font-semibold text-foreground">Internal Notes</h4>
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <GlassTextarea 
                      placeholder="Add private notes about this applicant..."
                      value={selectedApp.notes || ''}
                      onChange={(e) => setSelectedApp(prev => prev ? { ...prev, notes: e.target.value } : null)}
                      rows={2}
                    />
                  </div>
                  <GlassButton 
                    className="px-4 py-2 h-[42px]" 
                    variant="ghost" 
                    onClick={() => handleUpdateStatus(selectedApp.id, selectedApp.status, selectedApp.notes)}
                  >
                    Save Note
                  </GlassButton>
                </div>
              </div>
              <div className="space-y-3 pt-6 border-t border-white/10">
                <h4 className="font-semibold text-foreground">Update Status</h4>
                <div className="flex flex-wrap gap-2">
                  <GlassButton className="px-4 py-2" variant={selectedApp.status === 'Pending' ? 'primary' : 'ghost'} onClick={() => handleUpdateStatus(selectedApp.id, 'Pending')}>
                    Pending
                  </GlassButton>
                  <GlassButton className="px-4 py-2" variant={selectedApp.status === 'Under Review' ? 'primary' : 'ghost'} onClick={() => handleUpdateStatus(selectedApp.id, 'Under Review')}>
                    Under Review
                  </GlassButton>
                  <GlassButton className="px-4 py-2" variant={selectedApp.status === 'Shortlisted' ? 'primary' : 'ghost'} onClick={() => handleUpdateStatus(selectedApp.id, 'Shortlisted')}>
                    Shortlisted
                  </GlassButton>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t border-white/10 mt-6">
                <GlassButton variant="ghost" onClick={() => setShowConfirm(true)} className="flex items-center gap-2">
                  <Trash2 size={18} /> Delete Application
                </GlassButton>
                
                <div className="flex gap-3">
                  <GlassButton 
                    variant="ghost" 
                    onClick={() => handleUpdateStatus(selectedApp.id, 'Rejected')}
                    disabled={selectedApp.status === 'Rejected'}
                    className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white border-transparent"
                  >
                    <X size={18} /> Reject
                  </GlassButton>
                  <GlassButton 
                    variant="primary" 
                    onClick={() => handleUpdateStatus(selectedApp.id, 'Accepted')}
                    disabled={selectedApp.status === 'Accepted'}
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white border-transparent"
                  >
                    <Check size={18} /> Accept
                  </GlassButton>
                </div>
              </div>
          </div>
        )}
      </GlassModal>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Delete Application"
        message="Are you sure you want to delete this application? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onClose={() => setShowConfirm(false)}
      />
    </div>
  );
};
