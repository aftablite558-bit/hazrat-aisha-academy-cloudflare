import { useState } from 'react';
import { useCRUD } from '../../hooks/useCRUD';
import { Section, Class } from '../../types/master';
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

export const DashboardSections = () => {
  const { data: sections, loading: sectionsLoading, add, update, remove } = useCRUD<Section>('sections');
  const { data: classes, loading: classesLoading } = useCRUD<Class>('classes');
  
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Section>>({ sectionName: '', classId: '', status: 'Active' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredData = sections.filter(s => s.sectionName.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSave = async () => {
    try {
      if (!formData.sectionName || !formData.classId) {
        addToast('Section Name and Class are required', 'error');
        return;
      }

      if (editingId) {
        await update(editingId, formData);
        addToast('Section updated successfully', 'success');
      } else {
        await add(formData as Omit<Section, 'id'>);
        addToast('Section added successfully', 'success');
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
        addToast('Section deleted successfully', 'success');
      } catch (error) {
        addToast('An error occurred', 'error');
      }
    }
  };

  const openEdit = (s: Section) => {
    setEditingId(s.id);
    setFormData({ sectionName: s.sectionName, classId: s.classId, status: s.status });
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setEditingId(null);
    setFormData({ sectionName: '', classId: '', status: 'Active' });
    setIsModalOpen(true);
  };

  if (sectionsLoading || classesLoading) return <LoadingScreen />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sections</h1>
          <p className="text-muted-foreground">Manage class sections</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <GlassInput
              placeholder="Search sections..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <GlassButton variant="primary" onClick={openAdd} className="flex items-center gap-2">
            <Plus size={20} /> Add Section
          </GlassButton>
        </div>
      </div>

      {filteredData.length === 0 ? (
        <GlassCard className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-20 h-20 rounded-full bg-white/10 dark:bg-white/5 flex items-center justify-center mb-6">
            <Search size={40} className="text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">No Sections Found</h3>
          <p className="text-muted-foreground mb-6">Start by adding a new section to the system.</p>
          <GlassButton variant="primary" onClick={openAdd}>Add First Section</GlassButton>
        </GlassCard>
      ) : (
        <GlassTable>
          <thead>
            <tr>
              <th>Class</th>
              <th>Section Name</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((s) => {
              const classObj = classes.find(c => c.id === s.classId);
              return (
                <tr key={s.id}>
                  <td>{classObj ? classObj.className : 'Unknown Class'}</td>
                  <td className="font-medium">{s.sectionName}</td>
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
        title={editingId ? 'Edit Section' : 'Add Section'}
      >
        <div className="p-6 space-y-4">
          <GlassSelect
            label="Class"
            value={formData.classId}
            onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
            options={classes.map(c => ({ label: c.className, value: c.id }))}
          />
          <GlassInput
            label="Section Name"
            placeholder="e.g. A"
            value={formData.sectionName}
            onChange={(e) => setFormData({ ...formData, sectionName: e.target.value })}
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
        title="Delete Section"
        message="Are you sure you want to delete this section? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
};
