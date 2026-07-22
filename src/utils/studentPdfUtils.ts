import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Student, Class } from '../types/master';
import { SCHOOL_INFO } from './financeUtils';

export interface TCDetails {
  tcNumber: string;
  issueDate: string;
  dateOfLeaving: string;
  reasonForLeaving: string;
  conduct: string;
  promotedToNextClass: string;
  feesPaidUpTo: string;
  totalWorkingDays: string;
  totalDaysPresent: string;
  remarks?: string;
}

export interface BonafideDetails {
  certNumber: string;
  issueDate: string;
  purpose: string;
  academicSession: string;
}

export interface CharacterDetails {
  certNumber: string;
  issueDate: string;
  academicSession: string;
  conductRating: string;
  participation?: string;
  remarks?: string;
}

/**
 * Generates an official Transfer Certificate PDF
 */
export function generateTransferCertificatePDF(student: Student, tc: TCDetails, className: string) {
  const doc = new jsPDF('p', 'mm', 'a4');
  
  // Outer Decorative Border
  doc.setLineWidth(1);
  doc.setDrawColor(15, 23, 42); // slate-900
  doc.rect(8, 8, 194, 281);
  
  doc.setLineWidth(0.4);
  doc.setDrawColor(217, 119, 6); // amber-600 gold border
  doc.rect(10, 10, 190, 277);

  // Header Banner
  doc.setFillColor(15, 23, 42);
  doc.rect(12, 12, 186, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(SCHOOL_INFO.name, 105, 24, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`${SCHOOL_INFO.address} | Phone: ${SCHOOL_INFO.phone}`, 105, 31, { align: 'center' });
  doc.text(`Reg / Affiliation No: ${SCHOOL_INFO.regNo} | Email: ${SCHOOL_INFO.email}`, 105, 37, { align: 'center' });

  // Certificate Title
  doc.setTextColor(180, 83, 9); // Amber gold dark
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('TRANSFER CERTIFICATE', 105, 52, { align: 'center' });

  doc.setDrawColor(180, 83, 9);
  doc.setLineWidth(0.5);
  doc.line(70, 54, 140, 54);

  // Serial & Reference Box
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'bold');
  doc.text(`TC No: ${tc.tcNumber}`, 16, 62);
  doc.text(`Admission No: ${student.admissionNo}`, 105, 62, { align: 'center' });
  doc.text(`Date of Issue: ${tc.issueDate}`, 194, 62, { align: 'right' });

  // Content Table / Details List
  const items = [
    ['1. Full Name of Student', student.fullName.toUpperCase()],
    ['2. Mother\'s Name', (student.motherName || 'N/A').toUpperCase()],
    ['3. Father\'s / Guardian\'s Name', (student.fatherName || 'N/A').toUpperCase()],
    ['4. Nationality & Religion', `Indian / ${student.religion || 'Islam'}`],
    ['5. Category (Gen/OBC/SC/ST/EWS)', student.category || 'General'],
    ['6. Aadhaar Number', student.aadhaar || 'N/A'],
    ['7. Date of First Admission in School', student.admissionDate || 'N/A'],
    ['8. Date of Birth (in Figures & Words)', `${student.dob} (${formatDateToWords(student.dob)})`],
    ['9. Class in which student last studied', `${className} ${student.section ? `(Sec: ${student.section})` : ''}`],
    ['10. School / Board Annual Exam Last Taken', `${className} Passed / Appeared`],
    ['11. Whether Qualified for Promotion', tc.promotedToNextClass || 'Yes'],
    ['12. Month up to which School Dues Paid', tc.feesPaidUpTo || 'March 2026'],
    ['13. Total Number of Working Days', tc.totalWorkingDays || '210 Days'],
    ['14. Total Number of Days Present', tc.totalDaysPresent || '195 Days'],
    ['15. General Conduct / Character', tc.conduct || 'Very Good / Exemplary'],
    ['16. Date of Application for Certificate', tc.issueDate],
    ['17. Date of Leaving School', tc.dateOfLeaving || new Date().toISOString().slice(0, 10)],
    ['18. Reason for Leaving School', tc.reasonForLeaving || 'Parent Transfer / Higher Studies'],
    ['19. Any Other Remarks', tc.remarks || 'Dues cleared. Student has no pending liabilities.']
  ];

  autoTable(doc, {
    startY: 68,
    margin: { left: 16, right: 16 },
    body: items,
    theme: 'plain',
    styles: { fontSize: 9, cellPadding: 2.5, textColor: [30, 41, 59] },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 80, textColor: [30, 41, 59] },
      1: { cellWidth: 100, textColor: [15, 23, 42] }
    },
    didDrawCell: (data) => {
      // Draw horizontal separator lines
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.1);
      doc.line(data.cell.x, data.cell.y + data.cell.height, data.cell.x + data.cell.width, data.cell.y + data.cell.height);
    }
  });

  const finalY = (doc as any).lastAutoTable?.finalY || 220;

  // Signatures Section
  const sigY = Math.max(finalY + 25, 245);

  doc.setLineWidth(0.5);
  doc.setDrawColor(148, 163, 184);

  doc.line(20, sigY, 65, sigY);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Prepared By', 42.5, sigY + 5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('(Class Teacher / Admin)', 42.5, sigY + 9, { align: 'center' });

  doc.line(85, sigY, 130, sigY);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Checked By', 107.5, sigY + 5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('(School Office / Incharge)', 107.5, sigY + 9, { align: 'center' });

  doc.line(150, sigY, 195, sigY);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Principal Signature & Seal', 172.5, sigY + 5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Hazrat Aisha Academy`, 172.5, sigY + 9, { align: 'center' });

  // Footer Note
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Note: Any alteration or erasure invalidates this Transfer Certificate.', 105, 282, { align: 'center' });

  doc.save(`TC_${student.admissionNo}_${student.fullName.replace(/\s+/g, '_')}.pdf`);
}

/**
 * Generates an official Bonafide Certificate PDF
 */
export function generateBonafideCertificatePDF(student: Student, details: BonafideDetails, className: string) {
  const doc = new jsPDF('p', 'mm', 'a4');

  // Decorative Border
  doc.setLineWidth(1);
  doc.setDrawColor(15, 23, 42);
  doc.rect(8, 8, 194, 281);
  doc.setLineWidth(0.4);
  doc.setDrawColor(13, 148, 136); // teal-600
  doc.rect(10, 10, 190, 277);

  // Header Banner
  doc.setFillColor(15, 23, 42);
  doc.rect(12, 12, 186, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(SCHOOL_INFO.name, 105, 24, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`${SCHOOL_INFO.address} | Phone: ${SCHOOL_INFO.phone}`, 105, 31, { align: 'center' });
  doc.text(`Email: ${SCHOOL_INFO.email} | Web: ${SCHOOL_INFO.website}`, 105, 37, { align: 'center' });

  // Title
  doc.setTextColor(13, 148, 136);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('BONAFIDE STUDENT CERTIFICATE', 105, 58, { align: 'center' });

  doc.setDrawColor(13, 148, 136);
  doc.setLineWidth(0.5);
  doc.line(60, 61, 150, 61);

  // Ref Details
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'bold');
  doc.text(`Ref No: ${details.certNumber}`, 16, 72);
  doc.text(`Date: ${details.issueDate}`, 194, 72, { align: 'right' });

  // Main Body Paragraphs
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);

  const textLines = [
    `This is to certify that Master / Miss ${student.fullName.toUpperCase()}, Son/Daughter of Mr. ${(student.fatherName || 'N/A').toUpperCase()} and Mrs. ${(student.motherName || 'N/A').toUpperCase()}, residing at ${student.address || 'Sitamarhi, Bihar'}, is a bonafide student of Hazrat Aisha Academy, Sitamarhi.`,
    ``,
    `He / She is currently studying in ${className} (Section: ${student.section || 'A'}) under Admission Number ${student.admissionNo} and Roll Number ${student.rollNo} for the Academic Session ${details.academicSession || '2026-2027'}.`,
    ``,
    `According to school records, his/her Date of Birth is ${student.dob}.`,
    ``,
    `This certificate is issued upon the request of the parent/guardian for the specific purpose of:`,
    `"${details.purpose || 'Official Documentation / Bank Account / Scholarship Application'}".`,
    ``,
    `To the best of our knowledge and belief, he/she bears good moral character and conduct.`
  ];

  let currentY = 88;
  textLines.forEach((line) => {
    if (line === '') {
      currentY += 4;
      return;
    }
    const splitText = doc.splitTextToSize(line, 170);
    doc.text(splitText, 20, currentY);
    currentY += splitText.length * 6 + 2;
  });

  // Signatures
  const sigY = 230;
  doc.setLineWidth(0.5);
  doc.setDrawColor(148, 163, 184);

  doc.line(20, sigY, 70, sigY);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Administrative Officer', 45, sigY + 5, { align: 'center' });

  doc.line(140, sigY, 190, sigY);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Principal Signature & Seal', 165, sigY + 5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Hazrat Aisha Academy', 165, sigY + 9, { align: 'center' });

  doc.save(`Bonafide_${student.admissionNo}_${student.fullName.replace(/\s+/g, '_')}.pdf`);
}

/**
 * Generates an official Character & Conduct Certificate PDF
 */
export function generateCharacterCertificatePDF(student: Student, details: CharacterDetails, className: string) {
  const doc = new jsPDF('p', 'mm', 'a4');

  // Border
  doc.setLineWidth(1);
  doc.setDrawColor(15, 23, 42);
  doc.rect(8, 8, 194, 281);
  doc.setLineWidth(0.4);
  doc.setDrawColor(124, 58, 237); // purple-600
  doc.rect(10, 10, 190, 277);

  // Header Banner
  doc.setFillColor(15, 23, 42);
  doc.rect(12, 12, 186, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(SCHOOL_INFO.name, 105, 24, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`${SCHOOL_INFO.address} | Phone: ${SCHOOL_INFO.phone}`, 105, 31, { align: 'center' });
  doc.text(`Email: ${SCHOOL_INFO.email} | Web: ${SCHOOL_INFO.website}`, 105, 37, { align: 'center' });

  // Title
  doc.setTextColor(124, 58, 237);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('CHARACTER & CONDUCT CERTIFICATE', 105, 58, { align: 'center' });

  doc.setDrawColor(124, 58, 237);
  doc.setLineWidth(0.5);
  doc.line(55, 61, 155, 61);

  // Ref Details
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'bold');
  doc.text(`Certificate No: ${details.certNumber}`, 16, 72);
  doc.text(`Date of Issue: ${details.issueDate}`, 194, 72, { align: 'right' });

  // Main Body
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);

  const textLines = [
    `This is to certify that ${student.fullName.toUpperCase()}, Son/Daughter of Mr. ${(student.fatherName || 'N/A').toUpperCase()} and Mrs. ${(student.motherName || 'N/A').toUpperCase()}, has been a student of Hazrat Aisha Academy studying in ${className} during the session ${details.academicSession || '2025-2026'}.`,
    ``,
    `During his/her tenure at the institution, his/her general conduct and behavior have been found to be ${details.conductRating || 'EXEMPLARY & COMMENDABLE'}.`,
    ``,
    `Participation in Co-Curricular & Sports Activities:`,
    `"${details.participation || 'Active participant in school assemblies, academic debates, sports, and cultural events.'}"`,
    ``,
    `To the best of my knowledge, he/she possesses a pleasant demeanor, high ethical values, and a respectful attitude towards teachers, staff, and fellow peers.`,
    ``,
    `We wish him/her the very best in all future academic endeavors and career pursuits.`
  ];

  let currentY = 88;
  textLines.forEach((line) => {
    if (line === '') {
      currentY += 4;
      return;
    }
    const splitText = doc.splitTextToSize(line, 170);
    doc.text(splitText, 20, currentY);
    currentY += splitText.length * 6 + 2;
  });

  // Signatures
  const sigY = 230;
  doc.setLineWidth(0.5);
  doc.setDrawColor(148, 163, 184);

  doc.line(20, sigY, 70, sigY);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Class Teacher / Incharge', 45, sigY + 5, { align: 'center' });

  doc.line(140, sigY, 190, sigY);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Principal Signature & Seal', 165, sigY + 5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Hazrat Aisha Academy', 165, sigY + 9, { align: 'center' });

  doc.save(`Character_Cert_${student.admissionNo}_${student.fullName.replace(/\s+/g, '_')}.pdf`);
}

/**
 * Generates Printable Student ID Cards PDF (Single or Batch Grid)
 */
export function generateStudentIDCardPDF(students: Student[], classesList: Class[]) {
  const doc = new jsPDF('p', 'mm', 'a4');
  
  // Standard CR80 ID Card dimensions: 85.6mm x 54mm
  const cardW = 85.6;
  const cardH = 54;
  const marginX = 14;
  const marginY = 14;
  const gapX = 10;
  const gapY = 12;

  students.forEach((student, idx) => {
    if (idx > 0 && idx % 10 === 0) {
      doc.addPage();
    }

    const posOnPage = idx % 10;
    const col = posOnPage % 2;
    const row = Math.floor(posOnPage / 2);

    const x = marginX + col * (cardW + gapX);
    const y = marginY + row * (cardH + gapY);

    const className = classesList.find(c => c.id === student.classId)?.className || student.classId;

    // Outer card border
    doc.setDrawColor(203, 213, 225);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(x, y, cardW, cardH, 3, 3, 'FD');

    // Header strip
    doc.setFillColor(15, 23, 42);
    doc.roundedRect(x, y, cardW, 14, 3, 3, 'F');
    doc.rect(x, y + 10, cardW, 4, 'F'); // square bottom corners of header

    // Header Text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('HAZRAT AISHA ACADEMY', x + cardW / 2, y + 5.5, { align: 'center' });

    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.text('Sitamarhi, Bihar | STUDENT IDENTITY CARD', x + cardW / 2, y + 9.5, { align: 'center' });

    // Photo Box
    const photoX = x + 4;
    const photoY = y + 16;
    const photoW = 20;
    const photoH = 25;

    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.rect(photoX, photoY, photoW, photoH, 'FD');

    doc.setFontSize(12);
    doc.setTextColor(148, 163, 184);
    doc.text(student.fullName.charAt(0), photoX + photoW / 2, photoY + photoH / 2 + 2, { align: 'center' });

    // Details Block
    const detailsX = x + 27;
    let detY = y + 18;

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text(student.fullName.length > 20 ? student.fullName.slice(0, 18) + '...' : student.fullName, detailsX, detY);

    detY += 4.5;
    doc.setFontSize(6.5);
    doc.setTextColor(71, 85, 105);

    doc.setFont('helvetica', 'bold');
    doc.text('Adm No:', detailsX, detY);
    doc.setFont('helvetica', 'normal');
    doc.text(student.admissionNo, detailsX + 13, detY);

    detY += 4;
    doc.setFont('helvetica', 'bold');
    doc.text('Class & Sec:', detailsX, detY);
    doc.setFont('helvetica', 'normal');
    doc.text(`${className} ${student.section ? `(${student.section})` : ''}`, detailsX + 16, detY);

    detY += 4;
    doc.setFont('helvetica', 'bold');
    doc.text('Roll No:', detailsX, detY);
    doc.setFont('helvetica', 'normal');
    doc.text(student.rollNo || 'N/A', detailsX + 13, detY);

    detY += 4;
    doc.setFont('helvetica', 'bold');
    doc.text('D.O.B:', detailsX, detY);
    doc.setFont('helvetica', 'normal');
    doc.text(student.dob || 'N/A', detailsX + 13, detY);

    detY += 4;
    doc.setFont('helvetica', 'bold');
    doc.text('Blood Grp:', detailsX, detY);
    doc.setFont('helvetica', 'normal');
    doc.text(student.bloodGroup || 'O+', detailsX + 16, detY);

    detY += 4;
    doc.setFont('helvetica', 'bold');
    doc.text('Parent Mobile:', detailsX, detY);
    doc.setFont('helvetica', 'normal');
    doc.text(student.phone || 'N/A', detailsX + 19, detY);

    // Bottom Bar (Principal Sign & Emergency)
    const botY = y + cardH - 8;
    doc.setFillColor(248, 250, 252);
    doc.rect(x + 1, botY, cardW - 2, 7, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(x, botY, x + cardW, botY);

    doc.setFontSize(5.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Emergency: +91 94720 00000', x + 4, botY + 4.5);
    doc.text('Principal Sign: ____________', x + cardW - 4, botY + 4.5, { align: 'right' });
  });

  doc.save(`Student_ID_Cards_${students.length}_Records.pdf`);
}

/**
 * Utility to format Date string to English Words
 */
function formatDateToWords(dateStr: string): string {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  } catch {
    return dateStr;
  }
}
