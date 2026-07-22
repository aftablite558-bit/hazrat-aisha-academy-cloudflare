import React, { useState } from 'react';
import { GlassCard } from '../../common/GlassCard';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Activity } from 'lucide-react';

interface ChartsWidgetProps {
  growthData?: { month: string; students: number }[];
  admissionsData?: { month: string; applications: number; approved: number }[];
  attendanceTrendData?: { day: string; percent: number }[];
  examPerformanceData?: { subject: string; passPercent: number; avgMarks: number }[];
  feeCollectionData?: { month: string; amount: number }[];
  genderRatioData?: { name: string; value: number }[];
  classDistData?: { className: string; count: number }[];
}

export const ChartsWidget: React.FC<ChartsWidgetProps> = ({
  growthData = [
    { month: 'Apr', students: 820 },
    { month: 'May', students: 950 },
    { month: 'Jun', students: 1080 },
    { month: 'Jul', students: 1240 },
  ],
  admissionsData = [
    { month: 'Apr', applications: 45, approved: 38 },
    { month: 'May', applications: 62, approved: 52 },
    { month: 'Jun', applications: 88, approved: 75 },
    { month: 'Jul', applications: 110, approved: 92 },
  ],
  attendanceTrendData = [
    { day: 'Mon', percent: 94 },
    { day: 'Tue', percent: 96 },
    { day: 'Wed', percent: 92 },
    { day: 'Thu', percent: 95 },
    { day: 'Fri', percent: 91 },
    { day: 'Sat', percent: 93 },
  ],
  examPerformanceData = [
    { subject: 'Quran', passPercent: 98, avgMarks: 88 },
    { subject: 'Arabic', passPercent: 94, avgMarks: 82 },
    { subject: 'Maths', passPercent: 89, avgMarks: 76 },
    { subject: 'Science', passPercent: 91, avgMarks: 78 },
    { subject: 'English', passPercent: 95, avgMarks: 84 },
  ],
  feeCollectionData = [
    { month: 'Apr', amount: 145000 },
    { month: 'May', amount: 182000 },
    { month: 'Jun', amount: 210000 },
    { month: 'Jul', amount: 245000 },
  ],
  genderRatioData = [
    { name: 'Boys', value: 680 },
    { name: 'Girls', value: 560 },
  ],
  classDistData = [
    { className: 'Nursery', count: 85 },
    { className: 'LKG', count: 92 },
    { className: 'UKG', count: 105 },
    { className: 'Class 1', count: 120 },
    { className: 'Class 2', count: 115 },
    { className: 'Class 3', count: 125 },
    { className: 'Class 4', count: 110 },
    { className: 'Class 5', count: 130 },
  ],
}) => {
  const [activeChartTab, setActiveChartTab] = useState<'overview' | 'admissions' | 'performance' | 'demographics'>('overview');

  const COLORS = ['#06b6d4', '#ec4899', '#10b981', '#f59e0b', '#6366f1'];

  const tooltipStyle = {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#fff',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
  };

  return (
    <div className="space-y-6">
      {/* Chart Selector Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-3">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">Institutional Analytics & Performance</h2>
          <p className="text-xs text-muted-foreground">Interactive graphical insights into enrollment, attendance, and academics</p>
        </div>

        <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setActiveChartTab('overview')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
              activeChartTab === 'overview' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Growth & Fees
          </button>
          <button
            onClick={() => setActiveChartTab('admissions')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
              activeChartTab === 'admissions' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Admissions & Attendance
          </button>
          <button
            onClick={() => setActiveChartTab('performance')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
              activeChartTab === 'performance' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Academics
          </button>
          <button
            onClick={() => setActiveChartTab('demographics')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
              activeChartTab === 'demographics' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Demographics
          </button>
        </div>
      </div>

      {/* Grid of Active Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Student Growth or Admissions */}
        {(activeChartTab === 'overview' || activeChartTab === 'admissions') && (
          <GlassCard className="p-6 flex flex-col h-[340px]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                  <TrendingUp size={18} />
                </div>
                <h3 className="text-base font-bold text-foreground">Student Growth Trajectory</h3>
              </div>
              <span className="text-xs text-emerald-500 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                +18.5% Growth
              </span>
            </div>

            <div className="flex-1 w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="students" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#growthGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        )}

        {/* Chart 2: Fee Collection or Monthly Admissions */}
        {(activeChartTab === 'overview' || activeChartTab === 'admissions') && (
          <GlassCard className="p-6 flex flex-col h-[340px]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                  <BarChart3 size={18} />
                </div>
                <h3 className="text-base font-bold text-foreground">
                  {activeChartTab === 'overview' ? 'Monthly Fee Collection (₹)' : 'Monthly Admission Funnel'}
                </h3>
              </div>
              <span className="text-xs text-emerald-500 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                Live Data
              </span>
            </div>

            <div className="flex-1 w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                {activeChartTab === 'overview' ? (
                  <BarChart data={feeCollectionData}>
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={tooltipStyle} formatter={(val: number) => [`₹${val.toLocaleString('en-IN')}`, 'Amount']} />
                    <Bar dataKey="amount" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                ) : (
                  <BarChart data={admissionsData}>
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={{ paddingTop: 10 }} />
                    <Bar dataKey="applications" name="Applied" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="approved" name="Approved" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </GlassCard>
        )}

        {/* Chart 3: Attendance Trend */}
        {(activeChartTab === 'admissions' || activeChartTab === 'performance') && (
          <GlassCard className="p-6 flex flex-col h-[340px]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-cyan-500/10 text-cyan-500 rounded-lg">
                  <Activity size={18} />
                </div>
                <h3 className="text-base font-bold text-foreground">Weekly Attendance % Trend</h3>
              </div>
              <span className="text-xs text-cyan-500 font-bold bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                Avg 93.5%
              </span>
            </div>

            <div className="flex-1 w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceTrendData}>
                  <XAxis dataKey="day" stroke="#94a3b8" />
                  <YAxis domain={[80, 100]} stroke="#94a3b8" />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, 'Attendance']} />
                  <Line type="monotone" dataKey="percent" stroke="#06b6d4" strokeWidth={3} dot={{ r: 5, fill: '#06b6d4' }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        )}

        {/* Chart 4: Exam Performance */}
        {(activeChartTab === 'performance') && (
          <GlassCard className="p-6 flex flex-col h-[340px]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg">
                  <BarChart3 size={18} />
                </div>
                <h3 className="text-base font-bold text-foreground">Subject-Wise Pass % & Marks</h3>
              </div>
            </div>

            <div className="flex-1 w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={examPerformanceData}>
                  <XAxis dataKey="subject" stroke="#94a3b8" />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ paddingTop: 10 }} />
                  <Bar dataKey="passPercent" name="Pass Rate (%)" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="avgMarks" name="Avg Score (100)" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        )}

        {/* Chart 5: Gender Ratio Pie Chart */}
        {(activeChartTab === 'demographics') && (
          <GlassCard className="p-6 flex flex-col h-[340px]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-pink-500/10 text-pink-500 rounded-lg">
                  <PieChartIcon size={18} />
                </div>
                <h3 className="text-base font-bold text-foreground">Gender Breakdown</h3>
              </div>
            </div>

            <div className="flex-1 w-full h-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderRatioData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {genderRatioData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ paddingTop: 10 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        )}

        {/* Chart 6: Class Distribution Bar Chart */}
        {(activeChartTab === 'demographics') && (
          <GlassCard className="p-6 flex flex-col h-[340px]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-teal-500/10 text-teal-500 rounded-lg">
                  <BarChart3 size={18} />
                </div>
                <h3 className="text-base font-bold text-foreground">Class-Wise Student Distribution</h3>
              </div>
            </div>

            <div className="flex-1 w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={classDistData}>
                  <XAxis dataKey="className" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="count" name="Students" fill="#14b8a6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        )}

      </div>
    </div>
  );
};
