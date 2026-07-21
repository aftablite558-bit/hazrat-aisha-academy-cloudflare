import React from 'react';
import { GlassCard } from '../../common/GlassCard';
import { useNavigate } from 'react-router-dom';
import { 
  UserPlus, 
  UserCheck, 
  FileCheck2, 
  BellPlus, 
  ImagePlus, 
  BookPlus, 
  CalendarCheck, 
  Award, 
  BarChart3, 
  Receipt 
} from 'lucide-react';

export const QuickActionsWidget: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      label: 'Add Student',
      icon: UserPlus,
      path: '/dashboard/students',
      color: 'bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500 hover:text-white',
    },
    {
      label: 'Add Teacher',
      icon: UserCheck,
      path: '/dashboard/teachers',
      color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500 hover:text-white',
    },
    {
      label: 'Approve Admissions',
      icon: FileCheck2,
      path: '/dashboard/admissions',
      color: 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500 hover:text-white',
    },
    {
      label: 'Publish Notice',
      icon: BellPlus,
      path: '/dashboard/notices',
      color: 'bg-purple-500/10 text-purple-500 border-purple-500/20 hover:bg-purple-500 hover:text-white',
    },
    {
      label: 'Upload Gallery',
      icon: ImagePlus,
      path: '/dashboard/gallery',
      color: 'bg-pink-500/10 text-pink-500 border-pink-500/20 hover:bg-pink-500 hover:text-white',
    },
    {
      label: 'Create Homework',
      icon: BookPlus,
      path: '/dashboard/homework',
      color: 'bg-teal-500/10 text-teal-500 border-teal-500/20 hover:bg-teal-500 hover:text-white',
    },
    {
      label: 'Mark Attendance',
      icon: CalendarCheck,
      path: '/dashboard/attendance',
      color: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20 hover:bg-cyan-500 hover:text-white',
    },
    {
      label: 'Enter Results',
      icon: Award,
      path: '/dashboard/results',
      color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20 hover:bg-indigo-500 hover:text-white',
    },
    {
      label: 'View Reports',
      icon: BarChart3,
      path: '/dashboard/reports',
      color: 'bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500 hover:text-white',
    },
    {
      label: 'Manage Fees',
      icon: Receipt,
      path: '/dashboard/fees',
      color: 'bg-emerald-600/10 text-emerald-600 border-emerald-600/20 hover:bg-emerald-600 hover:text-white',
    },
  ];

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">Quick Actions</h2>
          <p className="text-xs text-muted-foreground">Fast navigation shortcuts for administrative workflows</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {actions.map((act, idx) => {
          const IconComp = act.icon;
          return (
            <button
              key={idx}
              onClick={() => navigate(act.path)}
              className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-2 text-center transition-all duration-300 font-semibold text-xs shadow-sm hover:shadow-md hover:scale-105 active:scale-95 group ${act.color}`}
            >
              <IconComp size={22} className="transition-transform group-hover:scale-110" />
              <span className="leading-snug">{act.label}</span>
            </button>
          );
        })}
      </div>
    </GlassCard>
  );
};
