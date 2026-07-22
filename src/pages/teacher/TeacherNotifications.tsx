import React, { useState, useMemo } from 'react';
import { useCurrentTeacher } from '../../hooks/useCurrentTeacher';
import { useMasterData } from '../../hooks/useMasterData';
import { useToast } from '../../contexts/ToastContext';

import { PageHeader } from '../../components/common/PageHeader';
import { GlassCard } from '../../components/common/GlassCard';
import { GlassButton } from '../../components/common/GlassButton';
import { GlassBadge } from '../../components/common/GlassBadge';
import { BackButton } from '../../components/common/BackButton';

import { Notice } from '../../types/content';
import { TeacherLeave } from '../../types/academic';

import {
  Bell,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Calendar,
  Users,
  Clock,
  Filter,
  CheckCheck,
} from 'lucide-react';

export interface TeacherNotificationItem {
  id: string;
  title: string;
  description: string;
  type: 'Notice' | 'Homework' | 'ExamDuty' | 'Meeting' | 'LeaveStatus';
  date: string;
  isRead: boolean;
}

export const TeacherNotificationsPage: React.FC = () => {
  const { teacher, isLoading } = useCurrentTeacher();
  const { data: notices } = useMasterData<Notice>('notices');
  const { data: leaves } = useMasterData<TeacherLeave>('teacher_leaves');
  const { addToast } = useToast();

  const [filterType, setFilterType] = useState<string>('All');
  const [readIds, setReadIds] = useState<Record<string, boolean>>({});

  // Generate notifications list from database notices, leave updates, and academic events
  const notificationItems = useMemo<TeacherNotificationItem[]>(() => {
    const list: TeacherNotificationItem[] = [];

    // 1. School Notices
    notices.forEach((n) => {
      list.push({
        id: `notice-${n.id}`,
        title: n.title,
        description: n.description,
        type: 'Notice',
        date: n.publishDate || 'Recent',
        isRead: !!readIds[`notice-${n.id}`],
      });
    });

    // 2. Leave Updates
    leaves
      .filter((l) => l.teacherId === teacher.id)
      .forEach((l) => {
        list.push({
          id: `leave-${l.id}`,
          title: `Leave Application ${l.status}`,
          description: `Your application for ${l.leaveType} (${l.totalDays} day/s from ${l.startDate}) has been ${l.status.toLowerCase()} by Principal.`,
          type: 'LeaveStatus',
          date: l.appliedDate || 'Recent',
          isRead: !!readIds[`leave-${l.id}`],
        });
      });

    // 3. Exam Duty & Meeting Announcements (System Academic Items)
    list.push({
      id: 'duty-001',
      title: 'Invigilation & Exam Duty Assigned',
      description: 'You have been assigned as Chief Invigilator for Mid-Term Examination 2026 in Room 102.',
      type: 'ExamDuty',
      date: new Date().toISOString().split('T')[0],
      isRead: !!readIds['duty-001'],
    });

    list.push({
      id: 'meeting-001',
      title: 'Staff & Faculty Coordination Meeting',
      description: 'All faculty members are requested to attend the monthly academic progress meeting tomorrow at 02:00 PM.',
      type: 'Meeting',
      date: new Date().toISOString().split('T')[0],
      isRead: !!readIds['meeting-001'],
    });

    return list;
  }, [notices, leaves, teacher.id, readIds]);

  const filteredItems = useMemo(() => {
    return notificationItems.filter((item) => {
      if (filterType === 'All') return true;
      if (filterType === 'Unread') return !item.isRead;
      return item.type === filterType;
    });
  }, [notificationItems, filterType]);

  const markAsRead = (id: string) => {
    setReadIds((prev) => ({ ...prev, [id]: true }));
  };

  const markAllAsRead = () => {
    const updated: Record<string, boolean> = {};
    notificationItems.forEach((item) => {
      updated[item.id] = true;
    });
    setReadIds(updated);
    addToast('All notifications marked as read', 'success');
  };

  const unreadCount = notificationItems.filter((i) => !i.isRead).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground animate-pulse">Loading Notifications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex justify-start mb-[-1.5rem] relative z-20">
        <BackButton />
      </div>

      <PageHeader
        title="Teacher Notifications & Announcements"
        description="Stay updated with school notices, leave status updates, exam duty allocations, and meetings."
      />

      {/* Filter Bar & Quick Actions */}
      <GlassCard className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar w-full sm:w-auto py-1">
            {['All', 'Unread', 'Notice', 'LeaveStatus', 'ExamDuty', 'Meeting'].map((ft) => (
              <button
                key={ft}
                onClick={() => setFilterType(ft)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
                  filterType === ft
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md font-bold'
                    : 'glass text-muted-foreground hover:bg-white/10'
                }`}
              >
                {ft === 'LeaveStatus'
                  ? 'Leave Updates'
                  : ft === 'ExamDuty'
                  ? 'Exam Duty'
                  : ft}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <span className="text-xs font-bold text-muted-foreground">
              Unread: <strong className="text-emerald-500">{unreadCount}</strong>
            </span>
            <GlassButton
              variant="ghost"
              className="text-xs font-semibold flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400"
              onClick={markAllAsRead}
            >
              <CheckCheck size={16} /> Mark All Read
            </GlassButton>
          </div>
        </div>
      </GlassCard>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <GlassCard className="p-8 text-center space-y-2">
            <p className="text-muted-foreground font-medium">No notifications found for selected category.</p>
          </GlassCard>
        ) : (
          filteredItems.map((item) => (
            <GlassCard
              key={item.id}
              className={`p-5 transition-all flex flex-col sm:flex-row items-start justify-between gap-4 border-l-4 ${
                !item.isRead
                  ? 'border-l-emerald-500 bg-emerald-500/10'
                  : 'border-l-transparent bg-white/5 opacity-80'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-2xl shrink-0 ${
                    item.type === 'Notice'
                      ? 'bg-blue-500/10 text-blue-500'
                      : item.type === 'LeaveStatus'
                      ? 'bg-purple-500/10 text-purple-500'
                      : item.type === 'ExamDuty'
                      ? 'bg-amber-500/10 text-amber-500'
                      : 'bg-emerald-500/10 text-emerald-500'
                  }`}
                >
                  {item.type === 'Notice' ? (
                    <Bell size={20} />
                  ) : item.type === 'LeaveStatus' ? (
                    <CheckCircle2 size={20} />
                  ) : item.type === 'ExamDuty' ? (
                    <Calendar size={20} />
                  ) : (
                    <Users size={20} />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-primary-500 uppercase">
                      {item.type}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {item.date}
                    </span>
                    {!item.isRead && (
                      <GlassBadge variant="error" className="text-[9px] py-0 px-1.5">
                        New
                      </GlassBadge>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-foreground">{item.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>

              {!item.isRead && (
                <GlassButton
                  variant="ghost"
                  className="text-xs text-primary-500 shrink-0 self-end sm:self-auto"
                  onClick={() => markAsRead(item.id)}
                >
                  Mark Read
                </GlassButton>
              )}
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
};
