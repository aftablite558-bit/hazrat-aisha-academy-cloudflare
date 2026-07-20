import { useMemo, useState, useEffect } from 'react';
import { GlassSelect } from '../../common/GlassSelect';
import { GlassInput } from '../../common/GlassInput';
import { useMasterData } from '../../../hooks/useMasterData';
import { Class, Student } from '../../../types/master';

export const StudentLookup = ({ onStudentSelect }: { onStudentSelect: (student: Student | null) => void }) => {
  const { data: classes } = useMasterData<Class>('classes');
  const { data: students } = useMasterData<Student>('students');
  const [classId, setClassId] = useState('');
  const [rollNo, setRollNo] = useState('');

  const filteredStudents = useMemo(() => students.filter(s => s.classId === classId), [students, classId]);
  
  const selectedStudent = useMemo(() => filteredStudents.find(s => s.rollNo === rollNo), [filteredStudents, rollNo]);
  
  useEffect(() => {
    onStudentSelect(selectedStudent || null);
  }, [selectedStudent, onStudentSelect]);

  return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassSelect 
          label="Class" 
          value={classId} 
          onChange={e => {setClassId(e.target.value); setRollNo('');}}
          options={classes.map(c => ({ label: c.className || (c as any).name, value: c.id }))}
        />
        <GlassSelect 
          label="Roll Number" 
          value={rollNo} 
          onChange={e => setRollNo(e.target.value)} 
          disabled={!classId}
          options={filteredStudents.map(s => ({ label: s.rollNo, value: s.rollNo }))}
        />
        <GlassInput label="Student Name" value={selectedStudent?.fullName || ''} disabled />
      </div>
  );
};
