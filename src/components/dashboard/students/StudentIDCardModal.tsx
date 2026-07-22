import React, { useState } from 'react';
import { GlassModal } from '../../common/GlassModal';
import { GlassButton } from '../../common/GlassButton';
import { Student, Class } from '../../../types/master';
import { generateStudentIDCardPDF } from '../../../utils/studentPdfUtils';
import { SCHOOL_INFO } from '../../../utils/financeUtils';
import { CreditCard, Download, QrCode, Phone, Shield, User } from 'lucide-react';

interface StudentIDCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  allStudents?: Student[];
  classes: Class[];
}

export const StudentIDCardModal: React.FC<StudentIDCardModalProps> = ({
  isOpen,
  onClose,
  student,
  allStudents = [],
  classes
}) => {
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [selectedClassId, setSelectedClassId] = useState<string>(student.classId || '');

  const className = classes.find(c => c.id === student.classId)?.className || student.classId || 'Class 1';

  const targetStudents = mode === 'single'
    ? [student]
    : allStudents.filter(s => !selectedClassId || s.classId === selectedClassId);

  const handleDownloadPDF = () => {
    generateStudentIDCardPDF(targetStudents, classes);
  };

  return (
    <GlassModal isOpen={isOpen} onClose={onClose} title="Student Identity Card Generator" className="max-w-4xl">
      <div className="space-y-6">
        {/* Mode Selector */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-2 rounded-2xl bg-slate-100 dark:bg-slate-800/80">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode('single')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'single'
                  ? 'bg-primary-600 text-white shadow'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Single Card ({student.fullName})
            </button>
            <button
              type="button"
              onClick={() => setMode('bulk')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'bulk'
                  ? 'bg-primary-600 text-white shadow'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Bulk Class ID Cards ({targetStudents.length} Students)
            </button>
          </div>

          {mode === 'bulk' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Filter Class:</span>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              >
                <option value="">All Classes</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.className}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Visual Preview Box */}
        <div className="flex flex-col items-center justify-center p-8 rounded-3xl bg-slate-200/50 dark:bg-slate-950/60 border border-slate-300/80 dark:border-slate-800">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-6">
            Live Preview (CR80 Standard Dimensions: 85.6mm x 54mm)
          </p>

          {/* CR80 Card Front Container */}
          <div className="w-[340px] h-[215px] rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-300 dark:border-slate-700 overflow-hidden flex flex-col justify-between relative transform hover:scale-[1.02] transition-transform">
            {/* Header Header */}
            <div className="bg-slate-900 text-white p-2.5 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/20 rounded-full blur-xl"></div>
              <h4 className="text-xs font-extrabold tracking-wide uppercase text-amber-400">
                HAZRAT AISHA ACADEMY
              </h4>
              <p className="text-[9px] text-slate-300 font-medium">Sitamarhi, Bihar • Student Identity Card</p>
            </div>

            {/* Content Body */}
            <div className="px-4 py-2 flex items-center gap-3 flex-1">
              {/* Photo Box */}
              <div className="w-16 h-20 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-inner">
                {student.photoUrl ? (
                  <img src={student.photoUrl} alt={student.fullName} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-2xl font-bold text-primary-500">{student.fullName.charAt(0)}</div>
                )}
              </div>

              {/* Student Info */}
              <div className="overflow-hidden space-y-1 text-slate-800 dark:text-slate-200">
                <h5 className="text-xs font-bold leading-tight truncate text-slate-900 dark:text-slate-100">
                  {student.fullName}
                </h5>
                <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[9.5px]">
                  <div>
                    <span className="text-slate-400 font-medium">Adm No:</span>{' '}
                    <span className="font-bold text-primary-600 dark:text-primary-400">{student.admissionNo}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Roll:</span>{' '}
                    <span className="font-semibold">{student.rollNo || 'N/A'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 font-medium">Class:</span>{' '}
                    <span className="font-semibold">{className} {student.section ? `(${student.section})` : ''}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Blood:</span>{' '}
                    <span className="font-bold text-rose-500">{student.bloodGroup || 'O+'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">DOB:</span>{' '}
                    <span className="font-medium">{student.dob || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Strip */}
            <div className="bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-[8.5px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 font-medium">
                <Phone size={10} className="text-primary-500" /> +91 94720 00000
              </span>
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Principal Sign: <span className="underline font-serif italic text-primary-600">H. Aisha</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Generating <strong className="text-slate-800 dark:text-slate-200">{targetStudents.length}</strong> card(s) formatted for high-resolution print.
          </p>
          <div className="flex gap-3">
            <GlassButton type="button" variant="ghost" onClick={onClose}>
              Cancel
            </GlassButton>
            <GlassButton
              type="button"
              variant="primary"
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-indigo-600 text-white"
            >
              <Download size={16} /> Download Printable ID Cards PDF
            </GlassButton>
          </div>
        </div>
      </div>
    </GlassModal>
  );
};
