const used = [
  'academic_sessions', 'classes', 'settings', 'subjects', 'teachers', 'students',
  'achievements', 'gallery', 'notices', 'testimonials', 'staff', 'calendar',
  'alumni', 'career_applications', 'careers', 'documents', 'enquiries',
  'facilities', 'admissions', 'audit_logs', 'fee_receipts', 'fee_structures',
  'fee_discounts', 'fee_fines', 'fee_refunds', 'attendance', 'results', 'fees',
  'exam_marks', 'exam_schedules', 'homework', 'feedback_tickets', 'teacher_leaves',
  'teacher_timetables'
];
const allowed = [
  'academic_sessions', 'teachers', 'calendar_events', 'feedback_tickets',
  'users', 'students', 'staff', 'teachers', 'classes', 'subjects', 'attendance',
  'homework', 'results', 'reportcards', 'admissions', 'fees', 'notices',
  'gallery', 'documents', 'calendar', 'achievements', 'testimonials',
  'audit_logs', 'settings', 'school_info', 'notifications', 'exam_marks',
  'alumni', 'sections', 'enquiries', 'careers', 'facilities', 'exam_schedules',
  'career_applications', 'teacher_leaves', 'teacher_timetables', 'fee_structures',
  'fee_receipts', 'fee_discounts', 'fee_fines', 'fee_refunds'
];

for (const col of used) {
  if (!allowed.includes(col)) {
    console.log('Missing in allowed:', col);
  }
}
