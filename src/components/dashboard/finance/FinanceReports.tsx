import { useState, useMemo } from 'react';
import { GlassTable } from '../../common/GlassTable';
import { GlassButton } from '../../common/GlassButton';
import { GlassInput } from '../../common/GlassInput';
import { GlassSelect } from '../../common/GlassSelect';
import { FeeReceipt, FeeRefundRecord, FeeDiscountRecord, FeeFineRecord } from '../../../types/finance';
import { Student, Class } from '../../../types/master';
import { exportToExcel, downloadReportPDF } from '../../../utils/financeUtils';
import { FileSpreadsheet, Download, FileText, Search, Printer } from 'lucide-react';
import { useToast } from '../../..//contexts/ToastContext';

interface FinanceReportsProps {
  receipts: FeeReceipt[];
  students: Student[];
  classes: Class[];
  discounts: FeeDiscountRecord[];
  fines: FeeFineRecord[];
  refunds: FeeRefundRecord[];
}

export const FinanceReports = ({
  receipts,
  students,
  classes,
  discounts,
  fines,
  refunds
}: FinanceReportsProps) => {
  const { addToast } = useToast();
  const [reportType, setReportType] = useState<
    'daily' | 'monthly' | 'ledger' | 'register' | 'outstanding' | 'discount' | 'fine' | 'refund'
  >('daily');

  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Daily collection filter
  const dailyData = useMemo(() => {
    return receipts.filter(r => {
      const matchesDate = r.paymentDate >= startDate && r.paymentDate <= endDate;
      const matchesClass = selectedClass === 'All' || r.classId === selectedClass;
      const matchesSearch = !searchTerm || (r.studentName || '').toLowerCase().includes(searchTerm.toLowerCase()) || (r.receiptNumber || '').toLowerCase().includes(searchTerm.toLowerCase());
      return matchesDate && matchesClass && matchesSearch;
    });
  }, [receipts, startDate, endDate, selectedClass, searchTerm]);

  // Outstanding report filter
  const outstandingData = useMemo(() => {
    return students.map(st => {
      const stReceipts = receipts.filter(r => r.studentId === st.id || r.admissionNo === st.admissionNo);
      const paid = stReceipts.reduce((sum, r) => sum + (Number(r.amountPaid) || 0), 0);
      const annualFee = 25000;
      const balance = Math.max(0, annualFee - paid);
      return {
        student: st,
        annualFee,
        paid,
        balance
      };
    }).filter(item => {
      const matchesClass = selectedClass === 'All' || item.student.classId === selectedClass;
      const matchesSearch = !searchTerm || (item.student.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) || (item.student.admissionNo || '').toLowerCase().includes(searchTerm.toLowerCase());
      return item.balance > 0 && matchesClass && matchesSearch;
    });
  }, [students, receipts, selectedClass, searchTerm]);

  // Export to Excel handler
  const handleExportExcel = () => {
    let exportData: any[] = [];
    let fileName = `report_${reportType}`;

    if (reportType === 'daily' || reportType === 'monthly' || reportType === 'register') {
      exportData = dailyData.map(r => ({
        'Receipt No': r.receiptNumber,
        'Date': r.paymentDate,
        'Student Name': r.studentName,
        'Admission No': r.admissionNo,
        'Class': r.classId,
        'Payment Mode': r.paymentMode,
        'Payment Type': r.paymentType,
        'Subtotal': r.subtotal,
        'Discount': r.discountAmount,
        'Fine': r.fineAmount,
        'Amount Paid': r.amountPaid,
        'Balance Due': r.balanceDue,
        'Cashier': r.collectedBy
      }));
      fileName = `${reportType}_fee_collection_${startDate}_to_${endDate}`;
    } else if (reportType === 'outstanding') {
      exportData = outstandingData.map(o => ({
        'Student Name': o.student.fullName,
        'Admission No': o.student.admissionNo,
        'Class': o.student.classId,
        'Guardian Name': o.student.fatherName || o.student.motherName,
        'Phone': o.student.phone,
        'Annual Fee': o.annualFee,
        'Total Paid': o.paid,
        'Outstanding Balance': o.balance
      }));
      fileName = `outstanding_fee_report_${new Date().toISOString().split('T')[0]}`;
    } else if (reportType === 'discount') {
      exportData = discounts.map(d => ({
        'Student Name': d.studentName,
        'Admission No': d.admissionNo,
        'Class': d.classId,
        'Category': d.category,
        'Type': d.discountType,
        'Value': d.value,
        'Applied Amount': d.appliedAmount,
        'Notes': d.approvalNotes,
        'Approved By': d.approvedBy
      }));
      fileName = `discount_report`;
    } else if (reportType === 'fine') {
      exportData = fines.map(f => ({
        'Student Name': f.studentName,
        'Admission No': f.admissionNo,
        'Class': f.classId,
        'Fine Type': f.fineType,
        'Reason': f.reason,
        'Amount': f.amount,
        'Issue Date': f.issueDate,
        'Status': f.status
      }));
      fileName = `fines_report`;
    } else if (reportType === 'refund') {
      exportData = refunds.map(rf => ({
        'Student Name': rf.studentName,
        'Admission No': rf.admissionNo,
        'Class': rf.classId,
        'Receipt No': rf.receiptNumber,
        'Refund Date': rf.refundDate,
        'Refund Mode': rf.refundMode,
        'Amount': rf.refundAmount,
        'Reason': rf.reason,
        'Approved By': rf.approvedBy
      }));
      fileName = `refunds_report`;
    }

    if (exportData.length === 0) {
      addToast('No data available to export in current selection.', 'error');
      return;
    }

    exportToExcel(exportData, fileName);
    addToast('Excel file exported successfully!', 'success');
  };

  // Export to PDF handler
  const handleExportPDF = () => {
    if (reportType === 'daily' || reportType === 'monthly' || reportType === 'register') {
      const headers = ['Receipt #', 'Date', 'Student Name', 'Class', 'Mode', 'Amount Paid', 'Balance'];
      const rows = dailyData.map(r => [
        r.receiptNumber,
        r.paymentDate,
        r.studentName,
        r.classId,
        r.paymentMode,
        `Rs. ${r.amountPaid}`,
        `Rs. ${r.balanceDue}`
      ]);
      const totalPaid = dailyData.reduce((s, r) => s + (Number(r.amountPaid) || 0), 0);
      downloadReportPDF(
        `${reportType.toUpperCase()} COLLECTION REPORT (${startDate} to ${endDate})`,
        headers,
        rows,
        `Total Records: ${dailyData.length} | Total Collection: Rs. ${totalPaid.toLocaleString('en-IN')}`
      );
    } else if (reportType === 'outstanding') {
      const headers = ['Student Name', 'Admission #', 'Class', 'Guardian', 'Phone', 'Paid', 'Balance Due'];
      const rows = outstandingData.map(o => [
        o.student.fullName,
        o.student.admissionNo,
        o.student.classId,
        o.student.fatherName || 'N/A',
        o.student.phone || 'N/A',
        `Rs. ${o.paid}`,
        `Rs. ${o.balance}`
      ]);
      const totalBal = outstandingData.reduce((s, o) => s + o.balance, 0);
      downloadReportPDF(
        'OUTSTANDING DUES REPORT',
        headers,
        rows,
        `Total Pending Students: ${outstandingData.length} | Total Outstanding Dues: Rs. ${totalBal.toLocaleString('en-IN')}`
      );
    } else if (reportType === 'discount') {
      const headers = ['Student Name', 'Class', 'Category', 'Type', 'Amount (Rs)', 'Approved By'];
      const rows = discounts.map(d => [
        d.studentName,
        d.classId,
        d.category,
        d.discountType,
        `Rs. ${d.appliedAmount}`,
        d.approvedBy
      ]);
      downloadReportPDF('DISCOUNTS & CONCESSIONS REPORT', headers, rows);
    } else if (reportType === 'fine') {
      const headers = ['Student Name', 'Class', 'Fine Type', 'Reason', 'Amount', 'Status'];
      const rows = fines.map(f => [
        f.studentName,
        f.classId,
        f.fineType,
        f.reason,
        `Rs. ${f.amount}`,
        f.status
      ]);
      downloadReportPDF('FINES & LATE FEES REPORT', headers, rows);
    } else if (reportType === 'refund') {
      const headers = ['Student Name', 'Class', 'Receipt #', 'Refund Date', 'Mode', 'Amount'];
      const rows = refunds.map(rf => [
        rf.studentName,
        rf.classId,
        rf.receiptNumber || 'N/A',
        rf.refundDate,
        rf.refundMode,
        `Rs. ${rf.refundAmount}`
      ]);
      downloadReportPDF('REFUNDS ISSUED REPORT', headers, rows);
    }

    addToast('PDF report generated successfully!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Report Type Selector Tabs */}
      <div className="flex flex-wrap gap-2 p-2 bg-white/5 border border-white/10 rounded-2xl">
        {[
          { id: 'daily', label: 'Daily Collection' },
          { id: 'monthly', label: 'Monthly Collection' },
          { id: 'register', label: 'Fee Register' },
          { id: 'outstanding', label: 'Outstanding Report' },
          { id: 'discount', label: 'Discount Report' },
          { id: 'fine', label: 'Fine Report' },
          { id: 'refund', label: 'Refund Report' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
              reportType === tab.id
                ? 'bg-primary-500 text-white shadow-lg'
                : 'text-muted-foreground hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Report Controls Bar */}
      <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {(reportType === 'daily' || reportType === 'monthly' || reportType === 'register') && (
            <>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">From:</span>
                <GlassInput
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-36"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">To:</span>
                <GlassInput
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-36"
                />
              </div>
            </>
          )}

          <GlassSelect
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-36"
          >
            <option value="All">All Classes</option>
            {classes.map(c => (
              <option key={c.id} value={c.className}>{c.className}</option>
            ))}
          </GlassSelect>

          <div className="relative w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <GlassInput
              placeholder="Filter by keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <GlassButton variant="outline" size="sm" onClick={handleExportExcel} className="flex items-center gap-2">
            <FileSpreadsheet size={16} className="text-emerald-400" /> Export Excel
          </GlassButton>
          <GlassButton variant="primary" size="sm" onClick={handleExportPDF} className="flex items-center gap-2">
            <Download size={16} /> Export PDF
          </GlassButton>
        </div>
      </div>

      {/* Report Output View Table */}
      {(reportType === 'daily' || reportType === 'monthly' || reportType === 'register') && (
        <GlassTable>
          <thead>
            <tr>
              <th>Receipt #</th>
              <th>Date</th>
              <th>Student Details</th>
              <th>Class</th>
              <th>Payment Mode</th>
              <th>Subtotal</th>
              <th>Discount</th>
              <th>Fine</th>
              <th>Amount Paid</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {dailyData.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-8 text-muted-foreground">
                  No collection records found for selected date range and filters.
                </td>
              </tr>
            ) : (
              dailyData.map(r => (
                <tr key={r.id}>
                  <td className="font-mono text-xs font-bold text-primary-400">{r.receiptNumber}</td>
                  <td className="text-xs text-slate-300">{r.paymentDate}</td>
                  <td>
                    <div className="font-semibold text-white">{r.studentName}</div>
                    <div className="text-xs text-muted-foreground">Adm: {r.admissionNo}</div>
                  </td>
                  <td className="font-medium text-slate-200">{r.classId}</td>
                  <td className="text-xs font-semibold text-emerald-400">{r.paymentMode}</td>
                  <td className="font-mono text-xs text-slate-300">₹{r.subtotal || r.netPayable}</td>
                  <td className="font-mono text-xs text-blue-400">-₹{r.discountAmount || 0}</td>
                  <td className="font-mono text-xs text-rose-400">+₹{r.fineAmount || 0}</td>
                  <td className="font-mono font-bold text-emerald-400">₹{r.amountPaid}</td>
                  <td className="font-mono font-semibold text-amber-400">₹{r.balanceDue}</td>
                </tr>
              ))
            )}
          </tbody>
        </GlassTable>
      )}

      {reportType === 'outstanding' && (
        <GlassTable>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Admission #</th>
              <th>Class</th>
              <th>Guardian Contact</th>
              <th>Estimated Annual Fee</th>
              <th>Total Paid</th>
              <th>Outstanding Dues</th>
            </tr>
          </thead>
          <tbody>
            {outstandingData.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-muted-foreground">
                  No outstanding dues found matching filters.
                </td>
              </tr>
            ) : (
              outstandingData.map(o => (
                <tr key={o.student.id}>
                  <td className="font-semibold text-primary-400">{o.student.fullName}</td>
                  <td className="font-mono text-xs">{o.student.admissionNo}</td>
                  <td className="font-medium text-slate-200">{o.student.classId}</td>
                  <td className="text-xs text-muted-foreground">{o.student.fatherName || 'N/A'} ({o.student.phone || 'No phone'})</td>
                  <td className="font-mono text-xs text-slate-300">₹{o.annualFee.toLocaleString()}</td>
                  <td className="font-mono text-xs text-emerald-400 font-medium">₹{o.paid.toLocaleString()}</td>
                  <td className="font-mono font-bold text-amber-400">₹{o.balance.toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </GlassTable>
      )}

      {reportType === 'discount' && (
        <GlassTable>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Admission #</th>
              <th>Class</th>
              <th>Category</th>
              <th>Discount Type</th>
              <th>Value</th>
              <th>Applied Amount</th>
              <th>Approved By</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map(d => (
              <tr key={d.id}>
                <td className="font-semibold text-primary-400">{d.studentName}</td>
                <td className="font-mono text-xs">{d.admissionNo}</td>
                <td className="font-medium text-slate-200">{d.classId}</td>
                <td className="font-bold text-xs text-blue-400">{d.category}</td>
                <td className="text-xs text-slate-300">{d.discountType}</td>
                <td className="font-mono text-xs">{d.value}</td>
                <td className="font-mono font-bold text-emerald-400">₹{d.appliedAmount}</td>
                <td className="text-xs text-muted-foreground">{d.approvedBy}</td>
              </tr>
            ))}
          </tbody>
        </GlassTable>
      )}

      {reportType === 'fine' && (
        <GlassTable>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Admission #</th>
              <th>Class</th>
              <th>Fine Type</th>
              <th>Reason</th>
              <th>Amount</th>
              <th>Issued Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {fines.map(f => (
              <tr key={f.id}>
                <td className="font-semibold text-primary-400">{f.studentName}</td>
                <td className="font-mono text-xs">{f.admissionNo}</td>
                <td className="font-medium text-slate-200">{f.classId}</td>
                <td className="font-bold text-xs text-rose-400">{f.fineType}</td>
                <td className="text-xs text-muted-foreground">{f.reason}</td>
                <td className="font-mono font-bold text-rose-400">₹{f.amount}</td>
                <td className="text-xs text-slate-300">{f.issueDate}</td>
                <td className="text-xs font-semibold text-slate-200">{f.status}</td>
              </tr>
            ))}
          </tbody>
        </GlassTable>
      )}

      {reportType === 'refund' && (
        <GlassTable>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Admission #</th>
              <th>Class</th>
              <th>Receipt #</th>
              <th>Refund Date</th>
              <th>Mode</th>
              <th>Amount</th>
              <th>Approved By</th>
            </tr>
          </thead>
          <tbody>
            {refunds.map(rf => (
              <tr key={rf.id}>
                <td className="font-semibold text-primary-400">{rf.studentName}</td>
                <td className="font-mono text-xs">{rf.admissionNo}</td>
                <td className="font-medium text-slate-200">{rf.classId}</td>
                <td className="font-mono text-xs">{rf.receiptNumber || 'N/A'}</td>
                <td className="text-xs text-slate-300">{rf.refundDate}</td>
                <td className="text-xs font-semibold text-amber-400">{rf.refundMode}</td>
                <td className="font-mono font-bold text-amber-400">₹{rf.refundAmount}</td>
                <td className="text-xs text-muted-foreground">{rf.approvedBy}</td>
              </tr>
            ))}
          </tbody>
        </GlassTable>
      )}
    </div>
  );
};
