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
import { Testimonial } from '../../../types/content';
import { Edit, Trash2, Plus, Search, CheckCircle, XCircle, User, Star } from 'lucide-react';
import { FileUpload } from '../../../components/dashboard/master/FileUpload';

export const Testimonials = () => {
  const { data: testimonials, loading, addRecord, updateRecord, deleteRecord } = useMasterData<Testimonial>('testimonials');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState<Partial<Testimonial>>({
    name: '', role: '', content: '', photoUrl: '', rating: 5, isPublished: false
  });

  const filteredData = useMemo(() => {
    return testimonials.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [testimonials, searchTerm]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleAdd = () => {
    setSelectedTestimonial(null);
    setFormData({ name: '', role: '', content: '', photoUrl: '', rating: 5, isPublished: false });
    setIsFormOpen(true);
  };

  const handleEdit = (t: Testimonial) => {
    setSelectedTestimonial(t);
    setFormData(t);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTestimonial?.id) {
      await updateRecord(selectedTestimonial.id, formData);
    } else {
      await addRecord(formData as any);
    }
    setIsFormOpen(false);
  };

  const togglePublish = async (t: Testimonial) => {
    await updateRecord(t.id, { isPublished: !t.isPublished });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Testimonials" description="Manage school testimonials and reviews." />
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <GlassInput placeholder="Search by name..." className="pl-12" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
        </div>
        <GlassButton variant="primary" className="flex items-center gap-2" onClick={handleAdd}>
          <Plus size={20} /> Add Testimonial
        </GlassButton>
      </div>

      <GlassTable>
        <thead>
          <tr>
            <th>Photo</th>
            <th>Name & Role</th>
            <th>Rating</th>
            <th>Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={5} className="text-center py-8">Loading...</td></tr>
          ) : paginatedData.length === 0 ? (
            <tr><td colSpan={5} className="text-center py-8">No testimonials found.</td></tr>
          ) : (
            paginatedData.map(t => (
              <tr key={t.id}>
                <td>
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center overflow-hidden">
                    {t.photoUrl ? <img src={t.photoUrl} alt={t.name} className="w-full h-full object-cover" /> : <User size={20} className="text-muted-foreground" />}
                  </div>
                </td>
                <td>
                  <div className="font-semibold text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </td>
                <td>
                  <div className="flex text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} fill={i < t.rating ? "currentColor" : "transparent"} />
                    ))}
                  </div>
                </td>
                <td>
                  <GlassBadge variant={t.isPublished ? 'success' : 'default'}>
                    {t.isPublished ? 'Published' : 'Draft'}
                  </GlassBadge>
                </td>
                <td>
                  <div className="flex justify-end gap-2">
                    <button className="p-2 hover:bg-white/10 rounded-full text-secondary-500" onClick={() => togglePublish(t)}>
                      {t.isPublished ? <XCircle size={18} /> : <CheckCircle size={18} />}
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-full text-emerald-500" onClick={() => handleEdit(t)}><Edit size={18} /></button>
                    <button className="p-2 hover:bg-white/10 rounded-full text-rose-500" onClick={() => { setSelectedTestimonial(t); setIsDeleteOpen(true); }}><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </GlassTable>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      <GlassModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedTestimonial ? "Edit Testimonial" : "Add Testimonial"} className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassInput required label="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            <GlassInput required label="Role" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} placeholder="e.g. Parent, Alumni" />
            <GlassInput required label="Rating (1-5)" type="number" min="1" max="5" value={formData.rating} onChange={e => setFormData({...formData, rating: parseInt(e.target.value) || 5})} />
          </div>
          
          <GlassTextarea required label="Testimonial Content" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} rows={4} />
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Upload Photo (Optional)</label>
            <FileUpload 
              value={formData.photoUrl || ''} 
              onChange={(url) => setFormData({...formData, photoUrl: url})} 
              folder="testimonials" 
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

      <ConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={() => selectedTestimonial?.id && deleteRecord(selectedTestimonial.id)} title="Delete Testimonial" message="Are you sure you want to delete this testimonial?" confirmText="Delete" />
    </div>
  );
};
