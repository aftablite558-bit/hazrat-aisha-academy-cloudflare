import { BaseEntity, EntityStatus } from './master';

export interface Homework extends BaseEntity {
  classId: string;
  subjectId: string;
  teacherId: string;
  title: string;
  description: string;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentType?: 'pdf' | 'image' | 'document';
  dueDate: string;
  publishDate?: string;
  isPublished: boolean;
  status?: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Leave' | 'Late';

export interface Attendance extends BaseEntity {
  date: string;
  classId: string;
  studentId: string;
  status: AttendanceStatus;
  isLate?: boolean;
  remarks?: string;
}

export interface ExamMark extends BaseEntity {
  examName: string;
  studentId: string;
  classId: string;
  subjectId: string;
  maxMarks: number;
  obtainedMarks: number;
  grade: string;
  remarks: string;
  teacherId?: string;
}

export interface Result extends BaseEntity {
  examName: string;
  studentId: string;
  classId: string;
  subjectId?: string;
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  grade: string;
  rank?: string;
  status: 'Pass' | 'Fail';
  isPublished: boolean;
  teacherId?: string;
  isDraft?: boolean;
}

export interface TeacherLeave extends BaseEntity {
  teacherId: string;
  teacherName: string;
  leaveType: 'Casual Leave' | 'Sick Leave' | 'Earned Leave' | 'Maternity Leave' | 'Emergency Leave';
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedDate: string;
  remarks?: string;
}

export interface TeacherTimetable extends BaseEntity {
  teacherId: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  periodNumber: number;
  startTime: string;
  endTime: string;
  classId: string;
  subjectId: string;
  roomNumber: string;
}

