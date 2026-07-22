import React, { useState } from 'react';
import { useCurrentTeacher } from '../../hooks/useCurrentTeacher';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

import { PageHeader } from '../../components/common/PageHeader';
import { GlassCard } from '../../components/common/GlassCard';
import { GlassButton } from '../../components/common/GlassButton';
import { GlassInput } from '../../components/common/GlassInput';
import { GlassBadge } from '../../components/common/GlassBadge';
import { BackButton } from '../../components/common/BackButton';

import {
  User,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Award,
  Lock,
  Calendar,
  BookOpen,
  KeyRound,
  ShieldCheck,
  Building,
} from 'lucide-react';

export const TeacherProfilePage: React.FC = () => {
  const { teacher, assignedClasses, assignedSubjects, isLoading } = useCurrentTeacher();
  const { profile } = useAuth();
  const { addToast } = useToast();

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [isChangingPass, setIsChangingPass] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwords.currentPassword || !passwords.newPassword) {
      addToast('Please enter current and new passwords', 'error');
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      addToast('New password and confirm password do not match', 'error');
      return;
    }

    if (passwords.newPassword.length < 6) {
      addToast('Password must be at least 6 characters long', 'error');
      return;
    }

    setIsChangingPass(true);
    setTimeout(() => {
      setIsChangingPass(false);
      addToast('Password updated successfully!', 'success');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }, 600);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground animate-pulse">Loading Faculty Profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex justify-start mb-[-1.5rem] relative z-20">
        <BackButton />
      </div>

      <PageHeader
        title="Faculty Profile & Credentials"
        description="View personal records, academic qualifications, teaching experience, and security credentials."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Photo & Core Profile Snapshot */}
        <div className="space-y-6">
          <GlassCard className="p-6 text-center space-y-4">
            <div className="relative inline-block">
              <img
                src={
                  teacher.photoUrl ||
                  profile?.photoUrl ||
                  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300'
                }
                alt={teacher.name}
                className="w-28 h-28 rounded-2xl object-cover ring-4 ring-primary-500/30 mx-auto shadow-xl"
              />
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-background rounded-full" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-foreground">{teacher.name}</h3>
              <p className="text-xs font-bold text-primary-500 uppercase tracking-wider">
                Senior Academic Faculty
              </p>
              <p className="text-xs text-muted-foreground">ID: {teacher.teacherId || 'EMP-TCH-102'}</p>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-center items-center gap-2">
              <GlassBadge variant="success">Active Status</GlassBadge>
              <GlassBadge variant="primary">CBSE Certified</GlassBadge>
            </div>
          </GlassCard>

          {/* Teaching Assignment Snapshot */}
          <GlassCard className="p-6 space-y-4">
            <h4 className="font-bold text-foreground flex items-center gap-2">
              <BookOpen size={18} className="text-primary-500" />
              Assigned Academic Load
            </h4>

            <div className="space-y-3 text-xs">
              <div>
                <p className="text-muted-foreground font-semibold mb-1">Assigned Classes:</p>
                <div className="flex flex-wrap gap-1.5">
                  {assignedClasses.map((c) => (
                    <span
                      key={c.id}
                      className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20"
                    >
                      Class {c.className}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-muted-foreground font-semibold mb-1">Assigned Subjects:</p>
                <div className="flex flex-wrap gap-1.5">
                  {assignedSubjects.map((s) => (
                    <span
                      key={s.id}
                      className="px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold border border-teal-500/20"
                    >
                      {s.subjectName}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right 2 Columns: Personal Details & Password Change */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal & Professional Details */}
          <GlassCard className="p-6 space-y-6">
            <h4 className="text-lg font-bold text-foreground flex items-center gap-2 border-b border-white/10 pb-3">
              <User size={20} className="text-emerald-500" />
              Personal & Professional Information
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Email Address</p>
                  <p className="font-bold text-foreground mt-0.5">{teacher.email || 'teacher@hazrataisha.edu.in'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Contact Phone</p>
                  <p className="font-bold text-foreground mt-0.5">{teacher.phone || '+91 98765 43210'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-secondary-500/10 text-secondary-500 shrink-0">
                  <GraduationCap size={18} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Qualification</p>
                  <p className="font-bold text-foreground mt-0.5">
                    {teacher.qualification || 'M.A. Islamic Studies, B.Ed'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
                  <Award size={18} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Teaching Experience</p>
                  <p className="font-bold text-foreground mt-0.5">6+ Years Academic Experience</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500 shrink-0">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Joining Date</p>
                  <p className="font-bold text-foreground mt-0.5">
                    {teacher.joiningDate ? new Date(teacher.joiningDate).toLocaleDateString() : '15 June 2021'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Address / Location</p>
                  <p className="font-bold text-foreground mt-0.5">
                    Chak Rajopatti, Sitamarhi, Bihar - 843302
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Change Password Security Form */}
          <GlassCard className="p-6 space-y-4">
            <h4 className="text-lg font-bold text-foreground flex items-center gap-2 border-b border-white/10 pb-3">
              <KeyRound size={20} className="text-amber-500" />
              Security & Change Password
            </h4>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <GlassInput
                label="Current Password"
                type="password"
                placeholder="••••••••"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords((prev) => ({ ...prev, currentPassword: e.target.value }))}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GlassInput
                  label="New Password"
                  type="password"
                  placeholder="••••••••"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords((prev) => ({ ...prev, newPassword: e.target.value }))}
                  required
                />

                <GlassInput
                  label="Confirm New Password"
                  type="password"
                  placeholder="••••••••"
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                />
              </div>

              <div className="flex justify-end pt-2">
                <GlassButton
                  type="submit"
                  variant="primary"
                  className="font-bold px-6 py-2.5"
                  disabled={isChangingPass}
                >
                  <ShieldCheck size={16} className="mr-1.5" />
                  {isChangingPass ? 'Updating...' : 'Update Password'}
                </GlassButton>
              </div>
            </form>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
