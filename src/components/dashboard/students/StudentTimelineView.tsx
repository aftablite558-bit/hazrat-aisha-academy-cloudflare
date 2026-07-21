import React from 'react';
import { StudentTimelineEvent } from '../../../types/master';
import { Award, GraduationCap, FileCheck, CreditCard, AlertCircle, Calendar, UserCheck } from 'lucide-react';

interface StudentTimelineViewProps {
  timeline?: StudentTimelineEvent[];
  admissionDate?: string;
  fullName?: string;
}

export const StudentTimelineView: React.FC<StudentTimelineViewProps> = ({
  timeline = [],
  admissionDate,
  fullName
}) => {
  // Default timeline events if empty
  const events: StudentTimelineEvent[] = timeline.length > 0 ? timeline : [
    {
      id: 'e1',
      title: 'Enrolled & Admitted',
      description: `Officially registered and enrolled as a student at Hazrat Aisha Academy.`,
      type: 'Admission',
      date: admissionDate || '2024-04-10',
      author: 'Admissions Office'
    },
    {
      id: 'e2',
      title: 'Academic Performance Verified',
      description: 'Term-1 Evaluation completed with satisfactory performance record.',
      type: 'Result',
      date: '2024-10-15',
      author: 'Examination Cell'
    },
    {
      id: 'e3',
      title: 'Tuition Fee Payment Cleared',
      description: 'Annual Fee installment paid via Cash/Online portal.',
      type: 'Fee Payment',
      date: '2025-01-08',
      author: 'Accounts Section'
    },
    {
      id: 'e4',
      title: 'Promoted to Current Grade',
      description: 'Successfully completed previous academic session and promoted to the next class.',
      type: 'Promotion',
      date: '2025-04-01',
      author: 'Principal Office'
    }
  ];

  const getEventIcon = (type: StudentTimelineEvent['type']) => {
    switch (type) {
      case 'Admission':
        return <UserCheck size={16} className="text-emerald-500" />;
      case 'Promotion':
        return <GraduationCap size={16} className="text-blue-500" />;
      case 'Result':
        return <Award size={16} className="text-amber-500" />;
      case 'Fee Payment':
        return <CreditCard size={16} className="text-teal-500" />;
      case 'Certificate':
        return <FileCheck size={16} className="text-purple-500" />;
      case 'Discipline':
        return <AlertCircle size={16} className="text-rose-500" />;
      default:
        return <Calendar size={16} className="text-slate-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Student Activity Timeline ({events.length} Events Recorded)
      </h4>

      <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-800 space-y-6">
        {events.map((event) => (
          <div key={event.id} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-[31px] top-0.5 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              {getEventIcon(event.type)}
            </div>

            {/* Content Box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between gap-2">
                <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">{event.title}</h5>
                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-200/60 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  {event.date}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{event.description}</p>
              {event.author && (
                <p className="text-[10px] text-slate-500 dark:text-slate-400 pt-1 font-medium">
                  Recorded by: {event.author}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
