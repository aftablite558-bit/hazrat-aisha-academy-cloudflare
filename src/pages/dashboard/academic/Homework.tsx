import { useState, useMemo } from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { GlassCard } from '../../../components/common/GlassCard';
import { GlassTable } from '../../../components/common/GlassTable';
import { GlassButton } from '../../../components/common/GlassButton';
import { GlassBadge } from '../../../components/common/GlassBadge';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { Pagination } from '../../../components/common/Pagination';
import { BackButton } from '../../../components/common/BackButton';

import { useMasterData } from '../../../hooks/useMasterData';
import { Homework as HomeworkType } from '../../../types/academic';
import { Class, Subject, Student } from '../../../types/master';
import { Edit, Trash2, Plus, Eye, FileText, CheckCircle, XCircle } from 'lucide-react';
import { HomeworkFormModal } from '../../../components/dashboard/academic/HomeworkFormModal';
import { StudentLookup } from '../../../components/dashboard/academic/StudentLookup';

export const Homework = () => {
  const { data: homeworks, loading, addRecord, updateRecord, deleteRecord } = useMasterData<HomeworkType>('homework');
  const { data: classes } = useMasterData<Class>('classes');
  const { data: subjects } = useMasterData<Subject>('subjects');

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedHomework, setSelectedHomework] = useState<HomeworkType | null>(null);

  const filteredHomeworks = useMemo(() => {
    let filtered = homeworks;
    if (selectedStudent) {
      filtered = homeworks.filter(hw => hw.classId === selectedStudent.classId);
    }
    return filtered.sort((a,b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }, [homeworks, selectedStudent]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredHomeworks.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredHomeworks, currentPage]);

  const totalPages = Math.ceil(filteredHomeworks.length / itemsPerPage);

  const handleAdd = () => {
    setSelectedHomework(null);
    setIsFormOpen(true);
  };

  const handleEdit = (hw: HomeworkType) => {
    setSelectedHomework(hw);
    setIsFormOpen(true);
  };

  const handleDelete = (hw: HomeworkType) => {
    setSelectedHomework(hw);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedHomework?.id) {
      await deleteRecord(selectedHomework.id); setIsDeleteOpen(false);
    }
  };

  const handleSubmit = async (data: Omit<HomeworkType, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedHomework?.id) {
      await updateRecord(selectedHomework.id, data);
    } else {
      await addRecord(data);
    }
    setIsFormOpen(false);
  };

  const togglePublish = async (hw: HomeworkType) => {
    await updateRecord(hw.id, { isPublished: !hw.isPublished });
  };

  const getClassName = (id: string) => classes.find(c => c.id === id)?.className || 'Unknown';
  const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.subjectName || 'Unknown';

  return (
    <div className="space-y-6">
      <div className="flex justify-start mb-[-1.5rem] relative z-20">
        <BackButton />
      </div>
      <PageHeader title="Homework Management" description="Manage class assignments and publish homework." />
      
      <GlassCard className="p-6">
         <StudentLookup onStudentSelect={setSelectedStudent} />
      </GlassCard>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div/>
        <GlassButton variant="primary" className="flex items-center gap-2" onClick={handleAdd}>
          <Plus size={20} /> Add Homework
        </GlassButton>
      </div>

      <GlassTable>
        <thead>
          <tr>
            <th>Title</th>
            <th>Class</th>
            <th>Subject</th>
            <th>Due Date</th>
            <th>Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={6} className="text-center py-8">Loading...</td></tr>
          ) : paginatedData.length === 0 ? (
            <tr><td colSpan={6} className="text-center py-8">No homework found.</td></tr>
          ) : (
            paginatedData.map(hw => (
              <tr key={hw.id}>
                <td className="font-semibold text-primary-500">
                  <div className="flex items-center gap-2">
                    {hw.attachmentUrl && <FileText size={16} className="text-secondary-500" />}
                    {hw.title}
                  </div>
                </td>
                <td>{getClassName(hw.classId)}</td>
                <td>{getSubjectName(hw.subjectId)}</td>
                <td>{new Date(hw.dueDate).toLocaleDateString()}</td>
                <td>
                  <GlassBadge variant={hw.isPublished ? 'success' : 'default'}>
                    {hw.isPublished ? 'Published' : 'Draft'}
                  </GlassBadge>
                </td>
                <td>
                  <div className="flex justify-end gap-2">
                    <button 
                      className="p-2 hover:bg-white/10 rounded-full text-secondary-500 transition-colors" 
                      onClick={() => togglePublish(hw)}
                      title={hw.isPublished ? "Unpublish" : "Publish"}
                    >
                      {hw.isPublished ? <XCircle size={18} /> : <CheckCircle size={18} />}
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-full text-emerald-500 transition-colors" onClick={() => handleEdit(hw)}><Edit size={18} /></button>
                    <button className="p-2 hover:bg-white/10 rounded-full text-rose-500 transition-colors" onClick={() => handleDelete(hw)}><Trash2 size={18} /></button>
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
        <HomeworkFormModal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleSubmit}
          initialData={selectedHomework}
        />
      )}

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Homework"
        message={`Are you sure you want to delete "${selectedHomework?.title}"? This action cannot be undone.`}
        confirmText="Delete"
      />
    </div>
  );
};
