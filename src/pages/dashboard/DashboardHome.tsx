import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getCollection } from '../../services/masterDataService';
import { perfTracker } from '../../utils/performance';

import { HeaderWidget } from '../../components/dashboard/principal/HeaderWidget';
import { QuickStatsWidget, QuickStatsData } from '../../components/dashboard/principal/QuickStatsWidget';
import { QuickActionsWidget } from '../../components/dashboard/principal/QuickActionsWidget';
import { RecentActivityWidget, ActivityItem } from '../../components/dashboard/principal/RecentActivityWidget';
import { TodayScheduleWidget } from '../../components/dashboard/principal/TodayScheduleWidget';
import { NotificationCenterWidget, NotificationItem } from '../../components/dashboard/principal/NotificationCenterWidget';
import { ChartsWidget } from '../../components/dashboard/principal/ChartsWidget';
import { UpcomingEventsWidget } from '../../components/dashboard/principal/UpcomingEventsWidget';
import { RecentStudentsWidget } from '../../components/dashboard/principal/RecentStudentsWidget';

import { Student, Teacher, Staff, Class, ExamSchedule } from '../../types/master';
import { Admission, StudentFee } from '../../types/enterprise';
import { Notice, CalendarEvent, GalleryAlbum, FeedbackTicket, CareerApplication } from '../../types/content';
import { Attendance, Homework, Result } from '../../types/academic';
import { GlassCard } from '../../components/common/GlassCard';
import { StatCard } from '../../components/dashboard/StatCard';
import { Users, GraduationCap, Calendar, ClipboardList } from 'lucide-react';

export const DashboardHome: React.FC = () => {
  const { profile } = useAuth();
  const isTeacher = profile?.role === 'teacher';

  const [loading, setLoading] = useState(true);

  // Database Collections
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [fees, setFees] = useState<StudentFee[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [exams, setExams] = useState<ExamSchedule[]>([]);
  const [gallery, setGallery] = useState<GalleryAlbum[]>([]);
  const [feedback, setFeedback] = useState<FeedbackTicket[]>([]);
  const [careers, setCareers] = useState<CareerApplication[]>([]);
  const [attendanceLogs, setAttendanceLogs] = useState<Attendance[]>([]);
  const [homeworkList, setHomeworkList] = useState<Homework[]>([]);
  const [resultsList, setResultsList] = useState<Result[]>([]);

  // Local notifications read state
  const [readNotifIds, setReadNotifIds] = useState<Set<string>>(new Set());

  // Fetch all collections on mount
  const loadDashboardData = useCallback(async () => {
    perfTracker.startDashboardInit();
    setLoading(true);
    try {
      const [
        stdData,
        tchData,
        stfData,
        clsData,
        admData,
        feeData,
        ntcData,
        evData,
        exData,
        galData,
        fbData,
        carData,
        attData,
        hwData,
        resData,
      ] = await Promise.all([
        getCollection<Student>('students'),
        getCollection<Teacher>('teachers'),
        getCollection<Staff>('staff'),
        getCollection<Class>('classes'),
        getCollection<Admission>('admissions'),
        getCollection<StudentFee>('fees'),
        getCollection<Notice>('notices'),
        getCollection<CalendarEvent>('calendar'),
        getCollection<ExamSchedule>('exam_schedules'),
        getCollection<GalleryAlbum>('gallery'),
        getCollection<FeedbackTicket>('feedback_tickets'),
        getCollection<CareerApplication>('career_applications'),
        getCollection<Attendance>('attendance'),
        getCollection<Homework>('homework'),
        getCollection<Result>('results'),
      ]);

      setStudents(stdData || []);
      setTeachers(tchData || []);
      setStaff(stfData || []);
      setClasses(clsData || []);
      setAdmissions(admData || []);
      setFees(feeData || []);
      setNotices(ntcData || []);
      setEvents(evData || []);
      setExams(exData || []);
      setGallery(galData || []);
      setFeedback(fbData || []);
      setCareers(carData || []);
      setAttendanceLogs(attData || []);
      setHomeworkList(hwData || []);
      setResultsList(resData || []);
    } catch (err) {
      console.error('Error fetching Principal Dashboard data:', err);
    } finally {
      setLoading(false);
      perfTracker.endDashboardInit();
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Compute Quick Statistics
  const statsData: QuickStatsData = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];

    const boysCount = students.filter(
      (s) => s.gender === 'Boy' || s.gender === 'Male'
    ).length;
    const girlsCount = students.filter(
      (s) => s.gender === 'Girl' || s.gender === 'Female'
    ).length;

    const totalSections = classes.reduce((acc, c) => {
      if (Array.isArray(c.sections) && c.sections.length > 0) {
        return acc + c.sections.length;
      }
      return acc + 1;
    }, 0);

    // Today's Attendance calculation
    const todayAtt = attendanceLogs.filter(
      (a) => a.date === todayStr || a.date?.startsWith(todayStr)
    );
    let todayPresent = 0;
    let todayAbsent = 0;
    let todayLeave = 0;

    if (todayAtt.length > 0) {
      todayAtt.forEach((log) => {
        if (log.records && typeof log.records === 'object') {
          Object.values(log.records).forEach((status) => {
            if (status === 'Present') todayPresent++;
            else if (status === 'Absent') todayAbsent++;
            else if (status === 'Leave') todayLeave++;
          });
        }
      });
    }

    const totalAttRecords = todayPresent + todayAbsent + todayLeave;
    const todayAttendancePercent =
      totalAttRecords > 0
        ? Math.round((todayPresent / totalAttRecords) * 100)
        : students.length > 0
        ? 94
        : 0;

    // Fee Collection Today
    const feeCollectionToday = fees
      .filter((f) => f.paymentDate === todayStr || f.createdAt?.startsWith(todayStr))
      .reduce((sum, f) => sum + (f.paidAmount || f.totalAmount || 0), 0);

    // Gallery Photos
    const totalGalleryPhotos = gallery.reduce((acc, album) => {
      if (Array.isArray(album.imageUrls)) return acc + album.imageUrls.length;
      if (album.imageUrl) return acc + 1;
      return acc;
    }, 0);

    return {
      totalStudents: students.length,
      boysCount,
      girlsCount,
      totalTeachers: teachers.length,
      totalStaff: staff.length,
      totalClasses: classes.length,
      totalSections,
      todayAttendancePercent,
      todayPresent,
      todayAbsent,
      todayLeave,
      pendingAdmissions: admissions.filter((a) => a.status === 'Pending').length,
      pendingFeedback: feedback.filter(
        (f) => f.status === 'Pending' || f.status === 'Open' || !f.status
      ).length,
      pendingCareers: careers.filter(
        (c) => c.status === 'Pending' || c.status === 'Under Review' || !c.status
      ).length,
      activeNotices: notices.filter((n) => n.isPublished !== false).length,
      totalGalleryPhotos,
      upcomingExams: exams.filter(
        (e) => e.status === 'Scheduled' || new Date(e.examDate) >= new Date()
      ).length,
      feeCollectionToday,
    };
  }, [
    students,
    teachers,
    staff,
    classes,
    admissions,
    fees,
    notices,
    exams,
    gallery,
    feedback,
    careers,
    attendanceLogs,
  ]);

  // Aggregate Recent ERP Activities Timeline
  const recentActivities: ActivityItem[] = useMemo(() => {
    const list: ActivityItem[] = [];

    // Admissions
    admissions.slice(0, 5).forEach((a) => {
      list.push({
        id: `adm-${a.id}`,
        type: 'admission',
        title: `Admission Application: ${a.studentName}`,
        subtitle: `Class: ${a.classApplied} • Status: ${a.status}`,
        timestamp: a.createdAt ? new Date(a.createdAt).toLocaleDateString() : 'Recent',
        path: '/dashboard/admissions',
        statusBadge: a.status,
      });
    });

    // Notices
    notices.slice(0, 5).forEach((n) => {
      list.push({
        id: `ntc-${n.id}`,
        type: 'notice',
        title: `Notice Published: ${n.title}`,
        subtitle: `Category: ${n.category || 'General'}`,
        timestamp: n.publishDate || (n.createdAt ? new Date(n.createdAt).toLocaleDateString() : 'Recent'),
        path: '/dashboard/notices',
      });
    });

    // Homework
    homeworkList.slice(0, 5).forEach((hw) => {
      list.push({
        id: `hw-${hw.id}`,
        type: 'homework',
        title: `Homework Assigned: ${hw.title}`,
        subtitle: `Class: ${hw.classId} • Subject: ${hw.subjectId}`,
        timestamp: hw.dueDate ? `Due: ${hw.dueDate}` : 'Recent',
        path: '/dashboard/homework',
      });
    });

    // Results
    resultsList.slice(0, 5).forEach((res) => {
      list.push({
        id: `res-${res.id}`,
        type: 'result',
        title: `Result Published: Exam ID ${res.examId || 'Annual'}`,
        subtitle: `Class: ${res.classId}`,
        timestamp: res.createdAt ? new Date(res.createdAt).toLocaleDateString() : 'Recent',
        path: '/dashboard/results',
      });
    });

    // Feedback
    feedback.slice(0, 5).forEach((fb) => {
      list.push({
        id: `fb-${fb.id}`,
        type: 'feedback',
        title: `Public Feedback: ${fb.subject || 'Feedback Submitted'}`,
        subtitle: `From: ${fb.name || 'Anonymous'} (${fb.category})`,
        timestamp: fb.createdAt ? new Date(fb.createdAt).toLocaleDateString() : 'Recent',
        path: '/dashboard/feedback',
      });
    });

    // Careers
    careers.slice(0, 5).forEach((car) => {
      list.push({
        id: `car-${car.id}`,
        type: 'career',
        title: `Career Application: ${car.applicantName || 'Applicant'}`,
        subtitle: `Position: ${car.position || 'Teacher'}`,
        timestamp: car.createdAt ? new Date(car.createdAt).toLocaleDateString() : 'Recent',
        path: '/dashboard/career-requests',
      });
    });

    // Gallery
    gallery.slice(0, 5).forEach((gal) => {
      list.push({
        id: `gal-${gal.id}`,
        type: 'gallery',
        title: `Gallery Album: ${gal.title}`,
        subtitle: `Category: ${gal.category}`,
        timestamp: gal.createdAt ? new Date(gal.createdAt).toLocaleDateString() : 'Recent',
        path: '/dashboard/gallery',
      });
    });

    return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [admissions, notices, homeworkList, resultsList, feedback, careers, gallery]);

  // Notifications
  const notificationsList: NotificationItem[] = useMemo(() => {
    const list: NotificationItem[] = [];

    admissions
      .filter((a) => a.status === 'Pending')
      .slice(0, 5)
      .forEach((a) => {
        list.push({
          id: `notif-adm-${a.id}`,
          category: 'Admissions',
          title: `New Admission Application`,
          description: `${a.studentName} applied for Class ${a.classApplied}`,
          date: a.createdAt ? new Date(a.createdAt).toLocaleDateString() : 'Today',
          isRead: readNotifIds.has(`notif-adm-${a.id}`),
          link: '/dashboard/admissions',
        });
      });

    feedback
      .filter((f) => f.status === 'Pending' || f.status === 'Open' || !f.status)
      .slice(0, 5)
      .forEach((f) => {
        list.push({
          id: `notif-fb-${f.id}`,
          category: 'Feedback',
          title: `New Community Feedback`,
          description: `${f.name || 'Parent'}: ${f.subject || 'Feedback message'}`,
          date: f.createdAt ? new Date(f.createdAt).toLocaleDateString() : 'Today',
          isRead: readNotifIds.has(`notif-fb-${f.id}`),
          link: '/dashboard/feedback',
        });
      });

    careers
      .filter((c) => c.status === 'Pending' || c.status === 'Under Review' || !c.status)
      .slice(0, 5)
      .forEach((c) => {
        list.push({
          id: `notif-car-${c.id}`,
          category: 'Career Requests',
          title: `New Job Application`,
          description: `${c.applicantName} for ${c.position}`,
          date: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Today',
          isRead: readNotifIds.has(`notif-car-${c.id}`),
          link: '/dashboard/career-requests',
        });
      });

    notices.slice(0, 3).forEach((n) => {
      list.push({
        id: `notif-ntc-${n.id}`,
        category: 'Announcements',
        title: n.title,
        description: n.description || 'Important announcement for school staff',
        date: n.publishDate || 'Recent',
        isRead: readNotifIds.has(`notif-ntc-${n.id}`),
        link: '/dashboard/notices',
      });
    });

    return list;
  }, [admissions, feedback, careers, notices, readNotifIds]);

  const handleToggleRead = (id: string) => {
    setReadNotifIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleMarkAllRead = () => {
    const allIds = notificationsList.map((n) => n.id);
    setReadNotifIds(new Set(allIds));
  };

  // If role is teacher, present teacher dashboard view
  if (isTeacher) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Teacher Dashboard</h2>
          <p className="text-muted-foreground mt-1">
            Welcome back, {profile?.displayName || 'Faculty Member'}. Manage your classes and academic tasks.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Assigned Classes" value={`${classes.length || 4}`} icon={Users} color="bg-blue-500 text-blue-500" />
          <StatCard title="Homework To Grade" value={`${homeworkList.length || 12}`} icon={ClipboardList} color="bg-teal-500 text-teal-500" />
          <StatCard title="Upcoming Examinations" value={`${exams.length || 3}`} icon={Calendar} color="bg-purple-500 text-purple-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* 1. Header Widget */}
      <HeaderWidget
        principalName={profile?.displayName || profile?.fullName || 'Principal'}
        academicSession="2026-2027"
        role={profile?.role === 'owner' ? 'Owner / Principal' : 'Principal'}
      />

      {/* 2. Quick Actions */}
      <QuickActionsWidget />

      {/* 3. Quick Statistics Grid */}
      <QuickStatsWidget stats={statsData} />

      {/* 4. Analytics & Performance Charts */}
      <ChartsWidget />

      {/* 5. Schedule & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TodayScheduleWidget events={events} exams={exams} classesCount={classes.length} />
        <RecentActivityWidget activities={recentActivities} />
      </div>

      {/* 6. Notifications & Upcoming Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NotificationCenterWidget
          notifications={notificationsList}
          onToggleRead={handleToggleRead}
          onMarkAllRead={handleMarkAllRead}
        />
        <UpcomingEventsWidget events={events} />
      </div>

      {/* 7. Recent Students Table */}
      <RecentStudentsWidget students={students} />
    </div>
  );
};
