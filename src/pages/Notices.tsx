import { 
  Bell, 
  Plus, 
  Search, 
  Calendar,
  Tag,
  MoreVertical
} from 'lucide-react';
import { PremiumButton } from '../components/common/PremiumButton';
import { PremiumCard } from '../components/common/PremiumCard';
import { PremiumInput } from '../components/common/PremiumInput';

const Notices = () => {
  return (
    <div className="space-y-12 py-8 px-4">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-black text-neutral-900 tracking-tighter leading-tight">Notice Board</h1>
          <p className="text-neutral-500 mt-3 text-lg leading-relaxed">Official announcements and circulars for the Hazrat Aisha Academy community.</p>
        </div>
        <PremiumButton size="lg" className="shadow-2xl">
          <Plus className="h-5 w-5 mr-2" />
          <span>New Notice</span>
        </PremiumButton>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          <PremiumCard padding="sm">
            <PremiumInput 
              label="Search Announcements"
              placeholder="Filter notices by title, content or author..."
              icon={<Search className="h-5 w-5" />}
            />
          </PremiumCard>

          <div className="space-y-6">
            {[
              { title: 'Annual Sports Day 2024', date: 'Oct 28, 2023', category: 'Events', content: 'We are pleased to announce the Annual Sports Day scheduled for next month. All students are encouraged to participate and showcase their athletic skills. Participation forms are available in the office.', author: 'Admin' },
              { title: 'Revision of School Timings', date: 'Oct 25, 2023', category: 'Academic', content: 'Due to the changing weather conditions, the school timings have been revised. New timings: 8:30 AM to 2:00 PM. All bus routes will be adjusted accordingly. Please cooperate with the transport staff.', author: 'Principal' },
              { title: 'Islamic Quiz Competition', date: 'Oct 22, 2023', category: 'Co-Curricular', content: 'A city-wide Islamic Quiz Competition will be held at our academy. Registrations are now open for Class 5 to 10. Topics include Seerah, Fiqh, and Islamic History. Winning students will receive special certificates.', author: 'Academic Coordinator' },
            ].map((notice, i) => (
              <PremiumCard key={i} className="group relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div className="space-y-6 flex-1">
                    <div className="flex items-center space-x-4">
                      <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-100">
                        {notice.category}
                      </span>
                      <span className="text-neutral-400 text-xs font-bold flex items-center uppercase tracking-widest">
                        <Calendar className="h-4 w-4 mr-2 text-emerald-500" />
                        {notice.date}
                      </span>
                    </div>
                    <h2 className="text-2xl font-black text-neutral-900 group-hover:text-emerald-700 transition-colors tracking-tight leading-tight">
                      {notice.title}
                    </h2>
                    <p className="text-neutral-500 text-sm leading-relaxed max-w-3xl">
                      {notice.content}
                    </p>
                    <div className="flex items-center space-x-4 pt-4 border-t border-neutral-50">
                      <div className="h-10 w-10 rounded-2xl bg-neutral-100 flex items-center justify-center text-sm font-black text-neutral-500 border border-neutral-200">
                        {notice.author.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-neutral-900 tracking-tight">Posted by {notice.author}</span>
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Academic Department</span>
                      </div>
                    </div>
                  </div>
                  <button className="p-3 text-neutral-300 hover:text-neutral-900 hover:bg-neutral-50 rounded-2xl transition-all border border-transparent hover:border-neutral-100">
                    <MoreVertical className="h-6 w-6" />
                  </button>
                </div>
                {/* Visual Accent */}
                <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500/10 group-hover:bg-emerald-500 transition-colors" />
              </PremiumCard>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <PremiumCard>
            <h3 className="text-xs font-black text-neutral-400 uppercase tracking-[0.3em] mb-8 flex items-center">
              <Tag className="h-4 w-4 mr-2 text-emerald-600" />
              Categories
            </h3>
            <div className="space-y-3">
              {['Academic', 'Events', 'Holidays', 'Examinations', 'Fee Circulars'].map((cat, i) => (
                <button key={i} className="w-full text-left px-5 py-4 rounded-2xl text-sm font-bold text-neutral-500 hover:bg-emerald-50 hover:text-emerald-700 transition-all flex items-center justify-between border border-transparent hover:border-emerald-100 group">
                  {cat}
                  <span className="text-[10px] font-black bg-neutral-100 px-3 py-1 rounded-full text-neutral-400 group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-colors">12</span>
                </button>
              ))}
            </div>
          </PremiumCard>

          <div className="bg-emerald-900 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl shadow-emerald-900/20">
            <div className="relative z-10">
              <h4 className="text-2xl font-black mb-4 tracking-tight">Emergency?</h4>
              <p className="text-emerald-200/70 text-sm leading-relaxed mb-8">
                Broadcast urgent notifications to all parents and staff instantly via SMS and App alerts.
              </p>
              <PremiumButton variant="secondary" className="w-full bg-white text-emerald-900 hover:bg-emerald-50">
                Send Urgent Alert
              </PremiumButton>
            </div>
            <Bell className="absolute -bottom-6 -right-6 h-32 w-32 text-white/5 rotate-12" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notices;
