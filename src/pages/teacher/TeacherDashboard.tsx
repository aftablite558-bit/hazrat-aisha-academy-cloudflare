import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCurrentTeacher } from '../../hooks/useCurrentTeacher';
import { useMasterData } from '../../hooks/useMasterData';

import { GlassCard } from '../../components/common/GlassCard';
import { GlassButton } from '../../components/common/GlassButton';
import { GlassBadge } from '../../components/common/GlassBadge';

import { Homework, Attendance, TeacherLeave, Result } from '../../types/academic';
import { Student, ExamSchedule } from '../../types/master';
import { Notice } from '../../types/content';

import {
  Users,
  BookOpen,
  ClipboardList,
  Clock,
  Calendar,
  CheckCircle2,
  FileText,
  Bell,
  Award,
  ChevronRight,
  Plus,
  BookMarked,
  UserCheck,
  AlertCircle,
  Clock3,
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { teacher, assignedClasses, assignedSubjects, isLoading } = useCurrentTeacher();

  const { data: students } = useMasterData<Student>('students');
  const { data: homeworks } = useMasterData<Homework>('homework');
  const { data: attendances } = useMasterData<Attendance>('attendance');
  const { data: exams } = useMasterData<ExamSchedule>('exam_schedules');
  const { data: notices } = useMasterData<Notice>('notices');
  const { data: leaves } = useMasterData<TeacherLeave>('teacher_leaves');

  // Live Time state
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter students belonging to assigned classes
  const assignedClassIds = useMemo(() => assignedClasses.map((c) => c.id), [assignedClasses]);

  const teacherStudents = useMemo(() => {
    return students.filter((s) => assignedClassIds.includes(s.classId));
  }, [students, assignedClassIds]);

  // Homework stats
  const teacherHomeworks = useMemo(() => {
    return homeworks.filter(
      (h) => h.teacherId === teacher.id || assignedClassIds.includes(h.classId)
    );
  }, [homeworks, teacher.id, assignedClassIds]);

  const pendingHomeworks = useMemo(
    () => teacherHomeworks.filter((h) => !h.isPublished || h.status === 'Draft'),
    [teacherHomeworks]
  );

  const publishedHomeworks = useMemo(
    () => teacherHomeworks.filter((h) => h.isPublished),
    [teacherHomeworks]
  );

  // Today's Attendance stats
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const todayAttendance = useMemo(() => {
    return attendances.filter(
      (a) => a.date === todayStr && assignedClassIds.includes(a.classId)
    );
  }, [attendances, todayStr, assignedClassIds]);

  const isAttendanceCompletedToday = todayAttendance.length > 0;

  // Upcoming Exams
  const upcomingExams = useMemo(() => {
    return exams.filter(
      (e) => assignedClassIds.includes(e.classId) || e.status === 'Scheduled'
    );
  }, [exams, assignedClassIds]);

  // Leave Balance (e.g. 18 total - used leaves)
  const teacherLeaves = useMemo(
    () => leaves.filter((l) => l.teacherId === teacher.id),
    [leaves, teacher.id]
  );

  const usedLeaveDays = useMemo(() => {
    return teacherLeaves
      .filter((l) => l.status === 'Approved')
      .reduce((acc, l) => acc + (l.totalDays || 1), 0);
  }, [teacherLeaves]);

  const remainingLeaveBalance = Math.max(0, 18 - usedLeaveDays);

  const formattedDate = useMemo(() => {
    return currentTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, [currentTime]);

  const formattedTime = useMemo(() => {
    return currentTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  }, [currentTime]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground animate-pulse">Loading Teacher Portal...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* 1. Header Banner & Profile Snapshot */}
      <GlassCard className="p-6 md:p-8 relative overflow-hidden bg-gradient-to-r from-primary-500/10 via-secondary-500/5 to-teal-500/10 border-primary-500/20">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <img
                src={
                  teacher.photoUrl ||
                  profile?.photoUrl ||
                  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300'
                }
                alt={teacher.name}
                className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover ring-4 ring-primary-500/30 shadow-lg"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-background rounded-full" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-500/20 text-primary-500 border border-primary-500/30">
                  EMP ID: {teacher.teacherId || 'EMP-TCH-102'}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                  Senior Faculty
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
                Welcome back, {teacher.name}!
              </h1>
              <p className="text-sm text-muted-foreground">
                {teacher.qualification || 'M.A., B.Ed (CBSE Certified)'}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1 flex-wrap">
                <span className="flex items-center gap-1 font-medium text-foreground">
                  <BookOpen size={14} className="text-primary-500" />
                  Assigned Classes: {assignedClasses.map((c) => c.className).join(', ') || 'Class 1, Class 2'}
                </span>
                <span className="flex items-center gap-1 font-medium text-foreground">
                  <Award size={14} className="text-secondary-500" />
                  Subjects: {assignedSubjects.map((s) => s.subjectName).join(', ') || 'Islamic Studies, Math'}
                </span>
              </div>
            </div>
          </div>

          {/* Date & Live Clock Widget */}
          <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between bg-white/10 dark:bg-slate-900/40 backdrop-blur-md p-4 rounded-2xl border border-white/20 gap-2 shrink-0">
            <div className="flex items-center gap-2 text-sm font-medium text-primary-500">
              <Calendar size={18} />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-2xl font-black tracking-wider text-foreground font-mono">
              <Clock size={20} className="text-secondary-500 animate-pulse" />
              <span>{formattedTime}</span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* 2. Quick Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <GlassCard className="p-5 flex items-center gap-4 hover:border-primary-500/40 transition-all cursor-pointer" onClick={() => navigate('/teacher/classes')}>
          <div className="p-3.5 rounded-2xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Assigned Classes</p>
            <h3 className="text-2xl font-bold text-foreground mt-0.5">{assignedClasses.length}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{teacherStudents.length} Total Students</p>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-center gap-4 hover:border-amber-500/40 transition-all cursor-pointer" onClick={() => navigate('/teacher/homework')}>
          <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Homework Status</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold text-foreground">{pendingHomeworks.length}</span>
              <span className="text-xs text-amber-500 font-medium">Pending</span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{publishedHomeworks.length} Active Published</p>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-center gap-4 hover:border-emerald-500/40 transition-all cursor-pointer" onClick={() => navigate('/teacher/attendance')}>
          <div className={`p-3.5 rounded-2xl ${isAttendanceCompletedToday ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}>
            <UserCheck size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Today's Attendance</p>
            <div className="mt-0.5">
              {isAttendanceCompletedToday ? (
                <GlassBadge variant="success" className="text-xs">Completed</GlassBadge>
              ) : (
                <GlassBadge variant="error" className="text-xs">Pending Today</GlassBadge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{todayAttendance.length} records marked</p>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-center gap-4 hover:border-purple-500/40 transition-all cursor-pointer" onClick={() => navigate('/teacher/leave')}>
          <div className="p-3.5 rounded-2xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
            <Clock3 size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Leave Balance</p>
            <h3 className="text-2xl font-bold text-foreground mt-0.5">{remainingLeaveBalance} Days</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{usedLeaveDays} Days Used This Session</p>
          </div>
        </GlassCard>
      </div>

      {/* 3. Quick Action Shortcuts */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <CheckCircle2 size={20} className="text-primary-500" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <GlassButton variant="glass" className="h-20 flex-col items-center justify-center text-xs gap-2" onClick={() => navigate('/teacher/attendance')}>
            <ClipboardList size={20} className="text-emerald-500" />
            <span>Mark Attendance</span>
          </GlassButton>

          <GlassButton variant="glass" className="h-20 flex-col items-center justify-center text-xs gap-2" onClick={() => navigate('/teacher/homework')}>
            <Plus size={20} className="text-amber-500" />
            <span>Create Homework</span>
          </GlassButton>

          <GlassButton variant="glass" className="h-20 flex-col items-center justify-center text-xs gap-2" onClick={() => navigate('/teacher/results')}>
            <BookMarked size={20} className="text-purple-500" />
            <span>Result Entry</span>
          </GlassButton>

          <GlassButton variant="glass" className="h-20 flex-col items-center justify-center text-xs gap-2" onClick={() => navigate('/teacher/timetable')}>
            <Calendar size={20} className="text-blue-500" />
            <span>My Timetable</span>
          </GlassButton>

          <GlassButton variant="glass" className="h-20 flex-col items-center justify-center text-xs gap-2" onClick={() => navigate('/teacher/leave')}>
            <FileText size={20} className="text-rose-500" />
            <span>Apply Leave</span>
          </GlassButton>

          <GlassButton variant="glass" className="h-20 flex-col items-center justify-center text-xs gap-2" onClick={() => navigate('/teacher/profile')}>
            <Users size={20} className="text-teal-500" />
            <span>My Profile</span>
          </GlassButton>
        </div>
      </div>

      {/* 4. Main Two Column Grid: My Assigned Classes & Recent Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: My Assigned Classes */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Users size={20} className="text-primary-500" />
              My Assigned Classes ({assignedClasses.length})
            </h3>
            <GlassButton variant="ghost" className="text-xs flex items-center gap-1 text-primary-500" onClick={() => navigate('/teacher/classes')}>
              View All <ChevronRight size={14} />
            </GlassButton>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {assignedClasses.map((cls) => {
              const classStudentCount = students.filter((s) => s.classId === cls.id).length;
              return (
                <GlassCard key={cls.id} className="p-5 flex flex-col justify-between hover:border-primary-500/40 transition-all space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary-500/10 text-primary-500 border border-primary-500/20">
                        {cls.className}
                      </span>
                      <h4 className="text-lg font-bold text-foreground mt-2">Class {cls.className}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">Section A • Morning Shift</p>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500">
                      <Users size={20} />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      {classStudentCount} Enrolled Students
                    </span>
                    <GlassButton
                      variant="primary"
                      className="text-xs py-1 px-3 flex items-center gap-1"
                      onClick={() => navigate(`/teacher/classes?classId=${cls.id}`)}
                    >
                      Open Class <ChevronRight size={12} />
                    </GlassButton>
                  </div>
                </GlassCard>
              );
            })}
          </div>

          {/* Homework List Preview */}
          <GlassCard className="p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h4 className="font-bold text-foreground flex items-center gap-2">
                <BookOpen size={18} className="text-amber-500" />
                Recent Homework Assignments
              </h4>
              <GlassButton variant="ghost" className="text-xs text-amber-500" onClick={() => navigate('/teacher/homework')}>
                Manage Homework
              </GlassButton>
            </div>

            {teacherHomeworks.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No homework assigned yet.</p>
            ) : (
              <div className="space-y-3">
                {teacherHomeworks.slice(0, 4).map((hw) => (
                  <div key={hw.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-foreground">{hw.title}</span>
                        <GlassBadge variant={hw.isPublished ? 'success' : 'default'} className="text-[10px]">
                          {hw.isPublished ? 'Published' : 'Draft'}
                        </GlassBadge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Due Date: {new Date(hw.dueDate).toLocaleDateString()} • {hw.description.substring(0, 40)}...
                      </p>
                    </div>
                    <GlassButton variant="ghost" className="text-xs" onClick={() => navigate('/teacher/homework')}>
                      View
                    </GlassButton>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>

        {/* Right 1 Col: Recent Announcements & Timetable Preview */}
        <div className="space-y-6">
          {/* Today's Timetable Preview Card */}
          <GlassCard className="p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h4 className="font-bold text-foreground flex items-center gap-2">
                <Calendar size={18} className="text-blue-500" />
                Today's Schedule
              </h4>
              <span className="text-xs font-semibold text-blue-500 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                Active
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-primary-500/10 border border-primary-500/20 space-y-1">
                <div className="flex justify-between text-xs font-semibold text-primary-500">
                  <span>Period 1 (08:30 AM - 09:15 AM)</span>
                  <span>Room 102</span>
                </div>
                <p className="text-sm font-bold text-foreground">Islamic Studies • Class 1</p>
              </div>

              <div className="p-3 rounded-xl bg-secondary-500/10 border border-secondary-500/20 space-y-1">
                <div className="flex justify-between text-xs font-semibold text-secondary-500">
                  <span>Period 3 (10:15 AM - 11:00 AM)</span>
                  <span>Room 104</span>
                </div>
                <p className="text-sm font-bold text-foreground">Mathematics • Class 2</p>
              </div>

              <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 space-y-1">
                <div className="flex justify-between text-xs font-semibold text-teal-500">
                  <span>Period 5 (12:00 PM - 12:45 PM)</span>
                  <span>Room 101</span>
                </div>
                <p className="text-sm font-bold text-foreground">Urdu Grammar • Class 3</p>
              </div>
            </div>

            <GlassButton variant="glass" className="w-full text-xs" onClick={() => navigate('/teacher/timetable')}>
              Full Weekly Timetable
            </GlassButton>
          </GlassCard>

          {/* School Notices & Announcements */}
          <GlassCard className="p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h4 className="font-bold text-foreground flex items-center gap-2">
                <Bell size={18} className="text-rose-500" />
                School Announcements
              </h4>
              <GlassButton variant="ghost" className="text-xs text-rose-500" onClick={() => navigate('/teacher/notifications')}>
                All
              </GlassButton>
            </div>

            <div className="space-y-3">
              {notices.slice(0, 3).map((notice) => (
                <div key={notice.id} className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary-500">{notice.category || 'General Notice'}</span>
                    <span className="text-[10px] text-muted-foreground">{notice.publishDate || 'Recent'}</span>
                  </div>
                  <h5 className="text-xs font-bold text-foreground">{notice.title}</h5>
                  <p className="text-[11px] text-muted-foreground line-clamp-2">{notice.description}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
