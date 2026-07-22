import { useState, useMemo } from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { GlassTable } from '../../../components/common/GlassTable';
import { GlassButton } from '../../../components/common/GlassButton';
import { GlassInput } from '../../../components/common/GlassInput';
import { GlassBadge } from '../../../components/common/GlassBadge';
import { GlassModal } from '../../../components/common/GlassModal';
import { GlassTextarea } from '../../../components/common/GlassTextarea';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { Pagination } from '../../../components/common/Pagination';
import { BackButton } from '../../../components/common/BackButton';

import { useMasterData } from '../../../hooks/useMasterData';
import { Achievement } from '../../../types/content';
import { Edit, Trash2, Plus, Search, CheckCircle, XCircle, Award } from 'lucide-react';
import { FileUpload } from '../../../components/dashboard/master/FileUpload';

export const Achievements = () => {
  const { data: achievements, loading, addRecord, updateRecord, deleteRecord } = useMasterData<Achievement>('achievements');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [formData, setFormData] = useState<Partial<Achievement>>({
    title: '', category: '', description: '', date: '', imageUrl: '', isPublished: false
  });

  const filteredData = useMemo(() => {
    return achievements.filter(a => (a.title || "").toLowerCase().includes(searchTerm.toLowerCase()));
  }, [achievements, searchTerm]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleAdd = () => {
    setSelectedAchievement(null);
    setFormData({ title: '', category: '', description: '', date: '', imageUrl: '', isPublished: false });
    setIsFormOpen(true);
  };

  const handleEdit = (a: Achievement) => {
    setSelectedAchievement(a);
    setFormData(a);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAchievement?.id) {
      await updateRecord(selectedAchievement.id, formData);
    } else {
      await addRecord(formData);
    }
    setIsFormOpen(false);
  };

  const togglePublish = async (a: Achievement) => {
    await updateRecord(a.id, { isPublished: !a.isPublished });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-start mb-[-1.5rem] relative z-20">
        <BackButton />
      </div>
      <PageHeader title="Achievements" description="Manage school achievements and awards." />
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <GlassInput placeholder="Search achievements..." className="pl-12" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
        </div>
        <GlassButton variant="primary" className="flex items-center gap-2" onClick={handleAdd}>
          <Plus size={20} /> Add Achievement
        </GlassButton>
      </div>

      <GlassTable>
        <thead>
          <tr>
            <th>Image</th>
            <th>Title & Category</th>
            <th>Date</th>
            <th>Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={5} className="text-center py-8">Loading...</td></tr>
          ) : paginatedData.length === 0 ? (
            <tr><td colSpan={5} className="text-center py-8">No achievements found.</td></tr>
          ) : (
            paginatedData.map(a => (
              <tr key={a.id}>
                <td>
                  <div className="w-12 h-12 rounded bg-white/5 flex items-center justify-center overflow-hidden">
                    {a.imageUrl ? <img src={a.imageUrl} alt={a.title} className="w-full h-full object-cover" /> : <Award size={24} className="text-muted-foreground" />}
                  </div>
                </td>
                <td>
                  <div className="font-semibold text-foreground">{a.title}</div>
                  <div className="text-xs text-muted-foreground">{a.category}</div>
                </td>
                <td>{new Date(a.date).toLocaleDateString()}</td>
                <td>
                  <GlassBadge variant={a.isPublished ? 'success' : 'default'}>
                    {a.isPublished ? 'Published' : 'Draft'}
                  </GlassBadge>
                </td>
                <td>
                  <div className="flex justify-end gap-2">
                    <button className="p-2 hover:bg-white/10 rounded-full text-secondary-500" onClick={() => togglePublish(a)}>
                      {a.isPublished ? <XCircle size={18} /> : <CheckCircle size={18} />}
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-full text-emerald-500" onClick={() => handleEdit(a)}><Edit size={18} /></button>
                    <button className="p-2 hover:bg-white/10 rounded-full text-rose-500" onClick={() => { setSelectedAchievement(a); setIsDeleteOpen(true); }}><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </GlassTable>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      <GlassModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedAchievement ? "Edit Achievement" : "Add Achievement"} className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassInput required label="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            <GlassInput required label="Category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="e.g. Sports, Academics" />
            <GlassInput required label="Date" type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
          </div>
          
          <GlassTextarea required label="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} />
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Upload Image</label>
            <FileUpload 
              value={formData.imageUrl || ''} 
              onChange={(url) => setFormData({...formData, imageUrl: url})} 
              folder="achievements" 
              accept="image/*" 
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

      <ConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={async () => { if (selectedAchievement?.id) { await deleteRecord(selectedAchievement.id); setIsDeleteOpen(false); } }} title="Delete Achievement" message="Are you sure you want to delete this achievement?" confirmText="Delete" />
    </div>
  );
};
