import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Plus
} from 'lucide-react';
import { PremiumButton } from '../components/common/PremiumButton';
import { PremiumCard } from '../components/common/PremiumCard';

const CalendarPage = () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthDays = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="space-y-12 py-8 px-4">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-black text-neutral-900 tracking-tighter leading-tight">Academic Calendar</h1>
          <p className="text-neutral-500 mt-3 text-lg leading-relaxed">Stay updated with school events, holidays, and examination schedules for October 2023.</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-white border border-neutral-100 rounded-2xl p-1.5 shadow-sm">
            <PremiumButton variant="ghost" size="sm" className="p-2 h-10 w-10">
              <ChevronLeft className="h-5 w-5 text-neutral-600" />
            </PremiumButton>
            <span className="px-6 text-sm font-black text-neutral-900 uppercase tracking-widest">October</span>
            <PremiumButton variant="ghost" size="sm" className="p-2 h-10 w-10">
              <ChevronRight className="h-5 w-5 text-neutral-600" />
            </PremiumButton>
          </div>
          <PremiumButton size="lg" className="shadow-2xl">
            <Plus className="h-5 w-5 mr-2" />
            <span>Add Event</span>
          </PremiumButton>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <PremiumCard padding="none" className="overflow-hidden">
            <div className="grid grid-cols-7 border-b border-neutral-50">
              {days.map(day => (
                <div key={day} className="py-6 text-center text-xs font-black text-neutral-400 uppercase tracking-[0.2em] bg-neutral-50/50">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 min-h-[600px]">
              {/* Empty slots for start of month */}
              {[1, 2, 3].map(i => (
                <div key={`empty-${i}`} className="border-r border-b border-neutral-50 bg-neutral-50/30" />
              ))}
              {monthDays.map(day => (
                <div key={day} className={`border-r border-b border-neutral-50 p-6 transition-all hover:bg-emerald-50/30 cursor-pointer relative group ${day === 22 ? 'bg-emerald-50/50' : ''}`}>
                  <span className={`text-sm font-black transition-colors ${day === 22 ? 'text-emerald-700' : 'text-neutral-400 group-hover:text-neutral-900'}`}>
                    {day}
                  </span>
                  {day === 15 && (
                    <div className="mt-4 space-y-2">
                      <div className="h-2 w-full bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/20" />
                      <p className="text-[10px] font-black text-emerald-800 truncate uppercase tracking-widest">PTM Meeting</p>
                    </div>
                  )}
                  {day === 28 && (
                    <div className="mt-4 space-y-2">
                      <div className="h-2 w-full bg-amber-500 rounded-full shadow-lg shadow-amber-500/20" />
                      <p className="text-[10px] font-black text-amber-800 truncate uppercase tracking-widest">Sports Day</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </PremiumCard>
        </div>

        {/* Sidebar Events */}
        <div className="space-y-8">
          <PremiumCard>
            <h2 className="text-xs font-black text-neutral-400 uppercase tracking-[0.3em] mb-10 flex items-center">
              <CalendarIcon className="h-4 w-4 mr-3 text-emerald-600" />
              Upcoming Events
            </h2>
            <div className="space-y-10">
              {[
                { title: 'Parent Teacher Meeting', time: '09:00 AM - 01:00 PM', date: 'Oct 25, 2023', location: 'Auditorium', color: 'bg-emerald-500' },
                { title: 'Annual Sports Day', time: '08:30 AM - 04:00 PM', date: 'Oct 28, 2023', location: 'Main Ground', color: 'bg-amber-500' },
                { title: 'Winter Vacation Starts', time: 'All Day', date: 'Dec 15, 2023', location: 'N/A', color: 'bg-blue-500' },
              ].map((event, i) => (
                <div key={i} className="relative pl-10 group">
                  <div className={`absolute left-0 top-1.5 h-3 w-3 rounded-full ${event.color} ring-4 ring-neutral-50`} />
                  <div className="absolute left-[5px] top-4 h-full w-px bg-neutral-100 group-last:hidden" />
                  
                  <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">{event.date}</p>
                  <h3 className="text-lg font-black text-neutral-900 mb-4 group-hover:text-emerald-700 transition-colors tracking-tight">{event.title}</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-xs font-bold text-neutral-500 uppercase tracking-tight">
                      <Clock className="h-3.5 w-3.5 mr-2 text-emerald-500" />
                      {event.time}
                    </div>
                    <div className="flex items-center text-xs font-bold text-neutral-500 uppercase tracking-tight">
                      <MapPin className="h-3.5 w-3.5 mr-2 text-emerald-500" />
                      {event.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </PremiumCard>

          <div className="bg-neutral-900 p-12 rounded-[40px] text-white relative overflow-hidden shadow-2xl">
            <h4 className="text-2xl font-black mb-4 tracking-tight">Calendar Sync</h4>
            <p className="text-neutral-400 text-sm leading-relaxed mb-8">
              Synchronize the school calendar with your personal devices to never miss an update.
            </p>
            <PremiumButton variant="secondary" className="w-full bg-white/10 text-white hover:bg-white/20 border-white/10">
              Sync to Device
            </PremiumButton>
            <div className="absolute -bottom-6 -right-6 h-32 w-32 bg-emerald-600/20 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
