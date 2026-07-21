import { useState, useMemo } from 'react';
import { GlassModal } from '../../common/GlassModal';
import { GlassButton } from '../../common/GlassButton';
import { GlassBadge } from '../../common/GlassBadge';
import { Student } from '../../../types/master';
import { FeeReceipt, FeeDiscountRecord, FeeFineRecord, FeeRefundRecord, FeeStructure } from '../../../types/finance';
import { User, Phone, FileText, PlusCircle, MinusCircle, Printer, RefreshCw } from 'lucide-react';

interface StudentFeeProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  receipts: FeeReceipt[];
  discounts: FeeDiscountRecord[];
  fines: FeeFineRecord[];
  refunds: FeeRefundRecord[];
  structures: FeeStructure[];
  onOpenCollectModal: (studentId: string) => void;
  onViewReceipt: (receipt: FeeReceipt) => void;
  onApplyDiscount: (student: Student) => void;
  onApplyFine: (student: Student) => void;
  onIssueRefund: (student: Student) => void;
}

export const StudentFeeProfileModal = ({
  isOpen,
  onClose,
  student,
  receipts,
  discounts,
  fines,
  refunds,
  structures,
  onOpenCollectModal,
  onViewReceipt,
  onApplyDiscount,
  onApplyFine,
  onIssueRefund
}: StudentFeeProfileModalProps) => {
  const [activeTab, setActiveTab] = useState<'receipts' | 'discounts' | 'fines' | 'refunds'>('receipts');

  const studentReceipts = useMemo(() => {
    if (!student) return [];
    return receipts.filter(r => r.studentId === student.id || r.admissionNo === student.admissionNo);
  }, [receipts, student]);

  const studentDiscounts = useMemo(() => {
    if (!student) return [];
    return discounts.filter(d => d.studentId === student.id || d.admissionNo === student.admissionNo);
  }, [discounts, student]);

  const studentFines = useMemo(() => {
    if (!student) return [];
    return fines.filter(f => f.studentId === student.id || f.admissionNo === student.admissionNo);
  }, [fines, student]);

  const studentRefunds = useMemo(() => {
    if (!student) return [];
    return refunds.filter(rf => rf.studentId === student.id || rf.admissionNo === student.admissionNo);
  }, [refunds, student]);

  // Find matching fee structure by class
  const matchedStructure = useMemo(() => {
    if (!student) return undefined;
    return structures.find(st => st.applicableClasses?.includes(student.classId));
  }, [structures, student]);

  const totalFeeAmount = matchedStructure ? matchedStructure.totalAnnualAmount : 25000;
  const totalPaid = studentReceipts.reduce((sum, r) => sum + (Number(r.amountPaid) || 0), 0);
  const totalDiscount = studentDiscounts.reduce((sum, d) => sum + (Number(d.appliedAmount) || 0), 0);
  const totalFine = studentFines.reduce((sum, f) => sum + (f.status === 'Paid' || f.status === 'Pending' ? Number(f.amount) || 0 : 0), 0);
  const totalRefunded = studentRefunds.reduce((sum, rf) => sum + (Number(rf.refundAmount) || 0), 0);

  const netPayable = totalFeeAmount - totalDiscount + totalFine;
  const balanceDue = Math.max(0, netPayable - totalPaid + totalRefunded);

  if (!student) return null;

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title="Student Financial Profile & Ledger"
      className="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Student Profile Identity Card */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row gap-5 items-center justify-between">
          <div className="flex items-center gap-4">
            {student.photoUrl ? (
              <img src={student.photoUrl} alt={student.fullName} className="w-16 h-16 rounded-full object-cover border-2 border-primary-500" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center font-bold text-2xl border-2 border-primary-500/30">
                <User size={32} />
              </div>
            )}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">{student.fullName}</h3>
                <GlassBadge variant={balanceDue === 0 ? 'success' : 'warning'}>
                  {balanceDue === 0 ? 'Fee Cleared' : 'Due Pending'}
                </GlassBadge>
              </div>
              <p className="text-xs text-slate-400">
                Adm No: <strong className="text-slate-200">{student.admissionNo}</strong> | Roll: <strong className="text-slate-200">{student.rollNo || 'N/A'}</strong> | Class: <strong className="text-primary-400">{student.classId}</strong>
              </p>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <span>Guardian: <strong className="text-slate-200">{student.fatherName || student.motherName || 'N/A'}</strong></span>
                {student.phone && <span className="flex items-center gap-1 text-slate-300"><Phone size={12} /> {student.phone}</span>}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-end w-full md:w-auto">
            <GlassButton variant="primary" size="sm" onClick={() => onOpenCollectModal(student.id)}>
              Collect Fee
            </GlassButton>
            <GlassButton variant="outline" size="sm" onClick={() => onApplyDiscount(student)}>
              <PlusCircle size={14} className="mr-1 text-emerald-400" /> Discount
            </GlassButton>
            <GlassButton variant="outline" size="sm" onClick={() => onApplyFine(student)}>
              <MinusCircle size={14} className="mr-1 text-rose-400" /> Fine
            </GlassButton>
            <GlassButton variant="ghost" size="sm" onClick={() => onIssueRefund(student)}>
              <RefreshCw size={14} className="mr-1 text-amber-400" /> Refund
            </GlassButton>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-center">
            <p className="text-[11px] text-muted-foreground uppercase font-medium">Total Annual Fee</p>
            <p className="text-base font-bold text-foreground">₹{totalFeeAmount.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
            <p className="text-[11px] text-emerald-400 uppercase font-medium">Total Paid</p>
            <p className="text-base font-bold text-emerald-400">₹{totalPaid.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-center">
            <p className="text-[11px] text-blue-400 uppercase font-medium">Total Discount</p>
            <p className="text-base font-bold text-blue-400">₹{totalDiscount.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center">
            <p className="text-[11px] text-rose-400 uppercase font-medium">Total Fine</p>
            <p className="text-base font-bold text-rose-400">₹{totalFine.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center col-span-2 md:col-span-1">
            <p className="text-[11px] text-amber-400 uppercase font-medium">Balance Due</p>
            <p className="text-lg font-extrabold text-amber-400">₹{balanceDue.toLocaleString()}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('receipts')}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === 'receipts'
                ? 'border-primary-500 text-primary-400 font-bold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Payment Receipts ({studentReceipts.length})
          </button>
          <button
            onClick={() => setActiveTab('discounts')}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === 'discounts'
                ? 'border-primary-500 text-primary-400 font-bold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Discounts ({studentDiscounts.length})
          </button>
          <button
            onClick={() => setActiveTab('fines')}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === 'fines'
                ? 'border-primary-500 text-primary-400 font-bold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Fines ({studentFines.length})
          </button>
          <button
            onClick={() => setActiveTab('refunds')}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === 'refunds'
                ? 'border-primary-500 text-primary-400 font-bold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Refunds ({studentRefunds.length})
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'receipts' && (
          <div className="space-y-3">
            {studentReceipts.length === 0 ? (
              <p className="text-xs text-muted-foreground py-6 text-center">No fee receipts recorded for this student.</p>
            ) : (
              <div className="space-y-2">
                {studentReceipts.map(rec => (
                  <div key={rec.id} className="p-3 bg-white/5 border border-white/10 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-emerald-400">{rec.receiptNumber}</span>
                        <GlassBadge variant={rec.status === 'Paid' ? 'success' : 'warning'}>{rec.status}</GlassBadge>
                        <span className="text-xs text-muted-foreground">{rec.paymentDate}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Mode: <strong className="text-slate-200">{rec.paymentMode}</strong> | Paid: <strong className="text-emerald-400">₹{rec.amountPaid}</strong> | Balance: ₹{rec.balanceDue}
                      </p>
                    </div>
                    <GlassButton variant="outline" size="sm" onClick={() => onViewReceipt(rec)} className="flex items-center gap-1">
                      <Printer size={14} /> View Receipt
                    </GlassButton>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'discounts' && (
          <div className="space-y-3">
            {studentDiscounts.length === 0 ? (
              <p className="text-xs text-muted-foreground py-6 text-center">No discounts or concessions granted.</p>
            ) : (
              <div className="space-y-2">
                {studentDiscounts.map(d => (
                  <div key={d.id} className="p-3 bg-white/5 border border-white/10 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-blue-400">{d.category}</p>
                      <p className="text-xs text-muted-foreground">{d.approvalNotes || 'Granted discount'} | Approved by: {d.approvedBy}</p>
                    </div>
                    <span className="font-bold text-sm text-blue-400">- ₹{d.appliedAmount}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'fines' && (
          <div className="space-y-3">
            {studentFines.length === 0 ? (
              <p className="text-xs text-muted-foreground py-6 text-center">No fines or late fees recorded.</p>
            ) : (
              <div className="space-y-2">
                {studentFines.map(f => (
                  <div key={f.id} className="p-3 bg-white/5 border border-white/10 rounded-xl flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-rose-400">{f.fineType}</p>
                        <GlassBadge variant={f.status === 'Paid' ? 'success' : f.status === 'Waived' ? 'neutral' : 'danger'}>
                          {f.status}
                        </GlassBadge>
                      </div>
                      <p className="text-xs text-muted-foreground">{f.reason} {f.waiveReason ? `(Waived: ${f.waiveReason})` : ''}</p>
                    </div>
                    <span className="font-bold text-sm text-rose-400">+ ₹{f.amount}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'refunds' && (
          <div className="space-y-3">
            {studentRefunds.length === 0 ? (
              <p className="text-xs text-muted-foreground py-6 text-center">No refunds issued for this student.</p>
            ) : (
              <div className="space-y-2">
                {studentRefunds.map(rf => (
                  <div key={rf.id} className="p-3 bg-white/5 border border-white/10 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-amber-400">Refund Processed</p>
                      <p className="text-xs text-muted-foreground">Date: {rf.refundDate} | Mode: {rf.refundMode} | Reason: {rf.reason}</p>
                    </div>
                    <span className="font-bold text-sm text-amber-400">₹{rf.refundAmount}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Close */}
        <div className="flex justify-end pt-4 border-t border-white/10">
          <GlassButton variant="ghost" onClick={onClose}>Close Profile</GlassButton>
        </div>
      </div>
    </GlassModal>
  );
};
