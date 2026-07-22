import { useState, useEffect } from 'react';
import { GlassModal } from '../../common/GlassModal';
import { GlassInput } from '../../common/GlassInput';
import { GlassSelect } from '../../common/GlassSelect';
import { GlassButton } from '../../common/GlassButton';
import { Subject as SubjectType } from '../../../types/master';

interface SubjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<SubjectType, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialData?: SubjectType | null;
}

export const SubjectFormModal = ({ isOpen, onClose, onSubmit, initialData }: SubjectFormModalProps) => {
  const [formData, setFormData] = useState<Omit<SubjectType, 'id' | 'createdAt' | 'updatedAt'>>({
    subjectName: '',
    code: '',
    classId: '',
    teacherId: '',
    status: 'Active',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
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
    <GlassModal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Subject" : "Add Subject"} className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassInput required label="Subject Code" name="code" value={formData.code} onChange={handleChange} />
          <GlassInput required label="Subject Name" name="subjectName" value={formData.subjectName} onChange={handleChange} />
          <GlassInput required label="Class ID" name="classId" value={formData.classId} onChange={handleChange} />
          <GlassInput required label="Teacher ID" name="teacherId" value={formData.teacherId} onChange={handleChange} />
          <GlassSelect 
            required label="Status" name="status" value={formData.status} onChange={handleChange}
            options={[{ label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }]}
          />
        </div>
        
        <div className="flex justify-end gap-4 mt-8">
          <GlassButton type="button" variant="ghost" onClick={onClose}>Cancel</GlassButton>
          <GlassButton type="submit" variant="primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Subject'}
          </GlassButton>
        </div>
      </form>
    </GlassModal>
  );
};
