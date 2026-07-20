import { useState, useRef } from 'react';
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react';
import { uploadImage, deleteImage } from '../../../services/masterDataService';
import { GlassButton } from '../../common/GlassButton';
import { useToast } from '../../../contexts/ToastContext';

interface FileUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder: string;
  accept?: string;
  label?: string;
}

export const FileUpload = ({ value, onChange, folder, accept = "image/*,application/pdf", label = "Upload File" }: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (e.g., 10MB limit)
    const maxSizeBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      addToast('File is too large. Maximum size allowed is 10MB.', 'error');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validate file type matching
    const fileType = file.type;
    const fileName = file.name.toLowerCase();
    
    // Simple verification based on standard requirements
    if (accept && accept !== '*/*') {
      const allowedTypes = accept.split(',').map(t => t.trim());
      const isAllowed = allowedTypes.some(type => {
        if (type.startsWith('.')) {
          return fileName.endsWith(type.toLowerCase());
        }
        if (type.endsWith('/*')) {
          const prefix = type.replace('/*', '');
          return fileType.startsWith(prefix);
        }
        return fileType === type;
      });

      if (!isAllowed) {
        addToast(`Invalid file type. Allowed formats: ${accept}`, 'error');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
    }

    try {
      setIsUploading(true);
      const path = `${folder}/${Date.now()}_${file.name}`;
      const url = await uploadImage(file, path);
      onChange(url);
      addToast('File uploaded successfully.', 'info');
    } catch (error: any) {
      console.error("Upload failed", error);
      addToast(error?.message || 'Failed to upload file to Supabase Storage.', 'error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemove = async () => {
    if (value) {
      const previousValue = value;
      onChange(''); // Optimistically clear
      try {
        await deleteImage(previousValue);
        addToast('File removed successfully.', 'info');
      } catch (error) {
        console.error('Failed to delete file from Supabase:', error);
      }
    }
  };

  const isPdf = value?.toLowerCase().includes('.pdf') || value?.toLowerCase().includes('%2Fpdf');

  return (
    <div className="flex flex-col gap-2 w-full">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {value ? (
        <div className="relative w-full h-32 rounded-2xl glass flex items-center justify-center overflow-hidden border-2 border-white/20">
          {isPdf ? (
            <div className="flex flex-col items-center gap-2">
              <FileText size={32} className="text-primary-500" />
              <span className="text-xs text-muted-foreground truncate max-w-[150px]">PDF Document</span>
            </div>
          ) : (
            <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <button type="button" onClick={handleRemove} className="p-2 rounded-full bg-danger-500 text-white">
              <X size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full h-32 rounded-2xl glass border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-3">
          {isUploading ? (
            <span className="text-sm font-medium animate-pulse">Uploading...</span>
          ) : (
            <>
              <div className="flex gap-2 text-muted-foreground opacity-50">
                <ImageIcon size={24} />
                <FileText size={24} />
              </div>
              <GlassButton 
                type="button" 
                variant="ghost" 
                className="text-xs px-4 py-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={16} className="mr-2 inline" /> Select File
              </GlassButton>
            </>
          )}
        </div>
      )}
      <input 
        type="file" 
        accept={accept} 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />
    </div>
  );
};
