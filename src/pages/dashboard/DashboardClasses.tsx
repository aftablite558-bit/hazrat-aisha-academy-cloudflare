import { useState } from 'react';
import { useCRUD } from '../../hooks/useCRUD';
import { Class } from '../../types/master';
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

export const DashboardClasses = () => {
  const { data: classes, loading, add, update, remove } = useCRUD<Class>('classes');
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Class>>({ className: '', order: 0, status: 'Active' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredData = classes.filter(c => c.className.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSave = async () => {
    try {
      if (!formData.className) {
        addToast('Class Name is required', 'error');
        return;
      }

      if (editingId) {
        await update(editingId, formData);
        addToast('Class updated successfully', 'success');
      } else {
        await add(formData as Omit<Class, 'id'>);
        addToast('Class added successfully', 'success');
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
        addToast('Class deleted successfully', 'success');
      } catch (error) {
        addToast('An error occurred', 'error');
      }
    }
  };

  const openEdit = (c: Class) => {
    setEditingId(c.id);
    setFormData({ className: c.className, order: c.order, status: c.status });
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setEditingId(null);
    setFormData({ className: '', order: 0, status: 'Active' });
    setIsModalOpen(true);
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Classes</h1>
          <p className="text-muted-foreground">Manage school classes</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <GlassInput
              placeholder="Search classes..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <GlassButton variant="primary" onClick={openAdd} className="flex items-center gap-2">
            <Plus size={20} /> Add Class
          </GlassButton>
        </div>
      </div>

      {filteredData.length === 0 ? (
        <GlassCard className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-20 h-20 rounded-full bg-white/10 dark:bg-white/5 flex items-center justify-center mb-6">
            <Search size={40} className="text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">No Classes Found</h3>
          <p className="text-muted-foreground mb-6">Start by adding a new class to the system.</p>
          <GlassButton variant="primary" onClick={openAdd}>Add First Class</GlassButton>
        </GlassCard>
      ) : (
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
            {filteredData.sort((a, b) => a.order - b.order).map((c) => (
              <tr key={c.id}>
                <td>{c.order}</td>
                <td className="font-medium">{c.className}</td>
                <td>
                  <GlassBadge variant={c.status === 'Active' ? 'success' : 'default'}>{c.status}</GlassBadge>
                </td>
                <td className="text-right">
                  <div className="flex justify-end gap-2">
                    <GlassButton variant="ghost" onClick={() => openEdit(c)} className="!p-2">
                      <Edit size={18} />
                    </GlassButton>
                    <GlassButton variant="ghost" onClick={() => setDeleteId(c.id)} className="!p-2 text-danger-500 hover:text-danger-600 hover:bg-danger-500/10">
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
        title={editingId ? 'Edit Class' : 'Add Class'}
      >
        <div className="p-6 space-y-4">
          <GlassInput
            label="Class Name"
            placeholder="e.g. Class 1"
            value={formData.className}
            onChange={(e) => setFormData({ ...formData, className: e.target.value })}
          />
          <GlassInput
            label="Order"
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
          />
          <GlassSelect
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })}
            options={[{ label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }]}
          />
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
        title="Delete Class"
        message="Are you sure you want to delete this class? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
};
