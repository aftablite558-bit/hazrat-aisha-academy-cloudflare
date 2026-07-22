import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { uploadImage, deleteImage } from '../../services/storage';
import { useToast } from '../../contexts/ToastContext';

interface GlassImageUploadProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  path: string;
}

export const GlassImageUpload = ({ label, value, onChange, path }: GlassImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (e.g., 5MB limit)
      const maxSizeBytes = 5 * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        addToast('File is too large. Maximum size allowed is 5MB.', 'error');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        addToast('Invalid file format. Please upload an image file.', 'error');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      setIsUploading(true);
      try {
        const url = await uploadImage(file, path);
        onChange(url);
        addToast('Image uploaded successfully.', 'info');
      } catch (error: unknown) {
        console.error('Error uploading image', error);
        addToast((error instanceof Error ? error.message : String(error)) || 'Failed to upload image to Supabase Storage.', 'error');
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  const handleClear = async () => {
    if (!value) return;
    const previousValue = value;
    onChange(''); // Optimistically clear in UI
    
    try {
      // Call Supabase delete
      await deleteImage(previousValue);
      addToast('Image removed successfully.', 'info');
    } catch (error) {
      console.error('Failed to delete image from Supabase:', error);
      // Fallback is handled gracefully by not failing the user experience
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm font-semibold text-secondary-foreground">{label}</label>}
      <div className="flex items-center gap-4">
        {value ? (
          <div className="relative w-28 h-28 rounded-2xl overflow-hidden glass border-2 border-emerald-500/40 shadow-lg group">
            <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
            <button
              onClick={handleClear}
              type="button"
              aria-label="Remove image"
              className="absolute top-1.5 right-1.5 p-1.5 bg-rose-600 hover:bg-rose-700 rounded-full text-white shadow-md transition-all hover:scale-110"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-28 h-28 rounded-2xl glass border-2 border-dashed border-emerald-500/30 hover:border-emerald-500 flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-500/10 transition-all group"
          >
            {isUploading ? (
              <span className="text-xs font-bold text-emerald-500 animate-pulse">Uploading...</span>
            ) : (
              <>
                <Upload size={24} className="text-emerald-500/80 group-hover:text-emerald-500 group-hover:scale-110 transition-all mb-1" />
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">Upload Image</span>
              </>
            )}
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
};
