import { useState } from 'react';
import { PublicLayout } from '../../layouts/PublicLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { Section } from '../../components/common/Section';
import { GlassCard } from '../../components/common/GlassCard';
import { GlassButton } from '../../components/common/GlassButton';
import { GlassModal } from '../../components/common/GlassModal';
import { GlassInput } from '../../components/common/GlassInput';
import { GlassSelect } from '../../components/common/GlassSelect';
import { GlassTextarea } from '../../components/common/GlassTextarea';
import { GlassImageUpload } from '../../components/common/GlassImageUpload';
import { useToast } from '../../contexts/ToastContext';
import { api } from '../../services/apiClient';

export const Admissions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [studentName, setStudentName] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [classApplied, setClassApplied] = useState('');
  const [previousSchool, setPreviousSchool] = useState('');
  const [studentAadhaar, setStudentAadhaar] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');

  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [alternatePhone, setAlternatePhone] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [address, setAddress] = useState('');

  const [photoUrl, setPhotoUrl] = useState('');
  const [birthCertificateUrl, setBirthCertificateUrl] = useState('');
  const [aadhaarUrl, setAadhaarUrl] = useState('');
  const [reportCardUrl, setReportCardUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !gender || !dob || !classApplied || !fatherName || !motherName || !parentPhone || !address) {
      addToast('Please fill all required fields.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const admissionData = {
        admissionNumber: 'APP-' + Date.now().toString().slice(-6),
        studentName,
        gender,
        dob,
        classApplied,
        previousSchool,
        studentAadhaar,
        bloodGroup,
        fatherName,
        motherName,
        guardianName,
        parentName: fatherName || motherName || guardianName,
        parentPhone,
        alternatePhone,
        parentEmail,
        address,
        photoUrl,
        birthCertificateUrl,
        aadhaarUrl,
        reportCardUrl,
        status: 'Pending',
        createdAt: new Date().toISOString()
      };

      await api.post('/collection/admissions', admissionData);
      
      addToast('Application submitted successfully! Your Application ID is ' + admissionData.admissionNumber, 'success');
      setIsModalOpen(false);
      
      // Reset form
      setStudentName('');
      setGender('');
      setDob('');
      setClassApplied('');
      setPreviousSchool('');
      setStudentAadhaar('');
      setBloodGroup('');
      setFatherName('');
      setMotherName('');
      setGuardianName('');
      setParentPhone('');
      setAlternatePhone('');
      setParentEmail('');
      setAddress('');
      setPhotoUrl('');
      setBirthCertificateUrl('');
      setAadhaarUrl('');
      setReportCardUrl('');

    } catch (error) {
      addToast('Failed to submit application. Please try again.', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      <PageHeader title="Admissions" description="Start your journey with us." />
      <Section>
        <div className="max-w-2xl mx-auto">
          <GlassCard className="p-8">
            <h3 className="text-xl font-bold mb-4">Admission Process</h3>
            <ul className="list-decimal list-inside space-y-2 text-muted-foreground mb-8">
              <li>Application form submission</li>
              <li>Interaction / Assessment</li>
              <li>Document verification</li>
              <li>Fee payment</li>
            </ul>
            <GlassButton className="w-full" onClick={() => setIsModalOpen(true)}>Apply Now</GlassButton>
          </GlassCard>
        </div>
      </Section>

      <GlassModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Admission Application"
        className="max-w-4xl"
      >
        <form onSubmit={handleSubmit} className="space-y-8 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          
          {/* Student Details */}
          <div>
            <h4 className="text-lg font-semibold border-b border-white/10 pb-2 mb-4">Student Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GlassInput label="Student Name *" value={studentName} onChange={e => setStudentName(e.target.value)} required />
              <GlassSelect label="Gender *" value={gender} onChange={e => setGender(e.target.value)} required>
                <option value="" disabled>Select Gender</option>
                <option value="Male" className="bg-slate-900">Male</option>
                <option value="Female" className="bg-slate-900">Female</option>
                <option value="Other" className="bg-slate-900">Other</option>
              </GlassSelect>
              <GlassInput type="date" label="Date of Birth *" value={dob} onChange={e => setDob(e.target.value)} required />
              <GlassSelect label="Class Applying For *" value={classApplied} onChange={e => setClassApplied(e.target.value)} required>
                <option value="" disabled>Select Class</option>
                <option value="Nursery" className="bg-slate-900">Nursery</option>
                <option value="LKG" className="bg-slate-900">LKG</option>
                <option value="UKG" className="bg-slate-900">UKG</option>
                <option value="Class 1" className="bg-slate-900">Class 1</option>
                <option value="Class 2" className="bg-slate-900">Class 2</option>
                <option value="Class 3" className="bg-slate-900">Class 3</option>
                <option value="Class 4" className="bg-slate-900">Class 4</option>
                <option value="Class 5" className="bg-slate-900">Class 5</option>
                <option value="Class 6" className="bg-slate-900">Class 6</option>
                <option value="Class 7" className="bg-slate-900">Class 7</option>
                <option value="Class 8" className="bg-slate-900">Class 8</option>
                <option value="Class 9" className="bg-slate-900">Class 9</option>
                <option value="Class 10" className="bg-slate-900">Class 10</option>
              </GlassSelect>
              <GlassInput label="Previous School (if any)" value={previousSchool} onChange={e => setPreviousSchool(e.target.value)} />
              <GlassInput label="Aadhaar Number (optional)" value={studentAadhaar} onChange={e => setStudentAadhaar(e.target.value)} />
              <GlassInput label="Blood Group (optional)" value={bloodGroup} onChange={e => setBloodGroup(e.target.value)} />
            </div>
          </div>

          {/* Parent Details */}
          <div>
            <h4 className="text-lg font-semibold border-b border-white/10 pb-2 mb-4">Parent/Guardian Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GlassInput label="Father's Name *" value={fatherName} onChange={e => setFatherName(e.target.value)} required />
              <GlassInput label="Mother's Name *" value={motherName} onChange={e => setMotherName(e.target.value)} required />
              <GlassInput label="Guardian's Name" value={guardianName} onChange={e => setGuardianName(e.target.value)} />
              <GlassInput label="Mobile Number *" type="tel" value={parentPhone} onChange={e => setParentPhone(e.target.value)} required />
              <GlassInput label="Alternate Number" type="tel" value={alternatePhone} onChange={e => setAlternatePhone(e.target.value)} />
              <GlassInput label="Email Address" type="email" value={parentEmail} onChange={e => setParentEmail(e.target.value)} />
            </div>
            <div className="mt-4">
              <GlassTextarea label="Residential Address *" value={address} onChange={e => setAddress(e.target.value)} required rows={3} />
            </div>
          </div>

          {/* Documents Upload */}
          <div>
            <h4 className="text-lg font-semibold border-b border-white/10 pb-2 mb-4">Documents Upload</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-foreground mb-2">Student Photo</label>
                <GlassImageUpload path="admissions/photos" value={photoUrl} onChange={setPhotoUrl} />
              </div>
              <div className="space-y-4">
                <GlassImageUpload label="Birth Certificate (Image)" path="admissions/birth_certs" value={birthCertificateUrl} onChange={setBirthCertificateUrl} />
                <GlassImageUpload label="Aadhaar Card (Image)" path="admissions/aadhaar" value={aadhaarUrl} onChange={setAadhaarUrl} />
                <GlassImageUpload label="Previous Report Card (Image)" path="admissions/reports" value={reportCardUrl} onChange={setReportCardUrl} />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <GlassButton type="button" variant="primary" onClick={() => setIsModalOpen(false)} disabled={submitting}>Cancel</GlassButton>
            <GlassButton type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Application'}
            </GlassButton>
          </div>
        </form>
      </GlassModal>
    </PublicLayout>
  );
};
