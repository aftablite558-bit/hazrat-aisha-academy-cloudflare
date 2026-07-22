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
import { AlumniProfile } from '../../../types/content';
import { Edit, Trash2, Plus, Search, CheckCircle, XCircle, GraduationCap } from 'lucide-react';
import { FileUpload } from '../../../components/dashboard/master/FileUpload';

export const Alumni = () => {
  const { data: alumni, loading, addRecord, updateRecord, deleteRecord } = useMasterData<AlumniProfile>('alumni');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniProfile | null>(null);

  const [formData, setFormData] = useState<Partial<AlumniProfile>>({
    name: '', batch: '', profession: '', company: '', photoUrl: '', achievement: '', isPublished: false
  });

  const filteredData = useMemo(() => {
    return alumni.filter(a => (a.name || "").toLowerCase().includes(searchTerm.toLowerCase()));
  }, [alumni, searchTerm]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleAdd = () => {
    setSelectedAlumni(null);
    setFormData({ name: '', batch: '', profession: '', company: '', photoUrl: '', achievement: '', isPublished: false });
    setIsFormOpen(true);
  };

  const handleEdit = (a: AlumniProfile) => {
    setSelectedAlumni(a);
    setFormData(a);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAlumni?.id) {
      await updateRecord(selectedAlumni.id, formData);
    } else {
      await addRecord(formData);
    }
    setIsFormOpen(false);
  };

  const togglePublish = async (a: AlumniProfile) => {
    await updateRecord(a.id, { isPublished: !a.isPublished });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-start mb-[-1.5rem] relative z-20">
        <BackButton />
      </div>
      <PageHeader title="Alumni Network" description="Manage alumni profiles." />
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <GlassInput placeholder="Search by name..." className="pl-12" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
        </div>
        <GlassButton variant="primary" className="flex items-center gap-2" onClick={handleAdd}>
          <Plus size={20} /> Add Alumni
        </GlassButton>
      </div>

      <GlassTable>
        <thead>
          <tr>
            <th>Photo</th>
            <th>Name & Batch</th>
            <th>Profession</th>
            <th>Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={5} className="text-center py-8">Loading...</td></tr>
          ) : paginatedData.length === 0 ? (
            <tr><td colSpan={5} className="text-center py-8">No alumni found.</td></tr>
          ) : (
            paginatedData.map(a => (
              <tr key={a.id}>
                <td>
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center overflow-hidden">
                    {a.photoUrl ? <img src={a.photoUrl} alt={a.name} className="w-full h-full object-cover" /> : <GraduationCap size={20} className="text-muted-foreground" />}
                  </div>
                </td>
                <td>
                  <div className="font-semibold text-foreground">{a.name}</div>
                  <div className="text-xs text-muted-foreground">Batch of {a.batch}</div>
                </td>
                <td>
                  <div className="text-sm">{a.profession}</div>
                  <div className="text-xs text-muted-foreground">{a.company}</div>
                </td>
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
                    <button className="p-2 hover:bg-white/10 rounded-full text-rose-500" onClick={() => { setSelectedAlumni(a); setIsDeleteOpen(true); }}><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </GlassTable>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      <GlassModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedAlumni ? "Edit Alumni" : "Add Alumni"} className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassInput required label="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            <GlassInput required label="Batch (Year)" value={formData.batch} onChange={e => setFormData({...formData, batch: e.target.value})} />
            <GlassInput required label="Profession" value={formData.profession} onChange={e => setFormData({...formData, profession: e.target.value})} />
            <GlassInput required label="Company" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
          </div>
          <GlassTextarea label="Achievement/Quote" value={formData.achievement} onChange={e => setFormData({...formData, achievement: e.target.value})} rows={3} />
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Upload Photo</label>
            <FileUpload 
              value={formData.photoUrl || ''} 
              onChange={(url) => setFormData({...formData, photoUrl: url})} 
              folder="alumni" 
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

      <ConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={async () => { if (selectedAlumni?.id) { await deleteRecord(selectedAlumni.id); setIsDeleteOpen(false); } }} title="Delete Alumni" message="Are you sure?" confirmText="Delete" />
    </div>
  );
};
