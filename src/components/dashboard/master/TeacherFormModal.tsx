import { useState, useEffect } from 'react';
import { GlassModal } from '../../common/GlassModal';
import { GlassInput } from '../../common/GlassInput';
import { GlassSelect } from '../../common/GlassSelect';
import { GlassButton } from '../../common/GlassButton';
import { Teacher } from '../../../types/master';
import { ImageUpload } from './ImageUpload';

interface TeacherFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Teacher, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialData?: Teacher | null;
}

export const TeacherFormModal = ({ isOpen, onClose, onSubmit, initialData }: TeacherFormModalProps) => {
  const [formData, setFormData] = useState<Omit<Teacher, 'id' | 'createdAt' | 'updatedAt'>>({
    teacherId: '',
    name: '',
    qualification: '',
    subjectIds: [],
    phone: '',
    email: '',
    photoUrl: '',
    status: 'Active',
    joiningDate: new Date().toISOString().split('T')[0],
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
    <GlassModal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Teacher" : "Add Teacher"} className="max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center mb-6">
          <ImageUpload 
            value={formData.photoUrl} 
            onChange={(url) => setFormData(prev => ({ ...prev, photoUrl: url }))} 
            folder="teachers" 
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassInput required label="Teacher ID" name="teacherId" value={formData.teacherId} onChange={handleChange} />
          <GlassInput required label="Full Name" name="name" value={formData.name} onChange={handleChange} />
          <GlassInput required label="Qualification" name="qualification" value={formData.qualification} onChange={handleChange} />
          <GlassInput required type="email" label="Email" name="email" value={formData.email} onChange={handleChange} />
          <GlassInput required type="tel" label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
          <GlassInput required type="date" label="Joining Date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} />
          <GlassSelect 
            required label="Status" name="status" value={formData.status} onChange={handleChange}
            options={[{ label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }]}
          />
        </div>
        
        <div className="flex justify-end gap-4 mt-8">
          <GlassButton type="button" variant="ghost" onClick={onClose}>Cancel</GlassButton>
          <GlassButton type="submit" variant="primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Teacher'}
          </GlassButton>
        </div>
      </form>
    </GlassModal>
  );
};
