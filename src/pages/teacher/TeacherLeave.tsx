import React, { useState, useMemo } from 'react';
import { useCurrentTeacher } from '../../hooks/useCurrentTeacher';
import { useMasterData } from '../../hooks/useMasterData';
import { useToast } from '../../contexts/ToastContext';

import { PageHeader } from '../../components/common/PageHeader';
import { GlassCard } from '../../components/common/GlassCard';
import { GlassButton } from '../../components/common/GlassButton';
import { GlassTable } from '../../components/common/GlassTable';
import { GlassBadge } from '../../components/common/GlassBadge';
import { GlassModal } from '../../components/common/GlassModal';
import { GlassInput } from '../../components/common/GlassInput';
import { GlassSelect } from '../../components/common/GlassSelect';
import { BackButton } from '../../components/common/BackButton';

import { TeacherLeave } from '../../types/academic';
import { Calendar, Plus, Clock, CheckCircle2, XCircle, FileText, Send } from 'lucide-react';

export const TeacherLeavePage: React.FC = () => {
  const { teacher, isLoading } = useCurrentTeacher();
  const { data: leaves, loading: loadingLeaves, addRecord } = useMasterData<TeacherLeave>('teacher_leaves');
  const { addToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    leaveType: 'Casual Leave' as 'Casual Leave' | 'Sick Leave' | 'Earned Leave' | 'Maternity Leave' | 'Emergency Leave',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    reason: '',
  });

  const teacherLeaves = useMemo(() => {
    return leaves
      .filter((l) => l.teacherId === teacher.id)
      .sort((a, b) => new Date(b.appliedDate || 0).getTime() - new Date(a.appliedDate || 0).getTime());
  }, [leaves, teacher.id]);

  // Leave Balances
  const totalSanctionedLeave = 18;
  const approvedLeaveDays = useMemo(() => {
    return teacherLeaves
      .filter((l) => l.status === 'Approved')
      .reduce((acc, l) => acc + (l.totalDays || 1), 0);
  }, [teacherLeaves]);

  const pendingApplications = useMemo(
    () => teacherLeaves.filter((l) => l.status === 'Pending').length,
    [teacherLeaves]
  );

  const remainingBalance = Math.max(0, totalSanctionedLeave - approvedLeaveDays);

  const calculateDays = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    const diffTime = Math.abs(e.getTime() - s.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return isNaN(diffDays) ? 1 : Math.max(1, diffDays);
  };

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.reason.trim()) {
      addToast('Please enter reason for leave application', 'error');
      return;
    }

    const totalDays = calculateDays(formData.startDate, formData.endDate);

    if (totalDays > remainingBalance) {
      addToast(`Requested ${totalDays} days exceeds remaining leave balance of ${remainingBalance} days.`, 'error');
    }

    setIsSaving(true);
    try {
      await addRecord({
        teacherId: teacher.id,
        teacherName: teacher.name,
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        totalDays,
        reason: formData.reason,
        status: 'Pending',
        appliedDate: new Date().toISOString().split('T')[0],
      });

      addToast('Leave application submitted to Principal successfully!', 'success');
      setIsModalOpen(false);
      setFormData({
        leaveType: 'Casual Leave',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        reason: '',
      });
    } catch (err) {
      console.error(err);
      addToast('Failed to submit leave application', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground animate-pulse">Loading Leave Management...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex justify-start mb-[-1.5rem] relative z-20">
        <BackButton />
      </div>

      <PageHeader
        title="Leave Management & Applications"
        description="Apply for leave, track approval status from Principal, and manage your annual leave quotas."
      />

      {/* Leave Balance Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <GlassCard className="p-5 flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Quota</p>
            <h3 className="text-2xl font-bold text-foreground mt-0.5">{totalSanctionedLeave} Days</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Annual Sanctioned Quota</p>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Remaining Balance</p>
            <h3 className="text-2xl font-bold text-emerald-500 mt-0.5">{remainingBalance} Days</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Available to Apply</p>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Used Leaves</p>
            <h3 className="text-2xl font-bold text-foreground mt-0.5">{approvedLeaveDays} Days</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Approved This Academic Session</p>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pending Approval</p>
            <h3 className="text-2xl font-bold text-amber-500 mt-0.5">{pendingApplications}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Under Principal Review</p>
          </div>
        </GlassCard>
      </div>

      {/* Main Action Bar */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <FileText size={20} className="text-primary-500" />
          Leave Application History ({teacherLeaves.length})
        </h3>
        <GlassButton
          variant="primary"
          className="flex items-center gap-2 font-bold px-5 py-2.5"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} /> Apply For Leave
        </GlassButton>
      </div>

      {/* Leave History Table */}
      <GlassTable>
        <thead>
          <tr>
            <th>Applied Date</th>
            <th>Leave Type</th>
            <th>Duration</th>
            <th>Total Days</th>
            <th>Reason</th>
            <th>Approval Status</th>
          </tr>
        </thead>
        <tbody>
          {loadingLeaves ? (
            <tr>
              <td colSpan={6} className="text-center py-8">
                Loading leave history...
              </td>
            </tr>
          ) : teacherLeaves.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-8 text-muted-foreground">
                No leave applications submitted yet.
              </td>
            </tr>
          ) : (
            teacherLeaves.map((l) => (
              <tr key={l.id}>
                <td className="font-mono text-xs">{new Date(l.appliedDate || Date.now()).toLocaleDateString()}</td>
                <td className="font-bold text-primary-500">{l.leaveType}</td>
                <td className="text-xs font-semibold">
                  {new Date(l.startDate).toLocaleDateString()} — {new Date(l.endDate).toLocaleDateString()}
                </td>
                <td className="font-bold text-foreground">{l.totalDays} Day(s)</td>
                <td className="text-xs text-muted-foreground max-w-xs truncate">{l.reason}</td>
                <td>
                  <GlassBadge
                    variant={
                      l.status === 'Approved' ? 'success' : l.status === 'Pending' ? 'warning' : 'error'
                    }
                  >
                    {l.status}
                  </GlassBadge>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </GlassTable>

      {/* APPLY LEAVE MODAL */}
      <GlassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Apply For Leave"
        className="max-w-lg"
      >
        <form onSubmit={handleApplyLeave} className="space-y-4">
          <GlassSelect
            label="Leave Type"
            value={formData.leaveType}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                leaveType: e.target.value as any,
              }))
            }
            options={[
              { label: 'Casual Leave (CL)', value: 'Casual Leave' },
              { label: 'Sick Leave (SL)', value: 'Sick Leave' },
              { label: 'Earned Leave (EL)', value: 'Earned Leave' },
              { label: 'Emergency Leave', value: 'Emergency Leave' },
              { label: 'Maternity Leave', value: 'Maternity Leave' },
            ]}
          />

          <div className="grid grid-cols-2 gap-4">
            <GlassInput
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
              required
            />

            <GlassInput
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
              required
            />
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center text-xs">
            <span className="text-muted-foreground font-semibold">Total Days Requested:</span>
            <span className="font-extrabold text-primary-500 text-sm">
              {calculateDays(formData.startDate, formData.endDate)} Day(s)
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Reason for Leave</label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData((prev) => ({ ...prev, reason: e.target.value }))}
              placeholder="State clear reason for your leave application..."
              rows={3}
              className="w-full p-3 rounded-lg glass bg-white/5 border border-white/10 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <GlassButton type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </GlassButton>
            <GlassButton type="submit" variant="primary" className="font-bold px-6" disabled={isSaving}>
              <Send size={16} className="mr-1" /> {isSaving ? 'Submitting...' : 'Submit Application'}
            </GlassButton>
          </div>
        </form>
      </GlassModal>
    </div>
  );
};
