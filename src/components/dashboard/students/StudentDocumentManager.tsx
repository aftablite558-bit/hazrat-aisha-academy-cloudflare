import React, { useState } from 'react';
import { GlassButton } from '../../common/GlassButton';
import { GlassBadge } from '../../common/GlassBadge';
import { StudentDocument } from '../../../types/master';
import { FileText, Download, Trash2, Eye, Upload, CheckCircle, AlertCircle } from 'lucide-react';

interface StudentDocumentManagerProps {
  documents: StudentDocument[];
  onUpload: (newDoc: StudentDocument) => void;
  onDelete: (docId: string) => void;
  readOnly?: boolean;
}

export const StudentDocumentManager: React.FC<StudentDocumentManagerProps> = ({
  documents,
  onUpload,
  onDelete,
  readOnly = false
}) => {
  const [docType, setDocType] = useState<StudentDocument['type']>('Birth Certificate');
  const [docName, setDocName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<StudentDocument | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const newDoc: StudentDocument = {
        id: 'doc_' + Date.now(),
        type: docType,
        name: docName.trim() || `${docType} - ${file.name}`,
        url: reader.result as string,
        uploadedAt: new Date().toISOString().slice(0, 10),
        size: `${(file.size / 1024).toFixed(1)} KB`
      };
      onUpload(newDoc);
      setDocName('');
      setIsUploading(false);
    };
    reader.onerror = () => {
      setIsUploading(false);
      alert('Failed to read document file.');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {!readOnly && (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-4">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Upload size={16} className="text-primary-500" /> Upload Student Document
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">Document Category</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value as StudentDocument['type'])}
                className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="Birth Certificate">Birth Certificate</option>
                <option value="Aadhaar">Aadhaar Card</option>
                <option value="Transfer Certificate">Transfer Certificate (TC)</option>
                <option value="Report Card">Previous Report Card</option>
                <option value="Medical Certificate">Medical Certificate</option>
                <option value="Photo">Passport Photo</option>
                <option value="Other">Other Document</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">Custom Document Title</label>
              <input
                type="text"
                placeholder="e.g. Birth Cert 2024"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">Select File (PDF / Image)</label>
              <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white cursor-pointer transition-all shadow-md">
                <Upload size={14} /> {isUploading ? 'Uploading...' : 'Browse & Upload'}
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Documents List */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Attached Student Documents ({documents.length})
        </h4>

        {documents.length === 0 ? (
          <div className="p-6 text-center rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 border border-dashed border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs">
            <FileText size={24} className="mx-auto mb-2 opacity-40 text-slate-400" />
            No documents uploaded for this student yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 shadow-sm hover:shadow transition-shadow"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <FileText size={18} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{doc.name}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      <GlassBadge variant="primary" className="text-[9px] py-0 px-1.5">{doc.type}</GlassBadge>
                      <span>{doc.uploadedAt}</span>
                      {doc.size && <span>• {doc.size}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => setPreviewDoc(doc)}
                    className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Preview Document"
                  >
                    <Eye size={15} />
                  </button>
                  <a
                    href={doc.url}
                    download={doc.name}
                    className="p-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                    title="Download File"
                  >
                    <Download size={15} />
                  </a>
                  {!readOnly && (
                    <button
                      onClick={() => onDelete(doc.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Delete Document"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{previewDoc.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{previewDoc.type} • Uploaded on {previewDoc.uploadedAt}</p>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
              >
                Close Preview
              </button>
            </div>

            <div className="flex-1 overflow-auto bg-slate-100 dark:bg-slate-950 rounded-2xl p-4 flex items-center justify-center min-h-[300px]">
              {previewDoc.url.startsWith('data:image/') || previewDoc.url.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                <img src={previewDoc.url} alt={previewDoc.name} className="max-h-[60vh] object-contain rounded-xl shadow-md" />
              ) : previewDoc.url.startsWith('data:application/pdf') ? (
                <iframe src={previewDoc.url} className="w-full h-[60vh] rounded-xl border-0" title={previewDoc.name} />
              ) : (
                <div className="text-center py-12 text-slate-500 dark:text-slate-400 space-y-3">
                  <AlertCircle size={36} className="mx-auto text-amber-500 opacity-80" />
                  <p className="text-sm font-medium">Direct preview is not supported for this file format.</p>
                  <a
                    href={previewDoc.url}
                    download={previewDoc.name}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-md"
                  >
                    <Download size={14} /> Download File
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
