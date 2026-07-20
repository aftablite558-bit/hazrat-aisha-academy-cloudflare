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
import { GalleryAlbum } from '../../../types/content';
import { Edit, Trash2, Plus, Search, Image as ImageIcon, CheckCircle, XCircle } from 'lucide-react';
import { FileUpload } from '../../../components/dashboard/master/FileUpload';

export const Gallery = () => {
  const { data: albums, loading, addRecord, updateRecord, deleteRecord } = useMasterData<GalleryAlbum>('gallery', true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);

  const [formData, setFormData] = useState<Partial<GalleryAlbum>>({
    title: '', description: '', images: [], eventDate: new Date().toISOString().split('T')[0], isPublished: false
  });

  const filteredAlbums = useMemo(() => {
    return albums.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [albums, searchTerm]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAlbums.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAlbums, currentPage]);
  const totalPages = Math.ceil(filteredAlbums.length / itemsPerPage);

  const handleAdd = () => {
    setSelectedAlbum(null);
    setFormData({ title: '', description: '', images: [], eventDate: new Date().toISOString().split('T')[0], isPublished: false });
    setIsFormOpen(true);
  };

  const handleEdit = (a: GalleryAlbum) => {
    setSelectedAlbum(a);
    setFormData(a);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAlbum?.id) {
      await updateRecord(selectedAlbum.id, formData);
    } else {
      await addRecord(formData as any);
    }
    setIsFormOpen(false);
  };

  const togglePublish = async (a: GalleryAlbum) => {
    await updateRecord(a.id, { isPublished: !a.isPublished });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Gallery Management" description="Manage school event albums." />
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <GlassInput placeholder="Search by title..." className="pl-12" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
        </div>
        <GlassButton variant="primary" className="flex items-center gap-2" onClick={handleAdd}>
          <Plus size={20} /> Add Album
        </GlassButton>
      </div>

      <GlassTable>
        <thead>
          <tr>
            <th>Album Title</th>
            <th>Event Date</th>
            <th>Images</th>
            <th>Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={5} className="text-center py-8">Loading...</td></tr>
          ) : paginatedData.length === 0 ? (
            <tr><td colSpan={5} className="text-center py-8">No albums found.</td></tr>
          ) : (
            paginatedData.map(a => (
              <tr key={a.id}>
                <td className="font-semibold text-primary-500 flex items-center gap-2">
                  <ImageIcon size={16} /> {a.title}
                </td>
                <td>{a.eventDate}</td>
                <td>{a.images?.length || 0} photos</td>
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
                    <button className="p-2 hover:bg-white/10 rounded-full text-rose-500" onClick={() => { setSelectedAlbum(a); setIsDeleteOpen(true); }}><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </GlassTable>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      <GlassModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedAlbum ? "Edit Album" : "Add Album"} className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassInput required label="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            <GlassInput required type="date" label="Event Date" value={formData.eventDate} onChange={e => setFormData({...formData, eventDate: e.target.value})} />
          </div>
          <GlassTextarea label="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} />
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Upload Cover Image</label>
            <FileUpload 
              value={formData.images?.[0] || ''} 
              onChange={(url) => setFormData({...formData, images: url ? [url] : []})} 
              folder="gallery" 
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

      <ConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={() => selectedAlbum?.id && deleteRecord(selectedAlbum.id)} title="Delete Album" message="Are you sure?" confirmText="Delete" />
    </div>
  );
};
