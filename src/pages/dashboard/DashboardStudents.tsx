import { useState } from 'react';
import { useCRUD } from '../../hooks/useCRUD';
import { Student, Class, Section } from '../../types/master';
import { GlassCard } from '../../components/common/GlassCard';
import { GlassButton } from '../../components/common/GlassButton';
import { GlassInput } from '../../components/common/GlassInput';
import { GlassSelect } from '../../components/common/GlassSelect';
import { GlassTable } from '../../components/common/GlassTable';
import { GlassModal } from '../../components/common/GlassModal';
import { GlassBadge } from '../../components/common/GlassBadge';
import { GlassImageUpload } from '../../components/common/GlassImageUpload';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { useToast } from '../../contexts/ToastContext';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { LoadingScreen } from '../../components/common/LoadingScreen';

export const DashboardStudents = () => {
  const { data: students, loading: studentsLoading, add, update, remove } = useCRUD<Student>('students');
  const { data: classes, loading: classesLoading } = useCRUD<Class>('classes');
  const { data: sections, loading: sectionsLoading } = useCRUD<Section>('sections');
  
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Student>>({
    admissionNo: '',
    rollNo: '',
    fullName: '',
    gender: '',
    dob: '',
    fatherName: '',
    motherName: '',
    classId: '',
    sectionId: '',
    phone: '',
    address: '',
    status: 'Active',
    admissionDate: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredData = students.filter(s => s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSave = async () => {
    try {
      if (!formData.fullName || !formData.admissionNo || !formData.classId || !formData.sectionId) {
        addToast('Full Name, Admission No, Class, and Section are required', 'error');
        return;
      }

      if (editingId) {
        await update(editingId, formData);
        addToast('Student updated successfully', 'success');
      } else {
        await add(formData as Omit<Student, 'id'>);
        addToast('Student added successfully', 'success');
      }
      setIsModalOpen(false);
    } catch (error) {
      addToast('An error occurred', 'error');
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await remove(deleteId);
        addToast('Student deleted successfully', 'success');
      } catch (error) {
        addToast('An error occurred', 'error');
      }
    }
  };

  const openEdit = (s: Student) => {
    setEditingId(s.id);
    setFormData({ ...s });
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setEditingId(null);
    setFormData({
      admissionNo: '',
      rollNo: '',
      fullName: '',
      gender: '',
      dob: '',
      fatherName: '',
      motherName: '',
      classId: '',
      sectionId: '',
      phone: '',
      address: '',
      status: 'Active',
      admissionDate: '',
      photoUrl: '',
    });
    setIsModalOpen(true);
  };

  if (studentsLoading || classesLoading || sectionsLoading) return <LoadingScreen />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Students</h1>
          <p className="text-muted-foreground">Manage school students</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <GlassInput
              placeholder="Search students..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <GlassButton variant="primary" onClick={openAdd} className="flex items-center gap-2">
            <Plus size={20} /> Add Student
          </GlassButton>
        </div>
      </div>

      {filteredData.length === 0 ? (
        <GlassCard className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-20 h-20 rounded-full bg-white/10 dark:bg-white/5 flex items-center justify-center mb-6">
            <Search size={40} className="text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">No Students Found</h3>
          <p className="text-muted-foreground mb-6">Start by adding a new student to the system.</p>
          <GlassButton variant="primary" onClick={openAdd}>Add First Student</GlassButton>
        </GlassCard>
      ) : (
        <GlassTable>
          <thead>
            <tr>
              <th>Adm No</th>
              <th>Roll No</th>
              <th>Name</th>
              <th>Class</th>
              <th>Section</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((s) => {
              const classObj = classes.find(c => c.id === s.classId);
              const sectionObj = sections.find(sec => sec.id === s.sectionId);
              return (
                <tr key={s.id}>
                  <td className="font-medium">{s.admissionNo}</td>
                  <td>{s.rollNo}</td>
                  <td>{s.fullName}</td>
                  <td>{classObj ? classObj.className : 'N/A'}</td>
                  <td>{sectionObj ? sectionObj.sectionName : 'N/A'}</td>
                  <td>
                    <GlassBadge variant={s.status === 'Active' ? 'success' : 'default'}>{s.status}</GlassBadge>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-2">
                      <GlassButton variant="ghost" onClick={() => openEdit(s)} className="!p-2">
                        <Edit size={18} />
                      </GlassButton>
                      <GlassButton variant="ghost" onClick={() => setDeleteId(s.id)} className="!p-2 text-danger-500 hover:text-danger-600 hover:bg-danger-500/10">
                        <Trash2 size={18} />
                      </GlassButton>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </GlassTable>
      )}

      <GlassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Student' : 'Add Student'}
      >
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <GlassImageUpload
                label="Student Photo"
                value={formData.photoUrl || ''}
                onChange={(url) => setFormData({ ...formData, photoUrl: url })}
                path="students"
              />
            </div>
            <GlassInput
              label="Admission No"
              placeholder="e.g. ADM-001"
              value={formData.admissionNo}
              onChange={(e) => setFormData({ ...formData, admissionNo: e.target.value })}
            />
            <GlassInput
              label="Roll No"
              placeholder="e.g. 1"
              value={formData.rollNo}
              onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
            />
            <GlassInput
              label="Full Name"
              placeholder="e.g. Ali Khan"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
            <GlassSelect
              label="Gender"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              options={[{ label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' }]}
            />
            <GlassInput
              label="Date of Birth"
              type="date"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
            />
            <GlassInput
              label="Father Name"
              placeholder="Father's Full Name"
              value={formData.fatherName}
              onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
            />
            <GlassInput
              label="Mother Name"
              placeholder="Mother's Full Name"
              value={formData.motherName}
              onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
            />
            <GlassInput
              label="Phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <GlassSelect
              label="Class"
              value={formData.classId}
              onChange={(e) => setFormData({ ...formData, classId: e.target.value, sectionId: '' })}
              options={classes.map(c => ({ label: c.className, value: c.id }))}
            />
            <GlassSelect
              label="Section"
              value={formData.sectionId}
              onChange={(e) => setFormData({ ...formData, sectionId: e.target.value })}
              options={sections.filter(s => s.classId === formData.classId).map(s => ({ label: s.sectionName, value: s.id }))}
            />
            <GlassInput
              label="Admission Date"
              type="date"
              value={formData.admissionDate}
              onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
            />
            <GlassSelect
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })}
              options={[{ label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }]}
            />
            <div className="md:col-span-2">
              <GlassInput
                label="Address"
                placeholder="Full Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-8">
            <GlassButton variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</GlassButton>
            <GlassButton variant="primary" onClick={handleSave}>Save</GlassButton>
          </div>
        </div>
      </GlassModal>

      <ConfirmationDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Student"
        message="Are you sure you want to delete this student? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
};
