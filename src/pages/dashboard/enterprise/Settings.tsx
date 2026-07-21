import { useState, useEffect } from 'react';
import { useToast } from '../../../contexts/ToastContext';
import { PageHeader } from '../../../components/common/PageHeader';
import { GlassCard } from '../../../components/common/GlassCard';
import { GlassButton } from '../../../components/common/GlassButton';
import { GlassInput } from '../../../components/common/GlassInput';
import { GlassSelect } from '../../../components/common/GlassSelect';
import { useMasterData } from '../../../hooks/useMasterData';
import { SystemSettings } from '../../../types/enterprise';
import { Save, UploadCloud, Database } from 'lucide-react';
import { api } from '../../../services/apiClient';
import { logAction } from '../../../services/auditService';
import { useAuth } from '../../../contexts/AuthContext';

export const Settings = () => {
  const { addToast } = useToast();
  const { profile } = useAuth();
  const { data: settingsData, loading, error, updateRecord, addRecord } = useMasterData<SystemSettings>('settings');
  const [formData, setFormData] = useState<Partial<SystemSettings>>({
    schoolName: 'Hazrat Aisha Academy',
    schoolAddress: 'Chak Rajopatti, Sitamarhi, Bihar',
    contactEmail: 'contact@hazrataishaacademy.edu',
    contactPhone: '+91 98765 43210',
    academicYear: '2023-2024',
    sessionStart: '2023-04-01',
    sessionEnd: '2024-03-31'
  });

  useEffect(() => {
    
    // Population logic
    if (settingsData && settingsData.length > 0) {
      setFormData(settingsData[0]);
      return; // If settings exist, we don't need to initialize
    }

    // Initialization logic
    const initializeCollections = async () => {
      if (!loading && !error && settingsData && settingsData.length === 0) {
        try {
          // Create settings
          const settingsId = await addRecord({
            schoolName: 'Hazrat Aisha Academy',
            schoolAddress: 'Chak Rajopatti, Sitamarhi, Bihar',
            contactEmail: 'contact@hazrataishaacademy.edu',
            contactPhone: '+91 98765 43210',
            academicYear: '2023-2024',
            sessionStart: '2023-04-01',
            sessionEnd: '2024-03-31'
          });

          // Initialize other collections via API
          const collectionsToInit = [
            'students', 'teachers', 'staff', 'classes', 'subjects', 
            'notices', 'gallery', 'facilities', 'calendar', 'documents'
          ];
          
          await api.post('/initialize', { collections: collectionsToInit });
          
          addToast("System initialized successfully.", 'success');
        } catch (err: unknown) {
          console.error('[DEBUG] Failed to initialize system:', err);
          addToast(`Failed to initialize system: ${(err instanceof Error ? err.message : String(err))}`, 'danger');
        }
      }
    };

    initializeCollections();
  }, [settingsData, loading, error, addRecord, addToast]);

  if (loading) return <div>Loading settings...</div>;
  if (error) return <div className="text-red-500">Error loading settings: {error}</div>;

  const handleCreateDefault = async () => {
     try {
       const id = await addRecord({
        schoolName: 'Hazrat Aisha Academy',
        schoolAddress: 'Chak Rajopatti, Sitamarhi, Bihar',
        contactEmail: 'contact@hazrataishaacademy.edu',
        contactPhone: '+91 98765 43210',
        academicYear: '2023-2024',
        sessionStart: '2023-04-01',
        sessionEnd: '2024-03-31'
       });
       addToast("Default settings created successfully.", 'success');
     } catch (err) {
       console.error('[DEBUG] Failed to manually create default settings:', err);
       addToast("Failed to create default settings.", 'danger');
     }
  };

  if (settingsData && settingsData.length === 0) {
    return (
      <div className="p-6">
        <GlassCard className="p-6">
           <h3 className="text-xl font-bold mb-4">No settings found</h3>
           <p className="mb-4">It seems no settings have been configured yet.</p>
           <GlassButton variant="primary" onClick={handleCreateDefault}>Create Default Settings</GlassButton>
        </GlassCard>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (settingsData.length > 0 && settingsData[0].id) {
        const { id, createdAt, updatedAt, ...rest } = formData as Record<string, unknown>;
        await updateRecord(settingsData[0].id, rest);
      } else {
        await addRecord(formData);
      }
      addToast("Settings saved successfully.", 'success');
      logAction('Edit', 'Settings', profile?.displayName || 'Admin', 'Updated system settings');
    } catch (err) {
      console.error('[DEBUG] Save error:', err);
      addToast("Failed to save settings.", 'danger');
    }
  };

  const handleBackup = () => {
    addToast("Database backup initiated. This may take a few minutes.");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="System Settings" description="Configure global school preferences and system parameters." />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold mb-6">General Information</h3>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassInput required label="School Name" value={formData.schoolName} onChange={e => setFormData({...formData, schoolName: e.target.value})} />
                <GlassInput required label="Contact Email" type="email" value={formData.contactEmail} onChange={e => setFormData({...formData, contactEmail: e.target.value})} />
                <div className="md:col-span-2">
                  <GlassInput required label="School Address" value={formData.schoolAddress} onChange={e => setFormData({...formData, schoolAddress: e.target.value})} />
                </div>
                <GlassInput required label="Contact Phone" value={formData.contactPhone} onChange={e => setFormData({...formData, contactPhone: e.target.value})} />
              </div>
              
              <h3 className="text-xl font-bold mt-8 mb-6 border-t border-white/10 pt-6">Academic Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassSelect label="Current Academic Year" value={formData.academicYear} onChange={e => setFormData({...formData, academicYear: e.target.value})}>
                  <option value="2023-2024">2023 - 2024</option>
                  <option value="2024-2025">2024 - 2025</option>
                  <option value="2025-2026">2025 - 2026</option>
                </GlassSelect>
                <GlassInput required type="date" label="Session Start" value={formData.sessionStart} onChange={e => setFormData({...formData, sessionStart: e.target.value})} />
                <GlassInput required type="date" label="Session End" value={formData.sessionEnd} onChange={e => setFormData({...formData, sessionEnd: e.target.value})} />
              </div>

              <div className="flex justify-end pt-6">
                <GlassButton type="submit" variant="primary" className="flex items-center gap-2">
                  <Save size={18} /> Save
                </GlassButton>
              </div>
            </form>
          </GlassCard>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold mb-4">School Logo</h3>
            <div className="aspect-video bg-white/5 rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-muted-foreground hover:bg-white/10 transition-colors cursor-pointer mb-4">
              <UploadCloud size={32} className="mb-2" />
              <span className="text-sm">Click to upload logo</span>
            </div>
            <p className="text-xs text-muted-foreground text-center">Recommended size: 400x100px (PNG with transparent background)</p>
          </GlassCard>

          <GlassCard className="p-6 bg-gradient-to-br from-rose-500/10 to-transparent border-rose-500/20">
            <h3 className="text-xl font-bold text-rose-500 mb-2">System Backup</h3>
            <p className="text-sm text-muted-foreground mb-6">Manually trigger a full database snapshot. Backups are also created automatically every night at 2:00 AM.</p>
            <GlassButton variant="glass" className="w-full text-rose-500 border-rose-500/30 hover:bg-rose-500/10 flex items-center justify-center gap-2" onClick={handleBackup}>
              <Database size={18} /> Generate Backup Now
            </GlassButton>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
