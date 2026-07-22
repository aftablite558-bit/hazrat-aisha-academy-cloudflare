import React, { useState } from 'react';
import { GlassModal } from '../../common/GlassModal';
import { GlassBadge } from '../../common/GlassBadge';
import { GlassButton } from '../../common/GlassButton';
import { Student, Class, StudentDocument } from '../../../types/master';
import { StudentDocumentManager } from './StudentDocumentManager';
import { StudentTimelineView } from './StudentTimelineView';
import { User, BookOpen, Users, FileText, Clock, CreditCard, Award, GraduationCap, Edit, Phone, Mail, MapPin, Calendar, Heart } from 'lucide-react';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  classes: Class[];
  onEdit?: (student: Student) => void;
  onIssueCertificate?: (student: Student) => void;
  onGenerateIDCard?: (student: Student) => void;
  onPromote?: (student: Student) => void;
  onUpdateDocuments?: (studentId: string, docs: StudentDocument[]) => Promise<void>;
  readOnly?: boolean;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  student,
  classes,
  onEdit,
  onIssueCertificate,
  onGenerateIDCard,
  onPromote,
  onUpdateDocuments,
  readOnly = false
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'parent' | 'documents' | 'timeline'>('profile');
  const className = classes.find(c => c.id === student.classId)?.className || student.classId || 'Class 1';

  const [documents, setDocuments] = useState<StudentDocument[]>(student.documents || []);

  const handleDocumentUpload = async (newDoc: StudentDocument) => {
    const updated = [newDoc, ...documents];
    setDocuments(updated);
    if (onUpdateDocuments && student.id) {
      await onUpdateDocuments(student.id, updated);
    }
  };

  const handleDocumentDelete = async (docId: string) => {
    const updated = documents.filter(d => d.id !== docId);
    setDocuments(updated);
    if (onUpdateDocuments && student.id) {
      await onUpdateDocuments(student.id, updated);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Transferred':
        return 'warning';
      case 'Alumni':
      case 'Graduated':
        return 'primary';
      case 'Dropped':
      case 'Inactive':
        return 'danger';
      default:
        return 'default';
    }
  };

  return (
    <GlassModal isOpen={isOpen} onClose={onClose} title="Student Enterprise Profile" className="max-w-5xl">
      <div className="space-y-6">
        {/* Profile Hero Section */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
            {/* Photo Avatar */}
            <div className="w-28 h-28 rounded-2xl bg-white/10 backdrop-blur-md border-2 border-white/20 overflow-hidden flex items-center justify-center flex-shrink-0 shadow-2xl">
              {student.photoUrl ? (
                <img src={student.photoUrl} alt={student.fullName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-extrabold text-amber-400">{student.fullName.charAt(0)}</span>
              )}
            </div>

            {/* Main Info Header */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <h2 className="text-2xl font-black tracking-tight">{student.fullName}</h2>
                <GlassBadge variant={getStatusBadgeVariant(student.status)} className="px-3 py-1 font-bold">
                  {student.status}
                </GlassBadge>
              </div>

              <p className="text-xs text-slate-300 font-medium">
                Admission No: <strong className="text-amber-400 font-mono">{student.admissionNo}</strong> • Roll No:{' '}
                <strong className="text-slate-100">{student.rollNo || 'N/A'}</strong> • Class:{' '}
                <strong className="text-slate-100">{className} {student.section ? `(${student.section})` : ''}</strong>
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs text-slate-300 pt-1">
                <span className="flex items-center gap-1"><Calendar size={13} className="text-amber-400" /> DOB: {student.dob || 'N/A'}</span>
                <span className="flex items-center gap-1"><Heart size={13} className="text-rose-400" /> Blood: {student.bloodGroup || 'O+'}</span>
                <span className="flex items-center gap-1"><Users size={13} className="text-blue-400" /> House: {student.house || 'Hazrat Aisha House'}</span>
                <span className="flex items-center gap-1"><Phone size={13} className="text-emerald-400" /> Mobile: {student.phone || 'N/A'}</span>
              </div>
            </div>

            {/* Quick Actions Panel */}
            {!readOnly && (
              <div className="flex sm:flex-col gap-2 flex-shrink-0 w-full sm:w-auto">
                {onEdit && (
                  <button
                    onClick={() => onEdit(student)}
                    className="flex-1 sm:flex-none px-3 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white flex items-center justify-center gap-2 backdrop-blur-md transition-colors"
                  >
                    <Edit size={14} /> Edit Profile
                  </button>
                )}
                {onGenerateIDCard && (
                  <button
                    onClick={() => onGenerateIDCard(student)}
                    className="flex-1 sm:flex-none px-3 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center gap-2 shadow-md transition-colors"
                  >
                    <CreditCard size={14} /> Print ID Card
                  </button>
                )}
                {onIssueCertificate && (
                  <button
                    onClick={() => onIssueCertificate(student)}
                    className="flex-1 sm:flex-none px-3 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2 shadow-md transition-colors"
                  >
                    <Award size={14} /> Certificates
                  </button>
                )}
                {onPromote && (
                  <button
                    onClick={() => onPromote(student)}
                    className="flex-1 sm:flex-none px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 shadow-md transition-colors"
                  >
                    <GraduationCap size={14} /> Promote Grade
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/50 dark:border-white/10">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <User size={15} /> Personal Details
          </button>

          <button
            onClick={() => setActiveTab('parent')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'parent'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Users size={15} /> Parent & Contacts
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'documents'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <FileText size={15} /> Documents ({documents.length})
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'timeline'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Clock size={15} /> Student Timeline
          </button>
        </div>

        {/* Tab Content */}
        <div className="pt-2">
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Academic Overview Box */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 flex items-center gap-2">
                  <BookOpen size={16} /> Academic Record
                </h4>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                  <DetailItem label="Current Grade / Class" value={className} />
                  <DetailItem label="Section" value={student.section || 'A'} />
                  <DetailItem label="Roll Number" value={student.rollNo || 'N/A'} />
                  <DetailItem label="House" value={student.house || 'Hazrat Aisha House (Red)'} />
                  <DetailItem label="Academic Session" value={student.academicSession || '2026-2027'} />
                  <DetailItem label="Date of Admission" value={student.admissionDate || 'N/A'} />
                </div>
              </div>

              {/* Personal Details Box */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 flex items-center gap-2">
                  <User size={16} /> Personal Profile
                </h4>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                  <DetailItem label="Gender" value={student.gender} />
                  <DetailItem label="Date of Birth" value={student.dob} />
                  <DetailItem label="Blood Group" value={student.bloodGroup || 'O+'} />
                  <DetailItem label="Category" value={student.category || 'General'} />
                  <DetailItem label="Religion" value={student.religion || 'Islam'} />
                  <DetailItem label="Aadhaar Card" value={student.aadhaar || 'N/A'} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'parent' && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 flex items-center gap-2">
                <Users size={16} /> Guardian & Contact Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 text-xs">
                <DetailItem label="Father's Full Name" value={student.fatherName || 'N/A'} />
                <DetailItem label="Mother's Full Name" value={student.motherName || 'N/A'} />
                <DetailItem label="Guardian Name" value={student.guardianName || student.fatherName || 'N/A'} />
                <DetailItem label="Father / Guardian Occupation" value={student.fatherOccupation || 'N/A'} />
                <DetailItem label="Primary Mobile Phone" value={student.phone || 'N/A'} />
                <DetailItem label="Alternate Mobile" value={student.altMobile || 'N/A'} />
                <DetailItem label="Email Address" value={student.email || 'N/A'} />
                <DetailItem label="Emergency Contact" value={student.emergencyContact || student.phone || 'N/A'} />
              </div>
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                <DetailItem label="Residential Postal Address" value={student.address || 'Sitamarhi, Bihar'} />
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <StudentDocumentManager
              documents={documents}
              onUpload={handleDocumentUpload}
              onDelete={handleDocumentDelete}
              readOnly={readOnly}
            />
          )}

          {activeTab === 'timeline' && (
            <StudentTimelineView
              timeline={student.timeline}
              admissionDate={student.admissionDate}
              fullName={student.fullName}
            />
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
          <GlassButton type="button" variant="ghost" onClick={onClose}>
            Close Profile
          </GlassButton>
        </div>
      </div>
    </GlassModal>
  );
};

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-0.5">{label}</p>
    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{value}</p>
  </div>
);
