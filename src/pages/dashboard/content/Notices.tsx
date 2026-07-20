import { useState, useMemo } from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { GlassTable } from '../../../components/common/GlassTable';
import { GlassButton } from '../../../components/common/GlassButton';
import { GlassInput } from '../../../components/common/GlassInput';
import { GlassSelect } from '../../../components/common/GlassSelect';
import { GlassBadge } from '../../../components/common/GlassBadge';
import { GlassModal } from '../../../components/common/GlassModal';
import { GlassTextarea } from '../../../components/common/GlassTextarea';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { Pagination } from '../../../components/common/Pagination';
import { useMasterData } from '../../../hooks/useMasterData';
import { Notice } from '../../../types/content';
import { Edit, Trash2, Plus, Search, FileText, CheckCircle, XCircle } from 'lucide-react';
import { FileUpload } from '../../../components/dashboard/master/FileUpload';
import { useAuth } from '../../../contexts/AuthContext';

export const Notices = () => {
  const { data: notices, loading, addRecord, updateRecord, deleteRecord } = useMasterData<Notice>('notices');
  const { profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Notice>>({
    title: '', category: 'General', description: '', attachmentUrl: '', 
    publishDate: new Date().toISOString().split('T')[0], 
    expiryDate: '', isPublished: false, priority: 'Normal'
  });

  const filteredNotices = useMemo(() => {
    return notices.filter(n => n.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [notices, searchTerm]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredNotices.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredNotices, currentPage]);
  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);

  const handleAdd = () => {
    setSelectedNotice(null);
    setFormData({
      title: '', category: 'General', description: '', attachmentUrl: '', 
      publishDate: new Date().toISOString().split('T')[0], 
      expiryDate: '', isPublished: false, priority: 'Normal'
    });
    setIsFormOpen(true);
  };

  const handleEdit = (n: Notice) => {
    setSelectedNotice(n);
    setFormData(n);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedNotice?.id) {
      await updateRecord(selectedNotice.id, formData);
    } else {
      await addRecord({ ...formData, createdBy: profile?.uid || 'System' } as any);
    }
    setIsFormOpen(false);
  };

  const togglePublish = async (n: Notice) => {
    await updateRecord(n.id, { isPublished: !n.isPublished });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Notice Board" subtitle="Manage school announcements and notices." />
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <GlassInput placeholder="Search by title..." className="pl-12" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
        </div>
        <GlassButton variant="primary" className="flex items-center gap-2" onClick={handleAdd}>
          <Plus size={20} /> Add Notice
        </GlassButton>
      </div>

      <GlassTable>
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Priority</th>
            <th>Publish Date</th>
            <th>Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={6} className="text-center py-8">Loading...</td></tr>
          ) : paginatedData.length === 0 ? (
            <tr><td colSpan={6} className="text-center py-8">No notices found.</td></tr>
          ) : (
            paginatedData.map(n => (
              <tr key={n.id}>
                <td className="font-semibold text-primary-500 flex items-center gap-2">
                  {n.attachmentUrl && <FileText size={16} />}
                  {n.title}
                </td>
                <td>{n.category}</td>
                <td>
                  <GlassBadge variant={n.priority === 'High' ? 'danger' : n.priority === 'Normal' ? 'success' : 'default'}>
                    {n.priority}
                  </GlassBadge>
                </td>
                <td>{n.publishDate}</td>
                <td>
                  <GlassBadge variant={n.isPublished ? 'success' : 'default'}>
                    {n.isPublished ? 'Published' : 'Draft'}
                  </GlassBadge>
                </td>
                <td>
                  <div className="flex justify-end gap-2">
                    <button className="p-2 hover:bg-white/10 rounded-full text-secondary-500" onClick={() => togglePublish(n)}>
                      {n.isPublished ? <XCircle size={18} /> : <CheckCircle size={18} />}
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-full text-emerald-500" onClick={() => handleEdit(n)}><Edit size={18} /></button>
                    <button className="p-2 hover:bg-white/10 rounded-full text-rose-500" onClick={() => { setSelectedNotice(n); setIsDeleteOpen(true); }}><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </GlassTable>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      <GlassModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedNotice ? "Edit Notice" : "Add Notice"} className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassInput required label="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            <GlassSelect required label="Category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              <option value="General">General</option>
              <option value="Academic">Academic</option>
              <option value="Examination">Examination</option>
              <option value="Event">Event</option>
            </GlassSelect>
            <GlassInput required type="date" label="Publish Date" value={formData.publishDate} onChange={e => setFormData({...formData, publishDate: e.target.value})} />
            <GlassInput type="date" label="Expiry Date (Optional)" value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} />
            <GlassSelect required label="Priority" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value as any})}>
              <option value="Low">Low</option>
              <option value="Normal">Normal</option>
              <option value="High">High</option>
            </GlassSelect>
          </div>
          <GlassTextarea required label="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={4} />
          <FileUpload value={formData.attachmentUrl || ''} onChange={(url) => setFormData({...formData, attachmentUrl: url})} folder="notices" label="Attachment (PDF)" accept="application/pdf" />
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isPublished" checked={formData.isPublished} onChange={e => setFormData({...formData, isPublished: e.target.checked})} className="w-4 h-4 rounded" />
            <label htmlFor="isPublished">Publish immediately</label>
          </div>
          <div className="flex justify-end gap-3 mt-8">
            <GlassButton type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>Cancel</GlassButton>
            <GlassButton type="submit" variant="primary">Save</GlassButton>
          </div>
        </form>
      </GlassModal>

      <ConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={() => selectedNotice?.id && deleteRecord(selectedNotice.id)} title="Delete Notice" message="Are you sure?" confirmText="Delete" />
    </div>
  );
};
