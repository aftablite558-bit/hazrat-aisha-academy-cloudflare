import React, { useState } from 'react';
import { GlassModal } from '../../common/GlassModal';
import { GlassButton } from '../../common/GlassButton';
import { GlassSelect } from '../../common/GlassSelect';
import { Student, Class, StudentPromotionRecord } from '../../../types/master';
import { GraduationCap, ArrowRight, CheckCircle2, AlertCircle, Users } from 'lucide-react';

interface StudentPromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  student?: Student | null;
  allStudents: Student[];
  classes: Class[];
  onPromoteSingle: (studentId: string, toClassId: string, toSession: string, remarks?: string) => Promise<void>;
  onPromoteBulk: (studentIds: string[], toClassId: string, toSession: string) => Promise<void>;
}

export const StudentPromotionModal: React.FC<StudentPromotionModalProps> = ({
  isOpen,
  onClose,
  student,
  allStudents,
  classes,
  onPromoteSingle,
  onPromoteBulk
}) => {
  const isSingle = Boolean(student);
  const [sourceClassId, setSourceClassId] = useState<string>(student?.classId || (classes[0]?.id || ''));
  const [targetClassId, setTargetClassId] = useState<string>('');
  const [targetSession, setTargetSession] = useState<string>('2026-2027');
  const [remarks, setRemarks] = useState<string>('Annual Promotion');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Eligible students for bulk mode
  const eligibleStudents = allStudents.filter(s => s.classId === sourceClassId && s.status === 'Active');

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudentIds(eligibleStudents.map(s => s.id));
    } else {
      setSelectedStudentIds([]);
    }
  };

  const handleToggleStudent = (id: string) => {
    setSelectedStudentIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetClassId) {
      alert('Please select a target class for promotion.');
      return;
    }

    setLoading(true);
    try {
      if (isSingle && student) {
        await onPromoteSingle(student.id, targetClassId, targetSession, remarks);
      } else {
        if (selectedStudentIds.length === 0) {
          alert('Please select at least one student to promote.');
          setLoading(false);
          return;
        }
        await onPromoteBulk(selectedStudentIds, targetClassId, targetSession);
      }
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to promote student(s).');
    } finally {
      setLoading(false);
    }
  };

  const sourceClassName = classes.find(c => c.id === (isSingle ? student?.classId : sourceClassId))?.className || 'Current Class';
  const targetClassName = classes.find(c => c.id === targetClassId)?.className || 'Select Target Class';

  return (
    <GlassModal isOpen={isOpen} onClose={onClose} title={isSingle ? `Promote Student: ${student?.fullName}` : "Bulk Student Promotion Engine"} className="max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Promotion Overview Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-indigo-200 dark:border-indigo-900/50 flex items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Source Grade</p>
            <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">{sourceClassName}</h4>
          </div>

          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
            <ArrowRight size={20} />
          </div>

          <div className="text-center sm:text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Target Grade</p>
            <h4 className="text-base font-bold text-indigo-600 dark:text-indigo-400">{targetClassName}</h4>
          </div>
        </div>

        {/* Form Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {!isSingle && (
            <GlassSelect
              label="Source Class"
              value={sourceClassId}
              onChange={(e) => {
                setSourceClassId(e.target.value);
                setSelectedStudentIds([]);
              }}
              options={classes.map(c => ({ label: c.className, value: c.id }))}
            />
          )}

          <GlassSelect
            required
            label="Target Class (Promote To)"
            value={targetClassId}
            onChange={(e) => setTargetClassId(e.target.value)}
            options={[
              { label: '-- Select Target Class --', value: '' },
              ...classes.map(c => ({ label: c.className, value: c.id }))
            ]}
          />

          <GlassSelect
            required
            label="New Academic Session"
            value={targetSession}
            onChange={(e) => setTargetSession(e.target.value)}
            options={[
              { label: '2026-2027', value: '2026-2027' },
              { label: '2027-2028', value: '2027-2028' },
              { label: '2025-2026', value: '2025-2026' }
            ]}
          />

          {isSingle && (
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Promotion Remarks</label>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="e.g. Annual exam passed with distinction"
                className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              />
            </div>
          )}
        </div>

        {/* Bulk Student Picker */}
        {!isSingle && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Users size={16} className="text-primary-500" /> Select Active Students in {sourceClassName} ({eligibleStudents.length})
              </h4>
              <label className="flex items-center gap-2 text-xs font-semibold text-primary-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={eligibleStudents.length > 0 && selectedStudentIds.length === eligibleStudents.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded text-primary-600"
                />
                Select All
              </label>
            </div>

            <div className="max-h-60 overflow-y-auto rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-2 space-y-1.5">
              {eligibleStudents.length === 0 ? (
                <p className="text-center py-6 text-xs text-slate-500 dark:text-slate-400">
                  No active students found in {sourceClassName}.
                </p>
              ) : (
                eligibleStudents.map((st) => (
                  <label
                    key={st.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-xs transition-colors cursor-pointer ${
                      selectedStudentIds.includes(st.id)
                        ? 'bg-primary-50 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-800/60'
                        : 'bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedStudentIds.includes(st.id)}
                        onChange={() => handleToggleStudent(st.id)}
                        className="rounded text-primary-600"
                      />
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{st.fullName}</span>
                        <span className="text-[10px] text-slate-500 ml-2">Adm: {st.admissionNo} • Roll: {st.rollNo}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                      {st.status}
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {!isSingle && `Selected ${selectedStudentIds.length} of ${eligibleStudents.length} student(s)`}
          </p>
          <div className="flex gap-3">
            <GlassButton type="button" variant="ghost" onClick={onClose}>
              Cancel
            </GlassButton>
            <GlassButton
              type="submit"
              variant="primary"
              disabled={loading}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
            >
              <GraduationCap size={16} />
              {loading ? 'Promoting...' : isSingle ? 'Confirm Promotion' : `Promote ${selectedStudentIds.length} Students`}
            </GlassButton>
          </div>
        </div>
      </form>
    </GlassModal>
  );
};
