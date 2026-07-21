import { useState, useMemo } from 'react';
import { useToast } from '../../../contexts/ToastContext';
import { PageHeader } from '../../../components/common/PageHeader';
import { GlassTable } from '../../../components/common/GlassTable';
import { GlassButton } from '../../../components/common/GlassButton';
import { GlassInput } from '../../../components/common/GlassInput';
import { GlassBadge } from '../../../components/common/GlassBadge';
import { GlassModal } from '../../../components/common/GlassModal';
import { GlassSelect } from '../../../components/common/GlassSelect';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { Pagination } from '../../../components/common/Pagination';
import { BackButton } from '../../../components/common/BackButton';

import { useMasterData } from '../../../hooks/useMasterData';
import { StudentFee } from '../../../types/enterprise';
import { Search, Edit, Trash2, Plus, Download, CreditCard } from 'lucide-react';

export const Fees = () => {
  const { addToast } = useToast();
  const { data: fees, loading, addRecord, updateRecord, deleteRecord } = useMasterData<StudentFee>('fees');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<StudentFee | null>(null);

  const [formData, setFormData] = useState<Partial<StudentFee>>({
    studentId: '', studentName: '', classId: '', receiptNumber: '', dueDate: '', 
    amount: 0, discount: 0, fine: 0, totalPaid: 0, status: 'Pending'
  });

  const filteredData = useMemo(() => {
    return fees.filter(f => {
      const matchesSearch = (f.studentName || "").toLowerCase().includes(searchTerm.toLowerCase()) || (f.receiptNumber || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || f.status === statusFilter;
      return matchesSearch && matchesStatus;
    }).sort((a,b) => new Date(b.dueDate || 0).getTime() - new Date(a.dueDate || 0).getTime());
  }, [fees, searchTerm, statusFilter]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleAdd = () => {
    setSelectedFee(null);
    setFormData({
      studentId: '', studentName: '', classId: '', 
      receiptNumber: `REC-${Date.now().toString().slice(-6)}`, 
      dueDate: new Date().toISOString().split('T')[0], 
      amount: 0, discount: 0, fine: 0, totalPaid: 0, status: 'Pending'
    });
    setIsFormOpen(true);
  };

  const handleEdit = (f: StudentFee) => {
    setSelectedFee(f);
    setFormData(f);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto-calculate total and status
    const netAmount = Number(formData.amount) - Number(formData.discount) + Number(formData.fine);
    const updatedStatus = Number(formData.totalPaid) >= netAmount ? 'Paid' : (new Date(formData.dueDate as string) < new Date() ? 'Overdue' : 'Pending');

    const payload = {
      ...formData,
      status: updatedStatus as 'Paid' | 'Overdue' | 'Pending',
      paidDate: updatedStatus === 'Paid' && formData.status !== 'Paid' ? new Date().toISOString().split('T')[0] : formData.paidDate
    };

    if (selectedFee?.id) {
      await updateRecord(selectedFee.id, payload);
    } else {
      await addRecord(payload);
    }
    setIsFormOpen(false);
  };

  const handlePrint = (f: StudentFee) => {
    addToast(`Printing receipt ${f.receiptNumber}...`);
    // In a real app, generate PDF here
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-start mb-[-1.5rem] relative z-20">
        <BackButton />
      </div>
      <PageHeader title="Fees Management" description="Manage student fees, generate receipts, and track payments." />
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <GlassInput placeholder="Search by name or receipt no..." className="pl-12" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
        </div>
        <div className="flex gap-4">
          <GlassSelect value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
            <option value="All">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </GlassSelect>
          <GlassButton variant="primary" className="flex items-center gap-2 whitespace-nowrap" onClick={handleAdd}>
            <Plus size={20} /> Collect Fee
          </GlassButton>
        </div>
      </div>

      <GlassTable>
        <thead>
          <tr>
            <th>Receipt #</th>
            <th>Student Details</th>
            <th>Due Date</th>
            <th>Net Amount</th>
            <th>Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={6} className="text-center py-8">Loading...</td></tr>
          ) : paginatedData.length === 0 ? (
            <tr><td colSpan={6} className="text-center py-8">No fee records found.</td></tr>
          ) : (
            paginatedData.map(f => {
              const netAmount = f.amount - (f.discount || 0) + (f.fine || 0);
              return (
                <tr key={f.id}>
                  <td className="font-mono text-sm">{f.receiptNumber}</td>
                  <td>
                    <div className="font-semibold text-primary-500">{f.studentName}</div>
                    <div className="text-xs text-muted-foreground">Class: {f.classId}</div>
                  </td>
                  <td>{f.dueDate}</td>
                  <td className="font-semibold">₹{netAmount.toLocaleString()}</td>
                  <td>
                    <GlassBadge variant={f.status === 'Paid' ? 'success' : f.status === 'Overdue' ? 'danger' : 'warning'}>
                      {f.status}
                    </GlassBadge>
                  </td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <button className="p-2 hover:bg-white/10 rounded-full text-secondary-500" onClick={() => handlePrint(f)} title="Print Receipt"><Download size={18} /></button>
                      <button className="p-2 hover:bg-white/10 rounded-full text-emerald-500" onClick={() => handleEdit(f)}><Edit size={18} /></button>
                      <button className="p-2 hover:bg-white/10 rounded-full text-rose-500" onClick={() => { setSelectedFee(f); setIsDeleteOpen(true); }}><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </GlassTable>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      <GlassModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedFee ? "Edit Fee Record" : "Collect Fee"} className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassInput required label="Student Name" value={formData.studentName} onChange={e => setFormData({...formData, studentName: e.target.value})} />
            <GlassInput required label="Class" value={formData.classId} onChange={e => setFormData({...formData, classId: e.target.value})} />
            <GlassInput required label="Receipt Number" value={formData.receiptNumber} onChange={e => setFormData({...formData, receiptNumber: e.target.value})} />
            <GlassInput required type="date" label="Due Date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
            <GlassInput required type="number" label="Base Amount (₹)" value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} />
            <GlassInput type="number" label="Discount (₹)" value={formData.discount} onChange={e => setFormData({...formData, discount: Number(e.target.value)})} />
            <GlassInput type="number" label="Fine/Late Fee (₹)" value={formData.fine} onChange={e => setFormData({...formData, fine: Number(e.target.value)})} />
            <GlassInput required type="number" label="Amount Paid (₹)" value={formData.totalPaid} onChange={e => setFormData({...formData, totalPaid: Number(e.target.value)})} />
          </div>
          
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between mt-6">
            <div className="flex items-center gap-3 text-emerald-500">
              <CreditCard size={24} />
              <div className="font-semibold">Net Payable</div>
            </div>
            <div className="text-2xl font-bold text-foreground">
              ₹{(Number(formData.amount || 0) - Number(formData.discount || 0) + Number(formData.fine || 0)).toLocaleString()}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <GlassButton type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>Cancel</GlassButton>
            <GlassButton type="submit" variant="primary">Save Payment</GlassButton>
          </div>
        </form>
      </GlassModal>

      <ConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={async () => { if (selectedFee?.id) { await deleteRecord(selectedFee.id); setIsDeleteOpen(false); } }} title="Delete Fee Record" message="Are you sure? This will remove the transaction record permanently." confirmText="Delete" />
    </div>
  );
};
