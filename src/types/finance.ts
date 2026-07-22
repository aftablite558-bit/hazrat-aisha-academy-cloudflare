import { BaseEntity, Student } from './master';

export type FeeCategoryName = 
  | 'Admission Fee'
  | 'Tuition Fee'
  | 'Exam Fee'
  | 'Computer Fee'
  | 'Library Fee'
  | 'Transport Fee'
  | 'Hostel Fee'
  | 'Annual Charge'
  | 'Development Fee'
  | 'Other Charges';

export interface FeeStructureItem {
  category: FeeCategoryName;
  amount: number;
  frequency: 'One-time' | 'Monthly' | 'Quarterly' | 'Term-wise' | 'Annual';
}

export interface FeeStructure extends BaseEntity {
  name: string;
  session: string;
  applicableClasses: string[];
  items: FeeStructureItem[];
  totalAnnualAmount: number;
  status: 'Active' | 'Inactive';
}

export interface FeeReceiptItem {
  category: FeeCategoryName | string;
  description?: string;
  amount: number;
}

export interface FeeReceipt extends BaseEntity {
  receiptNumber: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  rollNo?: string;
  classId: string;
  guardianName?: string;
  phone?: string;
  
  paymentDate: string;
  paymentMode: 'Cash' | 'UPI' | 'Bank Transfer' | 'Cheque' | 'Card';
  paymentType: 'Full Payment' | 'Partial Payment' | 'Advance Payment' | 'Installment';
  
  transactionRef?: string;
  
  items: FeeReceiptItem[];
  subtotal: number;
  discountAmount: number;
  discountReason?: string;
  fineAmount: number;
  fineReason?: string;
  netPayable: number;
  amountPaid: number;
  balanceDue: number;
  
  remarks?: string;
  collectedBy: string;
  status: 'Paid' | 'Partial' | 'Refunded' | 'Cancelled';
}

export interface FeeDiscountRecord extends BaseEntity {
  studentId: string;
  studentName: string;
  admissionNo: string;
  classId: string;
  category: 'Scholarship' | 'Sibling Discount' | 'Staff Child' | 'Special Discount';
  discountType: 'Percentage' | 'Fixed Amount';
  value: number;
  appliedAmount: number;
  approvalNotes: string;
  approvedBy: string;
  status: 'Active' | 'Expired' | 'Revoked';
}

export interface FeeFineRecord extends BaseEntity {
  studentId: string;
  studentName: string;
  admissionNo: string;
  classId: string;
  fineType: 'Late Fee' | 'Custom Fine';
  amount: number;
  reason: string;
  issueDate: string;
  status: 'Pending' | 'Paid' | 'Waived';
  waivedBy?: string;
  waiveReason?: string;
}

export interface FeeRefundRecord extends BaseEntity {
  receiptId?: string;
  receiptNumber?: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  classId: string;
  refundAmount: number;
  refundDate: string;
  refundMode: 'Cash' | 'Bank Transfer' | 'Cheque';
  reason: string;
  approvedBy: string;
  status: 'Processed' | 'Cancelled';
}

export interface StudentFeeProfileData {
  student: Student;
  applicableStructure?: FeeStructure;
  totalAnnualFee: number;
  totalPaid: number;
  totalDiscount: number;
  totalFine: number;
  totalWaivedFine: number;
  totalRefunded: number;
  balanceDue: number;
  status: 'Clear' | 'Partial' | 'Overdue';
  receipts: FeeReceipt[];
  discounts: FeeDiscountRecord[];
  fines: FeeFineRecord[];
  refunds: FeeRefundRecord[];
}
