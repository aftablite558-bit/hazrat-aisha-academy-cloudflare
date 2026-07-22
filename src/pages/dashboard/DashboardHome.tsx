import { GlassCard } from '../../components/common/GlassCard';
import { StatCard } from '../../components/dashboard/StatCard';
import { ChartCard } from '../../components/dashboard/ChartCard';
import { Users, GraduationCap, DollarSign, Calendar, ClipboardList } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect } from 'react';
import { perfTracker } from '../../utils/performance';

const data = [
  { name: 'Jan', students: 400 },
  { name: 'Feb', students: 600 },
  { name: 'Mar', students: 800 },
  { name: 'Apr', students: 700 },
];

export const DashboardHome = () => {
  const { profile } = useAuth();
  const isTeacher = profile?.role === 'teacher';

  useEffect(() => {
    perfTracker.startDashboardInit();
    // Simulate dashboard load finish after render
    // In a real app, this should be called after data loading completes
    const timer = setTimeout(() => {
        perfTracker.endDashboardInit();
    }, 1000); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-extrabold tracking-tight text-foreground">Dashboard Overview</h2>
        <p className="text-muted-foreground mt-2 font-medium">
          Welcome back, {profile?.displayName || profile?.role || 'User'}. Here is what's happening today.
        </p>
      </div>
      
      {!isTeacher ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Students" value="1,240" icon={Users} color="bg-blue-500 text-blue-500" />
            <StatCard title="Total Teachers" value="56" icon={GraduationCap} color="bg-primary-500 text-primary-500" />
            <StatCard title="Total Revenue" value="$45,200" icon={DollarSign} color="bg-emerald-500 text-emerald-500" />
            <StatCard title="Upcoming Events" value="12" icon={Calendar} color="bg-purple-500 text-purple-500" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Student Enrollment">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip cursor={{ stroke: '#cbd5e1', strokeWidth: 2 }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }} />
                        <Line type="monotone" dataKey="students" stroke="#06b6d4" strokeWidth={4} dot={{ r: 6, fill: '#06b6d4', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>
            <GlassCard className="p-8">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold tracking-tight text-foreground">Recent Announcements</h3>
                    <span className="text-primary-500 text-sm font-semibold cursor-pointer hover:underline">View All</span>
                </div>
                <div className="space-y-4">
                    {[1,2,3].map(i => (
                        <GlassCard key={i} className="flex gap-5 p-5 group cursor-pointer !rounded-[24px]">
                            <div className="w-1.5 h-auto bg-gradient-to-b from-primary-500 to-secondary-500 rounded-full group-hover:scale-y-110 transition-transform" />
                            <div>
                                <p className="font-bold text-lg text-foreground mb-1 group-hover:text-primary-500 transition-colors">Important Notice {i}</p>
                                <p className="text-sm font-medium text-muted-foreground">Date: 2026-07-19 • Admin</p>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </GlassCard>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="My Classes" value="4" icon={Users} color="bg-blue-500 text-blue-500" />
          <StatCard title="Assignments Pending" value="12" icon={ClipboardList} color="bg-primary-500 text-primary-500" />
          <StatCard title="Upcoming Exams" value="2" icon={Calendar} color="bg-purple-500 text-purple-500" />
        </div>
      )}
    </div>
  );
};
