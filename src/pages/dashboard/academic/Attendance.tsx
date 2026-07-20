import { useState, useMemo, useEffect } from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { GlassCard } from '../../../components/common/GlassCard';
import { GlassButton } from '../../../components/common/GlassButton';
import { GlassSelect } from '../../../components/common/GlassSelect';
import { GlassInput } from '../../../components/common/GlassInput';
import { useMasterData } from '../../../hooks/useMasterData';
import { useToast } from '../../../contexts/ToastContext';
import { Class, Section, Student } from '../../../types/master';
import { Attendance as AttendanceType, AttendanceStatus } from '../../../types/academic';
import { Check, X, Clock, Save } from 'lucide-react';

export const Attendance = () => {
  const { data: classes } = useMasterData<Class>('classes', true);
  const { data: students } = useMasterData<Student>('students', true);
  const { data: attendances, loading: attendancesLoading, addRecord, updateRecord, fetchData } = useMasterData<AttendanceType>('attendance', true);
  const { addToast } = useToast();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [classId, setClassId] = useState('');
  
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, AttendanceStatus>>({});
  const [existingRecords, setExistingRecords] = useState<Record<string, AttendanceType>>({});

  const filteredStudents = useMemo(() => {
    if (!classId) return [];
    return students.filter(s => s.classId === classId);
  }, [students, classId]);

  useEffect(() => {
    if (filteredStudents.length > 0 && date) {
      // Find existing attendance records for the selected date and class
      const recordsMap: Record<string, AttendanceType> = {};
      const statusMap: Record<string, AttendanceStatus> = {};
      
      attendances.forEach(att => {
        if (att.date === date && att.classId === classId) {
          recordsMap[att.studentId] = att;
          statusMap[att.studentId] = att.status;
        }
      });

      setExistingRecords(recordsMap);
      
      // Default to 'Present' if no record exists
      filteredStudents.forEach(student => {
        if (!statusMap[student.id]) {
          statusMap[student.id] = 'Present';
        }
      });
      
      setAttendanceRecords(statusMap);
    } else {
      setAttendanceRecords({});
      setExistingRecords({});
    }
  }, [filteredStudents, attendances, date, classId]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceRecords(prev => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    const newMap: Record<string, AttendanceStatus> = {};
    filteredStudents.forEach(s => newMap[s.id] = status);
    setAttendanceRecords(newMap);
  };

  const handleSave = async () => {
    try {
      for (const student of filteredStudents) {
        const status = attendanceRecords[student.id];
        const existing = existingRecords[student.id];
        
        if (existing) {
          if (existing.status !== status) {
            await updateRecord(existing.id, { status });
          }
        } else {
          await addRecord({
            date,
            classId,
            studentId: student.id,
            status
          });
        }
      }
      await fetchData();
      addToast('Attendance saved successfully', 'success');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Daily Attendance" subtitle="Mark and manage student attendance." />
      
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassInput 
            type="date" 
            label="Date" 
            value={date} 
            onChange={e => setDate(e.target.value)} 
          />
          <GlassSelect 
            label="Class" 
            value={classId} 
            onChange={e => setClassId(e.target.value)}
          >
            <option value="">Select Class</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.className}</option>)}
          </GlassSelect>
        </div>
      </GlassCard>

      {classId && filteredStudents.length > 0 && (
        <GlassCard className="p-0 overflow-hidden">
          <div className="p-4 border-b border-white/10 flex flex-wrap justify-between items-center gap-4 bg-white/5">
            <h3 className="font-semibold text-lg">Mark Attendance</h3>
            <div className="flex gap-2">
              <GlassButton variant="ghost" className="text-xs py-1 px-3 text-emerald-500" onClick={() => handleMarkAll('Present')}>
                Mark All Present
              </GlassButton>
              <GlassButton variant="ghost" className="text-xs py-1 px-3 text-rose-500" onClick={() => handleMarkAll('Absent')}>
                Mark All Absent
              </GlassButton>
              <GlassButton variant="primary" className="text-sm py-1.5 px-4 flex items-center gap-2" onClick={handleSave}>
                <Save size={16} /> Save Attendance
              </GlassButton>
            </div>
          </div>
          
          <div className="overflow-x-auto w-full custom-scrollbar max-h-[600px]">
            <table className="w-full text-left border-collapse glass-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th>Attendance Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map(student => (
                  <tr key={student.id}>
                    <td>{student.rollNo}</td>
                    <td className="font-medium text-foreground">{student.fullName}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button 
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${attendanceRecords[student.id] === 'Present' ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30' : 'glass hover:bg-white/10 text-muted-foreground'}`}
                          onClick={() => handleStatusChange(student.id, 'Present')}
                        >
                          <Check size={14} /> Present
                        </button>
                        <button 
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${attendanceRecords[student.id] === 'Absent' ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30' : 'glass hover:bg-white/10 text-muted-foreground'}`}
                          onClick={() => handleStatusChange(student.id, 'Absent')}
                        >
                          <X size={14} /> Absent
                        </button>
                        <button 
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${attendanceRecords[student.id] === 'Leave' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' : 'glass hover:bg-white/10 text-muted-foreground'}`}
                          onClick={() => handleStatusChange(student.id, 'Leave')}
                        >
                          <Clock size={14} /> Leave
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {classId && filteredStudents.length === 0 && (
        <GlassCard className="p-8 text-center">
          <p className="text-muted-foreground">No students found in this class and section.</p>
        </GlassCard>
      )}
    </div>
  );
};
