import { useState, useMemo } from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { GlassTable } from '../../../components/common/GlassTable';
import { GlassButton } from '../../../components/common/GlassButton';
import { GlassInput } from '../../../components/common/GlassInput';
import { GlassBadge } from '../../../components/common/GlassBadge';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { Pagination } from '../../../components/common/Pagination';
import { useMasterData } from '../../../hooks/useMasterData';
import { Student } from '../../../types/master';
import { Edit, Trash2, Plus, Search, Eye } from 'lucide-react';
import { StudentFormModal } from '../../../components/dashboard/master/StudentFormModal';
import { StudentDetailsModal } from '../../../components/dashboard/master/StudentDetailsModal';

export const Students = () => {
  const { data: students, loading, addRecord, updateRecord, deleteRecord } = useMasterData<Student>('students', true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const filteredStudents = useMemo(() => {
    return students.filter(student => 
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredStudents, currentPage]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  const handleAdd = () => {
    setSelectedStudent(null);
    setIsFormOpen(true);
  };

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setIsFormOpen(true);
  };

  const handleView = (student: Student) => {
    setSelectedStudent(student);
    setIsDetailsOpen(true);
  };

  const handleDelete = (student: Student) => {
    setSelectedStudent(student);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedStudent?.id) {
      await deleteRecord(selectedStudent.id);
    }
  };

  const handleSubmit = async (data: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedStudent?.id) {
      await updateRecord(selectedStudent.id, data);
    } else {
      await addRecord(data);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Students Management" description="Manage student records, admissions, and details." />

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <GlassInput 
            placeholder="Search by name, admission no, roll no..." 
            className="pl-12"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <GlassButton variant="primary" className="flex items-center gap-2" onClick={handleAdd}>
          <Plus size={20} /> Add Student
        </GlassButton>
      </div>

      <GlassTable>
        <thead>
          <tr>
            <th>Admission No</th>
            <th>Roll No</th>
            <th>Full Name</th>
            <th>Class/Section</th>
            <th>Phone</th>
            <th>Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={7} className="text-center py-8">Loading...</td></tr>
          ) : paginatedData.length === 0 ? (
            <tr><td colSpan={7} className="text-center py-8">No students found.</td></tr>
          ) : (
            paginatedData.map(student => (
              <tr key={student.id}>
                <td className="font-medium text-primary-500">{student.admissionNo}</td>
                <td>{student.rollNo}</td>
                <td className="font-semibold">{student.fullName}</td>
                <td>{student.classId} - {student.sectionId}</td>
                <td>{student.phone}</td>
                <td>
                  <GlassBadge variant={student.status === 'Active' ? 'success' : 'default'}>
                    {student.status}
                  </GlassBadge>
                </td>
                <td>
                  <div className="flex justify-end gap-2">
                    <button className="p-2 hover:bg-white/10 rounded-full text-blue-500 transition-colors" onClick={() => handleView(student)}><Eye size={18} /></button>
                    <button className="p-2 hover:bg-white/10 rounded-full text-emerald-500 transition-colors" onClick={() => handleEdit(student)}><Edit size={18} /></button>
                    <button className="p-2 hover:bg-white/10 rounded-full text-rose-500 transition-colors" onClick={() => handleDelete(student)}><Trash2 size={18} /></button>
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
        <StudentFormModal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleSubmit}
          initialData={selectedStudent}
        />
      )}

      {isDetailsOpen && selectedStudent && (
        <StudentDetailsModal
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          student={selectedStudent}
        />
      )}

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Student"
        message={`Are you sure you want to delete ${selectedStudent?.fullName}? This action cannot be undone.`}
        confirmText="Delete"
      />
    </div>
  );
};
