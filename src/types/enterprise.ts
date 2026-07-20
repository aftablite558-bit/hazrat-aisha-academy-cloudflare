import { BaseEntity, EntityStatus } from './master';

export interface Admission extends BaseEntity {
  admissionNumber: string;
  studentName: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  classApplied: string;
  previousSchool: string;
  documentUrl?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  remarks?: string;
}

export interface FeeStructure extends BaseEntity {
  category: string; // e.g. "Tuition Fee", "Library Fee"
  amount: number;
  applicableClasses: string[];
}

export interface StudentFee extends BaseEntity {
  studentId: string;
  studentName: string;
  classId: string;
  receiptNumber: string;
  dueDate: string;
  paidDate?: string;
  amount: number;
  discount: number;
  fine: number;
  totalPaid: number;
  status: 'Paid' | 'Pending' | 'Overdue';
}

export interface AuditLog extends BaseEntity {
  userId: string;
  userName: string;
  action: 'Login' | 'Logout' | 'Create' | 'Edit' | 'Delete' | 'Publish';
  module: string;
  details: string;
}

export interface SystemSettings extends BaseEntity {
  schoolName: string;
  schoolAddress: string;
  contactEmail: string;
  contactPhone: string;
  logoUrl?: string;
  academicYear: string;
  sessionStart: string;
  sessionEnd: string;
}
