import { useState } from 'react';
import { GlassModal } from '../../common/GlassModal';
import { GlassButton } from '../../common/GlassButton';
import { FeeReceipt } from '../../../types/finance';
import { SCHOOL_INFO, downloadReceiptPDF } from '../../../utils/financeUtils';
import { Printer, Download, CheckCircle2, ShieldCheck, GraduationCap } from 'lucide-react';
import { useMasterData } from '../../../hooks/useMasterData';
import { SystemSettings } from '../../../types';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: FeeReceipt | null;
}

export const ReceiptModal = ({ isOpen, onClose, receipt }: ReceiptModalProps) => {
  const { data: settings } = useMasterData<SystemSettings>('settings');
  const [isPrinting, setIsPrinting] = useState(false);

  if (!receipt) return null;

  const schoolName = settings?.[0]?.schoolName || SCHOOL_INFO.name;
  const logoUrl = settings?.[0]?.logoUrl;
  const schoolAddress = settings?.[0]?.schoolAddress || SCHOOL_INFO.address;
  const schoolPhone = settings?.[0]?.contactPhone || SCHOOL_INFO.phone;
  const schoolEmail = settings?.[0]?.contactEmail || SCHOOL_INFO.email;

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 150);
  };

  const handleDownloadPDF = () => {
    downloadReceiptPDF(receipt);
  };

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title="Fee Payment Receipt"
      className="max-w-3xl"
    >
      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-wrap justify-between items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl print:hidden">
          <div className="flex items-center gap-2 text-sm text-emerald-400 font-medium">
            <CheckCircle2 size={18} />
            <span>Receipt #{receipt.receiptNumber}</span>
          </div>
          <div className="flex gap-2">
            <GlassButton
              variant="outline"
              size="sm"
              onClick={handlePrint}
              disabled={isPrinting}
              className="flex items-center gap-2"
            >
              <Printer size={16} /> Print Receipt
            </GlassButton>
            <GlassButton
              variant="primary"
              size="sm"
              onClick={handleDownloadPDF}
              className="flex items-center gap-2"
            >
              <Download size={16} /> Download PDF
            </GlassButton>
          </div>
        </div>

        {/* Receipt Printable Card Area */}
        <div id="printable-receipt" className="bg-slate-900 text-slate-100 p-6 md:p-8 rounded-2xl border border-slate-800 shadow-2xl space-y-6">
          {/* Header */}
          <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-14 h-14 object-contain rounded-lg" />
              ) : (
                <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center font-bold text-2xl border border-emerald-500/20">
                  <GraduationCap size={32} />
                </div>
              )}
              <div>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">{schoolName}</h2>
                <p className="text-xs text-emerald-400 font-medium">{SCHOOL_INFO.subTitle}</p>
                <p className="text-xs text-slate-400 mt-1">{schoolAddress}</p>
                <p className="text-xs text-slate-400">Phone: {schoolPhone} | Email: {schoolEmail}</p>
              </div>
            </div>
            <div className="text-left md:text-right border-l md:border-l-0 md:border-r border-slate-800 pl-3 md:pl-0 md:pr-4">
              <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/30 uppercase tracking-wider mb-2">
                Official Fee Receipt
              </span>
              <p className="font-mono text-sm font-semibold text-slate-200">{receipt.receiptNumber}</p>
              <p className="text-xs text-slate-400 mt-1">Date: <span className="text-slate-200 font-medium">{receipt.paymentDate}</span></p>
            </div>
          </div>

          {/* Student & Payment Metadata Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 text-xs md:text-sm">
            <div className="space-y-1.5">
              <p><span className="text-slate-400">Student Name:</span> <strong className="text-emerald-400 font-semibold">{receipt.studentName}</strong></p>
              <p><span className="text-slate-400">Admission No:</span> <strong className="text-slate-200">{receipt.admissionNo}</strong> {receipt.rollNo && `| Roll: ${receipt.rollNo}`}</p>
              <p><span className="text-slate-400">Class & Section:</span> <strong className="text-slate-200">{receipt.classId}</strong></p>
            </div>
            <div className="space-y-1.5">
              <p><span className="text-slate-400">Guardian Name:</span> <strong className="text-slate-200">{receipt.guardianName || 'N/A'}</strong></p>
              <p><span className="text-slate-400">Payment Mode:</span> <strong className="text-emerald-400 font-semibold">{receipt.paymentMode}</strong> {receipt.transactionRef && `(${receipt.transactionRef})`}</p>
              <p><span className="text-slate-400">Payment Type:</span> <strong className="text-slate-200">{receipt.paymentType}</strong></p>
            </div>
          </div>

          {/* Fee Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs md:text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[11px]">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Fee Category</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {receipt.items && receipt.items.length > 0 ? (
                  receipt.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/20">
                      <td className="py-2.5 px-3 font-mono text-slate-500">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-200">{item.category}</td>
                      <td className="py-2.5 px-3 text-slate-400">{item.description || 'Academic Fee Charge'}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-100">
                        ₹{Number(item.amount).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="py-2.5 px-3 font-mono text-slate-500">1</td>
                    <td className="py-2.5 px-3 font-medium text-slate-200">School Fee Collection</td>
                    <td className="py-2.5 px-3 text-slate-400">Fee Payment</td>
                    <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-100">
                      ₹{Number(receipt.subtotal || receipt.netPayable || 0).toLocaleString('en-IN')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Calculations Breakdown Box */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-4 border-t border-slate-800">
            <div className="space-y-2 text-xs text-slate-400 max-w-sm">
              {receipt.remarks && (
                <p><span className="font-semibold text-slate-300">Remarks:</span> {receipt.remarks}</p>
              )}
              <div className="flex items-center gap-2 text-emerald-400 pt-2">
                <ShieldCheck size={16} />
                <span className="font-mono text-[11px]">Digital Seal: VERIFIED-HAA-{receipt.receiptNumber.slice(-6)}</span>
              </div>
            </div>

            <div className="w-full md:w-72 bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2 text-xs md:text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="font-mono">₹{Number(receipt.subtotal || receipt.netPayable).toLocaleString('en-IN')}</span>
              </div>

              {Number(receipt.discountAmount) > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount {receipt.discountReason ? `(${receipt.discountReason})` : ''}</span>
                  <span className="font-mono">- ₹{Number(receipt.discountAmount).toLocaleString('en-IN')}</span>
                </div>
              )}

              {Number(receipt.fineAmount) > 0 && (
                <div className="flex justify-between text-rose-400">
                  <span>Fine {receipt.fineReason ? `(${receipt.fineReason})` : ''}</span>
                  <span className="font-mono">+ ₹{Number(receipt.fineAmount).toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between pt-2 border-t border-slate-800 font-bold text-sm text-white">
                <span>Net Payable</span>
                <span className="font-mono">₹{Number(receipt.netPayable).toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between font-bold text-base text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20 mt-1">
                <span>Total Paid</span>
                <span className="font-mono">₹{Number(receipt.amountPaid).toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-xs text-slate-400 pt-1">
                <span>Balance Remaining</span>
                <span className="font-mono font-semibold text-amber-400">₹{Number(receipt.balanceDue).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Signatures & Footer */}
          <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs text-slate-400 border-t border-slate-800/80">
            <div>
              <div className="h-10 flex items-end justify-center">
                <span className="font-mono text-xs text-slate-300 font-medium">{receipt.collectedBy || 'Accounts Officer'}</span>
              </div>
              <div className="border-t border-slate-700 pt-1.5 font-medium">Cashier / Collected By</div>
            </div>
            <div>
              <div className="h-10 flex items-end justify-center">
                <span className="font-serif italic text-emerald-400 text-sm font-semibold">Hazrat Aisha Academy</span>
              </div>
              <div className="border-t border-slate-700 pt-1.5 font-medium">Principal / Authorized Signatory</div>
            </div>
          </div>
        </div>
      </div>
    </GlassModal>
  );
};
