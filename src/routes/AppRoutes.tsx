import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Login } from '../pages/auth/Login';
import { ForgotPassword } from '../pages/auth/ForgotPassword';
import { Unauthorized } from '../pages/error/Unauthorized';
import { NotFound } from '../pages/error/NotFound';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { DashboardLayout } from '../layouts/DashboardLayout';

const Home = lazy(() => import('../pages/public/Home').then(m => ({ default: m.Home })));
const About = lazy(() => import('../pages/public/About').then(m => ({ default: m.About })));
const Academics = lazy(() => import('../pages/public/Academics').then(m => ({ default: m.Academics })));
const FacilitiesPage = lazy(() => import('../pages/public/FacilitiesPage').then(m => ({ default: m.FacilitiesPage })));
const Admissions = lazy(() => import('../pages/public/Admissions').then(m => ({ default: m.Admissions })));
const GalleryPage = lazy(() => import('../pages/public/GalleryPage').then(m => ({ default: m.GalleryPage })));
const NoticeBoard = lazy(() => import('../pages/public/NoticeBoard').then(m => ({ default: m.NoticeBoard })));
const Downloads = lazy(() => import('../pages/public/Downloads').then(m => ({ default: m.Downloads })));
const FAQ = lazy(() => import('../pages/public/FAQ').then(m => ({ default: m.FAQ })));
const Contact = lazy(() => import('../pages/public/Contact').then(m => ({ default: m.Contact })));
const PublicCalendar = lazy(() => import('../pages/public/PublicCalendar').then(m => ({ default: m.PublicCalendar })));
const PublicCareers = lazy(() => import('../pages/public/Careers').then(m => ({ default: m.Careers })));
const PublicAlumni = lazy(() => import('../pages/public/Alumni').then(m => ({ default: m.PublicAlumni })));
const PublicHomework = lazy(() => import('../pages/public/PublicHomework').then(m => ({ default: m.PublicHomework })));
const PublicResults = lazy(() => import('../pages/public/PublicResults').then(m => ({ default: m.PublicResults })));

// Lazy loaded dashboard modules to improve chunk size
const DashboardHome = lazy(() => import('../pages/dashboard/DashboardHome').then(m => ({ default: m.DashboardHome })));
const DashboardStudents = lazy(() => import('../pages/dashboard/master/Students').then(m => ({ default: m.Students })));
const DashboardTeachers = lazy(() => import('../pages/dashboard/master/Teachers').then(m => ({ default: m.Teachers })));
const DashboardStaff = lazy(() => import('../pages/dashboard/master/Staff').then(m => ({ default: m.Staff })));
const DashboardClasses = lazy(() => import('../pages/dashboard/master/Classes').then(m => ({ default: m.Classes })));
const DashboardSubjects = lazy(() => import('../pages/dashboard/master/Subjects').then(m => ({ default: m.Subjects })));
const Attendance = lazy(() => import('../pages/dashboard/academic/Attendance').then(m => ({ default: m.Attendance })));
const ExamMarks = lazy(() => import('../pages/dashboard/academic/ExamMarks').then(m => ({ default: m.ExamMarks })));
const Results = lazy(() => import('../pages/dashboard/academic/Results').then(m => ({ default: m.Results })));
const Homework = lazy(() => import('../pages/dashboard/academic/Homework').then(m => ({ default: m.Homework })));
const Notices = lazy(() => import('../pages/dashboard/content/Notices').then(m => ({ default: m.Notices })));
const Gallery = lazy(() => import('../pages/dashboard/content/Gallery').then(m => ({ default: m.Gallery })));
const AcademicCalendar = lazy(() => import('../pages/dashboard/content/AcademicCalendar').then(m => ({ default: m.AcademicCalendar })));
const Documents = lazy(() => import('../pages/dashboard/content/Documents').then(m => ({ default: m.Documents })));
const Facilities = lazy(() => import('../pages/dashboard/content/Facilities').then(m => ({ default: m.Facilities })));
const Careers = lazy(() => import('../pages/dashboard/content/Careers').then(m => ({ default: m.Careers })));
const Alumni = lazy(() => import('../pages/dashboard/content/Alumni').then(m => ({ default: m.Alumni })));
const Enquiries = lazy(() => import('../pages/dashboard/content/Enquiries').then(m => ({ default: m.Enquiries })));
const DashboardAdmissions = lazy(() => import('../pages/dashboard/enterprise/Admissions').then(m => ({ default: m.Admissions })));
const Fees = lazy(() => import('../pages/dashboard/enterprise/Fees').then(m => ({ default: m.Fees })));
const Reports = lazy(() => import('../pages/dashboard/enterprise/Reports').then(m => ({ default: m.Reports })));
const AuditLogs = lazy(() => import('../pages/dashboard/enterprise/AuditLogs').then(m => ({ default: m.AuditLogs })));
const Settings = lazy(() => import('../pages/dashboard/enterprise/Settings').then(m => ({ default: m.Settings })));
const Users = lazy(() => import('../pages/dashboard/enterprise/Users').then(m => ({ default: m.Users })));

export function AppRoutes() {
  return (
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-900 text-primary-500 font-medium">Loading Module...</div>}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/academics" element={<Academics />} />
        <Route path="/facilities" element={<FacilitiesPage />} />
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/notices" element={<NoticeBoard />} />
        <Route path="/downloads" element={<Downloads />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/homework" element={<PublicHomework />} />
        <Route path="/results" element={<PublicResults />} />
        <Route path="/calendar" element={<PublicCalendar />} />
        <Route path="/careers" element={<PublicCareers />} />
        <Route path="/alumni" element={<PublicAlumni />} />

        {/* Admin / Principal Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin', 'principal']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          
          {/* Master Data Modules */}
          <Route path="students" element={<DashboardStudents />} />
          <Route path="teachers" element={<DashboardTeachers />} />
          <Route path="staff" element={<DashboardStaff />} />
          <Route path="classes" element={<DashboardClasses />} />
          <Route path="subjects" element={<DashboardSubjects />} />
          
          <Route path="attendance" element={<Attendance />} />
          <Route path="homework" element={<Homework />} />
          <Route path="exam-marks" element={<ExamMarks />} />
          <Route path="results" element={<Results />} />

          <Route path="admissions" element={<DashboardAdmissions />} />
          <Route path="fees" element={<Fees />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="notices" element={<Notices />} />
          <Route path="downloads" element={<Documents />} />
          <Route path="calendar" element={<AcademicCalendar />} />
          <Route path="facilities" element={<Facilities />} />
          <Route path="careers" element={<Careers />} />
          <Route path="alumni" element={<Alumni />} />
          <Route path="contact" element={<Enquiries />} />
          <Route path="documents" element={<Documents />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="users" element={<Users />} />
          <Route path="audit-logs" element={<AuditLogs />} />
        </Route>

        {/* Teacher Routes */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="homework" element={<Homework />} />
          <Route path="exam-marks" element={<ExamMarks />} />
          <Route path="results" element={<Results />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
