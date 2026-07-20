import { useMemo, useState, useEffect } from 'react';
import { GlassSelect } from '../../common/GlassSelect';
import { GlassInput } from '../../common/GlassInput';
import { useMasterData } from '../../../hooks/useMasterData';
import { Class, Student } from '../../../types/master';

export const StudentLookup = ({ onStudentSelect }: { onStudentSelect: (student: Student | null) => void }) => {
  const { data: classes } = useMasterData<Class>('classes', true);
  const { data: students } = useMasterData<Student>('students', true);
  const [classId, setClassId] = useState('');
  const [rollNo, setRollNo] = useState('');

  const filteredStudents = useMemo(() => students.filter(s => s.classId === classId), [students, classId]);
  
  const selectedStudent = useMemo(() => filteredStudents.find(s => s.rollNo === rollNo), [filteredStudents, rollNo]);
  
  useEffect(() => {
    onStudentSelect(selectedStudent || null);
  }, [selectedStudent, onStudentSelect]);

  return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassSelect label="Class" value={classId} onChange={e => {setClassId(e.target.value); setRollNo('');}}>
            <option value="">Select Class</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.className}</option>)}
        </GlassSelect>
        <GlassSelect label="Roll Number" value={rollNo} onChange={e => setRollNo(e.target.value)} disabled={!classId}>
            <option value="">Select Roll No</option>
            {filteredStudents.map(s => <option key={s.id} value={s.rollNo}>{s.rollNo}</option>)}
        </GlassSelect>
        <GlassInput label="Student Name" value={selectedStudent?.fullName || ''} disabled />
      </div>
  );
};
