import { useState, useMemo, useEffect } from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { GlassCard } from '../../../components/common/GlassCard';
import { GlassButton } from '../../../components/common/GlassButton';
import { GlassSelect } from '../../../components/common/GlassSelect';
import { GlassInput } from '../../../components/common/GlassInput';
import { useMasterData } from '../../../hooks/useMasterData';
import { useToast } from '../../../contexts/ToastContext';
import { Class, Section, Subject, Student } from '../../../types/master';
import { ExamMark } from '../../../types/academic';
import { Save } from 'lucide-react';

export const ExamMarks = () => {
  const { data: classes } = useMasterData<Class>('classes');
  const { data: sections } = useMasterData<Section>('sections');
  const { data: subjects } = useMasterData<Subject>('subjects');
  const { data: students } = useMasterData<Student>('students');
  const { data: examMarks, fetchData, addRecord, updateRecord } = useMasterData<ExamMark>('exam_marks');
  const { addToast } = useToast();

  const [examName, setExamName] = useState('');
  const [classId, setClassId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [maxMarks, setMaxMarks] = useState<number>(100);

  const [marksData, setMarksData] = useState<Record<string, { obtainedMarks: number | '', grade: string, remarks: string }>>({});
  const [existingRecords, setExistingRecords] = useState<Record<string, ExamMark>>({});

  const filteredStudents = useMemo(() => {
    if (!classId || !sectionId) return [];
    return students.filter(s => s.classId === classId && s.sectionId === sectionId);
  }, [students, classId, sectionId]);

  useEffect(() => {
    if (filteredStudents.length > 0 && examName && subjectId) {
      const recordsMap: Record<string, ExamMark> = {};
      const dataMap: Record<string, { obtainedMarks: number | '', grade: string, remarks: string }> = {};

      examMarks.forEach(mark => {
        if (mark.examName === examName && mark.classId === classId && mark.sectionId === sectionId && mark.subjectId === subjectId) {
          recordsMap[mark.studentId] = mark;
          dataMap[mark.studentId] = {
            obtainedMarks: mark.obtainedMarks,
            grade: mark.grade,
            remarks: mark.remarks
          };
        }
      });

      setExistingRecords(recordsMap);

      filteredStudents.forEach(student => {
        if (!dataMap[student.id]) {
          dataMap[student.id] = { obtainedMarks: '', grade: '', remarks: '' };
        }
      });

      setMarksData(dataMap);
    } else {
      setMarksData({});
      setExistingRecords({});
    }
  }, [filteredStudents, examMarks, examName, classId, sectionId, subjectId]);

  const handleDataChange = (studentId: string, field: 'obtainedMarks' | 'grade' | 'remarks', value: any) => {
    setMarksData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    if (!examName || !classId || !sectionId || !subjectId) {
      addToast('Please fill all required fields before saving', 'error');
      return;
    }

    try {
      for (const student of filteredStudents) {
        const data = marksData[student.id];
        if (data.obtainedMarks === '') continue; // Skip if no marks entered

        const existing = existingRecords[student.id];
        const recordToSave = {
          examName,
          classId,
          sectionId,
          subjectId,
          studentId: student.id,
          maxMarks,
          obtainedMarks: Number(data.obtainedMarks),
          grade: data.grade,
          remarks: data.remarks
        };

        if (existing) {
          await updateRecord(existing.id, recordToSave);
        } else {
          await addRecord(recordToSave);
        }
      }
      await fetchData();
      addToast('Exam marks saved successfully', 'success');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Exam Marks" subtitle="Record student performance and grades." />
      
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <GlassInput 
            label="Exam Name" 
            placeholder="e.g. Mid Term"
            value={examName} 
            onChange={e => setExamName(e.target.value)} 
          />
          <GlassSelect label="Class" value={classId} onChange={e => setClassId(e.target.value)}>
            <option value="">Select Class</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.className}</option>)}
          </GlassSelect>
          <GlassSelect label="Section" value={sectionId} onChange={e => setSectionId(e.target.value)}>
            <option value="">Select Section</option>
            {sections.filter(s => s.classId === classId).map(s => <option key={s.id} value={s.id}>{s.sectionName}</option>)}
          </GlassSelect>
          <GlassSelect label="Subject" value={subjectId} onChange={e => setSubjectId(e.target.value)}>
            <option value="">Select Subject</option>
            {subjects.filter(s => s.classId === classId).map(s => <option key={s.id} value={s.id}>{s.subjectName}</option>)}
          </GlassSelect>
          <GlassInput 
            type="number" 
            label="Max Marks" 
            value={maxMarks} 
            onChange={e => setMaxMarks(Number(e.target.value))} 
          />
        </div>
      </GlassCard>

      {examName && subjectId && classId && sectionId && filteredStudents.length > 0 && (
        <GlassCard className="p-0 overflow-hidden">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
            <h3 className="font-semibold text-lg">Enter Marks</h3>
            <GlassButton variant="primary" className="text-sm py-1.5 px-4 flex items-center gap-2" onClick={handleSave}>
              <Save size={16} /> Save Marks
            </GlassButton>
          </div>
          
          <div className="overflow-x-auto w-full custom-scrollbar max-h-[600px]">
            <table className="w-full text-left border-collapse glass-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th>Obtained Marks</th>
                  <th>Grade</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map(student => (
                  <tr key={student.id}>
                    <td>{student.rollNo}</td>
                    <td className="font-medium text-foreground">{student.fullName}</td>
                    <td>
                      <GlassInput 
                        type="number"
                        placeholder="Marks"
                        value={marksData[student.id]?.obtainedMarks ?? ''}
                        onChange={(e) => handleDataChange(student.id, 'obtainedMarks', e.target.value)}
                        className="w-24 h-8 text-sm"
                        max={maxMarks}
                      />
                    </td>
                    <td>
                      <GlassInput 
                        placeholder="e.g. A+"
                        value={marksData[student.id]?.grade || ''}
                        onChange={(e) => handleDataChange(student.id, 'grade', e.target.value)}
                        className="w-20 h-8 text-sm"
                      />
                    </td>
                    <td>
                      <GlassInput 
                        placeholder="Optional remarks"
                        value={marksData[student.id]?.remarks || ''}
                        onChange={(e) => handleDataChange(student.id, 'remarks', e.target.value)}
                        className="w-full h-8 text-sm"
                      />
                    </td>
                  </tr>
                ))}
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
