import React from 'react';
import { GlassCard } from '../../common/GlassCard';
import { useNavigate } from 'react-router-dom';
import { 
  CalendarDays, 
  Sun, 
  Cake, 
  Users, 
  Award, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { CalendarEvent } from '../../types/content';

interface UpcomingEventsWidgetProps {
  events: CalendarEvent[];
}

export const UpcomingEventsWidget: React.FC<UpcomingEventsWidgetProps> = ({ events }) => {
  const navigate = useNavigate();

  const getEventBadge = (category: string, isHoliday?: boolean) => {
    if (isHoliday) {
      return { icon: Sun, label: 'Holiday', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' };
    }
    switch (category) {
      case 'Exam': return { icon: Award, label: 'Exam', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' };
      case 'Meeting': return { icon: Users, label: 'Meeting', color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' };
      case 'Birthday': return { icon: Cake, label: 'Birthday', color: 'bg-pink-500/10 text-pink-500 border-pink-500/20' };
      default: return { icon: Sparkles, label: category || 'Event', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' };
    }
  };

  return (
    <GlassCard className="p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">Upcoming Campus Events</h2>
          <p className="text-xs text-muted-foreground">Exams, holidays, meetings, and celebration calendar</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/calendar')}
          className="text-xs text-primary-500 hover:underline flex items-center gap-1 font-semibold"
        >
          View Full Calendar <ArrowRight size={14} />
        </button>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto max-h-[380px] pr-1">
        {events.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground text-sm">
            No upcoming events listed in calendar.
          </div>
        ) : (
          events.slice(0, 6).map((ev) => {
            const { icon: IconComp, label, color } = getEventBadge(ev.category, ev.isHoliday);
            return (
              <div
                key={ev.id}
                className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between gap-3 transition-all cursor-pointer group"
                onClick={() => navigate('/dashboard/calendar')}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2.5 rounded-xl border ${color} shrink-0`}>
                    <IconComp size={18} />
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-foreground truncate group-hover:text-primary-500 transition-colors">
                      {ev.title}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate">{ev.description || label}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-foreground font-mono">
                    {ev.date}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </GlassCard>
  );
};
