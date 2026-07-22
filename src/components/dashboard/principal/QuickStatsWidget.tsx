import React, { useState } from 'react';
import { GlassCard } from '../../common/GlassCard';
import { 
  Users, 
  GraduationCap, 
  UserCheck, 
  BookOpen, 
  Layers, 
  CalendarCheck, 
  FileCheck2, 
  MessageSquareText, 
  Briefcase, 
  BellRing, 
  Image as ImageIcon, 
  CalendarDays, 
  DollarSign, 
  UserPlus,
  UserX,
  Clock
} from 'lucide-react';

export interface QuickStatsData {
  totalStudents: number;
  boysCount: number;
  girlsCount: number;
  totalTeachers: number;
  totalStaff: number;
  totalClasses: number;
  totalSections: number;
  todayAttendancePercent: number;
  todayPresent: number;
  todayAbsent: number;
  todayLeave: number;
  pendingAdmissions: number;
  pendingFeedback: number;
  pendingCareers: number;
  activeNotices: number;
  totalGalleryPhotos: number;
  upcomingExams: number;
  feeCollectionToday: number;
}

interface QuickStatsWidgetProps {
  stats: QuickStatsData;
}

export const QuickStatsWidget: React.FC<QuickStatsWidgetProps> = ({ stats }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'students' | 'attendance' | 'pending'>('all');

  const allCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      subtitle: `${stats.boysCount} Boys • ${stats.girlsCount} Girls`,
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10 border-blue-500/20',
      category: 'students',
    },
    {
      title: 'Total Teachers',
      value: stats.totalTeachers,
      subtitle: 'Faculty Members',
      icon: GraduationCap,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      category: 'students',
    },
    {
      title: 'Total Staff',
      value: stats.totalStaff,
      subtitle: 'Non-Teaching Team',
      icon: UserCheck,
      color: 'text-teal-500',
      bg: 'bg-teal-500/10 border-teal-500/20',
      category: 'students',
    },
    {
      title: 'Classes & Sections',
      value: `${stats.totalClasses} / ${stats.totalSections}`,
      subtitle: 'Active Academic Batches',
      icon: BookOpen,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10 border-purple-500/20',
      category: 'students',
    },
    {
      title: "Today's Attendance",
      value: `${stats.todayAttendancePercent}%`,
      subtitle: `${stats.todayPresent} Present • ${stats.todayAbsent} Absent`,
      icon: CalendarCheck,
      color: stats.todayAttendancePercent >= 85 ? 'text-emerald-500' : 'text-amber-500',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      category: 'attendance',
    },
    {
      title: 'Present / Absent / Leave',
      value: `${stats.todayPresent} / ${stats.todayAbsent} / ${stats.todayLeave}`,
      subtitle: 'Today Student Logs',
      icon: Layers,
      color: 'text-cyan-500',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
      category: 'attendance',
    },
    {
      title: 'Pending Admissions',
      value: stats.pendingAdmissions,
      subtitle: 'Applications Awaiting Action',
      icon: FileCheck2,
      color: stats.pendingAdmissions > 0 ? 'text-amber-500' : 'text-muted-foreground',
      bg: 'bg-amber-500/10 border-amber-500/20',
      category: 'pending',
    },
    {
      title: 'Pending Feedback',
      value: stats.pendingFeedback,
      subtitle: 'Community Complaints & Suggestions',
      icon: MessageSquareText,
      color: stats.pendingFeedback > 0 ? 'text-orange-500' : 'text-muted-foreground',
      bg: 'bg-orange-500/10 border-orange-500/20',
      category: 'pending',
    },
    {
      title: 'Pending Careers',
      value: stats.pendingCareers,
      subtitle: 'Job Applications Under Review',
      icon: Briefcase,
      color: 'text-indigo-500',
      bg: 'bg-indigo-500/10 border-indigo-500/20',
      category: 'pending',
    },
    {
      title: 'Active Notices',
      value: stats.activeNotices,
      subtitle: 'Published Board Announcements',
      icon: BellRing,
      color: 'text-sky-500',
      bg: 'bg-sky-500/10 border-sky-500/20',
      category: 'all',
    },
    {
      title: 'Gallery Photos',
      value: stats.totalGalleryPhotos,
      subtitle: 'Uploaded Campus Photos',
      icon: ImageIcon,
      color: 'text-pink-500',
      bg: 'bg-pink-500/10 border-pink-500/20',
      category: 'all',
    },
    {
      title: 'Upcoming Exams',
      value: stats.upcomingExams,
      subtitle: 'Scheduled Exam Papers',
      icon: CalendarDays,
      color: 'text-violet-500',
      bg: 'bg-violet-500/10 border-violet-500/20',
      category: 'all',
    },
    {
      title: 'Fee Collection Today',
      value: `₹${stats.feeCollectionToday.toLocaleString('en-IN')}`,
      subtitle: 'Receipts Processed Today',
      icon: DollarSign,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      category: 'all',
    },
  ];

  const filteredCards = allCards.filter(card => {
    if (activeTab === 'all') return true;
    return card.category === activeTab;
  });

  return (
    <div className="space-y-4">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-3">
        <h2 className="text-xl font-bold text-foreground tracking-tight">Key School Metrics</h2>
        <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'all' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/20' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            All Stats ({allCards.length})
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'students' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/20' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Students & Staff
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'attendance' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/20' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Attendance
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'pending' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/20' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Action Needed
          </button>
        </div>
      </div>

      {/* Grid of Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCards.map((card, idx) => {
          const IconComponent = card.icon;
          return (
            <GlassCard
              key={idx}
              className="p-5 flex flex-col justify-between hover:border-emerald-500/50 transition-all duration-300 hover:scale-[1.02] group cursor-default"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className={`p-3 rounded-2xl ${card.bg} border flex items-center justify-center`}>
                  <IconComponent size={22} className={card.color} />
                </div>
                <span className="text-[11px] font-semibold text-muted-foreground bg-white/5 px-2 py-1 rounded-md border border-white/10">
                  Live
                </span>
              </div>
              <div>
                <h3 className="text-2xl lg:text-3xl font-black text-foreground tracking-tight group-hover:text-emerald-400 transition-colors">
                  {card.value}
                </h3>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">{card.title}</p>
                <p className="text-[11px] text-muted-foreground/80 font-medium mt-1 truncate">{card.subtitle}</p>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};
