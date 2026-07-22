import React, { useState, useEffect } from 'react';
import { GlassModal } from '../../common/GlassModal';
import { GlassInput } from '../../common/GlassInput';
import { GlassSelect } from '../../common/GlassSelect';
import { GlassButton } from '../../common/GlassButton';
import { GlassTextarea } from '../../common/GlassTextarea';
import { Student, Class, StudentExtendedStatus } from '../../../types/master';
import { ImageUpload } from '../master/ImageUpload';
import { User, BookOpen, Users, Save } from 'lucide-react';

interface StudentFormModalAdvancedProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialData?: Student | null;
  classes: Class[];
}

export const StudentFormModalAdvanced: React.FC<StudentFormModalAdvancedProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  classes
}) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'academic' | 'parent'>('personal');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<Omit<Student, 'id' | 'createdAt' | 'updatedAt'>>({
    admissionNo: '',
    rollNo: '',
    fullName: '',
    gender: 'Male',
    dob: '',
    fatherName: '',
    motherName: '',
    classId: classes[0]?.id || '',
    phone: '',
    address: '',
    photoUrl: '',
    status: 'Active',
    admissionDate: new Date().toISOString().split('T')[0],
    section: 'A',
    house: 'Hazrat Aisha House (Red)',
    academicSession: '2026-2027',
    bloodGroup: 'O+',
    aadhaar: '',
    category: 'General',
    religion: 'Islam',
    guardianName: '',
    fatherOccupation: '',
    altMobile: '',
    email: '',
    emergencyContact: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        admissionNo: initialData.admissionNo || '',
        rollNo: initialData.rollNo || '',
        fullName: initialData.fullName || '',
        gender: initialData.gender || 'Male',
        dob: initialData.dob || '',
        fatherName: initialData.fatherName || '',
        motherName: initialData.motherName || '',
        classId: initialData.classId || classes[0]?.id || '',
        phone: initialData.phone || '',
        address: initialData.address || '',
        photoUrl: initialData.photoUrl || '',
        status: initialData.status || 'Active',
        admissionDate: initialData.admissionDate || new Date().toISOString().split('T')[0],
        section: initialData.section || 'A',
        house: initialData.house || 'Hazrat Aisha House (Red)',
        academicSession: initialData.academicSession || '2026-2027',
        bloodGroup: initialData.bloodGroup || 'O+',
        aadhaar: initialData.aadhaar || '',
        category: initialData.category || 'General',
        religion: initialData.religion || 'Islam',
        guardianName: initialData.guardianName || '',
        fatherOccupation: initialData.fatherOccupation || '',
        altMobile: initialData.altMobile || '',
        email: initialData.email || '',
        emergencyContact: initialData.emergencyContact || '',
        documents: initialData.documents || [],
        timeline: initialData.timeline || [],
        promotionHistory: initialData.promotionHistory || []
      });
    } else {
      // Auto generate Admission No
      const autoAdm = `HAA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setFormData(prev => ({
        ...prev,
        admissionNo: autoAdm,
        classId: classes[0]?.id || ''
      }));
    }
  }, [initialData, classes]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to save student record.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? `Edit Student: ${initialData.fullName}` : "New Student Admission Profile"}
      className="max-w-4xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tab Navigation */}
        <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/50 dark:border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'personal'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/40 dark:hover:bg-white/5'
            }`}
          >
            <User size={15} /> 1. Personal Info
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('academic')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'academic'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/40 dark:hover:bg-white/5'
            }`}
          >
            <BookOpen size={15} /> 2. Academic Info
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('parent')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'parent'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/40 dark:hover:bg-white/5'
            }`}
          >
            <Users size={15} /> 3. Parent & Contacts
          </button>
        </div>

        {/* Tab 1: Personal Details */}
        {activeTab === 'personal' && (
          <div className="space-y-6">
            <div className="flex justify-center my-2">
              <ImageUpload
                value={formData.photoUrl}
                onChange={(url) => setFormData(prev => ({ ...prev, photoUrl: url }))}
                folder="students"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GlassInput
                required
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Fatima Zohra"
              />

              <GlassSelect
                required
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                options={[
                  { label: 'Female', value: 'Female' },
                  { label: 'Male', value: 'Male' },
                  { label: 'Other', value: 'Other' }
                ]}
              />

              <GlassInput
                required
                type="date"
                label="Date of Birth"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />

              <GlassSelect
                label="Blood Group"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                options={[
                  { label: 'A+', value: 'A+' },
                  { label: 'B+', value: 'B+' },
                  { label: 'O+', value: 'O+' },
                  { label: 'AB+', value: 'AB+' },
                  { label: 'A-', value: 'A-' },
                  { label: 'B-', value: 'B-' },
                  { label: 'O-', value: 'O-' },
                  { label: 'AB-', value: 'AB-' }
                ]}
              />

              <GlassInput
                label="Aadhaar Number (Optional)"
                name="aadhaar"
                value={formData.aadhaar}
                onChange={handleChange}
                placeholder="12 digit Aadhaar"
              />

              <GlassSelect
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                options={[
                  { label: 'General', value: 'General' },
                  { label: 'OBC', value: 'OBC' },
                  { label: 'SC', value: 'SC' },
                  { label: 'ST', value: 'ST' },
                  { label: 'EWS', value: 'EWS' }
                ]}
              />

              <GlassSelect
                label="Religion"
                name="religion"
                value={formData.religion}
                onChange={handleChange}
                options={[
                  { label: 'Islam', value: 'Islam' },
                  { label: 'Hinduism', value: 'Hinduism' },
                  { label: 'Christianity', value: 'Christianity' },
                  { label: 'Sikhism', value: 'Sikhism' },
                  { label: 'Other', value: 'Other' }
                ]}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Academic Details */}
        {activeTab === 'academic' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassInput
              required
              label="Admission Number"
              name="admissionNo"
              value={formData.admissionNo}
              onChange={handleChange}
            />

            <GlassInput
              required
              label="Roll Number"
              name="rollNo"
              value={formData.rollNo}
              onChange={handleChange}
            />

            <GlassSelect
              required
              label="Class / Grade"
              name="classId"
              value={formData.classId}
              onChange={handleChange}
              options={classes.map(c => ({ label: c.className, value: c.id }))}
            />

            <GlassSelect
              label="Section"
              name="section"
              value={formData.section}
              onChange={handleChange}
              options={[
                { label: 'Section A', value: 'A' },
                { label: 'Section B', value: 'B' },
                { label: 'Section C', value: 'C' },
                { label: 'Section D', value: 'D' }
              ]}
            />

            <GlassSelect
              label="House"
              name="house"
              value={formData.house}
              onChange={handleChange}
              options={[
                { label: 'Hazrat Aisha House (Red)', value: 'Hazrat Aisha House (Red)' },
                { label: 'Fatima House (Blue)', value: 'Fatima House (Blue)' },
                { label: 'Khadija House (Green)', value: 'Khadija House (Green)' },
                { label: 'Maryam House (Yellow)', value: 'Maryam House (Yellow)' }
              ]}
            />

            <GlassSelect
              label="Academic Session"
              name="academicSession"
              value={formData.academicSession}
              onChange={handleChange}
              options={[
                { label: '2026-2027', value: '2026-2027' },
                { label: '2025-2026', value: '2025-2026' },
                { label: '2027-2028', value: '2027-2028' }
              ]}
            />

            <GlassInput
              required
              type="date"
              label="Admission Date"
              name="admissionDate"
              value={formData.admissionDate}
              onChange={handleChange}
            />

            <GlassSelect
              required
              label="Student Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={[
                { label: 'Active', value: 'Active' },
                { label: 'Inactive', value: 'Inactive' },
                { label: 'Transferred', value: 'Transferred' },
                { label: 'Alumni', value: 'Alumni' },
                { label: 'Dropped', value: 'Dropped' },
                { label: 'Graduated', value: 'Graduated' }
              ]}
            />
          </div>
        )}

        {/* Tab 3: Parent & Contact Details */}
        {activeTab === 'parent' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GlassInput
                required
                label="Father's Name"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
              />

              <GlassInput
                required
                label="Mother's Name"
                name="motherName"
                value={formData.motherName}
                onChange={handleChange}
              />

              <GlassInput
                label="Guardian Name (If applicable)"
                name="guardianName"
                value={formData.guardianName}
                onChange={handleChange}
              />

              <GlassInput
                label="Father / Guardian Occupation"
                name="fatherOccupation"
                value={formData.fatherOccupation}
                onChange={handleChange}
                placeholder="e.g. Business / Service"
              />

              <GlassInput
                required
                type="tel"
                label="Primary Mobile Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />

              <GlassInput
                type="tel"
                label="Alternate Contact Mobile"
                name="altMobile"
                value={formData.altMobile}
                onChange={handleChange}
              />

              <GlassInput
                type="email"
                label="Parent Email Address"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />

              <GlassInput
                type="tel"
                label="Emergency Contact Number"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
              />
            </div>

            <GlassTextarea
              required
              label="Residential Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="min-h-[80px]"
              placeholder="Full postal address in Sitamarhi, Bihar..."
            />
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex gap-2">
            {activeTab !== 'personal' && (
              <GlassButton
                type="button"
                variant="ghost"
                onClick={() => setActiveTab(activeTab === 'parent' ? 'academic' : 'personal')}
              >
                Previous Step
              </GlassButton>
            )}
            {activeTab !== 'parent' && (
              <GlassButton
                type="button"
                variant="ghost"
                onClick={() => setActiveTab(activeTab === 'personal' ? 'academic' : 'parent')}
              >
                Next Step
              </GlassButton>
            )}
          </div>

          <div className="flex gap-3">
            <GlassButton type="button" variant="ghost" onClick={onClose}>
              Cancel
            </GlassButton>
            <GlassButton
              type="submit"
              variant="primary"
              disabled={loading}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold"
            >
              <Save size={16} /> {loading ? 'Saving Record...' : 'Save Student Profile'}
            </GlassButton>
          </div>
        </div>
      </form>
    </GlassModal>
  );
};
