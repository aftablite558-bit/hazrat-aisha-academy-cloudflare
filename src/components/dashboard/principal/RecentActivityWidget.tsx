import React, { useState } from 'react';
import { GlassCard } from '../../common/GlassCard';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Award, 
  BookOpen, 
  CalendarCheck, 
  MessageSquare, 
  Briefcase, 
  Bell, 
  ImageIcon, 
  ArrowRight,
  Clock
} from 'lucide-react';

export interface ActivityItem {
  id: string;
  type: 'admission' | 'result' | 'homework' | 'attendance' | 'feedback' | 'career' | 'notice' | 'gallery';
  title: string;
  subtitle: string;
  timestamp: string;
  path: string;
  statusBadge?: string;
}

interface RecentActivityWidgetProps {
  activities: ActivityItem[];
}

export const RecentActivityWidget: React.FC<RecentActivityWidgetProps> = ({ activities }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>('All');

  const filteredActivities = activities.filter((act) => {
    if (filter === 'All') return true;
    return act.type === filter;
  });

  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'admission': return { icon: FileText, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' };
      case 'result': return { icon: Award, color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20' };
      case 'homework': return { icon: BookOpen, color: 'text-teal-500 bg-teal-500/10 border-teal-500/20' };
      case 'attendance': return { icon: CalendarCheck, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' };
      case 'feedback': return { icon: MessageSquare, color: 'text-orange-500 bg-orange-500/10 border-orange-500/20' };
      case 'career': return { icon: Briefcase, color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' };
      case 'notice': return { icon: Bell, color: 'text-sky-500 bg-sky-500/10 border-sky-500/20' };
      case 'gallery': return { icon: ImageIcon, color: 'text-pink-500 bg-pink-500/10 border-pink-500/20' };
      default: return { icon: FileText, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' };
    }
  };

  return (
    <GlassCard className="p-6 flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-white/10 pb-3">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">Recent ERP Activity</h2>
          <p className="text-xs text-muted-foreground">Real-time log of campus updates and submissions</p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs scrollbar-none py-1">
          {['All', 'admission', 'notice', 'homework', 'attendance', 'feedback'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 py-1 rounded-lg font-bold capitalize whitespace-nowrap transition-all ${
                filter === f ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md' : 'bg-white/5 text-muted-foreground hover:text-foreground'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto max-h-[420px] pr-1">
        {filteredActivities.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground text-sm">
            No recent activity logged for this filter.
          </div>
        ) : (
          filteredActivities.slice(0, 10).map((act) => {
            const { icon: IconComp, color } = getIcon(act.type);
            return (
              <div
                key={act.id}
                onClick={() => navigate(act.path)}
                className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-start gap-3.5 transition-all cursor-pointer group"
              >
                <div className={`p-2.5 rounded-xl border ${color} shrink-0`}>
                  <IconComp size={18} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <h4 className="text-sm font-bold text-foreground truncate group-hover:text-primary-500 transition-colors">
                      {act.title}
                    </h4>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 shrink-0 font-medium">
                      <Clock size={11} /> {act.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{act.subtitle}</p>
                </div>

                <ArrowRight size={16} className="text-muted-foreground/40 group-hover:text-primary-500 group-hover:translate-x-1 transition-all shrink-0 self-center" />
              </div>
            );
          })
        )}
      </div>
    </GlassCard>
  );
};
