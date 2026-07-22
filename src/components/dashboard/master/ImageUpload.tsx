import { useState, useRef } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { uploadImage, deleteImage } from '../../../services/masterDataService';
import { GlassButton } from '../../common/GlassButton';
import { useToast } from '../../../contexts/ToastContext';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder: string;
}

export const ImageUpload = ({ value, onChange, folder }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (e.g., 5MB limit)
    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      addToast('File is too large. Maximum size allowed is 5MB.', 'error');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validate image format
    if (!file.type.startsWith('image/')) {
      addToast('Invalid file format. Please upload an image file.', 'error');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    try {
      setIsUploading(true);
      const path = `${folder}/${Date.now()}_${file.name}`;
      const url = await uploadImage(file, path);
      onChange(url);
      addToast('Photo uploaded successfully.', 'info');
    } catch (error: unknown) {
      console.error("Upload failed", error);
      addToast((error instanceof Error ? error.message : String(error)) || 'Failed to upload image.', 'error');
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
        addToast('Photo removed successfully.', 'info');
      } catch (error) {
        console.error('Failed to delete image from Supabase:', error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-32 h-32 rounded-3xl glass flex items-center justify-center overflow-hidden border-2 border-emerald-500/30 dark:border-amber-500/20 shadow-lg group">
        {value ? (
          <>
            <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button type="button" onClick={handleRemove} aria-label="Remove image" className="p-2.5 rounded-full bg-rose-600 text-white shadow-lg hover:scale-110 transition-transform">
                <X size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className="text-secondary-foreground flex flex-col items-center">
            {isUploading ? (
              <span className="text-xs font-bold text-emerald-500 animate-pulse">Uploading...</span>
            ) : (
              <Camera size={32} className="text-emerald-500/70 opacity-80" />
            )}
          </div>
        )}
      </div>
      {!value && !isUploading && (
        <GlassButton 
          type="button" 
          variant="ghost" 
          className="text-xs px-4 py-2 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={16} className="mr-2 inline" /> Upload Photo
        </GlassButton>
      )}
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />
    </div>
  );
};
