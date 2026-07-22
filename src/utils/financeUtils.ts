import { FeeCategoryName, FeeReceipt, FeeStructure } from '../types/finance';
import { Student } from '../types/master';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const FEE_CATEGORIES: FeeCategoryName[] = [
  'Admission Fee',
  'Tuition Fee',
  'Exam Fee',
  'Computer Fee',
  'Library Fee',
  'Transport Fee',
  'Hostel Fee',
  'Annual Charge',
  'Development Fee',
  'Other Charges'
];

export const SCHOOL_INFO = {
  name: 'HAZRAT AISHA ACADEMY',
  subTitle: 'Cultivating Character, Knowledge, and Faith',
  address: 'Chak Rajopatti, Sitamarhi, Bihar - 843302',
  phone: '+91 94720 00000 / +91 98000 11111',
  email: 'accounts@hazrataisha.edu.in',
  website: 'www.hazrataisha.edu.in',
  regNo: 'HAA-2024/E-09 (CBSE Aligned)',
};

export function generateReceiptNumber(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `HAA-REC-${dateStr}-${randomSuffix}`;
}

export const DEFAULT_FEE_STRUCTURES: Partial<FeeStructure>[] = [
  {
    name: 'Primary Wing Fee Structure (Class 1 - 5)',
    session: '2026-2027',
    applicableClasses: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'],
    items: [
      { category: 'Tuition Fee', amount: 1500, frequency: 'Monthly' },
      { category: 'Exam Fee', amount: 800, frequency: 'Term-wise' },
      { category: 'Computer Fee', amount: 400, frequency: 'Monthly' },
      { category: 'Library Fee', amount: 300, frequency: 'Annual' },
      { category: 'Annual Charge', amount: 2500, frequency: 'Annual' },
      { category: 'Development Fee', amount: 1500, frequency: 'Annual' }
    ],
    totalAnnualAmount: 27900,
    status: 'Active'
  },
  {
    name: 'Middle Wing Fee Structure (Class 6 - 8)',
    session: '2026-2027',
    applicableClasses: ['Class 6', 'Class 7', 'Class 8'],
    items: [
      { category: 'Tuition Fee', amount: 2000, frequency: 'Monthly' },
      { category: 'Exam Fee', amount: 1000, frequency: 'Term-wise' },
      { category: 'Computer Fee', amount: 500, frequency: 'Monthly' },
      { category: 'Library Fee', amount: 500, frequency: 'Annual' },
      { category: 'Annual Charge', amount: 3000, frequency: 'Annual' },
      { category: 'Development Fee', amount: 2000, frequency: 'Annual' }
    ],
    totalAnnualAmount: 35500,
    status: 'Active'
  },
  {
    name: 'Pre-Primary Fee Structure (Baby - UKG)',
    session: '2026-2027',
    applicableClasses: ['Baby', 'Nursery', 'LKG', 'UKG'],
    items: [
      { category: 'Admission Fee', amount: 3000, frequency: 'One-time' },
      { category: 'Tuition Fee', amount: 1200, frequency: 'Monthly' },
      { category: 'Annual Charge', amount: 2000, frequency: 'Annual' },
      { category: 'Development Fee', amount: 1000, frequency: 'Annual' }
    ],
    totalAnnualAmount: 20400,
    status: 'Active'
  }
];

export function exportToExcel(data: Record<string, any>[], filename: string) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

export function downloadReceiptPDF(receipt: FeeReceipt, student?: Student) {
  const doc = new jsPDF();
  
  // Header
  doc.setFillColor(15, 23, 42); // Primary dark
  doc.rect(0, 0, 210, 36, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(SCHOOL_INFO.name, 14, 16);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`${SCHOOL_INFO.address} | Phone: ${SCHOOL_INFO.phone}`, 14, 23);
  doc.text(`Reg: ${SCHOOL_INFO.regNo} | Email: ${SCHOOL_INFO.email}`, 14, 29);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('FEE PAYMENT RECEIPT', 14, 48);

  // Receipt info box
  doc.setFillColor(248, 250, 252);
  doc.rect(14, 52, 182, 34, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(14, 52, 182, 34, 'S');

  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);

  doc.setFont('helvetica', 'bold');
  doc.text(`Receipt No:`, 18, 60);
  doc.setFont('helvetica', 'normal');
  doc.text(receipt.receiptNumber, 42, 60);

  doc.setFont('helvetica', 'bold');
  doc.text(`Date:`, 18, 68);
  doc.setFont('helvetica', 'normal');
  doc.text(receipt.paymentDate, 42, 68);

  doc.setFont('helvetica', 'bold');
  doc.text(`Payment Mode:`, 18, 76);
  doc.setFont('helvetica', 'normal');
  doc.text(receipt.paymentMode + (receipt.transactionRef ? ` (${receipt.transactionRef})` : ''), 45, 76);

  doc.setFont('helvetica', 'bold');
  doc.text(`Student Name:`, 110, 60);
  doc.setFont('helvetica', 'normal');
  doc.text(receipt.studentName, 138, 60);

  doc.setFont('helvetica', 'bold');
  doc.text(`Adm / Roll No:`, 110, 68);
  doc.setFont('helvetica', 'normal');
  doc.text(`${receipt.admissionNo} ${receipt.rollNo ? `/ Roll: ${receipt.rollNo}` : ''}`, 138, 68);

  doc.setFont('helvetica', 'bold');
  doc.text(`Class & Guardian:`, 110, 76);
  doc.setFont('helvetica', 'normal');
  doc.text(`${receipt.classId} ${receipt.guardianName ? `(${receipt.guardianName})` : ''}`, 142, 76);

  // Line items table
  const tableRows = receipt.items.map((item, idx) => [
    (idx + 1).toString(),
    item.category,
    item.description || 'Standard Fee Charge',
    `Rs. ${item.amount.toLocaleString('en-IN')}`
  ]);

  autoTable(doc, {
    startY: 92,
    head: [['#', 'Fee Category', 'Description', 'Amount']],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255] },
    columnStyles: {
      0: { cellWidth: 12 },
      1: { cellWidth: 60 },
      2: { cellWidth: 70 },
      3: { cellWidth: 40, halign: 'right' }
    }
  });

  // Summary box
  const finalY = (doc as any).lastAutoTable?.finalY || 140;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Subtotal:`, 120, finalY + 10);
  doc.text(`Rs. ${receipt.subtotal.toLocaleString('en-IN')}`, 190, finalY + 10, { align: 'right' });

  if (receipt.discountAmount > 0) {
    doc.text(`Discount (${receipt.discountReason || 'Discount Applied'}):`, 120, finalY + 16);
    doc.text(`- Rs. ${receipt.discountAmount.toLocaleString('en-IN')}`, 190, finalY + 16, { align: 'right' });
  }

  if (receipt.fineAmount > 0) {
    doc.text(`Fine (${receipt.fineReason || 'Late Fee/Fine'}):`, 120, finalY + 22);
    doc.text(`+ Rs. ${receipt.fineAmount.toLocaleString('en-IN')}`, 190, finalY + 22, { align: 'right' });
  }

  const netY = finalY + (receipt.discountAmount ? 6 : 0) + (receipt.fineAmount ? 6 : 0) + 12;

  doc.setFillColor(241, 245, 249);
  doc.rect(114, netY - 5, 82, 18, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`Amount Paid:`, 120, netY + 2);
  doc.text(`Rs. ${receipt.amountPaid.toLocaleString('en-IN')}`, 190, netY + 2, { align: 'right' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Balance Remaining:`, 120, netY + 8);
  doc.text(`Rs. ${receipt.balanceDue.toLocaleString('en-IN')}`, 190, netY + 8, { align: 'right' });

  // Signatures
  doc.setLineWidth(0.5);
  doc.setDrawColor(203, 213, 225);

  doc.line(20, netY + 40, 70, netY + 40);
  doc.text(`Cashier / Received By`, 25, netY + 45);
  doc.setFontSize(8);
  doc.text(`(${receipt.collectedBy || 'Accounts Section'})`, 28, netY + 49);

  doc.line(140, netY + 40, 190, netY + 40);
  doc.setFontSize(9);
  doc.text(`Authorized Signatory`, 145, netY + 45);
  doc.setFontSize(8);
  doc.text(`Hazrat Aisha Academy`, 146, netY + 49);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('This is a computer-generated fee receipt and requires no physical signature for digital validation.', 105, 285, { align: 'center' });

  doc.save(`${receipt.receiptNumber}_${receipt.studentName.replace(/\s+/g, '_')}.pdf`);
}

export function downloadReportPDF(title: string, headers: string[], rows: (string | number)[][], summaryText?: string) {
  const doc = new jsPDF('p', 'mm', 'a4');
  
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 28, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(SCHOOL_INFO.name, 14, 12);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`${SCHOOL_INFO.address} | ${SCHOOL_INFO.email}`, 14, 18);
  
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(title.toUpperCase(), 14, 38);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, 14, 44);

  if (summaryText) {
    doc.text(summaryText, 14, 50);
  }

  autoTable(doc, {
    startY: summaryText ? 54 : 48,
    head: [headers],
    body: rows.map(row => row.map(cell => String(cell))),
    theme: 'striped',
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 3 }
  });

  doc.save(`${title.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`);
}
