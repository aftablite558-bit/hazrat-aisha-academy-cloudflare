import { useState } from 'react';
import { useToast } from '../../../contexts/ToastContext';
import { PageHeader } from '../../../components/common/PageHeader';
import { GlassCard } from '../../../components/common/GlassCard';
import { GlassButton } from '../../../components/common/GlassButton';
import { GlassSelect } from '../../../components/common/GlassSelect';
import { FileText, Download, Printer, FileSpreadsheet } from 'lucide-react';

export const Reports = () => {
  const { addToast } = useToast();
  const [reportType, setReportType] = useState('attendance');
  const [dateRange, setDateRange] = useState('month');
  const [classFilter, setClassFilter] = useState('all');

  const handleGenerate = (format: 'pdf' | 'excel' | 'print') => {
    addToast(`Generating ${reportType} report as ${format.toUpperCase()}...`);
    // In a real app, this would trigger actual report generation via API
  };

  const reportTypes = [
    { id: 'students', name: 'Student Demographics', desc: 'Detailed list of students with demographic data.' },
    { id: 'attendance', name: 'Attendance Summary', desc: 'Monthly/Yearly attendance statistics per class.' },
    { id: 'homework', name: 'Homework Completion', desc: 'Status of assignments and completion rates.' },
    { id: 'exam-marks', name: 'Examination Results', desc: 'Term-wise academic performance and grades.' },
    { id: 'admissions', name: 'Admissions Pipeline', desc: 'Status of all new admission applications.' },
    { id: 'fees', name: 'Fee Collection', desc: 'Detailed report on collected fees, dues, and fines.' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Reports & Analytics" description="Generate, export, and print comprehensive school reports." />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <GlassCard className="p-6 space-y-6">
            <h3 className="font-bold text-lg border-b border-white/10 pb-2">Report Configuration</h3>
            
            <GlassSelect label="Select Report Type" value={reportType} onChange={(e) => setReportType(e.target.value)}>
              {reportTypes.map(rt => <option key={rt.id} value={rt.id}>{rt.name}</option>)}
            </GlassSelect>
            
            <GlassSelect label="Date Range" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="term">This Term</option>
              <option value="year">Academic Year</option>
            </GlassSelect>
            
            <GlassSelect label="Filter by Class" value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
              <option value="all">All Classes</option>
              <option value="class-1">Class 1</option>
              <option value="class-2">Class 2</option>
              <option value="class-10">Class 10</option>
            </GlassSelect>
            
            <div className="pt-4 space-y-3">
              <GlassButton variant="primary" className="w-full flex items-center justify-center gap-2" onClick={() => handleGenerate('pdf')}>
                <Download size={18} /> Export as PDF
              </GlassButton>
              <GlassButton variant="glass" className="w-full flex items-center justify-center gap-2" onClick={() => handleGenerate('excel')}>
                <FileSpreadsheet size={18} /> Export as Excel
              </GlassButton>
              <GlassButton variant="glass" className="w-full flex items-center justify-center gap-2" onClick={() => handleGenerate('print')}>
                <Printer size={18} /> Print Report
              </GlassButton>
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-6 min-h-[400px] flex flex-col items-center justify-center text-center border-dashed border-2 border-white/20">
            <div className="w-20 h-20 bg-primary-500/10 text-primary-500 rounded-full flex items-center justify-center mb-6">
              <FileText size={40} />
            </div>
            <h3 className="text-xl font-bold mb-2">Report Preview</h3>
            <p className="text-muted-foreground max-w-md">
              Select your filters on the left and click generate to preview data here before exporting.
            </p>
            <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10 w-full max-w-md">
              <p className="text-sm font-semibold">Currently Selected:</p>
              <p className="text-primary-500 font-bold mt-1">{reportTypes.find(r => r.id === reportType)?.name}</p>
              <p className="text-xs text-muted-foreground mt-2">{reportTypes.find(r => r.id === reportType)?.desc}</p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
