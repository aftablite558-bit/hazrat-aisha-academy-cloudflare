import { useState, useMemo, useEffect } from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { GlassTable } from '../../../components/common/GlassTable';
import { GlassButton } from '../../../components/common/GlassButton';
import { GlassInput } from '../../../components/common/GlassInput';
import { GlassSelect } from '../../../components/common/GlassSelect';
import { GlassBadge } from '../../../components/common/GlassBadge';
import { Pagination } from '../../../components/common/Pagination';
import { BackButton } from '../../../components/common/BackButton';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';

import { useMasterData } from '../../../hooks/useMasterData';
import { Student, Class } from '../../../types/master';
import {
  FeeReceipt,
  FeeStructure,
  FeeDiscountRecord,
  FeeFineRecord,
  FeeRefundRecord
} from '../../../types/finance';
import { DEFAULT_FEE_STRUCTURES } from '../../../utils/financeUtils';

import {
  Search, Plus, Printer, Eye, Trash2, LayoutDashboard,
  CreditCard, AlertCircle, Layers, Percent, RefreshCw, FileText
} from 'lucide-react';

import { FinanceDashboard } from '../../../components/dashboard/finance/FinanceDashboard';
import { FeeCollectionModal } from '../../../components/dashboard/finance/FeeCollectionModal';
import { ReceiptModal } from '../../../components/dashboard/finance/ReceiptModal';
import { StudentFeeProfileModal } from '../../../components/dashboard/finance/StudentFeeProfileModal';
import { FeeStructureManager } from '../../../components/dashboard/finance/FeeStructureManager';
import { PendingDuesView } from '../../../components/dashboard/finance/PendingDuesView';
import { DiscountsAndFinesView } from '../../../components/dashboard/finance/DiscountsAndFinesView';
import { RefundsView } from '../../../components/dashboard/finance/RefundsView';
import { FinanceReports } from '../../../components/dashboard/finance/FinanceReports';
import { useAuth } from '../../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export const Fees = () => {
  const { profile } = useAuth();

  // Active Tab State
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'receipts' | 'pending' | 'structures' | 'discounts' | 'refunds' | 'reports'
  >('dashboard');

  // Master Data Hooks
  const { data: students } = useMasterData<Student>('students');
  const { data: classes } = useMasterData<Class>('classes');

  const {
    data: feeReceipts,
    addRecord: addReceipt,
    deleteRecord: deleteReceipt
  } = useMasterData<FeeReceipt>('fee_receipts');

  const {
    data: feeStructures,
    addRecord: addStructure,
    updateRecord: updateStructure,
    deleteRecord: deleteStructure
  } = useMasterData<FeeStructure>('fee_structures');

  const {
    data: feeDiscounts,
    addRecord: addDiscount
  } = useMasterData<FeeDiscountRecord>('fee_discounts');

  const {
    data: feeFines,
    addRecord: addFine,
    updateRecord: updateFine
  } = useMasterData<FeeFineRecord>('fee_fines');

  const {
    data: feeRefunds,
    addRecord: addRefund
  } = useMasterData<FeeRefundRecord>('fee_refunds');

  // Seed default fee structures if empty
  useEffect(() => {
    if (feeStructures.length === 0) {
      DEFAULT_FEE_STRUCTURES.forEach(struct => {
        addStructure(struct as any).catch(() => {});
      });
    }
  }, [feeStructures.length, addStructure]);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals state
  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);
  const [selectedStudentForCollection, setSelectedStudentForCollection] = useState<string | undefined>(undefined);

  const [selectedReceipt, setSelectedReceipt] = useState<FeeReceipt | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<Student | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const [receiptToDelete, setReceiptToDelete] = useState<FeeReceipt | null>(null);
  const [isDeleteReceiptOpen, setIsDeleteReceiptOpen] = useState(false);

  // Filter receipts by search (Name, Admission No, Roll No, Mobile, Receipt Number)
  const filteredReceipts = useMemo(() => {
    return feeReceipts.filter(r => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        !term ||
        (r.studentName || '').toLowerCase().includes(term) ||
        (r.admissionNo || '').toLowerCase().includes(term) ||
        (r.rollNo || '').toLowerCase().includes(term) ||
        (r.phone || '').toLowerCase().includes(term) ||
        (r.receiptNumber || '').toLowerCase().includes(term);

      const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    }).sort((a, b) => new Date(b.paymentDate || 0).getTime() - new Date(a.paymentDate || 0).getTime());
  }, [feeReceipts, searchTerm, statusFilter]);

  const paginatedReceipts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredReceipts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredReceipts, currentPage]);

  const totalPages = Math.ceil(filteredReceipts.length / itemsPerPage);

  // Security Check: Block teachers
  if (profile?.role === 'teacher') {
    return <Navigate to="/unauthorized" replace />;
  }

  // Handlers
  const handleOpenCollect = (studentId?: string) => {
    setSelectedStudentForCollection(studentId);
    setIsCollectModalOpen(true);
  };

  const handleSaveCollect = async (payload: Partial<FeeReceipt>) => {
    await addReceipt(payload as any);
  };

  const handleViewReceipt = (receipt: FeeReceipt) => {
    setSelectedReceipt(receipt);
    setIsReceiptModalOpen(true);
  };

  const handleViewStudentProfile = (student: Student) => {
    setSelectedStudentForProfile(student);
    setIsProfileModalOpen(true);
  };

  const handleWaiveFine = async (fineId: string, waiveReason: string) => {
    await updateFine(fineId, { status: 'Waived', waiveReason } as any);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-start mb-[-1.5rem] relative z-20">
        <BackButton />
      </div>

      <PageHeader
        title="Fees & Finance Management"
        description="Comprehensive financial management platform for Hazrat Aisha Academy — Fee structures, receipts, pending dues, discounts, fines, and reports."
      />

      {/* Main Tab Navigation */}
      <div className="flex flex-wrap gap-2 p-2 bg-slate-900 border border-slate-800 rounded-2xl">
        {[
          { id: 'dashboard', label: 'Finance Dashboard', icon: LayoutDashboard },
          { id: 'receipts', label: 'Fee Collection & Receipts', icon: CreditCard },
          { id: 'pending', label: 'Pending Dues', icon: AlertCircle },
          { id: 'structures', label: 'Fee Structures', icon: Layers },
          { id: 'discounts', label: 'Discounts & Fines', icon: Percent },
          { id: 'refunds', label: 'Refunds', icon: RefreshCw },
          { id: 'reports', label: 'Reports & Export', icon: FileText },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/20 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: FINANCE DASHBOARD */}
      {activeTab === 'dashboard' && (
        <FinanceDashboard
          receipts={feeReceipts}
          refunds={feeRefunds}
          discounts={feeDiscounts}
          students={students}
          onViewReceipt={handleViewReceipt}
          onNavigateTab={(tab) => setActiveTab(tab as any)}
        />
      )}

      {/* TAB 2: FEE COLLECTION & RECEIPTS LIST */}
      {activeTab === 'receipts' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <GlassInput
                placeholder="Search by student name, adm no, roll no, mobile, receipt #..."
                className="pl-12"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>

            <div className="flex gap-4">
              <GlassSelect
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="All">All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Partial">Partial</option>
              </GlassSelect>

              <GlassButton variant="primary" className="flex items-center gap-2 whitespace-nowrap" onClick={() => handleOpenCollect()}>
                <Plus size={18} /> Collect Fee
              </GlassButton>
            </div>
          </div>

          <GlassTable>
            <thead>
              <tr>
                <th>Receipt #</th>
                <th>Student Details</th>
                <th>Class</th>
                <th>Date & Mode</th>
                <th>Paid Amount</th>
                <th>Balance Due</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedReceipts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-muted-foreground">
                    No payment receipt records found. Click "Collect Fee" to issue a receipt.
                  </td>
                </tr>
              ) : (
                paginatedReceipts.map(r => {
                  const matchedStudent = students.find(s => s.id === r.studentId || s.admissionNo === r.admissionNo);
                  return (
                    <tr key={r.id}>
                      <td className="font-mono text-xs font-bold text-primary-400">{r.receiptNumber}</td>
                      <td>
                        <div className="font-semibold text-white">{r.studentName}</div>
                        <div className="text-xs text-muted-foreground">Adm: {r.admissionNo} {r.rollNo ? `| Roll: ${r.rollNo}` : ''}</div>
                      </td>
                      <td className="font-medium text-slate-200">{r.classId}</td>
                      <td>
                        <div className="text-xs text-slate-200 font-medium">{r.paymentDate}</div>
                        <div className="text-[11px] text-muted-foreground">{r.paymentMode}</div>
                      </td>
                      <td className="font-mono font-bold text-emerald-400">₹{Number(r.amountPaid || 0).toLocaleString()}</td>
                      <td className="font-mono font-semibold text-amber-400">₹{Number(r.balanceDue || 0).toLocaleString()}</td>
                      <td>
                        <GlassBadge variant={r.status === 'Paid' ? 'success' : 'warning'}>
                          {r.status}
                        </GlassBadge>
                      </td>
                      <td>
                        <div className="flex justify-end gap-2">
                          <button
                            className="p-2 hover:bg-white/10 rounded-full text-emerald-400"
                            onClick={() => handleViewReceipt(r)}
                            title="Print / PDF Receipt"
                          >
                            <Printer size={16} />
                          </button>
                          {matchedStudent && (
                            <button
                              className="p-2 hover:bg-white/10 rounded-full text-slate-300"
                              onClick={() => handleViewStudentProfile(matchedStudent)}
                              title="View Student Fee Profile"
                            >
                              <Eye size={16} />
                            </button>
                          )}
                          <button
                            className="p-2 hover:bg-white/10 rounded-full text-rose-400"
                            onClick={() => { setReceiptToDelete(r); setIsDeleteReceiptOpen(true); }}
                            title="Delete Record"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </GlassTable>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* TAB 3: PENDING DUES */}
      {activeTab === 'pending' && (
        <PendingDuesView
          students={students}
          classes={classes}
          receipts={feeReceipts}
          structures={feeStructures}
          onCollectFee={(studentId) => handleOpenCollect(studentId)}
          onViewProfile={(student) => handleViewStudentProfile(student)}
        />
      )}

      {/* TAB 4: FEE STRUCTURES */}
      {activeTab === 'structures' && (
        <FeeStructureManager
          structures={feeStructures}
          classes={classes}
          onAdd={async (struct) => { await addStructure(struct as any); }}
          onUpdate={async (id, struct) => { await updateStructure(id, struct as any); }}
          onDelete={async (id) => { await deleteStructure(id); }}
        />
      )}

      {/* TAB 5: DISCOUNTS & FINES */}
      {activeTab === 'discounts' && (
        <DiscountsAndFinesView
          students={students}
          discounts={feeDiscounts}
          fines={feeFines}
          onAddDiscount={async (disc) => { await addDiscount(disc as any); }}
          onAddFine={async (fine) => { await addFine(fine as any); }}
          onWaiveFine={handleWaiveFine}
        />
      )}

      {/* TAB 6: REFUNDS */}
      {activeTab === 'refunds' && (
        <RefundsView
          students={students}
          receipts={feeReceipts}
          refunds={feeRefunds}
          onAddRefund={async (rf) => { await addRefund(rf as any); }}
        />
      )}

      {/* TAB 7: REPORTS */}
      {activeTab === 'reports' && (
        <FinanceReports
          receipts={feeReceipts}
          students={students}
          classes={classes}
          discounts={feeDiscounts}
          fines={feeFines}
          refunds={feeRefunds}
        />
      )}

      {/* MODALS */}
      <FeeCollectionModal
        isOpen={isCollectModalOpen}
        onClose={() => setIsCollectModalOpen(false)}
        students={students}
        onSave={handleSaveCollect}
        preselectedStudentId={selectedStudentForCollection}
      />

      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        receipt={selectedReceipt}
      />

      <StudentFeeProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        student={selectedStudentForProfile}
        receipts={feeReceipts}
        discounts={feeDiscounts}
        fines={feeFines}
        refunds={feeRefunds}
        structures={feeStructures}
        onOpenCollectModal={(sId) => { setIsProfileModalOpen(false); handleOpenCollect(sId); }}
        onViewReceipt={(r) => handleViewReceipt(r)}
        onApplyDiscount={(st) => { setIsProfileModalOpen(false); setActiveTab('discounts'); }}
        onApplyFine={(st) => { setIsProfileModalOpen(false); setActiveTab('discounts'); }}
        onIssueRefund={(st) => { setIsProfileModalOpen(false); setActiveTab('refunds'); }}
      />

      <ConfirmDialog
        isOpen={isDeleteReceiptOpen}
        onClose={() => setIsDeleteReceiptOpen(false)}
        onConfirm={async () => {
          if (receiptToDelete?.id) {
            await deleteReceipt(receiptToDelete.id);
            setIsDeleteReceiptOpen(false);
          }
        }}
        title="Delete Fee Receipt Record"
        message={`Are you sure you want to delete receipt ${receiptToDelete?.receiptNumber}? This action cannot be undone.`}
        confirmText="Delete Receipt"
      />
    </div>
  );
};
