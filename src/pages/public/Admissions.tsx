import React, { useState } from 'react';
import { PublicLayout } from '../../layouts/PublicLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { GlassCard } from '../../components/common/GlassCard';
import { GlassButton } from '../../components/common/GlassButton';
import { GlassModal } from '../../components/common/GlassModal';
import { GlassInput } from '../../components/common/GlassInput';
import { GlassSelect } from '../../components/common/GlassSelect';
import { GlassTextarea } from '../../components/common/GlassTextarea';
import { GlassImageUpload } from '../../components/common/GlassImageUpload';
import { useToast } from '../../contexts/ToastContext';
import { api } from '../../services/apiClient';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, Sparkles, CheckCircle2, FileText, UserCheck, 
  Calendar, ShieldCheck, ArrowRight, HelpCircle, PhoneCall, 
  Upload, User, Users, BookOpen, Clock, AlertCircle
} from 'lucide-react';

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

  const steps = [
    {
      num: '01',
      title: 'Online Application Form',
      desc: 'Fill out the digital registration form with student and guardian details, or collect a physical form from the school office in Chak Rajopatti.'
    },
    {
      num: '02',
      title: 'Student Interaction',
      desc: 'An informal interaction session with the student to assess foundational learning, reading comprehension, and character readiness.'
    },
    {
      num: '03',
      title: 'Document Verification',
      desc: 'Submit required documents including Birth Certificate, Aadhaar Card, Transfer Certificate, and previous report card.'
    },
    {
      num: '04',
      title: 'Enrollment Confirmation',
      desc: 'Upon verification and fee payment, receive the official Student Admission Number and welcome kit.'
    }
  ];

  const documentChecklist = [
    'Recent Passport Size Student Photographs (4 copies)',
    'Original Birth Certificate issued by competent authority',
    'Student & Parent Aadhaar Card photocopies',
    'Previous School Transfer Certificate (TC) & Mark Sheet (if applicable)',
    'Medical Fitness Certificate & Blood Group proof'
  ];

  return (
    <PublicLayout>
      <PageHeader 
        title="Admissions 2026–2027" 
        description="Join Hazrat Aisha Academy in Sitamarhi, Bihar. Cultivating academic excellence with authentic Islamic Tarbiyah." 
      />

      {/* Main Container */}
      <div className="py-16 px-6 max-w-7xl mx-auto space-y-20 relative z-10">

        {/* Hero Section Banner */}
        <GlassCard className="p-8 sm:p-12 relative overflow-hidden border-emerald-500/30 bg-gradient-to-br from-slate-900/90 via-slate-900/95 to-emerald-950/80 shadow-2xl">
          <div className="absolute -right-16 -top-16 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10">
            <div className="space-y-4 max-w-2xl text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-amber-300 text-xs font-extrabold uppercase tracking-widest">
                <Sparkles size={14} className="text-amber-400 animate-pulse" />
                <span>Admissions Open • Pre-Nursery to Class X</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Empower Your Child with Knowledge & Faith
              </h2>
              <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
                We welcome bright young minds to experience an integrated education combining CBSE modern curriculum with Quranic recitation, Deeniyat, and moral values.
              </p>
              
              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-2 text-emerald-400">
                  <ShieldCheck size={16} /> Transparent Fee Policy
                </span>
                <span className="flex items-center gap-2 text-amber-400">
                  <UserCheck size={16} /> Equal Opportunity Campus
                </span>
                <span className="flex items-center gap-2 text-teal-400">
                  <Clock size={16} /> Morning & Day Batches
                </span>
              </div>
            </div>

            <div className="w-full lg:w-auto flex flex-col items-center gap-4 bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-md">
              <div className="text-center space-y-1">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300">Session 2026-27</p>
                <p className="text-xl font-black text-white">Seats Are Filling Fast!</p>
                <p className="text-xs text-slate-400">Apply early to secure your preferred grade</p>
              </div>
              <GlassButton 
                variant="primary" 
                onClick={() => setIsModalOpen(true)}
                className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-sm shadow-xl shadow-emerald-950/40 hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <GraduationCap size={20} />
                <span>Apply Online Now</span>
                <ArrowRight size={18} />
              </GlassButton>
              <a href="tel:+919470818538" className="text-xs font-semibold text-amber-300 hover:underline flex items-center gap-1.5 pt-1">
                <PhoneCall size={14} /> Helpline: +91 9470818538
              </a>
            </div>
          </div>
        </GlassCard>

        {/* 4 Step Admission Process Grid */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Simple 4-Step Journey
            </span>
            <h3 className="text-2xl sm:text-4xl font-black text-foreground">How Admission Works</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">Follow these simple steps to enroll your child at Hazrat Aisha Academy.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <GlassCard key={step.num} className="p-6 h-full flex flex-col justify-between hover:border-emerald-500/40 transition-all group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono bg-emerald-500/10 px-3 py-1 rounded-xl">
                      {step.num}
                    </span>
                    <CheckCircle2 size={18} className="text-slate-300 dark:text-slate-700 group-hover:text-emerald-500 transition-colors" />
                  </div>
                  <h4 className="text-base font-bold text-foreground mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {step.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Document Checklist & Eligibility Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Required Documents Card */}
          <GlassCard className="p-8 border-emerald-500/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <FileText size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Required Documents</h3>
                <p className="text-xs text-muted-foreground">Keep digital copies ready for online application</p>
              </div>
            </div>

            <ul className="space-y-3">
              {documentChecklist.map((doc, idx) => (
                <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 size={16} className="text-emerald-500 flex-none mt-0.5" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </GlassCard>

          {/* Age Criteria & Guidelines */}
          <GlassCard className="p-8 border-amber-500/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Calendar size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Age Criteria (as of April 1, 2026)</h3>
                  <p className="text-xs text-muted-foreground">Standard age guidelines according to CBSE norms</p>
                </div>
              </div>

              <div className="space-y-2 mb-6 text-xs">
                <div className="flex justify-between p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 font-semibold text-slate-700 dark:text-slate-300">
                  <span>Nursery / LKG</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold">3.0 – 4.5 Years</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 font-semibold text-slate-700 dark:text-slate-300">
                  <span>UKG / Prep</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold">4.5 – 5.5 Years</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 font-semibold text-slate-700 dark:text-slate-300">
                  <span>Class 1</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold">5.5 – 6.5 Years</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 font-semibold text-slate-700 dark:text-slate-300">
                  <span>Class 2 to Class 10</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold">Corresponding Age + TC</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
              <AlertCircle size={18} className="flex-none text-amber-500 mt-0.5" />
              <span>For details on fee structure, scholarships for deserving students, and transportation routes, please visit the administrative office or contact our helpline.</span>
            </div>
          </GlassCard>
        </div>

      </div>

      {/* Apply Now Modal */}
      <GlassModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Student Admission Application (Session 2026–2027)"
        className="max-w-4xl"
      >
        <form onSubmit={handleSubmit} className="space-y-8 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar p-1">
          
          {/* Section 1: Student Details */}
          <div className="p-6 rounded-2xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
              <User size={18} className="text-emerald-500" />
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-foreground">1. Student Details</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GlassInput label="Student Full Name *" placeholder="e.g. Abdullah Khan" value={studentName} onChange={e => setStudentName(e.target.value)} required />
              
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
              
              <GlassInput label="Previous School (if applicable)" placeholder="Name of previous school" value={previousSchool} onChange={e => setPreviousSchool(e.target.value)} />
              <GlassInput label="Student Aadhaar Number (optional)" placeholder="12-digit Aadhaar Number" value={studentAadhaar} onChange={e => setStudentAadhaar(e.target.value)} />
              <GlassInput label="Blood Group (optional)" placeholder="e.g. O+, A+, B+" value={bloodGroup} onChange={e => setBloodGroup(e.target.value)} />
            </div>
          </div>

          {/* Section 2: Parent/Guardian Details */}
          <div className="p-6 rounded-2xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
              <Users size={18} className="text-amber-500" />
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-foreground">2. Parent / Guardian Information</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GlassInput label="Father's Name *" placeholder="Father's full name" value={fatherName} onChange={e => setFatherName(e.target.value)} required />
              <GlassInput label="Mother's Name *" placeholder="Mother's full name" value={motherName} onChange={e => setMotherName(e.target.value)} required />
              <GlassInput label="Guardian's Name (if applicable)" placeholder="Guardian name if different" value={guardianName} onChange={e => setGuardianName(e.target.value)} />
              <GlassInput label="Primary Mobile Number *" type="tel" placeholder="10-digit mobile number" value={parentPhone} onChange={e => setParentPhone(e.target.value)} required />
              <GlassInput label="Alternate Mobile Number" type="tel" placeholder="Secondary mobile number" value={alternatePhone} onChange={e => setAlternatePhone(e.target.value)} />
              <GlassInput label="Email Address (Optional)" type="email" placeholder="parent@example.com" value={parentEmail} onChange={e => setParentEmail(e.target.value)} />
            </div>
            
            <div>
              <GlassTextarea label="Complete Residential Address *" placeholder="Door No, Street, Colony, Village/Town, Sitamarhi, Bihar PIN" value={address} onChange={e => setAddress(e.target.value)} required rows={3} />
            </div>
          </div>

          {/* Section 3: Documents Upload */}
          <div className="p-6 rounded-2xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
              <Upload size={18} className="text-teal-500" />
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-foreground">3. Document Uploads (Optional during preliminary form)</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Student Photograph</label>
                <GlassImageUpload path="admissions/photos" value={photoUrl} onChange={setPhotoUrl} />
              </div>
              
              <div className="space-y-4">
                <GlassImageUpload label="Birth Certificate Image" path="admissions/birth_certs" value={birthCertificateUrl} onChange={setBirthCertificateUrl} />
                <GlassImageUpload label="Aadhaar Card Image" path="admissions/aadhaar" value={aadhaarUrl} onChange={setAadhaarUrl} />
                <GlassImageUpload label="Previous Report Card Image" path="admissions/reports" value={reportCardUrl} onChange={setReportCardUrl} />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <GlassButton type="button" variant="ghost" onClick={() => setIsModalOpen(false)} disabled={submitting}>
              Cancel
            </GlassButton>
            <GlassButton 
              type="submit" 
              variant="primary" 
              disabled={submitting}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs shadow-lg shadow-emerald-950/20 hover:scale-105 transition-all flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting Application...</span>
                </>
              ) : (
                <>
                  <GraduationCap size={16} />
                  <span>Submit Admission Application</span>
                </>
              )}
            </GlassButton>
          </div>
        </form>
      </GlassModal>

    </PublicLayout>
  );
};
