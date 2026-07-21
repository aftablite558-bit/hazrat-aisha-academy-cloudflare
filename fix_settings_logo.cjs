const fs = require('fs');
let file = 'src/pages/dashboard/enterprise/Settings.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/import { Save, UploadCloud, Database } from 'lucide-react';/, "import { Save, UploadCloud, Database, X } from 'lucide-react';\nimport { uploadImage } from '../../../services/storage';");

c = c.replace(/const handleSave = async \(e: React.FormEvent\) => \{/, `const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      addToast('Please upload a valid image file.', 'danger');
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      addToast('File size should not exceed 2MB.', 'danger');
      return;
    }
    
    try {
      const base64 = await uploadImage(file, 'logo');
      setFormData(prev => ({ ...prev, logoUrl: base64 }));
      addToast('Logo uploaded successfully. Click Save to persist.', 'success');
    } catch (err) {
      addToast('Failed to upload logo.', 'danger');
    }
  };

  const handleSave = async (e: React.FormEvent) => {`);

c = c.replace(/<div className="aspect-video bg-white\/5 rounded-xl border-2 border-dashed border-white\/20 flex flex-col items-center justify-center text-muted-foreground hover:bg-white\/10 transition-colors cursor-pointer mb-4">/, `<div className="aspect-video relative bg-white/5 rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-muted-foreground hover:bg-white/10 transition-colors cursor-pointer mb-4 overflow-hidden" onClick={() => document.getElementById('logo-upload')?.click()}>
              {formData.logoUrl ? (
                <>
                  <img src={formData.logoUrl} alt="School Logo" className="w-full h-full object-contain p-2" />
                  <button type="button" className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-red-500/80 transition-colors" onClick={(e) => { e.stopPropagation(); setFormData(prev => ({ ...prev, logoUrl: undefined })); }}>
                    <X size={16} />
                  </button>
                </>
              ) : (
                <>
                  <UploadCloud size={32} className="mb-2" />
                  <span className="text-sm">Click to upload logo</span>
                </>
              )}
              <input type="file" id="logo-upload" className="hidden" accept=".jpg,.jpeg,.png,.svg" onChange={handleLogoUpload} />`);

fs.writeFileSync(file, c);
