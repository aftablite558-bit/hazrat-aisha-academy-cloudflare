const fs = require('fs');
let file = 'src/components/layout/Sidebar.tsx';
let c = fs.readFileSync(file, 'utf8');

const getMenuItemsCode = `
    const baseItems = [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
      { icon: Users, label: 'Students', path: '/dashboard/students' },
      { icon: UserCircle, label: 'Teachers', path: '/dashboard/teachers' },
      { icon: Shield, label: 'Staff', path: '/dashboard/staff' },
      { icon: Home, label: 'Classes', path: '/dashboard/classes' },
      { icon: BookOpen, label: 'Subjects', path: '/dashboard/subjects' },
      { icon: ClipboardList, label: 'Attendance', path: '/dashboard/attendance' },
      { icon: Book, label: 'Homework', path: '/dashboard/homework' },
      { icon: PenTool, label: 'Exam Marks', path: '/dashboard/exam-marks' },
      { icon: Calendar, label: 'Exam Schedule', path: '/dashboard/exam-schedule' },
      { icon: BookMarked, label: 'Results', path: '/dashboard/results' },
    ];
    
    if (['owner', 'super_admin', 'admin', 'principal'].includes(profile?.role || '')) {
      baseItems.push({ icon: Contact, label: 'Admission Requests', path: '/dashboard/admissions' });
    }
    
    baseItems.push(
      { icon: Wallet, label: 'Fees', path: '/dashboard/fees' },
      { icon: Image, label: 'Gallery', path: '/dashboard/gallery' },
      { icon: Award, label: 'Achievements', path: '/dashboard/achievements' },
      { icon: MessageCircle, label: 'Testimonials', path: '/dashboard/testimonials' },
      { icon: FileText, label: 'Notice Board', path: '/dashboard/notices' },
      { icon: Download, label: 'Downloads', path: '/dashboard/downloads' },
      { icon: Calendar, label: 'Academic Calendar', path: '/dashboard/calendar' },
      { icon: Shield, label: 'Facilities', path: '/dashboard/facilities' },
      { icon: Briefcase, label: 'Careers', path: '/dashboard/careers' },
      { icon: FileText, label: 'Career Requests', path: '/dashboard/career-requests' },
      { icon: Users, label: 'Alumni', path: '/dashboard/alumni' },
      { icon: Contact, label: 'Contact', path: '/dashboard/contact' },
      { icon: FileText, label: 'Documents', path: '/dashboard/documents' },
      { icon: FileBarChart, label: 'Reports', path: '/dashboard/reports' },
      { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
      { icon: Shield, label: 'User Management', path: '/dashboard/users' },
      { icon: Shield, label: 'Audit Logs', path: '/dashboard/audit-logs' },
      { icon: Database, label: 'Backup & Restore', path: '/dashboard/backup' }
    );
    
    return baseItems;
  };
`;

c = c.replace(/return \[\n      \{ icon: LayoutDashboard[\s\S]*Backup & Restore', path: '\/dashboard\/backup' \},\n    \];\n  \};/, getMenuItemsCode);
fs.writeFileSync(file, c);
