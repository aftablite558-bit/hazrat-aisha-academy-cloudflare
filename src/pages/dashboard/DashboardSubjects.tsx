import { useState } from 'react';
import { useCRUD } from '../../hooks/useCRUD';
import { Subject, Class, Teacher } from '../../types/master';
import { GlassCard } from '../../components/common/GlassCard';
import { GlassButton } from '../../components/common/GlassButton';
import { GlassInput } from '../../components/common/GlassInput';
import { GlassSelect } from '../../components/common/GlassSelect';
import { GlassTable } from '../../components/common/GlassTable';
import { GlassModal } from '../../components/common/GlassModal';
import { GlassBadge } from '../../components/common/GlassBadge';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { useToast } from '../../contexts/ToastContext';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { LoadingScreen } from '../../components/common/LoadingScreen';

export const DashboardSubjects = () => {
  const { data: subjects, loading: subjectsLoading, add, update, remove } = useCRUD<Subject>('subjects');
  const { data: classes, loading: classesLoading } = useCRUD<Class>('classes');
  const { data: teachers, loading: teachersLoading } = useCRUD<Teacher>('teachers');
  
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Subject>>({ subjectName: '', code: '', classId: '', teacherId: '', status: 'Active' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredData = subjects.filter(s => s.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) || s.code.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSave = async () => {
    try {
      if (!formData.subjectName || !formData.classId) {
        addToast('Subject Name and Class are required', 'error');
        return;
      }

      if (editingId) {
        await update(editingId, formData);
        addToast('Subject updated successfully', 'success');
      } else {
        await add(formData as Omit<Subject, 'id'>);
        addToast('Subject added successfully', 'success');
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
        addToast('Subject deleted successfully', 'success');
      } catch (error) {
        addToast('An error occurred', 'error');
      }
    }
  };

  const openEdit = (s: Subject) => {
    setEditingId(s.id);
    setFormData({ subjectName: s.subjectName, code: s.code, classId: s.classId, teacherId: s.teacherId, status: s.status });
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setEditingId(null);
    setFormData({ subjectName: '', code: '', classId: '', teacherId: '', status: 'Active' });
    setIsModalOpen(true);
  };

  if (subjectsLoading || classesLoading || teachersLoading) return <LoadingScreen />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Subjects</h1>
          <p className="text-muted-foreground">Manage subjects</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <GlassInput
              placeholder="Search subjects..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <GlassButton variant="primary" onClick={openAdd} className="flex items-center gap-2">
            <Plus size={20} /> Add Subject
          </GlassButton>
        </div>
      </div>

      {filteredData.length === 0 ? (
        <GlassCard className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-20 h-20 rounded-full bg-white/10 dark:bg-white/5 flex items-center justify-center mb-6">
            <Search size={40} className="text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">No Subjects Found</h3>
          <p className="text-muted-foreground mb-6">Start by adding a new subject to the system.</p>
          <GlassButton variant="primary" onClick={openAdd}>Add First Subject</GlassButton>
        </GlassCard>
      ) : (
        <GlassTable>
          <thead>
            <tr>
              <th>Code</th>
              <th>Subject Name</th>
              <th>Class</th>
              <th>Teacher</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((s) => {
              const classObj = classes.find(c => c.id === s.classId);
              const teacherObj = teachers.find(t => t.id === s.teacherId);
              return (
                <tr key={s.id}>
                  <td className="font-medium">{s.code}</td>
                  <td>{s.subjectName}</td>
                  <td>{classObj ? classObj.className : 'N/A'}</td>
                  <td>{teacherObj ? teacherObj.name : 'Not Assigned'}</td>
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
        title={editingId ? 'Edit Subject' : 'Add Subject'}
      >
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassInput
              label="Subject Name"
              placeholder="e.g. Mathematics"
              value={formData.subjectName}
              onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
            />
            <GlassInput
              label="Subject Code"
              placeholder="e.g. MATH101"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            />
            <GlassSelect
              label="Class"
              value={formData.classId}
              onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
              options={classes.map(c => ({ label: c.className, value: c.id }))}
            />
            <GlassSelect
              label="Teacher"
              value={formData.teacherId}
              onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
              options={teachers.map(t => ({ label: t.name, value: t.id }))}
            />
            <div className="md:col-span-2">
              <GlassSelect
                label="Status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })}
                options={[{ label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }]}
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
        title="Delete Subject"
        message="Are you sure you want to delete this subject? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
};
