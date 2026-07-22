const fs = require('fs');
let file = 'src/pages/dashboard/enterprise/ProfileSettings.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/import { api } from '\.\.\/\.\.\/\.\.\/services\/apiClient';/, "import { api } from '../../../services/apiClient';\nimport { uploadImage } from '../../../services/storage';");

c = c.replace(/const \[savingPwd, setSavingPwd\] = useState\(false\);/, `const [savingPwd, setSavingPwd] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile?.uid) return;
    
    if (!file.type.startsWith('image/')) {
      addToast('Please upload a valid image file.', 'danger');
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      addToast('File size should not exceed 2MB.', 'danger');
      return;
    }
    
    setUploadingPhoto(true);
    try {
      const base64 = await uploadImage(file, 'profile');
      await api.post(\`/collection/users/\${profile.uid}/update\`, { photoUrl: base64 });
      
      const updatedUser = { 
        ...profile, 
        id: profile.uid, 
        email: profile.email || '', 
        photoUrl: base64,
        role: profile.role
      };
      loginUser(updatedUser);
      addToast('Profile photo updated successfully', 'success');
    } catch (err) {
      addToast('Failed to update profile photo', 'danger');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!profile?.uid) return;
    
    try {
      await api.post(\`/collection/users/\${profile.uid}/update\`, { photoUrl: null });
      const updatedUser = { 
        ...profile, 
        id: profile.uid, 
        email: profile.email || '', 
        photoUrl: undefined,
        role: profile.role
      };
      loginUser(updatedUser);
      addToast('Profile photo removed', 'success');
    } catch (err) {
      addToast('Failed to remove profile photo', 'danger');
    }
  };`);

c = c.replace(/<div className="relative group cursor-pointer mb-4">/, `<div className="relative group cursor-pointer mb-4" onClick={() => document.getElementById('profile-photo-upload')?.click()}>`);

c = c.replace(/<div className="absolute inset-0 bg-black\/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">/, `<div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                {uploadingPhoto ? (
                  <span className="text-xs font-medium">Uploading...</span>
                ) : (
                  <>
                    <Camera size={24} className="mb-1" />
                    <span className="text-[10px] font-medium">Change Photo</span>
                  </>
                )}
              </div>
              <input type="file" id="profile-photo-upload" className="hidden" accept=".jpg,.jpeg,.png,.svg" onChange={handlePhotoUpload} disabled={uploadingPhoto} />`);

c = c.replace(/<h3 className="text-xl font-bold text-foreground">/, `{profile?.photoUrl && (
              <button 
                type="button"
                className="text-xs text-danger-500 hover:text-danger-400 mb-4 transition-colors"
                onClick={handleRemovePhoto}
              >
                Remove Photo
              </button>
            )}
            <h3 className="text-xl font-bold text-foreground">`);

fs.writeFileSync(file, c);
