cat << 'INNER_EOF' > src/pages/dashboard/enterprise/BackupRestore.tsx
import React, { useState } from 'react';
import { Database, Download, Upload, Shield, Loader2, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';
import { PageHeader } from '../../../components/common/PageHeader';
import { GlassCard } from '../../../components/common/GlassCard';
import { GlassButton } from '../../../components/common/GlassButton';

export const BackupRestore = () => {
  const { profile } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  if (profile?.role !== 'owner' && profile?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <Shield size={64} className="text-danger-500 mb-4 opacity-50" />
        <h2 className="text-2xl font-bold text-foreground">Access Restricted</h2>
        <p className="text-muted-foreground mt-2">Only administrators can access Backup & Restore functionality.</p>
      </div>
    );
  }

  const handleBackup = async () => {
    setLoading(true);
    addToast('Generating backup...', 'info');
    try {
      const response = await fetch('/api/backup');
      if (!response.ok) throw new Error('Backup failed');
      const data = await response.json();
      
      const backupMetadata = {
        metadata: {
          timestamp: new Date().toISOString(),
          version: '1.0',
          generator: 'Hazrat Aisha Academy Admin Panel',
          recordsCount: Object.keys(data).reduce((acc, key) => acc + (data[key]?.length || 0), 0)
        },
        data: data
      };
      
      const blob = new Blob([JSON.stringify(backupMetadata, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup_haa_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
      a.click();
      URL.revokeObjectURL(url);
      addToast('Backup created and downloaded successfully', 'success');
    } catch (error) {
      console.error(error);
      addToast('Failed to generate backup. Check server logs.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!window.confirm('WARNING: Restoring will overwrite existing data. Are you sure you want to proceed? It is highly recommended to take a backup first.')) {
      setFileInputKey(Date.now()); // Reset input
      return;
    }

    setRestoring(true);
    addToast('Parsing backup file...', 'info');
    
    try {
      const text = await file.text();
      let payload = JSON.parse(text);
      
      // Handle metadata wrapper if it exists
      if (payload.metadata && payload.data) {
        payload = payload.data;
      }
      
      addToast('Uploading and restoring data...', 'info');
      
      const response = await fetch('/api/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) throw new Error('Restore failed on server');
      
      const result = await response.json();
      if (result.success) {
        addToast('System restored successfully! Please refresh the page.', 'success');
      } else {
        throw new Error(result.error || 'Unknown error during restore');
      }
    } catch (error: any) {
      console.error(error);
      addToast(`Restore failed: ${error.message}`, 'danger');
    } finally {
      setRestoring(false);
      setFileInputKey(Date.now()); // Reset input
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Backup & Restore" description="Safeguard your school data or migrate to a new instance." />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-8 border-t-4 border-t-primary-500 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 text-primary-500/10 pointer-events-none">
            <Download size={150} />
          </div>
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Database className="text-primary-500" /> Export Backup
          </h3>
          <p className="text-muted-foreground mb-8">
            Create a complete, human-readable snapshot of your entire database including students, staff, results, and settings. Store this file securely.
          </p>
          <GlassButton variant="primary" onClick={handleBackup} disabled={loading || restoring} className="w-full flex items-center justify-center gap-2 py-3 text-lg font-semibold">
            {loading ? <Loader2 className="animate-spin" /> : <Download />} 
            {loading ? 'Generating Backup...' : 'Download Full Backup'}
          </GlassButton>
        </GlassCard>

        <GlassCard className="p-8 border-t-4 border-t-amber-500 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 text-amber-500/10 pointer-events-none">
            <Upload size={150} />
          </div>
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Shield className="text-amber-500" /> Restore System
          </h3>
          <p className="text-muted-foreground mb-8">
            Restore the system from a previously saved backup JSON file. <strong>Warning:</strong> This will overwrite existing data.
          </p>
          
          <div className="relative">
            <input 
              key={fileInputKey}
              type="file" 
              accept=".json" 
              onChange={handleRestore}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              disabled={loading || restoring}
            />
            <GlassButton variant="glass" className="w-full flex items-center justify-center gap-2 py-3 text-lg font-semibold border-amber-500/50 hover:bg-amber-500/10 text-amber-600 dark:text-amber-400">
              {restoring ? <Loader2 className="animate-spin" /> : <Upload />} 
              {restoring ? 'Restoring System...' : 'Select Backup File'}
            </GlassButton>
          </div>
        </GlassCard>
      </div>

      <div className="mt-8 p-6 bg-blue-500/10 border border-blue-500/30 rounded-2xl">
        <h4 className="flex items-center font-bold text-blue-600 dark:text-blue-400 mb-2">
          <CheckCircle2 className="mr-2" size={20} /> Best Practices
        </h4>
        <ul className="list-disc list-inside text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>Download backups at the end of each academic term.</li>
          <li>Never modify the backup JSON file manually unless you are an expert.</li>
          <li>Store backups in a secure, encrypted location.</li>
          <li>The restore process will recreate all collections exactly as they were.</li>
        </ul>
      </div>
    </div>
  );
};
INNER_EOF
