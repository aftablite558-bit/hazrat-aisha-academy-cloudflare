import { useState, useEffect } from 'react';
import { GlassModal } from '../../common/GlassModal';
import { GlassInput } from '../../common/GlassInput';
import { GlassSelect } from '../../common/GlassSelect';
import { GlassButton } from '../../common/GlassButton';
import { GlassTextarea } from '../../common/GlassTextarea';
import { Student } from '../../../types/master';
import { useMasterData } from '../../../hooks/useMasterData';
import { Class } from '../../../types/master';
import { ImageUpload } from './ImageUpload';

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialData?: Student | null;
}

export const StudentFormModal = ({ isOpen, onClose, onSubmit, initialData }: StudentFormModalProps) => {
  const [formData, setFormData] = useState<Omit<Student, 'id' | 'createdAt' | 'updatedAt'>>({
    admissionNo: '',
    rollNo: '',
    fullName: '',
    gender: 'Male',
    dob: '',
    fatherName: '',
    motherName: '',
    classId: '',
    phone: '',
    address: '',
    photoUrl: '',
    status: 'Active',
    admissionDate: new Date().toISOString().split('T')[0],
  });

  const [loading, setLoading] = useState(false);
  const { data: classes } = useMasterData<Class>('classes');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
    <GlassModal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Student" : "Add Student"} className="max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center mb-6">
          <ImageUpload 
            value={formData.photoUrl} 
            onChange={(url) => setFormData(prev => ({ ...prev, photoUrl: url }))} 
            folder="students" 
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassInput required label="Admission No" name="admissionNo" value={formData.admissionNo} onChange={handleChange} />
          <GlassInput required label="Roll No" name="rollNo" value={formData.rollNo} onChange={handleChange} />
          <GlassInput required label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} />
          <GlassSelect 
            required label="Gender" name="gender" value={formData.gender} onChange={handleChange}
            options={[{ label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' }, { label: 'Other', value: 'Other' }]}
          />
          <GlassInput required type="date" label="Date of Birth" name="dob" value={formData.dob} onChange={handleChange} />
          <GlassInput required label="Father's Name" name="fatherName" value={formData.fatherName} onChange={handleChange} />
          <GlassInput required label="Mother's Name" name="motherName" value={formData.motherName} onChange={handleChange} />
        <GlassSelect 
          required label="Class" name="classId" value={formData.classId} onChange={handleChange}
          options={classes.map(c => ({ label: c.className || (c as { name?: string }).name, value: c.id }))}
        />
          <GlassInput required type="tel" label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
          <GlassInput required type="date" label="Admission Date" name="admissionDate" value={formData.admissionDate} onChange={handleChange} />
          <GlassSelect 
            required label="Status" name="status" value={formData.status} onChange={handleChange}
            options={[{ label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }]}
          />
        </div>
        <GlassTextarea required label="Address" name="address" value={formData.address} onChange={handleChange} className="min-h-[80px]" />
        
        <div className="flex justify-end gap-4 mt-8">
          <GlassButton type="button" variant="ghost" onClick={onClose}>Cancel</GlassButton>
          <GlassButton type="submit" variant="primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Student'}
          </GlassButton>
        </div>
      </form>
    </GlassModal>
  );
};
