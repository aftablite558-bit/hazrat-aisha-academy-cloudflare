import { BaseEntity, Class, Student } from '../../../types/master';
import { SystemSettings } from '../../../types';
import { useState, useMemo, useEffect } from 'react';
import { useToast } from '../../../contexts/ToastContext';
import { PageHeader } from '../../../components/common/PageHeader';
import { GlassCard } from '../../../components/common/GlassCard';
import { GlassButton } from '../../../components/common/GlassButton';
import { GlassSelect } from '../../../components/common/GlassSelect';
import { GlassInput } from '../../../components/common/GlassInput';
import { BackButton } from '../../../components/common/BackButton';

import { FileText, Download, Printer, FileSpreadsheet, Search } from 'lucide-react';
import { useMasterData } from '../../../hooks/useMasterData';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const Reports = () => {
  const { addToast } = useToast();
  
  // Collections
  const { data: classes } = useMasterData<Class>('classes');
  const { data: students } = useMasterData<Student>('students');
  const { data: attendances } = useMasterData('attendance');
  const { data: results } = useMasterData('results');
  const { data: fees } = useMasterData('fees');
  const { data: admissions } = useMasterData('admissions');
  const { data: settings } = useMasterData<SystemSettings>('settings');

  const [reportType, setReportType] = useState('students');
  const [dateRange, setDateRange] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const reportTypes = [
    { id: 'students', name: 'Student Reports', desc: 'Detailed list of students with demographic data.' },
    { id: 'attendance', name: 'Attendance Reports', desc: 'Monthly/Yearly attendance statistics per class.' },
    { id: 'results', name: 'Result Reports', desc: 'Term-wise academic performance and grades.' },
    { id: 'admissions', name: 'Admission Reports', desc: 'Status of all new admission applications.' },
    { id: 'fees', name: 'Fees Reports', desc: 'Detailed report on collected fees, dues, and fines.' },
  ];

  const getFilteredData = () => {
    let data: unknown[] = [];
    if (reportType === 'students') data = students || [];
    if (reportType === 'attendance') data = attendances || [];
    if (reportType === 'results') data = results || [];
    if (reportType === 'admissions') data = admissions || [];
    if (reportType === 'fees') data = fees || [];

    return data.filter((item: unknown) => {
      let matches = true;

      // Class Filter
      if (classFilter !== 'all') {
        if ((item as Record<string, string>).classId) matches = matches && (item as Record<string, string>).classId === classFilter;
        else if ((item as Record<string, string>).classApplied) matches = matches && (item as Record<string, string>).classApplied === classFilter;
      }

      // Status Filter
      if (statusFilter !== 'all') {
        if ((item as Record<string, string>).status) matches = matches && (item as Record<string, string>).status.toLowerCase() === statusFilter.toLowerCase();
      }

      // Search Filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const searchStr = JSON.stringify(item).toLowerCase();
        matches = matches && searchStr.includes(q);
      }

      // Date Filter
      if (dateRange !== 'all') {
        let itemDate = (item as Record<string, string>).createdAt || (item as Record<string, string>).date || (item as Record<string, string>).dueDate;
        if (itemDate) {
          const d = new Date(itemDate as string);
          const now = new Date();
          if (dateRange === 'today') {
            matches = matches && d.toDateString() === now.toDateString();
          } else if (dateRange === 'week') {
            const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            matches = matches && d >= lastWeek;
          } else if (dateRange === 'month') {
            matches = matches && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
          }
        }
      }
      return matches;
    });
  };

  const getTableColumns = () => {
    if (reportType === 'students') return ['Admission No', 'Roll No', 'Name', 'Class', 'Gender', 'Phone', 'Status'];
    if (reportType === 'attendance') return ['Date', 'Class', 'Student ID', 'Status'];
    if (reportType === 'results') return ['Exam', 'Student ID', 'Class', 'Total Marks', 'Grade'];
    if (reportType === 'admissions') return ['App No', 'Name', 'Class Applied', 'Phone', 'Status'];
    if (reportType === 'fees') return ['Receipt', 'Student', 'Class', 'Amount', 'Date', 'Status'];
    return [];
  };

  const getTableRows = (data: unknown[]) => {
    const getClass = (id: string) => classes.find(c => c.id === id)?.className || id || 'N/A';
    const getStudent = (id: string) => students.find(s => s.id === id)?.fullName || id || 'N/A';

    if (reportType === 'students') return data.map(item => [(item as Record<string, unknown>).admissionNo as string, (item as Record<string, unknown>).rollNo as string, (item as Record<string, unknown>).fullName as string, getClass((item as Record<string, string>).classId), (item as Record<string, unknown>).gender as string, (item as Record<string, unknown>).phone as string, (item as Record<string, string>).status]);
    if (reportType === 'attendance') return data.map(item => [(item as Record<string, string>).date, getClass((item as Record<string, string>).classId), getStudent((item as Record<string, unknown>).studentId as string), (item as Record<string, string>).status]);
    if (reportType === 'results') return data.map(item => [(item as Record<string, unknown>).examName as string, getStudent((item as Record<string, unknown>).studentId as string), getClass((item as Record<string, string>).classId), (item as Record<string, unknown>).totalObtainedMarks as string, (item as Record<string, unknown>).grade as string]);
    if (reportType === 'admissions') return data.map(item => [(item as Record<string, unknown>).admissionNumber as string, (item as Record<string, unknown>).studentName as string, getClass((item as Record<string, string>).classApplied), (item as Record<string, unknown>).parentPhone as string, (item as Record<string, string>).status]);
    if (reportType === 'fees') return data.map(item => [(item as Record<string, unknown>).receiptNumber as string, (item as Record<string, unknown>).studentName as string || getStudent((item as Record<string, unknown>).studentId as string), getClass((item as Record<string, string>).classId), (item as Record<string, unknown>).amount as string, (item as Record<string, string>).dueDate || (item as Record<string, string>).date, (item as Record<string, string>).status]);
    return [];
  };

  const schoolName = settings[0]?.schoolName || 'Hazrat Aisha Academy';

  const handleGenerate = (format: 'pdf' | 'excel' | 'print') => {
    const filteredData = getFilteredData();
    const columns = getTableColumns();
    const rows = getTableRows(filteredData);
    const title = reportTypes.find(r => r.id === reportType)?.name || 'Report';
    const dateStr = new Date().toLocaleString();

    if (format === 'pdf' || format === 'print') {
      const doc = new jsPDF({ orientation: columns.length > 5 ? 'landscape' : 'portrait' });
      
      // Header
      doc.setFontSize(18);
      doc.text(schoolName, 14, 15);
      doc.setFontSize(14);
      doc.text(title, 14, 23);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated: ${dateStr}`, 14, 29);
      
      (doc as jsPDF & { autoTable: (options: unknown) => unknown }).autoTable({
        startY: 35,
        head: [columns],
        body: rows,
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] },
        styles: { fontSize: 9 },
      });

      if (format === 'pdf') {
        doc.save(`${title.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
        addToast(`PDF downloaded successfully`, 'success');
      } else {
        doc.autoPrint();
        window.open(doc.output('bloburl'), '_blank');
        addToast(`Opening print dialog...`, 'success');
      }
    } else if (format === 'excel') {
      const ws = XLSX.utils.aoa_to_sheet([columns, ...rows]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Report');
      XLSX.writeFile(wb, `${title.replace(/\s+/g, '_')}_${Date.now()}.xlsx`);
      addToast(`Excel downloaded successfully`, 'success');
    }
  };

  const filteredPreview = getFilteredData();
  const columns = getTableColumns();
  const rows = getTableRows(filteredPreview);

  return (
    <div className="space-y-6">
      <div className="flex justify-start mb-[-1.5rem] relative z-20">
        <BackButton />
      </div>
      <PageHeader title="Reports & Analytics" description="Generate, export, and print comprehensive school reports." />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <GlassCard className="p-6 space-y-4">
            <h3 className="font-bold text-lg border-b border-white/10 pb-2">Report Configuration</h3>
            
            <GlassSelect label="Select Report Type" value={reportType} onChange={(e) => setReportType(e.target.value)}>
              {reportTypes.map(rt => <option key={rt.id} value={rt.id}>{rt.name}</option>)}
            </GlassSelect>
            
            <GlassSelect label="Date Range" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </GlassSelect>
            
            <GlassSelect label="Filter by Class" value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
              <option value="all">All Classes</option>
              {classes?.map((c: Class) => <option key={c.id} value={c.id}>{c.className || (c as unknown as Record<string, string>).name}</option>)}
            </GlassSelect>

            <GlassSelect label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active / Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected / Inactive</option>
            </GlassSelect>

            <div className="relative">
              <label className="block text-sm font-medium mb-1">Search</label>
              <GlassInput placeholder="Search names, ids..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            
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
          <GlassCard className="p-6 min-h-[400px] flex flex-col items-center justify-center text-center border-dashed border-2 border-white/20 overflow-x-auto">
            {rows.length > 0 ? (
              <div className="w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">{reportTypes.find(r => r.id === reportType)?.name}</h3>
                  <span className="text-sm text-muted-foreground">{rows.length} records found</span>
                </div>
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      {columns.map(c => <th key={c} className="p-2 whitespace-nowrap">{c}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.slice(0, 10).map((r, i) => (
                      <tr key={i} className="border-b border-white/5">
                        {r.map((cell: React.ReactNode, j: number) => <td key={j} className="p-2 whitespace-nowrap">{cell}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {rows.length > 10 && (
                  <p className="text-xs text-muted-foreground mt-4">Showing first 10 rows. Export to see all {rows.length} records.</p>
                )}
              </div>
            ) : (
              <>
                <div className="w-20 h-20 bg-primary-500/10 text-primary-500 rounded-full flex items-center justify-center mb-6">
                  <FileText size={40} />
                </div>
                <h3 className="text-xl font-bold mb-2">No Records Found</h3>
                <p className="text-muted-foreground max-w-md">
                  Adjust your filters or select a different report type.
                </p>
              </>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
