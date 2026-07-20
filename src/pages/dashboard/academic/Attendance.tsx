import { useState, useMemo, useEffect } from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { GlassCard } from '../../../components/common/GlassCard';
import { GlassButton } from '../../../components/common/GlassButton';
import { useMasterData } from '../../../hooks/useMasterData';
import { useToast } from '../../../contexts/ToastContext';
import { Student } from '../../../types/master';
import { Attendance as AttendanceType, AttendanceStatus } from '../../../types/academic';
import { Check, X, Clock, Save } from 'lucide-react';
import { StudentLookup } from '../../../components/dashboard/academic/StudentLookup';

export const Attendance = () => {
  const { data: attendances, loading: attendancesLoading, addRecord, updateRecord, fetchData } = useMasterData<AttendanceType>('attendance', true);
  const { addToast } = useToast();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>('Present');
  const [existingRecord, setExistingRecord] = useState<AttendanceType | null>(null);

  useEffect(() => {
    if (selectedStudent && date) {
      const record = attendances.find(att => att.date === date && att.studentId === selectedStudent.id);
      setExistingRecord(record || null);
      setAttendanceStatus(record?.status || 'Present');
    } else {
      setExistingRecord(null);
      setAttendanceStatus('Present');
    }
  }, [selectedStudent, attendances, date]);

  const handleSave = async () => {
    try {
      if (!selectedStudent) return;
      
      if (existingRecord) {
        if (existingRecord.status !== attendanceStatus) {
          await updateRecord(existingRecord.id, { status: attendanceStatus });
        }
      } else {
        await addRecord({
          date,
          classId: selectedStudent.classId,
          studentId: selectedStudent.id,
          status: attendanceStatus
        });
      }
      await fetchData();
      addToast('Attendance saved successfully', 'success');
    } catch (error) {
      console.error(error);
      addToast('Failed to save attendance', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Student Attendance" description="Mark and manage student attendance." />
      
      <GlassCard className="p-6">
        <StudentLookup onStudentSelect={setSelectedStudent} />
        <div className="mt-6">
             <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 rounded glass" />
        </div>
      </GlassCard>

      {selectedStudent && (
        <GlassCard className="p-6">
          <h3 className="font-semibold text-lg mb-4">Mark Attendance for {selectedStudent.fullName}</h3>
          <div className="flex items-center gap-2">
            <button 
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${attendanceStatus === 'Present' ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30' : 'glass hover:bg-white/10 text-muted-foreground'}`}
              onClick={() => setAttendanceStatus('Present')}
            >
              <Check size={14} /> Present
            </button>
            <button 
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${attendanceStatus === 'Absent' ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30' : 'glass hover:bg-white/10 text-muted-foreground'}`}
              onClick={() => setAttendanceStatus('Absent')}
            >
              <X size={14} /> Absent
            </button>
            <button 
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${attendanceStatus === 'Leave' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' : 'glass hover:bg-white/10 text-muted-foreground'}`}
              onClick={() => setAttendanceStatus('Leave')}
            >
              <Clock size={14} /> Leave
            </button>
            <GlassButton variant="primary" className="ml-auto" onClick={handleSave}>
              <Save size={16} /> Save
            </GlassButton>
          </div>
        </GlassCard>
      )}
    </div>
  );
};
