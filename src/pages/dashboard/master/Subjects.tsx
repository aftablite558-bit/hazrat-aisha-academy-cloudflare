import { useState, useMemo } from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { GlassTable } from '../../../components/common/GlassTable';
import { GlassButton } from '../../../components/common/GlassButton';
import { GlassInput } from '../../../components/common/GlassInput';
import { GlassBadge } from '../../../components/common/GlassBadge';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { Pagination } from '../../../components/common/Pagination';
import { BackButton } from '../../../components/common/BackButton';

import { useMasterData } from '../../../hooks/useMasterData';
import { Subject as SubjectType } from '../../../types/master';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import { SubjectFormModal } from '../../../components/dashboard/master/SubjectFormModal';

export const Subjects = () => {
  const { data: subjectList, loading, addRecord, updateRecord, deleteRecord } = useMasterData<SubjectType>('subjects');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<SubjectType | null>(null);

  const filteredSubjects = useMemo(() => {
    return subjectList.filter(s => 
      (s.subjectName || (s as { name?: string }).name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.code || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.classId || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [subjectList, searchTerm]);


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSubjects.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSubjects, currentPage]);

  const totalPages = Math.ceil(filteredSubjects.length / itemsPerPage);

  const handleAdd = () => {
    setSelectedSubject(null);
    setIsFormOpen(true);
  };

  const handleEdit = (sub: SubjectType) => {
    setSelectedSubject(sub);
    setIsFormOpen(true);
  };

  const handleDelete = (sub: SubjectType) => {
    setSelectedSubject(sub);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedSubject?.id) {
      await deleteRecord(selectedSubject.id); setIsDeleteOpen(false);
      setIsDeleteOpen(false);
    }
  };

  const handleSubmit = async (data: Omit<SubjectType, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedSubject?.id) {
      await updateRecord(selectedSubject.id, data);
    } else {
      await addRecord(data);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-start mb-[-1.5rem] relative z-20">
        <BackButton />
      </div>
      <PageHeader title="Subjects Management" description="Manage class subjects and teachers." />

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <GlassInput 
            placeholder="Search by subject, code, or class..." 
            className="pl-12"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <GlassButton variant="primary" className="flex items-center gap-2" onClick={handleAdd}>
          <Plus size={20} /> Add Subject
        </GlassButton>
      </div>

      <GlassTable>
        <thead>
          <tr>
            <th>Subject Code</th>
            <th>Subject Name</th>
            <th>Class ID</th>
            <th>Teacher ID</th>
            <th>Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={6} className="text-center py-8">Loading...</td></tr>
          ) : paginatedData.length === 0 ? (
            <tr><td colSpan={6} className="text-center py-8">No subjects found.</td></tr>
          ) : (
            paginatedData.map(sub => (
              <tr key={sub.id}>
                <td className="font-medium text-primary-500">{sub.code}</td>
                <td className="font-semibold">{sub.subjectName}</td>
                <td>{sub.classId}</td>
                <td>{sub.teacherId}</td>
                <td>
                  <GlassBadge variant={sub.status === 'Active' ? 'success' : 'default'}>
                    {sub.status}
                  </GlassBadge>
                </td>
                <td>
                  <div className="flex justify-end gap-2">
                    <button className="p-2 hover:bg-white/10 rounded-full text-emerald-500 transition-colors" onClick={() => handleEdit(sub)}><Edit size={18} /></button>
                    <button className="p-2 hover:bg-white/10 rounded-full text-rose-500 transition-colors" onClick={() => handleDelete(sub)}><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </GlassTable>

      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={setCurrentPage} 
      />

      {isFormOpen && (
        <SubjectFormModal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleSubmit}
          initialData={selectedSubject}
        />
      )}

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Subject"
        message={`Are you sure you want to delete ${selectedSubject?.subjectName}?`}
        confirmText="Delete"
      />
    </div>
  );
};
