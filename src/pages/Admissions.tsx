import { 
  Plus, 
  Search, 
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  MoreHorizontal
} from 'lucide-react';

const statusColors = {
  Approved: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  Pending: 'bg-amber-50 text-amber-700 border-amber-100',
  Rejected: 'bg-rose-50 text-rose-700 border-rose-100',
};

const Admissions = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Admission Requests</h1>
          <p className="text-neutral-500 mt-1">Manage and review new student applications.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:bg-emerald-800 transition-all flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>New Admission</span>
          </button>
        </div>
      </header>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search applicants by name or application ID..."
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
          />
        </div>
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-2 px-4 py-2.5 border border-neutral-100 rounded-xl text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
          <select className="bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-2.5 text-sm font-medium text-neutral-600 focus:outline-none">
            <option>All Status</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-neutral-50 text-neutral-500 text-xs font-bold uppercase tracking-widest border-b border-neutral-100">
              <tr>
                <th className="px-6 py-4">Applicant</th>
                <th className="px-6 py-4">Grade</th>
                <th className="px-6 py-4">Date Applied</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {[
                { id: 'ADM-1024', name: 'Zaid Khan', grade: 'Class 5', date: 'Oct 12, 2023', status: 'Pending' },
                { id: 'ADM-1025', name: 'Sara Ahmed', grade: 'Class 2', date: 'Oct 14, 2023', status: 'Approved' },
                { id: 'ADM-1026', name: 'Omar Farooq', grade: 'Class 8', date: 'Oct 15, 2023', status: 'Rejected' },
                { id: 'ADM-1027', name: 'Aisha Siddiqua', grade: 'Class 1', date: 'Oct 18, 2023', status: 'Pending' },
              ].map((item, i) => (
                <tr key={i} className="hover:bg-neutral-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-900 group-hover:text-emerald-700 transition-colors">
                          {item.name}
                        </div>
                        <div className="text-xs text-neutral-400 font-medium tracking-tight uppercase">ID: {item.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-neutral-600 font-medium text-sm">{item.grade}</td>
                  <td className="px-6 py-4 text-neutral-500 text-sm">{item.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${statusColors[item.status as keyof typeof statusColors]}`}>
                      {item.status === 'Approved' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                      {item.status === 'Pending' && <Clock className="h-3 w-3 mr-1" />}
                      {item.status === 'Rejected' && <XCircle className="h-3 w-3 mr-1" />}
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-400 transition-colors">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-neutral-50 bg-neutral-50/30 flex items-center justify-between">
          <p className="text-xs text-neutral-400 font-medium">Showing 4 of 24 applicants</p>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1.5 border border-neutral-100 rounded-lg text-xs font-bold text-neutral-500 hover:bg-white transition-colors disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1.5 border border-neutral-100 rounded-lg text-xs font-bold text-neutral-500 hover:bg-white transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admissions;
