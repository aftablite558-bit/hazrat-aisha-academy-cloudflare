import React, { useState, useMemo } from 'react';
import { useCurrentTeacher } from '../../hooks/useCurrentTeacher';
import { useMasterData } from '../../hooks/useMasterData';

import { PageHeader } from '../../components/common/PageHeader';
import { GlassCard } from '../../components/common/GlassCard';
import { GlassButton } from '../../components/common/GlassButton';
import { GlassBadge } from '../../components/common/GlassBadge';
import { BackButton } from '../../components/common/BackButton';

import { TeacherTimetable as TeacherTimetableType } from '../../types/academic';
import { Subject } from '../../types/master';

import { Calendar, Clock, MapPin, BookOpen, Users, Printer } from 'lucide-react';

export const TeacherTimetable: React.FC = () => {
  const { teacher, assignedClasses, assignedSubjects, isLoading } = useCurrentTeacher();
  const { data: timetables } = useMasterData<TeacherTimetableType>('teacher_timetables');
  const { data: subjects } = useMasterData<Subject>('subjects');

  const [activeDay, setActiveDay] = useState<
    'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'
  >('Monday');

  const daysList: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday')[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  // Default mock schedule if database collection is empty for active teacher
  const defaultSchedule: TeacherTimetableType[] = useMemo(() => {
    return [
      {
        id: 'tt-1',
        teacherId: teacher.id,
        dayOfWeek: 'Monday',
        periodNumber: 1,
        startTime: '08:30 AM',
        endTime: '09:15 AM',
        classId: assignedClasses[0]?.id || 'c-1',
        subjectId: assignedSubjects[0]?.id || 's-1',
        roomNumber: 'Room 101',
      },
      {
        id: 'tt-2',
        teacherId: teacher.id,
        dayOfWeek: 'Monday',
        periodNumber: 3,
        startTime: '10:15 AM',
        endTime: '11:00 AM',
        classId: assignedClasses[1]?.id || 'c-2',
        subjectId: assignedSubjects[1]?.id || 's-2',
        roomNumber: 'Room 104',
      },
      {
        id: 'tt-3',
        teacherId: teacher.id,
        dayOfWeek: 'Monday',
        periodNumber: 5,
        startTime: '12:00 PM',
        endTime: '12:45 PM',
        classId: assignedClasses[0]?.id || 'c-1',
        subjectId: assignedSubjects[2]?.id || 's-3',
        roomNumber: 'Room 102',
      },
      {
        id: 'tt-4',
        teacherId: teacher.id,
        dayOfWeek: 'Tuesday',
        periodNumber: 2,
        startTime: '09:15 AM',
        endTime: '10:00 AM',
        classId: assignedClasses[0]?.id || 'c-1',
        subjectId: assignedSubjects[0]?.id || 's-1',
        roomNumber: 'Room 101',
      },
      {
        id: 'tt-5',
        teacherId: teacher.id,
        dayOfWeek: 'Tuesday',
        periodNumber: 4,
        startTime: '11:00 AM',
        endTime: '11:45 AM',
        classId: assignedClasses[1]?.id || 'c-2',
        subjectId: assignedSubjects[1]?.id || 's-2',
        roomNumber: 'Room 105',
      },
      {
        id: 'tt-6',
        teacherId: teacher.id,
        dayOfWeek: 'Wednesday',
        periodNumber: 1,
        startTime: '08:30 AM',
        endTime: '09:15 AM',
        classId: assignedClasses[0]?.id || 'c-1',
        subjectId: assignedSubjects[0]?.id || 's-1',
        roomNumber: 'Room 101',
      },
      {
        id: 'tt-7',
        teacherId: teacher.id,
        dayOfWeek: 'Thursday',
        periodNumber: 3,
        startTime: '10:15 AM',
        endTime: '11:00 AM',
        classId: assignedClasses[1]?.id || 'c-2',
        subjectId: assignedSubjects[1]?.id || 's-2',
        roomNumber: 'Room 104',
      },
      {
        id: 'tt-8',
        teacherId: teacher.id,
        dayOfWeek: 'Friday',
        periodNumber: 2,
        startTime: '09:15 AM',
        endTime: '10:00 AM',
        classId: assignedClasses[0]?.id || 'c-1',
        subjectId: assignedSubjects[0]?.id || 's-1',
        roomNumber: 'Room 101',
      },
      {
        id: 'tt-9',
        teacherId: teacher.id,
        dayOfWeek: 'Saturday',
        periodNumber: 1,
        startTime: '08:30 AM',
        endTime: '09:15 AM',
        classId: assignedClasses[0]?.id || 'c-1',
        subjectId: assignedSubjects[0]?.id || 's-1',
        roomNumber: 'Room 101',
      },
    ];
  }, [teacher.id, assignedClasses, assignedSubjects]);

  const allTimetables = useMemo(() => {
    const dbItems = timetables.filter((t) => t.teacherId === teacher.id);
    return dbItems.length > 0 ? dbItems : defaultSchedule;
  }, [timetables, teacher.id, defaultSchedule]);

  const currentDaySchedule = useMemo(() => {
    return allTimetables
      .filter((t) => t.dayOfWeek === activeDay)
      .sort((a, b) => a.periodNumber - b.periodNumber);
  }, [allTimetables, activeDay]);

  const getClassName = (id: string) =>
    assignedClasses.find((c) => c.id === id)?.className || 'Class 1';
  const getSubjectName = (id: string) =>
    subjects.find((s) => s.id === id)?.subjectName || 'Islamic Studies';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground animate-pulse">Loading Timetable...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex justify-start mb-[-1.5rem] relative z-20">
        <BackButton />
      </div>

      <PageHeader
        title="Faculty Weekly Timetable"
        description="View your assigned teaching periods, subject slots, class locations, and weekly schedule."
      />

      {/* Day Selector Navigation Tabs */}
      <GlassCard className="p-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar py-1">
            {daysList.map((day) => {
              const dayCount = allTimetables.filter((t) => t.dayOfWeek === day).length;
              return (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                    activeDay === day
                      ? 'bg-primary-500 text-white shadow-lg scale-105'
                      : 'glass text-muted-foreground hover:bg-white/10'
                  }`}
                >
                  <Calendar size={14} />
                  <span>{day}</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 text-white font-extrabold">
                    {dayCount}
                  </span>
                </button>
              );
            })}
          </div>

          <GlassButton
            variant="ghost"
            className="text-xs font-semibold flex items-center gap-2"
            onClick={() => window.print()}
          >
            <Printer size={16} /> Print Timetable
          </GlassButton>
        </div>
      </GlassCard>

      {/* Schedule Cards for Active Day */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Clock size={20} className="text-primary-500" />
          {activeDay} Teaching Schedule ({currentDaySchedule.length} Periods)
        </h3>

        {currentDaySchedule.length === 0 ? (
          <GlassCard className="p-8 text-center space-y-2">
            <p className="text-muted-foreground font-medium">
              No classes scheduled for {activeDay}. You are free during these hours.
            </p>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {currentDaySchedule.map((slot) => (
              <GlassCard
                key={slot.id}
                className="p-6 space-y-4 border-l-4 border-l-primary-500 hover:border-primary-500/50 transition-all"
              >
                <div className="flex justify-between items-center">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-primary-500/20 text-primary-500 border border-primary-500/30">
                    Period {slot.periodNumber}
                  </span>
                  <span className="text-xs font-mono font-bold text-muted-foreground flex items-center gap-1">
                    <Clock size={12} className="text-secondary-500" />
                    {slot.startTime} - {slot.endTime}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xl font-black text-foreground">
                    {getSubjectName(slot.subjectId)}
                  </h4>
                  <p className="text-sm font-semibold text-primary-500 flex items-center gap-1.5">
                    <Users size={16} />
                    Class {getClassName(slot.classId)} - Section A
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex justify-between items-center text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 font-bold text-foreground">
                    <MapPin size={14} className="text-rose-500" />
                    {slot.roomNumber || 'Room 101'}
                  </span>
                  <GlassBadge variant="success" className="text-[10px]">
                    Assigned
                  </GlassBadge>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
