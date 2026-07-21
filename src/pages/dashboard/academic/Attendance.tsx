import { useState, useMemo, useEffect } from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { GlassCard } from '../../../components/common/GlassCard';
import { GlassButton } from '../../../components/common/GlassButton';
import { GlassSelect } from '../../../components/common/GlassSelect';
import { useMasterData } from '../../../hooks/useMasterData';
import { useToast } from '../../../contexts/ToastContext';
import { Class, Student } from '../../../types/master';
import { Attendance as AttendanceType, AttendanceStatus } from '../../../types/academic';
import { Check, X, Clock, Save } from 'lucide-react';

export const Attendance = () => {
  const { data: classes } = useMasterData<Class>('classes');
  const { data: students } = useMasterData<Student>('students');
  const { data: attendances, addRecord, updateRecord, fetchData } = useMasterData<AttendanceType>('attendance');
  const { addToast } = useToast();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [classId, setClassId] = useState('');

  const [attendanceData, setAttendanceData] = useState<Record<string, AttendanceStatus>>({});
  const [existingRecords, setExistingRecords] = useState<Record<string, AttendanceType>>({});

  const filteredStudents = useMemo(() => {
    if (!classId) return [];
    return students.filter(s => s.classId === classId);
  }, [students, classId]);

  useEffect(() => {
    if (filteredStudents.length > 0 && date) {
      const recordsMap: Record<string, AttendanceType> = {};
      const statusMap: Record<string, AttendanceStatus> = {};
      
      attendances.forEach(att => {
        if (att.date === date && att.classId === classId) {
          recordsMap[att.studentId] = att;
          statusMap[att.studentId] = att.status;
        }
      });
      setExistingRecords(recordsMap);

      filteredStudents.forEach(student => {
        if (!statusMap[student.id]) {
          statusMap[student.id] = 'Present'; // Default status
        }
      });
      setAttendanceData(statusMap);
    } else {
      setAttendanceData({});
      setExistingRecords({});
    }
  }, [filteredStudents, attendances, date, classId]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSave = async () => {
    if (!classId || !date) {
      addToast('Please select a class and date', 'error');
      return;
    }

    try {
      for (const student of filteredStudents) {
        const status = attendanceData[student.id];
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

  const markAll = (status: AttendanceStatus) => {
    const newData = { ...attendanceData };
    filteredStudents.forEach(student => {
      newData[student.id] = status;
    });
    setAttendanceData(newData);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Student Attendance" description="Mark and manage student attendance." />
      
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassSelect 
            label="Class" 
            value={classId} 
            onChange={e => setClassId(e.target.value)}
            options={classes.map(c => ({ label: c.className || (c as { name?: string }).name, value: c.id }))}
          />
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Date</label>
            <input 
              type="date" 
              value={date} 
              onChange={e => setDate(e.target.value)} 
              className="w-full h-[42px] px-3 rounded-lg glass bg-white/5 border border-white/10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/50" 
            />
          </div>
        </div>
      </GlassCard>

      {classId && filteredStudents.length > 0 && (
        <GlassCard className="p-0 overflow-hidden">
          <div className="p-4 border-b border-white/10 flex flex-wrap justify-between items-center gap-4 bg-white/5">
            <h3 className="font-semibold text-lg">Mark Attendance</h3>
            <div className="flex gap-2 items-center">
              <span className="text-sm text-muted-foreground mr-2">Mark All:</span>
              <button onClick={() => markAll('Present')} className="text-xs py-1 px-3 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors">Present</button>
              <button onClick={() => markAll('Absent')} className="text-xs py-1 px-3 rounded-full bg-rose-500/20 text-rose-500 border border-rose-500/30 hover:bg-rose-500/30 transition-colors">Absent</button>
              <button onClick={() => markAll('Leave')} className="text-xs py-1 px-3 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30 hover:bg-amber-500/30 transition-colors">Leave</button>
              <div className="w-px h-6 bg-white/10 mx-2"></div>
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
                  <th>Status</th>
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
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${attendanceData[student.id] === 'Present' ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30' : 'glass hover:bg-white/10 text-muted-foreground border border-transparent'}`}
                          onClick={() => handleStatusChange(student.id, 'Present')}
                        >
                          <Check size={14} /> Present
                        </button>
                        <button 
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${attendanceData[student.id] === 'Absent' ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30' : 'glass hover:bg-white/10 text-muted-foreground border border-transparent'}`}
                          onClick={() => handleStatusChange(student.id, 'Absent')}
                        >
                          <X size={14} /> Absent
                        </button>
                        <button 
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${attendanceData[student.id] === 'Leave' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' : 'glass hover:bg-white/10 text-muted-foreground border border-transparent'}`}
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
          <p className="text-muted-foreground">No students found in this class.</p>
        </GlassCard>
      )}
    </div>
  );
};
