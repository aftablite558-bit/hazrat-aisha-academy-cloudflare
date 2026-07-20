import { useState, useMemo } from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { GlassTable } from '../../../components/common/GlassTable';
import { GlassButton } from '../../../components/common/GlassButton';
import { GlassInput } from '../../../components/common/GlassInput';
import { GlassBadge } from '../../../components/common/GlassBadge';
import { GlassModal } from '../../../components/common/GlassModal';
import { GlassSelect } from '../../../components/common/GlassSelect';
import { GlassTextarea } from '../../../components/common/GlassTextarea';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { Pagination } from '../../../components/common/Pagination';
import { useMasterData } from '../../../hooks/useMasterData';
import { Admission } from '../../../types/enterprise';
import { Search, Eye, CheckCircle, XCircle, Trash2, FileText, Download } from 'lucide-react';

export const Admissions = () => {
  const { data: admissions, loading, updateRecord, deleteRecord } = useMasterData<Admission>('admissions', true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState<Admission | null>(null);
  
  const [remarks, setRemarks] = useState('');

  const filteredData = useMemo(() => {
    return admissions.filter(a => {
      const matchesSearch = a.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || a.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
      return matchesSearch && matchesStatus;
    }).sort((a,b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }, [admissions, searchTerm, statusFilter]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleView = (a: Admission) => {
    setSelectedAdmission(a);
    setRemarks(a.remarks || '');
    setIsViewOpen(true);
  };

  const handleStatusChange = async (status: 'Approved' | 'Rejected') => {
    if (selectedAdmission?.id) {
      await updateRecord(selectedAdmission.id, { status, remarks });
      setIsViewOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Admissions Management" subtitle="Review and manage student admission applications." />
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <GlassInput placeholder="Search by name or number..." className="pl-12" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
        </div>
        <div className="w-full sm:w-48">
          <GlassSelect value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </GlassSelect>
        </div>
      </div>

      <GlassTable>
        <thead>
          <tr>
            <th>Application #</th>
            <th>Student Name</th>
            <th>Class Applied</th>
            <th>Parent Contact</th>
            <th>Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={6} className="text-center py-8">Loading...</td></tr>
          ) : paginatedData.length === 0 ? (
            <tr><td colSpan={6} className="text-center py-8">No admissions found.</td></tr>
          ) : (
            paginatedData.map(a => (
              <tr key={a.id}>
                <td className="font-mono text-sm">{a.admissionNumber}</td>
                <td className="font-semibold text-primary-500">{a.studentName}</td>
                <td>{a.classApplied}</td>
                <td>
                  <div className="text-sm">{a.parentName}</div>
                  <div className="text-xs text-muted-foreground">{a.parentPhone}</div>
                </td>
                <td>
                  <GlassBadge variant={a.status === 'Approved' ? 'success' : a.status === 'Rejected' ? 'danger' : 'amber'}>
                    {a.status}
                  </GlassBadge>
                </td>
                <td>
                  <div className="flex justify-end gap-2">
                    <button className="p-2 hover:bg-white/10 rounded-full text-secondary-500" onClick={() => handleView(a)}><Eye size={18} /></button>
                    <button className="p-2 hover:bg-white/10 rounded-full text-rose-500" onClick={() => { setSelectedAdmission(a); setIsDeleteOpen(true); }}><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </GlassTable>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {selectedAdmission && (
        <GlassModal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} title="Review Application" className="max-w-2xl">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl border border-white/10 text-sm">
              <div>
                <p className="text-muted-foreground text-xs mb-1">Application No.</p>
                <p className="font-mono">{selectedAdmission.admissionNumber}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">Class Applied For</p>
                <p className="font-semibold">{selectedAdmission.classApplied}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">Student Name</p>
                <p className="font-semibold">{selectedAdmission.studentName}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">Previous School</p>
                <p>{selectedAdmission.previousSchool || 'N/A'}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">Parent Name</p>
                <p>{selectedAdmission.parentName}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">Parent Contact</p>
                <p>{selectedAdmission.parentPhone} • {selectedAdmission.parentEmail}</p>
              </div>
            </div>

            {selectedAdmission.documentUrl && (
              <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-500/10 text-primary-500 rounded-lg"><FileText size={20} /></div>
                  <div>
                    <h4 className="font-semibold text-sm">Supporting Documents</h4>
                    <p className="text-xs text-muted-foreground">PDF or Image</p>
                  </div>
                </div>
                <a href={selectedAdmission.documentUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors">
                  <Download size={14} /> View
                </a>
              </div>
            )}

            <GlassTextarea label="Remarks (Internal)" value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={3} placeholder="Add notes for this application..." />

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="text-sm">
                Current Status: <strong className={selectedAdmission.status === 'Approved' ? 'text-emerald-500' : selectedAdmission.status === 'Rejected' ? 'text-rose-500' : 'text-amber-500'}>{selectedAdmission.status}</strong>
              </div>
              <div className="flex gap-3">
                {selectedAdmission.status !== 'Approved' && (
                  <GlassButton variant="primary" className="bg-emerald-500 hover:bg-emerald-600 border-none text-white flex items-center gap-2" onClick={() => handleStatusChange('Approved')}>
                    <CheckCircle size={16} /> Approve
                  </GlassButton>
                )}
                {selectedAdmission.status !== 'Rejected' && (
                  <GlassButton variant="primary" className="bg-rose-500 hover:bg-rose-600 border-none text-white flex items-center gap-2" onClick={() => handleStatusChange('Rejected')}>
                    <XCircle size={16} /> Reject
                  </GlassButton>
                )}
              </div>
            </div>
          </div>
        </GlassModal>
      )}

      <ConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={() => selectedAdmission?.id && deleteRecord(selectedAdmission.id)} title="Delete Application" message="Are you sure you want to delete this admission record? This action cannot be undone." confirmText="Delete" />
    </div>
  );
};
