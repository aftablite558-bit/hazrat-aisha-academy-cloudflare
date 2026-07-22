import { BaseEntity, EntityStatus } from './master';

export interface Homework extends BaseEntity {
  classId: string;
  subjectId: string;
  teacherId: string;
  title: string;
  description: string;
  attachmentUrl?: string;
  dueDate: string;
  isPublished: boolean;
  status?: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Leave';

export interface Attendance extends BaseEntity {
  date: string;
  classId: string;
  studentId: string;
  status: AttendanceStatus;
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
}

export interface Result extends BaseEntity {
  examName: string;
  studentId: string;
  classId: string;
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  grade: string;
  rank?: string;
  status: 'Pass' | 'Fail';
  isPublished: boolean;
}
