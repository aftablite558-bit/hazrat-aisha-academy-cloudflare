import React, { useState } from 'react';
import { GlassModal } from '../../common/GlassModal';
import { GlassButton } from '../../common/GlassButton';
import { GlassInput } from '../../common/GlassInput';
import { GlassSelect } from '../../common/GlassSelect';
import { Student, Class } from '../../../types/master';
import {
  generateTransferCertificatePDF,
  generateBonafideCertificatePDF,
  generateCharacterCertificatePDF,
  TCDetails,
  BonafideDetails,
  CharacterDetails
} from '../../../utils/studentPdfUtils';
import { SCHOOL_INFO } from '../../../utils/financeUtils';
import { Award, FileText, Download, Printer, ShieldCheck } from 'lucide-react';

interface StudentCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  classes: Class[];
}

type CertType = 'TC' | 'Bonafide' | 'Character';

export const StudentCertificateModal: React.FC<StudentCertificateModalProps> = ({
  isOpen,
  onClose,
  student,
  classes
}) => {
  const [certType, setCertType] = useState<CertType>('TC');
  const className = classes.find(c => c.id === student.classId)?.className || student.classId || 'Class 1';

  // TC State
  const [tcData, setTcData] = useState<TCDetails>({
    tcNumber: `HAA-TC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    issueDate: new Date().toISOString().slice(0, 10),
    dateOfLeaving: new Date().toISOString().slice(0, 10),
    reasonForLeaving: 'Parent Transfer / Higher Studies',
    conduct: 'Exemplary & Outstanding',
    promotedToNextClass: 'Yes (Qualified for Higher Class)',
    feesPaidUpTo: 'March 2026',
    totalWorkingDays: '210 Days',
    totalDaysPresent: '195 Days',
    remarks: 'Dues cleared. Student has no pending liabilities.'
  });

  // Bonafide State
  const [bonafideData, setBonafideData] = useState<BonafideDetails>({
    certNumber: `HAA-BON-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    issueDate: new Date().toISOString().slice(0, 10),
    purpose: 'Official Documentation & Scholarship Application',
    academicSession: student.academicSession || '2026-2027'
  });

  // Character State
  const [characterData, setCharacterData] = useState<CharacterDetails>({
    certNumber: `HAA-CHR-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    issueDate: new Date().toISOString().slice(0, 10),
    academicSession: student.academicSession || '2026-2027',
    conductRating: 'EXEMPLARY & COMMENDABLE',
    participation: 'Active participant in school assemblies, academic debates, and sports events.',
    remarks: 'Possesses pleasant demeanor and respectful attitude towards elders and teachers.'
  });

  const handleGeneratePDF = () => {
    if (certType === 'TC') {
      generateTransferCertificatePDF(student, tcData, className);
    } else if (certType === 'Bonafide') {
      generateBonafideCertificatePDF(student, bonafideData, className);
    } else if (certType === 'Character') {
      generateCharacterCertificatePDF(student, characterData, className);
    }
  };

  const handlePrint = () => {
    handleGeneratePDF();
  };

  return (
    <GlassModal isOpen={isOpen} onClose={onClose} title="Student Certificate Generator" className="max-w-4xl">
      <div className="space-y-6">
        {/* Certificate Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80">
          <button
            type="button"
            onClick={() => setCertType('TC')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              certType === 'TC'
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <FileText size={15} /> Transfer Certificate (TC)
          </button>

          <button
            type="button"
            onClick={() => setCertType('Bonafide')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              certType === 'Bonafide'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <ShieldCheck size={15} /> Bonafide Certificate
          </button>

          <button
            type="button"
            onClick={() => setCertType('Character')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              certType === 'Character'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Award size={15} /> Character & Conduct
          </button>
        </div>

        {/* Student Info Bar */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex flex-wrap justify-between items-center gap-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{student.fullName}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Adm No: <span className="font-semibold text-primary-500">{student.admissionNo}</span> • Class: {className} {student.section ? `(${student.section})` : ''} • Roll: {student.rollNo || 'N/A'}
            </p>
          </div>
          <div className="text-xs text-right text-slate-500 dark:text-slate-400">
            Father: <span className="font-semibold text-slate-700 dark:text-slate-300">{student.fatherName || 'N/A'}</span>
          </div>
        </div>

        {/* Form Controls by Certificate Type */}
        {certType === 'TC' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <GlassInput
              label="TC Serial Number"
              value={tcData.tcNumber}
              onChange={(e) => setTcData(prev => ({ ...prev, tcNumber: e.target.value }))}
            />
            <GlassInput
              type="date"
              label="Issue Date"
              value={tcData.issueDate}
              onChange={(e) => setTcData(prev => ({ ...prev, issueDate: e.target.value }))}
            />
            <GlassInput
              type="date"
              label="Date of Leaving School"
              value={tcData.dateOfLeaving}
              onChange={(e) => setTcData(prev => ({ ...prev, dateOfLeaving: e.target.value }))}
            />
            <GlassInput
              label="Reason for Leaving"
              value={tcData.reasonForLeaving}
              onChange={(e) => setTcData(prev => ({ ...prev, reasonForLeaving: e.target.value }))}
            />
            <GlassInput
              label="General Conduct / Character"
              value={tcData.conduct}
              onChange={(e) => setTcData(prev => ({ ...prev, conduct: e.target.value }))}
            />
            <GlassInput
              label="Qualified for Promotion?"
              value={tcData.promotedToNextClass}
              onChange={(e) => setTcData(prev => ({ ...prev, promotedToNextClass: e.target.value }))}
            />
            <GlassInput
              label="School Dues Paid Up To"
              value={tcData.feesPaidUpTo}
              onChange={(e) => setTcData(prev => ({ ...prev, feesPaidUpTo: e.target.value }))}
            />
            <div className="grid grid-cols-2 gap-2">
              <GlassInput
                label="Total Working Days"
                value={tcData.totalWorkingDays}
                onChange={(e) => setTcData(prev => ({ ...prev, totalWorkingDays: e.target.value }))}
              />
              <GlassInput
                label="Total Present Days"
                value={tcData.totalDaysPresent}
                onChange={(e) => setTcData(prev => ({ ...prev, totalDaysPresent: e.target.value }))}
              />
            </div>
            <div className="md:col-span-2">
              <GlassInput
                label="Additional Remarks"
                value={tcData.remarks}
                onChange={(e) => setTcData(prev => ({ ...prev, remarks: e.target.value }))}
              />
            </div>
          </div>
        )}

        {certType === 'Bonafide' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <GlassInput
              label="Certificate Reference No"
              value={bonafideData.certNumber}
              onChange={(e) => setBonafideData(prev => ({ ...prev, certNumber: e.target.value }))}
            />
            <GlassInput
              type="date"
              label="Issue Date"
              value={bonafideData.issueDate}
              onChange={(e) => setBonafideData(prev => ({ ...prev, issueDate: e.target.value }))}
            />
            <GlassInput
              label="Academic Session"
              value={bonafideData.academicSession}
              onChange={(e) => setBonafideData(prev => ({ ...prev, academicSession: e.target.value }))}
            />
            <GlassInput
              label="Purpose of Certificate"
              value={bonafideData.purpose}
              onChange={(e) => setBonafideData(prev => ({ ...prev, purpose: e.target.value }))}
            />
          </div>
        )}

        {certType === 'Character' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <GlassInput
              label="Certificate Reference No"
              value={characterData.certNumber}
              onChange={(e) => setCharacterData(prev => ({ ...prev, certNumber: e.target.value }))}
            />
            <GlassInput
              type="date"
              label="Issue Date"
              value={characterData.issueDate}
              onChange={(e) => setCharacterData(prev => ({ ...prev, issueDate: e.target.value }))}
            />
            <GlassInput
              label="Academic Session"
              value={characterData.academicSession}
              onChange={(e) => setCharacterData(prev => ({ ...prev, academicSession: e.target.value }))}
            />
            <GlassInput
              label="Conduct Rating"
              value={characterData.conductRating}
              onChange={(e) => setCharacterData(prev => ({ ...prev, conductRating: e.target.value }))}
            />
            <div className="md:col-span-2">
              <GlassInput
                label="Co-Curricular Participation Note"
                value={characterData.participation}
                onChange={(e) => setCharacterData(prev => ({ ...prev, participation: e.target.value }))}
              />
            </div>
            <div className="md:col-span-2">
              <GlassInput
                label="Additional Observations"
                value={characterData.remarks}
                onChange={(e) => setCharacterData(prev => ({ ...prev, remarks: e.target.value }))}
              />
            </div>
          </div>
        )}

        {/* Certificate Visual Preview Box */}
        <div className="p-6 rounded-3xl bg-amber-50/40 dark:bg-slate-900/60 border-2 border-dashed border-amber-300 dark:border-amber-900/50 space-y-4">
          <div className="text-center border-b border-amber-200/60 dark:border-slate-800 pb-3">
            <h3 className="text-base font-extrabold text-amber-900 dark:text-amber-400 tracking-wide uppercase">
              {SCHOOL_INFO.name}
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">{SCHOOL_INFO.address}</p>
            <span className="inline-block mt-2 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500 text-white">
              {certType === 'TC' && 'Official Transfer Certificate Preview'}
              {certType === 'Bonafide' && 'Bonafide Student Certificate Preview'}
              {certType === 'Character' && 'Character & Conduct Certificate Preview'}
            </span>
          </div>

          <div className="text-xs text-slate-800 dark:text-slate-200 space-y-2 leading-relaxed">
            <p>
              Certified that <strong className="text-amber-700 dark:text-amber-400">{student.fullName}</strong> (Adm No: {student.admissionNo}), Son/Daughter of <strong>{student.fatherName || 'N/A'}</strong>, is a registered student studying in <strong>{className}</strong> at Hazrat Aisha Academy.
            </p>
            {certType === 'TC' && (
              <p className="italic text-slate-600 dark:text-slate-400">
                Reason for leaving: "{tcData.reasonForLeaving}". General Conduct: "{tcData.conduct}". Qualified for promotion: {tcData.promotedToNextClass}.
              </p>
            )}
            {certType === 'Bonafide' && (
              <p className="italic text-slate-600 dark:text-slate-400">
                Issued for the purpose of: "{bonafideData.purpose}".
              </p>
            )}
            {certType === 'Character' && (
              <p className="italic text-slate-600 dark:text-slate-400">
                Conduct rating: "{characterData.conductRating}". Co-curricular activity: "{characterData.participation}".
              </p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <GlassButton type="button" variant="ghost" onClick={onClose}>
            Cancel
          </GlassButton>
          <GlassButton
            type="button"
            variant="primary"
            onClick={handleGeneratePDF}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white"
          >
            <Download size={16} /> Download Certificate PDF
          </GlassButton>
        </div>
      </div>
    </GlassModal>
  );
};
