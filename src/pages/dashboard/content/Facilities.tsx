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
import { useMasterData } from '../../../hooks/useMasterData';
import { Facility } from '../../../types/content';
import { Edit, Trash2, Plus, Search, CheckCircle, XCircle, Building } from 'lucide-react';
import { FileUpload } from '../../../components/dashboard/master/FileUpload';

export const Facilities = () => {
  const { data: facilities, loading, addRecord, updateRecord, deleteRecord } = useMasterData<Facility>('facilities');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);

  const [formData, setFormData] = useState<Partial<Facility>>({
    title: '', description: '', images: [], displayOrder: 0, isPublished: false
  });

  const filteredData = useMemo(() => {
    return facilities.filter(f => f.title.toLowerCase().includes(searchTerm.toLowerCase())).sort((a,b) => (a.displayOrder||0) - (b.displayOrder||0));
  }, [facilities, searchTerm]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleAdd = () => {
    setSelectedFacility(null);
    setFormData({ title: '', description: '', images: [], displayOrder: 0, isPublished: false });
    setIsFormOpen(true);
  };

  const handleEdit = (f: Facility) => {
    setSelectedFacility(f);
    setFormData(f);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFacility?.id) {
      await updateRecord(selectedFacility.id, formData);
    } else {
      await addRecord(formData as any);
    }
    setIsFormOpen(false);
  };

  const togglePublish = async (f: Facility) => {
    await updateRecord(f.id, { isPublished: !f.isPublished });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Facilities" subtitle="Manage school infrastructure and facilities shown on the website." />
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <GlassInput placeholder="Search by title..." className="pl-12" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
        </div>
        <GlassButton variant="primary" className="flex items-center gap-2" onClick={handleAdd}>
          <Plus size={20} /> Add Facility
        </GlassButton>
      </div>

      <GlassTable>
        <thead>
          <tr>
            <th>Order</th>
            <th>Facility Title</th>
            <th>Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={4} className="text-center py-8">Loading...</td></tr>
          ) : paginatedData.length === 0 ? (
            <tr><td colSpan={4} className="text-center py-8">No facilities found.</td></tr>
          ) : (
            paginatedData.map(f => (
              <tr key={f.id}>
                <td>{f.displayOrder}</td>
                <td className="font-semibold text-primary-500 flex items-center gap-2">
                  <Building size={16} /> {f.title}
                </td>
                <td>
                  <GlassBadge variant={f.isPublished ? 'success' : 'default'}>
                    {f.isPublished ? 'Published' : 'Draft'}
                  </GlassBadge>
                </td>
                <td>
                  <div className="flex justify-end gap-2">
                    <button className="p-2 hover:bg-white/10 rounded-full text-secondary-500" onClick={() => togglePublish(f)}>
                      {f.isPublished ? <XCircle size={18} /> : <CheckCircle size={18} />}
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-full text-emerald-500" onClick={() => handleEdit(f)}><Edit size={18} /></button>
                    <button className="p-2 hover:bg-white/10 rounded-full text-rose-500" onClick={() => { setSelectedFacility(f); setIsDeleteOpen(true); }}><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </GlassTable>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      <GlassModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedFacility ? "Edit Facility" : "Add Facility"} className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassInput required label="Facility Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            <GlassInput type="number" label="Display Order" value={formData.displayOrder} onChange={e => setFormData({...formData, displayOrder: Number(e.target.value)})} />
          </div>
          <GlassTextarea label="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} />
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Upload Image</label>
            <FileUpload 
              value={formData.images?.[0] || ''} 
              onChange={(url) => setFormData({...formData, images: url ? [url] : []})} 
              folder="facilities" 
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

      <ConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={() => selectedFacility?.id && deleteRecord(selectedFacility.id)} title="Delete Facility" message="Are you sure?" confirmText="Delete" />
    </div>
  );
};
