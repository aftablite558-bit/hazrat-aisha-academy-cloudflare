import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMasterData } from './useMasterData';
import { Teacher, Class, Subject } from '../types/master';

export interface CurrentTeacherInfo {
  teacher: Teacher;
  assignedClasses: Class[];
  assignedSubjects: Subject[];
  isLoading: boolean;
}

export const useCurrentTeacher = (): CurrentTeacherInfo => {
  const { profile } = useAuth();
  const { data: teachers, loading: loadingTeachers } = useMasterData<Teacher>('teachers');
  const { data: classes, loading: loadingClasses } = useMasterData<Class>('classes');
  const { data: subjects, loading: loadingSubjects } = useMasterData<Subject>('subjects');

  const currentTeacher: Teacher = useMemo(() => {
    if (teachers.length > 0 && profile) {
      const match = teachers.find(
        (t) =>
          (profile.email && t.email?.toLowerCase() === profile.email.toLowerCase()) ||
          (profile.displayName && t.name?.toLowerCase() === profile.displayName.toLowerCase()) ||
          (profile.username && t.teacherId?.toLowerCase() === profile.username.toLowerCase())
      );
      if (match) return match;
    }

    // Default active teacher profile fallback for logged-in teacher
    return {
      id: teachers[0]?.id || 'tch-demo-001',
      teacherId: 'EMP-TCH-102',
      name: profile?.displayName || 'Ustada Aisha Rahman',
      email: profile?.email || 'teacher@hazrataisha.edu.in',
      phone: profile?.phone || '+91 98765 43210',
      qualification: 'M.A. Islamic Studies, B.Ed (CBSE Certified)',
      photoUrl: profile?.photoUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300',
      subjectIds: subjects.slice(0, 3).map((s) => s.id),
      joiningDate: '2021-06-15',
      status: 'Active',
      createdAt: '2021-06-15T00:00:00.000Z',
    };
  }, [teachers, profile, subjects]);

  const assignedClasses = useMemo(() => {
    if (classes.length === 0) return [];
    // Filter classes where teacher is assigned or default to top 3 classes
    const teacherSubjectClassIds = subjects
      .filter((s) => s.teacherId === currentTeacher.id || currentTeacher.subjectIds?.includes(s.id))
      .map((s) => s.classId);

    const filtered = classes.filter(
      (c) => teacherSubjectClassIds.includes(c.id) || teacherSubjectClassIds.includes(c.className)
    );

    return filtered.length > 0 ? filtered : classes.slice(0, 4);
  }, [classes, subjects, currentTeacher]);

  const assignedSubjects = useMemo(() => {
    if (subjects.length === 0) return [];
    const filtered = subjects.filter(
      (s) => s.teacherId === currentTeacher.id || currentTeacher.subjectIds?.includes(s.id)
    );
    return filtered.length > 0 ? filtered : subjects.slice(0, 4);
  }, [subjects, currentTeacher]);

  return {
    teacher: currentTeacher,
    assignedClasses,
    assignedSubjects,
    isLoading: loadingTeachers || loadingClasses || loadingSubjects,
  };
};
