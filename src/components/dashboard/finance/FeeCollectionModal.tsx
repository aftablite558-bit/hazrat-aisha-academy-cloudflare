import { useState, useEffect } from 'react';
import { GlassModal } from '../../common/GlassModal';
import { GlassButton } from '../../common/GlassButton';
import { GlassInput } from '../../common/GlassInput';
import { GlassSelect } from '../../common/GlassSelect';
import { FeeCategoryName, FeeReceipt, FeeReceiptItem } from '../../../types/finance';
import { Student } from '../../../types/master';
import { FEE_CATEGORIES, generateReceiptNumber } from '../../../utils/financeUtils';
import { Search, CreditCard, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

interface FeeCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  onSave: (receipt: Partial<FeeReceipt>) => Promise<void>;
  preselectedStudentId?: string;
}

export const FeeCollectionModal = ({
  isOpen,
  onClose,
  students,
  onSave,
  preselectedStudentId
}: FeeCollectionModalProps) => {
  const { profile } = useAuth();
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const [receiptNo, setReceiptNo] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI' | 'Bank Transfer' | 'Cheque' | 'Card'>('Cash');
  const [paymentType, setPaymentType] = useState<'Full Payment' | 'Partial Payment' | 'Advance Payment' | 'Installment'>('Full Payment');
  const [transactionRef, setTransactionRef] = useState('');

  const [items, setItems] = useState<FeeReceiptItem[]>([
    { category: 'Tuition Fee', description: 'Monthly Tuition Fee', amount: 1500 }
  ]);

  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [discountReason, setDiscountReason] = useState<string>('');
  const [fineAmount, setFineAmount] = useState<number>(0);
  const [fineReason, setFineReason] = useState<string>('');
  const [amountPaid, setAmountPaid] = useState<number>(1500);
  const [remarks, setRemarks] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setReceiptNo(generateReceiptNumber());
      setPaymentDate(new Date().toISOString().split('T')[0]);
      if (preselectedStudentId) {
        const found = students.find(s => s.id === preselectedStudentId);
        if (found) setSelectedStudent(found);
      }
    }
  }, [isOpen, preselectedStudentId, students]);

  // Recalculate default total paid when items or discounts change
  const subtotal = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const netPayable = Math.max(0, subtotal - (Number(discountAmount) || 0) + (Number(fineAmount) || 0));

  useEffect(() => {
    if (paymentType === 'Full Payment') {
      setAmountPaid(netPayable);
    }
  }, [netPayable, paymentType]);

  const filteredStudents = students.filter(s =>
    (s.fullName || '').toLowerCase().includes(studentSearch.toLowerCase()) ||
    (s.admissionNo || '').toLowerCase().includes(studentSearch.toLowerCase()) ||
    (s.rollNo || '').toLowerCase().includes(studentSearch.toLowerCase()) ||
    (s.classId || '').toLowerCase().includes(studentSearch.toLowerCase())
  ).slice(0, 8);

  const handleAddItem = () => {
    setItems([...items, { category: 'Tuition Fee', description: 'Fee Item', amount: 1000 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof FeeReceiptItem, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) {
      alert('Please select a student first.');
      return;
    }

    const balanceDue = Math.max(0, netPayable - (Number(amountPaid) || 0));
    const status: 'Paid' | 'Partial' = balanceDue === 0 ? 'Paid' : 'Partial';

    const payload: Partial<FeeReceipt> = {
      receiptNumber: receiptNo,
      studentId: selectedStudent.id,
      studentName: selectedStudent.fullName,
      admissionNo: selectedStudent.admissionNo,
      rollNo: selectedStudent.rollNo,
      classId: selectedStudent.classId,
      guardianName: selectedStudent.fatherName || selectedStudent.motherName,
      phone: selectedStudent.phone,

      paymentDate,
      paymentMode,
      paymentType,
      transactionRef,

      items,
      subtotal,
      discountAmount: Number(discountAmount) || 0,
      discountReason,
      fineAmount: Number(fineAmount) || 0,
      fineReason,
      netPayable,
      amountPaid: Number(amountPaid) || 0,
      balanceDue,

      remarks,
      collectedBy: profile?.displayName || 'Accounts Admin',
      status
    };

    setIsSubmitting(true);
    try {
      await onSave(payload);
      onClose();
    } catch (err) {
      console.error('Failed to save fee receipt', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title="Collect Student Fee"
      className="max-w-4xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Select Student */}
        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-4">
          <h3 className="text-sm font-semibold text-primary-400 flex items-center gap-2">
            <CheckCircle2 size={16} /> 1. Select Student
          </h3>

          {!selectedStudent ? (
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <GlassInput
                  placeholder="Type student name, admission no, roll no or class..."
                  className="pl-10"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                />
              </div>

              <div className="max-h-48 overflow-y-auto space-y-2">
                {filteredStudents.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-3 text-center">No matching active students found.</p>
                ) : (
                  filteredStudents.map(s => (
                    <div
                      key={s.id}
                      onClick={() => setSelectedStudent(s)}
                      className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl cursor-pointer flex justify-between items-center transition-colors"
                    >
                      <div>
                        <p className="text-sm font-semibold text-foreground">{s.fullName}</p>
                        <p className="text-xs text-muted-foreground">Adm: {s.admissionNo} | Class: {s.classId} {s.rollNo ? `| Roll: ${s.rollNo}` : ''}</p>
                      </div>
                      <GlassButton type="button" variant="ghost" size="sm">Select</GlassButton>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <div>
                <p className="text-sm font-bold text-emerald-400">{selectedStudent.fullName}</p>
                <p className="text-xs text-muted-foreground">Adm No: {selectedStudent.admissionNo} | Class: {selectedStudent.classId} | Guardian: {selectedStudent.fatherName}</p>
              </div>
              <GlassButton type="button" variant="outline" size="sm" onClick={() => setSelectedStudent(null)}>
                Change Student
              </GlassButton>
            </div>
          )}
        </div>

        {/* Step 2: Payment Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GlassInput
            label="Receipt Number"
            value={receiptNo}
            onChange={(e) => setReceiptNo(e.target.value)}
            required
          />
          <GlassInput
            type="date"
            label="Payment Date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            required
          />
          <GlassSelect
            label="Payment Mode"
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value as any)}
          >
            <option value="Cash">Cash</option>
            <option value="UPI">UPI / QR</option>
            <option value="Bank Transfer">Bank Transfer / NEFT</option>
            <option value="Cheque">Cheque</option>
            <option value="Card">Credit/Debit Card</option>
          </GlassSelect>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassSelect
            label="Payment Type"
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value as any)}
          >
            <option value="Full Payment">Full Payment</option>
            <option value="Partial Payment">Partial Payment</option>
            <option value="Installment">Installment</option>
            <option value="Advance Payment">Advance Payment</option>
          </GlassSelect>
          <GlassInput
            label="Txn Ref / Cheque / UTR No"
            placeholder="e.g. UPI-9874521 / Chq #40921"
            value={transactionRef}
            onChange={(e) => setTransactionRef(e.target.value)}
          />
        </div>

        {/* Step 3: Fee Itemization Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-semibold text-foreground">Fee Item Breakdown</h4>
            <GlassButton type="button" variant="outline" size="sm" onClick={handleAddItem} className="flex items-center gap-1">
              <Plus size={14} /> Add Line Item
            </GlassButton>
          </div>

          <div className="space-y-2">
            {items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-white/5 p-2.5 rounded-xl border border-white/10">
                <div className="col-span-4">
                  <GlassSelect
                    value={item.category}
                    onChange={(e) => handleItemChange(idx, 'category', e.target.value)}
                  >
                    {FEE_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </GlassSelect>
                </div>
                <div className="col-span-5">
                  <GlassInput
                    placeholder="Description (e.g. Q1 Tuition / Library Charge)"
                    value={item.description || ''}
                    onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <GlassInput
                    type="number"
                    placeholder="Amount (₹)"
                    value={item.amount}
                    onChange={(e) => handleItemChange(idx, 'amount', Number(e.target.value))}
                  />
                </div>
                <div className="col-span-1 flex justify-center">
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    disabled={items.length <= 1}
                    className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg disabled:opacity-30"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 4: Discount, Fine, and Payment Calculations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/10">
            <h4 className="text-xs font-semibold uppercase text-emerald-400">Discount & Concession</h4>
            <GlassInput
              type="number"
              label="Discount Amount (₹)"
              value={discountAmount}
              onChange={(e) => setDiscountAmount(Number(e.target.value))}
            />
            <GlassInput
              label="Discount Reason / Scholarship Note"
              placeholder="e.g. Merit Scholarship / Sibling Concession"
              value={discountReason}
              onChange={(e) => setDiscountReason(e.target.value)}
            />
          </div>

          <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/10">
            <h4 className="text-xs font-semibold uppercase text-rose-400">Fine & Late Fee</h4>
            <GlassInput
              type="number"
              label="Fine Amount (₹)"
              value={fineAmount}
              onChange={(e) => setFineAmount(Number(e.target.value))}
            />
            <GlassInput
              label="Fine Reason"
              placeholder="e.g. Late fee surcharge after 10th"
              value={fineReason}
              onChange={(e) => setFineReason(e.target.value)}
            />
          </div>
        </div>

        {/* Calculation Summary Bar */}
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CreditCard className="text-emerald-400" size={28} />
            <div>
              <p className="text-xs text-muted-foreground">Subtotal: ₹{subtotal.toLocaleString()} | Discount: -₹{discountAmount} | Fine: +₹{fineAmount}</p>
              <p className="text-lg font-bold text-white">Net Payable: ₹{netPayable.toLocaleString()}</p>
            </div>
          </div>

          <div className="w-full md:w-48">
            <GlassInput
              type="number"
              label="Amount Received (₹)"
              value={amountPaid}
              onChange={(e) => setAmountPaid(Number(e.target.value))}
              required
            />
          </div>
        </div>

        {/* Remarks */}
        <GlassInput
          label="Remarks / Cashier Notes"
          placeholder="Optional cashier notes..."
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />

        {/* Submit Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <GlassButton type="button" variant="ghost" onClick={onClose}>
            Cancel
          </GlassButton>
          <GlassButton type="submit" variant="primary" disabled={isSubmitting || !selectedStudent}>
            {isSubmitting ? 'Saving Payment...' : 'Confirm & Save Receipt'}
          </GlassButton>
        </div>
      </form>
    </GlassModal>
  );
};
