export type EntityStatus = 'Active' | 'Inactive';

export type SchoolClass = 
  | 'Baby' | 'Nursery' | 'LKG' | 'UKG' 
  | 'Class 1' | 'Class 2' | 'Class 3' | 'Class 4' | 'Class 5' | 'Class 6' | 'Class 7' | 'Class 8';

export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Student extends BaseEntity {
  admissionNo: string;
  rollNo: string;
  fullName: string;
  gender: string;
  dob: string;
  fatherName: string;
  motherName: string;
  classId: string;
  sectionId?: string;
  houseId?: string;
  categoryId?: string;
  phone: string;
  address: string;
  photoUrl: string;
  status: EntityStatus;
  admissionDate: string;
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
  sectionId?: string;
  houseId?: string;
  categoryId?: string;
  teacherId: string;
  status: EntityStatus;
}

export interface ExamSchedule extends BaseEntity {
  examName: string;
  classId: string;
  sectionId?: string;
  houseId?: string;
  categoryId?: string;
  subjectId: string;
  examDate: string;
  startTime: string;
  endTime: string;
  roomNumber: string;
  totalMarks: number;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}


export interface Section extends BaseEntity {
  sectionName: string;
  classId: string;
  sectionId?: string;
  houseId?: string;
  categoryId?: string;
  roomNumber: string;
  status: EntityStatus;
}

export interface AcademicSession extends BaseEntity {
  sessionName: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  status: EntityStatus;
}

export interface House extends BaseEntity {
  houseName: string;
  colorCode: string;
  motto: string;
  status: EntityStatus;
}

export interface Category extends BaseEntity {
  categoryName: string;
  description: string;
  status: EntityStatus;
}
