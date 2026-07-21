import { useState } from 'react';
import { GlassTable } from '../../common/GlassTable';
import { GlassButton } from '../../common/GlassButton';
import { GlassInput } from '../../common/GlassInput';
import { GlassSelect } from '../../common/GlassSelect';
import { GlassBadge } from '../../common/GlassBadge';
import { GlassModal } from '../../common/GlassModal';
import { FeeRefundRecord, FeeReceipt } from '../../../types/finance';
import { Student } from '../../../types/master';
import { RefreshCw, Plus, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

interface RefundsViewProps {
  students: Student[];
  receipts: FeeReceipt[];
  refunds: FeeRefundRecord[];
  onAddRefund: (refund: Partial<FeeRefundRecord>) => Promise<void>;
}

export const RefundsView = ({
  students,
  receipts,
  refunds,
  onAddRefund
}: RefundsViewProps) => {
  const { profile } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [studentId, setStudentId] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [refundAmount, setRefundAmount] = useState<number>(1000);
  const [refundMode, setRefundMode] = useState<'Cash' | 'Bank Transfer' | 'Cheque'>('Cash');
  const [reason, setReason] = useState('');

  const handleOpenModal = () => {
    setStudentId('');
    setReceiptNumber('');
    setRefundAmount(1000);
    setRefundMode('Cash');
    setReason('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === studentId);
    if (!student) {
      alert('Please select a student');
      return;
    }

    const payload: Partial<FeeRefundRecord> = {
      receiptNumber,
      studentId: student.id,
      studentName: student.fullName,
      admissionNo: student.admissionNo,
      classId: student.classId,
      refundAmount: Number(refundAmount) || 0,
      refundDate: new Date().toISOString().split('T')[0],
      refundMode,
      reason: reason || 'Caution deposit / overpayment refund',
      approvedBy: profile?.displayName || 'Principal',
      status: 'Processed'
    };

    await onAddRefund(payload);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <RefreshCw className="text-amber-400" size={22} /> Refund Management
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Process caution deposit returns, excess fee adjustments, and track full refund histories.
          </p>
        </div>
        <GlassButton variant="primary" onClick={handleOpenModal} className="flex items-center gap-2">
          <Plus size={16} /> Issue Refund
        </GlassButton>
      </div>

      <GlassTable>
        <thead>
          <tr>
            <th>Student Details</th>
            <th>Class</th>
            <th>Receipt #</th>
            <th>Refund Date</th>
            <th>Refund Mode</th>
            <th>Reason</th>
            <th>Amount (₹)</th>
            <th>Approved By</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {refunds.length === 0 ? (
            <tr>
              <td colSpan={9} className="text-center py-8 text-muted-foreground">
                No refunds issued yet. Click "Issue Refund" to create one.
              </td>
            </tr>
          ) : (
            refunds.map(rf => (
              <tr key={rf.id}>
                <td>
                  <div className="font-semibold text-primary-400">{rf.studentName}</div>
                  <div className="text-xs text-muted-foreground">Adm: {rf.admissionNo}</div>
                </td>
                <td className="font-medium text-slate-200">{rf.classId}</td>
                <td className="font-mono text-xs text-slate-300">{rf.receiptNumber || 'N/A'}</td>
                <td className="text-xs text-slate-300">{rf.refundDate}</td>
                <td className="text-xs font-semibold text-amber-400">{rf.refundMode}</td>
                <td className="text-xs text-muted-foreground">{rf.reason}</td>
                <td className="font-mono font-bold text-amber-400">₹{rf.refundAmount}</td>
                <td className="text-xs font-medium text-slate-300">{rf.approvedBy}</td>
                <td>
                  <GlassBadge variant={rf.status === 'Processed' ? 'success' : 'neutral'}>
                    {rf.status}
                  </GlassBadge>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </GlassTable>

      <GlassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Issue Fee Refund"
        className="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <GlassSelect
            label="Select Student"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
          >
            <option value="">-- Choose Student --</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.fullName} ({s.admissionNo} - Class {s.classId})</option>
            ))}
          </GlassSelect>

          <GlassSelect
            label="Linked Receipt Number (Optional)"
            value={receiptNumber}
            onChange={(e) => setReceiptNumber(e.target.value)}
          >
            <option value="">-- Select Receipt if applicable --</option>
            {receipts.filter(r => !studentId || r.studentId === studentId).map(r => (
              <option key={r.id} value={r.receiptNumber}>{r.receiptNumber} (₹{r.amountPaid})</option>
            ))}
          </GlassSelect>

          <div className="grid grid-cols-2 gap-4">
            <GlassInput
              type="number"
              label="Refund Amount (₹)"
              value={refundAmount}
              onChange={(e) => setRefundAmount(Number(e.target.value))}
              required
            />
            <GlassSelect
              label="Refund Mode"
              value={refundMode}
              onChange={(e) => setRefundMode(e.target.value as any)}
            >
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer / NEFT</option>
              <option value="Cheque">Cheque</option>
            </GlassSelect>
          </div>

          <GlassInput
            label="Refund Reason"
            placeholder="e.g. Caution deposit return on TC issuance"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <GlassButton type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</GlassButton>
            <GlassButton type="submit" variant="primary">Process Refund</GlassButton>
          </div>
        </form>
      </GlassModal>
    </div>
  );
};
