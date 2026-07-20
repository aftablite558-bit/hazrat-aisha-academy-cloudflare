import { useState, useEffect } from 'react';
import { GlassModal } from '../../common/GlassModal';
import { GlassInput } from '../../common/GlassInput';
import { GlassSelect } from '../../common/GlassSelect';
import { GlassButton } from '../../common/GlassButton';
import { GlassTextarea } from '../../common/GlassTextarea';
import { Homework } from '../../../types/academic';
import { useMasterData } from '../../../hooks/useMasterData';
import { Class, Section, Subject, Teacher } from '../../../types/master';
import { FileUpload } from '../master/FileUpload';

interface HomeworkFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Homework, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialData?: Homework | null;
}

export const HomeworkFormModal = ({ isOpen, onClose, onSubmit, initialData }: HomeworkFormModalProps) => {
  const { data: classes } = useMasterData<Class>('classes');
  const { data: sections } = useMasterData<Section>('sections');
  const { data: subjects } = useMasterData<Subject>('subjects');
  const { data: teachers } = useMasterData<Teacher>('teachers');

  const [formData, setFormData] = useState<Omit<Homework, 'id' | 'createdAt' | 'updatedAt'>>({
    classId: '',
    sectionId: '',
    subjectId: '',
    teacherId: '',
    title: '',
    description: '',
    attachmentUrl: '',
    dueDate: '',
    isPublished: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        classId: initialData.classId,
        sectionId: initialData.sectionId,
        subjectId: initialData.subjectId,
        teacherId: initialData.teacherId,
        title: initialData.title,
        description: initialData.description,
        attachmentUrl: initialData.attachmentUrl || '',
        dueDate: initialData.dueDate,
        isPublished: initialData.isPublished,
      });
    } else {
      setFormData({
        classId: '',
        sectionId: '',
        subjectId: '',
        teacherId: '',
        title: '',
        description: '',
        attachmentUrl: '',
        dueDate: '',
        isPublished: false,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <GlassModal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Homework" : "Add Homework"} className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassInput required label="Title" name="title" value={formData.title} onChange={handleChange} />
          <GlassInput required type="date" label="Due Date" name="dueDate" value={formData.dueDate} onChange={handleChange} />
          
          <GlassSelect 
            required 
            label="Class" 
            name="classId" 
            value={formData.classId} 
            onChange={handleChange}
            options={classes.map(c => ({ label: c.className, value: c.id }))}
          />

          <GlassSelect 
            required 
            label="Section" 
            name="sectionId" 
            value={formData.sectionId} 
            onChange={handleChange}
            options={sections.filter(s => s.classId === formData.classId).map(s => ({ label: s.sectionName, value: s.id }))}
          />
          
          <GlassSelect 
            required 
            label="Subject" 
            name="subjectId" 
            value={formData.subjectId} 
            onChange={handleChange}
            options={subjects.filter(s => s.classId === formData.classId).map(s => ({ label: s.subjectName, value: s.id }))}
          />

          <GlassSelect 
            required 
            label="Teacher" 
            name="teacherId" 
            value={formData.teacherId} 
            onChange={handleChange}
            options={teachers.map(t => ({ label: t.name, value: t.id }))}
          />
        </div>

        <GlassTextarea required label="Description" name="description" value={formData.description} onChange={handleChange} rows={4} />

        <FileUpload 
          value={formData.attachmentUrl || ''} 
          onChange={(url) => setFormData(prev => ({ ...prev, attachmentUrl: url }))} 
          folder="homework"
          label="Attachment (Optional PDF/Image)"
        />

        <div className="flex items-center gap-2">
          <input 
            type="checkbox" 
            id="isPublished" 
            name="isPublished" 
            checked={formData.isPublished} 
            onChange={handleChange} 
            className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary-500 focus:ring-primary-500"
          />
          <label htmlFor="isPublished" className="text-sm font-medium text-foreground">Publish immediately</label>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <GlassButton type="button" variant="ghost" onClick={onClose}>Cancel</GlassButton>
          <GlassButton type="submit" variant="primary">Save Homework</GlassButton>
        </div>
      </form>
    </GlassModal>
  );
};
