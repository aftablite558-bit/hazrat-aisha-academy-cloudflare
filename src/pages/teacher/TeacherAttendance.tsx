import React, { useState, useMemo, useEffect } from 'react';
import { useCurrentTeacher } from '../../hooks/useCurrentTeacher';
import { useMasterData } from '../../hooks/useMasterData';
import { useToast } from '../../contexts/ToastContext';

import { PageHeader } from '../../components/common/PageHeader';
import { GlassCard } from '../../components/common/GlassCard';
import { GlassButton } from '../../components/common/GlassButton';
import { GlassSelect } from '../../components/common/GlassSelect';
import { GlassBadge } from '../../components/common/GlassBadge';
import { BackButton } from '../../components/common/BackButton';

import { Student } from '../../types/master';
import { Attendance as AttendanceType, AttendanceStatus } from '../../types/academic';

import {
  Check,
  X,
  Clock,
  Save,
  AlertTriangle,
  UserCheck,
  Users,
  Calendar,
  AlertCircle,
  Clock3,
} from 'lucide-react';

export const TeacherAttendance: React.FC = () => {
  const { assignedClasses, isLoading } = useCurrentTeacher();
  const { data: students } = useMasterData<Student>('students');
  const { data: attendances, addRecord, updateRecord, fetchData } = useMasterData<AttendanceType>('attendance');
  const { addToast } = useToast();

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const [date, setDate] = useState<string>(todayStr);
  const [classId, setClassId] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  // Map of studentId -> AttendanceStatus
  const [statusData, setStatusData] = useState<Record<string, AttendanceStatus>>({});
  // Map of studentId -> isLate boolean
  const [lateData, setLateData] = useState<Record<string, boolean>>({});

  // Existing records map studentId -> AttendanceType
  const [existingRecordsMap, setExistingRecordsMap] = useState<Record<string, AttendanceType>>({});

  // Auto select first assigned class if none selected
  useEffect(() => {
    if (assignedClasses.length > 0 && !classId) {
      setClassId(assignedClasses[0].id);
    }
  }, [assignedClasses, classId]);

  // Check if chosen date is same day (today)
  const isSameDay = useMemo(() => date === todayStr, [date, todayStr]);

  // Students belonging to chosen assigned class
  const classStudents = useMemo(() => {
    if (!classId) return [];
    return students.filter((s) => s.classId === classId);
  }, [students, classId]);

  // Load existing attendance for date & class
  useEffect(() => {
    if (classStudents.length > 0 && date && classId) {
      const recordsMap: Record<string, AttendanceType> = {};
      const newStatusMap: Record<string, AttendanceStatus> = {};
      const newLateMap: Record<string, boolean> = {};

      attendances.forEach((att) => {
        if (att.date === date && att.classId === classId) {
          recordsMap[att.studentId] = att;
          newStatusMap[att.studentId] = att.status;
          newLateMap[att.studentId] = att.isLate || false;
        }
      });

      setExistingRecordsMap(recordsMap);

      classStudents.forEach((student) => {
        if (!newStatusMap[student.id]) {
          newStatusMap[student.id] = 'Present'; // Default status
          newLateMap[student.id] = false;
        }
      });

      setStatusData(newStatusMap);
      setLateData(newLateMap);
    } else {
      setStatusData({});
      setLateData({});
      setExistingRecordsMap({});
    }
  }, [classStudents, attendances, date, classId]);

  // Attendance summary calculations
  const summary = useMemo(() => {
    let presentCount = 0;
    let absentCount = 0;
    let leaveCount = 0;
    let lateCount = 0;

    classStudents.forEach((s) => {
      const st = statusData[s.id] || 'Present';
      if (st === 'Present') presentCount++;
      else if (st === 'Absent') absentCount++;
      else if (st === 'Leave') leaveCount++;

      if (lateData[s.id]) lateCount++;
    });

    const total = classStudents.length;
    const presentPercentage = total > 0 ? Math.round((presentCount / total) * 100) : 0;

    return { total, presentCount, absentCount, leaveCount, lateCount, presentPercentage };
  }, [classStudents, statusData, lateData]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    if (!isSameDay && Object.keys(existingRecordsMap).length > 0) {
      addToast('Editing attendance is restricted to current day only.', 'error');
      return;
    }
    setStatusData((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleLateToggle = (studentId: string) => {
    if (!isSameDay && Object.keys(existingRecordsMap).length > 0) {
      addToast('Editing attendance is restricted to current day only.', 'error');
      return;
    }
    setLateData((prev) => ({ ...prev, [studentId]: !prev[studentId] }));
  };

  const markAll = (status: AttendanceStatus) => {
    if (!isSameDay && Object.keys(existingRecordsMap).length > 0) {
      addToast('Editing attendance is restricted to current day only.', 'error');
      return;
    }
    const updated: Record<string, AttendanceStatus> = {};
    classStudents.forEach((s) => {
      updated[s.id] = status;
    });
    setStatusData(updated);
  };

  const handleSave = async () => {
    if (!classId || !date) {
      addToast('Please select class and date', 'error');
      return;
    }

    if (!isSameDay && Object.keys(existingRecordsMap).length > 0) {
      addToast('Attendance for past dates cannot be modified.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      for (const student of classStudents) {
        const status = statusData[student.id] || 'Present';
        const isLate = lateData[student.id] || false;
        const existing = existingRecordsMap[student.id];

        if (existing) {
          if (existing.status !== status || existing.isLate !== isLate) {
            await updateRecord(existing.id, { status, isLate });
          }
        } else {
          await addRecord({
            date,
            classId,
            studentId: student.id,
            status,
            isLate,
          });
        }
      }

      await fetchData();
      addToast('Attendance records saved successfully!', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to save attendance', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const isAlreadySubmitted = Object.keys(existingRecordsMap).length > 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground animate-pulse">Loading Attendance Module...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex justify-start mb-[-1.5rem] relative z-20">
        <BackButton />
      </div>

      <PageHeader
        title="Class Attendance Management"
        description="Mark, review, and lock daily attendance for your assigned classes."
      />

      {/* Class Selection & Date Picker Bar */}
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <GlassSelect
            label="Assigned Class"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            options={assignedClasses.map((c) => ({
              label: `Class ${c.className}`,
              value: c.id,
            }))}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center justify-between">
              <span>Attendance Date</span>
              {!isSameDay && (
                <span className="text-xs text-amber-500 font-bold flex items-center gap-1">
                  <AlertTriangle size={12} /> Past Date (View Only)
                </span>
              )}
            </label>
            <input
              type="date"
              value={date}
              max={todayStr}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-[42px] px-3.5 rounded-lg glass bg-white/5 border border-white/10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            />
          </div>

          <div className="flex items-center gap-2">
            {isAlreadySubmitted && (
              <span className="text-xs font-semibold px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1.5">
                <Check size={14} /> Attendance Submitted For Selected Date
              </span>
            )}
          </div>
        </div>
      </GlassCard>

      {/* Attendance Summary Bar */}
      {classStudents.length > 0 && (
        <GlassCard className="p-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 w-full md:w-auto">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center min-w-[100px]">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Total Students</p>
                <p className="text-xl font-black text-foreground">{summary.total}</p>
              </div>

              <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 text-center min-w-[100px]">
                <p className="text-[10px] font-bold text-emerald-500 uppercase">Present</p>
                <p className="text-xl font-black text-emerald-500">{summary.presentCount}</p>
              </div>

              <div className="bg-rose-500/10 p-3 rounded-xl border border-rose-500/20 text-center min-w-[100px]">
                <p className="text-[10px] font-bold text-rose-500 uppercase">Absent</p>
                <p className="text-xl font-black text-rose-500">{summary.absentCount}</p>
              </div>

              <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 text-center min-w-[100px]">
                <p className="text-[10px] font-bold text-amber-500 uppercase">Leave</p>
                <p className="text-xl font-black text-amber-500">{summary.leaveCount}</p>
              </div>

              <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20 text-center min-w-[100px]">
                <p className="text-[10px] font-bold text-blue-500 uppercase">Late Entry</p>
                <p className="text-xl font-black text-blue-500">{summary.lateCount}</p>
              </div>
            </div>

            {/* Attendance Progress Bar */}
            <div className="w-full md:w-64 space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-foreground">
                <span>Present Rate</span>
                <span>{summary.presentPercentage}%</span>
              </div>
              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${summary.presentPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Attendance Roster Table */}
      {classStudents.length > 0 ? (
        <GlassCard className="p-0 overflow-hidden">
          <div className="p-4 border-b border-white/10 flex flex-wrap justify-between items-center gap-4 bg-white/5">
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-lg text-foreground">Mark Attendance</h3>
              {!isSameDay && (
                <span className="text-xs text-amber-500 font-semibold bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                  Read Only Mode
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs font-medium text-muted-foreground mr-1">Bulk Mark:</span>
              <button
                onClick={() => markAll('Present')}
                disabled={!isSameDay && isAlreadySubmitted}
                className="text-xs py-1.5 px-3 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 hover:bg-emerald-500/30 disabled:opacity-50 transition-colors font-medium"
              >
                Mark All Present
              </button>
              <button
                onClick={() => markAll('Absent')}
                disabled={!isSameDay && isAlreadySubmitted}
                className="text-xs py-1.5 px-3 rounded-full bg-rose-500/20 text-rose-500 border border-rose-500/30 hover:bg-rose-500/30 disabled:opacity-50 transition-colors font-medium"
              >
                Mark All Absent
              </button>
              <button
                onClick={() => markAll('Leave')}
                disabled={!isSameDay && isAlreadySubmitted}
                className="text-xs py-1.5 px-3 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30 hover:bg-amber-500/30 disabled:opacity-50 transition-colors font-medium"
              >
                Mark All Leave
              </button>

              <div className="w-px h-6 bg-white/10 mx-2 hidden sm:block" />

              <GlassButton
                variant="primary"
                className="text-xs py-2 px-4 flex items-center gap-2 font-bold"
                onClick={handleSave}
                disabled={isSaving || (!isSameDay && isAlreadySubmitted)}
              >
                <Save size={16} /> {isSaving ? 'Saving...' : 'Save & Submit Attendance'}
              </GlassButton>
            </div>
          </div>

          <div className="overflow-x-auto w-full custom-scrollbar">
            <table className="w-full text-left border-collapse glass-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th>Admission No</th>
                  <th>Attendance Status</th>
                  <th>Late Entry</th>
                </tr>
              </thead>
              <tbody>
                {classStudents.map((std) => {
                  const currentStatus = statusData[std.id] || 'Present';
                  const isLate = lateData[std.id] || false;

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
                      <td className="font-mono text-xs">{std.admissionNo || 'N/A'}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                              currentStatus === 'Present'
                                ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/40 shadow-sm'
                                : 'glass text-muted-foreground hover:bg-white/10 border border-transparent'
                            }`}
                            onClick={() => handleStatusChange(std.id, 'Present')}
                          >
                            <Check size={14} /> Present
                          </button>

                          <button
                            type="button"
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                              currentStatus === 'Absent'
                                ? 'bg-rose-500/20 text-rose-500 border border-rose-500/40 shadow-sm'
                                : 'glass text-muted-foreground hover:bg-white/10 border border-transparent'
                            }`}
                            onClick={() => handleStatusChange(std.id, 'Absent')}
                          >
                            <X size={14} /> Absent
                          </button>

                          <button
                            type="button"
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                              currentStatus === 'Leave'
                                ? 'bg-amber-500/20 text-amber-500 border border-amber-500/40 shadow-sm'
                                : 'glass text-muted-foreground hover:bg-white/10 border border-transparent'
                            }`}
                            onClick={() => handleStatusChange(std.id, 'Leave')}
                          >
                            <Clock size={14} /> Leave
                          </button>
                        </div>
                      </td>
                      <td>
                        <button
                          type="button"
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            isLate
                              ? 'bg-blue-500/20 text-blue-500 border border-blue-500/40'
                              : 'glass text-muted-foreground hover:bg-white/10'
                          }`}
                          onClick={() => handleLateToggle(std.id)}
                        >
                          {isLate ? 'Late Entry' : 'On Time'}
                        </button>
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
          <p className="text-muted-foreground font-medium">No students found for the selected assigned class.</p>
        </GlassCard>
      )}
    </div>
  );
};
