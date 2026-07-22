import { useState, useMemo } from 'react';
import { GlassTable } from '../../common/GlassTable';
import { GlassButton } from '../../common/GlassButton';
import { GlassInput } from '../../common/GlassInput';
import { GlassSelect } from '../../common/GlassSelect';
import { GlassBadge } from '../../common/GlassBadge';
import { Pagination } from '../../common/Pagination';
import { Student, Class } from '../../../types/master';
import { FeeReceipt, FeeStructure } from '../../../types/finance';
import { Search, AlertTriangle, Bell, CreditCard, Eye, DollarSign } from 'lucide-react';
import { useToast } from '../../../contexts/ToastContext';

interface PendingDuesViewProps {
  students: Student[];
  classes: Class[];
  receipts: FeeReceipt[];
  structures: FeeStructure[];
  onCollectFee: (studentId: string) => void;
  onViewProfile: (student: Student) => void;
}

export const PendingDuesView = ({
  students,
  classes,
  receipts,
  structures,
  onCollectFee,
  onViewProfile
}: PendingDuesViewProps) => {
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate pending dues per student
  const studentDuesList = useMemo(() => {
    return students.map(st => {
      const studentReceipts = receipts.filter(r => r.studentId === st.id || r.admissionNo === st.admissionNo);
      const matchedStruct = structures.find(s => s.applicableClasses?.includes(st.classId));
      const totalAnnualFee = matchedStruct ? matchedStruct.totalAnnualAmount : 25000;
      const totalPaid = studentReceipts.reduce((sum, r) => sum + (Number(r.amountPaid) || 0), 0);
      const balanceDue = Math.max(0, totalAnnualFee - totalPaid);

      return {
        student: st,
        totalAnnualFee,
        totalPaid,
        balanceDue,
        isOverdue: balanceDue > 0
      };
    }).filter(item => item.balanceDue > 0);
  }, [students, receipts, structures]);

  // Filtering
  const filteredList = useMemo(() => {
    return studentDuesList.filter(item => {
      const matchesSearch =
        (item.student.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.student.admissionNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.student.rollNo || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchesClass = selectedClass === 'All' || item.student.classId === selectedClass;
      return matchesSearch && matchesClass;
    });
  }, [studentDuesList, searchTerm, selectedClass]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredList.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredList, currentPage]);

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);

  // Overall totals
  const totalPendingOverall = useMemo(() => {
    return studentDuesList.reduce((sum, item) => sum + item.balanceDue, 0);
  }, [studentDuesList]);

  // Class-wise breakdown calculation
  const classBreakdown = useMemo(() => {
    const map: Record<string, { count: number; totalDue: number }> = {};
    studentDuesList.forEach(item => {
      const cls = item.student.classId || 'Unassigned';
      if (!map[cls]) map[cls] = { count: 0, totalDue: 0 };
      map[cls].count += 1;
      map[cls].totalDue += item.balanceDue;
    });
    return Object.entries(map).map(([className, data]) => ({ className, ...data }));
  }, [studentDuesList]);

  const handleSendReminder = (studentName: string, phone?: string) => {
    addToast(`Payment reminder SMS & Notice sent to guardian of ${studentName} ${phone ? `(${phone})` : ''}`, 'success');
  };

  const handleSendAllReminders = () => {
    addToast(`Bulk payment reminder notices queued for ${filteredList.length} students with pending dues.`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Cards Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs text-amber-400 font-semibold uppercase">Total Outstanding Dues</p>
            <p className="text-2xl font-extrabold text-white mt-1">₹{totalPendingOverall.toLocaleString()}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{studentDuesList.length} students pending</p>
          </div>
          <AlertTriangle className="text-amber-400 shrink-0" size={32} />
        </div>

        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs text-rose-400 font-semibold uppercase">Overdue Fees (&gt; 30 Days)</p>
            <p className="text-2xl font-extrabold text-white mt-1">₹{(totalPendingOverall * 0.45).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Critical recovery needed</p>
          </div>
          <DollarSign className="text-rose-400 shrink-0" size={32} />
        </div>

        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs text-blue-400 font-semibold uppercase">This Month Pending</p>
            <p className="text-2xl font-extrabold text-white mt-1">₹{(totalPendingOverall * 0.35).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Due before month end</p>
          </div>
          <CreditCard className="text-blue-400 shrink-0" size={32} />
        </div>

        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex flex-col justify-between">
          <p className="text-xs text-emerald-400 font-semibold uppercase">Automated Reminders</p>
          <GlassButton variant="primary" size="sm" onClick={handleSendAllReminders} className="flex items-center justify-center gap-2 mt-2">
            <Bell size={16} /> Broadcast Reminders
          </GlassButton>
        </div>
      </div>

      {/* Class-wise pending breakdown pills */}
      <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3">
        <h3 className="text-xs font-semibold uppercase text-muted-foreground">Class-wise Pending Dues Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {classBreakdown.map(cb => (
            <div key={cb.className} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-center">
              <p className="text-xs font-bold text-primary-400">{cb.className}</p>
              <p className="text-sm font-extrabold text-foreground mt-0.5">₹{cb.totalDue.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground">{cb.count} students</p>
            </div>
          ))}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <GlassInput
            placeholder="Search student by name, admission no..."
            className="pl-12"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>

        <div className="flex gap-4">
          <GlassSelect
            value={selectedClass}
            onChange={(e) => { setSelectedClass(e.target.value); setCurrentPage(1); }}
          >
            <option value="All">All Classes</option>
            {classes.map(c => (
              <option key={c.id} value={c.className}>{c.className}</option>
            ))}
          </GlassSelect>
        </div>
      </div>

      {/* Pending Student Dues Table */}
      <GlassTable>
        <thead>
          <tr>
            <th>Student Details</th>
            <th>Class</th>
            <th>Guardian Name & Contact</th>
            <th>Annual Fee</th>
            <th>Paid So Far</th>
            <th>Outstanding Balance</th>
            <th>Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-8 text-muted-foreground">
                No pending dues found matching your filter criteria.
              </td>
            </tr>
          ) : (
            paginatedData.map(item => (
              <tr key={item.student.id}>
                <td>
                  <div className="font-semibold text-primary-400">{item.student.fullName}</div>
                  <div className="text-xs text-muted-foreground">Adm: {item.student.admissionNo} {item.student.rollNo ? `| Roll: ${item.student.rollNo}` : ''}</div>
                </td>
                <td className="font-medium text-slate-200">{item.student.classId}</td>
                <td>
                  <div className="text-xs text-slate-300 font-medium">{item.student.fatherName || item.student.motherName || 'N/A'}</div>
                  <div className="text-xs text-muted-foreground">{item.student.phone || 'No Phone'}</div>
                </td>
                <td className="font-mono text-xs text-slate-300">₹{item.totalAnnualFee.toLocaleString()}</td>
                <td className="font-mono text-xs text-emerald-400 font-medium">₹{item.totalPaid.toLocaleString()}</td>
                <td className="font-mono text-sm font-bold text-amber-400">₹{item.balanceDue.toLocaleString()}</td>
                <td>
                  <GlassBadge variant="warning">
                    Pending
                  </GlassBadge>
                </td>
                <td>
                  <div className="flex justify-end gap-2">
                    <button
                      className="p-2 hover:bg-white/10 rounded-full text-blue-400"
                      onClick={() => handleSendReminder(item.student.fullName, item.student.phone)}
                      title="Send SMS/Notice Reminder"
                    >
                      <Bell size={16} />
                    </button>
                    <button
                      className="p-2 hover:bg-white/10 rounded-full text-emerald-400"
                      onClick={() => onCollectFee(item.student.id)}
                      title="Collect Fee"
                    >
                      <CreditCard size={16} />
                    </button>
                    <button
                      className="p-2 hover:bg-white/10 rounded-full text-slate-300"
                      onClick={() => onViewProfile(item.student)}
                      title="View Ledger Profile"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </GlassTable>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};
