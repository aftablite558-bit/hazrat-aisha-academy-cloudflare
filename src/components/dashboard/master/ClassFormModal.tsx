import { useState, useEffect } from 'react';
import { GlassModal } from '../../common/GlassModal';
import { GlassInput } from '../../common/GlassInput';
import { GlassSelect } from '../../common/GlassSelect';
import { GlassButton } from '../../common/GlassButton';
import { Class as ClassType } from '../../../types/master';

interface ClassFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<ClassType, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialData?: ClassType | null;
}

export const ClassFormModal = ({ isOpen, onClose, onSubmit, initialData }: ClassFormModalProps) => {
  const [formData, setFormData] = useState<Omit<ClassType, 'id' | 'createdAt' | 'updatedAt'>>({
    className: 'Nursery',
    order: 1,
    status: 'Active',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.name === 'order' ? parseInt(e.target.value) || 0 : e.target.value;
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassModal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Class" : "Add Class"} className="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <GlassSelect 
          required label="Class Name" name="className" value={formData.className} onChange={handleChange}
          options={[
            { label: 'Baby', value: 'Baby' },
            { label: 'Nursery', value: 'Nursery' },
            { label: 'LKG', value: 'LKG' },
            { label: 'UKG', value: 'UKG' },
            { label: 'Class 1', value: 'Class 1' },
            { label: 'Class 2', value: 'Class 2' },
            { label: 'Class 3', value: 'Class 3' },
            { label: 'Class 4', value: 'Class 4' },
            { label: 'Class 5', value: 'Class 5' },
            { label: 'Class 6', value: 'Class 6' },
            { label: 'Class 7', value: 'Class 7' },
            { label: 'Class 8', value: 'Class 8' },
          ]}
        />
        <GlassInput required type="number" label="Display Order" name="order" value={formData.order.toString()} onChange={handleChange} />
        <GlassSelect 
          required label="Status" name="status" value={formData.status} onChange={handleChange}
          options={[{ label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }]}
        />
        
        <div className="flex justify-end gap-4 mt-8">
          <GlassButton type="button" variant="ghost" onClick={onClose}>Cancel</GlassButton>
          <GlassButton type="submit" variant="primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Class'}
          </GlassButton>
        </div>
      </form>
    </GlassModal>
  );
};
