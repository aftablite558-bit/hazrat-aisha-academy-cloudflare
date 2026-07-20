-- D1 Schema for Hazrat Aisha Academy ERP

-- Users & Auth
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL, -- Owner, Principal, Admin, Teacher, Student
  phone TEXT,
  email TEXT UNIQUE,
  photoUrl TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Academic Sessions
CREATE TABLE IF NOT EXISTS academic_sessions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL, -- Example: 2026-27
  startDate DATE NOT NULL,
  endDate DATE NOT NULL,
  status TEXT DEFAULT 'Archived', -- Active, Archived
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students
CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  admissionNo TEXT UNIQUE NOT NULL,
  rollNo TEXT,
  fullName TEXT NOT NULL,
  gender TEXT NOT NULL,
  dob DATE NOT NULL,
  fatherName TEXT,
  motherName TEXT,
  classId TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  photoUrl TEXT,
  status TEXT DEFAULT 'Active',
  admissionDate DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Staff & Teachers
CREATE TABLE IF NOT EXISTS staff (
  id TEXT PRIMARY KEY,
  fullName TEXT NOT NULL,
  role TEXT NOT NULL, -- Teacher, Admin, Support
  phone TEXT,
  email TEXT UNIQUE,
  photoUrl TEXT,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Classes
CREATE TABLE IF NOT EXISTS classes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  teacher_id TEXT,
  sessionId TEXT NOT NULL,
  FOREIGN KEY (teacher_id) REFERENCES staff(id),
  FOREIGN KEY (sessionId) REFERENCES academic_sessions(id)
);

-- Subjects
CREATE TABLE IF NOT EXISTS subjects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  class_id TEXT NOT NULL,
  FOREIGN KEY (class_id) REFERENCES classes(id)
);

-- Attendance
CREATE TABLE IF NOT EXISTS attendance (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  date DATE NOT NULL,
  status TEXT NOT NULL, -- Present, Absent, Late
  sessionId TEXT NOT NULL,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (sessionId) REFERENCES academic_sessions(id)
);

-- Homework
CREATE TABLE IF NOT EXISTS homework (
  id TEXT PRIMARY KEY,
  subject_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  sessionId TEXT NOT NULL,
  FOREIGN KEY (subject_id) REFERENCES subjects(id),
  FOREIGN KEY (sessionId) REFERENCES academic_sessions(id)
);

-- Results
CREATE TABLE IF NOT EXISTS results (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  marks INTEGER NOT NULL,
  term TEXT NOT NULL,
  sessionId TEXT NOT NULL,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (subject_id) REFERENCES subjects(id),
  FOREIGN KEY (sessionId) REFERENCES academic_sessions(id)
);

-- Report Cards
CREATE TABLE IF NOT EXISTS reportcards (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  term TEXT NOT NULL,
  data TEXT NOT NULL,
  sessionId TEXT NOT NULL,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (sessionId) REFERENCES academic_sessions(id)
);

-- Admissions
CREATE TABLE IF NOT EXISTS admissions (
  id TEXT PRIMARY KEY,
  student_name TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  status TEXT DEFAULT 'Pending', -- Pending, Approved, Rejected
  sessionId TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sessionId) REFERENCES academic_sessions(id)
);

-- Fees
CREATE TABLE IF NOT EXISTS fees (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  amount REAL NOT NULL,
  status TEXT NOT NULL, -- Paid, Unpaid
  due_date DATE NOT NULL,
  sessionId TEXT NOT NULL,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (sessionId) REFERENCES academic_sessions(id)
);

-- Notice Board
CREATE TABLE IF NOT EXISTS notices (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gallery
CREATE TABLE IF NOT EXISTS gallery (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Downloads
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Academic Calendar
CREATE TABLE IF NOT EXISTS calendar (
  id TEXT PRIMARY KEY,
  event_name TEXT NOT NULL,
  event_date DATE NOT NULL,
  description TEXT,
  sessionId TEXT NOT NULL,
  FOREIGN KEY (sessionId) REFERENCES academic_sessions(id)
);

-- Achievements
CREATE TABLE IF NOT EXISTS achievements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Settings / School Info
CREATE TABLE IF NOT EXISTS school_info (
  id TEXT PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL
);

-- User Preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id TEXT PRIMARY KEY,
  in_app_notifications INTEGER DEFAULT 1,
  email_notifications INTEGER DEFAULT 0,
  whatsapp_notifications INTEGER DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
