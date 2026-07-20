import { api } from './apiClient';
import { AuditLog } from '../types/audit';

export const logAction = async (logData: Omit<AuditLog, 'timestamp'>) => {
  try {
    await api.post('/collection/audit_logs', {
      ...logData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to log action:', error);
  }
};
