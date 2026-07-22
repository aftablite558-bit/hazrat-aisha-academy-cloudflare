import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Calendar as CalendarIcon,
  Bell,
  ArrowUpRight
} from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color, trend }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div className={`${color} p-3 rounded-xl text-white`}>
        <Icon className="h-6 w-6" />
      </div>
      {trend && (
        <span className="flex items-center text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full">
          <ArrowUpRight className="h-3 w-3 mr-1" />
          {trend}
        </span>
      )}
    </div>
    <div className="mt-4">
      <h3 className="text-neutral-500 text-sm font-medium uppercase tracking-wider">{label}</h3>
      <p className="text-3xl font-bold text-neutral-900 mt-1">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Academic Overview</h1>
          <p className="text-neutral-500 mt-1">Welcome back to Hazrat Aisha Academy ERP.</p>
        </div>
        <button className="bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:bg-emerald-800 transition-all flex items-center space-x-2">
          <span>Generate Report</span>
        </button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Users} label="Total Students" value="1,248" color="bg-emerald-600" trend="+12%" />
        <StatCard icon={BookOpen} label="Classes" value="32" color="bg-blue-600" />
        <StatCard icon={TrendingUp} label="Avg Attendance" value="94.2%" color="bg-amber-500" trend="+2.4%" />
        <StatCard icon={CalendarIcon} label="Upcoming Exams" value="8" color="bg-indigo-600" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Notices */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-50 flex items-center justify-between bg-neutral-50/50">
              <h2 className="font-bold text-neutral-900 flex items-center">
                <Bell className="h-5 w-5 mr-2 text-emerald-600" />
                Latest Announcements
              </h2>
              <button className="text-emerald-700 text-sm font-semibold hover:underline">View All</button>
            </div>
            <div className="divide-y divide-neutral-50">
              {[
                { title: 'Admission Open for 2024-25', date: 'Oct 15, 2023', type: 'Academic' },
                { title: 'Parent-Teacher Meeting Schedule', date: 'Oct 20, 2023', type: 'Event' },
                { title: 'Winter Vacation Announcement', date: 'Oct 22, 2023', type: 'Holiday' },
              ].map((notice, i) => (
                <div key={i} className="p-6 hover:bg-neutral-50/50 transition-colors cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded">
                        {notice.type}
                      </span>
                      <h3 className="text-neutral-900 font-semibold mt-2 group-hover:text-emerald-700 transition-colors">
                        {notice.title}
                      </h3>
                    </div>
                    <span className="text-neutral-400 text-sm">{notice.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Academic Calendar</h3>
                <p className="text-emerald-100 text-sm mb-6 leading-relaxed">
                  Plan your schedule with integrated school events and holidays.
                </p>
                <button className="bg-white/10 hover:bg-white/20 px-6 py-2 rounded-xl text-sm font-semibold transition-colors border border-white/10">
                  Open Calendar
                </button>
              </div>
              <CalendarIcon className="absolute -bottom-6 -right-6 h-32 w-32 text-white/5 group-hover:rotate-12 transition-transform duration-500" />
            </div>
            <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm flex flex-col justify-center items-center text-center space-y-4">
              <div className="bg-neutral-50 p-4 rounded-full">
                <Users className="h-8 w-8 text-neutral-400" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900">Staff Management</h3>
              <p className="text-neutral-500 text-sm">Efficiently manage teacher profiles and assignments.</p>
              <button className="text-emerald-700 font-bold hover:underline">Access Directory &rarr;</button>
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
            <h3 className="font-bold text-neutral-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-3">
              {[
                'New Admission Request',
                'Upload Exam Results',
                'Post New Notice',
                'Send Message to Parents',
              ].map((action, i) => (
                <button
                  key={i}
                  className="w-full text-left px-4 py-3 rounded-xl border border-neutral-100 hover:border-emerald-200 hover:bg-emerald-50 transition-all text-neutral-700 text-sm font-medium flex items-center justify-between group"
                >
                  {action}
                  <ArrowUpRight className="h-4 w-4 text-neutral-300 group-hover:text-emerald-500" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
            <h4 className="text-emerald-900 font-bold mb-2">Need Support?</h4>
            <p className="text-emerald-800/70 text-xs leading-relaxed mb-4">
              If you encounter any issues with the ERP system, please contact our technical support team.
            </p>
            <button className="w-full bg-emerald-900 text-white py-2 rounded-xl text-sm font-bold shadow-md hover:bg-emerald-950 transition-colors">
              Contact Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
