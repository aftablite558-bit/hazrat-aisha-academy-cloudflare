import { useState, useEffect } from 'react';
import { GlassModal } from '../../common/GlassModal';
import { GlassInput } from '../../common/GlassInput';
import { GlassSelect } from '../../common/GlassSelect';
import { GlassButton } from '../../common/GlassButton';
import { X } from 'lucide-react';
import { Homework } from '../../../types/academic';
import { useMasterData } from '../../../hooks/useMasterData';
import { Class, Subject, Teacher } from '../../../types/master';

interface HomeworkFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  initialData?: Homework | null;
}

export const HomeworkFormModal = ({ isOpen, onClose, onSubmit, initialData }: HomeworkFormModalProps) => {
  const { data: classes } = useMasterData<Class>('classes');
  const { data: subjects } = useMasterData<Subject>('subjects');
  const { data: teachers } = useMasterData<Teacher>('teachers');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    classId: '',
    subjectId: '',
    teacherId: '',
    dueDate: '',
    status: 'Active'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        classId: initialData.classId,
        subjectId: initialData.subjectId,
        teacherId: initialData.teacherId,
        dueDate: initialData.dueDate,
        status: initialData.status || 'Active'
      });
    } else {
      setFormData({
        title: '',
        description: '',
        classId: '',
        subjectId: '',
        teacherId: '',
        dueDate: '',
        status: 'Active'
      });
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <GlassModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={initialData ? 'Edit Homework' : 'Add New Homework'} 
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassSelect 
              label="Class" 
              name="classId" 
              value={formData.classId} 
              onChange={handleChange}
              options={classes.map(c => ({ label: c.className || (c as { name?: string }).name, value: c.id }))}
              required
            />
            <GlassSelect 
              label="Subject" 
              name="subjectId" 
              value={formData.subjectId} 
              onChange={handleChange}
              options={subjects.filter(s => s.classId === formData.classId).map(s => ({ label: s.subjectName || (s as { name?: string }).name, value: s.id }))}
              required
            />
            <GlassSelect 
              label="Teacher" 
              name="teacherId" 
              value={formData.teacherId} 
              onChange={handleChange}
              options={teachers.map(t => ({ label: t.name, value: t.id }))}
              required
            />
            <GlassInput 
              label="Due Date" 
              type="date"
              name="dueDate" 
              value={formData.dueDate} 
              onChange={handleChange}
              required
            />
          </div>

          <GlassInput 
            label="Title" 
            name="title" 
            value={formData.title} 
            onChange={handleChange}
            placeholder="Homework Title"
            required
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full min-h-[100px] p-3 rounded-lg glass bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              placeholder="Enter homework details..."
              required
            />
          </div>

          <GlassSelect 
            label="Status" 
            name="status" 
            value={formData.status} 
            onChange={handleChange}
            options={[
              { label: 'Active', value: 'Active' },
              { label: 'Completed', value: 'Completed' }
            ]}
          />

          <div className="flex justify-end gap-3 pt-4">
            <GlassButton type="button" variant="ghost" onClick={onClose}>
              Cancel
            </GlassButton>
            <GlassButton type="submit" variant="primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Homework'}
            </GlassButton>
          </div>
        </form>
    </GlassModal>
  );
};
