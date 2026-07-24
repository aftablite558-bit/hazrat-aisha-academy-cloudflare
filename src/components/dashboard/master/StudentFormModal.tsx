import { useState, useEffect } from 'react';
import { GlassModal } from '../../common/GlassModal';
import { GlassInput } from '../../common/GlassInput';
import { GlassSelect } from '../../common/GlassSelect';
import { GlassButton } from '../../common/GlassButton';
import { GlassTextarea } from '../../common/GlassTextarea';
import { Student, Class, Section, House, Category } from '../../../types/master';
import { useMasterData } from '../../../hooks/useMasterData';
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
    sectionId: '',
    houseId: '',
    categoryId: '',
    phone: '',
    address: '',
    photoUrl: '',
    status: 'Active',
    admissionDate: new Date().toISOString().split('T')[0],
  });

  const [loading, setLoading] = useState(false);
  
  const { data: classes } = useMasterData<Class>('classes');
  const { data: sections } = useMasterData<Section>('sections');
  const { data: houses } = useMasterData<House>('houses');
  const { data: categories } = useMasterData<Category>('categories');

  useEffect(() => {
    if (initialData) {
      setFormData({
        admissionNo: initialData.admissionNo,
        rollNo: initialData.rollNo,
        fullName: initialData.fullName,
        gender: initialData.gender,
        dob: initialData.dob,
        fatherName: initialData.fatherName,
        motherName: initialData.motherName,
        classId: initialData.classId,
        sectionId: initialData.sectionId || '',
        houseId: initialData.houseId || '',
        categoryId: initialData.categoryId || '',
        phone: initialData.phone,
        address: initialData.address,
        photoUrl: initialData.photoUrl,
        status: initialData.status,
        admissionDate: initialData.admissionDate,
      });
    }
  }, [initialData]);

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
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const filteredSections = sections.filter(s => s.classId === formData.classId);

  return (
    <GlassModal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Student" : "Add Student"} className="max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center mb-6">
          <ImageUpload 
            value={formData.photoUrl || ""}
            onChange={(url) => setFormData(prev => ({ ...prev, photoUrl: url }))}
            folder="students"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <GlassInput required label="Admission No" name="admissionNo" value={formData.admissionNo} onChange={handleChange} />
          <GlassInput required label="Roll No" name="rollNo" value={formData.rollNo} onChange={handleChange} />
          <GlassInput required label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} />
          <GlassSelect 
            required label="Gender" name="gender" value={formData.gender} onChange={handleChange}
            options={[{ label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' }, { label: 'Other', value: 'Other' }]}
          />
          <GlassInput required type="date" label="Date of Birth" name="dob" value={formData.dob} onChange={handleChange} />
          
          <GlassSelect 
            required label="Class" name="classId" value={formData.classId} onChange={handleChange}
            options={classes.map(c => ({ label: c.className || (c as any).name, value: c.id }))}
          />
          
          <GlassSelect 
            label="Section" name="sectionId" value={formData.sectionId || ''} onChange={handleChange}
            options={[{ label: 'Select Section', value: '' }, ...filteredSections.map(s => ({ label: s.sectionName, value: s.id }))]}
          />

          <GlassSelect 
            label="House" name="houseId" value={formData.houseId || ''} onChange={handleChange}
            options={[{ label: 'Select House', value: '' }, ...houses.map(h => ({ label: h.houseName, value: h.id }))]}
          />
          
          <GlassSelect 
            label="Category" name="categoryId" value={formData.categoryId || ''} onChange={handleChange}
            options={[{ label: 'Select Category', value: '' }, ...categories.map(c => ({ label: c.categoryName, value: c.id }))]}
          />
          
          <GlassInput required label="Father's Name" name="fatherName" value={formData.fatherName} onChange={handleChange} />
          <GlassInput required label="Mother's Name" name="motherName" value={formData.motherName} onChange={handleChange} />
          
          <GlassInput required type="tel" label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
          <GlassInput required type="date" label="Admission Date" name="admissionDate" value={formData.admissionDate} onChange={handleChange} />
          <GlassSelect 
            required label="Status" name="status" value={formData.status} onChange={handleChange}
            options={[{ label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }]}
          />
        </div>
        
        <GlassTextarea required label="Address" name="address" value={formData.address} onChange={handleChange} className="min-h-[80px]" />

        <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
          <GlassButton type="button" variant="ghost" onClick={onClose}>Cancel</GlassButton>
          <GlassButton type="submit" variant="primary" disabled={loading}>
            {initialData ? 'Update Student' : 'Add Student'}
          </GlassButton>
        </div>
      </form>
    </GlassModal>
  );
};
