import { useState, useMemo } from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { GlassTable } from '../../../components/common/GlassTable';
import { GlassButton } from '../../../components/common/GlassButton';
import { GlassInput } from '../../../components/common/GlassInput';
import { GlassBadge } from '../../../components/common/GlassBadge';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { Pagination } from '../../../components/common/Pagination';
import { useMasterData } from '../../../hooks/useMasterData';
import { Teacher } from '../../../types/master';
import { Edit, Trash2, Plus, Search, Eye } from 'lucide-react';
import { TeacherFormModal } from '../../../components/dashboard/master/TeacherFormModal';
import { TeacherDetailsModal } from '../../../components/dashboard/master/TeacherDetailsModal';

export const Teachers = () => {
  const { data: teachers, loading, addRecord, updateRecord, deleteRecord } = useMasterData<Teacher>('teachers');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const filteredTeachers = useMemo(() => {
    return teachers.filter(t => 
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.teacherId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [teachers, searchTerm]);


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTeachers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTeachers, currentPage]);

  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);

  const handleAdd = () => {
    setSelectedTeacher(null);
    setIsFormOpen(true);
  };

  const handleEdit = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsFormOpen(true);
  };

  const handleView = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsDetailsOpen(true);
  };

  const handleDelete = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedTeacher?.id) {
      await deleteRecord(selectedTeacher.id);
    }
  };

  const handleSubmit = async (data: Omit<Teacher, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedTeacher?.id) {
      await updateRecord(selectedTeacher.id, data);
    } else {
      await addRecord(data);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Teachers Management" subtitle="Manage teaching staff records." />

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <GlassInput 
            placeholder="Search by name or ID..." 
            className="pl-12"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <GlassButton variant="primary" className="flex items-center gap-2" onClick={handleAdd}>
          <Plus size={20} /> Add Teacher
        </GlassButton>
      </div>

      <GlassTable>
        <thead>
          <tr>
            <th>Teacher ID</th>
            <th>Name</th>
            <th>Qualification</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={7} className="text-center py-8">Loading...</td></tr>
          ) : paginatedData.length === 0 ? (
            <tr><td colSpan={7} className="text-center py-8">No teachers found.</td></tr>
          ) : (
            paginatedData.map(teacher => (
              <tr key={teacher.id}>
                <td className="font-medium text-primary-500">{teacher.teacherId}</td>
                <td className="font-semibold">{teacher.name}</td>
                <td>{teacher.qualification}</td>
                <td>{teacher.phone}</td>
                <td>{teacher.email}</td>
                <td>
                  <GlassBadge variant={teacher.status === 'Active' ? 'success' : 'default'}>
                    {teacher.status}
                  </GlassBadge>
                </td>
                <td>
                  <div className="flex justify-end gap-2">
                    <button className="p-2 hover:bg-white/10 rounded-full text-blue-500 transition-colors" onClick={() => handleView(teacher)}><Eye size={18} /></button>
                    <button className="p-2 hover:bg-white/10 rounded-full text-emerald-500 transition-colors" onClick={() => handleEdit(teacher)}><Edit size={18} /></button>
                    <button className="p-2 hover:bg-white/10 rounded-full text-rose-500 transition-colors" onClick={() => handleDelete(teacher)}><Trash2 size={18} /></button>
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
        <TeacherFormModal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleSubmit}
          initialData={selectedTeacher}
        />
      )}

      {isDetailsOpen && selectedTeacher && (
        <TeacherDetailsModal
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          teacher={selectedTeacher}
        />
      )}

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Teacher"
        message={`Are you sure you want to delete ${selectedTeacher?.name}?`}
        confirmText="Delete"
      />
    </div>
  );
};
