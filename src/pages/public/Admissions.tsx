import React, { useState } from 'react';
import { PublicLayout } from '../../layouts/PublicLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { 
  PremiumCard, 
  PremiumButton, 
  PremiumModal, 
  PremiumInput, 
  PremiumSelect, 
  PremiumTextarea 
} from '../../components/common/PremiumComponents';
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
        <PremiumCard variant="luxury" glow="emerald" gradientBorder className="p-8 sm:p-12 relative overflow-hidden border-emerald-500/30">
          <div className="absolute -right-16 -top-16 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10">
            <div className="space-y-4 max-w-2xl text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-amber-300 text-xs font-extrabold uppercase tracking-widest shadow-md">
                <Sparkles size={14} className="text-amber-400 animate-pulse" />
                <span>Admissions Open • Pre-Nursery to Class X</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Empower Your Child with Knowledge & Faith
              </h2>
              <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
                We welcome bright young minds to experience an integrated education combining CBSE modern curriculum with Quranic recitation, Deeniyat, and moral values.
              </p>
              
              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-2 text-emerald-400 font-bold">
                  <ShieldCheck size={16} /> Transparent Fee Policy
                </span>
                <span className="flex items-center gap-2 text-amber-400 font-bold">
                  <UserCheck size={16} /> Equal Opportunity Campus
                </span>
                <span className="flex items-center gap-2 text-teal-400 font-bold">
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
              <PremiumButton 
                variant="primary" 
                size="lg"
                onClick={() => setIsModalOpen(true)}
                icon={<ArrowRight size={18} />}
              >
                <GraduationCap size={20} />
                <span>Apply Online Now</span>
              </PremiumButton>
              <a href="tel:+919470818538" className="text-xs font-bold text-amber-300 hover:underline flex items-center gap-1.5 pt-1">
                <PhoneCall size={14} /> Helpline: +91 9470818538
              </a>
            </div>
          </div>
        </PremiumCard>

        {/* 4 Step Admission Process Grid */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 shadow-md">
              Simple 4-Step Journey
            </span>
            <h3 className="text-2xl sm:text-4xl font-black text-foreground">How Admission Works</h3>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">Follow these simple steps to enroll your child at Hazrat Aisha Academy.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <PremiumCard key={step.num} hoverable className="p-6 h-full flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-emerald-400 font-mono bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
                      {step.num}
                    </span>
                    <CheckCircle2 size={18} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
                  </div>
                  <h4 className="text-base font-bold text-foreground mb-2 group-hover:text-emerald-400 transition-colors">
                    {step.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    {step.desc}
                  </p>
                </div>
              </PremiumCard>
            ))}
          </div>
        </div>

        {/* Document Checklist & Eligibility Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Required Documents Card */}
          <PremiumCard variant="emerald" className="p-8 border-emerald-500/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 shadow-inner">
                <FileText size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Required Documents</h3>
                <p className="text-xs text-muted-foreground font-medium">Keep digital copies ready for online application</p>
              </div>
            </div>

            <ul className="space-y-3">
              {documentChecklist.map((doc, idx) => (
                <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-xs font-semibold text-slate-300">
                  <CheckCircle2 size={16} className="text-emerald-400 flex-none mt-0.5" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </PremiumCard>

          {/* Age Criteria & Guidelines */}
          <PremiumCard variant="gold" className="p-8 border-amber-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 shadow-inner">
                  <Calendar size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Age Criteria (as of April 1, 2026)</h3>
                  <p className="text-xs text-muted-foreground font-medium">Standard age guidelines according to CBSE norms</p>
                </div>
              </div>

              <div className="space-y-2 mb-6 text-xs">
                <div className="flex justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800 font-semibold text-slate-300">
                  <span>Nursery / LKG</span>
                  <span className="text-amber-400 font-bold">3.0 – 4.5 Years</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800 font-semibold text-slate-300">
                  <span>UKG / Prep</span>
                  <span className="text-amber-400 font-bold">4.5 – 5.5 Years</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800 font-semibold text-slate-300">
                  <span>Class 1</span>
                  <span className="text-amber-400 font-bold">5.5 – 6.5 Years</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800 font-semibold text-slate-300">
                  <span>Class 2 to Class 10</span>
                  <span className="text-amber-400 font-bold">Corresponding Age + TC</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2.5">
              <AlertCircle size={18} className="flex-none text-amber-400 mt-0.5" />
              <span>For details on fee structure, scholarships for deserving students, and transportation routes, please visit the administrative office or contact our helpline.</span>
            </div>
          </PremiumCard>
        </div>

      </div>

      {/* Apply Now Modal */}
      <PremiumModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Student Admission Application (Session 2026–2027)"
        className="max-w-4xl"
      >
        <form onSubmit={handleSubmit} className="space-y-8 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar p-1">
          
          {/* Section 1: Student Details */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <User size={18} className="text-emerald-400" />
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-foreground">1. Student Details</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PremiumInput label="Student Full Name *" placeholder="e.g. Abdullah Khan" value={studentName} onChange={e => setStudentName(e.target.value)} required />
              
              <PremiumSelect label="Gender *" value={gender} onChange={e => setGender(e.target.value)} required>
                <option value="" disabled>Select Gender</option>
                <option value="Male" className="bg-slate-900">Male</option>
                <option value="Female" className="bg-slate-900">Female</option>
                <option value="Other" className="bg-slate-900">Other</option>
              </PremiumSelect>
              
              <PremiumInput type="date" label="Date of Birth *" value={dob} onChange={e => setDob(e.target.value)} required />
              
              <PremiumSelect label="Class Applying For *" value={classApplied} onChange={e => setClassApplied(e.target.value)} required>
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
              </PremiumSelect>
              
              <PremiumInput label="Previous School (if applicable)" placeholder="Name of previous school" value={previousSchool} onChange={e => setPreviousSchool(e.target.value)} />
              <PremiumInput label="Student Aadhaar Number (optional)" placeholder="12-digit Aadhaar Number" value={studentAadhaar} onChange={e => setStudentAadhaar(e.target.value)} />
              <PremiumInput label="Blood Group (optional)" placeholder="e.g. O+, A+, B+" value={bloodGroup} onChange={e => setBloodGroup(e.target.value)} />
            </div>
          </div>

          {/* Section 2: Parent/Guardian Details */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Users size={18} className="text-amber-400" />
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-foreground">2. Parent / Guardian Information</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PremiumInput label="Father's Name *" placeholder="Father's full name" value={fatherName} onChange={e => setFatherName(e.target.value)} required />
              <PremiumInput label="Mother's Name *" placeholder="Mother's full name" value={motherName} onChange={e => setMotherName(e.target.value)} required />
              <PremiumInput label="Guardian's Name (if applicable)" placeholder="Guardian name if different" value={guardianName} onChange={e => setGuardianName(e.target.value)} />
              <PremiumInput label="Primary Mobile Number *" type="tel" placeholder="10-digit mobile number" value={parentPhone} onChange={e => setParentPhone(e.target.value)} required />
              <PremiumInput label="Alternate Mobile Number" type="tel" placeholder="Secondary mobile number" value={alternatePhone} onChange={e => setAlternatePhone(e.target.value)} />
              <PremiumInput label="Email Address (Optional)" type="email" placeholder="parent@example.com" value={parentEmail} onChange={e => setParentEmail(e.target.value)} />
            </div>
            
            <div>
              <PremiumTextarea label="Complete Residential Address *" placeholder="Door No, Street, Colony, Village/Town, Sitamarhi, Bihar PIN" value={address} onChange={e => setAddress(e.target.value)} required rows={3} />
            </div>
          </div>

          {/* Section 3: Documents Upload */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Upload size={18} className="text-teal-400" />
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-foreground">3. Document Uploads (Optional during preliminary form)</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Student Photograph</label>
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
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <PremiumButton type="button" variant="ghost" onClick={() => setIsModalOpen(false)} disabled={submitting}>
              Cancel
            </PremiumButton>
            <PremiumButton 
              type="submit" 
              variant="primary" 
              disabled={submitting}
              icon={submitting ? undefined : <GraduationCap size={16} />}
            >
              {submitting ? 'Submitting Application...' : 'Submit Admission Application'}
            </PremiumButton>
          </div>
        </form>
      </PremiumModal>

    </PublicLayout>
  );
};
