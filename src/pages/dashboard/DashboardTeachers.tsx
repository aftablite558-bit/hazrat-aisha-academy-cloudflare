import { useState } from 'react';
import { useCRUD } from '../../hooks/useCRUD';
import { Teacher } from '../../types/master';
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

export const DashboardTeachers = () => {
  const { data: teachers, loading, add, update, remove } = useCRUD<Teacher>('teachers');
  
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Teacher>>({
    teacherId: '',
    name: '',
    qualification: '',
    phone: '',
    email: '',
    joiningDate: '',
    status: 'Active',
    subjectIds: []
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredData = teachers.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.teacherId.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSave = async () => {
    try {
      if (!formData.name || !formData.teacherId) {
        addToast('Teacher ID and Name are required', 'error');
        return;
      }

      if (editingId) {
        await update(editingId, formData);
        addToast('Teacher updated successfully', 'success');
      } else {
        await add(formData as Omit<Teacher, 'id'>);
        addToast('Teacher added successfully', 'success');
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
        addToast('Teacher deleted successfully', 'success');
      } catch (error) {
        addToast('An error occurred', 'error');
      }
    }
  };

  const openEdit = (t: Teacher) => {
    setEditingId(t.id);
    setFormData({ ...t });
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setEditingId(null);
    setFormData({
      teacherId: '',
      name: '',
      qualification: '',
      phone: '',
      email: '',
      joiningDate: '',
      status: 'Active',
      subjectIds: [],
      photoUrl: ''
    });
    setIsModalOpen(true);
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Teachers</h1>
          <p className="text-muted-foreground">Manage school teachers</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <GlassInput
              placeholder="Search teachers..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <GlassButton variant="primary" onClick={openAdd} className="flex items-center gap-2">
            <Plus size={20} /> Add Teacher
          </GlassButton>
        </div>
      </div>

      {filteredData.length === 0 ? (
        <GlassCard className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-20 h-20 rounded-full bg-white/10 dark:bg-white/5 flex items-center justify-center mb-6">
            <Search size={40} className="text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">No Teachers Found</h3>
          <p className="text-muted-foreground mb-6">Start by adding a new teacher to the system.</p>
          <GlassButton variant="primary" onClick={openAdd}>Add First Teacher</GlassButton>
        </GlassCard>
      ) : (
        <GlassTable>
          <thead>
            <tr>
              <th>Teacher ID</th>
              <th>Name</th>
              <th>Qualification</th>
              <th>Phone</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((t) => (
              <tr key={t.id}>
                <td className="font-medium">{t.teacherId}</td>
                <td>{t.name}</td>
                <td>{t.qualification}</td>
                <td>{t.phone}</td>
                <td>
                  <GlassBadge variant={t.status === 'Active' ? 'success' : 'default'}>{t.status}</GlassBadge>
                </td>
                <td className="text-right">
                  <div className="flex justify-end gap-2">
                    <GlassButton variant="ghost" onClick={() => openEdit(t)} className="!p-2">
                      <Edit size={18} />
                    </GlassButton>
                    <GlassButton variant="ghost" onClick={() => setDeleteId(t.id)} className="!p-2 text-danger-500 hover:text-danger-600 hover:bg-danger-500/10">
                      <Trash2 size={18} />
                    </GlassButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </GlassTable>
      )}

      <GlassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Teacher' : 'Add Teacher'}
      >
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <GlassImageUpload
                label="Teacher Photo"
                value={formData.photoUrl || ''}
                onChange={(url) => setFormData({ ...formData, photoUrl: url })}
                path="teachers"
              />
            </div>
            <GlassInput
              label="Teacher ID"
              placeholder="e.g. TCH-001"
              value={formData.teacherId}
              onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
            />
            <GlassInput
              label="Full Name"
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <GlassInput
              label="Qualification"
              placeholder="e.g. M.Sc, B.Ed"
              value={formData.qualification}
              onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
            />
            <GlassInput
              label="Phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <GlassInput
              label="Email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <GlassInput
              label="Joining Date"
              type="date"
              value={formData.joiningDate}
              onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
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
        title="Delete Teacher"
        message="Are you sure you want to delete this teacher? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
};
