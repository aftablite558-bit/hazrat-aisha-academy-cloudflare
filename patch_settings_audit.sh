sed -i "/import { api }/a import { logAction } from '../../../services/auditService';\nimport { useAuth } from '../../../contexts/AuthContext';" src/pages/dashboard/enterprise/Settings.tsx
sed -i "/const { addToast }/a \  const { profile } = useAuth();" src/pages/dashboard/enterprise/Settings.tsx
sed -i "/addToast(\"Settings saved successfully.\", 'success');/a \      logAction('Edit', 'Settings', profile?.displayName || 'Admin', 'Updated system settings');" src/pages/dashboard/enterprise/Settings.tsx
