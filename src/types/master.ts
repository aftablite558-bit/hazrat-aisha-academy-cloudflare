export type EntityStatus = 'Active' | 'Inactive';

export type StudentExtendedStatus = 'Active' | 'Inactive' | 'Transferred' | 'Alumni' | 'Dropped' | 'Graduated';

export type SchoolClass = 
  | 'Baby' | 'Nursery' | 'LKG' | 'UKG' 
  | 'Class 1' | 'Class 2' | 'Class 3' | 'Class 4' | 'Class 5' | 'Class 6' | 'Class 7' | 'Class 8';

export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentDocument {
  id: string;
  type: 'Birth Certificate' | 'Aadhaar' | 'Transfer Certificate' | 'Report Card' | 'Medical Certificate' | 'Photo' | 'Other';
  name: string;
  url: string;
  uploadedAt: string;
  size?: string;
}

export interface StudentTimelineEvent {
  id: string;
  title: string;
  description: string;
  type: 'Admission' | 'Promotion' | 'Result' | 'Fee Payment' | 'Certificate' | 'Discipline' | 'General';
  date: string;
  author?: string;
}

export interface StudentPromotionRecord {
  id: string;
  fromClass: string;
  toClass: string;
  fromSession: string;
  toSession: string;
  date: string;
  promotedBy?: string;
  remarks?: string;
}

export interface Student extends BaseEntity {
  admissionNo: string;
  rollNo: string;
  fullName: string;
  gender: string; // 'Male' | 'Female' | 'Other'
  dob: string;
  fatherName: string;
  motherName: string;
  classId: string;
  phone: string;
  address: string;
  photoUrl: string;
  status: EntityStatus | StudentExtendedStatus;
  admissionDate: string;
  
  // Phase 7 Extended Fields
  section?: string;
  house?: string;
  academicSession?: string;
  bloodGroup?: string;
  aadhaar?: string;
  category?: string; // 'General' | 'OBC' | 'SC' | 'ST' | 'EWS'
  religion?: string; // 'Islam' | 'Hinduism' | 'Christianity' | 'Sikhism' | 'Other'
  guardianName?: string;
  fatherOccupation?: string;
  altMobile?: string;
  email?: string;
  emergencyContact?: string;
  documents?: StudentDocument[];
  timeline?: StudentTimelineEvent[];
  promotionHistory?: StudentPromotionRecord[];
}

export interface Teacher extends BaseEntity {
  teacherId: string;
  photoUrl: string;
  name: string;
  qualification: string;
  subjectIds: string[];
  phone: string;
  email: string;
  joiningDate: string;
  status: EntityStatus;
}

export interface Staff extends BaseEntity {
  employeeId: string;
  name: string;
  department: string;
  role: string;
  phone: string;
  joiningDate: string;
  status: EntityStatus;
}

export interface Class extends BaseEntity {
  className: SchoolClass;
  order: number;
  status: EntityStatus;
}

export interface Subject extends BaseEntity {
  subjectName: string;
  code: string;
  classId: string;
  teacherId: string;
  status: EntityStatus;
}

export interface ExamSchedule extends BaseEntity {
  examName: string;
  classId: string;
  subjectId: string;
  examDate: string;
  startTime: string;
  endTime: string;
  roomNumber: string;
  totalMarks: number;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

