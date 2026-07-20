import { useState, useMemo } from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { GlassTable } from '../../../components/common/GlassTable';
import { GlassButton } from '../../../components/common/GlassButton';
import { GlassInput } from '../../../components/common/GlassInput';
import { GlassBadge } from '../../../components/common/GlassBadge';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { Pagination } from '../../../components/common/Pagination';
import { useMasterData } from '../../../hooks/useMasterData';
import { Class as ClassType } from '../../../types/master';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import { ClassFormModal } from '../../../components/dashboard/master/ClassFormModal';

export const Classes = () => {
  const { data: classList, loading, addRecord, updateRecord, deleteRecord } = useMasterData<ClassType>('classes');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassType | null>(null);

  const filteredClasses = useMemo(() => {
    return classList.filter(c => 
      c.className.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => a.order - b.order);
  }, [classList, searchTerm]);


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredClasses.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredClasses, currentPage]);

  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);

  const handleAdd = () => {
    setSelectedClass(null);
    setIsFormOpen(true);
  };

  const handleEdit = (cls: ClassType) => {
    setSelectedClass(cls);
    setIsFormOpen(true);
  };

  const handleDelete = (cls: ClassType) => {
    setSelectedClass(cls);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedClass?.id) {
      await deleteRecord(selectedClass.id);
    }
  };

  const handleSubmit = async (data: Omit<ClassType, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedClass?.id) {
      await updateRecord(selectedClass.id, data);
    } else {
      await addRecord(data);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Classes Management" subtitle="Manage school classes and their order." />

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <GlassInput 
            placeholder="Search classes..." 
            className="pl-12"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <GlassButton variant="primary" className="flex items-center gap-2" onClick={handleAdd}>
          <Plus size={20} /> Add Class
        </GlassButton>
      </div>

      <GlassTable>
        <thead>
          <tr>
            <th>Order</th>
            <th>Class Name</th>
            <th>Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={4} className="text-center py-8">Loading...</td></tr>
          ) : paginatedData.length === 0 ? (
            <tr><td colSpan={4} className="text-center py-8">No classes found.</td></tr>
          ) : (
            paginatedData.map(cls => (
              <tr key={cls.id}>
                <td className="font-medium">{cls.order}</td>
                <td className="font-semibold">{cls.className}</td>
                <td>
                  <GlassBadge variant={cls.status === 'Active' ? 'success' : 'default'}>
                    {cls.status}
                  </GlassBadge>
                </td>
                <td>
                  <div className="flex justify-end gap-2">
                    <button className="p-2 hover:bg-white/10 rounded-full text-emerald-500 transition-colors" onClick={() => handleEdit(cls)}><Edit size={18} /></button>
                    <button className="p-2 hover:bg-white/10 rounded-full text-rose-500 transition-colors" onClick={() => handleDelete(cls)}><Trash2 size={18} /></button>
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
        <ClassFormModal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleSubmit}
          initialData={selectedClass}
        />
      )}

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Class"
        message={`Are you sure you want to delete ${selectedClass?.className}?`}
        confirmText="Delete"
      />
    </div>
  );
};
