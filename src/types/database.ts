export interface Setting {
  id: string;
  schoolName: string;
  schoolAddress: string;
  contactEmail: string;
  contactPhone: string;
  academicYear: string;
  sessionStart: string;
  sessionEnd: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

// Add other types as needed...
