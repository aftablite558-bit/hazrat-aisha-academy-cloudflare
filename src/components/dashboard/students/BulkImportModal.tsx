import React, { useState } from 'react';
import { GlassModal } from '../../common/GlassModal';
import { GlassButton } from '../../common/GlassButton';
import { Student, Class } from '../../../types/master';
import { Upload, Download, FileSpreadsheet, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import * as XLSX from 'xlsx';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes: Class[];
  onImport: (students: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>[]) => Promise<void>;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({
  isOpen,
  onClose,
  classes,
  onImport
}) => {
  const [parsedRows, setParsedRows] = useState<Omit<Student, 'id' | 'createdAt' | 'updatedAt'>[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const downloadSampleCSV = () => {
    const headers = ['admissionNo', 'rollNo', 'fullName', 'gender', 'dob', 'fatherName', 'motherName', 'className', 'phone', 'address', 'bloodGroup', 'category', 'religion', 'aadhaar', 'academicSession'];
    const sampleRow = ['HAA-2026-101', '01', 'Aisha Khan', 'Female', '2016-05-12', 'Tariq Khan', 'Nasreen Begum', 'Class 1', '9472000000', 'Sitamarhi, Bihar', 'A+', 'General', 'Islam', '123456789012', '2026-2027'];
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), sampleRow.join(',')].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Student_Import_Template_Hazrat_Aisha.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsName = wb.SheetNames[0];
        const ws = wb.Sheets[wsName];
        const data = XLSX.utils.sheet_to_json<Record<string, any>>(ws);

        if (data.length === 0) {
          setErrorMsg('The selected spreadsheet contains no student records.');
          return;
        }

        const formattedStudents: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>[] = data.map((row, idx) => {
          const matchedClass = classes.find(c => 
            c.className.toLowerCase() === String(row.className || row.class || '').toLowerCase()
          );

          return {
            admissionNo: String(row.admissionNo || `ADM-${Date.now()}-${idx}`),
            rollNo: String(row.rollNo || `${idx + 1}`),
            fullName: String(row.fullName || row.name || 'Unnamed Student'),
            gender: String(row.gender || 'Male'),
            dob: String(row.dob || '2015-01-01'),
            fatherName: String(row.fatherName || row.father || ''),
            motherName: String(row.motherName || row.mother || ''),
            classId: matchedClass?.id || classes[0]?.id || 'class_1',
            phone: String(row.phone || row.mobile || ''),
            address: String(row.address || 'Sitamarhi, Bihar'),
            photoUrl: '',
            status: 'Active',
            admissionDate: new Date().toISOString().slice(0, 10),
            section: String(row.section || 'A'),
            bloodGroup: String(row.bloodGroup || 'O+'),
            category: String(row.category || 'General'),
            religion: String(row.religion || 'Islam'),
            aadhaar: String(row.aadhaar || ''),
            academicSession: String(row.academicSession || '2026-2027')
          };
        });

        setParsedRows(formattedStudents);
      } catch (err) {
        console.error(err);
        setErrorMsg('Failed to parse spreadsheet file. Please use the official CSV template.');
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleConfirmImport = async () => {
    if (parsedRows.length === 0) return;
    setLoading(true);
    try {
      await onImport(parsedRows);
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to import student records into the database.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassModal isOpen={isOpen} onClose={onClose} title="Bulk Student Import via CSV / Excel" className="max-w-4xl">
      <div className="space-y-6">
        {/* Instructions & Template Box */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <FileSpreadsheet size={18} className="text-emerald-500" /> Step 1: Download Official CSV Template
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Download the standardized template pre-formatted with columns for student details.
            </p>
          </div>
          <GlassButton
            type="button"
            variant="ghost"
            onClick={downloadSampleCSV}
            className="flex items-center gap-2 text-xs font-bold text-emerald-600 border-emerald-300 dark:border-emerald-800"
          >
            <Download size={14} /> Download Sample CSV Template
          </GlassButton>
        </div>

        {/* Upload Box */}
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-8 text-center hover:border-primary-500 dark:hover:border-primary-500 transition-colors bg-white/40 dark:bg-slate-900/40">
          <Upload size={36} className="mx-auto text-primary-500 mb-3 opacity-80" />
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
            Step 2: Upload Completed CSV / XLSX File
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Supports Microsoft Excel (.xlsx, .xls) or CSV files.
          </p>

          <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold bg-primary-600 hover:bg-primary-700 text-white cursor-pointer shadow-lg transition-transform active:scale-95">
            <Upload size={16} /> Choose File to Import
            <input
              type="file"
              accept=".csv, .xlsx, .xls"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle size={16} className="flex-shrink-0 text-rose-500" /> {errorMsg}
          </div>
        )}

        {/* Parsed Data Preview */}
        {parsedRows.length > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" /> Verified Records Ready for Import ({parsedRows.length})
              </h4>
              <button
                onClick={() => setParsedRows([])}
                className="text-xs text-rose-500 hover:underline flex items-center gap-1 font-semibold"
              >
                <X size={14} /> Clear Preview
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold sticky top-0">
                  <tr>
                    <th className="p-2.5">Adm No</th>
                    <th className="p-2.5">Roll</th>
                    <th className="p-2.5">Full Name</th>
                    <th className="p-2.5">Gender</th>
                    <th className="p-2.5">Father's Name</th>
                    <th className="p-2.5">Class</th>
                    <th className="p-2.5">Phone</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800">
                  {parsedRows.slice(0, 50).map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-2.5 font-bold text-primary-500">{r.admissionNo}</td>
                      <td className="p-2.5">{r.rollNo}</td>
                      <td className="p-2.5 font-semibold text-slate-800 dark:text-slate-200">{r.fullName}</td>
                      <td className="p-2.5">{r.gender}</td>
                      <td className="p-2.5">{r.fatherName}</td>
                      <td className="p-2.5">{classes.find(c => c.id === r.classId)?.className || r.classId}</td>
                      <td className="p-2.5">{r.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {parsedRows.length > 50 && (
              <p className="text-[10px] text-slate-500 text-center">
                Showing first 50 rows of {parsedRows.length} total rows.
              </p>
            )}
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <GlassButton type="button" variant="ghost" onClick={onClose}>
            Cancel
          </GlassButton>
          <GlassButton
            type="button"
            variant="primary"
            disabled={parsedRows.length === 0 || loading}
            onClick={handleConfirmImport}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
          >
            <CheckCircle2 size={16} />
            {loading ? 'Importing Data...' : `Commit & Import ${parsedRows.length} Student(s)`}
          </GlassButton>
        </div>
      </div>
    </GlassModal>
  );
};
