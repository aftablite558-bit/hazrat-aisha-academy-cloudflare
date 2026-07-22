import { useState, useMemo } from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { GlassTable } from '../../../components/common/GlassTable';
import { GlassButton } from '../../../components/common/GlassButton';
import { GlassInput } from '../../../components/common/GlassInput';
import { GlassBadge } from '../../../components/common/GlassBadge';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { Pagination } from '../../../components/common/Pagination';
import { BackButton } from '../../../components/common/BackButton';

import { useMasterData } from '../../../hooks/useMasterData';
import { useAuth } from '../../../contexts/AuthContext';
import { Student, Class, StudentDocument } from '../../../types/master';
import {
  Edit,
  Trash2,
  Plus,
  Search,
  Eye,
  CreditCard,
  Award,
  GraduationCap,
  Upload,
  Download,
  FileSpreadsheet,
  Users,
  UserCheck,
  CheckSquare,
  Square,
  Filter,
  RefreshCw,
  FileText
} from 'lucide-react';

import { StudentProfileModal } from '../../../components/dashboard/students/StudentProfileModal';
import { StudentFormModalAdvanced } from '../../../components/dashboard/students/StudentFormModalAdvanced';
import { StudentCertificateModal } from '../../../components/dashboard/students/StudentCertificateModal';
import { StudentIDCardModal } from '../../../components/dashboard/students/StudentIDCardModal';
import { StudentPromotionModal } from '../../../components/dashboard/students/StudentPromotionModal';
import { BulkImportModal } from '../../../components/dashboard/students/BulkImportModal';

import { exportToExcel, downloadReportPDF } from '../../../utils/financeUtils';
import { generateStudentIDCardPDF } from '../../../utils/studentPdfUtils';

export const Students = () => {
  const { user, profile } = useAuth();
  const isTeacher = profile?.role === 'teacher';

  const { data: students, loading, addRecord, updateRecord, deleteRecord } = useMasterData<Student>('students');
  const { data: classes } = useMasterData<Class>('classes');

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedGender, setSelectedGender] = useState('');

  // Bulk Selection state
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCertOpen, setIsCertOpen] = useState(false);
  const [isIDCardOpen, setIsIDCardOpen] = useState(false);
  const [isPromoteOpen, setIsPromoteOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Statistics
  const stats = useMemo(() => {
    const total = students.length;
    const active = students.filter(s => s.status === 'Active').length;
    const femaleCount = students.filter(s => (s.gender || '').toLowerCase() === 'female').length;
    const maleCount = students.filter(s => (s.gender || '').toLowerCase() === 'male').length;
    const transferredOrAlumni = students.filter(s => ['Transferred', 'Alumni', 'Graduated', 'Dropped'].includes(s.status)).length;

    return { total, active, femaleCount, maleCount, transferredOrAlumni };
  }, [students]);

  // Filtering
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch =
        (student.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.admissionNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.rollNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.phone || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.fatherName || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchesClass = !selectedClassId || student.classId === selectedClassId;
      const matchesStatus = !selectedStatus || student.status === selectedStatus;
      const matchesGender = !selectedGender || (student.gender || '').toLowerCase() === selectedGender.toLowerCase();

      return matchesSearch && matchesClass && matchesStatus && matchesGender;
    });
  }, [students, searchTerm, selectedClassId, selectedStatus, selectedGender]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredStudents, currentPage]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;

  // Selection logic
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudentIds(filteredStudents.map(s => s.id));
    } else {
      setSelectedStudentIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedStudentIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Actions
  const handleAdd = () => {
    setSelectedStudent(null);
    setIsFormOpen(true);
  };

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setIsFormOpen(true);
  };

  const handleViewProfile = (student: Student) => {
    setSelectedStudent(student);
    setIsProfileOpen(true);
  };

  const handleOpenCertificates = (student: Student) => {
    setSelectedStudent(student);
    setIsCertOpen(true);
  };

  const handleOpenIDCard = (student: Student) => {
    setSelectedStudent(student);
    setIsIDCardOpen(true);
  };

  const handleOpenPromote = (student: Student) => {
    setSelectedStudent(student);
    setIsPromoteOpen(true);
  };

  const handleDelete = (student: Student) => {
    setSelectedStudent(student);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedStudent?.id) {
      await deleteRecord(selectedStudent.id);
      setIsDeleteOpen(false);
      setSelectedStudent(null);
    }
  };

  const handleFormSubmit = async (data: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedStudent?.id) {
      await updateRecord(selectedStudent.id, data);
    } else {
      await addRecord(data);
    }
    setIsFormOpen(false);
  };

  const handleUpdateDocuments = async (studentId: string, docs: StudentDocument[]) => {
    const existing = students.find(s => s.id === studentId);
    if (existing) {
      await updateRecord(studentId, { ...existing, documents: docs });
    }
  };

  // Single Promotion
  const handlePromoteSingle = async (studentId: string, toClassId: string, toSession: string, remarks?: string) => {
    const st = students.find(s => s.id === studentId);
    if (!st) return;

    const fromClassObj = classes.find(c => c.id === st.classId);
    const toClassObj = classes.find(c => c.id === toClassId);

    const promotionRecord = {
      id: 'prom_' + Date.now(),
      fromClass: fromClassObj?.className || st.classId,
      toClass: toClassObj?.className || toClassId,
      fromSession: st.academicSession || '2025-2026',
      toSession,
      date: new Date().toISOString().slice(0, 10),
      promotedBy: profile?.fullName || 'Principal Office',
      remarks: remarks || 'Academic Promotion'
    };

    const updatedTimeline = [
      {
        id: 'timeline_' + Date.now(),
        title: `Promoted to ${toClassObj?.className || toClassId}`,
        description: `Promoted from ${fromClassObj?.className || st.classId} to ${toClassObj?.className || toClassId} for session ${toSession}.`,
        type: 'Promotion' as const,
        date: new Date().toISOString().slice(0, 10),
        author: profile?.fullName || 'Principal'
      },
      ...(st.timeline || [])
    ];

    await updateRecord(studentId, {
      ...st,
      classId: toClassId,
      academicSession: toSession,
      promotionHistory: [promotionRecord, ...(st.promotionHistory || [])],
      timeline: updatedTimeline
    });
  };

  // Bulk Promotion
  const handlePromoteBulk = async (studentIds: string[], toClassId: string, toSession: string) => {
    for (const id of studentIds) {
      await handlePromoteSingle(id, toClassId, toSession, 'Bulk Session Promotion');
    }
    setSelectedStudentIds([]);
  };

  // Bulk Import
  const handleBulkImport = async (importedData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>[]) => {
    for (const record of importedData) {
      await addRecord(record);
    }
  };

  // Bulk Exports
  const handleExportExcel = () => {
    const dataToExport = (selectedStudentIds.length > 0
      ? students.filter(s => selectedStudentIds.includes(s.id))
      : filteredStudents
    ).map(s => ({
      'Admission No': s.admissionNo,
      'Roll No': s.rollNo,
      'Full Name': s.fullName,
      'Class': classes.find(c => c.id === s.classId)?.className || s.classId,
      'Section': s.section || 'A',
      'Gender': s.gender,
      'Date of Birth': s.dob,
      'Father Name': s.fatherName,
      'Mother Name': s.motherName,
      'Phone': s.phone,
      'Category': s.category || 'General',
      'Blood Group': s.bloodGroup || 'O+',
      'Aadhaar': s.aadhaar || 'N/A',
      'Status': s.status,
      'Admission Date': s.admissionDate
    }));

    exportToExcel(dataToExport, `Students_Roster_Hazrat_Aisha_${new Date().toISOString().slice(0, 10)}`);
  };

  const handleExportPDFList = () => {
    const list = selectedStudentIds.length > 0
      ? students.filter(s => selectedStudentIds.includes(s.id))
      : filteredStudents;

    const headers = ['#', 'Adm No', 'Roll', 'Student Name', 'Class', 'Gender', 'Father Name', 'Phone', 'Status'];
    const rows = list.map((s, idx) => [
      idx + 1,
      s.admissionNo,
      s.rollNo || '-',
      s.fullName,
      classes.find(c => c.id === s.classId)?.className || s.classId,
      s.gender,
      s.fatherName || '-',
      s.phone || '-',
      s.status
    ]);

    downloadReportPDF('Hazrat Aisha Academy - Official Student Directory', headers, rows, `Total Records: ${list.length}`);
  };

  const handleBulkGenerateIDCards = () => {
    const list = selectedStudentIds.length > 0
      ? students.filter(s => selectedStudentIds.includes(s.id))
      : filteredStudents;

    generateStudentIDCardPDF(list, classes);
  };

  const handleBulkDelete = async () => {
    if (selectedStudentIds.length === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedStudentIds.length} selected student record(s)?`)) {
      for (const id of selectedStudentIds) {
        await deleteRecord(id);
      }
      setSelectedStudentIds([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-start mb-[-1.5rem] relative z-20">
        <BackButton />
      </div>

      <PageHeader
        title="Student Management (ERP Phase 7)"
        description="Comprehensive Enterprise Student Information System, Admissions, Certificates & Identity Cards."
      />

      {/* Quick Statistics Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">Total Enrolled</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">{stats.total}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Users size={20} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">Active Students</p>
            <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats.active}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <UserCheck size={20} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">Female / Male</p>
            <h3 className="text-2xl font-black text-purple-600 dark:text-purple-400">{stats.femaleCount} / {stats.maleCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Award size={20} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">Alumni / Transferred</p>
            <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400">{stats.transferredOrAlumni}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <GraduationCap size={20} />
          </div>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="p-4 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
        {/* Top Controls Row */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <GlassInput
              placeholder="Search student, admission no, father, mobile..."
              className="pl-11"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>

          {!isTeacher && (
            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end">
              <GlassButton
                variant="ghost"
                onClick={() => setIsImportOpen(true)}
                className="flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800"
              >
                <Upload size={15} /> Bulk Import CSV
              </GlassButton>

              <GlassButton
                variant="ghost"
                onClick={() => { setSelectedStudent(null); setIsPromoteOpen(true); }}
                className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800"
              >
                <GraduationCap size={15} /> Bulk Promote
              </GlassButton>

              <GlassButton
                variant="primary"
                onClick={handleAdd}
                className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-indigo-600 text-white"
              >
                <Plus size={18} /> Add New Student
              </GlassButton>
            </div>
          )}
        </div>

        {/* Filter Badges Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200/60 dark:border-slate-800 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-500 flex items-center gap-1">
              <Filter size={14} /> Filters:
            </span>

            {/* Class Filter */}
            <select
              value={selectedClassId}
              onChange={(e) => { setSelectedClassId(e.target.value); setCurrentPage(1); }}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-200"
            >
              <option value="">All Classes</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.className}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-200"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Transferred">Transferred</option>
              <option value="Alumni">Alumni</option>
              <option value="Dropped">Dropped</option>
              <option value="Graduated">Graduated</option>
            </select>

            {/* Gender Filter */}
            <select
              value={selectedGender}
              onChange={(e) => { setSelectedGender(e.target.value); setCurrentPage(1); }}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-200"
            >
              <option value="">All Genders</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>

            {(selectedClassId || selectedStatus || selectedGender || searchTerm) && (
              <button
                onClick={() => {
                  setSelectedClassId('');
                  setSelectedStatus('');
                  setSelectedGender('');
                  setSearchTerm('');
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold transition-colors flex items-center gap-1"
              >
                <RefreshCw size={12} /> Reset Filters
              </button>
            )}
          </div>

          {/* Bulk Export Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportExcel}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 font-bold flex items-center gap-1.5 transition-colors"
              title="Export filtered roster to Excel"
            >
              <FileSpreadsheet size={14} /> Excel
            </button>
            <button
              onClick={handleExportPDFList}
              className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 font-bold flex items-center gap-1.5 transition-colors"
              title="Download Printable PDF Directory"
            >
              <FileText size={14} /> PDF List
            </button>
            <button
              onClick={handleBulkGenerateIDCards}
              className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 font-bold flex items-center gap-1.5 transition-colors"
              title="Batch Print ID Cards"
            >
              <CreditCard size={14} /> Batch ID Cards
            </button>
            {!isTeacher && selectedStudentIds.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold flex items-center gap-1.5 shadow"
              >
                <Trash2 size={14} /> Delete ({selectedStudentIds.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Student Directory Table */}
      <GlassTable>
        <thead>
          <tr>
            <th className="w-10 text-center">
              <input
                type="checkbox"
                checked={paginatedData.length > 0 && paginatedData.every(s => selectedStudentIds.includes(s.id))}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="rounded text-primary-600"
              />
            </th>
            <th>Student Info</th>
            <th>Class / Roll</th>
            <th>Parent & Contact</th>
            <th>Category & DOB</th>
            <th>Status</th>
            <th className="text-right">Enterprise Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={7} className="text-center py-12 text-slate-500">Loading student directory...</td></tr>
          ) : paginatedData.length === 0 ? (
            <tr><td colSpan={7} className="text-center py-12 text-slate-500">No students matched the criteria.</td></tr>
          ) : (
            paginatedData.map(student => {
              const isSelected = selectedStudentIds.includes(student.id);
              const className = classes.find(c => c.id === student.classId)?.className || student.classId;

              return (
                <tr key={student.id} className={isSelected ? 'bg-emerald-500/10 dark:bg-emerald-950/30' : ''}>
                  <td className="text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSelect(student.id)}
                      className="rounded text-emerald-600 accent-emerald-600"
                    />
                  </td>

                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex items-center justify-center flex-shrink-0 font-bold text-primary-500">
                        {student.photoUrl ? (
                          <img src={student.photoUrl} alt={student.fullName} className="w-full h-full object-cover" />
                        ) : (
                          student.fullName.charAt(0)
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-slate-100">{student.fullName}</p>
                        <p className="text-[11px] font-mono text-primary-600 dark:text-primary-400 font-semibold">
                          {student.admissionNo}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{className} {student.section ? `(${student.section})` : ''}</p>
                      <p className="text-[11px] text-slate-500">Roll: {student.rollNo || 'N/A'}</p>
                    </div>
                  </td>

                  <td>
                    <div>
                      <p className="font-medium text-slate-800 dark:text-slate-200">{student.fatherName || 'N/A'}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{student.phone || 'N/A'}</p>
                    </div>
                  </td>

                  <td>
                    <div>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{student.gender} • {student.bloodGroup || 'O+'}</p>
                      <p className="text-[11px] text-slate-500">DOB: {student.dob || 'N/A'}</p>
                    </div>
                  </td>

                  <td>
                    <GlassBadge variant={
                      student.status === 'Active' ? 'success' :
                      student.status === 'Transferred' ? 'warning' :
                      ['Alumni', 'Graduated'].includes(student.status) ? 'primary' : 'default'
                    }>
                      {student.status}
                    </GlassBadge>
                  </td>

                  <td>
                    <div className="flex justify-end items-center gap-1">
                      {/* View Profile */}
                      <button
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-blue-500 transition-colors"
                        onClick={() => handleViewProfile(student)}
                        title="View Complete Profile"
                      >
                        <Eye size={16} />
                      </button>

                      {!isTeacher && (
                        <>
                          {/* Print ID Card */}
                          <button
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-amber-500 transition-colors"
                            onClick={() => handleOpenIDCard(student)}
                            title="Generate Identity Card"
                          >
                            <CreditCard size={16} />
                          </button>

                          {/* Issue Certificate */}
                          <button
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-purple-500 transition-colors"
                            onClick={() => handleOpenCertificates(student)}
                            title="Issue Certificates (TC / Bonafide / Character)"
                          >
                            <Award size={16} />
                          </button>

                          {/* Promote */}
                          <button
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-emerald-500 transition-colors"
                            onClick={() => handleOpenPromote(student)}
                            title="Promote Student Grade"
                          >
                            <GraduationCap size={16} />
                          </button>

                          {/* Edit */}
                          <button
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-indigo-500 transition-colors"
                            onClick={() => handleEdit(student)}
                            title="Edit Student Details"
                          >
                            <Edit size={16} />
                          </button>

                          {/* Delete */}
                          <button
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-rose-500 transition-colors"
                            onClick={() => handleDelete(student)}
                            title="Delete Student Record"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </GlassTable>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Modals */}

      {/* Profile Modal */}
      {isProfileOpen && selectedStudent && (
        <StudentProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          student={selectedStudent}
          classes={classes}
          onEdit={(st) => { setIsProfileOpen(false); handleEdit(st); }}
          onIssueCertificate={(st) => { setIsProfileOpen(false); handleOpenCertificates(st); }}
          onGenerateIDCard={(st) => { setIsProfileOpen(false); handleOpenIDCard(st); }}
          onPromote={(st) => { setIsProfileOpen(false); handleOpenPromote(st); }}
          onUpdateDocuments={handleUpdateDocuments}
          readOnly={isTeacher}
        />
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <StudentFormModalAdvanced
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
          initialData={selectedStudent}
          classes={classes}
        />
      )}

      {/* Certificate Generator Modal */}
      {isCertOpen && selectedStudent && (
        <StudentCertificateModal
          isOpen={isCertOpen}
          onClose={() => setIsCertOpen(false)}
          student={selectedStudent}
          classes={classes}
        />
      )}

      {/* Identity Card Generator Modal */}
      {isIDCardOpen && selectedStudent && (
        <StudentIDCardModal
          isOpen={isIDCardOpen}
          onClose={() => setIsIDCardOpen(false)}
          student={selectedStudent}
          allStudents={students}
          classes={classes}
        />
      )}

      {/* Promotion Modal */}
      {isPromoteOpen && (
        <StudentPromotionModal
          isOpen={isPromoteOpen}
          onClose={() => setIsPromoteOpen(false)}
          student={selectedStudent}
          allStudents={students}
          classes={classes}
          onPromoteSingle={handlePromoteSingle}
          onPromoteBulk={handlePromoteBulk}
        />
      )}

      {/* Bulk Import Modal */}
      {isImportOpen && (
        <BulkImportModal
          isOpen={isImportOpen}
          onClose={() => setIsImportOpen(false)}
          classes={classes}
          onImport={handleBulkImport}
        />
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Student Record"
        message={`Are you sure you want to permanently delete ${selectedStudent?.fullName} (Adm No: ${selectedStudent?.admissionNo})? This action cannot be undone.`}
        confirmText="Permanently Delete"
      />
    </div>
  );
};
