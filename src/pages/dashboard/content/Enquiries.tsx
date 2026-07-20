import { useState, useMemo } from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { GlassTable } from '../../../components/common/GlassTable';
import { GlassInput } from '../../../components/common/GlassInput';
import { GlassBadge } from '../../../components/common/GlassBadge';
import { GlassModal } from '../../../components/common/GlassModal';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { Pagination } from '../../../components/common/Pagination';
import { useMasterData } from '../../../hooks/useMasterData';
import { Enquiry } from '../../../types/content';
import { Trash2, Search, CheckCircle, Mail, Phone, User, Eye } from 'lucide-react';

export const Enquiries = () => {
  const { data: enquiries, loading, updateRecord, deleteRecord } = useMasterData<Enquiry>('enquiries');
  const [searchTerm, setSearchTerm] = useState('');
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  const filteredData = useMemo(() => {
    return enquiries.filter(e => 
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      e.subject.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a,b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }, [enquiries, searchTerm]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleView = (e: Enquiry) => {
    setSelectedEnquiry(e);
    setIsViewOpen(true);
  };

  const markResolved = async (e: Enquiry) => {
    await updateRecord(e.id, { status: 'Resolved' });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Contact Enquiries" subtitle="Manage website contact form submissions." />
      
      <div className="relative w-full max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
        <GlassInput placeholder="Search by name or subject..." className="pl-12" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
      </div>

      <GlassTable>
        <thead>
          <tr>
            <th>Date</th>
            <th>Name & Contact</th>
            <th>Subject</th>
            <th>Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={5} className="text-center py-8">Loading...</td></tr>
          ) : paginatedData.length === 0 ? (
            <tr><td colSpan={5} className="text-center py-8">No enquiries found.</td></tr>
          ) : (
            paginatedData.map(e => (
              <tr key={e.id}>
                <td>{new Date(e.createdAt || Date.now()).toLocaleDateString()}</td>
                <td>
                  <div className="font-semibold flex items-center gap-1"><User size={14} /> {e.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1"><Mail size={12} /> {e.email}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1"><Phone size={12} /> {e.phone}</div>
                </td>
                <td className="max-w-[200px] truncate">{e.subject}</td>
                <td>
                  <GlassBadge variant={e.status === 'Resolved' ? 'success' : 'amber'}>
                    {e.status}
                  </GlassBadge>
                </td>
                <td>
                  <div className="flex justify-end gap-2">
                    <button className="p-2 hover:bg-white/10 rounded-full text-primary-500" onClick={() => handleView(e)} title="View Message"><Eye size={18} /></button>
                    {e.status === 'Pending' && (
                      <button className="p-2 hover:bg-white/10 rounded-full text-emerald-500" onClick={() => markResolved(e)} title="Mark as Resolved"><CheckCircle size={18} /></button>
                    )}
                    <button className="p-2 hover:bg-white/10 rounded-full text-rose-500" onClick={() => { setSelectedEnquiry(e); setIsDeleteOpen(true); }}><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </GlassTable>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {selectedEnquiry && (
        <GlassModal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} title="Enquiry Details" className="max-w-xl">
          <div className="space-y-4 text-foreground">
            <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="font-semibold">{selectedEnquiry.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="font-semibold">{new Date(selectedEnquiry.createdAt || Date.now()).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-semibold">{selectedEnquiry.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="font-semibold">{selectedEnquiry.phone}</p>
              </div>
            </div>
            
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <p className="text-xs text-muted-foreground mb-1">Subject</p>
              <p className="font-bold text-lg mb-4">{selectedEnquiry.subject}</p>
              <p className="text-xs text-muted-foreground mb-1">Message</p>
              <p className="whitespace-pre-wrap">{selectedEnquiry.message}</p>
            </div>
          </div>
        </GlassModal>
      )}

      <ConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={() => selectedEnquiry?.id && deleteRecord(selectedEnquiry.id)} title="Delete Enquiry" message="Are you sure?" confirmText="Delete" />
    </div>
  );
};
