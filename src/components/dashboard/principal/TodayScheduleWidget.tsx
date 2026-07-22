import React, { useState } from 'react';
import { GlassCard } from '../../common/GlassCard';
import { 
  Calendar, 
  BookOpen, 
  Award, 
  Users, 
  Sun, 
  Clock, 
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { CalendarEvent, Notice } from '../../types/content';
import { ExamSchedule } from '../../types/master';

interface TodayScheduleWidgetProps {
  events: CalendarEvent[];
  exams: ExamSchedule[];
  classesCount: number;
}

export const TodayScheduleWidget: React.FC<TodayScheduleWidgetProps> = ({ events, exams, classesCount }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'classes' | 'exams' | 'events'>('all');

  const todayStr = new Date().toISOString().split('T')[0];

  const todayEvents = events.filter((e) => e.date === todayStr || (e.isPublished && new Date(e.date) >= new Date()));
  const todayExams = exams.filter((ex) => ex.examDate === todayStr || ex.status === 'Scheduled');

  return (
    <GlassCard className="p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">Today's Schedule & Routine</h2>
          <p className="text-xs text-muted-foreground">Active classes, exams, events, and meetings</p>
        </div>

        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl text-xs border border-white/10">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              activeTab === 'all' ? 'bg-primary-500 text-white' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('classes')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              activeTab === 'classes' ? 'bg-primary-500 text-white' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Classes ({classesCount})
          </button>
          <button
            onClick={() => setActiveTab('exams')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              activeTab === 'exams' ? 'bg-primary-500 text-white' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Exams ({todayExams.length})
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              activeTab === 'events' ? 'bg-primary-500 text-white' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Events ({todayEvents.length})
          </button>
        </div>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto max-h-[380px] pr-1">
        {/* Classes Overview summary */}
        {(activeTab === 'all' || activeTab === 'classes') && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-500/20 text-blue-500 rounded-xl">
                <BookOpen size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">Standard Academic Sessions</h4>
                <p className="text-xs text-muted-foreground">{classesCount} Batches running as per Master Time Table</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20 flex items-center gap-1">
              <CheckCircle2 size={12} /> Active
            </span>
          </div>
        )}

        {/* Exams */}
        {(activeTab === 'all' || activeTab === 'exams') && todayExams.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">Examinations</h4>
            {todayExams.slice(0, 4).map((ex) => (
              <div key={ex.id} className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 text-purple-500 rounded-lg">
                    <Award size={18} />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-foreground">{ex.examName}</h5>
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      <span>Class: {ex.classId}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><MapPin size={11} /> Room {ex.roomNumber || 'A1'}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold font-mono text-purple-500 flex items-center gap-1">
                    <Clock size={12} /> {ex.startTime || '09:00 AM'} - {ex.endTime || '12:00 PM'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Calendar Events & Holidays */}
        {(activeTab === 'all' || activeTab === 'events') && todayEvents.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">Upcoming Events & Holidays</h4>
            {todayEvents.slice(0, 4).map((ev) => (
              <div
                key={ev.id}
                className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                  ev.isHoliday
                    ? 'bg-amber-500/10 border-amber-500/20'
                    : 'bg-primary-500/10 border-primary-500/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${ev.isHoliday ? 'bg-amber-500/20 text-amber-500' : 'bg-primary-500/20 text-primary-500'}`}>
                    {ev.isHoliday ? <Sun size={18} /> : <Calendar size={18} />}
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-foreground">{ev.title}</h5>
                    <p className="text-xs text-muted-foreground">{ev.description || ev.category}</p>
                  </div>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  ev.isHoliday ? 'bg-amber-500/20 text-amber-500' : 'bg-primary-500/20 text-primary-500'
                }`}>
                  {ev.date}
                </span>
              </div>
            ))}
          </div>
        )}

        {todayEvents.length === 0 && todayExams.length === 0 && activeTab !== 'classes' && (
          <div className="py-8 text-center text-muted-foreground text-sm">
            No special exams or calendar events listed for today. Regular classes are in session.
          </div>
        )}
      </div>
    </GlassCard>
  );
};
