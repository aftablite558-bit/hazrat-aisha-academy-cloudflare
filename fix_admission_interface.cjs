const fs = require('fs');
let file = 'src/types/enterprise.ts';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(
  "export interface Admission extends BaseEntity {\n  admissionNumber: string;\n  studentName: string;\n  parentName: string;\n  parentPhone: string;\n  parentEmail: string;\n  classApplied: string;\n  previousSchool: string;\n  documentUrl?: string;\n  status: 'Pending' | 'Approved' | 'Rejected';\n  remarks?: string;\n}",
  `export interface Admission extends BaseEntity {
  admissionNumber: string;
  studentName: string;
  gender?: string;
  dob?: string;
  studentAadhaar?: string;
  bloodGroup?: string;
  fatherName?: string;
  motherName?: string;
  guardianName?: string;
  alternatePhone?: string;
  address?: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  classApplied: string;
  previousSchool: string;
  photoUrl?: string;
  birthCertificateUrl?: string;
  aadhaarUrl?: string;
  reportCardUrl?: string;
  documentUrl?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  remarks?: string;
}`
);

fs.writeFileSync(file, c);
