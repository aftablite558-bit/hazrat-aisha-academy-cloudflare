import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCurrentTeacher } from '../../hooks/useCurrentTeacher';
import { useMasterData } from '../../hooks/useMasterData';
import { PageHeader } from '../../components/common/PageHeader';
import { GlassCard } from '../../components/common/GlassCard';
import { GlassButton } from '../../components/common/GlassButton';
import { GlassInput } from '../../components/common/GlassInput';
import { GlassTable } from '../../components/common/GlassTable';
import { GlassBadge } from '../../components/common/GlassBadge';
import { Pagination } from '../../components/common/Pagination';
import { BackButton } from '../../components/common/BackButton';
import { Student } from '../../types/master';

import {
  Users,
  Search,
  Filter,
  UserCheck,
  ChevronLeft,
  ArrowLeft,
  GraduationCap,
  Sparkles,
  BookOpen
} from 'lucide-react';

export const TeacherClasses: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedClassParam = searchParams.get('classId');

  const { teacher, assignedClasses, isLoading } = useCurrentTeacher();
  const { data: students, loading: loadingStudents } = useMasterData<Student>('students');

  const [activeClassId, setActiveClassId] = useState<string | null>(selectedClassParam);
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (selectedClassParam) {
      setActiveClassId(selectedClassParam);
    }
  }, [selectedClassParam]);

  const activeClass = useMemo(() => {
    return assignedClasses.find((c) => c.id === activeClassId);
  }, [assignedClasses, activeClassId]);

  // Students for selected class
  const classStudents = useMemo(() => {
    if (!activeClassId) return [];
    return students.filter((s) => s.classId === activeClassId);
  }, [students, activeClassId]);

  // Filtered student list
  const filteredStudents = useMemo(() => {
    return classStudents.filter((s) => {
      const matchesSearch =
        (s.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.rollNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.admissionNo || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGender =
        genderFilter === 'All' ||
        (genderFilter === 'Boy' && (s.gender === 'Boy' || s.gender === 'Male')) ||
        (genderFilter === 'Girl' && (s.gender === 'Girl' || s.gender === 'Female'));

      return matchesSearch && matchesGender;
    });
  }, [classStudents, searchTerm, genderFilter]);

  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredStudents, currentPage]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  const handleOpenClass = (classId: string) => {
    setActiveClassId(classId);
    setSearchParams({ classId });
    setCurrentPage(1);
  };

  const handleBackToClasses = () => {
    setActiveClassId(null);
    setSearchParams({});
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground animate-pulse">Loading assigned classes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex justify-start mb-[-1.5rem] relative z-20">
        <BackButton />
      </div>

      <PageHeader
        title={activeClass ? `Class: ${activeClass.className}` : 'My Assigned Classes'}
        description={
          activeClass
            ? `Student roster and academic records for Class ${activeClass.className}`
            : 'View and manage student rosters for your assigned classes.'
        }
      />

      {/* VIEW 1: MY CLASSES CARDS GRID */}
      {!activeClass ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignedClasses.length === 0 ? (
              <GlassCard className="p-8 text-center col-span-full">
                <p className="text-muted-foreground">No classes assigned yet.</p>
              </GlassCard>
            ) : (
              assignedClasses.map((cls, idx) => {
                const totalStudentsInClass = students.filter((s) => s.classId === cls.id).length;
                const boysCount = students.filter(
                  (s) => s.classId === cls.id && (s.gender === 'Boy' || s.gender === 'Male')
                ).length;
                const girlsCount = students.filter(
                  (s) => s.classId === cls.id && (s.gender === 'Girl' || s.gender === 'Female')
                ).length;

                return (
                  <GlassCard
                    key={cls.id}
                    className="p-6 flex flex-col justify-between hover:border-emerald-500/50 transition-all space-y-6 group"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                            Class {cls.className}
                          </span>
                          <h3 className="text-2xl font-extrabold text-foreground mt-2">
                            Class {cls.className} - Section A
                          </h3>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                          <GraduationCap size={24} />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-muted-foreground">Students</p>
                          <p className="text-lg font-black text-foreground">{totalStudentsInClass}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-blue-500">Boys</p>
                          <p className="text-lg font-black text-blue-500">{boysCount}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-pink-500">Girls</p>
                          <p className="text-lg font-black text-pink-500">{girlsCount}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <BookOpen size={14} className="text-primary-500 shrink-0" />
                        <span>Class Teacher Role: Active Assigned Faculty</span>
                      </div>
                    </div>

                    <GlassButton
                      variant="primary"
                      className="w-full flex items-center justify-center gap-2 text-sm font-semibold py-2.5"
                      onClick={() => handleOpenClass(cls.id)}
                    >
                      <Users size={18} /> Open Class Roster
                    </GlassButton>
                  </GlassCard>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* VIEW 2: STUDENT ROSTER INSIDE ASSIGNED CLASS */
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <GlassButton
              variant="ghost"
              className="flex items-center gap-2 text-sm text-primary-500"
              onClick={handleBackToClasses}
            >
              <ArrowLeft size={16} /> Back to My Classes
            </GlassButton>

            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-muted-foreground">
                Total Enrolled: <strong className="text-foreground">{classStudents.length}</strong>
              </span>
            </div>
          </div>

          {/* Search & Filters Bar */}
          <GlassCard className="p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <GlassInput
                  placeholder="Search student name, roll no, admission no..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>

              {/* Gender Filter Buttons */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs font-semibold text-muted-foreground mr-1">Gender:</span>
                {['All', 'Boy', 'Girl'].map((gen) => (
                  <button
                    key={gen}
                    onClick={() => {
                      setGenderFilter(gen);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      genderFilter === gen
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md font-bold'
                        : 'glass text-muted-foreground hover:bg-white/10'
                    }`}
                  >
                    {gen}
                  </button>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Student Table */}
          <GlassTable>
            <thead>
              <tr>
                <th>Photo</th>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Admission No</th>
                <th>Gender</th>
                <th>Father's Name</th>
                <th>Phone</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loadingStudents ? (
                <tr>
                  <td colSpan={8} className="text-center py-8">
                    Loading student records...
                  </td>
                </tr>
              ) : paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-muted-foreground">
                    No students found matching your criteria.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((std) => (
                  <tr key={std.id}>
                    <td>
                      <img
                        src={
                          std.photoUrl ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            std.fullName
                          )}&background=06b6d4&color=fff`
                        }
                        alt={std.fullName}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-500/20"
                      />
                    </td>
                    <td className="font-bold text-primary-500">{std.rollNo || 'N/A'}</td>
                    <td className="font-semibold text-foreground">{std.fullName}</td>
                    <td className="font-mono text-xs">{std.admissionNo || 'N/A'}</td>
                    <td>
                      <GlassBadge
                        variant={std.gender === 'Girl' || std.gender === 'Female' ? 'secondary' : 'primary'}
                      >
                        {std.gender || 'Boy'}
                      </GlassBadge>
                    </td>
                    <td>{std.fatherName || '—'}</td>
                    <td>{std.phone || '—'}</td>
                    <td>
                      <GlassBadge variant={std.status === 'Active' ? 'success' : 'default'}>
                        {std.status || 'Active'}
                      </GlassBadge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </GlassTable>

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}
    </div>
  );
};
