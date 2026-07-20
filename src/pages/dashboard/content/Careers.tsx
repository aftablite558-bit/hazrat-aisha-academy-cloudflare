import { useState, useMemo } from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { GlassTable } from '../../../components/common/GlassTable';
import { GlassButton } from '../../../components/common/GlassButton';
import { GlassInput } from '../../../components/common/GlassInput';
import { GlassBadge } from '../../../components/common/GlassBadge';
import { GlassModal } from '../../../components/common/GlassModal';
import { GlassTextarea } from '../../../components/common/GlassTextarea';
import { GlassSelect } from '../../../components/common/GlassSelect';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { Pagination } from '../../../components/common/Pagination';
import { useMasterData } from '../../../hooks/useMasterData';
import { CareerVacancy } from '../../../types/content';
import { Edit, Trash2, Plus, Search, Briefcase } from 'lucide-react';

export const Careers = () => {
  const { data: careers, loading, addRecord, updateRecord, deleteRecord } = useMasterData<CareerVacancy>('careers');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState<CareerVacancy | null>(null);

  const [formData, setFormData] = useState<Partial<CareerVacancy>>({
    jobTitle: '', department: 'Teaching', qualification: '', experience: '', lastDate: '', description: '', status: 'Active'
  });

  const filteredData = useMemo(() => {
    return careers.filter(c => (c.jobTitle || "").toLowerCase().includes(searchTerm.toLowerCase()));
  }, [careers, searchTerm]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleAdd = () => {
    setSelectedCareer(null);
    setFormData({ jobTitle: '', department: 'Teaching', qualification: '', experience: '', lastDate: '', description: '', status: 'Active' });
    setIsFormOpen(true);
  };

  const handleEdit = (c: CareerVacancy) => {
    setSelectedCareer(c);
    setFormData(c);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCareer?.id) {
      await updateRecord(selectedCareer.id, formData);
    } else {
      await addRecord(formData as any);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Careers" description="Manage job vacancies." />
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <GlassInput placeholder="Search by job title..." className="pl-12" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
        </div>
        <GlassButton variant="primary" className="flex items-center gap-2" onClick={handleAdd}>
          <Plus size={20} /> Add Vacancy
        </GlassButton>
      </div>

      <GlassTable>
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Department</th>
            <th>Last Date</th>
            <th>Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={5} className="text-center py-8">Loading...</td></tr>
          ) : paginatedData.length === 0 ? (
            <tr><td colSpan={5} className="text-center py-8">No vacancies found.</td></tr>
          ) : (
            paginatedData.map(c => (
              <tr key={c.id}>
                <td className="font-semibold text-primary-500 flex items-center gap-2">
                  <Briefcase size={16} /> {c.jobTitle}
                </td>
                <td>{c.department}</td>
                <td>{c.lastDate}</td>
                <td>
                  <GlassBadge variant={c.status === 'Active' ? 'success' : 'default'}>
                    {c.status}
                  </GlassBadge>
                </td>
                <td>
                  <div className="flex justify-end gap-2">
                    <button className="p-2 hover:bg-white/10 rounded-full text-emerald-500" onClick={() => handleEdit(c)}><Edit size={18} /></button>
                    <button className="p-2 hover:bg-white/10 rounded-full text-rose-500" onClick={() => { setSelectedCareer(c); setIsDeleteOpen(true); }}><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </GlassTable>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      <GlassModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedCareer ? "Edit Vacancy" : "Add Vacancy"} className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassInput required label="Job Title" value={formData.jobTitle} onChange={e => setFormData({...formData, jobTitle: e.target.value})} />
            <GlassSelect required label="Department" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}>
              <option value="Teaching">Teaching</option>
              <option value="Non-Teaching">Non-Teaching</option>
              <option value="Administration">Administration</option>
            </GlassSelect>
            <GlassInput required label="Qualification" value={formData.qualification} onChange={e => setFormData({...formData, qualification: e.target.value})} />
            <GlassInput required label="Experience" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} />
            <GlassInput type="date" required label="Last Date" value={formData.lastDate} onChange={e => setFormData({...formData, lastDate: e.target.value})} />
            <GlassSelect required label="Status" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </GlassSelect>
          </div>
          <GlassTextarea label="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={4} />
          
          <div className="flex justify-end gap-3 mt-8">
            <GlassButton type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>Cancel</GlassButton>
            <GlassButton type="submit" variant="primary">Save</GlassButton>
          </div>
        </form>
      </GlassModal>

      <ConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={async () => { if (selectedCareer?.id) { await deleteRecord(selectedCareer.id); setIsDeleteOpen(false); } }} title="Delete Vacancy" message="Are you sure?" confirmText="Delete" />
    </div>
  );
};
