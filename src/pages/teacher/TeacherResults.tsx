import React, { useState, useMemo, useEffect } from 'react';
import { useCurrentTeacher } from '../../hooks/useCurrentTeacher';
import { useMasterData } from '../../hooks/useMasterData';
import { useToast } from '../../contexts/ToastContext';

import { PageHeader } from '../../components/common/PageHeader';
import { GlassCard } from '../../components/common/GlassCard';
import { GlassButton } from '../../components/common/GlassButton';
import { GlassSelect } from '../../components/common/GlassSelect';
import { GlassBadge } from '../../components/common/GlassBadge';
import { GlassInput } from '../../components/common/GlassInput';
import { BackButton } from '../../components/common/BackButton';

import { Student, ExamSchedule } from '../../types/master';
import { ExamMark, Result } from '../../types/academic';

import {
  Award,
  Save,
  CheckCircle2,
  FileCheck,
  Search,
  Check,
  AlertCircle,
  HelpCircle,
  Eye,
  Send,
} from 'lucide-react';

export const TeacherResults: React.FC = () => {
  const { assignedClasses, assignedSubjects, isLoading } = useCurrentTeacher();
  const { data: students } = useMasterData<Student>('students');
  const { data: exams } = useMasterData<ExamSchedule>('exam_schedules');
  const { data: examMarks, addRecord: addMark, updateRecord: updateMark, fetchData: fetchMarks } = useMasterData<ExamMark>('exam_marks');
  const { data: results, addRecord: addResult, updateRecord: updateResult, fetchData: fetchResults } = useMasterData<Result>('results');

  const { addToast } = useToast();

  const [classId, setClassId] = useState<string>('');
  const [subjectId, setSubjectId] = useState<string>('');
  const [examName, setExamName] = useState<string>('Mid-Term Examination 2026');
  const [maxMarks, setMaxMarks] = useState<number>(100);

  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Map of studentId -> obtainedMarks (number)
  const [marksData, setMarksData] = useState<Record<string, number>>({});
  // Map of studentId -> remarks (string)
  const [remarksData, setRemarksData] = useState<Record<string, string>>({});

  // Auto select first assigned class & subject
  useEffect(() => {
    if (assignedClasses.length > 0 && !classId) {
      setClassId(assignedClasses[0].id);
    }
  }, [assignedClasses, classId]);

  useEffect(() => {
    if (assignedSubjects.length > 0 && !subjectId) {
      setSubjectId(assignedSubjects[0].id);
    }
  }, [assignedSubjects, subjectId]);

  // Students belonging to selected assigned class
  const classStudents = useMemo(() => {
    if (!classId) return [];
    return students.filter((s) => s.classId === classId);
  }, [students, classId]);

  // Load existing marks for selected class, subject, exam
  useEffect(() => {
    if (classStudents.length > 0 && classId && subjectId && examName) {
      const existingMarks = examMarks.filter(
        (m) => m.classId === classId && m.subjectId === subjectId && m.examName === examName
      );

      const mData: Record<string, number> = {};
      const rData: Record<string, string> = {};

      existingMarks.forEach((m) => {
        mData[m.studentId] = m.obtainedMarks;
        rData[m.studentId] = m.remarks || '';
      });

      classStudents.forEach((s) => {
        if (mData[s.id] === undefined) {
          mData[s.id] = 0;
          rData[s.id] = '';
        }
      });

      setMarksData(mData);
      setRemarksData(rData);
    }
  }, [classStudents, examMarks, classId, subjectId, examName]);

  // Helper Auto Grade Calculator
  const calculateGrade = (obtained: number, max: number): { grade: string; status: 'Pass' | 'Fail'; percentage: number } => {
    const percentage = max > 0 ? Math.round((obtained / max) * 100) : 0;
    let grade = 'F';
    let status: 'Pass' | 'Fail' = 'Fail';

    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 80) grade = 'A';
    else if (percentage >= 70) grade = 'B';
    else if (percentage >= 60) grade = 'C';
    else if (percentage >= 50) grade = 'D';

    if (percentage >= 40) status = 'Pass';

    return { grade, status, percentage };
  };

  const handleMarkChange = (studentId: string, val: string) => {
    const num = Math.min(maxMarks, Math.max(0, Number(val) || 0));
    setMarksData((prev) => ({ ...prev, [studentId]: num }));
  };

  const handleRemarkChange = (studentId: string, val: string) => {
    setRemarksData((prev) => ({ ...prev, [studentId]: val }));
  };

  // Save Draft / Publish Handler
  const handleSaveMarks = async (publish: boolean) => {
    if (!classId || !subjectId || !examName) {
      addToast('Please select class, subject, and exam', 'error');
      return;
    }

    setIsSaving(true);
    try {
      for (const student of classStudents) {
        const obtained = marksData[student.id] || 0;
        const remarks = remarksData[student.id] || '';
        const { grade, status, percentage } = calculateGrade(obtained, maxMarks);

        // Check if mark record exists
        const existingMarkRecord = examMarks.find(
          (m) =>
            m.studentId === student.id &&
            m.classId === classId &&
            m.subjectId === subjectId &&
            m.examName === examName
        );

        if (existingMarkRecord) {
          await updateMark(existingMarkRecord.id, {
            obtainedMarks: obtained,
            maxMarks,
            grade,
            remarks,
          });
        } else {
          await addMark({
            examName,
            studentId: student.id,
            classId,
            subjectId,
            maxMarks,
            obtainedMarks: obtained,
            grade,
            remarks,
          });
        }

        // Also update / create corresponding Result record
        const existingResult = results.find(
          (r) => r.studentId === student.id && r.classId === classId && r.examName === examName
        );

        if (existingResult) {
          await updateResult(existingResult.id, {
            obtainedMarks: obtained,
            totalMarks: maxMarks,
            percentage,
            grade,
            status,
            isPublished: publish,
            isDraft: !publish,
          });
        } else {
          await addResult({
            examName,
            studentId: student.id,
            classId,
            subjectId,
            totalMarks: maxMarks,
            obtainedMarks: obtained,
            percentage,
            grade,
            status,
            isPublished: publish,
            isDraft: !publish,
          });
        }
      }

      await fetchMarks();
      await fetchResults();

      addToast(
        publish ? 'Marks & Results published successfully!' : 'Draft marks saved successfully!',
        'success'
      );
    } catch (err) {
      console.error(err);
      addToast('Failed to save exam marks', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Filtered student list by search
  const filteredStudents = useMemo(() => {
    return classStudents.filter(
      (s) =>
        (s.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.rollNo || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [classStudents, searchTerm]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground animate-pulse">Loading Result Entry Module...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex justify-start mb-[-1.5rem] relative z-20">
        <BackButton />
      </div>

      <PageHeader
        title="Subject Marks & Result Entry"
        description="Enter exam marks, automatic grade calculation, pass/fail evaluation, and publish report cards."
      />

      {/* Control Panel: Class, Subject, Exam Name, Max Marks */}
      <GlassCard className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <GlassSelect
            label="Assigned Class"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            options={assignedClasses.map((c) => ({
              label: `Class ${c.className}`,
              value: c.id,
            }))}
          />

          <GlassSelect
            label="Assigned Subject"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            options={assignedSubjects.map((s) => ({
              label: s.subjectName,
              value: s.id,
            }))}
          />

          <GlassSelect
            label="Exam Term"
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
            options={[
              { label: 'Mid-Term Examination 2026', value: 'Mid-Term Examination 2026' },
              { label: 'Annual Examination 2026', value: 'Annual Examination 2026' },
              { label: 'Quarterly Assessment', value: 'Quarterly Assessment' },
              { label: 'First Unit Test', value: 'First Unit Test' },
            ]}
          />

          <GlassInput
            label="Maximum Marks"
            type="number"
            value={maxMarks}
            onChange={(e) => setMaxMarks(Number(e.target.value) || 100)}
          />
        </div>
      </GlassCard>

      {/* Roster & Marks Entry Table */}
      {classStudents.length > 0 ? (
        <GlassCard className="p-0 overflow-hidden">
          <div className="p-4 border-b border-white/10 flex flex-wrap justify-between items-center gap-4 bg-white/5">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <GlassInput
                placeholder="Search student..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>

            <div className="flex gap-2 items-center w-full sm:w-auto justify-end">
              <GlassButton
                variant="ghost"
                className="text-xs font-semibold flex items-center gap-2"
                onClick={() => handleSaveMarks(false)}
                disabled={isSaving}
              >
                <Save size={16} /> Save Draft
              </GlassButton>

              <GlassButton
                variant="primary"
                className="text-xs font-bold flex items-center gap-2 px-5 py-2"
                onClick={() => handleSaveMarks(true)}
                disabled={isSaving}
              >
                <Send size={16} /> {isSaving ? 'Processing...' : 'Publish Results'}
              </GlassButton>
            </div>
          </div>

          <div className="overflow-x-auto w-full custom-scrollbar">
            <table className="w-full text-left border-collapse glass-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th>Marks Obtained (Max {maxMarks})</th>
                  <th>Percentage</th>
                  <th>Grade</th>
                  <th>Pass/Fail</th>
                  <th>Remarks / Feedback</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((std) => {
                  const obtained = marksData[std.id] || 0;
                  const { grade, status, percentage } = calculateGrade(obtained, maxMarks);

                  return (
                    <tr key={std.id}>
                      <td className="font-bold text-primary-500">{std.rollNo || 'N/A'}</td>
                      <td>
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              std.photoUrl ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                std.fullName
                              )}&background=06b6d4&color=fff`
                            }
                            alt={std.fullName}
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-primary-500/30"
                          />
                          <span className="font-semibold text-foreground">{std.fullName}</span>
                        </div>
                      </td>
                      <td className="w-40">
                        <input
                          type="number"
                          min={0}
                          max={maxMarks}
                          value={obtained}
                          onChange={(e) => handleMarkChange(std.id, e.target.value)}
                          className="w-28 px-3 py-1.5 rounded-lg glass bg-white/10 border border-white/20 text-foreground font-extrabold text-base focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </td>
                      <td className="font-mono text-sm font-bold text-foreground">{percentage}%</td>
                      <td>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-black border ${
                            grade === 'A+' || grade === 'A'
                              ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30'
                              : grade === 'B' || grade === 'C'
                              ? 'bg-blue-500/20 text-blue-500 border-blue-500/30'
                              : grade === 'D'
                              ? 'bg-amber-500/20 text-amber-500 border-amber-500/30'
                              : 'bg-rose-500/20 text-rose-500 border-rose-500/30'
                          }`}
                        >
                          {grade}
                        </span>
                      </td>
                      <td>
                        <GlassBadge variant={status === 'Pass' ? 'success' : 'error'}>
                          {status}
                        </GlassBadge>
                      </td>
                      <td>
                        <input
                          type="text"
                          placeholder="e.g. Excellent conceptual clarity"
                          value={remarksData[std.id] || ''}
                          onChange={(e) => handleRemarkChange(std.id, e.target.value)}
                          className="w-full px-3 py-1 rounded-lg glass bg-white/5 border border-white/10 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary-500"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>
      ) : (
        <GlassCard className="p-8 text-center space-y-2">
          <p className="text-muted-foreground font-medium">No students found for the selected class.</p>
        </GlassCard>
      )}
    </div>
  );
};
