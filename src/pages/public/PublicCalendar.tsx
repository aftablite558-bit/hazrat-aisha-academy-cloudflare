import { useMemo } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { GlassCard } from '../../components/common/GlassCard';
import { GlassBadge } from '../../components/common/GlassBadge';
import { useMasterData } from '../../hooks/useMasterData';
import { CalendarEvent } from '../../types/content';
import { Calendar, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const PublicCalendar = () => {
  const { data: events, loading } = useMasterData<CalendarEvent>('calendar');

  const publishedEvents = useMemo(() => {
    return events.filter(e => e.isPublished).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 selection:bg-primary-500/30">
      <Navbar />
      <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto min-h-screen">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-6">
            Academic <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500">Calendar</span>
          </h1>
          <p className="text-lg text-muted-foreground">Stay updated with upcoming school events, holidays, and examinations.</p>
        </motion.div>

        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-20">Loading calendar events...</div>
          ) : publishedEvents.length === 0 ? (
            <GlassCard className="p-12 text-center text-muted-foreground">No events scheduled at the moment.</GlassCard>
          ) : (
            publishedEvents.map((ev, idx) => (
              <motion.div key={ev.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}>
                <GlassCard className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center border-l-4" style={{ borderLeftColor: ev.isHoliday ? '#f43f5e' : ev.isExamination ? '#f59e0b' : '#3b82f6' }}>
                  <div className="flex-shrink-0 w-24 text-center md:text-left">
                    <div className="text-2xl font-bold text-primary-500">{new Date(ev.date).getDate()}</div>
                    <div className="text-sm font-semibold uppercase text-muted-foreground">{new Date(ev.date).toLocaleString('default', { month: 'short', year: 'numeric' })}</div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-foreground">{ev.title}</h3>
                      {ev.isHoliday && <GlassBadge variant="danger">Holiday</GlassBadge>}
                      {ev.isExamination && <GlassBadge variant="warning">Examination</GlassBadge>}
                    </div>
                    {ev.description && <p className="text-muted-foreground text-sm">{ev.description}</p>}
                  </div>
                </GlassCard>
              </motion.div>
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};
