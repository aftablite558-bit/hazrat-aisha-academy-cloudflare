import { useState } from 'react';
import { GlassTable } from '../../common/GlassTable';
import { GlassButton } from '../../common/GlassButton';
import { GlassInput } from '../../common/GlassInput';
import { GlassSelect } from '../../common/GlassSelect';
import { GlassBadge } from '../../common/GlassBadge';
import { GlassModal } from '../../common/GlassModal';
import { FeeDiscountRecord, FeeFineRecord } from '../../../types/finance';
import { Student } from '../../../types/master';
import { Plus, Percent, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

interface DiscountsAndFinesViewProps {
  students: Student[];
  discounts: FeeDiscountRecord[];
  fines: FeeFineRecord[];
  onAddDiscount: (discount: Partial<FeeDiscountRecord>) => Promise<void>;
  onAddFine: (fine: Partial<FeeFineRecord>) => Promise<void>;
  onWaiveFine: (fineId: string, waiveReason: string) => Promise<void>;
}

export const DiscountsAndFinesView = ({
  students,
  discounts,
  fines,
  onAddDiscount,
  onAddFine,
  onWaiveFine
}: DiscountsAndFinesViewProps) => {
  const { profile } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<'discounts' | 'fines'>('discounts');

  // Discount Modal state
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [discountStudentId, setDiscountStudentId] = useState('');
  const [discountCategory, setDiscountCategory] = useState<'Scholarship' | 'Sibling Discount' | 'Staff Child' | 'Special Discount'>('Scholarship');
  const [discountType, setDiscountType] = useState<'Percentage' | 'Fixed Amount'>('Fixed Amount');
  const [discountValue, setDiscountValue] = useState<number>(2000);
  const [discountApprovalNotes, setDiscountApprovalNotes] = useState('');

  // Fine Modal state
  const [isFineModalOpen, setIsFineModalOpen] = useState(false);
  const [fineStudentId, setFineStudentId] = useState('');
  const [fineType, setFineType] = useState<'Late Fee' | 'Custom Fine'>('Late Fee');
  const [fineAmount, setFineAmount] = useState<number>(500);
  const [fineReason, setFineReason] = useState('');

  // Waive Modal state
  const [isWaiveModalOpen, setIsWaiveModalOpen] = useState(false);
  const [selectedFineToWaive, setSelectedFineToWaive] = useState<FeeFineRecord | null>(null);
  const [waiveReason, setWaiveReason] = useState('');

  const handleOpenDiscountModal = () => {
    setDiscountStudentId('');
    setDiscountCategory('Scholarship');
    setDiscountType('Fixed Amount');
    setDiscountValue(2000);
    setDiscountApprovalNotes('');
    setIsDiscountModalOpen(true);
  };

  const handleOpenFineModal = () => {
    setFineStudentId('');
    setFineType('Late Fee');
    setFineAmount(500);
    setFineReason('');
    setIsFineModalOpen(true);
  };

  const handleSaveDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === discountStudentId);
    if (!student) {
      alert('Please select a valid student');
      return;
    }

    const appliedAmount = discountType === 'Percentage'
      ? Math.round((25000 * (Number(discountValue) || 0)) / 100)
      : Number(discountValue) || 0;

    const payload: Partial<FeeDiscountRecord> = {
      studentId: student.id,
      studentName: student.fullName,
      admissionNo: student.admissionNo,
      classId: student.classId,
      category: discountCategory,
      discountType,
      value: Number(discountValue) || 0,
      appliedAmount,
      approvalNotes: discountApprovalNotes || `${discountCategory} granted`,
      approvedBy: profile?.displayName || 'Principal',
      status: 'Active'
    };

    await onAddDiscount(payload);
    setIsDiscountModalOpen(false);
  };

  const handleSaveFine = async (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === fineStudentId);
    if (!student) {
      alert('Please select a valid student');
      return;
    }

    const payload: Partial<FeeFineRecord> = {
      studentId: student.id,
      studentName: student.fullName,
      admissionNo: student.admissionNo,
      classId: student.classId,
      fineType,
      amount: Number(fineAmount) || 0,
      reason: fineReason || 'Late payment surcharge',
      issueDate: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };

    await onAddFine(payload);
    setIsFineModalOpen(false);
  };

  const handleConfirmWaiveFine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFineToWaive?.id) {
      await onWaiveFine(selectedFineToWaive.id, waiveReason || 'Waived by management approval');
      setIsWaiveModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Subtab Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl">
          <button
            onClick={() => setActiveSubTab('discounts')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
              activeSubTab === 'discounts' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md font-bold' : 'text-muted-foreground hover:text-white'
            }`}
          >
            <Percent size={16} /> Discounts & Concessions ({discounts.length})
          </button>
          <button
            onClick={() => setActiveSubTab('fines')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
              activeSubTab === 'fines' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md font-bold' : 'text-muted-foreground hover:text-white'
            }`}
          >
            <AlertCircle size={16} /> Fine & Waive Management ({fines.length})
          </button>
        </div>

        {activeSubTab === 'discounts' ? (
          <GlassButton variant="primary" onClick={handleOpenDiscountModal} className="flex items-center gap-2">
            <Plus size={16} /> Apply Student Discount
          </GlassButton>
        ) : (
          <GlassButton variant="primary" onClick={handleOpenFineModal} className="flex items-center gap-2">
            <Plus size={16} /> Apply Fine / Late Fee
          </GlassButton>
        )}
      </div>

      {/* DISCOUNTS TABLE */}
      {activeSubTab === 'discounts' && (
        <GlassTable>
          <thead>
            <tr>
              <th>Student Details</th>
              <th>Class</th>
              <th>Discount Category</th>
              <th>Discount Type & Value</th>
              <th>Calculated Amount (₹)</th>
              <th>Approval Notes</th>
              <th>Approved By</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {discounts.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-muted-foreground">
                  No fee discounts granted yet. Click "Apply Student Discount" to record one.
                </td>
              </tr>
            ) : (
              discounts.map(d => (
                <tr key={d.id}>
                  <td>
                    <div className="font-semibold text-primary-400">{d.studentName}</div>
                    <div className="text-xs text-muted-foreground">Adm: {d.admissionNo}</div>
                  </td>
                  <td className="font-medium text-slate-200">{d.classId}</td>
                  <td>
                    <span className="font-bold text-xs text-blue-400">{d.category}</span>
                  </td>
                  <td>
                    {d.discountType === 'Percentage' ? `${d.value}% Off` : `₹${d.value} Flat`}
                  </td>
                  <td className="font-mono font-bold text-emerald-400">₹{d.appliedAmount}</td>
                  <td className="text-xs text-muted-foreground">{d.approvalNotes}</td>
                  <td className="text-xs font-medium text-slate-300">{d.approvedBy}</td>
                  <td>
                    <GlassBadge variant={d.status === 'Active' ? 'success' : 'neutral'}>
                      {d.status}
                    </GlassBadge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </GlassTable>
      )}

      {/* FINES TABLE */}
      {activeSubTab === 'fines' && (
        <GlassTable>
          <thead>
            <tr>
              <th>Student Details</th>
              <th>Class</th>
              <th>Fine Type</th>
              <th>Reason</th>
              <th>Fine Amount (₹)</th>
              <th>Issued Date</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fines.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-muted-foreground">
                  No fines or late fees recorded yet. Click "Apply Fine / Late Fee" to add one.
                </td>
              </tr>
            ) : (
              fines.map(f => (
                <tr key={f.id}>
                  <td>
                    <div className="font-semibold text-primary-400">{f.studentName}</div>
                    <div className="text-xs text-muted-foreground">Adm: {f.admissionNo}</div>
                  </td>
                  <td className="font-medium text-slate-200">{f.classId}</td>
                  <td className="font-bold text-xs text-rose-400">{f.fineType}</td>
                  <td className="text-xs text-muted-foreground">{f.reason} {f.waiveReason && `(${f.waiveReason})`}</td>
                  <td className="font-mono font-bold text-rose-400">₹{f.amount}</td>
                  <td className="text-xs text-slate-300">{f.issueDate}</td>
                  <td>
                    <GlassBadge variant={f.status === 'Paid' ? 'success' : f.status === 'Waived' ? 'neutral' : 'danger'}>
                      {f.status}
                    </GlassBadge>
                  </td>
                  <td>
                    <div className="flex justify-end">
                      {f.status === 'Pending' && (
                        <GlassButton
                          variant="ghost"
                          size="sm"
                          onClick={() => { setSelectedFineToWaive(f); setWaiveReason(''); setIsWaiveModalOpen(true); }}
                        >
                          Waive Fine
                        </GlassButton>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </GlassTable>
      )}

      {/* DISCOUNT MODAL */}
      <GlassModal
        isOpen={isDiscountModalOpen}
        onClose={() => setIsDiscountModalOpen(false)}
        title="Apply Discount / Concession"
        className="max-w-lg"
      >
        <form onSubmit={handleSaveDiscount} className="space-y-4">
          <GlassSelect
            label="Select Student"
            value={discountStudentId}
            onChange={(e) => setDiscountStudentId(e.target.value)}
            required
          >
            <option value="">-- Choose Student --</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.fullName} ({s.admissionNo} - Class {s.classId})</option>
            ))}
          </GlassSelect>

          <GlassSelect
            label="Discount Category"
            value={discountCategory}
            onChange={(e) => setDiscountCategory(e.target.value as any)}
          >
            <option value="Scholarship">Scholarship</option>
            <option value="Sibling Discount">Sibling Discount</option>
            <option value="Staff Child">Staff Child</option>
            <option value="Special Discount">Special Discount</option>
          </GlassSelect>

          <div className="grid grid-cols-2 gap-4">
            <GlassSelect
              label="Type"
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value as any)}
            >
              <option value="Fixed Amount">Fixed Amount (₹)</option>
              <option value="Percentage">Percentage (%)</option>
            </GlassSelect>

            <GlassInput
              type="number"
              label={discountType === 'Percentage' ? 'Percentage (%)' : 'Amount (₹)'}
              value={discountValue}
              onChange={(e) => setDiscountValue(Number(e.target.value))}
              required
            />
          </div>

          <GlassInput
            label="Approval Notes / Reason"
            placeholder="e.g. Approved by Principal for merit performance"
            value={discountApprovalNotes}
            onChange={(e) => setDiscountApprovalNotes(e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <GlassButton type="button" variant="ghost" onClick={() => setIsDiscountModalOpen(false)}>Cancel</GlassButton>
            <GlassButton type="submit" variant="primary">Grant Discount</GlassButton>
          </div>
        </form>
      </GlassModal>

      {/* FINE MODAL */}
      <GlassModal
        isOpen={isFineModalOpen}
        onClose={() => setIsFineModalOpen(false)}
        title="Apply Fine / Late Fee"
        className="max-w-lg"
      >
        <form onSubmit={handleSaveFine} className="space-y-4">
          <GlassSelect
            label="Select Student"
            value={fineStudentId}
            onChange={(e) => setFineStudentId(e.target.value)}
            required
          >
            <option value="">-- Choose Student --</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.fullName} ({s.admissionNo} - Class {s.classId})</option>
            ))}
          </GlassSelect>

          <GlassSelect
            label="Fine Type"
            value={fineType}
            onChange={(e) => setFineType(e.target.value as any)}
          >
            <option value="Late Fee">Late Fee Surcharge</option>
            <option value="Custom Fine">Custom Discipline / Library Fine</option>
          </GlassSelect>

          <GlassInput
            type="number"
            label="Fine Amount (₹)"
            value={fineAmount}
            onChange={(e) => setFineAmount(Number(e.target.value))}
            required
          />

          <GlassInput
            label="Reason"
            placeholder="e.g. Late submission beyond 15th of month"
            value={fineReason}
            onChange={(e) => setFineReason(e.target.value)}
            required
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <GlassButton type="button" variant="ghost" onClick={() => setIsFineModalOpen(false)}>Cancel</GlassButton>
            <GlassButton type="submit" variant="primary">Apply Fine</GlassButton>
          </div>
        </form>
      </GlassModal>

      {/* WAIVE FINE MODAL */}
      <GlassModal
        isOpen={isWaiveModalOpen}
        onClose={() => setIsWaiveModalOpen(false)}
        title="Waive Fine Approval"
        className="max-w-md"
      >
        <form onSubmit={handleConfirmWaiveFine} className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Waiving fine of <strong className="text-rose-400">₹{selectedFineToWaive?.amount}</strong> for student <strong className="text-white">{selectedFineToWaive?.studentName}</strong>.
          </p>

          <GlassInput
            label="Waive Reason / Approval Note"
            placeholder="e.g. Waived due to medical leave request"
            value={waiveReason}
            onChange={(e) => setWaiveReason(e.target.value)}
            required
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <GlassButton type="button" variant="ghost" onClick={() => setIsWaiveModalOpen(false)}>Cancel</GlassButton>
            <GlassButton type="submit" variant="primary">Confirm Waive Fine</GlassButton>
          </div>
        </form>
      </GlassModal>
    </div>
  );
};
