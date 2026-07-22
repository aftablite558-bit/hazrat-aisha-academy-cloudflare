import { useState, useEffect } from 'react';
import { GlassModal } from '../../common/GlassModal';
import { GlassInput } from '../../common/GlassInput';
import { GlassSelect } from '../../common/GlassSelect';
import { GlassButton } from '../../common/GlassButton';
import { Staff as StaffType } from '../../../types/master';

interface StaffFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<StaffType, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialData?: StaffType | null;
}

export const StaffFormModal = ({ isOpen, onClose, onSubmit, initialData }: StaffFormModalProps) => {
  const [formData, setFormData] = useState<Omit<StaffType, 'id' | 'createdAt' | 'updatedAt'>>({
    employeeId: '',
    name: '',
    department: '',
    role: '',
    phone: '',
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
    <GlassModal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Staff" : "Add Staff"} className="max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassInput required label="Employee ID" name="employeeId" value={formData.employeeId} onChange={handleChange} />
          <GlassInput required label="Full Name" name="name" value={formData.name} onChange={handleChange} />
          <GlassInput required label="Department" name="department" value={formData.department} onChange={handleChange} />
          <GlassInput required label="Role" name="role" value={formData.role} onChange={handleChange} />
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
            {loading ? 'Saving...' : 'Save Staff'}
          </GlassButton>
        </div>
      </form>
    </GlassModal>
  );
};
