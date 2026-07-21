import { useState, useMemo } from 'react';
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
import { Document } from '../../../types/content';
import { Edit, Trash2, Plus, Search, CheckCircle, XCircle, FileDown } from 'lucide-react';
import { FileUpload } from '../../../components/dashboard/master/FileUpload';

export const Documents = () => {
  const { data: docs, loading, addRecord, updateRecord, deleteRecord } = useMasterData<Document>('documents');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  const [formData, setFormData] = useState<Partial<Document>>({
    title: '', category: 'Syllabus', fileUrl: '', isPublished: false, downloadCount: 0
  });

  const filteredDocs = useMemo(() => {
    return docs.filter(d => (d.title || "").toLowerCase().includes(searchTerm.toLowerCase()));
  }, [docs, searchTerm]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredDocs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredDocs, currentPage]);
  const totalPages = Math.ceil(filteredDocs.length / itemsPerPage);

  const handleAdd = () => {
    setSelectedDoc(null);
    setFormData({ title: '', category: 'Syllabus', fileUrl: '', isPublished: false, downloadCount: 0 });
    setIsFormOpen(true);
  };

  const handleEdit = (d: Document) => {
    setSelectedDoc(d);
    setFormData(d);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDoc?.id) {
      await updateRecord(selectedDoc.id, formData);
    } else {
      await addRecord(formData);
    }
    setIsFormOpen(false);
  };

  const togglePublish = async (d: Document) => {
    await updateRecord(d.id, { isPublished: !d.isPublished });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-start mb-[-1.5rem] relative z-20">
        <BackButton />
      </div>
      <PageHeader title="Documents & Downloads" description="Manage public documents like syllabus and forms." />
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <GlassInput placeholder="Search by title..." className="pl-12" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
        </div>
        <GlassButton variant="primary" className="flex items-center gap-2" onClick={handleAdd}>
          <Plus size={20} /> Add Document
        </GlassButton>
      </div>

      <GlassTable>
        <thead>
          <tr>
            <th>Document Title</th>
            <th>Category</th>
            <th>Downloads</th>
            <th>Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={5} className="text-center py-8">Loading...</td></tr>
          ) : paginatedData.length === 0 ? (
            <tr><td colSpan={5} className="text-center py-8">No documents found.</td></tr>
          ) : (
            paginatedData.map(d => (
              <tr key={d.id}>
                <td className="font-semibold text-primary-500 flex items-center gap-2">
                  <FileDown size={16} /> {d.title}
                </td>
                <td>{d.category}</td>
                <td>{d.downloadCount || 0}</td>
                <td>
                  <GlassBadge variant={d.isPublished ? 'success' : 'default'}>
                    {d.isPublished ? 'Published' : 'Draft'}
                  </GlassBadge>
                </td>
                <td>
                  <div className="flex justify-end gap-2">
                    <button className="p-2 hover:bg-white/10 rounded-full text-secondary-500" onClick={() => togglePublish(d)}>
                      {d.isPublished ? <XCircle size={18} /> : <CheckCircle size={18} />}
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-full text-emerald-500" onClick={() => handleEdit(d)}><Edit size={18} /></button>
                    <button className="p-2 hover:bg-white/10 rounded-full text-rose-500" onClick={() => { setSelectedDoc(d); setIsDeleteOpen(true); }}><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </GlassTable>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      <GlassModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedDoc ? "Edit Document" : "Add Document"} className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassInput required label="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            <GlassSelect required label="Category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              <option value="Syllabus">Syllabus</option>
              <option value="Admission Form">Admission Form</option>
              <option value="Fee Structure">Fee Structure</option>
              <option value="Other">Other</option>
            </GlassSelect>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Upload File (PDF)</label>
            <FileUpload 
              value={formData.fileUrl || ''} 
              onChange={(url) => setFormData({...formData, fileUrl: url})} 
              folder="documents" 
              accept="application/pdf" 
            />
          </div>

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

      <ConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={async () => { if (selectedDoc?.id) { await deleteRecord(selectedDoc.id); setIsDeleteOpen(false); } }} title="Delete Document" message="Are you sure?" confirmText="Delete" />
    </div>
  );
};
