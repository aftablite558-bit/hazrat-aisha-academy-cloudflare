import React from 'react';
import { GlassCard, GlassButton, GlassBadge } from '../../components/common/GlassComponents';
import { GlassTable } from '../../components/common/ExtraGlassComponents';
import { 
  Users, 
  UserCheck, 
  Clock, 
  TrendingUp, 
  Calendar as CalendarIcon,
  Bell,
  ArrowUpRight
} from 'lucide-react';

const DashboardHome: React.FC = () => {
  return (
    <div className="space-y-8 pb-12">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Students', value: '1,248', icon: Users, color: 'emerald', trend: '+12%' },
          { label: 'Present Today', value: '1,192', icon: UserCheck, color: 'blue', trend: '95.5%' },
          { label: 'Late Entries', value: '14', icon: Clock, color: 'amber', trend: '-2%' },
          { label: 'Avg Performance', value: '84%', icon: TrendingUp, color: 'rose', trend: '+4.2%' }
        ].map((stat, i) => (
          <GlassCard key={i} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 bg-${stat.color}-500/20 rounded-2xl border border-${stat.color}-500/20`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
              </div>
              <GlassBadge color={stat.trend.startsWith('+') ? 'emerald' : stat.trend.endsWith('%') ? 'blue' : 'rose'} className="text-[10px]">
                {stat.trend}
              </GlassBadge>
            </div>
            <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
          </GlassCard>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <GlassCard className="lg:col-span-2 p-0 overflow-hidden">
          <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/5">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              <Clock className="w-5 h-5 text-emerald-400" />
              Recent Student Enrollments
            </h3>
            <GlassButton variant="ghost" size="sm">View All</GlassButton>
          </div>
          <div className="p-4">
            <GlassTable headers={['Student Name', 'ID', 'Class', 'Date', 'Status']}>
              {[
                { name: 'Zaid Ahmad', id: 'HA2026-001', class: 'Grade 10-A', date: 'Jul 20, 2026', status: 'Active' },
                { name: 'Sarah Fatima', id: 'HA2026-002', class: 'Grade 8-B', date: 'Jul 19, 2026', status: 'Active' },
                { name: 'Yusuf Khan', id: 'HA2026-003', class: 'Grade 6-C', date: 'Jul 19, 2026', status: 'Pending' },
                { name: 'Amina Ali', id: 'HA2026-004', class: 'Grade 12-S', date: 'Jul 18, 2026', status: 'Active' },
                { name: 'Omar Farooq', id: 'HA2026-005', class: 'Grade 5-A', date: 'Jul 18, 2026', status: 'Inactive' }
              ].map((row, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-bold text-white">{row.name}</td>
                  <td className="px-6 py-4 text-xs font-mono">{row.id}</td>
                  <td className="px-6 py-4">{row.class}</td>
                  <td className="px-6 py-4 text-slate-400">{row.date}</td>
                  <td className="px-6 py-4">
                    <GlassBadge 
                      color={row.status === 'Active' ? 'emerald' : row.status === 'Pending' ? 'amber' : 'rose'} 
                      className="text-[10px]"
                    >
                      {row.status}
                    </GlassBadge>
                  </td>
                </tr>
              ))}
            </GlassTable>
          </div>
        </GlassCard>

        {/* Upcoming Events */}
        <div className="space-y-6">
          <GlassCard className="p-8 space-y-6 border-blue-500/20 bg-blue-500/5">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              <CalendarIcon className="w-5 h-5 text-blue-400" />
              Upcoming Events
            </h3>
            <div className="space-y-4">
              {[
                { title: 'Annual Sports Meet', date: 'Aug 15, 2026', color: 'emerald' },
                { title: 'Quran Recitation Comp', date: 'Aug 22, 2026', color: 'amber' },
                { title: 'Parent Teacher Meeting', date: 'Aug 30, 2026', color: 'blue' }
              ].map((event, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all cursor-pointer">
                  <div className={`w-12 h-12 bg-${event.color}-500/20 rounded-xl flex flex-col items-center justify-center border border-${event.color}-500/20`}>
                    <span className="text-xs font-bold text-white">{event.date.split(' ')[1].replace(',', '')}</span>
                    <span className={`text-[10px] uppercase font-bold text-${event.color}-400`}>{event.date.split(' ')[0]}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">{event.title}</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Full Day Event</p>
                  </div>
                </div>
              ))}
            </div>
            <GlassButton variant="secondary" className="w-full">View Full Calendar</GlassButton>
          </GlassCard>

          <GlassCard className="p-8 space-y-4 border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden">
            <Bell className="absolute -right-4 -top-4 w-24 h-24 text-emerald-500/10 rotate-12" />
            <h3 className="text-xl font-bold text-white">Admin Quick Action</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              New admission applications are pending review. Please check the portal.
            </p>
            <GlassButton variant="primary" size="sm" className="w-full">
              Review Now
              <ArrowUpRight className="ml-2 w-4 h-4" />
            </GlassButton>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
