import { useState, useMemo, useEffect } from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { GlassCard } from '../../../components/common/GlassCard';
import { GlassButton } from '../../../components/common/GlassButton';
import { GlassSelect } from '../../../components/common/GlassSelect';
import { GlassBadge } from '../../../components/common/GlassBadge';
import { useMasterData } from '../../../hooks/useMasterData';
import { useToast } from '../../../contexts/ToastContext';
import { Class, Section, Student, Subject } from '../../../types/master';
import { ExamMark, Result } from '../../../types/academic';
import { Save, CheckCircle, XCircle } from 'lucide-react';

export const Results = () => {
  const { data: classes } = useMasterData<Class>('classes', true);
  const { data: sections } = useMasterData<Section>('sections', true);
  const { data: students } = useMasterData<Student>('students', true);
  const { data: subjects } = useMasterData<Subject>('subjects', true);
  const { data: examMarks } = useMasterData<ExamMark>('exam_marks', true);
  const { data: results, fetchData, addRecord, updateRecord } = useMasterData<Result>('results', true);
  const { addToast } = useToast();

  const [examName, setExamName] = useState('');
  const [classId, setClassId] = useState('');
  const [sectionId, setSectionId] = useState('');

  const [calculatedResults, setCalculatedResults] = useState<Record<string, Omit<Result, 'id' | 'createdAt' | 'updatedAt'>>>({});
  const [existingResults, setExistingResults] = useState<Record<string, Result>>({});

  const filteredStudents = useMemo(() => {
    if (!classId || !sectionId) return [];
    return students.filter(s => s.classId === classId && s.sectionId === sectionId);
  }, [students, classId, sectionId]);

  // Unique exam names from examMarks for the selected class/section to populate dropdown (or just let user type)
  const availableExams = useMemo(() => {
    const exams = new Set<string>();
    examMarks.forEach(m => {
      if (m.classId === classId && m.sectionId === sectionId) {
        exams.add(m.examName);
      }
    });
    return Array.from(exams);
  }, [examMarks, classId, sectionId]);

  useEffect(() => {
    if (filteredStudents.length > 0 && examName) {
      const recordsMap: Record<string, Result> = {};
      results.forEach(res => {
        if (res.examName === examName && res.classId === classId && res.sectionId === sectionId) {
          recordsMap[res.studentId] = res;
        }
      });
      setExistingResults(recordsMap);

      const calcMap: Record<string, Omit<Result, 'id' | 'createdAt' | 'updatedAt'>> = {};
      
      filteredStudents.forEach(student => {
        const studentMarks = examMarks.filter(m => m.studentId === student.id && m.examName === examName);
        if (studentMarks.length > 0) {
          const totalMarks = studentMarks.reduce((sum, m) => sum + m.maxMarks, 0);
          const obtainedMarks = studentMarks.reduce((sum, m) => sum + m.obtainedMarks, 0);
          const percentage = totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0;
          
          let grade = 'F';
          if (percentage >= 90) grade = 'A+';
          else if (percentage >= 80) grade = 'A';
          else if (percentage >= 70) grade = 'B';
          else if (percentage >= 60) grade = 'C';
          else if (percentage >= 50) grade = 'D';

          const status = percentage >= 40 ? 'Pass' : 'Fail';

          calcMap[student.id] = {
            examName,
            classId,
            sectionId,
            studentId: student.id,
            totalMarks,
            obtainedMarks,
            percentage,
            grade,
            status,
            isPublished: recordsMap[student.id]?.isPublished || false
          };
        }
      });

      setCalculatedResults(calcMap);
    } else {
      setCalculatedResults({});
      setExistingResults({});
    }
  }, [filteredStudents, examName, classId, sectionId, examMarks, results]);

  const handleSaveResults = async () => {
    try {
      for (const student of filteredStudents) {
        const calcData = calculatedResults[student.id];
        if (!calcData) continue; // No marks found for student

        const existing = existingResults[student.id];
        if (existing) {
          await updateRecord(existing.id, calcData);
        } else {
          await addRecord(calcData);
        }
      }
      await fetchData();
      addToast('Results generated and saved successfully', 'success');
    } catch (error) {
      console.error(error);
    }
  };

  const handleTogglePublish = async (studentId: string, isPublished: boolean) => {
    const existing = existingResults[studentId];
    if (existing) {
      await updateRecord(existing.id, { isPublished });
      await fetchData();
    } else {
      addToast('Please save results before publishing', 'error');
    }
  };

  const handlePublishAll = async (publish: boolean) => {
    try {
      for (const student of filteredStudents) {
        const existing = existingResults[student.id];
        if (existing && existing.isPublished !== publish) {
          await updateRecord(existing.id, { isPublished: publish });
        }
      }
      await fetchData();
      addToast(`All results ${publish ? 'published' : 'unpublished'} successfully`, 'success');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Results Generator" description="Generate and publish exam results." />
      
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassSelect label="Class" value={classId} onChange={e => setClassId(e.target.value)}>
            <option value="">Select Class</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.className}</option>)}
          </GlassSelect>
          <GlassSelect label="Section" value={sectionId} onChange={e => setSectionId(e.target.value)}>
            <option value="">Select Section</option>
            {sections.filter(s => s.classId === classId).map(s => <option key={s.id} value={s.id}>{s.sectionName}</option>)}
          </GlassSelect>
          <GlassSelect label="Exam" value={examName} onChange={e => setExamName(e.target.value)}>
            <option value="">Select Exam</option>
            {availableExams.map(ex => <option key={ex} value={ex}>{ex}</option>)}
          </GlassSelect>
        </div>
      </GlassCard>

      {examName && classId && sectionId && filteredStudents.length > 0 && (
        <GlassCard className="p-0 overflow-hidden">
          <div className="p-4 border-b border-white/10 flex flex-wrap justify-between items-center gap-4 bg-white/5">
            <h3 className="font-semibold text-lg">Calculated Results</h3>
            <div className="flex gap-2">
              <GlassButton variant="ghost" className="text-xs py-1 px-3 text-secondary-500" onClick={() => handlePublishAll(true)}>
                Publish All
              </GlassButton>
              <GlassButton variant="ghost" className="text-xs py-1 px-3 text-rose-500" onClick={() => handlePublishAll(false)}>
                Unpublish All
              </GlassButton>
              <GlassButton variant="primary" className="text-sm py-1.5 px-4 flex items-center gap-2" onClick={handleSaveResults}>
                <Save size={16} /> Save Results
              </GlassButton>
            </div>
          </div>
          
          <div className="overflow-x-auto w-full custom-scrollbar max-h-[600px]">
            <table className="w-full text-left border-collapse glass-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th>Total Marks</th>
                  <th>Obtained</th>
                  <th>%</th>
                  <th>Grade</th>
                  <th>Status</th>
                  <th>Published</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map(student => {
                  const res = calculatedResults[student.id];
                  if (!res) {
                    return (
                      <tr key={student.id}>
                        <td>{student.rollNo}</td>
                        <td className="font-medium text-foreground">{student.fullName}</td>
                        <td colSpan={7} className="text-muted-foreground text-sm">No marks entered for this exam</td>
                      </tr>
                    );
                  }
                  
                  return (
                    <tr key={student.id}>
                      <td>{student.rollNo}</td>
                      <td className="font-medium text-foreground">{student.fullName}</td>
                      <td>{res.totalMarks}</td>
                      <td className="font-bold text-primary-500">{res.obtainedMarks}</td>
                      <td>{res.percentage.toFixed(1)}%</td>
                      <td className="font-bold">{res.grade}</td>
                      <td>
                        <GlassBadge variant={res.status === 'Pass' ? 'success' : 'danger'}>
                          {res.status}
                        </GlassBadge>
                      </td>
                      <td>
                        <GlassBadge variant={res.isPublished ? 'success' : 'default'}>
                          {res.isPublished ? 'Yes' : 'No'}
                        </GlassBadge>
                      </td>
                      <td>
                        <div className="flex justify-end gap-2">
                          <button 
                            className="p-2 hover:bg-white/10 rounded-full text-secondary-500 transition-colors" 
                            onClick={() => handleTogglePublish(student.id, !res.isPublished)}
                            title={res.isPublished ? "Unpublish" : "Publish"}
                          >
                            {res.isPublished ? <XCircle size={18} /> : <CheckCircle size={18} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {classId && sectionId && filteredStudents.length === 0 && (
        <GlassCard className="p-8 text-center">
          <p className="text-muted-foreground">No students found in this class and section.</p>
        </GlassCard>
      )}
    </div>
  );
};
