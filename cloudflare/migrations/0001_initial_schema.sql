-- Migration: 0001_initial_schema.sql

-- Settings
CREATE TABLE settings (
    id TEXT PRIMARY KEY,
    schoolName TEXT,
    schoolAddress TEXT,
    contactEmail TEXT,
    contactPhone TEXT,
    academicYear TEXT,
    sessionStart TEXT,
    sessionEnd TEXT
);

-- Users
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    password_hash TEXT,
    name TEXT,
    role TEXT
);

-- Students
CREATE TABLE students (
    id TEXT PRIMARY KEY,
    admissionNo TEXT,
    rollNo TEXT,
    fullName TEXT,
    gender TEXT,
    dob TEXT,
    fatherName TEXT,
    motherName TEXT,
    classId TEXT,
    phone TEXT,
    address TEXT,
    status TEXT,
    admissionDate TEXT,
    photoUrl TEXT,
    createdAt DATETIME
);

-- Teachers
CREATE TABLE teachers (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT,
    subjectId TEXT,
    photoUrl TEXT,
    createdAt DATETIME
);

-- Staff
CREATE TABLE staff (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT,
    role TEXT,
    createdAt DATETIME
);

-- Classes
CREATE TABLE classes (
    id TEXT PRIMARY KEY,
    name TEXT
);

-- Subjects
CREATE TABLE subjects (
    id TEXT PRIMARY KEY,
    name TEXT,
    teacherId TEXT
);
