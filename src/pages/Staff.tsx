import { 
  Search, 
  Plus, 
  MoreVertical, 
  Mail, 
  Phone,
  Filter,
  ArrowUpRight
} from 'lucide-react';

const Staff = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Staff Directory</h1>
          <p className="text-neutral-500 mt-1">Manage academy faculty and administrative personnel.</p>
        </div>
        <button className="bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:bg-emerald-800 transition-all flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Add Staff Member</span>
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Staff', value: '48', color: 'bg-emerald-50 text-emerald-700' },
          { label: 'Teaching Faculty', value: '32', color: 'bg-blue-50 text-blue-700' },
          { label: 'Administrative', value: '12', color: 'bg-amber-50 text-amber-700' },
          { label: 'Support Staff', value: '4', color: 'bg-indigo-50 text-indigo-700' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
              <div className={`px-2 py-1 rounded-lg text-[10px] font-bold ${stat.color}`}>+2 this month</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search staff by name, department, or ID..."
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-2 px-4 py-2.5 border border-neutral-100 rounded-xl text-sm font-bold text-neutral-600 hover:bg-neutral-50 transition-colors">
            <Filter className="h-4 w-4" />
            <span>Departments</span>
          </button>
        </div>
      </div>

      {/* Staff List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[
          { name: 'Dr. Ahmad Khan', role: 'Principal', dept: 'Administration', id: 'STAFF001', email: 'principal@hazrataisha.edu', phone: '+91 98765 43210', img: 'AK' },
          { name: 'Fatima Zahra', role: 'Senior Teacher', dept: 'Islamic Studies', id: 'STAFF008', email: 'fatima.z@hazrataisha.edu', phone: '+91 98765 43211', img: 'FZ' },
          { name: 'Mohammad Rashid', role: 'Coordinator', dept: 'Academic', id: 'STAFF012', email: 'rashid.m@hazrataisha.edu', phone: '+91 98765 43212', img: 'MR' },
          { name: 'Zoya Siddiqui', role: 'Teacher', dept: 'Mathematics', id: 'STAFF024', email: 'zoya.s@hazrataisha.edu', phone: '+91 98765 43213', img: 'ZS' },
        ].map((member, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm hover:shadow-md transition-all group relative">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-2xl bg-neutral-100 flex items-center justify-center text-xl font-bold text-neutral-400 group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-colors">
                  {member.img}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-neutral-900 group-hover:text-emerald-700 transition-colors">{member.name}</h3>
                    <span className="px-2 py-0.5 bg-neutral-100 rounded text-[9px] font-bold text-neutral-500 uppercase tracking-tighter">{member.id}</span>
                  </div>
                  <p className="text-sm text-neutral-500 font-medium">{member.role} • {member.dept}</p>
                </div>
              </div>
              <button className="p-2 text-neutral-300 hover:text-neutral-900 transition-colors">
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-neutral-50 pt-6">
              <div className="flex items-center space-x-3 text-neutral-500 hover:text-emerald-700 transition-colors cursor-pointer">
                <div className="h-8 w-8 rounded-lg bg-neutral-50 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                  <Mail className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium truncate">{member.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-neutral-500 hover:text-emerald-700 transition-colors cursor-pointer">
                <div className="h-8 w-8 rounded-lg bg-neutral-50 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium">{member.phone}</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(j => (
                  <div key={j} className="h-6 w-6 rounded-full bg-neutral-100 border-2 border-white text-[8px] flex items-center justify-center font-bold text-neutral-400">
                    C{j}
                  </div>
                ))}
                <div className="h-6 w-6 rounded-full bg-neutral-50 border-2 border-white text-[8px] flex items-center justify-center font-bold text-neutral-300">
                  +2
                </div>
              </div>
              <button className="flex items-center space-x-1 text-emerald-700 text-xs font-bold hover:underline">
                <span>View Profile</span>
                <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Staff;
